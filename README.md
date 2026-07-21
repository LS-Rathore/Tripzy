<div align="center">

# ✈️ Tripzy

### Your AI-Powered Travel Companion

**Plan smarter. Travel better. Split easier.**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Gemini](https://img.shields.io/badge/Gemini_AI-2.0_Flash-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)](https://ai.google.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

---

*Tell Tripzy where you want to go, and it builds your entire trip — day by day, meal by meal, rupee by rupee.*

</div>

---

## 🚀 What is Tripzy?

Tripzy is a full-stack AI travel planner that turns a simple form into a complete, personalized itinerary. It doesn't just list tourist spots — it thinks like a **local friend** who knows the best hidden chai stalls, the cheapest rickshaw routes, and exactly when to visit the fort before the crowds arrive.

### ✨ Key Features

| Feature | Description |
|---------|------------|
| 🧠 **AI Trip Concepts** | Get 3 distinct trip styles (Relaxed / Balanced / Packed) tailored to your budget and interests |
| 📅 **Day-by-Day Itinerary** | Full morning, afternoon, evening plans with 2-3 options per slot + alternative day themes |
| 💬 **Local Friend Chat** | Context-aware AI chatbot that knows your itinerary and answers questions like a local |
| 💸 **Squad Expense Tracker** | Log expenses, split bills, and auto-calculate who owes who (mini Splitwise) |
| 📊 **Budget Analytics** | Visual progress bar tracking your spending vs. budget with dynamic color alerts |
| ⚡ **Smart AI Caching** | Identical trips return instantly from cache instead of calling the AI again |
| 🔐 **Google OAuth** | Secure login with HTTP-only cookie authentication |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Frontend (React + Vite)           │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────┐  │
│  │  Pages   │  │Components│  │  Context (Auth)   │  │
│  │  13 pages│  │  Plan,   │  │  Google OAuth     │  │
│  │  SPA     │  │  Trip,   │  │  JWT Cookie       │  │
│  │  Routes  │  │  Layout  │  │  Session Mgmt     │  │
│  └──────────┘  └──────────┘  └───────────────────┘  │
└──────────────────────┬──────────────────────────────┘
                       │ REST API (credentials: include)
┌──────────────────────▼──────────────────────────────┐
│                   Backend (Express 5)                │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────┐  │
│  │  Routes  │  │Middleware│  │    Services        │  │
│  │  Auth    │  │  JWT     │  │  Concept Gen (AI)  │  │
│  │  Trips   │  │  Auth    │  │  Itinerary Gen(AI) │  │
│  │  Expense │  │  Guard   │  │  Chat (AI)         │  │
│  │          │  │          │  │  Cache (TTL)       │  │
│  └──────────┘  └──────────┘  └───────────────────┘  │
└──────────────────────┬──────────────────────────────┘
           ┌───────────┴───────────┐
     ┌─────▼─────┐          ┌─────▼─────┐
     │PostgreSQL │          │  Gemini   │
     │  (Neon)   │          │  + Groq   │
     │  7 Models │          │  Fallback │
     └───────────┘          └───────────┘
```

---

## 🛠️ Tech Stack

<table>
<tr>
<td><b>Frontend</b></td>
<td>React 19, TypeScript, Vite, TailwindCSS v4, React Router v7</td>
</tr>
<tr>
<td><b>Backend</b></td>
<td>Express 5, TypeScript, Prisma 7, JWT, Cookie-Parser</td>
</tr>
<tr>
<td><b>Database</b></td>
<td>PostgreSQL (Neon Serverless) with Prisma ORM</td>
</tr>
<tr>
<td><b>AI</b></td>
<td>Google Gemini 2.0 Flash (primary) + Groq Llama 3.3 (fallback)</td>
</tr>
<tr>
<td><b>Auth</b></td>
<td>Google OAuth 2.0 → JWT → HTTP-only Secure Cookies</td>
</tr>
<tr>
<td><b>Design</b></td>
<td>Neo-Brutalism (thick borders, staggered shadows, bold typography)</td>
</tr>
</table>

---

## 📦 Getting Started

### Prerequisites

- **Node.js** v18+
- **PostgreSQL** database (or a [Neon](https://neon.tech) free-tier account)
- **Google Cloud** OAuth credentials
- **Gemini API Key** ([Get one free](https://aistudio.google.com/apikey))

### 1. Clone the repo

```bash
git clone https://github.com/LS-Rathore/Tripzy.git
cd Tripzy
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
DATABASE_URL=postgresql://user:password@host/dbname
JWT_SECRET=your-secret-key
GEMINI_API_KEY=your-gemini-key
GROQ_API_KEY=your-groq-key          # optional fallback
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FRONTEND_URL=http://localhost:5173
```

Push the database schema and start the server:

```bash
npx prisma db push
npx prisma generate
npm run dev
```

### 3. Setup Frontend

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/`:

```env
VITE_API_URL=http://localhost:5000
```

Start the dev server:

```bash
npm run dev
```

### 4. Open the app

Visit **http://localhost:5173** and start planning! 🎉

---

## 🗄️ Database Schema

The app uses **7 interconnected models**:

```
User ──┐
       ├── Trip ──┬── Day ──┬── Activity (morning/afternoon/evening)
       │          │         ├── Food
       │          │         └── TransportLeg
       │          └── Expense
       │
```

| Model | Purpose |
|-------|---------|
| `User` | Google OAuth users with name, email, avatar |
| `Trip` | Core entity — city, budget, style, AI-generated data |
| `Day` | One per trip day — links to activities, food, transport |
| `Activity` | Morning/afternoon/evening slots with cost and location |
| `Food` | Breakfast, lunch, dinner recommendations per day |
| `TransportLeg` | Point-to-point transport with mode and cost |
| `Expense` | Squad expense entries with paidBy and splitAmong |

---

## 🔒 Security

- **Authentication:** JWT tokens stored in HTTP-only cookies (immune to XSS)
- **Authorization:** `requireAuth` middleware on all protected endpoints
- **Data isolation:** All queries scoped by `userId`
- **CORS:** Restricted to frontend origin only
- **SQL injection:** Prevented by Prisma's parameterized queries
- **Secrets:** All API keys in `.env` files, never committed

---

## 📈 Performance

- **AI Caching:** Deterministic cache keys with TTL — identical requests return in <1ms
- **Connection Pooling:** `pg.Pool` reuses database connections
- **Code Splitting:** Vite handles lazy loading per route
- **JSON Storage:** Raw itinerary stored as JSON to avoid expensive JOINs

---

## 🧪 AI Fallback Chain

Tripzy uses a resilient multi-provider AI strategy:

```
Gemini 2.0 Flash  →  Groq (Llama 3.3)  →  Mock Data
     (primary)          (fallback)         (offline)
```

The app is **always functional**, even if every AI API is down.

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit PRs.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

<div align="center">



*If Tripzy helped you plan a trip, give it a ⭐!*

</div>
