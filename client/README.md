# FixMate Client

Next.js App Router frontend for the FixMate repair-service marketplace. The client provides public service discovery, customer booking, technician work management, admin operations, Better Auth UI, and Stripe payment result screens.

## Live URL
- Production: `https://as-fixmate.vercel.app` (set after deployment)
- API: `https://as-fixmate-api.vercel.app`

## Local setup
1. From repository root run `npm install`.
2. Copy `.env.local.example` to `.env.local`.
3. Set `NEXT_PUBLIC_API_URL` to the Express API origin and `NEXT_PUBLIC_SITE_URL` to this app origin.
4. Run `npm run dev:client` from the root, or `npm run dev` to start both apps.

## Local demo access
- Admin: `admin@fixmate.local` / `FixMateAdmin123!`
- Technician: `tech1@fixmate.local` / `FixMateTech123!`
- Technician: `tech2@fixmate.local` / `FixMateTech123!`
- Customer: `customer@fixmate.local` / `FixMateCustomer123!`

These are development-only defaults from the server seed. Production credentials must be set privately in the server environment.

## Features
- Responsive Repair Console design, sticky navigation, mobile drawer and footer.
- Better Auth sign-up/sign-in with customer/technician selection and reload-safe session state.
- Service directory with URL-persistent search, category/mode filters, sorting and server pagination.
- Customer booking form and role-specific dashboards.
- Technician service CRUD, ImgBB uploads and strict booking actions.
- Admin user-role management, service moderation, bookings and transaction ledger.
- Visual repair timeline, charts, printable payment receipt and theme toggle.

## Environment variables
| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Public Express API origin, e.g. `http://localhost:5000` |
| `NEXT_PUBLIC_SITE_URL` | Client origin, e.g. `http://localhost:3000` |
| `API_URL` | Server-side auth proxy target; optional, defaults to `NEXT_PUBLIC_API_URL` |

No Better Auth secret, MongoDB URI, Stripe key or ImgBB key belongs in the client environment. Those are server-only.

## Packages
Next.js, React, Better Auth React client, Tailwind CSS v4, Lucide React, Sonner, TypeScript.
