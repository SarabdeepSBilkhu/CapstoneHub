# CapstoneHub: Final-Year Capstone & Industry-Sponsored Project Management Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.4.3-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3.0-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-6.6.0-2D3748?logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Railway-4169E1?logo=postgresql)](https://railway.app/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **B.Tech CSE Capstone Project & Course Platform**  
> Complete end-to-end capstone lifecycle governance platform: from industry problem formulation, committee gatekeeping, competitive cohort discovery, and supervisor check-in logs, to multi-examiner rubric scoring, originality compliance, and public accreditation showcase.

**Live Production URL:** [https://capstonehub-production.up.railway.app](https://capstonehub-production.up.railway.app)  
**Repository:** [https://github.com/SarabdeepSBilkhu/CapstoneHub.git](https://github.com/SarabdeepSBilkhu/CapstoneHub.git)

---

## 🧭 The 10-Step Capstone Project Lifecycle

CapstoneHub models a continuous, realistic capstone lifecycle following the canonical **Smart Campus Navigation System** (sponsored by **Steerpath**) and 4 additional engineering capstones across 5 distinct user roles and 10 milestones:

```mermaid
flowchart TD
    A["Step 1: Sponsor Formulates Problem Statement<br/>(Elena Rostova - Steerpath)"] --> B["Step 2: Admin Approves Opportunity<br/>(Dean Arthur Wright)"]
    B --> C["Step 3: Students Discover & Compete<br/>(Team Alpha vs. Team Beta)"]
    C --> D["Step 4: Committee Allocates Team<br/>(GeoPath Innovators Accepted)"]
    D --> E["Step 5: Dedicated Project Workspace<br/>(/workspace/smart-campus-nav)"]
    E --> F["Step 6: 5-Stage Weighted Milestones<br/>(Submission & Feedback Cycle)"]
    F --> G["Step 7: Supervisor Meeting Logs<br/>(Dr. Martinez - Action Items & Minutes)"]
    G --> H["Step 8: 3-Examiner Rubric Evaluation<br/>(100 Marks & Radar Visualizer)"]
    H --> I["Step 9: Originality & NDA Governance<br/>(Similarity Record & IP Terms)"]
    I --> J["Step 10: Public Project Showcase<br/>(/showcase - SSG/ISR & SEO)"]
```

---

## 👥 5 Role-Based Access Control (RBAC) Stakeholders

Every persona is isolated with strict server-side authorization guardrails and tailored UI views:

| Role | Primary Persona | Key Permissions & Responsibilities |
| :--- | :--- | :--- |
| **`SPONSOR`** | Elena Rostova (*Steerpath Smart IoT*) | Submit industry challenge statements, set IP/NDA terms, review deliverable progress, track university IP clearance. |
| **`ADMIN`** | Dean Arthur Wright (*Academic Dean*) | Institutional oversight, approve/reject sponsor proposals, allocate student cohorts, delete obsolete projects, inspect audit logs. |
| **`STUDENT`** | Alex Chen (*GeoPath Innovators / Team Alpha*) | Browse marketplace, submit competitive proposals, track milestones, submit GitHub release deliverables, inspect originality index. |
| **`SUPERVISOR`** | Dr. Robert Martinez (*Faculty Guide*) | Bi-weekly meeting minutes, log student action items & satisfaction ratings, approve/request revisions on milestone deliverables. |
| **`EXAMINER`** | Prof. Sarah Jenkins, Dr. Sharma, Prof. Dubois | Independent 6-criteria rubric grading (max 100 marks), qualitative defense remarks, radar chart visualization. (Locked to own evaluator identity). |

---

## 📂 Project Directory Structure

```plaintext
CapstoneHub/
├── prisma/
│   └── schema.prisma                     # PostgreSQL relational schema (7 models, 6 enums)
├── public/                               # Static assets & public showcase media
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/                     # Login, Register, Session handlers
│   │   │   ├── projects/                 # Create, Approve, Apply, Allocate, Delete, Publish endpoints
│   │   │   ├── milestones/               # Create, Submit, Review milestone actions
│   │   │   ├── meetings/                 # Supervisor meeting logs creation
│   │   │   └── evaluations/              # 6-criteria rubric submissions
│   │   ├── dashboard/                    # Role-based workspace & central institutional overview
│   │   ├── workspace/[id]/               # Dedicated project workspace (5 deep-linked tabs)
│   │   ├── evaluation/                   # Multi-examiner rubric scoring tool & radar visualizer
│   │   ├── marketplace/                  # Problem discovery, filters, search & team application modal
│   │   ├── showcase/                     # Public showcase for accredited capstones
│   │   ├── login/                        # 1-Click demo authentication persona switcher
│   │   ├── loading.tsx                   # Route-level loading spinner
│   │   ├── globals.css                   # Tailwind directives & CSS variable tokens
│   │   ├── layout.tsx                    # Root layout with Toast & Query Providers
│   │   └── page.tsx                      # Platform landing page
│   ├── components/
│   │   ├── ui/                           # Button, Badge, Card, Input primitive components
│   │   ├── navbar.tsx                    # Responsive navigation & role indicators
│   │   ├── navigation-progress-bar.tsx   # Route transition progress indicator
│   │   └── providers.tsx                 # React Query Provider
│   ├── context/
│   │   └── toast-context.tsx             # React Context API toast notification system
│   └── lib/
│       ├── auth.ts                       # JWT verification & session cookie helpers
│       ├── mock-db.ts                    # Zero-config in-memory fallback store
│       ├── prisma.ts                     # Singleton Prisma Client with connection resilience
│       ├── store.ts                      # Zustand store (filter state & UI state)
│       ├── utils.ts                      # clsx/tailwind-merge & date formatters
│       └── validations.ts                # Zod schema definitions
├── postcss.config.js                     # PostCSS configuration
├── tailwind.config.js                    # Tailwind CSS v3 theme configuration
├── tsconfig.json                         # TypeScript strict configuration
└── package.json                          # Full-stack dependencies & scripts
```

---

## 🚀 Getting Started & Local Setup

### 1. Prerequisites
- **Node.js** >= 20.x
- **npm** >= 9.x
- *(Optional)* PostgreSQL instance (local or Railway/Supabase/Neon).
  > **Note:** CapstoneHub includes an automated zero-config fallback store (`mockDb`). If a database connection is not provided or fails, the platform automatically serves and mutates in-memory data, enabling instant evaluation without local database configuration.

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/SarabdeepSBilkhu/CapstoneHub.git
cd CapstoneHub

# Install dependencies
npm install
```

### 3. Environment Variables
Create or verify your `.env` file in the root directory:
```env
# Database connection string (optional - falls back to mockDb if omitted or unreachable)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/capstonehub?schema=public"

# Auth & JWT Configuration
JWT_SECRET="super-secret-capstone-jwt-token-key-2026-production"
NEXTAUTH_SECRET="super-secret-capstone-jwt-token-key-2026-production"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Running the Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 5. Production Build
```bash
npm run build
npm run start
```

---

## 🚢 Production Deployment to Railway

1. Push your repository to **GitHub**:
   ```bash
   git push origin main
   ```
2. Log in to [Railway](https://railway.app) and create a **New Project** connected to the GitHub repository.
3. In the Railway dashboard:
   - Provision a **PostgreSQL** database service.
   - Set the `DATABASE_URL` environment variable under your Next.js service settings.
   - Add `JWT_SECRET` and `NEXT_PUBLIC_APP_URL` matching your domain.
4. Railway will automatically build and deploy the container.

---

## 📄 License
This project is developed as part of the B.Tech Computer Science & Engineering course curriculum. Distributed under the MIT License.
