import { useState } from 'react'
import { authAPI } from '../utils/api'

export default function Register({ onRegisterSuccess, onGoToLogin }) {
  const [fullname, setFullname] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (!fullname || !username || !email || !password || !confirmPassword) {
        throw new Error('Please fill in all fields')
      }

      if (password !== confirmPassword) {
        throw new Error('Passwords do not match')
      }

      // Email validation
      const emailRegex = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$/
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address')
      }

      // Password validation: min 8, upper, lower, digit, special
      const pwd = password
      if (pwd.length < 8) throw new Error('Password must be at least 8 characters long')
      if (!/[A-Z]/.test(pwd)) throw new Error('Password must include at least one uppercase letter')
      if (!/[a-z]/.test(pwd)) throw new Error('Password must include at least one lowercase letter')
      if (!/[0-9]/.test(pwd)) throw new Error('Password must include at least one digit')
      if (!/[^A-Za-z0-9]/.test(pwd)) throw new Error('Password must include at least one special character')

      const response = await authAPI.register({
        fullname: fullname,
        username: username,
        email: email,
        password: password,
      })

      setSuccess('Registration successful! Redirecting to login...')
      setFullname('')
      setUsername('')
      setEmail('')
      setPassword('')
      setConfirmPassword('')

      setTimeout(() => {
        onRegisterSuccess()
      }, 1500)
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <h1>Register</h1>
      <p>Create a new account</p>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="fullname">Full Name</label>
          <input
            id="fullname"
            type="text"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            placeholder="Enter your full name"
            disabled={loading}
          />
        </div>

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
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
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

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <div className="toggle-link">
        <p>
          Already have an account?{' '}
          <button onClick={onGoToLogin} disabled={loading}>
            Login
          </button>
        </p>
      </div>
    </div>
  )
}
