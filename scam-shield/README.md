# 🛡️ Scam Shield

AI-powered scam detector for texts, emails, and voicemail transcripts. Built with Next.js and Claude AI.

## Quick Deploy to Vercel (fastest)

1. Push this folder to a GitHub repo
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo
3. Add environment variable: `ANTHROPIC_API_KEY` = your key from [console.anthropic.com](https://console.anthropic.com)
4. Click Deploy — done

## Local Development

```bash
cp .env.example .env.local
# Edit .env.local with your real API key

npm install
npm run dev
# Open http://localhost:3000
```

## Install as Phone App (PWA)

Once deployed, open the site on your phone:
- **iPhone**: Safari → Share → "Add to Home Screen"
- **Android**: Chrome → Menu → "Add to Home screen"

The app will appear on your home screen and run fullscreen like a native app.

## Project Structure

```
app/
  layout.js        – HTML shell, fonts, meta tags
  globals.css      – Global styles
  page.js          – Main UI (client component)
  api/analyze/
    route.js       – Server-side proxy to Anthropic API
public/
  manifest.json    – PWA manifest
  icon-192.png     – App icon
  icon-512.png     – App icon (large)
```

## Cost

Each analysis uses one Claude Sonnet API call (~$0.003–0.01 per scan depending on message length).
