# MERN Authentication System

A robust, full-stack authentication system built using the **MERN** stack (MongoDB, Express, React, Node.js). This project features secure user management including registration, login, email verification, and password resets using secure cookies and JWTs.

## 🚀 Features

* **Secure Authentication:**
    * User Registration & Login.
    * **JWT (JSON Web Token)** based authentication.
    * **HttpOnly Cookies** for secure token storage (preventing XSS attacks).
    * Password Hashing using `bcryptjs`.
* **Email Services (Nodemailer):**
    * Account Verification via OTP (One-Time Password).
    * Password Reset via OTP.
    * Welcome emails upon registration.
* **Frontend (React):**
    * Global Authentication State using **Context API**.
    * Protected Routes (only accessible to logged-in users).
    * User-friendly notifications using `react-toastify`.
    * Axios interceptors/configuration for credentials support.

## 🛠️ Tech Stack

**Frontend:**
* React.js (Vite)
* React Router DOM
* Context API
* Axios
* React Toastify

**Backend:**
* Node.js & Express.js
* MongoDB & Mongoose
* JSON Web Token (JWT)
* BcryptJS
* Nodemailer
* Cookie Parser

## ⚙️ Installation & Setup

Follow these steps to run the project locally.

### 1. Clone the Repository
```bash
---------------------------------------------------------------
git clone https://github.com/pratikshapandey4002/mern-Auth.git
cd mern-auth
----------------------------------------------------------------

2. Backend Setup
Navigate to the server directory and install dependencies:
--------------
|cd Server   |
|npm install |
--------------
Create a .env file in the Server folder and add the following variables:

Code snippet
-------------------------------------------
PORT=4000
MONGODB_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_super_secret_key>
NODE_ENV=development
---------------------------------------------

# Nodemailer Configuration
----------------------------------
SENDER_EMAIL=<your_email_address>
----------------------------------
# Check config/nodemailer.js for specific SMTP settings required


Start the backend server:
---------------
npm run server
----------------

3. Frontend Setup
Open a new terminal, navigate to the client directory, and install dependencies:

----------------------------------------
cd Client
npm install
-----------------------------------------

Create a .env file in the Client folder:
-----------------------------------------
VITE_BACKEND_URL=http://localhost:4000
-----------------------------------------

Start the frontend application:
--------------
npm run dev
--------------

API ENDPOINTS
------------------------------------------------------------------------------------------
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Register a new user & set auth cookie. |
| **POST** | `/api/auth/login` | Login user & set auth cookie. |
| **POST** | `/api/auth/logout` | Clear auth cookie (Log out). |
| **POST** | `/api/auth/send-verify-otp` | Send verification OTP to user's email. |
| **POST** | `/api/auth/verify-account` | Verify account using the OTP sent. |
| **GET** | `/api/auth/is-auth` | Check if user is authenticated (Persistent Login). |
| **POST** | `/api/auth/send-reset-otp` | Send password reset OTP. |
| **POST** | `/api/auth/reset-password` | Reset password using the OTP. |
| **GET** | `/api/user/data` | Fetch current user details (**Protected Route**). |
--------------------------------------------------------------------------------------------


🛡️ Security Logic

Tokens: Access tokens are generated upon login/register and stored in HTTP-Only Cookies. This means JavaScript on the client side cannot read the token, protecting it from cross-site scripting (XSS) attacks.

Passwords: Passwords are never stored in plain text. They are salted and hashed using bcrypt before saving to the database.

Verification: Critical actions like Password Reset and Email Verification require a valid OTP sent to the user's email, ensuring ownership.