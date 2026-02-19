# DayOS — Daily Planner

A full-featured daily planner with task management, habit building, and energy tracking.

## Stack
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **LocalStorage** (default, no backend needed)

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run dev server
npm run dev

# 3. Open http://localhost:3000
```

## Deploy to Vercel

```bash
# Option A — Vercel CLI
npm i -g vercel
vercel

# Option B — Git
# Push to GitHub, then import at vercel.com/new
# No env vars needed for the LocalStorage version
```

## Folder Structure

```
daily-planner/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main app shell
│   └── globals.css         # Global styles + Tailwind
├── components/
│   ├── ui/
│   │   ├── BottomNav.tsx   # Tab navigation
│   │   ├── FAB.tsx         # Floating action button
│   │   ├── Modal.tsx       # Reusable modal
│   │   ├── ProgressBar.tsx # Progress bar
│   │   └── Toast.tsx       # Toast notifications
│   ├── planner/
│   │   ├── DailyPanel.tsx  # Today's tasks view
│   │   ├── TaskItem.tsx    # Individual task card
│   │   ├── TaskForm.tsx    # Add/edit task form
│   │   └── WeeklySummary.tsx # Stats view
│   ├── habits/
│   │   ├── HabitsPanel.tsx # Habits list
│   │   ├── HabitCard.tsx   # Habit with streak calendar
│   │   └── HabitForm.tsx   # Add habit form
│   └── energy/
│       └── EnergyPanel.tsx # Sleep/mood/water tracker
├── hooks/
│   ├── usePlanner.ts       # Main state + CRUD logic
│   └── useToast.ts         # Toast notification state
├── lib/
│   ├── utils.ts            # Pure utility functions
│   └── storage.ts          # LocalStorage persistence
└── types/
    └── index.ts            # TypeScript types
```

## Upgrade to Production (Auth + Database)

### 1. Add Supabase
```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
```

### 2. Add Prisma
```bash
npm install prisma @prisma/client
npx prisma init
```

### 3. Schema (prisma/schema.prisma)
```prisma
model Task {
  id          String   @id @default(cuid())
  userId      String
  title       String
  completed   Boolean  @default(false)
  isMIT       Boolean  @default(false)
  priority    String   @default("medium")
  date        String
  createdAt   DateTime @default(now())
}

model Habit {
  id          String   @id @default(cuid())
  userId      String
  name        String
  category    String
  icon        String
  targetDays  Int      @default(7)
  completions String[] // array of dates
  createdAt   DateTime @default(now())
}
```

### 4. Replace storage.ts
Point `loadState`/`saveState` to API routes in `app/api/` that use Prisma Client.

### 5. Add Auth (Supabase)
Wrap layout with `SessionContextProvider` and add `/login` page.

### Env vars for production
```env
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
```
