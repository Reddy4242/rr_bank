import { Navigate } from 'react-router'
import useAuth from '../context/useAuth'

function ProtectedRoute({ children }) {
    const { user, isCheckingAuth } = useAuth()

    if (isCheckingAuth) {
        return <main className="route-status">Checking your account...</main>
    }

    if (!user) {
        return <Navigate to="/signin" replace />
    }

    return children
}

export default ProtectedRoute
