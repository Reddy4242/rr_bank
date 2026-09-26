
import { useState } from "react"
import rrBankLogo from '../assets/rr-bank-logo.png'
import { Link } from 'react-router'
import useAuth from '../context/useAuth'

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const { user, isCheckingAuth, logout } = useAuth()

    async function handleLogout() {
        await logout()
        setIsMenuOpen(false)
    }
    return (
        <header className="site-header">

            <Link to="/" className="brand" aria-label="RR Bank home">
                <img src={rrBankLogo} className="brand-logo" alt="" />
                <span className="brand-copy"><strong>RR Bank</strong><small>Money, made clear.</small></span>
            </Link>
            <nav id="primary-navigation"
                className={
                    isMenuOpen
                        ? "mobile-navigation mobile-navigation-open"
                        : "mobile-navigation"
                }
                aria-label="Primary navigation">
                <ul className="nav-links" onClick={() => setIsMenuOpen(false)}>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/dashboard">Dashboard</Link></li>
                    <li><Link to="/transactions">Transactions</Link></li>
                    <li><Link to="/budgets">Budgets</Link></li>
                    <li><Link to="/reports">Reports</Link></li>
                </ul>
                <div className="mobile-auth-actions">
                    {!isCheckingAuth && (user ? (
                        <>
                            <span>Hi, {user.name}</span>
                            <button type="button" className="button button-secondary" onClick={handleLogout}>Sign out</button>
                        </>
                    ) : (
                        <>
                            <Link to="/signin" className="button button-secondary" onClick={() => setIsMenuOpen(false)}>Sign in</Link>
                            <Link to="/create-account" className="button button-primary" onClick={() => setIsMenuOpen(false)}>Create account</Link>
                        </>
                    ))}
                </div>
            </nav>
            <div className="header-actions">
                {!isCheckingAuth && (user ? (
                    <>
                        <span className="header-user">Hi, {user.name}</span>
                        <button type="button" className="button button-secondary" onClick={handleLogout}>Sign out</button>
                    </>
                ) : (
                    <>
                        <Link to="/signin" className="button button-secondary">Sign in</Link>
                        <Link to="/create-account" className="button button-primary">Create account</Link>
                    </>
                ))}
            </div>

            <button type="button" className="menu-toggle" aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"} onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-expanded={isMenuOpen} aria-controls="primary-navigation">
                <span></span>
                <span></span>
                <span></span>
            </button>

        </header>


    )
}

export default Header
