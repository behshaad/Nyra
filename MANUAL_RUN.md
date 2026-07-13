# Manual Run

Use these steps to run Nyra locally by hand.

## Prerequisites

- Node.js is installed.
- Dependencies are installed with `npm install`.
- The database connection required by Prisma is available in your environment.

## Start the Development Server

```bash
npm run dev
```

The app should be available at:

```text
http://localhost:3000
```

If another process already uses port `3000`, Next.js may choose another port. In this workspace, the app is often run at:

```text
http://localhost:3001
```

## Useful Local Pages

```text
http://localhost:3001/practice?ui=en
http://localhost:3001/practice/a1?ui=en
http://localhost:3001/learn?ui=en
```

## Database Setup

Generate the Prisma client after dependency changes:

```bash
npm run prisma:generate
```

Push the Prisma schema to the database:

```bash
npm run db:push
```

Seed local sample content:

```bash
npm run db:seed
```

## Verification Commands

```bash
npm run typecheck
npm run lint
npm run test
```

## Stop the Server

Press `Ctrl+C` in the terminal running `npm run dev`.
