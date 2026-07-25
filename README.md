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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
