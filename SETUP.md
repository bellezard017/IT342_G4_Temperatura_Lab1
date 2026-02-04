# Temperature Lab System - Complete Setup Guide

## ✅ System Status

### Backend (Spring Boot)
- **Port:** 8080
- **URL:** http://localhost:8080
- **Database:** H2 In-Memory
- **Status:** ✅ Running

### Frontend (React + Vite)
- **Port:** 5173
- **URL:** http://localhost:5173
- **Status:** ✅ Running

---

## 📋 Features Implemented

### Authentication System
- ✅ User Registration
- ✅ User Login
- ✅ JWT Token Management
- ✅ User Dashboard
- ✅ Logout Functionality

### Database
- ✅ H2 In-Memory Database (auto-creates on startup)
- ✅ User table with full schema
- ✅ Data persistence during session

### Frontend Components
1. **Login Component** (`src/components/Login.jsx`)
   - Username & password authentication
   - Form validation
   - Error handling
   - Links to register page

2. **Register Component** (`src/components/Register.jsx`)
   - User registration form
   - Password confirmation
   - Form validation
   - Auto-redirect to login on success

3. **Dashboard Component** (`src/components/Dashboard.jsx`)
   - User profile display
   - Dashboard information
   - Logout functionality

### API Integration
- Fully connected frontend to backend
- CORS enabled on backend
- Proper error handling
- Token-based authentication

---

## 🚀 How to Run

### Terminal 1: Start Backend
```bash
cd c:\Users\Admin\IT342_G4_Temperatura_Lab1\backend
cmd /c "mvnw.cmd spring-boot:run"
```

### Terminal 2: Start Frontend
```bash
cd c:\Users\Admin\IT342_G4_Temperatura_Lab1\web
npm run dev
```

### Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:8080/api
- H2 Console: http://localhost:8080/h2-console

---

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/dashboard/{username}` - Get dashboard data
- `POST /api/auth/logout` - Logout user

---

## 🔐 Default Credentials for Testing

You can create test accounts through the registration form on the frontend.

Example:
- **Username:** testuser
- **Email:** test@example.com
- **Password:** password123
- **Full Name:** Test User

---

## 📂 Project Structure

```
├── backend/
│   ├── src/main/java/com/example/backend/
│   │   ├── controller/    (API endpoints)
│   │   ├── service/       (Business logic)
│   │   ├── model/         (Database entities)
│   │   ├── dto/           (Data transfer objects)
│   │   ├── repository/    (Database access)
│   │   └── security/      (Authentication & encryption)
│   └── pom.xml            (Maven configuration)
│
└── web/
    ├── src/
    │   ├── components/    (React components)
    │   ├── utils/         (API client)
    │   ├── App.jsx        (Main app component)
    │   ├── App.css        (Styling)
    │   └── main.jsx       (Entry point)
    ├── package.json
    └── vite.config.js
```

---

## 🛠️ Technologies Used

### Backend
- Spring Boot 4.0.2
- Spring Data JPA
- H2 Database
- BCrypt for password hashing
- JWT for token generation

### Frontend
- React 19.2.0
- Vite 7.2.4
- Fetch API for HTTP requests
- CSS for styling

---

## ✨ Next Steps

1. Test the authentication flow:
   - Register a new account
   - Login with credentials
   - View dashboard
   - Logout

2. Check H2 console for database data at: http://localhost:8080/h2-console
   - Username: sa
   - Password: (leave empty)

3. Monitor backend logs for API requests and responses

---

## 🐛 Troubleshooting

### Frontend can't reach backend?
- Ensure backend is running on port 8080
- Check CORS is enabled (it is in AuthController)
- Clear browser cache and retry

### Database not persisting?
- This is expected with H2 in-memory database
- Data persists during current session
- Data resets when backend restarts

### Port already in use?
- Backend: Change port in `application.properties`
- Frontend: Vite will prompt to use different port

---

Generated: 2026-02-04
System: IT342_G4_Temperatura_Lab1
