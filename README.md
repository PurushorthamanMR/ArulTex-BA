# ArulTex POS Backend - Node.js Version

Node.js/Express.js conversion of the Spring Boot POS (Point of Sale) system. Uses the same MySQL schema and provides a REST API with JWT authentication and role-based access.

## Project Structure

```
arultex_pos_be_nodejs/
├── config/
│   ├── database.js      # Sequelize database configuration
│   └── logger.js        # Winston logger configuration
├── middleware/          # JWT auth, role-based authorization
├── migrations/          # SQL migrations and sample data
│   ├── sample_data.sql           # Sample data (min 5 rows per table)
│   ├── add_balance_amount_simple.sql
│   └── README_SAMPLE_DATA.md
├── models/              # Sequelize models (database entities)
├── routes/              # Express routes (API endpoints)
├── services/            # Business logic (transaction, user, product, etc.)
├── utils/               # Response helpers, etc.
├── server.js            # Application entry point
├── package.json
└── .env                 # Environment variables (create from .env.example)
```

## Features

- **RESTful API** – Express.js REST API aligned with Spring Boot controllers
- **JWT Authentication** – Token-based auth; include `Authorization: Bearer <token>`
- **MySQL + Sequelize** – Same schema as Spring Boot; no schema sync by default (`alter: false`)
- **Role-based access** – Roles: **DEV**, **ADMIN**, **STAFF** (see middleware)
- **Password reset** – Forgot password (email token) and reset-password flows
- **Email** – Nodemailer for password reset and notifications
- **Logging** – Winston + Morgan for app and HTTP logs
- **X Report & Z Report** – Sales reports with date range, category/payment totals, banking/payout

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Environment

- Copy `.env.example` to `.env`
- Set `DB_*`, `JWT_SECRET`, and optional `MAIL_*` for password reset

### 3. Database

- MySQL running; create database (e.g. `arun_tex_db`) if needed
- Use existing schema or run your schema scripts
- Optional: add `balanceAmount` if missing: run `migrations/add_balance_amount_simple.sql`
- Optional: load sample data **after** first server run:  
  `mysql -u root -p arun_tex_db < migrations/sample_data.sql`  
  (See `migrations/README_SAMPLE_DATA.md` for details.)

### 4. Run

```bash
# Development (nodemon)
npm run dev

# Production
npm start
```

On first run, default data is created: country (Sri Lanka), shop details (yarltech), branch (Jaffna), roles (Dev, Admin, Staff), and default user (see `server.js` → `initializeDefaultData`).

## API Overview

Base URL: `http://localhost:8080` (or your `PORT`).

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/user/login` | Login; returns JWT |
| POST | `/auth/forgot-password` | Request password reset (body: `emailAddress`) |
| POST | `/auth/reset-password` | Reset with token (body: `token`, `newPassword`) |

### User

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/user/getById`, `/user/getByName` | Get user |
| GET | `/user/getAllPage` | Paginated users |
| POST | `/user/update`, `/user/updatePassword`, `/user/updateStatus` | Update user |

### Transaction

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/transaction/save` | Create transaction (details, payments, employees) |
| POST | `/transaction/update` | Update transaction |
| GET | `/transaction/getAll`, `/transaction/getById` | List / get by id |
| GET | `/transaction/getByDateRange` | Query: `startDate`, `endDate` |
| GET | `/transaction/getByBranchId`, `/transaction/getByUserId`, `/transaction/getByCustomerId`, `/transaction/getByProductId`, `/transaction/getByPaymentMethodId` | Filter by relation |
| GET | `/transaction/xReport?userId=1` | X Report (sales summary, category/payment totals) |
| GET | `/transaction/zReport?userId=1` | Z Report (date-wise totals) |
| GET | `/transaction/getCashTotal?userId=1` | Cash total for user |
| GET | `/transaction/getAllPage` | Paginated transactions |

### Other modules (CRUD / listing where applicable)

- **Branch**, **Country**, **Shop details** – `/branch`, `/country`, `/shopDetails`
- **Product**, **Product category**, **Tax**, **Supplier** – `/product`, `/productCategory`, `/tax`, `/supplier`
- **Customer** – `/customer`
- **Stock**, **Purchase list** – `/stock`, `/purchaseList`
- **Payment method** – `/paymentMethod`
- **Banking**, **Minimam banking**, **Payout**, **Payout category** – `/banking`, `/minimamBanking`, `/payout`, `/payoutCategory`
- **Shifts**, **Staff leave** – `/shifts`, `/staffLeave`
- **Product discount**, **Product discount type**, **Employee discount** – `/productDiscount`, `/productDiscountType`, `/employeeDiscount`
- **Sales report**, **Void history**, **User logs** – `/salesReport`, `/voidHistory`, `/userLogs`
- **Device auth**, **Manager toggle** – `/deviceAuth`, `/managerToggle`
- **User role** – `/userRole`

Most of these support `getAll`, `getById`, `getAllPage`, and create/update where applicable. Protected routes use JWT and roles (DEV, ADMIN, STAFF).

## Authentication

1. Login: `POST /user/login` with `{ "username", "password" }` (username = email).
2. Use the returned `accessToken` in the header:

```http
Authorization: Bearer <accessToken>
```

3. Roles are resolved from the user’s role (ADMIN, MANAGER, STAFF). Admin-only routes use `authorize('ADMIN', 'MANAGER')`; general staff routes use `authorize('ADMIN', 'MANAGER', 'STAFF')`.

## Database notes

- Same schema as Spring Boot; no automatic alter on startup (`sequelize.sync({ alter: false })`).
- New columns (e.g. `transaction.balanceAmount`) require running the corresponding migration SQL.
- Sample data in `migrations/sample_data.sql` inserts from id 2 (or 4 for userrole) for tables that already get default rows on server start (country, shopdetails, branch, userrole, user).

## Development

- Add a new feature: add or extend a **service** in `services/`, then wire it in the right **route** under `routes/` and mount the route in `server.js`.
- Logs: check `config/logger.js` and log output (e.g. `log/` if configured).
- Postman: use the project’s Postman collection for full endpoint list and examples.

## Tech stack

- Node.js, Express
- Sequelize + mysql2
- JWT (jsonwebtoken), bcryptjs
- Nodemailer, Winston, Morgan, dotenv, cors
