# FixMate

**Repairs, without the blind spots.** FixMate is a role-based repair-service marketplace for smart devices and home appliances, built around a transparent **pay-after-service** workflow.

## Live links
- Client: https://as-fixmate.vercel.app
- API: https://as-fixmate-api.vercel.app
- GitHub monorepo: https://github.com/as777hk/AS_Fixmate

The frontend and Express API are deployed as separate Vercel projects from the `client/` and `server/` roots of this repository. The browser sends `/api/*` requests to the frontend origin, and Vercel rewrites them to the Express API so Better Auth cookies remain first-party on the `.vercel.app` deployment. MongoDB Atlas is connected to the production API. The production database is seeded with demo users, 14 approved/available services, and sample bookings in different statuses.

## Product overview
Customers discover approved repair services, submit requests, follow each job through a controlled status timeline, and pay through Stripe Checkout only after a technician marks the work complete. Technicians manage service listings and their own repair queue. Administrators moderate services, manage roles, and monitor platform activity and revenue.

## Roles and demo accounts
The following accounts are for assignment evaluation only. Use them only on the demo deployment; rotate or disable them before using the platform for real customers.

| Role | Email | Demo password |
|---|---|---|
| Admin | `admin@fixmate.demo` | `FixMateAdmin#2026` |
| Technician 1 | `tech1@fixmate.demo` | `FixMateTech#2026` |
| Technician 2 | `tech2@fixmate.demo` | `FixMateTech#2026` |
| Customer | `customer@fixmate.demo` | `FixMateUser#2026` |

## Workspace
- `client/` — Next.js App Router, Better Auth client, public marketplace, role dashboards and payment result pages.
- `server/` — Express API, Better Auth + MongoDB, JWT/JWKS verification, role middleware, Stripe, ImgBB and seed script.

## Core data collections
FixMate owns four business collections: `users` (Better Auth user model), `services`, `bookings`, and `payments`. Better Auth additionally manages its own session, account and verification records; these auth support collections are not counted as business collections.

Important integrity controls:
- A unique active-request key prevents duplicate customer/service requests, including concurrent submissions.
- Every booking mutation uses an ownership condition and a valid transition from the current status.
- A technician can only access their own listings and incoming bookings.
- The Stripe amount is derived from the stored booking, never accepted from the browser.
- `payments.bookingId` and `payments.stripeSessionId` are unique, making Checkout fulfillment idempotent across webhook retries and the success-page fallback.

## Local setup
Requirements: Node.js 20+, npm 10+, and MongoDB (Atlas recommended).

1. Copy `server/.env.example` to `server/.env` and set `MONGODB_URI`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, and `CLIENT_URL`.
2. For Google social sign-in, create a Google OAuth Web client and set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in the server environment. Google sign-up creates a customer account by default; technician registration remains available through the email form.
3. Copy `client/.env.local.example` to `client/.env.local`, set `NEXT_PUBLIC_API_URL` and `INTERNAL_API_URL`, and set `NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=true` only after the server Google credentials are configured. In production, `NEXT_PUBLIC_API_URL` points to the frontend origin and `INTERNAL_API_URL` points to the separate API project.
4. Install from the repository root: `npm install`.
5. Seed local demo users, services, bookings and payment history: `npm run seed`.
6. Start both applications: `npm run dev`.
7. Open `http://localhost:3000`; the API health endpoint is `http://localhost:5000/api/health`.

Google OAuth redirect URI for production: `https://as-fixmate.vercel.app/api/auth/callback/google` (the frontend-origin proxy forwards the callback to the API). For local development with the Express auth server on port 5000, use `http://localhost:5000/api/auth/callback/google` in the Google OAuth client.

## Environment variables
See `server/.env.example` and `client/.env.local.example`. Secrets belong only in the server environment. Never commit `.env`, `.env.local`, API keys, JWT signing material, or Stripe webhook secrets.

The deployed API still requires the owner's own `IMGBB_API_KEY`, `STRIPE_SECRET_KEY` (test key), and `STRIPE_WEBHOOK_SECRET` (test webhook signing secret) before image uploads and end-to-end Stripe payment tests can be completed. Do not put these secrets in the client project or in GitHub.

## Main features
### Authentication
- Email/password sign-up and sign-in for customers and technicians.
- Optional Google OAuth sign-in/sign-up through Better Auth; new Google accounts receive the customer role by default.

### Customer
- Browse approved and available services with server-side search, category/mode filters, sorting and pagination.
- Submit a repair request with service address, date and problem details.
- Follow Requested → Accepted → In Progress → Completed → Paid (or Rejected / Cancelled).
- Cancel only a request that is still Requested.
- Pay completed jobs with Stripe test Checkout and view payment history.

### Technician
- Create services with ImgBB image upload; new and edited services return to Pending moderation.
- Edit, delete and toggle availability for owned listings.
- Accept/reject requests, start work and mark jobs complete with a final amount.
- View service, request and paid-earnings metrics.

### Admin
- Manage user roles (but never change the signed-in admin's own role).
- Approve/reject service listings.
- Monitor all bookings, payments and total revenue.

## Challenges and enhancements
- Challenge 1: MongoDB server-side search, filter, sort and pagination; URL-synced browse filters.
- Challenge 2: Better Auth JWT verification, `verifyToken` and role middleware, 401/403 separation and server-side data isolation.
- Challenge 3: server-enforced booking state machine and customer-owned payment gate.
- Challenge 4: Stripe webhook signature verification and idempotent payment persistence.
- Added: visual booking timeline, dashboard charts, downloadable PDF receipt (browser print-to-PDF), dark/light mode and responsive empty/loading/error states.

## Stripe test mode
Use Stripe test keys only. Example test card: `4242 4242 4242 4242`, any future expiry and any CVC. Configure the deployed webhook endpoint as `POST https://as-fixmate-api.vercel.app/api/payments/webhook`, subscribe to `checkout.session.completed` and `checkout.session.async_payment_succeeded`, then set the resulting signing secret as `STRIPE_WEBHOOK_SECRET` on the server.

## Deployment
Deploy `client/` and `server/` as separate Vercel projects connected to this monorepo, with root directories set to `client` and `server`. Add the production frontend origin to both `CLIENT_URL` / `CORS_ALLOWED_ORIGINS` and Better Auth trusted origins. Configure all secrets in the server project's Vercel environment only.

## QA checklist
- Reload a signed-in dashboard route; the user remains signed in.
- Unauthenticated protected API requests return 401; wrong-role requests return 403.
- Customer and technician APIs never expose another user's records.
- Service search/filter/sort/pagination run in MongoDB and survive a reload.
- Duplicate active requests return 409.
- Invalid state transitions return 400; completion requires a positive final amount.
- Pay Now appears only for completed, unpaid bookings owned by the customer.
- Stripe webhooks reject invalid signatures and repeated events never duplicate a payment.
- Test mobile/tablet/desktop layouts, empty/loading/error states, refresh on nested routes, and production CORS/404/504/console errors.

## Packages
Client: Next.js, React, Better Auth, Tailwind CSS, Lucide React, Sonner, TypeScript.
Server: Express, Better Auth, `@better-auth/mongo-adapter`, MongoDB driver, `jose`, Stripe, Multer, Helmet, CORS, dotenv and express-rate-limit.
