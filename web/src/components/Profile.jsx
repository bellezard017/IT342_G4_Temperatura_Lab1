import { useEffect, useState } from 'react'
import { authAPI } from '../utils/api'

export default function Profile({ user, token, onBack }) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const storedUser = localStorage.getItem('user')
        const userData = storedUser ? JSON.parse(storedUser) : user
        if (!userData || !userData.username) throw new Error('User not found')
        const res = await authAPI.profile(userData.username, token)
        setProfile(res)
      } catch (err) {
        setError(err.message || 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [user, token])

  if (loading) return <div className="auth-container"><p>Loading profile...</p></div>

  if (error) return <div className="auth-container"><div className="error-message">{error}</div></div>

  return (
    <div className="auth-container">
      <h1>Profile</h1>
      {profile && (
        <div className="user-info">
          <p><strong>Username:</strong> {profile.username}</p>
          <p><strong>Full Name:</strong> {profile.fullname}</p>
          <p><strong>Email:</strong> {profile.email}</p>
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        <button className="btn btn-secondary" onClick={onBack}>Back</button>
      </div>
    </div>
  )
}
