# ⚡ TaskFlow Studio &bull; Full-Stack Project & Sprint Workspace

A full-stack, production-grade dynamic web application engineered as a high-impact **Web Programming Mini-Project**. Combines modern **React client-side dataflow**, custom **Vanilla CSS glassmorphic design system**, **PHP 8 server-side document & audit engine**, and a **Supabase PostgreSQL database** with real-time sync.

---

## 🎯 Syllabus & Technical Requirements Mapping

| Area | Implementation Details | File References |
| :--- | :--- | :--- |
| **Web Basics (HTML5 & CSS3)** | Semantic HTML structure, responsive fluid layouts, custom CSS variables, dark/light theming, micro-animations, glassmorphism. | `index.html`, `src/index.css` |
| **Client-Side (JavaScript & React)** | ES6+ async/await, unidirectional React dataflow, component modularity, state lifting, custom hooks, optimistic UI updates, filter & search. | `src/App.jsx`, `src/components/*` |
| **Server-Side Programming (PHP)** | Dedicated PHP 8+ microservice for executive sprint report aggregation, bottleneck detection, SHA-256 audit verification, and streaming CSV export. | `backend/api/report_generator.php`, `backend/api/export_tasks.php` |
| **Database Tier (Supabase / Postgres)** | PostgreSQL relational schema (`projects`, `tasks`, `activity_logs`), foreign keys, Row Level Security (RLS) policies, Realtime websocket hooks. | `supabase/schema.sql`, `src/lib/supabase.js` |
| **Version Control & DevOps** | Clean semantic Git commit history, branch structure, and environment variable protection. | `.gitignore`, `.env.example` |

---

## ✨ Key Features

1. **Interactive Kanban Board**:
   - 4 Agile Swimlanes: *To Do*, *In Progress*, *In Review*, *Done*.
   - Dynamic lane counter badges and lane-specific quick addition.
   - Smooth status progression controls with rewarding confetti celebration on task completion.

2. **Executive Telemetry & Analytics Dashboard**:
   - Real-time KPI cards: *Total Backlog*, *Completion Velocity (%)*, *In-Flight Items*, and *Overdue Alerts*.
   - Visual pipeline status and priority distribution bars.
   - Critical path & bottleneck risk radar table.

3. **PHP Server-Side Executive Audit Engine**:
   - Sends project backlog to `backend/api/report_generator.php`.
   - Computes sprint velocity, overdue flags, and generates a print-ready executive briefing document with a SHA-256 cryptographic audit seal.
   - Includes graceful client-side emulation if the PHP local server is paused.

4. **Instant Dual-Mode Data Persistence (Supabase + LocalStorage)**:
   - Works immediately out-of-the-box in interactive demo mode using browser storage.
   - One-click connection to cloud **Supabase PostgreSQL** via in-app configuration modal or `.env`.

5. **Theme Switching**:
   - Seamless toggle between Dark Obsidian and Clean Daylight themes.

---

## 🚀 Quick Start Guide

### ⚡ One-Click Windows Launcher (Fastest)
Simply double-click **`START_PROJECT.bat`** (or `start.bat`) in the root folder.
It will automatically:
- Check dependencies and install if missing
- Launch the PHP microservice (if PHP is installed)
- Start the Vite dev server on port `5173`
- Automatically open `http://localhost:5173` in your default browser!

---

### 1. Manual Terminal Launch
```bash
# Install dependencies
npm install

# Start Vite local development server
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

### 2. (Optional) Run the PHP Backend Microservice
When running with PHP (via PHP CLI or XAMPP):
```bash
# Start PHP built-in server pointing to backend folder
php -S localhost:8000 -t backend
```
The React frontend will automatically detect the live PHP engine at `http://localhost:8000/api/report_generator.php`.

---

### 3. Connect Your Supabase PostgreSQL Database
1. Go to [supabase.com](https://supabase.com) and create a free project.
2. Open the **SQL Editor** in your Supabase dashboard.
3. Open `supabase/schema.sql` in this repo, copy its contents, and click **Run**.
4. In the TaskFlow web app, click the **Supabase** badge in the top navigation bar, paste your **Project URL** and **Anon Key**, and click **Save & Connect**.
5. Live multi-client Postgres sync is now active!

---

## 📦 Connecting to Your Remote Git Repository

To push this codebase to your own GitHub repository:
```bash
# 1. Initialize git (if not already done)
git init

# 2. Stage and commit all files
git add .
git commit -m "feat: complete TaskFlow Studio full-stack project"

# 3. Rename branch to main
git branch -M main

# 4. Link your remote GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 5. Push to GitHub
git push -u origin main
```

---

## 📂 Directory Structure

```text
├── backend/
│   └── api/
│       ├── report_generator.php    # PHP Executive report & audit engine
│       └── export_tasks.php        # PHP Server-side CSV streaming endpoint
├── src/
│   ├── components/
│   │   ├── AnalyticsView.jsx       # Executive KPI dashboard & charts
│   │   ├── KanbanBoard.jsx         # 4-column agile board
│   │   ├── Navbar.jsx              # Workspace brand, project switch, badges
│   │   ├── PHPReportModal.jsx      # PHP executive document viewer
│   │   ├── ProjectHeader.jsx       # Sprint progress bar & team avatars
│   │   ├── SupabaseSettingsModal.jsx # Cloud database configuration
│   │   ├── TaskCard.jsx            # Interactive task cards with confetti
│   │   ├── TaskModal.jsx           # Task creation & editing dialog
│   │   └── Toast.jsx               # Floating toast notifications
│   ├── data/
│   │   └── initialData.js          # Seed dataset for instant demonstration
│   ├── lib/
│   │   └── supabase.js             # Supabase client & dynamic connection tester
│   ├── services/
│   │   └── reportService.js        # PHP service connector & CSV exporter
│   ├── App.jsx                     # Root component & unidirectional dataflow
│   ├── index.css                   # Vanilla CSS design tokens & animations
│   └── main.jsx                    # React DOM entry point
├── supabase/
│   └── schema.sql                  # PostgreSQL schema, RLS policies, seed data
├── index.html                      # Semantic HTML5 entry template
└── package.json                    # Project dependencies & scripts
```
