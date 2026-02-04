import { useState, useEffect } from 'react'
import './App.css'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import Profile from './components/Profile'

function App() {
  const [currentPage, setCurrentPage] = useState('login')
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    if (token) {
      setCurrentPage('dashboard')
    }
  }, [token])

  const handleLoginSuccess = (userData, authToken) => {
    setUser(userData)
    setToken(authToken)
    localStorage.setItem('token', authToken)
    localStorage.setItem('user', JSON.stringify(userData))
    setCurrentPage('dashboard')
  }

  const handleRegisterSuccess = () => {
    setCurrentPage('login')
  }

  const handleLogout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setCurrentPage('login')
  }

  const handleGoToLogin = () => {
    setCurrentPage('login')
  }

  const handleGoToRegister = () => {
    setCurrentPage('register')
  }

  const handleGoToProfile = () => {
    setCurrentPage('profile')
  }

  const handleBackToDashboard = () => {
    setCurrentPage('dashboard')
  }

  return (
    <div className="app">
      {currentPage === 'login' && (
        <Login onLoginSuccess={handleLoginSuccess} onGoToRegister={handleGoToRegister} />
      )}
      {currentPage === 'register' && (
        <Register onRegisterSuccess={handleRegisterSuccess} onGoToLogin={handleGoToLogin} />
      )}
      {currentPage === 'dashboard' && (
        <Dashboard user={user} token={token} onLogout={handleLogout} onViewProfile={handleGoToProfile} />
      )}
      {currentPage === 'profile' && (
        <Profile user={user} token={token} onBack={handleBackToDashboard} />
      )}
    </div>
  )
}

export default App
