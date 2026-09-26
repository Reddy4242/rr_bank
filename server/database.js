import { createClient } from '@libsql/client'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import demoTransactions from './data/demoTransactions.js'

const serverDirectory = path.dirname(fileURLToPath(import.meta.url))
const localDatabasePath = path.join(serverDirectory, 'data', 'rr-bank.db')
const databaseUrl = process.env.TURSO_DATABASE_URL || pathToFileURL(localDatabasePath).href

const database = createClient({
    url: databaseUrl,
    authToken: process.env.TURSO_AUTH_TOKEN,
    intMode: 'number',
})

await database.executeMultiple(`
    CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        date TEXT NOT NULL,
        amount TEXT NOT NULL,
        type TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS sessions (
        token_hash TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL,
        expires_at INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
`)

for (const transaction of demoTransactions) {
    await database.execute({
        sql: `
            INSERT INTO transactions (name, category, date, amount, type)
            SELECT ?, ?, ?, ?, ?
            WHERE NOT EXISTS (
                SELECT 1
                FROM transactions
                WHERE name = ? AND date = ? AND amount = ?
            )
        `,
        args: [
            transaction.name,
            transaction.category,
            transaction.date,
            transaction.amount,
            transaction.type,
            transaction.name,
            transaction.date,
            transaction.amount,
        ],
    })
}

export default database
