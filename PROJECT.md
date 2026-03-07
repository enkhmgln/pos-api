# Vendly

**Vendly** is a mobile-first business management platform for **micro-retailers and small shop owners**. It replaces expensive POS hardware and complex tools with a simple app that runs on your phone — **offline-friendly** and built for everyday retail.

Merchants can **record sales**, **track inventory**, **manage expenses**, and **see real-time profit** from one dashboard. No technical skills or costly equipment required. As they grow, Vendly can add receipts, analytics, and (later) **Ebarimt**-ready workflows.

*Not just a POS alternative — the operating system for modern small retail.*

---

## MVP scope

- **Sales** — Product catalog, quick sale (tap → checkout), discounts, multiple payment types, sale history, receipt IDs
- **Inventory** — Stock levels, low-stock alerts, cost tracking, adjustments and movement history
- **Expenses** — Record and categorize expenses (rent, electricity, supplier, etc.), daily totals
- **Profit dashboard** — Today’s revenue, expenses, profit; weekly/monthly summaries; best sellers; low-stock warnings
- **Merchant profile** — Shop name, owner, phone, address, currency, timezone
- **Receipts** — Local receipt ID, PDF export/share; Ebarimt submission marked for later
- **Data & auth** — Offline-first storage, optional cloud backup/sync, phone or email login, guest mode

See **[docs/mvp.md](docs/mvp.md)** for the full feature list, screen flows, database schema, and 8-week build plan.

---

## Repo structure

| Folder   | Description |
|----------|-------------|
| **`mobile/`** | Flutter app (iOS, Android, web, macOS, Windows, Linux) |
| **`api/`**   | Backend API (Bun + Hono + Drizzle + PostgreSQL) |
| **`docs/`**  | MVP spec, schema, and product docs |

---

## Tech stack

- **Mobile:** Flutter  
- **API:** [Bun](https://bun.sh), [Hono](https://hono.dev), [Drizzle ORM](https://orm.drizzle.team), PostgreSQL  
- **Offline (planned):** SQLite / local storage in the app  
- **Auth (planned):** Phone or email login; guest mode supported  

---

## Getting started

**API**

```bash
cd api
bun install
bun run dev
```

**Mobile**

```bash
cd mobile
flutter pub get
flutter run
```

---

## License

Private. All rights reserved.
