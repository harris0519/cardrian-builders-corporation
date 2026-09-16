# Cardrian Builders Corporation Website

A responsive React + Vite corporate construction website using the provided Cardrian Builders Corporation logo.

## Run locally

```bash
npm install
npm run dev
```

## Build for production

```bash
npm run build
```

## Contact form

The contact form posts to a Node.js API that sends email using
[Brevo's transactional email API](https://developers.brevo.com/reference/send-transac-email).
The sender is `info@cardrian.com`; recipients are `qs@cardrian.com`,
`myp@cardrian.com`, `tengponco@cardrian.com`, `harrislazaro05@gmail.com`, and `miguelponco@cardrian.com`.
Emails include every existing form field in a branded HTML layout with a plain-text
alternative. Reply-To is the client's email address.

Use Node.js 22. Copy `.env.example` to `.env.local` and set `BREVO_API_KEY`
(the local workspace is already configured). Keep this file private; it is ignored
by Git. Never put the API key in a `VITE_` variable.
Run `npm run dev:api` and `npm run dev` in separate terminals.
Run `npm test` to check validation, routing, HTML escaping and failure handling.

### Production with GitHub Pages

GitHub Pages serves static files and cannot run the email API. Deploy the `server/`
directory and `package.json` to a Node.js host with `npm start`. Set the host's
`BREVO_API_KEY` secret and `ALLOWED_ORIGINS` to the exact website origins,
comma-separated. The host can supply `PORT` (default 3001). Ensure the sender
`info@cardrian.com` is verified in Brevo.

Set the GitHub repository Actions variable `VITE_INQUIRY_API_URL` to the hosted
HTTPS endpoint, for example `https://your-api-host.example/api/inquiry`, and rebuild
the Pages site. This URL is public; the key stays exclusively on the API host.
For another frontend host, set the same build variable, or reverse-proxy
`/api/inquiry` to the API on the same origin.

The API limits requests to five per minute per socket IP in each process, caps
request size, validates fields, and ignores honeypot submissions. For production
behind a proxy or multiple instances, configure per-client rate limiting at the
hosting edge; the local limiter does not trust forwarded IP headers.

## Content to replace before launch

- Official phone number and email address
- Complete business address
- Actual project portfolio images and descriptions
- Confirmed official Vision statement

Production email delivery requires the separately deployed API described above.
