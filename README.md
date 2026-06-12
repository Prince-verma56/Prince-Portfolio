<div align="center">

# Prince Verma — Portfolio

**Creative Developer & AI Engineer**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-princeverma.vercel.app-f04e00?style=for-the-badge&logo=vercel&logoColor=white)](https://princeverma.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=for-the-badge&logo=typescript)](https://typescriptlang.org)

A cinematic, high-performance personal portfolio built with Next.js 16, GSAP, Three.js, and WebGL — featuring a custom liquid-distortion hero, animated preloader, 3D model viewer, scroll-driven parallax, and a fully animated 404 page.

<br/>

[![Portfolio Preview](public/Images/Home%20Page.png)](https://princeverma.vercel.app)

</div>

---

## ✨ Features

- **Cinematic Preloader** — GSAP-driven letter-scatter assembly animation
- **Liquid Hero** — WebGL-powered fluid distortion canvas
- **3D Model Viewer** — Three.js / React Three Fiber integration
- **Scroll-Driven Animations** — GSAP ScrollTrigger pinning, parallax, clip-path reveals
- **Work Showcase** — Mouse-tracking + scroll parallax on project images
- **Animated 404 Page** — Glitch loop, floating particles, brand-matched typography
- **Contact Form** — Nodemailer via Gmail App Password
- **Audio Dock** — Ambient background music with visualiser
- **Smooth Cursor** — Custom follower cursor (no system cursor)
- **Lenis Smooth Scroll** — Hardware-accelerated native-feel scrolling
- **Full SEO** — Metadata, OG tags, JSON-LD structured data, robots

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, TypeScript 5 |
| Styling | Tailwind CSS v4, shadcn/ui |
| Animation | GSAP 3, Framer Motion |
| 3D / WebGL | Three.js, React Three Fiber, OGL |
| Smooth Scroll | Lenis |
| Email | Nodemailer (Gmail) |
| Font | Space Grotesk, Geist |
| Deploy | Vercel (recommended) / Docker |

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- **Node.js 20+** — [download](https://nodejs.org)
- **Git** — [download](https://git-scm.com)

```bash
# 1. Clone the repo
git clone https://github.com/Prince-verma56/Prince-Portfolio.git
cd Prince-Portfolio

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# → Open .env.local and fill in EMAIL_USER and EMAIL_PASS

# 4. Start the dev server
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** — the app hot-reloads on every save.

### Environment Variables

| Variable | Description |
|---|---|
| `EMAIL_USER` | Gmail address used by the contact form |
| `EMAIL_PASS` | [Gmail App Password](https://myaccount.google.com/apppasswords) (16 chars, not your real password) |

> **Never commit `.env.local`.** It is already in `.gitignore`.

---

## 🐳 Docker

Dockerizing is **recommended when you want to self-host on a VPS** (DigitalOcean, Linode, Hetzner, etc.) or when you need a fully reproducible environment that anyone can spin up with a single command — regardless of their OS or Node version.

> If you are deploying to **Vercel**, skip Docker entirely — Vercel handles the build pipeline automatically and is the fastest path for a Next.js app.

### Why Docker here?
| Scenario | Use Docker? |
|---|---|
| Deploy to Vercel / Netlify / Railway | ❌ Not needed |
| Self-host on a VPS / bare-metal | ✅ Yes |
| Want others to run it locally without installing Node | ✅ Yes |
| CI/CD pipeline that builds a portable artefact | ✅ Yes |

---

### Option A — Docker Compose (Recommended)

**Development** (hot-reload, source mounted):
```bash
docker compose --profile dev up
```

**Production** (optimised multi-stage build, ~200 MB image):
```bash
# Build + start in detached mode
docker compose --profile prod up -d --build

# View logs
docker compose --profile prod logs -f

# Stop
docker compose --profile prod down
```

App runs on **[http://localhost:3000](http://localhost:3000)**.

---

### Option B — Raw Docker CLI

```bash
# Build the production image
docker build -t prince-portfolio .

# Run (pass secrets as env vars — never bake them into the image)
docker run -d \
  -p 3000:3000 \
  -e EMAIL_USER="your-email@gmail.com" \
  -e EMAIL_PASS="your-app-password" \
  --name portfolio \
  prince-portfolio
```

---

### Deploying the Docker Image to a VPS

#### 1. Push image to Docker Hub (or GHCR)
```bash
# Tag
docker tag prince-portfolio yourdockerhubuser/prince-portfolio:latest

# Push
docker push yourdockerhubuser/prince-portfolio:latest
```

#### 2. SSH into your VPS
```bash
ssh user@your-vps-ip
```

#### 3. Pull & run
```bash
docker pull yourdockerhubuser/prince-portfolio:latest

docker run -d \
  -p 80:3000 \
  -e EMAIL_USER="your-email@gmail.com" \
  -e EMAIL_PASS="your-app-password" \
  --restart unless-stopped \
  --name portfolio \
  yourdockerhubuser/prince-portfolio:latest
```

Your site is now live on **http://your-vps-ip**.

#### 4. (Optional) HTTPS with Nginx + Certbot
```bash
# Install Nginx & Certbot
sudo apt install nginx certbot python3-certbot-nginx -y

# Create Nginx site config
sudo nano /etc/nginx/sites-available/portfolio
```

Paste this config (replace `yourdomain.com`):
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass         http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site & reload Nginx
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# Issue SSL certificate (free, auto-renewing)
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

✅ Site is now live at **https://yourdomain.com** with auto-renewing HTTPS.

---

## ☁️ Deploy to Vercel (Easiest)

```bash
npm install -g vercel
vercel
```

Or connect your GitHub repo at **[vercel.com/new](https://vercel.com/new)** and add the environment variables in the Vercel dashboard under **Settings → Environment Variables**.

| Key | Value |
|---|---|
| `EMAIL_USER` | your-email@gmail.com |
| `EMAIL_PASS` | your-16-char-app-password |

Vercel will auto-build and deploy on every push to `main`.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (inner)/          # Inner pages (about, works, contact)
│   ├── api/              # API routes (contact form endpoint)
│   ├── globals.css       # Global styles & design tokens
│   ├── layout.tsx        # Root layout — fonts, metadata, providers
│   ├── not-found.tsx     # Animated 404 page
│   └── page.tsx          # Home page
├── components/
│   ├── sections/         # Page sections (Hero, About, Work, etc.)
│   ├── global/           # AudioDock, AudioInitializer
│   ├── ui/               # shadcn/ui components
│   ├── Navbar.tsx
│   ├── Preloader.tsx     # GSAP letter-scatter preloader
│   └── ...
├── context/              # React contexts (Loader, Audio)
├── data/                 # Static data (projects, testimonials)
├── hooks/                # Custom hooks
└── lib/                  # Utilities
```

---

## 🤝 Using This as a Template

1. **Fork** this repository on GitHub
2. `git clone` your fork
3. `cp .env.example .env.local` and fill in your credentials
4. Edit `src/data/` to replace project data, testimonials, and bio
5. Replace Cloudinary URLs in `page.tsx` with your own media
6. Update `metadataBase` URL in `layout.tsx` to your domain
7. `npm run dev` — you're good to go

---

## 📜 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server (hot-reload) |
| `npm run build` | Build production bundle |
| `npm run start` | Start production server (after build) |
| `npm run lint` | Run ESLint |

---

## 📄 License

MIT © [Prince Verma](https://princeverma.vercel.app)

---

<div align="center">
  Built with ❤️ by <strong>Prince Verma</strong> — Bachelors of Computer and Applications
</div>
