# 📈 Stock Trading Application

A full-stack, real-time stock trading platform supporting **50+ concurrent users** with live market price simulation, buy/sell order execution, portfolio tracking, and a fully automated CI/CD pipeline.

> Built with Next.js, TypeScript, Node.js, PostgreSQL, Docker, Jenkins, and AWS.

---

## 🚀 Live Demo

> _Backend hosted on AWS EC2 | CI/CD via Jenkins_

---

## 📸 Screenshots



---

## ✨ Features

- 🔴 **Real-time price simulation** — live market prices update every second via WebSocket connections
- 💹 **Buy / Sell order execution** — place market orders with instant portfolio reflection
- 📊 **Portfolio dashboard** — track holdings, P&L, and transaction history per user
- 👥 **Multi-user support** — supports 50+ concurrent users with session-based auth
- 🔐 **JWT Authentication** — secure login, registration, and protected routes
- 🔄 **CI/CD Pipeline** — automated build, test, and deployment via Jenkins & Docker to AWS
- 🗄️ **PostgreSQL** — normalized relational schema for users, orders, and portfolio records

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js, TypeScript, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| Real-time | WebSockets |
| DevOps | Docker, Jenkins, AWS EC2, Nginx |
| Auth | JWT |
| Version Control | Git, GitHub |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                    CLIENT (Next.js)                  │
│         Dashboard │ Portfolio │ Trade Execution      │
└──────────────────────────┬──────────────────────────┘
                           │ HTTP / WebSocket
┌──────────────────────────▼──────────────────────────┐
│               API SERVER (Node.js + Express)         │
│    Auth Routes │ Trade Routes │ Portfolio Routes     │
└──────────┬─────────────────────────┬────────────────┘
           │                         │
┌──────────▼──────────┐   ┌──────────▼──────────────┐
│   PostgreSQL DB      │   │  WebSocket Price Server  │
│ Users │ Orders │ P&L │   │  Live market simulation  │
└─────────────────────┘   └─────────────────────────┘

                    CI/CD Pipeline
┌─────────────────────────────────────────────────────┐
│  GitHub Push → Jenkins → Docker Build → AWS EC2     │
│  Automated tests → Docker Hub → Nginx reverse proxy │
└─────────────────────────────────────────────────────┘
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js v18+
- Docker & Docker Compose
- PostgreSQL 15+
- Git

### 1. Clone the repository

```bash
git clone https://github.com/koushilvarma/Stock_trade_application.git
cd Stock_trade_application
```

### 2. Set up environment variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/stocktrading

# Auth
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d

# Server
PORT=5000
NODE_ENV=development

# AWS (for production)
AWS_REGION=ap-south-1
```

### 3. Run with Docker (recommended)

```bash
docker-compose up --build
```

App will be available at `http://localhost:3000`

### 4. Run locally (without Docker)

```bash
# Install dependencies
npm install

# Run database migrations
npm run db:migrate

# Start backend
npm run server

# Start frontend (new terminal)
npm run dev
```

---

## 🗃️ Database Schema

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Portfolio table
CREATE TABLE portfolio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  ticker VARCHAR NOT NULL,
  quantity INTEGER NOT NULL,
  avg_buy_price DECIMAL NOT NULL
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  ticker VARCHAR NOT NULL,
  order_type VARCHAR CHECK (order_type IN ('BUY', 'SELL')),
  quantity INTEGER NOT NULL,
  price DECIMAL NOT NULL,
  executed_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔄 CI/CD Pipeline

This project uses a fully automated Jenkins pipeline triggered on every push to `main`:

```
Push to GitHub
      │
      ▼
Jenkins Webhook Trigger
      │
      ▼
Run Unit & Integration Tests
      │
      ▼
Docker Build & Tag Image
      │
      ▼
Push to Docker Hub
      │
      ▼
SSH into AWS EC2
      │
      ▼
Pull Latest Image & Restart Container
      │
      ▼
Nginx Reverse Proxy → Live
```

> Deployment time reduced by **60%** compared to manual deployment.

---

## 📁 Project Structure

```
Stock_trade_application/
├── client/                  # Next.js frontend
│   ├── components/          # Reusable UI components
│   ├── pages/               # Next.js pages (dashboard, portfolio, auth)
│   └── styles/              # Tailwind CSS
├── server/                  # Node.js + Express backend
│   ├── routes/              # API route handlers
│   ├── middleware/          # Auth middleware
│   ├── db/                  # PostgreSQL queries & migrations
│   └── websocket/           # Real-time price server
├── docker-compose.yml       # Docker orchestration
├── Jenkinsfile              # CI/CD pipeline definition
└── README.md
```

---

## 🧪 Running Tests

```bash
# Unit tests
npm run test

# Integration tests
npm run test:integration

# Test coverage
npm run test:coverage
```

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |
| GET | `/api/portfolio` | Get user portfolio |
| POST | `/api/trade/buy` | Execute a buy order |
| POST | `/api/trade/sell` | Execute a sell order |
| GET | `/api/orders/history` | Get order history |
| WS | `/ws/prices` | Real-time price feed |

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

---

## 📄 License

[MIT](LICENSE)

---

## 👤 Author

**Kakarlapudi Koushil Varma**
- Portfolio: [personal-portfolio-aygk.vercel.app](https://personal-portfolio-aygk.vercel.app/)
- LinkedIn: [linkedin.com/in/koushil-varma-3973352b0](https://www.linkedin.com/in/koushil-varma-3973352b0/)
- GitHub: [@koushilvarma](https://github.com/koushilvarma)
