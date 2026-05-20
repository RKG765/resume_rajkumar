# 🚀 Raj Kumar Gupta — Developer Portfolio

A high-performance, AI-powered developer portfolio built with **Next.js 16**, **Tailwind CSS v4**, and **shadcn/ui**. Features live GitHub integration with AI-generated project descriptions and a LinkedIn post suggestion engine.

## ✨ Features

### 🏠 Hero Section
- Animated blur-text name reveal with **Fira Code** typography
- Profile photo with hover zoom effect
- Dark/light theme toggle with smooth transitions
- Responsive navigation with smooth scroll to all sections

### 📂 Dynamic Projects (GitHub + AI)
- **Live data from GitHub** — fetches all repositories automatically
- **Gemini 2.5 Flash** generates portfolio descriptions from README files
- **Auto-updates** — ISR revalidates every hour, new repos appear without rebuilds
- **Live Demo badges** — auto-detected from GitHub `homepage` field

### 📄 Project Detail Pages (`/projects/[slug]`)
- Full README content display
- **Commit timeline** — last 20 commits, auto-refreshed daily
- **Live Demo button** (if project is deployed)
- **AI-generated LinkedIn post** — ready to copy and share
- Link to GitHub source code

### 🤖 AI Integration
| Provider | Model | Purpose |
|---|---|---|
| **Google Gemini** | `gemini-2.5-flash` | Project descriptions (cards + detail pages) |
| **Google Gemini** | `gemini-2.5-flash` | LinkedIn post suggestions |
| **Groq** | `llama-3.3-70b-versatile` | Available for future features |

### 🎨 Design
- Premium dark theme with lime green (#C3E41D) accent
- Glassmorphism project cards with hover effects
- Scroll-triggered fade-in animations on all sections
- Fully responsive — mobile, tablet, desktop

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Fonts | Fira Code, Antic (Google Fonts via `next/font`) |
| AI | Google Gemini 2.5 Flash, Groq LLM |
| APIs | GitHub REST API v3 |
| Deployment | Vercel-ready |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── projects/
│   │       ├── route.ts           # GET /api/projects (list)
│   │       └── [slug]/route.ts    # GET /api/projects/:slug (detail)
│   ├── projects/
│   │   └── [slug]/page.tsx        # Project detail page
│   ├── layout.tsx                 # Root layout + fonts + SEO
│   ├── page.tsx                   # Homepage orchestrator
│   └── globals.css                # Tailwind + shadcn theme
├── components/ui/
│   ├── portfolio-hero.tsx         # Hero section + fixed nav
│   ├── about-section.tsx          # Bio + skills grid
│   ├── projects-section.tsx       # Project cards grid
│   ├── experience-section.tsx     # Experience + Education timeline
│   └── contact-section.tsx        # Contact links + footer
└── lib/
    ├── types.ts                   # TypeScript interfaces
    ├── github.ts                  # GitHub API service
    ├── gemini.ts                  # Gemini 2.5 Flash service
    └── groq.ts                    # Groq LLM service
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
git clone https://github.com/rkg765/portfolio-21dev.git
cd portfolio-21dev
npm install
```

### Environment Variables

Create a `.env.local` file:

```env
# Gemini API Key — for project descriptions
GEMINI_API_KEY=your_gemini_key

# Gemini API Key 2 — for LinkedIn post generation
GEMINI_API_KEY_LINKEDIN=your_gemini_key_2

# Groq API Key — for future features
GROQ_API_KEY=your_groq_key
```

### Run Development Server

```bash
npm run dev
# Open http://localhost:3000
```

### Build for Production

```bash
npm run build
npm start
```

---

## 🔄 How Auto-Updates Work

1. Push a new repo to GitHub
2. Within **1 hour**, ISR revalidates and fetches the new repo
3. Gemini reads the README and generates a description
4. A new project card appears on the homepage — **zero manual work**
5. The project detail page shows commit history, refreshed **daily**

---

## 👤 About

**Raj Kumar Gupta** — B.Tech CSE @ BML Munjal University (CGPA: 7.3)

- 🌐 [Portfolio](https://localhost:3000)
- 💻 [GitHub](https://github.com/rkg765)
- 💼 [LinkedIn](https://www.linkedin.com/in/rajkumar098/)
- 📧 rajkumargupta7632@gmail.com

---

## 📄 License

MIT © Raj Kumar Gupta
