# CapstoneHub: Final-Year Capstone & Industry-Sponsored Project Management Platform

> **B.Tech CSE Course Project**  
> Complete End-to-End Project Lifecycle Demonstration Platform built with ReactJS, Next.js App Router, TypeScript, Tailwind CSS, PostgreSQL, and Prisma ORM. Targeted for deployment on Railway.

---

## 🧭 Main Demonstration: Complete Project Lifecycle ("Smart Campus Navigation System")

CapstoneHub demonstrates a single, realistic, continuous project scenario: the **Smart Campus Navigation System** (sponsored by **Steerpath**), following the project across all 5 user roles and 10 lifecycle stages from formulation to public showcase.

```mermaid
flowchart TD
    A["Step 1: Sponsor Formulates Problem Statement<br/>(Elena Rostova - Steerpath)"] --> B["Step 2: Admin Approves Opportunity<br/>(Dean Arthur Wright)"]
    B --> C["Step 3: Students Discover & Compete<br/>(Team Alpha vs. Team Beta)"]
    C --> D["Step 4: Committee Allocates Team<br/>(GeoPath Innovators Accepted)"]
    D --> E["Step 5: Dedicated Project Workspace<br/>(/workspace/smart-campus-nav)"]
    E --> F["Step 6: 5-Stage Weighted Milestones<br/>(Submission & Feedback Cycle)"]
    F --> G["Step 7: Supervisor Meeting Logs<br/>(Dr. Martinez - Action Items)"]
    G --> H["Step 8: 3-Examiner Rubric Evaluation<br/>(100 Marks & Radar Visualizer)"]
    H --> I["Step 9: Originality (12%) & NDA Governance<br/>(Similarity Record & IP Terms)"]
    I --> J["Step 10: Public Project Showcase<br/>(/showcase - SSG/ISR & SEO)"]
```

---

## ⏱️ Recommended 15-Minute Live Demonstration Sequence

| Step | Timestamp | Active Role | Demonstration Script & Syllabus Evidence |
| :---: | :---: | :---: | :--- |
| **1** | `00:00 – 02:00` | **Industry Sponsor**<br/>(`Elena Rostova`) | **Formulate Opportunity Modal**: Open Sponsor Dashboard, click **Post New Problem Statement**. Fill out title, problem background, required skills (*Next.js, React, PostgreSQL, Maps API*), team size limit (4), deadline, and Steerpath NDA confidentiality. Shows *Zod schema validation*, *React Hook Form*, and *role authorization*. Status is `PENDING_APPROVAL`. |
| **2** | `02:00 – 04:00` | **Administrator**<br/>(`Dean Arthur Wright`) | **Central Overview & Approval Gate**: View administrative statistics (*128 Students, 32 Projects, 8 Sponsors, 12 Pending*). Inspect the submitted problem statement, click **Approve Statement**. Demonstrates *server-side mutation* and status update to `APPROVED`, automatically publishing it to the student marketplace. |
| **3** | `04:00 – 06:00` | **Student (Lead)**<br/>(`Alex Chen`) | **Marketplace Discovery & Bookmarking**: Navigate to `/marketplace`. Filter by category (`INDUSTRY_SPONSORED`), search `indoor navigation`, and bookmark. Click **Apply as Cohort** and submit a technical proposal. Two competing teams apply: `GeoPath Innovators (Team Alpha)` and `BeaconPath Tech (Team Beta)`. Shows *dynamic filtering (`useMemo`)*, *query parameters*, and *REST Route Handlers*. |
| **4** | `06:00 – 07:00` | **Admin / Supervisor** | **Allocation Review**: In the admin dashboard, compare proposals from Team Alpha and Team Beta. Click **Accept Team & Allocate Project**. Team Alpha is accepted; Team Beta is rejected. Project transitions to `ALLOCATED` and locks the team roster. |
| **5** | `07:00 – 09:00` | **All Stakeholders** | **Project Workspace (`/workspace/smart-campus-nav`)**: Open the dedicated workspace featuring 5 tab sections: Overview, Milestones, Meeting Logs, Multi-Examiner Rubrics, and Originality & IP. Demonstrates *Next.js dynamic routing (`/workspace/[id]`)*, *nested tabs*, and *shared component composition*. |
| **6** | `09:00 – 11:00` | **Student & Supervisor** | **Milestones & Deliverable Review**: 5 structured stages (*Proposal 10%, Design 15%, Prototype 25%, Testing 20%, Final 30%*). Switch to Alex Chen to submit deliverable GitHub URLs. Switch to Dr. Martinez to review, request revisions, or approve submissions with qualitative feedback. Progress percentage recalculates dynamically. |
| **7** | `11:00 – 12:00` | **Supervisor**<br/>(`Dr. Robert Martinez`) | **Supervisor Meeting Logs**: Address invisible supervision by recording bi-weekly check-in minutes: date, attendees, discussion points, problems identified (*multi-floor graph intersections*), decisions, action items, and satisfaction rating (5/5). Instantly syncs and appears in Alex Chen's student workspace. |
| **8** | `12:00 – 13:30` | **3 Independent Examiners**<br/>(`Prof. Jenkins`, `Dr. Sharma`, `Prof. Dubois`) | **Multi-Examiner 6-Criteria Rubric (`/evaluation`)**: Switch between 3 independent faculty accounts. Score across: Technical Implementation (25), Problem Understanding (15), Innovation (15), Documentation (15), Presentation (15), and Project Outcome (15). Live derived radar chart (Recharts) visualizes criteria balance. Calculated final score: **94.5 / 100**. |
| **9** | `13:30 – 14:00` | **Sponsor & Supervisor** | **Originality & IP Governance Records**: Inspect the official similarity verification record (**12.0% similarity**, verified 18 December, under 15% threshold). Review Steerpath joint ownership, active NDA confidentiality terms, and academic defense publication clearance. |
| **10** | `14:00 – 15:00` | **Public Guest** | **Public Project Showcase (`/showcase`)**: Accessible without login. Displays full project abstract, problem/solution, tech tags, team members, supervisor, sponsor clearance, GitHub repository link, and live demo link. Demonstrates *Next.js SSG/ISR*, *Metadata SEO API*, and *public accessibility*. |

---

## 🔑 1-Click Fast Switch Demo Personas

On **`http://localhost:3000/login`**, click any of the 1-click persona buttons for instant testing:

| Persona | Role | Email | Password | Responsibility in Scenario |
| :--- | :--- | :--- | :--- | :--- |
| **Elena Rostova** | `SPONSOR` | `sponsor@novalabs.io` | `password123` | Steerpath Sponsor: Formulate problem statements & NDA |
| **Dean Arthur Wright** | `ADMIN` | `admin@capstonehub.edu` | `password123` | Academic Dean: Institutional analytics, approvals & team allocation |
| **Alex Chen** | `STUDENT` | `student@capstonehub.edu` | `password123` | Team Alpha Lead: Apply, submit milestone deliverables, check similarity |
| **Dr. Robert Martinez** | `SUPERVISOR` | `supervisor@capstonehub.edu` | `password123` | Faculty Supervisor: Meeting minutes, action items & milestone approvals |
| **Prof. Sarah Jenkins** | `EXAMINER` | `examiner@capstonehub.edu` | `password123` | Lead Technical Examiner: 6-part criteria evaluation (Score: 95.5) |
| **Dr. Vivek Sharma** | `EXAMINER` | `examiner2@capstonehub.edu` | `password123` | External Examiner: Independent assessment (Score: 94.5) |
| **Prof. Claire Dubois** | `EXAMINER` | `examiner3@capstonehub.edu` | `password123` | Industry Liaison Examiner: Independent viva defense (Score: 93.5) |

---

## 🎓 100% Curriculum & Syllabus Alignment

### Frontend Units (ReactJS)
- **Unit I (ES6+ & React Fundamentals)**: Arrow functions, `let`/`const`, immutability, destructuring, spread/rest, modular directory layout (`src/components/`, `src/lib/`, `src/context/`).
- **Unit II (Component Design & Tailwind)**: Atomic components (`Button`, `Card`, `Badge`, `Input`), composition patterns, lifting state up, responsive Tailwind breakpoints (`sm:`, `md:`, `lg:`), semantic HTML.
- **Unit III (States, Events & Hooks)**: Controlled form components, derived score sums, `useState`, `useEffect`, `useCallback`, `useMemo` (e.g. `filteredProjects` in marketplace).
- **Unit IV (Form Handling & Validation)**: Zod schemas (`validations.ts`) integrated with React Hook Form for client-side validation and typed error handling.
- **Unit V (Client-Server Communication & Routing)**: Next.js App Router dynamic routes (`/workspace/[id]`), search query parameters, TanStack React Query caching.
- **Unit VI (State Architecture & Data Visualization)**: Zustand store (`useUIStore`, `useFilterStore`), Toast Context API, Recharts Radar chart visualizer for multi-examiner evaluations.

### Backend Units (Next.js)
- **Unit I (App Router & Routing)**: File-based routing, dynamic routes (`/workspace/[id]`), nested layouts, loading/error UI boundaries.
- **Unit II (Rendering Strategies & Data Fetching)**: SSR for role workspaces, SSG/ISR for public showcase (`/showcase`).
- **Unit III (REST API Route Handlers)**: RESTful endpoints with standard HTTP methods (`POST /api/projects/create`, `POST /api/projects/approve`, `POST /api/projects/apply`, `POST /api/projects/allocate`, `POST /api/milestones/action`, `POST /api/meetings/create`, `POST /api/evaluations/submit`, `POST /api/projects/publish`).
- **Unit IV (Authentication, RBAC & Database Integration)**: JWT session cookies, bcrypt password hashing, 7 relational PostgreSQL models in Prisma ORM (`User`, `Project`, `Team`, `ProjectApplication`, `Milestone`, `SupervisorLog`, `Evaluation`).
- **Unit V (Performance & SEO)**: Next.js Metadata API for public project cards, open-graph metadata, image optimization.
- **Unit VI (Security & Role-Based Authorization)**: Server-side RBAC guardrails enforcing role permissions across all mutation endpoints.

---

## 📊 Standard 6-Criteria Rubric Marksheet (Total: 100 Marks)

All 3 examiners evaluate the project independently using the departmental handbook criteria:

| Criterion | Maximum Marks | Description |
| :--- | :---: | :--- |
| **Technical Implementation** | **25** | System architecture, vector floorplan mapping, Dijkstra shortest path wayfinding |
| **Problem Understanding** | **15** | Domain knowledge, stakeholder bottleneck analysis, literature survey |
| **Innovation & Novelty** | **15** | Accessible multi-floor elevator transition matrices, indoor IoT positioning |
| **Documentation & Schema** | **15** | Entity-relationship design, API documentation, clean TypeScript typing |
| **Presentation & Viva Defense**| **15** | Defense rigor, viva answers, live interactive demonstration |
| **Project Outcome & Delivery** | **15** | Production readiness, Railway deployment, Steerpath NDA clearance |
| **Total Marks** | **100** | **Calculated aggregate across 3 independent evaluations: 94.5 / 100** |

---

## 📂 Project Directory Structure

```plaintext
CapstoneHub/
├── prisma/
│   └── schema.prisma          # PostgreSQL relational schema (7 models, 6 enums)
├── public/                    # Static assets
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/          # Login, Register, Session handlers
│   │   │   ├── projects/      # Create, Approve, Apply, Allocate, Publish endpoints
│   │   │   ├── milestones/    # Create, Submit, Review milestone actions
│   │   │   ├── meetings/      # Supervisor meeting logs creation
│   │   │   └── evaluations/   # 6-criteria rubric submissions
│   │   ├── dashboard/         # Role-based workspace & central institutional overview
│   │   ├── workspace/[id]/    # Dedicated project workspace (5 tabs: Timeline, Milestones, Meetings, Rubrics, IP)
│   │   ├── evaluation/        # Multi-examiner rubric scoring tool & radar visualizer
│   │   ├── marketplace/       # Problem discovery, filters, search & team application modal
│   │   ├── showcase/          # Public showcase for accredited capstones
│   │   ├── login/             # 1-Click demo authentication persona switcher
│   │   ├── globals.css        # Tailwind directives & CSS variable tokens
│   │   ├── layout.tsx         # Root layout with Toast & Query Providers
│   │   └── page.tsx           # Platform landing page
│   ├── components/
│   │   ├── ui/                # Button, Badge, Card, Input primitive components
│   │   ├── navbar.tsx         # Responsive navigation & role indicators
│   │   └── providers.tsx      # React Query Provider
│   ├── context/
│   │   └── toast-context.tsx  # React Context API toast notification system
│   └── lib/
│       ├── auth.ts            # JWT verification & session cookie helpers
│       ├── mock-db.ts         # Resilient zero-config fallback store (Smart Campus Case Study)
│       ├── prisma.ts          # Singleton Prisma Client
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
- **Node.js** >= 18.x
- **npm** >= 9.x
- *(Optional)* PostgreSQL instance (local or Railway/Supabase/Neon). An automatic in-memory fallback is active if PostgreSQL is unconfigured, allowing immediate zero-friction evaluation.

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/your-username/CapstoneHub.git
cd CapstoneHub

# Install dependencies
npm install
```

### 3. Environment Variables
Verify your `.env` file in the root directory:
```env
# Database connection string
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

---

## 🚢 Production Deployment to Railway

1. Push your repository to **GitHub**.
2. Log in to [Railway](https://railway.app) and create a **New Project** connected to the GitHub repository.
3. In the Railway dashboard:
   - Provision a **PostgreSQL** database service.
   - Link `DATABASE_URL` to your Next.js service environment.
   - Add `JWT_SECRET` and `NEXT_PUBLIC_APP_URL`.
4. Railway will automatically build and deploy via `npm run build && npm run start`.
