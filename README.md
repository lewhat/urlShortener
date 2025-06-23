# urlShortener
## A full-stack URL shortener application built with React, Node.js, TypeScript, PostgreSQL, and Prisma.

Core Features
```
✅ Create shortened URLs from long URLs
✅ Redirect from short URLs to original URLs
✅ Unique slug generation
✅ 404 page for invalid slugs
✅ Database persistence
✅ List all created URLs
```
Extra Features
```
✅ User accounts (registration/login)
✅ URL validation
✅ Copy to clipboard functionality
✅ Custom slug support
✅ Visit tracking
✅ Rate limiting
✅ Docker support
```
Tech Stack
```
Frontend: React with TypeScript
Backend: Node.js with Express and TypeScript
Database: PostgreSQL
ORM: Prisma
Authentication: JWT
Rate Limiting: express-rate-limit
Containerization: Docker & Docker Compose
```

Getting Started
Prerequisites
```
Node.js 18+
PostgreSQL 15+
Docker & Docker Compose (optional)
```
Running with Docker

Clone the repository:
```
git clone <repository-url>
cd url-shortener
```
Create environment files:
```
bash# Backend .env
cp backend/.env.example backend/.env

# Frontend .env
echo "REACT_APP_API_URL=http://localhost:5001/api" > frontend/.env
```
Start the application:
```
bashdocker-compose up -d
```

The application will be available at:
```
Frontend: http://localhost:3000
Backend API: http://localhost:5001jk
```

Running Locally
Backend Setup

```
# Navigate to backend directory:
cd backend
#Install dependencies:
npm install

#create .env
cp .env.example .env

#Set up PostgreSQL database and update .env with your credentials

#Start the backend:
npm run dev
```

Frontend Setup

```
# Navigate to frontend directory:
cd frontend

#Install dependencies:
npm install

#Create .env file:
cp env.example .env

#Start the frontend:
npm start
```
