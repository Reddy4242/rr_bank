import express from 'express'
import budgetItems from './data/demoBudgets.js'
import demoReport from './data/demoReports.js'
import database from './database.js'
import { createHash, randomBytes } from 'node:crypto'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { hashPassword, verifyPassword } from './password.js'

const app = express()
app.use(express.json())
const port = Number(process.env.PORT) || 3000
const serverDirectory = path.dirname(fileURLToPath(import.meta.url))
const clientDistPath = path.resolve(serverDirectory, '../client/dist')
const sessionCookieName = 'rr_bank_session'
const sessionLength = 7 * 24 * 60 * 60 * 1000

function getCookie(request, name) {
    const cookieHeader = request.headers.cookie

    if (!cookieHeader) {
        return null
    }

    for (const cookie of cookieHeader.split(';')) {
        const [cookieName, ...valueParts] = cookie.trim().split('=')

        if (cookieName === name) {
            return decodeURIComponent(valueParts.join('='))
        }
    }

    return null
}

function hashSessionToken(token) {
    return createHash('sha256').update(token).digest('hex')
}

async function createSession(userId, response) {
    const token = randomBytes(32).toString('hex')
    const tokenHash = hashSessionToken(token)
    const expiresAt = Date.now() + sessionLength

    await database.execute({
        sql: `
            INSERT INTO sessions (token_hash, user_id, expires_at)
            VALUES (?, ?, ?)
        `,
        args: [tokenHash, userId, expiresAt],
    })

    response.cookie(sessionCookieName, token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: sessionLength,
    })
}

async function getCurrentUser(request) {
    const token = getCookie(request, sessionCookieName)

    if (!token) {
        return null
    }

    const tokenHash = hashSessionToken(token)
    const sessionResult = await database.execute({
        sql: `
            SELECT users.id, users.name, users.email, sessions.expires_at
            FROM sessions
            JOIN users ON users.id = sessions.user_id
            WHERE sessions.token_hash = ?
        `,
        args: [tokenHash],
    })
    const session = sessionResult.rows[0]

    if (!session || session.expires_at <= Date.now()) {
        if (session) {
            await database.execute({
                sql: 'DELETE FROM sessions WHERE token_hash = ?',
                args: [tokenHash],
            })
        }

        return null
    }

    return { id: session.id, name: session.name, email: session.email }
}

async function requireUser(request, response, next) {
    const user = await getCurrentUser(request)

    if (!user) {
        return response.status(401).json({ message: 'Please sign in to continue.' })
    }

    request.user = user
    return next()
}

app.get('/api/health', (request, response) => {
    response.send('RR Bank server is working')
})

app.post('/api/auth/register', async (request, response) => {
    const name = request.body.name?.trim()
    const email = request.body.email?.trim().toLowerCase()
    const password = request.body.password

    if (!name || !email || !password) {
        return response.status(400).json({ message: 'Name, email, and password are required.' })
    }

    if (password.length < 8) {
        return response.status(400).json({ message: 'Password must be at least 8 characters.' })
    }

    const existingUserResult = await database.execute({
        sql: 'SELECT id FROM users WHERE email = ?',
        args: [email],
    })
    const existingUser = existingUserResult.rows[0]

    if (existingUser) {
        return response.status(409).json({ message: 'An account with this email already exists.' })
    }

    const passwordHash = await hashPassword(password)
    const result = await database.execute({
        sql: `
            INSERT INTO users (name, email, password_hash)
            VALUES (?, ?, ?)
        `,
        args: [name, email, passwordHash],
    })

    const user = { id: Number(result.lastInsertRowid), name, email }
    await createSession(user.id, response)

    return response.status(201).json({ user })
})

app.post('/api/auth/login', async (request, response) => {
    const email = request.body.email?.trim().toLowerCase()
    const password = request.body.password

    if (!email || !password) {
        return response.status(400).json({ message: 'Email and password are required.' })
    }

    const userResult = await database.execute({
        sql: 'SELECT * FROM users WHERE email = ?',
        args: [email],
    })
    const userRecord = userResult.rows[0]

    if (!userRecord || !(await verifyPassword(password, userRecord.password_hash))) {
        return response.status(401).json({ message: 'Email or password is incorrect.' })
    }

    await database.execute({
        sql: 'DELETE FROM sessions WHERE expires_at <= ?',
        args: [Date.now()],
    })
    await createSession(userRecord.id, response)

    return response.json({
        user: { id: userRecord.id, name: userRecord.name, email: userRecord.email },
    })
})

app.get('/api/auth/me', async (request, response) => {
    return response.json({ user: await getCurrentUser(request) })
})

app.post('/api/auth/logout', async (request, response) => {
    const token = getCookie(request, sessionCookieName)

    if (token) {
        await database.execute({
            sql: 'DELETE FROM sessions WHERE token_hash = ?',
            args: [hashSessionToken(token)],
        })
    }

    response.clearCookie(sessionCookieName, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
    })

    return response.status(204).end()
})


app.get('/api/transactions', requireUser, async (request, response) => {
    const result = await database.execute('SELECT * FROM transactions ORDER BY id DESC')
    response.json(result.rows)
})


app.post('/api/transactions', requireUser, async (request, response) => {
    const newTransaction = request.body

    if (!newTransaction.name || !newTransaction.category || !newTransaction.date ||
        !newTransaction.amount || !['expense', 'income'].includes(newTransaction.type)) {
        return response.status(400).json({ message: 'All transaction fields are required.' })
    }

    const result = await database.execute({
        sql: `
            INSERT INTO transactions (name, category, date, amount, type)
            VALUES (?, ?, ?, ?, ?)
        `,
        args: [
            newTransaction.name,
            newTransaction.category,
            newTransaction.date,
            newTransaction.amount,
            newTransaction.type,
        ],
    })

    newTransaction.id = String(result.lastInsertRowid)

    return response.status(201).json(newTransaction)
})



app.get('/api/budgets', requireUser, (request, response) => {
    response.json(budgetItems)
})


app.get('/api/reports', requireUser, (request, response) => {
    response.json(demoReport)
})


if (process.env.NODE_ENV === 'production') {
    app.use(express.static(clientDistPath))
    app.get(/^(?!\/api(?:\/|$)).*/, (request, response) => {
        response.sendFile(path.join(clientDistPath, 'index.html'))
    })
} else {
    app.get('/', (request, response) => {
        response.send('RR Bank server is working')
    })
}

app.listen(port, '0.0.0.0', (error) => {
    if (error) {
        console.error('Unable to start RR Bank server:', error)
        process.exitCode = 1
        return
    }

    console.log(`RR Bank server is running at http://localhost:${port}`)
})
