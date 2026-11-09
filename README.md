# Soda — freshly unserious

A responsive, static playground with 20 original AI-made clay illustrations and original captions. Filter by mood, shuffle, like memes, remix a caption and download a composed 1080 × 1350 PNG.

## Prototype

Live prototype: https://whimsy-valley-535v.here.now/

Published anonymously on here.now. It expires 2026-11-10 at 21:32:56 UTC unless claimed by its owner. The private claim link is supplied in the Paperclip delivery document. No subscription was created.

Source: https://github.com/paperclipai/soda-meme-playground

## Run

Serve this directory with any static HTTP server. No build step or runtime dependencies.

```sh
python3 -m http.server 4173
```

Open http://localhost:4173. Internet access is not needed after files load. No external fonts, analytics, visitor AI calls, accounts or backend. Likes use `localStorage` on this browser and origin. Captions are temporary and can be saved via PNG download. The caption suggestion button cycles through prewritten original captions.

## Verify

```sh
npm install
npx playwright install chromium
npm test
```

The browser script expects a local server at port 4173; set `SODA_TEST_URL` to test a public deployment. It checks desktop and two mobile widths, all images, layout overflow, scrolling, filtering, shuffling, likes after reload, saved filtering, caption editing, preset caption remixes, real PNG downloads, Escape dismissal, and the empty likes state. Results and screenshots live in `verification/`.

## Content

The 20 optimized WebP illustrations in `assets/` were created for this project with OpenAI's image model through Paperclip's `generate_image` tool (built-in mode). See `ASSET-PROMPTS.md` for prompts and provenance. Captions are rendered as accessible HTML and drawn into downloadable PNGs in the browser. Source uses no stock memes or third-party character art.

## Limitations

Likes are local to one browser and can be cleared by browser settings. Browsers that block local storage can still like during the session, with a warning that persistence is unavailable. Downloads depend on browser download handling. Automated testing uses Chromium, including mobile viewport sizes, rather than physical iOS/Android devices.
