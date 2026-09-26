

import './App.css'
import Header from './components/Header'
import HeroSlider from './components/HeroSlider'
import FeaturesSection from './components/FeaturesSection'
import HowItWorksSection from './components/HowItWorksSection'
import SecuritySection from './components/SecuritySection'
import CallToActionSection from './components/CallToActionSection'
import Footer from './components/Footer'
import Dashboard from './components/Dashboard'
import Transactions from './components/Transactions'
import Budgets from './components/Budgets'
import Reports from './components/Reports'
import AuthPage from './components/AuthPage'
import ProtectedRoute from './components/ProtectedRoute'
import { Routes, Route } from 'react-router'

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <main id="home">
              <HeroSlider />
              <FeaturesSection />
              <HowItWorksSection />
              <SecuritySection />
              <CallToActionSection />
            </main>
          }
        />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
        <Route path="/budgets" element={<ProtectedRoute><Budgets /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
        <Route path="/signin" element={<AuthPage mode="login" />} />
        <Route path="/create-account" element={<AuthPage mode="register" />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
