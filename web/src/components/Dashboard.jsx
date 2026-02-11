import { useState, useEffect } from 'react'
import { authAPI } from '../utils/api'

export default function Dashboard({ user, token, onLogout, onViewProfile }) {
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    try {
      await authAPI.logout(token)
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      onLogout()
    }
  }

  const storedUser = localStorage.getItem('user')
  const userData = storedUser ? JSON.parse(storedUser) : user

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <button className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {userData && (
        <div className="user-info" style={{ textAlign: 'center', padding: '2rem' }}>
          <h2 style={{ 
            fontSize: '2rem', 
            fontWeight: '700', 
            marginBottom: '0.5rem',
            color: '#1b4332',
            fontFamily: 'var(--font-heading)'
          }}>
            Welcome, {userData.fullname || userData.username}!
          </h2>
          <p style={{
            fontSize: '0.9rem',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-mono)',
            marginBottom: '2rem'
          }}>
            this is your dashboard
          </p>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
        <button className="btn btn-primary" onClick={() => onViewProfile && onViewProfile()}>
          View Profile
        </button>
      </div>
    </div>
  )
}