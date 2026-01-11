# VocabMaster Deployment Guide

## Option 1: Cloudflare Pages (Recommended for China)
Cloudflare's network is often more accessible in China than Vercel.

1.  **Push to GitHub**:
    - Ensure your code is on GitHub.

2.  **Go to Cloudflare Dashboard**:
    - Log in to [dash.cloudflare.com](https://dash.cloudflare.com).
    - Go to **Workers & Pages** -> **Create Application**.
    - Select **Pages** tab -> **Connect to Git**.
    - Select your `vocab-master` repository.

3.  **Configure Builds**:
    - **Project Name**: `vocab-master` (or whatever you like)
    - **Framework Preset**: `Vite`
    - **Build Command**: `npm run build`
    - **Build Output Directory**: `dist`
    - **Root Directory**: `.` (or leave empty)

4.  **Deploy**:
    - Click **Save and Deploy**.

**Troubleshooting errors**:
- If you see `Missing entry-point to Worker script`, ensure you are creating a **Pages** project, NOT a Worker.
- Do NOT add `wrangler deploy` to your build command. Cloudflare handles the upload of the `dist` folder automatically.

## Option 2: Vercel
1.  Go to [vercel.com](https://vercel.com).
2.  Import project from GitHub.
3.  Framework: Vite.
4.  Deploy.
*Note: Vercel domains might be blocked in China.*

## Option 3: Local Transfer
1.  Run `npm run build` locally.
2.  Send the `dist` folder to your sister.
3.  She can run it using a local server (e.g., `http-server` or `serve`).
