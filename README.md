# propnews24 — India News Platform 🇮🇳

A modern, full-stack news aggregation platform built with **React 19**, **Node.js**, **Express**, and **MongoDB**. Features real-time India news, JWT authentication, AI-powered summaries, comments, bookmarks, polls, PWA support, and a full admin dashboard.

> **Live domain:** `prop-news.ddns.net`

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Local Development Setup](#local-development-setup)
5. [Environment Variables](#environment-variables)
6. [API Reference](#api-reference)
7. [AI Features](#ai-features)
8. [AWS EC2 Production Deployment](#aws-ec2-production-deployment)
9. [Nginx Configuration](#nginx-configuration)
10. [Updating the App](#updating-the-app)
11. [Useful Commands](#useful-commands)
12. [Security Features](#security-features)
13. [Performance Optimizations](#performance-optimizations)
14. [Roadmap](#roadmap)

---

## Features

### User Features
- 🔐 JWT-based authentication (register, login, profile)
- 📰 Real-time India news from NewsAPI
- 🔍 Search and filter by category
- 🤖 AI-powered summaries (Gemini), vibe filter, and related articles
- 💬 Comments on articles
- 🔖 Bookmarks — save articles for later
- 📖 Reading history tracking
- 📊 Daily polls with voting
- 📱 Progressive Web App (PWA) — installable on mobile/desktop
- 🔔 Newsletter subscription
- 💳 Stripe subscription support

### Admin Features
- 📊 Analytics dashboard
- 👥 User management
- 📝 Comment moderation
- 🏷️ Category management
- ⚙️ Site settings

### Technical Highlights
- Auth-gated content — news only for logged-in users
- Image validation — only articles with valid images shown
- Auto-refresh news feed
- SEO optimized (meta tags, Open Graph, Schema.org)
- Rate limiting, CORS, Helmet security headers
- Gzip compression, static asset caching, code splitting

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 7, React Router 7, Tailwind CSS 4, Axios |
| Backend | Node.js, Express 4, Mongoose 8, JWT, Bcrypt |
| Database | MongoDB (Atlas recommended) |
| AI | Google Gemini AI, Natural (NLP/TF-IDF), Sentiment |
| Scraping | Puppeteer, Cheerio |
| Payments | Stripe |
| Email | Nodemailer (Gmail SMTP) |
| Process Manager | PM2 |
| Web Server | Nginx |
| SSL | Certbot (Let's Encrypt) |
| Hosting | AWS EC2 (Ubuntu 22.04) |

---

## Project Structure

```
news-minor-project/
├── Backend/
│   ├── src/
│   │   ├── config/          # DB, env, upload, seed configs
│   │   ├── controllers/
│   │   │   ├── admin/       # Admin controllers
│   │   │   ├── user/        # Authenticated user controllers
│   │   │   └── visitor/     # Public (unauthenticated) controllers
│   │   ├── middlewares/     # Auth, role, rate limit, validation, error
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # Express route definitions
│   │   ├── services/        # Business logic layer
│   │   └── utils/           # Helpers (asyncHandler, cache, logger, etc.)
│   ├── logs/                # PM2 log output
│   ├── uploads/             # User-uploaded files
│   ├── ecosystem.config.cjs # PM2 process config
│   ├── server.js            # Entry point
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── config/          # Axios instance config
│   │   ├── lib/             # Utility functions
│   │   └── pages/           # Page-level components
│   ├── public/              # Static assets
│   ├── dist/                # Production build output
│   ├── vite.config.js
│   └── package.json
│
├── nginx.conf               # Production Nginx config
└── README.md
```

---

## Local Development Setup

### Prerequisites
- Node.js 22+ and npm
- MongoDB 6+ (local) or MongoDB Atlas URI
- [NewsAPI key](https://newsapi.org) (free tier available)
- [Gemini API key](https://aistudio.google.com) (optional — for AI summaries)

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO/news-minor-project
```

### 2. Backend setup

```bash
cd Backend
npm install
cp .env.production.example .env
# Edit .env with your values (see Environment Variables section)
npm run dev
```

Backend runs on: `http://localhost:5000`

### 3. Frontend setup

```bash
cd Frontend
npm install
# Create .env file
echo "VITE_API_URL=http://localhost:5000" > .env
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

## Environment Variables

### Backend — `Backend/.env`

```env
NODE_ENV=development
PORT=5000

# MongoDB
MONGO_URI=mongodb://localhost:27017/propnews24
# For Atlas: mongodb+srv://USER:PASS@cluster.mongodb.net/newsdb?retryWrites=true&w=majority

# Auth
JWT_SECRET=replace_with_64_char_random_string

# CORS
CLIENT_URL=http://localhost:5173

# News
NEWS_API_KEY=your_newsapi_key

# AI (optional — Smart Summaries only)
GEMINI_API_KEY=your_gemini_api_key

# Stripe (optional — subscription feature)
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Email (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
```

Generate a strong JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Frontend — `Frontend/.env`

```env
VITE_API_URL=http://localhost:5000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
```

---

## API Reference

### Public Endpoints (no auth required)
```
GET  /api/v1/visitor/news           # List all news
GET  /api/v1/visitor/news/:slug     # Single article by slug
```

### Auth Endpoints
```
POST  /api/v1/user/auth/register    # Register
POST  /api/v1/user/auth/login       # Login
GET   /api/v1/user/auth/me          # Current user (auth required)
```

### User Endpoints (auth required)
```
PUT   /api/v1/user/profile                    # Update profile

GET   /api/v1/visitor/news/external           # External news feed
GET   /api/v1/user/categories                 # List categories

GET   /api/v1/user/bookmarks                  # Get bookmarks
POST  /api/v1/user/bookmarks/:url             # Add bookmark
DELETE /api/v1/user/bookmarks/:id             # Remove bookmark

GET   /api/v1/user/reading-history            # Get history
POST  /api/v1/user/reading-history            # Track read
DELETE /api/v1/user/reading-history/:id       # Delete entry

GET   /api/v1/user/polls/today                # Poll of the day
POST  /api/v1/user/polls/:id/vote             # Vote on poll

GET   /api/v1/user/comments/news/:url         # Get comments
POST  /api/v1/visitor/news/:id/comments       # Add comment
PUT   /api/v1/user/comments/:id               # Edit comment
DELETE /api/v1/user/comments/:id              # Delete comment

GET   /api/v1/user/ai/status                  # AI availability
POST  /api/v1/user/ai/summary                 # Smart summary
POST  /api/v1/user/ai/sentiment               # Sentiment analysis
POST  /api/v1/user/ai/filter-by-vibe          # Vibe filter
POST  /api/v1/user/ai/cluster                 # Related articles
```

### Admin Endpoints (admin role required)
```
GET    /api/v1/admin/analytics       # Analytics
GET    /api/v1/admin/users           # All users
PUT    /api/v1/admin/users/:id       # Update user
DELETE /api/v1/admin/users/:id       # Delete user
GET    /api/v1/admin/news            # All news
POST   /api/v1/admin/news            # Create article
PUT    /api/v1/admin/news/:id        # Update article
DELETE /api/v1/admin/news/:id        # Delete article
```

---

## AI Features

### Smart Summaries (Gemini AI)
Generates bullet-point summaries of articles. Requires `GEMINI_API_KEY`. If the key is absent, the summary button is hidden — all other AI features still work.

### Vibe Filter
Filters news by emotional tone: **Positive**, **Critical**, or **Balanced**. Uses local sentiment analysis — no API key needed.

### Related Articles
TF-IDF clustering to surface the 3 most related articles on any detail page. Runs entirely locally with the `natural` library.

---

## AWS EC2 Production Deployment

### Prerequisites
- AWS EC2 — Ubuntu 22.04 LTS, t2.small or better
- Elastic IP attached to the instance
- Domain A record pointing to the Elastic IP
- MongoDB Atlas cluster ready
- EC2 Security Group inbound rules:
  - Port 22 (SSH)
  - Port 80 (HTTP)
  - Port 443 (HTTPS)
  - **Do NOT open port 5000** — Nginx proxies it internally

---

### Step 1 — Connect and update the server

```bash
ssh -i your-key.pem ubuntu@YOUR_EC2_IP

sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl build-essential
```

---

### Step 2 — Install NVM and Node 22

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc

nvm install 22
nvm use 22
nvm alias default 22

node -v   # should print v22.x.x
npm -v
```

---

### Step 3 — Install PM2

```bash
npm install -g pm2

# Run the startup command PM2 prints — it looks like:
pm2 start server.js
# Copy and run the sudo command it outputs, e.g.:
#   pm2 start server.js or any other files name like ecosystem.config.cjs by setting the things for files name according to server.js
```

---

### Step 4 — Install Nginx

```bash
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

---

### Step 5 — Clone the repository

```bash
cd /home/ubuntu
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git project-minor
cd project-minor/news-minor-project
```

---

### Step 6 — Backend: install dependencies and configure

```bash
cd /home/ubuntu/project-minor/news-minor-project/Backend
npm install --omit=dev
```

Create the production `.env`:

```bash
nano .env
```

```env
NODE_ENV=production
PORT=5000

MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/newsdb?retryWrites=true&w=majority

JWT_SECRET=REPLACE_WITH_64_CHAR_RANDOM_STRING

CLIENT_URL=https://yourdomain.com

NEWS_API_KEY=your_newsapi_key
GEMINI_API_KEY=your_gemini_key

STRIPE_SECRET_KEY=sk_live_your_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
```

---

### Step 7 — Frontend: build for production

```bash
cd /home/ubuntu/project-minor/news-minor-project/Frontend
npm install
```

Create the production `.env`:

```bash
nano .env
```

```env
VITE_API_URL=https://yourdomain.com
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_key
```

Build:

```bash
npm run build
# Output: Frontend/dist/
```

---

### Step 8 — Start with PM2

```bash
cd /home/ubuntu/project-minor/news-minor-project/Backend
pm2 start ecosystem.config.cjs
pm2 save
```

Check status:

```bash
pm2 status
pm2 logs propnews-backend
```

---

### Step 9 — Configure Nginx

```bash
sudo cp /home/ubuntu/project-minor/news-minor-project/nginx.conf \
        /etc/nginx/sites-available/propnews24

# Edit the domain name if needed
sudo nano /etc/nginx/sites-available/propnews24

sudo ln -sf /etc/nginx/sites-available/propnews24 /etc/nginx/sites-enabled/propnews24
sudo rm -f /etc/nginx/sites-enabled/default

sudo nginx -t
sudo systemctl reload nginx
```

---

### Step 10 — SSL with Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx

sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com \
  --non-interactive --agree-tos -m your@email.com

# Test auto-renewal
sudo certbot renew --dry-run
```

---

### Step 11 — Upload directory permissions

```bash
sudo mkdir -p /home/ubuntu/project-minor/news-minor-project/Backend/uploads
sudo chown -R ubuntu:ubuntu /home/ubuntu/project-minor/news-minor-project/Backend/uploads
sudo chmod -R 755 /home/ubuntu/project-minor/news-minor-project/Backend/uploads
```

---

---

## Nginx Configuration

The `nginx.conf` in the project root is the production config. Key behaviours:

- HTTP → HTTPS redirect (301)
- React SPA served from `Frontend/dist/` with `try_files` fallback to `index.html`
- `/api/` proxied to `http://127.0.0.1:5000`
- Stricter rate limit on auth routes (`/api/v1/(user|admin)/auth/`)
- Stripe webhook passthrough with raw body and `stripe-signature` header
- Hashed JS/CSS assets cached for 1 year (`immutable`)
- Service worker (`sw.js`) served with `no-cache` headers
- Uploaded files served directly from `Backend/uploads/`
- Security headers: HSTS, X-Frame-Options, CSP, Referrer-Policy, Permissions-Policy
- Gzip enabled for text, JSON, JS, CSS, SVG, manifest

---

## Updating the App

```bash
cd /home/ubuntu/project-minor
git pull

# Rebuild frontend
cd news-minor-project/Frontend
npm install
npm run build

# Restart backend
cd ../Backend
npm install --omit=dev
pm2 restart propnews-backend
pm2 save
```

---

## Useful Commands

### PM2

```bash
pm2 status                      # List all processes
pm2 logs propnews-backend       # Stream backend logs
pm2 restart propnews-backend    # Restart backend
pm2 stop all                    # Stop everything
pm2 monit                       # Live resource dashboard
```

### Nginx

```bash
sudo nginx -t                           # Test config
sudo systemctl reload nginx             # Reload without downtime
sudo tail -f /var/log/nginx/propnews24-error.log
```

### Development

```bash
# Backend
npm start          # Production start
npm run dev        # Nodemon watch mode
npm run seed       # Seed database

# Frontend
npm run dev        # Vite dev server
npm run build      # Production build
npm run preview    # Preview production build locally
npm run lint       # ESLint
```

---

## Security Features

- JWT authentication with httpOnly cookies
- Passwords hashed with bcryptjs
- HTTPS / SSL (Let's Encrypt)
- CORS with explicit origin whitelist
- Rate limiting (express-rate-limit + Nginx `limit_req`)
- Input validation with Joi
- XSS sanitization (`xss` package)
- MongoDB injection prevention (`express-mongo-sanitize`)
- Helmet security headers
- UFW firewall (SSH + Nginx only)

---

## Performance Optimizations

- Gzip compression (Nginx)
- Immutable cache headers for hashed assets (1 year)
- PM2 with auto-restart and memory limit (500 MB)
- MongoDB Atlas with connection pooling
- React code splitting and lazy loading
- Skeleton screens for perceived performance
- Service Worker for offline support (PWA)
- Image validation — broken images never rendered

---

## Roadmap

- [x] JWT authentication
- [x] Real-time news aggregation
- [x] Comments and bookmarks
- [x] Reading history
- [x] Daily polls
- [x] PWA (installable)
- [x] AI features (Gemini + local NLP)
- [x] Stripe subscriptions
- [x] Newsletter
- [x] SEO optimization
- [ ] Push notifications
- [ ] Mobile app (React Native)
- [ ] Social sharing
- [ ] Advanced search
- [ ] User following system
- [ ] Trending topics
- [ ] Dark mode
- [ ] Multi-language support

---

## License

MIT License — see `LICENSE` for details.

---

**Made with ❤️ for India**
