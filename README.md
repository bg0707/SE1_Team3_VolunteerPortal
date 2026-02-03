<p align="left">
  <img src="client/src/assets/logo.png" alt="Volunteer Portal Banner" width="180" />
</p>

---

# Volunteer Portal
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=white)
![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)
![Version](https://img.shields.io/badge/Version-0.1-ff8a00)

A university Software Engineering project — a full‑stack web app that connects local nonprofits with volunteers to simplify community engagement.

Volunteers can register, log in, browse opportunities, and apply. Organizations can register, log in, create opportunities, and manage applications. The system uses JWT authentication, protected routes, role‑based navigation, and a MySQL database. The Volunteer Portal is a role‑based platform where volunteers and organizations collaborate in one place, streamlining opportunity discovery, applications, and organization-side management with secure authentication and a relational data model.

---

## Website
**Here you can access the website link:** `https://volunteer-portal-hcccfygngna9eph0.francecentral-01.azurewebsites.net`

Scan the QR code to open the site on mobile:

<img src="docs/qr-code.png" alt="Website QR Code" width="140" />

**Test Credentials**
- **Admin**: `admin@example.com` / `admin123`
- **Volunteer**: `volunteer@example.com` / `vol123`
- **Organization (Helping Hands)**: `helpinghands@example.org` / `HH-Volunteer-2026!`


---

## Report
- Here you can find a report explaining how we worked: `docs/Project Workflow, Engineering Practices & Learning Reflection.pdf`

---

## Team
- **Bruno Cunha Gaspar** — `bg0707`
- **Gabriel Botelho** — `gBotelho2003`
- **Cédric Bassong** — `Cedric29-05`
- **Jiahao LIN** — `IdubiJam`
- **Stylianos NTINOS** — `Stylnt`

---

## API Documentation
Here you can find the API documentation: `docs/api.md`

---

## Key Features
- **Volunteers**: sign up/login, browse opportunities, view details, and apply.
- **Organizations**: sign up/login, create and manage opportunities, review applications.
- **Authentication**: JWT-based login with protected routes.
- **Role-based navigation**: tailored UI and access for each user role.
- **MySQL data layer**: relational schema managed via Sequelize.

---

**Deliverable 2:** available on the `deliverable2` branch.
**CI Tests:** see the GitHub Actions "Run tests" workflow in the Actions tab.

---

## Tech Stack
**Frontend**
- React 19, Vite, TypeScript
- React Router
- Tailwind CSS

**Backend**
- Node.js, Express
- Sequelize ORM
- MySQL
- JWT + bcrypt for auth

**Testing**
- Jest (server)

---

## Architecture
- **Client**: React SPA with protected routes and role-aware navigation
- **Server**: REST API using Express + Sequelize
- **Database**: MySQL schema for users, organizations, opportunities, and applications

---

## Getting Started
### Prerequisites
- Node.js (v18+ recommended)
- npm
- MySQL (local or hosted)

### Install
```bash
# from repo root
cd server
npm install

cd ../client
npm install
```

---

## Database Setup
1. Create a database named `volunteer_portal` in MySQL.
2. Create a `.env` file in `server/` with the following:

```bash
DB_PASSWORD=your_mysql_password
JWT_SECRET=your_super_secret_key
```

> The server connects using user `root` by default (see `server/src/config/db.js`). Adjust as needed for your environment.

Optional scripts:
```bash
# from server/
npm run seed:admin
npm run db:sync
npm run seed:opportunities
npm run migrate:add-opportunity-status
```

---

## Running the App
### Server
```bash
cd server
npm run dev
```

### Client
Create `client/.env` (or copy `client/.env.example`) and set the API base URL:

```bash
VITE_API_BASE_URL=http://localhost:3001/api
```

```bash
cd client
npm run dev
```

Vite will print the local dev URL in the terminal.

## Deployment Notes (Azure)
- Server uses `PORT` from the environment (falls back to 3001).
- Set `CORS_ORIGIN` to your deployed client URL (comma-separated for multiple).
- For Azure MySQL, configure `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, and set `DB_SSL=true` if required.

---

## Testing
```bash
cd server
npm test
```

---

## Project Structure
```
.
├── client/                 # React frontend (Vite + TS)
├── server/                 # Express API + Sequelize + MySQL
├── docs/                   # Diagrams and documentation assets
└── README.md
```

---

## Notes
This is a university Software Engineering project intended for educational use.
