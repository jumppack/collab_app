# 📄 CollabDoc: Collaborative Document Editor

CollabDoc is a full-stack, collaborative document-editing web application built with a modern React frontend and an Express/Node.js backend with MongoDB. It allows users to register accounts, sign in securely, create rich text-based documents, edit their content, and share them with other users by username for co-editing.

---

## 🌟 Features

- **Secure Authentication**: User signup and login powered by JWT (JSON Web Tokens) and bcrypt password hashing.
- **Personal Dashboard**: View all documents you own or have been invited to collaborate on.
- **Document Creation & Editing**: Create new documents and edit titles/content dynamically.
- **Real-Time Collaboration Management**: Document owners can invite other users to co-edit documents by entering their username.
- **Premium Glassmorphism UI**: A responsive, visually striking layout styled with CSS variables, featuring smooth transitions, loaders, and alerts.

---

## 🏗️ Project Architecture

The project is split into two primary components: the **Frontend Client** and the **Backend Server**.

```
collab_app/
├── client/                 # React Frontend Client (Vite)
│   ├── src/
│   │   ├── context/        # Authentication state provider
│   │   ├── hooks/          # Custom hooks (e.g., useApi for HTTP calls)
│   │   ├── pages/          # Pages (Home, Document, Login, Register)
│   │   ├── App.jsx         # Application routing & layouts
│   │   ├── index.css       # Premium CSS design system
│   │   └── main.jsx        # App entry point
│   ├── package.json
│   └── vite.config.js
│
└── server/                 # Express Backend Server
    ├── controllers/        # Route controllers (Scaffolded with TODOs)
    ├── middleware/         # Express middleware (Auth protection TODOs)
    ├── models/             # Mongoose schemas (User & Document)
    ├── routes/             # Express API routing definitions
    ├── schemas/            # Zod validation schemas for requests
    ├── app.js              # Express app setup & error handling
    ├── server.js           # Server startup & DB connection
    └── package.json
```

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19
- **Routing**: React Router DOM v6
- **Build Tool**: Vite
- **Styling**: Modern CSS (Vanilla) with a custom Glassmorphic design system

### Backend & Database
- **Runtime**: Node.js & Express 5
- **Database**: MongoDB via Mongoose ORM
- **Authentication**: JSON Web Tokens (JWT) & bcrypt for password hashing
- **Validation**: Zod schema validation

---

## 🚀 Current Implementation Status & Practice Gaps

> [!NOTE]
> This repository is configured specifically for **practice and training**. Key implementation sections contain scaffold code with partial logic and detailed `TODO` guidelines for both the **Frontend** and the **Backend**.
>
> ### 🎨 Frontend Client Practice Gaps
> Gaps have been created in the following React components and custom hooks:
> - **[AuthContext.jsx](client/src/context/AuthContext.jsx)**: Complete the `login` and `logout` functions to handle `localStorage` updates and React authentication states.
> - **[useApi.js](client/src/hooks/useApi.js)**: Implement logic to automatically append the JWT authorization token (if present) to API headers and handle non-OK error responses.
> - **[DocumentPage.jsx](client/src/pages/DocumentPage.jsx)**: Finish checking document ownership/access privileges (`isOwner` and `hasAccess`) and complete the API request to update document details on save.
>
> ### ⚙️ Backend Server Practice Gaps
> Gaps exist inside the Express models, controllers, and middlewares:
> - **[authMiddleware.js](server/middleware/authMiddleware.js)**: Build the request interceptor that extracts JWT tokens from the request headers and populates `req.user`.
> - **[authController.js](server/controllers/authController.js)**: Write the registration (with password hashing) and login (with verification and token signing) handlers.
> - **[documentController.js](server/controllers/documentController.js)**: Complete database operations for creating, fetching, updating, and sharing documents.

---

## 📥 Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB database (local instance or MongoDB Atlas URI)

### 1. Backend Server Setup
Navigate to the `server` directory and install dependencies:
```bash
cd server
npm install
```

Copy the `.env.example` file to `.env` and fill in your connection details:
```bash
cp .env.example .env
```

Edit your `.env` file:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
```

Start the backend development server (runs with nodemon):
```bash
npm run dev
```

---

### 2. Frontend Client Setup
Open a new terminal, navigate to the `client` directory, and install dependencies:
```bash
cd client
npm install
```

Start the client development server:
```bash
npm run dev
```
The client will start running (usually on `http://localhost:5173`).

---

## 🔌 API Endpoints

Once the backend controllers are implemented, the server will expose the following endpoints:

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register a new user (requires `username` and `password`).
- `POST /api/auth/login` - Authenticate a user and return a JWT token.

### Documents (`/api/documents`)
- `GET /api/documents` - Get all documents associated with the logged-in user (owned or shared).
- `POST /api/documents` - Create a new document (requires `title` and optional `content`).
- `GET /api/documents/:id` - Get details of a specific document (requires access).
- `PUT /api/documents/:id` - Update the `title` and/or `content` of a document (requires access).
- `POST /api/documents/:id/share` - Share a document with another user by username (requires owner access).
