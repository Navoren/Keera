# Keera

Keera is a modern project management platform built with Next.js, designed to help teams organize, track, and deliver projects efficiently.

## Tech Stack

- [Next.js](https://nextjs.org/) – React framework for building web applications
- [Prisma](https://www.prisma.io/) – Type-safe ORM for database access
- [Clerk](https://clerk.com/) – Authentication and user management
- [NeonDB](https://neon.tech/) – Serverless PostgreSQL database
- [Vercel](https://vercel.com/) – Deployment platform

## Live Video Demo

Watch a walkthrough of Keera in action:

[![Watch the demo](https://img.youtube.com/vi/YOUR_VIDEO_ID_HERE/0.jpg)](https://www.youtube.com/watch?v=YOUR_VIDEO_ID_HERE)

> Click the image or [this link](https://x.com/nmntmr/status/1934999919619952951) to view the demo on X.

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/keera.git
cd keera
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory and add the following variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_URL_SIGN_IN=/onboarding
NEXT_PUBLIC_CLERK_SIGN_IN_URL_SIGN_UP=/onboarding

# Database
DATABASE_URL=your_neondb_connection_string

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Prisma
PRISMA_CLIENT_ENGINE_TYPE=binary

# Optional: Vercel
VERCEL_ENV=development
```

> Replace the values with your actual credentials.

### 4. Run Database Migrations

```bash
npx prisma migrate dev
```

### 5. Start the Development Server

```bash
npm run dev
# or
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the app.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Clerk Documentation](https://clerk.com/docs)
- [NeonDB Documentation](https://neon.tech/docs)

## Deployment

Deploy easily on [Vercel](https://vercel.com/). See [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying) for more info.

