# FixMate Server

Express REST API for FixMate. It owns MongoDB persistence, Better Auth, JWKS/JWT verification, role middleware, technician image uploads, and Stripe Checkout/webhook fulfillment.

## Live API
- Production: `https://as-fixmate-api.vercel.app` (set after deployment)
- Health: `/api/health`
- Better Auth: `/api/auth/*`
- Stripe webhook: `/api/payments/webhook`

## Local setup
1. From repository root run `npm install`.
2. Copy `.env.example` to `.env` and fill the server secrets.
3. Run `npm run seed` from the repository root to create demo accounts, approved and pending services, repair requests and a demo paid receipt.
4. Run `npm run dev:server` from the root (or root `npm run dev` for both applications).

## Demo accounts
Development defaults (local only):
- Admin: `admin@fixmate.local` / `FixMateAdmin123!`
- Technician: `tech1@fixmate.local` / `FixMateTech123!`
- Technician: `tech2@fixmate.local` / `FixMateTech123!`
- Customer: `customer@fixmate.local` / `FixMateCustomer123!`

For production seeding, supply all `*_EMAIL` and `*_PASSWORD` variables with unique, strong credentials. Do not use these development passwords on a public deployment.

## API and security features
- Four business collections: `users`, `services`, `bookings`, `payments`; Better Auth manages its own auth collections.
- MongoDB server-side service search, filters, sort and pagination.
- Better Auth JWT plugin + JWKS verification, `verifyToken`, and strict customer/technician/admin middleware.
- Ownership conditions on every private record route and current-role lookup on each authenticated request.
- Duplicate active booking key, allowed status transitions, role-aware operations and completion amount validation.
- Stripe server-derived Checkout amounts, raw-body webhook signature verification, and unique payment/session constraints.
- ImgBB upload using server-held API key and in-memory file validation.

## Environment variables
See `.env.example`. Essential secrets are `MONGODB_URI`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, and `IMGBB_API_KEY`. Keep them in Vercel Environment Variables; never commit `.env`.

## Production requirements
Set `CLIENT_URL` to the live frontend URL. Include that URL in `CORS_ALLOWED_ORIGINS` and Better Auth `trustedOrigins`. Configure the Stripe test-mode `checkout.session.completed` webhook to `https://<api-domain>/api/payments/webhook`, then set the signing secret as `STRIPE_WEBHOOK_SECRET`. Seed production with credentials created specifically for the evaluator.

## Packages
Express, Better Auth, `@better-auth/mongo-adapter`, MongoDB Node driver, `jose`, Stripe Node SDK, Multer, Helmet, CORS, dotenv and express-rate-limit.
