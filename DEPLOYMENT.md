# LoanGuard AI - Full-Stack Deployment Guide

This guide covers all deployment options for LoanGuard AI:
1. [Recommended: Vercel (Frontend) + Render / Railway (Backend)](#strategy-1-free-cloud-paas-recommended)
2. [Single-Server VPS / Cloud Server with Docker](#strategy-2-single-server-vps-with-docker-compose)
3. [Serverless Containers (Google Cloud Run / AWS App Runner)](#strategy-3-serverless-containers)

---

## 📦 Pre-Deployment Step: Push Code to GitHub

Before deploying to any cloud provider, push the project to GitHub:

```bash
# 1. Initialize git repository
git init

# 2. Stage all files (respecting .gitignore)
git add .

# 3. Commit
git commit -m "Initial commit: LoanGuard AI full stack platform"

# 4. Create repository on GitHub (e.g. loanguard-ai) and link:
git remote add origin https://github.com/<your-username>/loanguard-ai.git
git branch -M main
git push -u origin main
```

---

## Strategy 1: Free Cloud PaaS (Recommended)

This strategy decouples the frontend and backend to take advantage of zero-maintenance hosting:
- **Frontend**: **Vercel** (Global edge CDN, automatic HTTPS, optimized for Next.js).
- **Backend & ML Models**: **Render** or **Railway** (Handles Python, Scikit-Learn, and FastAPI).

### Part A: Deploy the FastAPI Backend to Render

1. Go to [Render.com](https://render.com) and log in.
2. Click **New +** -> **Web Service**.
3. Select your GitHub repository (`loanguard-ai`).
4. Configure the service:
   - **Name**: `loanguard-backend`
   - **Region**: Nearest to you (e.g., Frankfurt, Ohio, Singapore)
   - **Branch**: `main`
   - **Root Directory**: (Leave blank or `.`)
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Under **Environment Variables**, add:
   - `PYTHON_VERSION`: `3.11.9`
   - `LOKY_MAX_CPU_COUNT`: `2`
6. Click **Create Web Service**.
7. Once deployed, Render will provide a live URL, for example:  
   `https://loanguard-backend.onrender.com`
8. Verify it by visiting:  
   `https://loanguard-backend.onrender.com/api/v1/health` and `/docs`

---

### Part B: Deploy the Next.js Frontend to Vercel

1. Go to [Vercel.com](https://vercel.com) and log in with GitHub.
2. Click **Add New...** -> **Project**.
3. Import your `loanguard-ai` repository.
4. Configure project settings:
   - **Framework Preset**: Next.js (automatically detected)
   - **Root Directory**: Click `Edit` and select `frontend`
5. Under **Environment Variables**, add:
   - **Key**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://loanguard-backend.onrender.com/api/v1` *(replace with your actual Render backend URL)*
6. Click **Deploy**.
7. In ~60 seconds, Vercel will give you a live production URL:  
   `https://loanguard-ai.vercel.app`

---

## Strategy 2: Single-Server VPS with Docker Compose

If you have a Linux VPS (Ubuntu on AWS EC2, DigitalOcean, Hetzner, Linode, etc.):

### 1. Install Docker & Docker Compose
```bash
sudo apt update && sudo apt install -y docker.io docker-compose-v2
sudo systemctl enable --now docker
```

### 2. Clone Repository & Launch
```bash
git clone https://github.com/<your-username>/loanguard-ai.git
cd loanguard-ai

# Start both services in background
docker compose up -d --build
```

### 3. Verification
- Frontend UI: `http://<your-vps-ip>:3000`
- Backend API: `http://<your-vps-ip>:8000`
- Swagger Docs: `http://<your-vps-ip>:8000/docs`

### 4. (Optional) Production Nginx Reverse Proxy with Free SSL (Certbot)
Point your custom domain (e.g. `loanguard.yourdomain.com`) to your VPS IP:
```nginx
server {
    server_name loanguard.yourdomain.com;

    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /docs {
        proxy_pass http://127.0.0.1:8000/docs;
    }

    location /openapi.json {
        proxy_pass http://127.0.0.1:8000/openapi.json;
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```
Run `sudo certbot --nginx -d loanguard.yourdomain.com` for automatic HTTPS.

---

## Strategy 3: Serverless Containers

### Google Cloud Run
1. Build & push backend container to Google Artifact Registry:
   ```bash
   gcloud builds submit --tag gcr.io/<PROJECT-ID>/loanguard-backend -f backend/Dockerfile .
   gcloud run deploy loanguard-backend --image gcr.io/<PROJECT-ID>/loanguard-backend --platform managed --allow-unauthenticated --port 8000
   ```
2. Build & push frontend container (or host frontend on Firebase/Vercel with `NEXT_PUBLIC_API_URL` pointing to Cloud Run URL).

---

## 🔒 Security & Performance Checklist
- [x] Pre-trained models (`.pkl`) packaged directly with the backend.
- [x] CORS middleware configured to accept incoming frontend requests.
- [x] Next.js frontend has built-in offline heuristic fallback if the backend undergoes cold start.
- [x] Multi-stage Docker containers minimize attack surface and image size.
