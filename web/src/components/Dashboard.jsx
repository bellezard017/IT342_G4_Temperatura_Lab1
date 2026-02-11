import { useState, useEffect } from 'react'
import { authAPI } from '../utils/api'

export default function Dashboard({ user, token, onLogout, onViewProfile }) {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const storedUser = localStorage.getItem('user')
        const userData = storedUser ? JSON.parse(storedUser) : user

        if (!userData || !userData.username) {
          throw new Error('User data not found')
        }

        const data = await authAPI.dashboard(userData.username, token)
        setDashboardData(data)
      } catch (err) {
        setError(err.message || 'Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [user, token])

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

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <button className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {userData && (
        <div className="user-info">
          <p>
            <strong>Welcome,</strong> {userData.fullname || userData.username}!
          </p>
          <p>
            <strong>Email:</strong> {userData.email}
          </p>
          <p>
            <strong>Username:</strong> {userData.username}
          </p>
        </div>
      )}

      {dashboardData && (
        <div className="user-info">
          <h2 style={{ color: '#e94560', marginBottom: '15px' }}>Dashboard Info</h2>
          <p>
            <strong>Message:</strong> {dashboardData.message || 'Welcome to your dashboard'}
          </p>
          {dashboardData.username && (
            <p>
              <strong>Active User:</strong> {dashboardData.username}
            </p>
          )}
          {dashboardData.timestamp && (
            <p>
              <strong>Last Login:</strong> {new Date(dashboardData.timestamp).toLocaleString()}
            </p>
          )}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '20px' }}>
        <button className="btn btn-secondary" onClick={() => onViewProfile && onViewProfile()}>
          View Profile
        </button>
      </div>
    </div>
  )
}
