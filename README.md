# Bookly

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Booking backend setup

Bookings and availability use Neon Postgres. Before accepting bookings:

1. Create a Neon database and copy its pooled connection string.
2. In the Neon SQL Editor, run the SQL in [`database/schema.sql`](./database/schema.sql).
3. Add `DATABASE_URL=<your Neon connection string>` to `.env.local` for local development. Add the same variable to the Vercel project for Production, Preview, and Development.
4. Restart the local server or redeploy the Vercel project.

Do not commit `.env.local` or expose the connection string in client-side code. Booking routes return a configuration error until `DATABASE_URL` is set and the schema has been applied.

The public endpoints are `GET /api/availability?serviceId=<id>&date=YYYY-MM-DD` and `POST /api/bookings`. Booking times are fixed at UTC+02:00 year-round; the shop is open 09:00–17:00 and closed Sundays. The database prevents overlapping appointments. Email confirmations are not sent yet.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
