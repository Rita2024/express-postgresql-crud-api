# Express.js + PostgreSQL CRUD API

This project demonstrates a production-ready REST API with:

- Modular structure (controllers, services, middleware)
- Input validation (express-validator)
- JWT authentication (jsonwebtoken, bcryptjs)
- Refresh tokens
- Password reset
- Role-based authorization (admin/user)
- Logging (morgan)
- Swagger/OpenAPI documentation (swagger-jsdoc, swagger-ui-express)
- Unit tests (Jest, Supertest)
- Seed script
- CI/CD with GitHub Actions

## Table Schema

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  age INTEGER,
  password VARCHAR(200),
  role VARCHAR(20) DEFAULT 'user',
  refresh_token TEXT
);
```

## Setup Instructions

1. Install PostgreSQL and Node.js.
2. Create a new PostgreSQL database.
3. Run the SQL above to create the `users` table.
4. Clone this repo and `cd` into it.
5. Copy `.env.example` to `.env` and update your database and JWT credentials.
6. Install dependencies:

   ```
   npm install
   ```

7. Seed the database:

   ```
   npm run seed
   ```

8. Start the server:

   ```
   npm start
   ```
   Or for development with hot reload:
   ```
   npm run dev
   ```

9. Run tests:

   ```
   npm test
   ```

## API Endpoints

- `POST /auth/login` — Login and get access/refresh tokens
- `POST /auth/refresh` — Get new access token with refresh token
- `POST /auth/request-password-reset` — Request a password reset token
- `POST /auth/reset-password` — Set a new password with reset token

**All `/users` endpoints require JWT token in the `Authorization: Bearer <token>` header:**

- `GET /users` — Get all users
- `GET /users/:id` — Get user by ID
- `POST /users` — Create user (name, email, age, password, [role])
- `PUT /users/:id` — Update user (name, email, age)
- `DELETE /users/:id` — Delete user (admin only)

## API Documentation

After running the server, view Swagger docs at:  
[http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## Example: Register and Login

1. **Register:**  
   `POST /users` with body:
   ```json
   {
     "name": "Alice",
     "email": "alice@example.com",
     "age": 30,
     "password": "secret123"
   }
   ```
2. **Login:**  
   `POST /auth/login` with body:
   ```json
   {
     "email": "alice@example.com",
     "password": "secret123"
   }
   ```

   Response:
   ```json
   {
     "accessToken": "...",
     "refreshToken": "..."
   }
   ```

3. **Refresh Token:**  
   `POST /auth/refresh` with body:
   ```json
   {
     "refreshToken": "..."
   }
   ```

   Response:
   ```json
   {
     "accessToken": "..."
   }
   ```

4. **Request Password Reset:**  
   `POST /auth/request-password-reset` with body:
   ```json
   {
     "email": "alice@example.com"
   }
   ```
   *(Response will contain a reset token for demo; in production, sent via email)*

5. **Reset Password:**  
   `POST /auth/reset-password` with body:
   ```json
   {
     "token": "reset_token_from_previous_step",
     "newPassword": "newsecret123"
   }
   ```

6. **Authenticated requests:**  
   Add header:
   ```
   Authorization: Bearer <accessToken>
   ```

## CI/CD

On each push/PR to `main`, GitHub Actions will run tests in a fresh PostgreSQL container.

---

Ready for further production enhancements!