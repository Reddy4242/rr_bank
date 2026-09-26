import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import useAuth from '../context/useAuth'

function AuthPage({ mode }) {
    const isCreatingAccount = mode === 'register'
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { register, login } = useAuth()
    const navigate = useNavigate()

    async function handleSubmit(event) {
        event.preventDefault()
        setError('')
        setIsSubmitting(true)

        try {
            if (isCreatingAccount) {
                await register({ name, email, password })
            } else {
                await login({ email, password })
            }

            navigate('/dashboard')
        } catch (requestError) {
            setError(requestError.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <main className="auth-page">
            <section className="auth-card" aria-labelledby="auth-title">
                <p className="auth-eyebrow">RR BANK DEMO</p>
                <h1 id="auth-title">
                    {isCreatingAccount ? 'Create your account' : 'Welcome back'}
                </h1>
                <p className="auth-description">
                    {isCreatingAccount
                        ? 'Create a local demonstration account to explore RR Bank.'
                        : 'Sign in to your local RR Bank demonstration account.'}
                </p>

                <form className="auth-form" onSubmit={handleSubmit}>
                    {isCreatingAccount && (
                        <div className="auth-field">
                            <label htmlFor="auth-name">Name</label>
                            <input
                                id="auth-name"
                                type="text"
                                autoComplete="name"
                                required
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                            />
                        </div>
                    )}

                    <div className="auth-field">
                        <label htmlFor="auth-email">Email</label>
                        <input
                            id="auth-email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                    </div>

                    <div className="auth-field">
                        <label htmlFor="auth-password">Password</label>
                        <input
                            id="auth-password"
                            type="password"
                            autoComplete={isCreatingAccount ? 'new-password' : 'current-password'}
                            minLength="8"
                            required
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                        />
                        {isCreatingAccount && <small>Use at least 8 characters.</small>}
                    </div>

                    {error && <p className="auth-error" role="alert">{error}</p>}

                    <button className="button button-primary auth-submit" type="submit" disabled={isSubmitting}>
                        {isSubmitting
                            ? 'Please wait...'
                            : isCreatingAccount ? 'Create account' : 'Sign in'}
                    </button>
                </form>

                <p className="auth-switch">
                    {isCreatingAccount ? 'Already have an account?' : 'New to RR Bank?'}{' '}
                    <Link to={isCreatingAccount ? '/signin' : '/create-account'}>
                        {isCreatingAccount ? 'Sign in' : 'Create an account'}
                    </Link>
                </p>
            </section>
        </main>
    )
}

export default AuthPage
