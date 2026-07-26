This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Brand assets

`logo.jpeg` at the repo root is the master artwork. Everything the site uses is
derived from it — regenerate after any change to the logo:

```bash
python scripts/build-brand-assets.py
```

That writes `public/brand/` (transparent lockups, plus white-on-dark recolours
for the hero header and the admin login panel) and the app icons under
`src/app/`. Requires Pillow (`pip install pillow`).

The dark variants exist because the header sits on the dark hero film at the top
of the home page and on the light canvas once scrolled; `BrandLogo` cross-fades
between the two rather than swapping `src`, so the swap never flashes.

## Hero film assets

`public/videos/` holds three derivatives of one source clip. The source `.mp4`
is git-ignored — keep it at the repo root and re-run these to regenerate:

```bash
ffmpeg -i SOURCE.mp4 -an -c:v libx264 -preset slow -crf 28 -g 4 -keyint_min 4 -sc_threshold 0 -pix_fmt yuv420p -movflags +faststart public/videos/hero-scrub.mp4
```

```bash
ffmpeg -i SOURCE.mp4 -an -vf scale=854:480 -c:v libx264 -preset slow -crf 30 -pix_fmt yuv420p -movflags +faststart public/videos/hero-loop.mp4
```

```bash
ffmpeg -i SOURCE.mp4 -vf "select='eq(n\,0)'" -vframes 1 -q:v 4 public/videos/hero-poster.jpg
```

`hero-scrub.mp4` carries a keyframe every 4 frames so the desktop scroll-scrub
can seek anywhere without stalling — that density is why it is encoded
separately from `hero-loop.mp4`, which phones just play end to end. The poster
is what paints before either file arrives, and it is what keeps the transparent
header legible on first load.

## Deployment — Vercel serving hepayapi.com.tr

The site is server-rendered (DB-backed pages, admin API routes, JWT cookie auth
in `src/proxy.ts`), so it needs a Node runtime — a static upload to the cPanel
account is not an option. It runs on Vercel while the domain's DNS stays at
Alastyr, so mail (MX `mx1/mx2.alastyr.com`) and the database keep working.

Environment variables — see `.env.example`:

| Variable               | Production value                                                  |
| ---------------------- | ----------------------------------------------------------------- |
| `DATABASE_URL`         | cPanel MySQL, with `?connectionLimit=2&idleTimeout=60` appended    |
| `JWT_SECRET`           | a fresh random value, never the development one                    |
| `NEXT_PUBLIC_SITE_URL` | `https://www.hepayapi.com.tr` — see "DNS at Alastyr" for why `www`  |
| `BLOB_READ_WRITE_TOKEN`| set automatically when the Blob store is attached to the project   |

### Uploads

`src/app/api/upload/route.ts` writes to Vercel Blob when
`BLOB_READ_WRITE_TOKEN` is set and to `public/uploads` otherwise. The serverless
filesystem is read-only and per-invocation, so the Blob path is what production
uses; `coverImage`/`gallery` then hold absolute Blob URLs. The DB-driven
`next/image` usages already pass `unoptimized`, so no `images.remotePatterns`
entry is needed. Files already committed under `public/uploads/` keep being
served from the deployment as before.

### Database reachability

cPanel > Remote MySQL must allow Vercel's (dynamic) addresses — in practice `%`.
Because that exposes port 3306 to the internet, the DB user needs a long random
password, and it should be a user with rights to this schema only. `next build`
reads the DB while prerendering, so remote access has to be open before the
first deploy or the build fails.

### DNS at Alastyr

Only the web records change; leave MX and the mail-related A records alone.

Add `hepayapi.com.tr` and `www.hepayapi.com.tr` in Vercel > Settings > Domains
and copy the values it prints: an **A** record for the apex and a **CNAME** for
`www`. Both are project-specific now — the IP is drawn from a pool and the CNAME
target is a per-project hostname — so read them from the dashboard rather than
reusing values from a guide. The records issued for this project:

| Type  | Name  | Value                                   |
| ----- | ----- | --------------------------------------- |
| A     | `@`   | `216.198.79.1`                          |
| CNAME | `www` | `bd55122b9104ed52.vercel-dns-017.com`   |

`www` is the host bound to the deployment and the apex only 308-redirects to it,
which is why `NEXT_PUBLIC_SITE_URL` carries the `www` prefix. Flipping which one
is canonical means changing both the Vercel domain settings and that variable.

One caveat: the SPF record ends with `mx a -all`, and the `a` mechanism resolves
the apex A record. Pointing the apex at Vercel drops the hosting server out of
SPF, so add `ip4:5.2.85.131` to the SPF TXT record before switching the A record
if mail is sent from the cPanel server.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
