# AGENTS.md

Portfolio at `n1code.dev` (public) and `admin.n1code.dev` (admin panel), both served from this repo and both talking to **one Firebase project**. Stack: React 19, Vite 8, Tailwind 4, React Router 8, Firebase 12 (Firestore/Auth/Storage), Netlify Functions, Cloudflare Turnstile, lucide-react. No new dependencies without asking.

## Layout

```
n1code/
  main/                  public site  -> n1code.dev
    src/pages/           Home (one scroll overview) + detail routes
    src/components/      Backdrop, Reveal, HUD, ScrollProgress, cards, forms
    src/hooks/           useSiteData, useInterestsLive
    src/lib/             animate, interests, skills, analytics, cache, sanitize
    netlify/functions/   api.js (health, contact, reply, steam proxy)
    scripts/             inject-seo.js, generate-sitemap.js (run by `npm run build`)
    tests/               Vitest specs + setup.js
  admin/                 admin panel -> admin.n1code.dev
    src/components/      one *Manager.jsx per settings section + Dashboard/Inbox/Analytics
    src/pages/           Dashboard, Login, ErrorPage
    tests/               Vitest specs
  firestore.rules        shared by both apps
  storage.rules          public read, admin-only write
  firebase.json          rules-only config
```

`main` and `admin` are **independent Vite apps** with separate `package.json`, `node_modules`, `dist` and lockfiles. Neither imports the other's code.

## Dev environment

Copy `.env.template` to `.env` in the app you are working on (both apps have the same template; `.env` is gitignored).

Required vars: `VITE_FIREBASE_*` (7 of them, both apps), `RESEND_API_KEY`, `STEAM_API_KEY`, `VITE_API_SECRET`, `VITE_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`.

The public site needs the full Firebase config; the admin panel needs it plus the Turnstile and admin keys. CI supplies mock values for the `VITE_FIREBASE_*` vars, so tests pass without a real `.env`.

## Commands

**`n1code/main`** (from `n1code/main/`)

| Command | Does |
|---|---|
| `npm run dev` | `netlify dev` — serves the site **and** `/api/*` (needs the Netlify CLI) |
| `npm run dev:frontend` | plain Vite dev server, **no** `/api/*` function |
| `npm run build` | `vite build` + `inject-seo.js` + `generate-sitemap.js` |
| `npm run test` | `vitest run` |
| `npm run test:watch` | watch mode |
| `npm run lint` | `eslint .` |
| `npm run preview` | serves the built `dist/` |

**`n1code/admin`** — same script names except `dev` is plain `vite` (no Netlify), and there is no `build`-chained scripts step: `npm run dev`, `npm run build`, `npm run lint`, `npm run test`, `npm run test:watch`, `npm run preview`.

CI (`.github/workflows/ci.yml`) runs `npm run test` in **both** apps on push/PR to `main`, with `cache-dependency-path` pointing at each app's lockfile. Keep both green.

## Firebase data shape

One document per section in the `settings` collection: `profile`, `projects`, `skills`, `setup`, `interests`, `seo`, `analytics`. The admin writes them, the public site reads them.

- Public read is allowlisted in `firestore.rules` to exactly those ids (minus `analytics`). **Adding a new public settings doc means adding its id to that list**, or the public site gets permission denied.
- `storage.rules` allows public read of `images/**`, admin-only write, max 10 MB, images only.
- `main/src/lib/cache.js` wraps reads with an in-memory cache + `localStorage` (`n1code_cache_<type>`) and revalidates in the background. `lib/interests.js` and `lib/skills.js` hold the pure, unit-tested helpers — put data shaping there, not in components.

## Conventions

- **Tailwind 4 with an explicit `@theme` palette** in `src/index.css` (`sky-aqua-*`, `baltic-blue-*`, `regal-navy-*`, `deep-navy-*`, `blue-green-*`). Reach for those tokens; they generate the `text-sky-aqua-400` / `bg-sky-aqua-500/10` style classes.
- Fonts are set in the same file: Outfit (body), Rajdhani (display/headings), Share Tech Mono (HUD labels).
- **Animation has no dependencies.** `src/lib/animate.js` provides `useInView`, `useScrollProgress`, `useCountUp`, `useTypewriter`, `slugify`; CSS keyframes live in `index.css`; `Reveal` wraps anything that should scroll in. Do not add framer-motion/GSAP.
- `Reveal` is the only scroll-in mechanism — never add a bare `.reveal` class to a component, always wrap it, otherwise it stays at `opacity: 0` forever.
- Only `/` is eagerly imported; every other route is `React.lazy`. Follow that when adding pages.
- Dynamic `href`/`to` must go through `lib/sanitize.js` (blocks `javascript:` URLs). Firestore writes cast fields explicitly instead of spreading state.
- Admin routes are wrapped in `ProtectedRoute` (Firebase Auth); the public site is fully open.

## PITFALLS

- **happy-dom's `IntersectionObserver` never fires its callback**, so every `Reveal` would stay invisible in tests. `tests/setup.js` (wired via `setupFiles` in `vite.config.js`) replaces it with a shim that reports intersection immediately. **Never delete that file**, and keep it when adding reveal-dependent tests.
- **`lucide-react` 1.23 has no brand icons.** `Github` is `undefined` and renders as "Element type is invalid". Use `react-icons/fa` (`FaGithub`) or a lucide equivalent like `FolderGit2`. Verify an icon exists before importing: `node -e "console.log(typeof require('lucide-react').FolderGit2)"`.
- **react-hooks v7 is strict.** `set-state-in-effect` rejects synchronous `setState` in an effect body — fix with a lazy `useState(() => ...)` initialiser, a ref, or `requestAnimationFrame`. `static-components` rejects `const Icon = getIconComponent(x)` used as JSX — use `createElement(...)` instead.
- **The React Compiler memoises effects.** A hand-rolled `IntersectionObserver` inside `Home` silently stopped firing once the compiler memoised the effect closure. Reuse `useInView` rather than writing bespoke observers.
- **A border shorthand resets the colour.** `border-top: 2px solid` on an element silently drops a `border-color` set elsewhere. Put the colour on the base rule as `border: 0 solid <colour>` and override only per-side widths.
- **`vite preview` has no `/api/*` function** — it answers `index.html` with a 200. Any client fetch that assumes JSON must validate with `Array.isArray`, or the app crashes with "e is not iterable". `netlify/functions/api.js` now reads text first and checks `response.ok` before parsing.
- **The `/steam` endpoint validates the key.** Steam answers 401/403 with an HTML page; the proxy returns 502 with a readable `detail` plus a hint. A private Steam profile returns `{ games: [], privateProfile: true }` — treat that as a distinct state from a failure.
- **AniList statuses must be bucketed explicitly.** AniList uses `CURRENT, PLANNING, COMPLETED, DROPPED, PAUSED, REPEATING`. Bucketing as "not CURRENT" sweeps PLANNING and PAUSED into completed.
- **`npm run build` mutates `dist/`** — `inject-seo.js` rewrites `index.html` and `generate-sitemap.js` writes `sitemap.xml`. Both read Firestore and exit safely when the config is missing. Never hand-edit files in `dist/`.
- **`.netlify/` is generated** by `netlify dev` (the function bundle). Never hand-edit it; it is in `globalIgnores` for ESLint.
- `firestore.rules` and `storage.rules` are not auto-deployed by the build — they go out with `firebase deploy`.
