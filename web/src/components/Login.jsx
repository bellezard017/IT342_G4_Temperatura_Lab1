import { useState } from 'react'
import { authAPI } from '../utils/api'

export default function Login({ onLoginSuccess, onGoToRegister }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!username || !password) {
        throw new Error('Please fill in all fields')
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters')
      }

      const response = await authAPI.login({
        username: username,
        password: password,
      })

      if (response && response.token) {
        // Store complete user data
        const userData = {
          username: response.username || username,
          email: response.email || '',
          fullname: response.fullname || '',
        }
        onLoginSuccess(userData, response.token)
      } else {
        throw new Error('Login failed: No token received')
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <h1>Login</h1>
      <p>Sign in to your account</p>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div className="toggle-link">
        <p>
          Don't have an account?{' '}
          <button onClick={onGoToRegister} disabled={loading}>
            Register
          </button>
        </p>
      </div>
    </div>
  )
}
