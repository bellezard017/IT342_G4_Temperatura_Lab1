const API_BASE_URL = 'http://localhost:8080/api'

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
  }

  if (data) {
    options.body = JSON.stringify(data)
  }

  try {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`
    console.log(`API Call: ${method} ${url}`)
    
    const response = await fetch(url, options)
    
    let responseData = null
    const contentType = response.headers.get('content-type')
    
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json()
    } else {
      const text = await response.text()
      responseData = text ? { message: text } : {}
    }

    if (!response.ok) {
      const errorMessage = responseData.message || responseData.error || `API Error: ${response.status}`
      throw new Error(errorMessage)
    }

    console.log(`API Response: ${method} ${url}`, responseData)
    return responseData
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