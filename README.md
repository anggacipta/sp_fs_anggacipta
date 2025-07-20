# Task Project Management App

A collaborative project and task management app built with Next.js, Prisma, NextAuth, and Tailwind CSS.

## Fitur Utama
- Autentikasi user (NextAuth)
- Dashboard project & task
- CRUD project & task
- Kanban board drag-and-drop
- Analytics chart (task status)
- Export data project ke JSON
- Project settings (invite member, delete, edit nama)

## Instalasi & Setup

### 1. Clone Repository
```
git clone https://github.com/anggacipta/sp_fs_anggacipta.git
cd sp_fs_anggacipta
```

### 2. Install Dependencies
```
npm install
```

### 3. Setup Environment
Salin file `.env.example` menjadi `.env` lalu edit isinya sesuai konfigurasi lokal Anda:
```
cp .env.example .env
```
Lalu edit variabel berikut di `.env`:
```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
```

### 4. Setup Database
- Jalankan migrasi Prisma:
```
npx prisma migrate dev --name init
```
- (Opsional) Generate client:
```
npx prisma generate
```

### 5. Jalankan Development Server
```
npm run dev
```
Akses di [http://localhost:3000](http://localhost:3000)

## Fitur Lain
- Edit nama project di halaman settings
- Export semua project ke JSON
- Chart analytics task
- Responsive UI (Tailwind)

## Struktur Folder Penting
- `src/app/` : Halaman Next.js (dashboard, projects, settings, API)
- `prisma/` : Schema & migrasi database
- `src/lib/prisma.ts` : Inisialisasi Prisma Client

## Kontribusi
Pull request & issue sangat diterima!

---

**By anggacipta Team**
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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
