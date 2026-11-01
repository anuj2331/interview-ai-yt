# Deploying Frontend and Backend on Render

This guide walks you through deploying both the **Backend** (Node.js/Express API) and **Frontend** (React + Vite SPA) on **Render**.

---

## Architecture Overview

- **Backend (`/Backend`)**: Deployed as a Render **Web Service** (Node.js runtime).
- **Frontend (`/Frontend`)**: Deployed as a Render **Static Site** (Free, fast global CDN, built with Vite).

---

## Prerequisites

1. **GitHub Repository**: Make sure your project is pushed to GitHub.
2. **MongoDB Atlas Database**:
   - Get your MongoDB connection URI (`mongodb+srv://...`).
   - In MongoDB Atlas, go to **Network Access** → **Add IP Address** → Choose **Allow Access From Anywhere (`0.0.0.0/0`)** so Render can connect.
3. **Google Gemini API Key**: Obtain your API key from Google AI Studio.
4. **JWT Secret**: Any strong random string for signing JWT tokens (e.g. `your-super-secret-key-12345`).

---

## Method 1: Automated Blueprint Deployment (Recommended)

The repository includes a [render.yaml](file:///c:/Users/anujm/Desktop/Gen-ai%202/render.yaml) blueprint file that configures both services automatically.

### Steps:

1. Push all changes to GitHub:
   ```bash
   git add .
   git commit -m "Configure Render deployment for frontend and backend"
   git push origin main
   ```
2. Open your **Render Dashboard** (https://dashboard.render.com).
3. Click **New +** at the top right and select **Blueprint**.
4. Connect your GitHub repository.
5. Render will detect `render.yaml` and show two services:
   - `interview-ai-backend` (Web Service)
   - `interview-ai-frontend` (Static Site)
6. Under **Environment Variables**, fill in the secrets for the Backend:
   - `MONGO_URI`: Your MongoDB Atlas connection string.
   - `JWT_SECRET`: Your random secret string.
   - `GOOGLE_GENAI_API_KEY`: Your Gemini API key.
   - *Leave `FRONTEND_URL` and `VITE_API_URL` blank or placeholder for now until URLs are generated.*
7. Click **Apply**.
8. Once the initial build finishes, link the two services together (see [Connecting Frontend and Backend](#connecting-frontend-and-backend) below).

---

## Method 2: Manual Dashboard Deployment

If you prefer to configure each service manually in the Render dashboard:

### Step 1: Deploy Backend (Web Service)

1. In Render Dashboard, click **New +** → **Web Service**.
2. Connect your GitHub repository.
3. Configure the service settings:
   - **Name**: `interview-ai-backend` (or your preferred name)
   - **Region**: Choose the region closest to you or your database
   - **Branch**: `main`
   - **Root Directory**: `Backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm ci`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
4. Expand **Advanced**:
   - **Health Check Path**: `/healthz`
5. Add the following **Environment Variables**:
   - `NODE_ENV`: `production`
   - `MONGO_URI`: `your_mongodb_connection_string`
   - `JWT_SECRET`: `your_random_secret_string`
   - `GOOGLE_GENAI_API_KEY`: `your_gemini_api_key`
   - `PUPPETEER_CACHE_DIR`: `/opt/render/.cache/puppeteer`
   - `FRONTEND_URL`: *(Leave empty for now, will add after deploying frontend)*
6. Click **Create Web Service**.
7. Wait for the build and health check to pass. Copy your backend HTTPS URL (e.g., `https://interview-ai-backend.onrender.com`).

---

### Step 2: Deploy Frontend (Static Site)

1. In Render Dashboard, click **New +** → **Static Site**.
2. Connect the same GitHub repository.
3. Configure the settings:
   - **Name**: `interview-ai-frontend` (or your preferred name)
   - **Branch**: `main`
   - **Root Directory**: `Frontend`
   - **Build Command**: `npm ci && npm run build`
   - **Publish Directory**: `dist`
4. Add **Environment Variable**:
   - `VITE_API_URL`: Your backend URL from Step 1, without trailing slash (e.g., `https://interview-ai-backend.onrender.com`).
5. Set up **SPA Rewrite Rule** (essential for React Router):
   - Scroll down to the **Redirects / Rewrites** section.
   - Click **Add Rule**:
     - **Type**: `Rewrite`
     - **Source**: `/*`
     - **Destination**: `/index.html`
   - Click **Save Changes**.
6. Click **Create Static Site**.
7. Once deployed, copy your frontend HTTPS URL (e.g., `https://interview-ai-frontend.onrender.com`).

---

## Connecting Frontend and Backend

Because the frontend and backend communicate securely using credentialed CORS and cookies, ensure both know each other's domain:

1. **Set `FRONTEND_URL` in Backend**:
   - Open your backend service on Render (`interview-ai-backend`).
   - Go to **Environment**.
   - Add or update:
     - `FRONTEND_URL`: `https://interview-ai-frontend.onrender.com` *(no trailing slash)*.
   - Click **Save Changes** (Render will automatically redeploy the backend).

2. **Verify `VITE_API_URL` in Frontend**:
   - Open your frontend static site on Render (`interview-ai-frontend`).
   - Go to **Environment**.
   - Ensure `VITE_API_URL` is set to `https://interview-ai-backend.onrender.com` *(no trailing slash)*.
   > **Important Note on Vite**: `VITE_*` environment variables are baked into static JS bundles at **build time**. If you ever change `VITE_API_URL`, trigger a manual deploy via **Manual Deploy → Clear build cache & deploy** so Vite rebuilds with the new backend URL.

---

## Important Production Considerations

1. **Free Tier Cold Starts**:
   - Render's free Web Service spins down after 15 minutes of inactivity.
   - The first request after sleep may take ~30–50 seconds while the backend wakes up. Subsequent requests will be fast.
   - Render Static Sites (frontend) never sleep and are served instantly via CDN.

2. **CORS & Authentication Cookies**:
   - In production (`NODE_ENV=production`), authentication cookies are sent with `secure: true` and `sameSite: "none"`.
   - Both frontend and backend must use HTTPS URLs on Render.
   - Make sure no trailing slashes `/` are added at the end of `FRONTEND_URL` or `VITE_API_URL`.

3. **PDF Generation (Puppeteer)**:
   - Puppeteer runs in headless mode with `--no-sandbox` flags in production to support Linux container execution.
