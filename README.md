# Asaduzzaman Sumon — MERN Stack Portfolio

A modern, production-grade MERN stack (MongoDB, Express 5, React 19, Node.js) web portfolio cloned 1:1 pixel-perfect from the zero-framework vanilla platform. It preserves all custom physics engines (Verlet integration rope, Euler mass-spring damping, dual-canvas LiquidReveal cursor compositor, 3D perspective projection clock time tunnel, mechanical flip calendar, and Three.js WebGL card tilt) directly in native React hooks without any external animation libraries.

---

## 📁 Repository Structure

```
Portfolio/                          # Root Project Directory
├── client/                         # React Frontend (Vite + React 19)
│   ├── public/                     # SINGLE SOURCE OF TRUTH for all static assets
│   │   ├── ability-card/           # 3D WebGL ability card interactive sub-app
│   │   ├── app-developer/          # App developer interactive room sub-app
│   │   ├── card/                   # Holo card plate & background textures (.webp)
│   │   ├── fonts/                  # Onest Latin fluid variable typography (.woff2)
│   │   ├── graphic-designer/       # Graphic designer room sub-app & gallery assets
│   │   ├── legal/                  # Privacy policy and legal notices
│   │   ├── photographer/           # Photography showcase room sub-app
│   │   ├── ui-ux-designer/         # UI/UX design showcase room sub-app
│   │   ├── vendor/                 # Vendor libraries (lenis.min.mjs fallback)
│   │   ├── web-developer/          # Web developer room sub-app
│   │   ├── apple-touch-icon.png    # iOS touch icon
│   │   ├── favicon.ico             # Browser favicon
│   │   ├── favicon.svg             # Vector favicon
│   │   ├── icon-192.png            # PWA / mobile icon
│   │   ├── icons.svg               # SVG icon spritesheet
│   │   ├── profile.png             # Profile avatar image
│   │   ├── robots.txt              # Search engine crawler directives
│   │   └── sitemap.xml             # XML sitemap
│   ├── src/                        # React source code
│   │   ├── components/             # React components (physics, sections, modals)
│   │   │   ├── ContactModal.jsx    # Enquiry modal with honeypot & REST dispatch
│   │   │   ├── CookieConsent.jsx   # Google Analytics consent banner
│   │   │   ├── DoorsNavigation.jsx # 3D perspective doors wall & room launcher
│   │   │   ├── Footer.jsx          # Corner luminance detector & circular progress
│   │   │   ├── Header.jsx          # Live 12h ticking clock & ambient sound pill
│   │   │   ├── HeroSection.jsx     # Dual-canvas LiquidReveal & flip calendar
│   │   │   ├── HoloCardModal.jsx   # Three.js 3D holo card modal & CSS 3D fallback
│   │   │   ├── NavMenuModal.jsx    # Staggered navigation overlay
│   │   │   ├── PageLoader.jsx      # Initial counter (000-100%) & discipline pills
│   │   │   ├── PullCord.jsx        # 26-segment Verlet integration physics rope
│   │   │   └── StoryTimeTunnel.jsx # 3D canvas perspective time tunnel & odometer
│   │   ├── context/                # Global React contexts
│   │   │   ├── SmoothScrollContext.jsx # Lenis v1.3.23 smooth scrolling wrapper
│   │   │   └── ThemeContext.jsx    # Light / Charcoal theme state with View Transitions
│   │   ├── App.jsx                 # Master layout & keyboard event delegator
│   │   ├── index.css               # Global CSS tokens, fluid typography, 3D rules
│   │   └── main.jsx                # React DOM entry point
│   ├── dist/                       # Vite production build output (git-ignored)
│   ├── index.html                  # React HTML entry shell
│   ├── package.json                # Frontend dependencies (React 19, Lenis, Vite)
│   └── vite.config.js              # Vite bundler configuration
│
├── server/                         # Node.js & Express 5 Backend
│   ├── models/                     # Mongoose schemas
│   │   └── Contact.js              # Contact submission schema with sanitization
│   ├── server.js                   # Express 5 REST server & static React handler
│   ├── .env.example                # Environment configuration template
│   └── package.json                # Backend dependencies (Express 5, Mongoose, CORS)
│
├── .gitignore                      # Git ignore rules (node_modules, dist, .env)
├── package.json                    # Root workspace script manager
└── README.md                       # Comprehensive documentation
```

---

## ⚡ Quick Start

### 1. Prerequisites
- **Node.js**: v18.0.0 or later (v20+ recommended)
- **npm**: v9.0.0 or later
- **MongoDB** *(optional)*: Local instance on `mongodb://127.0.0.1:27017` or remote MongoDB Atlas connection string. (If offline, server runs gracefully in memory-fallback mode).

### 2. Install Dependencies

Install root, client, and server dependencies:
```bash
# In the root Portfolio/ directory
npm install --prefix client
npm install --prefix server
```

### 3. Environment Setup

Create an environment file for the server:
```bash
cp server/.env.example server/.env
```

Default configuration in `server/.env`:
```env
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/portfolio
NODE_ENV=development
```

---

## 🛠️ Development & Production Scripts

All scripts can be executed directly from the root project directory:

| Command | Action | Description |
| :--- | :--- | :--- |
| `npm run dev` | **Client Dev Server** | Launches Vite dev server at `http://localhost:5173` |
| `npm run server` | **Backend Dev Server** | Launches Express dev server with `--watch` at `http://localhost:5001` |
| `npm run build` | **Production Build** | Builds optimized client bundle into `client/dist/` |
| `npm start` | **Production Server** | Starts Express production server serving client and REST API |

---

## 🎨 Physics & Mathematical Engines

The React application implements all original vanilla physics without external animation libraries:

1. **Verlet Integration Rope (`PullCord.jsx`)**:
   - 26-segment particle chain governed by $dt = 1/120\text{s}$, 16 relaxation constraint passes, gravity $G = 4600\text{ px/s}^2$.
   - Mass-spring anchor damping ($K = 760\text{ N/m}$, $C = 21\text{ Ns/m}$).
   - Sleep optimization when motion drops below $0.06$ for $>30$ consecutive frames.
   - Dual-pass Canvas 2D rendering with natural cotton braid weave and walnut pull knob.
   - Integrates with the native browser View Transitions API (`::view-transition`).

2. **Dual-Canvas LiquidReveal Compositor (`HeroSection.jsx`)**:
   - Cursor velocity vector tracking with soft radial gradient mask stamps.
   - `destination-out` and `lighter` compositing blend modes dynamically revealing high-vibrancy color imagery over monochrome base.
   - Integrated mechanical desk flip calendar reflecting live day, month, and year.

3. **3D Perspective Projection Time Tunnel (`StoryTimeTunnel.jsx`)**:
   - Canvas 2D perspective engine simulating a camera traveling along $camZ = p \times (N - 1) \times GAP \times 1.6 + t \times 18$.
   - 16 concentric rings winding backwards ($spin = -p \times \pi \times 1.5 - t \times 0.02$) with 60 clock ticks, long hour markers, and rotating dial hands.
   - 70 ambient dust motes in 3D perspective space with distance fog attenuation.
   - 4-digit odometer vertical drum roll with staggered cubic-bezier transitions.

4. **Corner Luminance Dynamic Contrast (`Footer.jsx`)**:
   - Adaptive background sampling using `document.elementFromPoint` and RGB luminance calculation:
     $$\text{Luminance} = 0.2126R + 0.7152G + 0.0722B$$
   - Dynamically toggles dark/light theme tokens for seamless legibility.
   - Sticky circular SVG scroll progress indicator tracking viewport traversal.

5. **Perspective 3D Doors Wall (`DoorsNavigation.jsx`)**:
   - Interactive 3D doors gallery with mobile snap slider, smooth scroll inertia, and walk-through zoom handoff into discipline room sub-applications.

6. **Interactive Holographic Ability Card (`HoloCardModal.jsx`)**:
   - Interactive ability card modal loading WebGL 3D card via iframe (`/ability-card/`) with postMessage progress tracking, gyroscopic cursor tilt physics, and hardware-accelerated CSS 3D fallback (`/card/win_bg.webp`, `/card/plate.webp`, `/card/back.webp`).

---

## 🔒 Backend API Endpoints

The Express 5 server in `server/server.js` provides:

- `GET /api/health` — Returns JSON server health status and database connectivity.
- `POST /api/contact` — Validates submission (name, email, project message), enforces honeypot spam filtering, sanitizes inputs, logs client metadata (IP, user agent), and saves to MongoDB with offline fallback.
- `/*` — SPA catch-all route serving `client/dist/index.html` for client-side routing (`/home`, `/work`, `/my-story`).
- Static file server mapping `client/dist` for all public assets and sub-applications.
