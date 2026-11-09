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

## 🔑 1-Click Fast Switch Demo Personas

For effortless demonstration and defense grading, CapstoneHub features a **1-click authentication switcher** at **`/login`** with pre-seeded accounts:

| Persona | Role | Email | Password | Responsibility in Scenario |
| :--- | :--- | :--- | :--- | :--- |
| **Elena Rostova** | `SPONSOR` | `sponsor@novalabs.io` | `password123` | Formulate industry problem statements & verify NDA |
| **Dean Arthur Wright** | `ADMIN` | `admin@capstonehub.edu` | `password123` | Central analytics, opportunity approvals & cohort allocation |
| **Alex Chen** | `STUDENT` | `student@capstonehub.edu` | `password123` | Team Alpha lead: Apply, submit milestone deliverables, check similarity |
| **Dr. Robert Martinez** | `SUPERVISOR` | `supervisor@capstonehub.edu` | `password123` | Faculty Supervisor: Meeting minutes, action items & milestone approvals |
| **Prof. Sarah Jenkins** | `EXAMINER` | `examiner@capstonehub.edu` | `password123` | Lead Technical Evaluator: 6-part criteria evaluation (Score: 95.5) |
| **Dr. Vivek Sharma** | `EXAMINER` | `examiner2@capstonehub.edu` | `password123` | External Assessment Chair: Independent rubric evaluation (Score: 94.5) |
| **Prof. Claire Dubois** | `EXAMINER` | `examiner3@capstonehub.edu` | `password123` | Industry Liaison Member: Independent viva defense (Score: 93.5) |

---

## ⏱️ Recommended 15-Minute Live Demonstration Sequence

| Step | Timestamp | Active Role | Demonstration Script & Syllabus Evidence |
| :---: | :---: | :---: | :--- |
| **1** | `00:00 – 02:00` | **Industry Sponsor**<br/>(`Elena Rostova`) | **Formulate Opportunity Modal**: Open Sponsor Dashboard, click **Post New Problem Statement**. Enter problem background, required skills (*ROS2, Python, Next.js*), team constraints, and Steerpath NDA confidentiality. Problem enters `PENDING_APPROVAL`. |
| **2** | `02:00 – 03:30` | **Administrator**<br/>(`Dean Arthur Wright`) | **Central Overview & Approval Gate**: View dynamic institutional metrics (enrolled students, active projects, unique sponsors, pending approvals). Inspect problem statements and click **Approve Statement** to release to student marketplace. |
| **3** | `03:30 – 05:00` | **Student (Lead)**<br/>(`Alex Chen`) | **Marketplace Discovery & Bookmarking**: Navigate to `/marketplace`. Filter by category (`INDUSTRY_SPONSORED`), search `indoor navigation`, and review requirements. Click **Apply as Cohort** and submit a technical proposal. Two competing teams apply: `GeoPath Innovators (Team Alpha)` and `BeaconPath Tech (Team Beta)`. |
| **4** | `05:00 – 06:30` | **Admin / Committee** | **Allocation Review**: In the admin dashboard, compare proposals from Team Alpha and Team Beta. Click **Accept Team & Allocate Project**. Team Alpha is accepted; Team Beta is rejected. Project transitions to `ALLOCATED` and locks the team roster. |
| **5** | `06:30 – 08:30` | **All Stakeholders** | **Project Workspace (`/workspace/smart-campus-nav`)**: Open the dedicated workspace featuring 5 tab sections: Overview, Milestones, Meeting Logs, Multi-Examiner Rubrics, and Originality & IP. Demonstrates dynamic deep-linking (`?tab=MILESTONES`). |
| **6** | `08:30 – 10:30` | **Student & Supervisor** | **Milestones & Deliverable Review**: 5 structured stages (*Proposal 10%, Architecture 15%, Prototype 25%, Testing 20%, Final 30%*). Students submit release URLs; faculty supervisor approves or requests revisions with feedback notes. |
| **7** | `10:30 – 11:30` | **Supervisor**<br/>(`Dr. Robert Martinez`) | **Supervisor Meeting Logs**: Address invisible supervision by recording bi-weekly check-in minutes: date, attendees, discussion points, problems identified, decisions, action items, and satisfaction rating (5/5). Instantly syncs across student workspaces. |
| **8** | `11:30 – 13:00` | **3 Independent Examiners**<br/>(`Prof. Jenkins`, `Dr. Sharma`, `Prof. Dubois`) | **Multi-Examiner 6-Criteria Rubric (`/evaluation`)**: Evaluators grade under their own authenticated identity. Scores across 6 standardized criteria sum to 100. Admin has read-only access. Live radar chart visualizes criteria balance. Calculated composite: **94.5 / 100**. |
| **9** | `13:00 – 13:45` | **Sponsor & Supervisor** | **Originality & IP Governance Records**: Inspect the official similarity verification record (**12.0% similarity**, verified within the <15% threshold). Review Steerpath joint ownership, active NDA confidentiality terms, and academic publication clearance. |
| **10** | `13:45 – 15:00` | **Public Guest** | **Public Project Showcase (`/showcase`)**: Accessible without login. Displays full project abstract, problem/solution, tech tags, team members, supervisor, sponsor clearance, GitHub repository link, and live demo link for all 5 completed capstones. |

---

## 📊 Standard 6-Criteria Rubric Marksheet (Total: 100 Marks)

All 3 examiners evaluate the project independently using the departmental handbook criteria:

| Criterion | Maximum Marks | Description |
| :--- | :---: | :--- |
| **1. Technical Implementation** | **25** | System architecture, vector floorplan mapping, Dijkstra shortest path wayfinding |
| **2. Problem Understanding** | **15** | Domain knowledge, stakeholder bottleneck analysis, literature survey |
| **3. Innovation & Novelty** | **15** | Accessible multi-floor elevator transition matrices, indoor IoT positioning |
| **4. Documentation & Schema** | **15** | Entity-relationship design, API documentation, clean TypeScript typing |
| **5. Presentation & Viva Defense**| **15** | Defense rigor, viva answers, live interactive demonstration |
| **6. Project Outcome & Delivery** | **15** | Production readiness, Railway deployment, Steerpath NDA clearance |
| **Total Marks** | **100** | **Calculated aggregate across 3 independent evaluations: 94.5 / 100** |

---

## 🌟 Showcase Capstone Project Portfolio

In addition to the canonical Smart Campus Navigation System, CapstoneHub features 4 additional capstones in the public showcase gallery:

1. **Smart Campus Navigation System** — Autonomous indoor wayfinding and vector multi-floor routing (*Steerpath Smart IoT*).
2. **MindBridge AI Mental Health Companion** — Confidential empathetic conversational AI with sentiment analysis (*WellnessTech Labs*).
3. **CertChain Decentralized Credentialing** — Tamper-evident academic micro-credentials verified on Ethereum/Polygon (*EduLedger Foundation*).
4. **EcoTrack IoT Carbon Auditing** — Real-time facility energy monitoring and greenhouse gas emission ledger (*Verde Sustainable Energy*).
5. **SecureVote Zero-Knowledge Balloting** — End-to-end verifiable cryptographic campus voting with ZK-SNARKs (*CivicTech Institute*).

---

## 🎓 Curriculum & Syllabus Alignment

### Frontend Units (ReactJS & Web Engineering)
- **Unit I (ES6+ & React Fundamentals)**: Modular directory layout (`src/components/`, `src/lib/`, `src/context/`), immutable updates, destructuring, arrow functions.
- **Unit II (Component Design & Tailwind)**: Atomic design components (`Button`, `Card`, `Badge`, `Input`), responsive breakpoints, semantic HTML.
- **Unit III (States, Events & Hooks)**: Controlled form components, derived score sums, `useState`, `useEffect`, `useCallback`, `useMemo` (e.g. `filteredProjects` in marketplace).
- **Unit IV (Form Handling & Validation)**: Zod schemas (`validations.ts`) integrated with React Hook Form for client-side validation and typed error handling.
- **Unit V (Client-Server Communication & Routing)**: Next.js App Router dynamic routes (`/workspace/[id]`), tab query parameters (`?tab=...`), TanStack React Query caching.
- **Unit VI (State Architecture & Data Visualization)**: Zustand store (`useUIStore`, `useFilterStore`), Toast Context API, Recharts Radar chart visualizer for multi-examiner evaluations.

### Backend Units (Next.js & Server Systems)
- **Unit I (App Router & Routing)**: File-based routing, dynamic routes (`/workspace/[id]`), nested layouts, route loading boundaries (`loading.tsx`).
- **Unit II (Rendering Strategies & Data Fetching)**: SSR for authenticated role workspaces, SSG/ISR for public showcase (`/showcase`).
- **Unit III (REST API Route Handlers)**: Standard HTTP endpoints for CRUD, approval, allocation, and review workflows.
- **Unit IV (Authentication, RBAC & Database Integration)**: JWT session cookies, bcrypt password hashing, 7 relational PostgreSQL models in Prisma ORM (`User`, `Project`, `Team`, `ProjectApplication`, `Milestone`, `SupervisorLog`, `Evaluation`).
- **Unit V (Performance & SEO)**: Next.js Metadata API for public project cards, open-graph metadata, image optimization.
- **Unit VI (Security & Role-Based Authorization)**: Server-side RBAC guardrails enforcing role permissions across all mutation endpoints.

---

## 📂 Project Directory Structure

```plaintext
CapstoneHub/
├── prisma/
│   └── schema.prisma          # PostgreSQL relational schema (7 models, 6 enums)
├── public/                    # Static assets & public showcase media
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/          # Login, Register, Session handlers
│   │   │   ├── projects/      # Create, Approve, Apply, Allocate, Delete, Publish endpoints
│   │   │   ├── milestones/    # Create, Submit, Review milestone actions
│   │   │   ├── meetings/      # Supervisor meeting logs creation
│   │   │   └── evaluations/   # 6-criteria rubric submissions
│   │   ├── dashboard/         # Role-based workspace & central institutional overview
│   │   ├── workspace/[id]/    # Dedicated project workspace (5 deep-linked tabs)
│   │   ├── evaluation/        # Multi-examiner rubric scoring tool & radar visualizer
│   │   ├── marketplace/       # Problem discovery, filters, search & team application modal
│   │   ├── showcase/          # Public showcase for accredited capstones
│   │   ├── login/             # 1-Click demo authentication persona switcher
│   │   ├── loading.tsx        # Route-level loading spinner
│   │   ├── globals.css        # Tailwind directives & CSS variable tokens
│   │   ├── layout.tsx         # Root layout with Toast & Query Providers
│   │   └── page.tsx           # Platform landing page
│   ├── components/
│   │   ├── ui/                # Button, Badge, Card, Input primitive components
│   │   ├── navbar.tsx         # Responsive navigation & role indicators
│   │   ├── navigation-progress-bar.tsx # Route transition progress indicator
│   │   └── providers.tsx      # React Query Provider
│   ├── context/
│   │   └── toast-context.tsx  # React Context API toast notification system
│   └── lib/
│       ├── auth.ts            # JWT verification & session cookie helpers
│       ├── mock-db.ts         # Zero-config in-memory fallback store
│       ├── prisma.ts          # Singleton Prisma Client with connection resilience
│       ├── store.ts           # Zustand store (filter state & UI state)
│       ├── utils.ts           # clsx/tailwind-merge & date formatters
│       └── validations.ts     # Zod schema definitions
├── postcss.config.js          # PostCSS configuration
├── tailwind.config.js         # Tailwind CSS v3 theme configuration
├── tsconfig.json              # TypeScript strict configuration
└── package.json               # Full-stack dependencies & scripts
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
