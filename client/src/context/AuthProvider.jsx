import { useEffect, useState } from 'react'
import AuthContext from './AuthContext'

async function readJson(response) {
    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong.')
    }

    return data
}

function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [isCheckingAuth, setIsCheckingAuth] = useState(true)

    useEffect(() => {
        fetch('/api/auth/me', { credentials: 'include' })
            .then(readJson)
            .then((data) => setUser(data.user))
            .catch(() => setUser(null))
            .finally(() => setIsCheckingAuth(false))
    }, [])

    async function sendCredentials(path, formData) {
        const response = await fetch(path, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(formData),
        })
        const data = await readJson(response)

        setUser(data.user)
        return data.user
    }

    function register(formData) {
        return sendCredentials('/api/auth/register', formData)
    }

    function login(formData) {
        return sendCredentials('/api/auth/login', formData)
    }

    async function logout() {
        await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
        })
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, isCheckingAuth, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider
