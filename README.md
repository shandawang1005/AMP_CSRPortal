# AMP CSR Portal

A web-based Customer Service Representative (CSR) portal for AMP, a car wash membership and loyalty platform. This portal allows CSRs to manage client information, vehicles, tickets, and balances in a streamlined UI.

## Features

- Login with role-based demo access (CSR, Manager, Admin)
- View and edit client details
- Add/edit vehicles with balance logic for monthly subscriptions
- Ticketing system for client issues
- Refill and redeem balance with validation
- Fully validated forms using custom reusable validators
- Role-protected routes using React Router guards
- Wash history and subscription upgrade tracking

## 🛠 Tech Stack

**Frontend:**

- React + Vite
- Redux Toolkit + Thunk
- TailwindCSS
- React Router DOM

**Backend:**

- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication

**Deployment:**

- Hosted on [Render.com](https://render.com)

---

## Demo Accounts

Use the following demo buttons on the login page:

| Role    | Email           | Password |
| ------- | --------------- | -------- |
| CSR     | csr@amp.com     | 123456   |
| Manager | manager@amp.com | 123456   |
| Admin   | admin@amp.com   | 123456   |

---

## Project Structure

```bash
AMP_CSR_Portal/
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable and page-specific components
│   │   ├── features/        # Redux slices and thunks
│   │   ├── guards/          # Route protection logic
│   │   ├── utils/           # Custom validators and helpers
│   │   ├── api/             # Axios configuration
│   │   ├── hooks/           # Custom hook
│   │   ├── pages/           # Dashboard and 404 pages
│   │   └── App.jsx
│   ├── .gitignore
│   └── .env
├── server/
│   ├── controllers/
│   ├── db/
│   ├── models/
│   ├── seeds/
│   ├── routes/
│   ├── server.js
│   ├── .env
│   └──  .gitignore
└── README.md
```

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/shandawang1005/AMP_CSRPortal.git
cd AMP_CSR_Portal
```

### 2. Backend Setup

```bash
cd server
npm install

Create a .env file in the server/ directory with the following:
touch .env
```
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_ORIGIN=http://localhost:5173
```


Start the backend server:

```bash

npm run dev 
```
### 3. Frontend Setup
```bash
cd ../frontend
npm install

Create a .env file in the frontend/ directory with the following:
touch .env
```
```
VITE_API_BASE_URL=http://localhost:5000/api
```
Start the frontend development server:

```bash
npm run dev 
```
### 4. Access the App
Once both frontend and backend servers are running, open your browser and go to:


```http://localhost:5173```
You’ll see the login page, where you can use demo accounts to log in and explore.
