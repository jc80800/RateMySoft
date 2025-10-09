# JWT Authentication Testing Guide

1. **`internal/auth/` package**
   - `jwt.go` - JWT token generation and validation
   - `claims.go` - Claims structure and context helpers

2. **Configuration** (`internal/platform/config/`)
   - `JWT_SECRET` - Secret key for signing tokens
   - `JWT_EXPIRY_HOURS` - Token expiration time (default: 24 hours)

3. **Middleware** (`transport/http/middleware/`)
   - `AuthMiddleware()` - Validates JWT and extracts user info
   - `RequireRole()` - Role-based access control
   - `RequireAdmin()` - Admin-only routes

4. **Endpoints**
   - `POST /api/v1/auth/register` - Create account (returns JWT)
   - `POST /api/v1/auth/login` - Login (returns JWT)
   - `GET /api/v1/auth/profile` - Get profile (requires JWT) ✨ NEW

## 🧪 Testing Instructions

### 1. Start the Server

```bash
cd backend
./main
```

You should see:
```
WARNING: Using default JWT secret. Set JWT_SECRET environment variable for production!
Server starting on port 8080
JWT expiry: 24 hours
```

### 2. Register a New User

```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "handle": "testuser",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "test@example.com",
    "handle": "testuser",
    "role": "user"
  }
}
```

**Copy the token!** You'll need it for the next steps.

### 3. Login with Existing User

```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 4. Access Protected Route (Profile)

Replace `YOUR_TOKEN_HERE` with the actual token from step 2:

```bash
curl -X GET http://localhost:8080/api/v1/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "test@example.com",
  "handle": "testuser",
  "role": "user"
}
```

### 5. Test Invalid Token

```bash
curl -X GET http://localhost:8080/api/v1/auth/profile \
  -H "Authorization: Bearer invalid_token"
```

**Expected Response (401):**
```json
{
  "error": "Invalid or expired token"
}
```

### 6. Test Missing Token

```bash
curl -X GET http://localhost:8080/api/v1/auth/profile
```

**Expected Response (401):**
```json
{
  "error": "Missing or invalid authorization header"
}
```

## 🔍 Verify JWT Token

You can decode your JWT token at [jwt.io](https://jwt.io) to see the claims:

**Payload will contain:**
```json
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "test@example.com",
  "handle": "testuser",
  "role": "user",
  "exp": 1735862400,
  "iat": 1735776000,
  "iss": "ratemysoft",
  "sub": "550e8400-e29b-41d4-a716-446655440000"
}
```

## 🔐 Environment Variables

Create a `.env` file in the backend directory for production:

```env
# Server
SERVER_PORT=8080

# Database
DATABASE_URL=postgres://user:password@localhost:5432/ratemysoft?sslmode=disable

# JWT Configuration
JWT_SECRET=your-super-secret-key-min-32-characters-long
JWT_EXPIRY_HOURS=24
```

**⚠️ Important:** Generate a secure JWT secret:
```bash
# On macOS/Linux:
openssl rand -base64 32

# Or use any strong random string (32+ characters)
```
