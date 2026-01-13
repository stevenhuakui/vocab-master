# VocabMaster Deployment Guide

## 🇨🇳 China Access Solution: Buying a Domain (Recommended)
Since free domains like `*.pages.dev` and `*.edgeone.cool` (temporary) are often blocked or limited in China, the **most reliable solution** is to buy a cheap domain (about $5-10/year).

1.  **Buy a Domain**: Go to Namecheap, GoDaddy, or Tencent Cloud and buy a domain (e.g., `steven-vocab.com`).
2.  **Connect to Cloudflare Pages**:
    - Go to your Cloudflare Pages project (`vocab-master`).
    - Click **Custom Domains**.
    - Enter your new domain.
    - Follow instructions to update DNS.
3.  **Result**: Your custom domain will work permanently and is usually **accessible in China**.

---

## Option 0: Tencent Cloud EdgeOne Pages (Fastest, but Domain Required)
**WARNING**: The free default domain is **temporary (3 hours only)**.
- Use this only to **test** quickly if the app works on your sister's phone.
- For a permanent link, you must buy a customized domain OR use Cloudflare Pages (Option 1).

1.  **Build Locally**:
    - In your project, run: `npm run build`
    - This will generate a `dist` folder.

2.  **Go to Tencent Cloud EdgeOne**:
    - Select **EdgeOne Pages**.
    - **Upload Directory**: Upload your `dist` folder.
    - **Result**: You get a 3-hour preview link. Good for a quick test.

## Option 1: GitHub Pages (Free & Reliable)
This is a great free option that works moderately well in China.

1.  **Configuration**: I have already updated `vite.config.ts` to use `/vocab-master/` as the base path.
2.  **Push Code**:
    ```bash
    git add .
    git commit -m "config: update for github pages"
    git push
    ```
3.  **Enable Pages**:
    - Go to your repository on GitHub.
    - Click **Settings** (top right) > **Pages** (left sidebar).
    - Under **Build and deployment**, set Source to **Deploy from a branch**.
    - Select **Branch**: `main` and folder `/ (root)`.
    - Click **Save**.
4.  **Wait**:
    - It will take about 1-2 minutes.
    - Refresh the page to see your link (usually `https://username.github.io/vocab-master/`).

## Option 2: Cloudflare Pages (With Custom Domain)
If you bought a domain (recommended for best speed), use Cloudflare. Since we added the base path for GitHub, you might need to change it back to `/` for Cloudflare if you map it to the root of your domain.

## Option 3: Local Transfer (Offline)
1.  Run `npm run build` locally.
2.  Send the `dist` folder to your sister.
3.  She can run it using a local server (e.g., `http-server` or `serve`).
