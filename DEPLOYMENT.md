# Deploying to Render and Vercel

This repository contains two apps. Deploy the backend to Render first, then deploy
the frontend to Vercel.

## 1. Deploy the backend to Render

1. Push this repository to GitHub.
2. In Render, choose **New → Blueprint** and connect the repository. Render will
   use the root `render.yaml` to create the backend web service.
3. Set the service's environment variables in Render:
   - `MONGO_URI`: the MongoDB connection string.
   - `JWT_SECRET`: a long, random secret used to sign authentication tokens.
   - `GOOGLE_GENAI_API_KEY`: the Google GenAI API key.
   - `FRONTEND_URL`: the exact Vercel site origin, such as
     `https://your-project.vercel.app` (no trailing slash). Separate multiple
     allowed origins with commas.
4. Wait for the service health check to pass at `/healthz`, then copy its public
   HTTPS URL, for example `https://your-service.onrender.com`.

Do not commit these secrets to the repository. If MongoDB Atlas is used, make
sure its network access settings permit connections from Render.

## 2. Deploy the frontend to Vercel

1. In Vercel, import the same GitHub repository.
2. Set **Root Directory** to `Frontend`.
3. Use `npm run build` as the build command and `dist` as the output directory.
   Vercel should detect the Vite framework and configure these automatically.
4. Add the environment variable `VITE_API_URL` with the Render backend's public
   HTTPS URL, without a trailing slash.
5. Deploy. If you add or change an environment variable later, redeploy so the
   Vite build picks it up.

After deployment, set `FRONTEND_URL` in Render to the deployed Vercel origin.
If you use a custom frontend domain, add that origin too. The backend uses
credentialed CORS and secure cross-site cookies in production.
