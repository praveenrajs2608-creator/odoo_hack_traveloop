# ✈️ Traveloop — AI-Powered Travel Planning Platform

<div align="center">

![Traveloop Banner](https://img.shields.io/badge/Traveloop-AI%20Travel%20Planner-F5A623?style=for-the-badge&logo=airplane&logoColor=white)

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer-Motion-0055FF?style=flat-square&logo=framer&logoColor=white)](https://framer.com/motion)

**Traveloop** is a premium, AI-powered trip planning web app built for travellers who want a seamless, intelligent way to plan, budget, and manage their travel itineraries — from a single weekend escape to a multi-city adventure.

</div>

---

## 🌟 Features

### 👤 User Portal
| Feature | Description |
|---|---|
| **Authentication** | Email/password sign-up & Google OAuth via Supabase Auth |
| **Dashboard** | Personalized home with trip stats, recent activity, and quick actions |
| **Trip Creation** | Form with AI prompt generator, destination suggestions, date picker, and budget |
| **Day-by-Day Builder** | Calendar-based itinerary planner — one card per day, add activities per time slot |
| **Trip Detail View** | Inline activity editing and deletion without leaving the page |
| **Budget Tracker** | Overview + professional invoice view with expense breakdown and PDF export |
| **Packing List** | Checklist for trip essentials with category management |
| **Trip Notes** | Journal-style notes with search, day/stop tabs, and filtering |
| **Cities Explorer** | Browse top India & international destinations with budget levels and season tags |
| **Where2Go Quiz** | 5-step interactive quiz powered by Gemini AI for personalized recommendations |
| **Activities** | Search, filter, and browse activities by type, location, and cost |
| **Community** | Travel community section for sharing trips and experiences |
| **Profile** | User profile management |

### 🛡️ Admin Portal (Isolated)
| Feature | Description |
|---|---|
| **Secure Login** | Separate `/admin/login` route authenticated against environment variables |
| **Admin Dashboard** | Analytics with Area, Donut, and Bar charts (Recharts) — user metrics, budgets, activity |
| **City Cost Settings** | CRUD interface for managing destination costs, budget levels, and seasonal availability |
| **Trip Cost Settings** | Cost matrix for transport/stay/activities pricing and platform-wide settings |
| **Platform Settings** | Global config — platform name, notifications, security, theme colors |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 14](https://nextjs.org) (App Router, TypeScript) |
| **Database & Auth** | [Supabase](https://supabase.com) (PostgreSQL, Row-Level Security, OAuth) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com) v3 |
| **Animations** | [Framer Motion](https://framer.com/motion) |
| **Charts** | [Recharts](https://recharts.org) |
| **Maps** | [Leaflet](https://leafletjs.com) + [React Leaflet](https://react-leaflet.js.org) (OpenStreetMap — no API key needed) |
| **AI** | [Google Gemini API](https://ai.google.dev) (`@google/generative-ai`) |
| **Drag & Drop** | [@dnd-kit](https://dndkit.com) |
| **Email** | [Resend](https://resend.com) |
| **Notifications** | [OneSignal](https://onesignal.com) |
| **Forms** | [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) |
| **Icons** | [Lucide React](https://lucide.dev) |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+
- **npm** or **yarn**
- A **Supabase** project (free tier works)
- A **Google Gemini** API key

### 1. Clone the repository

```bash
git clone https://github.com/your-username/traveloop.git
cd traveloop
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the project root:

```env
# ── Supabase ──────────────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# ── App ───────────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ── Google Gemini AI ──────────────────────────────────────────
GEMINI_API_KEY=your_gemini_api_key

# ── Resend (Email) ────────────────────────────────────────────
RESEND_API_KEY=re_your_resend_key

# ── OneSignal (Push Notifications) ───────────────────────────
NEXT_PUBLIC_ONESIGNAL_APP_ID=your_app_id
ONESIGNAL_API_KEY=os_v2_your_key

# ── Admin Portal ──────────────────────────────────────────────
ADMIN_EMAIL=admin@traveloop.com
ADMIN_PASSWORD=your_secure_admin_password
```

> **⚠️ Important:** Never commit `.env.local` to version control. It is already listed in `.gitignore`.

### 4. Set up the Supabase database

Run the SQL migrations in your Supabase SQL editor (from the `supabase/` folder):

```bash
# Tables required:
# - users (managed by Supabase Auth)
# - trips
# - stops
# - activities
# - packing_items
# - trip_notes
# - cities
```

Enable **Row Level Security (RLS)** on all tables and add policies so users can only access their own data.

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
traveloop/
├── app/
│   ├── (auth)/              # Login, Sign-up pages
│   ├── (dashboard)/         # Main user app (protected)
│   │   ├── page.tsx         # Dashboard home
│   │   ├── trips/
│   │   │   ├── page.tsx     # My Trips list
│   │   │   ├── new/         # Create new trip
│   │   │   └── [tripId]/
│   │   │       ├── page.tsx    # Trip detail (editable timeline)
│   │   │       ├── builder/    # Day-by-day calendar planner
│   │   │       ├── budget/     # Budget tracker + invoice
│   │   │       ├── packing/    # Packing checklist
│   │   │       └── notes/      # Trip journal / notes
│   │   ├── cities/          # Destination explorer + Where2Go quiz
│   │   ├── activities/      # Activity search & discovery
│   │   ├── community/       # Community feed
│   │   └── profile/         # User profile
│   ├── admin/               # Isolated admin portal
│   │   ├── login/           # Admin-only login
│   │   ├── page.tsx         # Admin dashboard (charts & analytics)
│   │   ├── cities/          # City cost management
│   │   ├── trips/           # Trip cost matrix settings
│   │   └── settings/        # Platform-wide configuration
│   └── api/                 # API Routes
│       ├── admin/login/     # Admin auth endpoint
│       ├── ai/generate-itinerary/  # Gemini AI trip generator
│       └── cities/recommend/       # Gemini AI city recommender
├── components/
│   ├── layout/              # Sidebar, Topbar, DashboardLayout
│   ├── trips/               # TripCard, TripMapView, InvoiceView
│   ├── cities/              # CityCard, Where2Go quiz
│   └── ui/                  # Toast, shared UI primitives
├── hooks/
│   ├── useStops.ts          # Supabase stops CRUD hook
│   └── useTrips.ts          # Supabase trips CRUD hook
├── lib/
│   ├── supabase/client.ts   # Supabase browser client
│   └── utils.ts             # Shared utilities
├── types/                   # TypeScript interfaces (Trip, Stop, Activity, City)
├── supabase/                # SQL migrations
├── .env.local               # Environment variables (not committed)
└── tailwind.config.ts       # Tailwind theme (navy + amber palette)
```

---

## 🔐 Admin Portal

The admin portal is **completely separated** from the user app.

| URL | Description |
|---|---|
| `/admin/login` | Admin-only login page |
| `/admin` | Analytics dashboard |
| `/admin/cities` | Manage city pricing & settings |
| `/admin/trips` | Trip cost matrix & platform config |
| `/admin/settings` | Global platform settings |

**Default credentials** (from `.env.local`):
```
Email:    admin@traveloop.com
Password: admin123
```

> **🔒 Security Note:** In production, use a strong password and consider upgrading to full JWT-based authentication.

---

## 🎨 Design System

| Token | Value |
|---|---|
| **Primary** | Navy `#0F1B2D` |
| **Accent** | Amber `#F5A623` |
| **Font** | Inter (Google Fonts) |
| **Border Radius** | `rounded-2xl` / `rounded-3xl` |
| **Shadows** | Soft card shadows with amber glow on CTAs |

---

## 📱 Key User Flows

### Creating a Trip
1. Click **"Plan New Trip"** in the sidebar
2. Optionally use the **AI Generator** (type a prompt like *"5-day Goa trip ₹20,000 beaches"*)
3. Fill in trip name, dates, destination, and budget
4. Click **"Create Trip & Build Itinerary"**
5. A 3-step progress overlay appears → then a **success popup** when done
6. Click "Go to Itinerary Builder" to start planning day-by-day

### Building an Itinerary
1. Each day between your start and end date has its own **card**
2. Click **"Add Activity"** on any day
3. Choose a **type** (Sightseeing, Food, Adventure, Shopping, Nightlife, Leisure, Travel)
4. Choose a **time of day** (🌅 Morning / ☀️ Afternoon / 🌆 Evening / 🌙 Night)
5. Add name, cost, and notes → press Enter or ✓

### Editing Activities
- **Hover** any activity row in the trip detail view to reveal ✏️ edit and 🗑️ delete icons
- Click ✏️ to edit the name and cost **inline**

---

## 🧪 Available Scripts

```bash
npm run dev      # Start development server at localhost:3000
npm run build    # Build production bundle
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## 🗺️ Roadmap

- [ ] Connect Admin city/trip settings to live Supabase tables
- [ ] JWT-based admin authentication
- [ ] PDF export for Budget Invoice
- [ ] Full community feed with trip sharing
- [ ] Mobile-responsive improvements
- [ ] Push notification integration (OneSignal)
- [ ] Offline support with PWA

---

## 📄 License

This project is **private** and not open-source. All rights reserved.

---

<div align="center">
  <p>Built with ❤️ using Next.js, Supabase, and Google Gemini AI</p>
  <p><strong>Traveloop v1.0</strong> — AI-Powered Travel Planning</p>
</div>
