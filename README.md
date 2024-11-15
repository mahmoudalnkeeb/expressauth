# ExpressAuth

ExpressAuth is a lightweight authentication system built with Node.js and Express. It provides user registration, login, and session management using JWT (JSON Web Tokens) for secure access control. The application is designed to be modular, allowing easy integration and customization for various projects.

## Features

- **User Signup**: Allows users to register with email and password.
- **User Login**: Authenticates users and issues a JWT token for access control.
- **Password Security**: Uses bcrypt to hash passwords securely.
- **Session Management**: Manages sessions with token-based authentication and token blacklisting.
- **Rate Limiting**: Configurable rate limiting for API endpoints to enhance security.
- **Role-Based Access (Optional)**: Supports admin privileges for restricted endpoints (e.g., sign out all sessions).

## Technologies Used

- **Node.js**: JavaScript runtime environment.
- **Express.js**: Framework for building web applications and APIs.
- **MongoDB (optional)**: For persistent storage in production environments.
- **JWT (jsonwebtoken)**: JSON Web Tokens for secure session management.
- **Bcrypt**: For hashing passwords.
- **dotenv**: For environment variable management.
- **Prettier**: Code formatting.
- **Nodemon**: Automatic server restart during development.

## Getting Started

### Prerequisites

Ensure the following are installed:

- **Node.js** (version 14 or higher)
- **npm** (Node package manager)
- **MongoDB** (optional, recommended for production)

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/mahmoudalnkeeb/expressauth.git
   ```

2. **Navigate to the project directory**:

   ```bash
   cd expressauth
   ```

3. **Install dependencies**:

   ```bash
   npm install
   ```

4. **Set up environment variables**:

   Create a `.env` file in the root directory and add the following variables:

   ```plaintext
   JWT_SECRET_KEY=your_jwt_secret_key
   JWT_ISSUER=your_app_name
   JWT_AUDIENCE=your_app_audience seperated with commas
   SALT_ROUNDS=10
   PORT=3000
   ```

5. **Start the application**:

   For development:

   ```bash
   npm run dev
   ```

   For production:

   ```bash
   npm start
   ```

6. **Access the API**:

   By default, the API is accessible at `http://localhost:3000/api/v${apiVersion}`.

## API Endpoints

### Authentication Endpoints

### **POST** `/auth/signup`

Registers a new user and returns a JWT token for authentication.

- **Request Body**:

  ```json
  { "name": "User Name", "email": "user@example.com", "password": "yourpassword" }
  ```

- **Responses**:
  - `201 Created`: User registered successfully.

    **Response Body**:

    ```json
    { "message": "User created successfully", "token": "<JWT Token>" }
    ```

  - `400 Bad Request`: Missing required fields.

    **Response Body**:

    ```json
    { "message": "Name, email, and password are required." }
    ```

  - `409 Conflict`: Email already in use.

    **Response Body**:

    ```json
    { "message": "Email already in use." }
    ```

  - `500 Internal Server Error`: Error occurred during user creation.

    **Response Body**:

    ```json
    { "message": "Error creating user." }
    ```

---

### **POST** `/auth/signin`

Authenticates a user, verifies the password, and provides a JWT token upon success.

- **Request Body**:

  ```json
  { "email": "user@example.com", "password": "yourpassword" }
  ```

- **Responses**:
  - `200 OK`: Successful login.

    **Response Body**:

    ```json
    { "message": "Signed in successfully", "token": "<JWT Token>" }
    ```

  - `400 Bad Request`: Missing required fields.

    **Response Body**:

    ```json
    { "message": "Email and password are required." }
    ```

  - `401 Unauthorized`: Invalid email or password.

    **Response Body**:

    ```json
    { "message": "Invalid email or password." }
    ```

  - `500 Internal Server Error`: Error occurred during sign-in.

    **Response Body**:

    ```json
    { "message": "Error signing in." }
    ```

---

### **POST** `/auth/signout`

Signs out the user by blacklisting the current JWT token.

- **Headers**:
  - `Authorization`: `Bearer <JWT Token>`

- **Responses**:
  - `200 OK`: Successfully signed out.

    **Response Body**:

    ```json
    { "message": "Signed out successfully." }
    ```

  - `401 Unauthorized`: Invalid or expired token.

    **Response Body**:

    ```json
    { "message": "Invalid or expired token. You are not logged in." }
    ```

  - `500 Internal Server Error`: Error occurred during sign-out.

    **Response Body**:

    ```json
    { "message": "An error occurred while signing out." }
    ```

---

### **POST** `/auth/signout/all`

Invalidates all sessions for a specified user, logging the user out from all devices. Admins can remove sessions for any user.

- **Headers**:
  - `Authorization`: `Bearer <User or Admin JWT Token>`

- **Responses**:
  - `200 OK`: Successfully invalidated all sessions for the user.

    **Response Body**:

    ```json
    { "message": "All sessions for user <User ID> have been invalidated." }
    ```

  - `403 Forbidden`: Insufficient permissions.

    **Response Body**:

    ```json
    { "message": "You do not have permission to perform this action." }
    ```

  - `500 Internal Server Error`: Error occurred during session invalidation.

    **Response Body**:

    ```json
    { "message": "An error occurred while invalidating the user's sessions." }
    ```

---

### **HEAD** `/auth/status`

Verifies the validity of the current session by checking the provided token.

- **Headers**:
  - `Authorization`: `Bearer <JWT Token>`

- **Response Headers**:
  - `Authorization-Status: Valid` if the token is valid.
  - `Authorization-Status: Invalid` if the token is invalid or expired.

- **Status Codes**:
  - `200 OK`: Token is valid.
  - `401 Unauthorized`: Token is invalid or expired.

## Environment Configuration

Adjust environment variables in the `.env` file to configure the application for different environments.

- **JWT_SECRET_KEY**: Secret key for JWT signing.
- **JWT_ISSUER**: The issuer of the JWT token (typically the app name).
- **JWT_AUDIENCE**: Intended audience for the JWT token (can be a comma-separated list for multiple audiences).
- **SALT_ROUNDS**: Number of salt rounds for bcrypt.
- **PORT**: Server port (default is 3000).

## Security

- **Password Hashing**: Passwords are stored as hashed values using bcrypt.
- **Token Blacklisting**: Prevents reuse of tokens after logout.
- **Rate Limiting**: Protects against brute-force attacks by limiting requests.

## Additional Notes

- The current setup uses in-memory data structures for blacklisting tokens and for session management. For a production environment, consider using a persistent data store like Redis or MongoDB for scalability.
- The `signoutAllSessions` endpoint is restricted to admin users only.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
