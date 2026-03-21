# Dashboard Yayasan Peduli Ilmu

Dashboard manajemen donasi dan program yayasan. Dibangun dengan Next.js, Prisma, dan Supabase.

## Prerequisites

- [Node.js](https://nodejs.org/) (v20+)
- [pnpm](https://pnpm.io/)
- [Docker](https://www.docker.com/) & Docker Compose (untuk database lokal)

## Menjalankan Development Lokal

### 1. Clone & Install Dependencies

```bash
git clone <repository-url>
cd dashboard-yayasan-peduli-ilmu
pnpm install
```

### 2. Jalankan PostgreSQL (Docker)

```bash
docker compose up -d
```

Database PostgreSQL akan berjalan di `localhost:5432`.

| Config   | Value             |
| -------- | ----------------- |
| Host     | localhost         |
| Port     | 5432              |
| User     | postgres          |
| Password | postgres          |
| Database | dashboard_yayasan |

### 3. Setup Environment Variables

Salin `.env.example` ke `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` untuk development:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_key

# Local PostgreSQL (Docker)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/dashboard_yayasan"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/dashboard_yayasan"

JWT_SECRET="secretkeybro"
```

> **Catatan:** `.env.local` memiliki prioritas lebih tinggi dari `.env`. Gunakan `.env.local` untuk konfigurasi local agar tidak menimpa pengaturan production.

### 4. Generate Prisma Client & Run Migrations

```bash
pnpm db:generate
pnpm db:migrate
```

### 5. Seed Database (Opsional)

```bash
pnpm db:seed
```

Akun default yang dibuat:

| Email                       | Password |
| --------------------------- | -------- |
| admin@yayasanpeduliilmu.com | admin123 |

### 6. Jalankan Development Server

```bash
pnpm dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

---

## Database Commands

| Command           | Deskripsi                          |
| ----------------- | ---------------------------------- |
| `pnpm db:generate` | Regenerasi Prisma Client           |
| `pnpm db:migrate`  | Jalankan migration ke database     |
| `pnpm db:seed`     | Isi data awal (users, programs, dll) |
| `pnpm db:studio`   | Buka Prisma Studio di browser     |

---

## Quick Start (Ringkasan)

```bash
pnpm install
docker compose up -d
cp .env.example .env.local
# (edit .env.local dengan nilai yang sesuai)
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm dev
```
