const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

// Helper function to make API calls
const apiCall = async (endpoint, method = 'GET', data = null, token = null) => {
  const headers = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const options = {
    method,
    headers,
    mode: 'cors',
    credentials: 'include',
  }

  if (data) {
    options.body = JSON.stringify(data)
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options)
    
    let errorData = {}
    try {
      errorData = await response.clone().json()
    } catch (e) {
      // Response might not be JSON
    }

    if (!response.ok) {
      const errorMessage = errorData.message || errorData.error || `API Error: ${response.status}`
      throw new Error(errorMessage)
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error(`API Call Error (${method} ${endpoint}):`, error)
    throw error
  }
}

// Auth API calls
export const authAPI = {
  register: (userData) => {
    return apiCall('/auth/register', 'POST', userData)
  },

  login: (credentials) => {
    return apiCall('/auth/login', 'POST', credentials)
  },

  dashboard: (username, token) => {
    return apiCall(`/auth/dashboard/${username}`, 'GET', null, token)
  },

  logout: (token) => {
    return apiCall('/auth/logout', 'POST', null, token)
  },
  profile: (username, token) => {
    return apiCall(`/auth/profile/${username}`, 'GET', null, token)
  },
}

export default authAPI
