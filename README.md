# ReelSpot SF

> Explore every street, alley, and landmark in San Francisco that made it onto the silver screen.

🌐 **Live Demo → [https://adityankannan.github.io/ReelSpot-SF/](https://adityankannan.github.io/ReelSpot-SF/)**

ReelSpot SF is a single-page React application that plots all San Francisco film-shoot locations on an interactive map, powered by the live [DataSF Film Locations API](https://data.sfgov.org/resource/yitu-d5am.json). Search by title, director, or actor; filter by decade; and click any map pin to read production details.

---

## Table of Contents

- [Live Data Source](#live-data-source)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture & Data Flow](#architecture--data-flow)
- [Component Overview](#component-overview)
- [Theming System](#theming-system)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Running Tests](#running-tests)
- [Test Coverage](#test-coverage)
- [Building for Production](#building-for-production)
- [Deployment](#deployment)
- [Environment Notes](#environment-notes)

---

## Live Data Source

```
https://data.sfgov.org/resource/yitu-d5am.json?$limit=3000&$offset=0
```

No API key required. The app fetches up to 3 000 rows on load, normalises them into typed `Movie` and `MapMarker` objects, and renders pins directly from the `latitude` / `longitude` fields provided by the dataset.

---

## Tech Stack

| Layer             | Library                    | Version |
| ----------------- | -------------------------- | ------- |
| UI framework      | React                      | 18      |
| Language          | TypeScript                 | 5       |
| Build tool        | Vite                       | 4       |
| Map rendering     | react-map-gl + maplibre-gl | 7 + 3   |
| Map style         | CARTO Voyager (CDN)        | —       |
| Fuzzy search      | Fuse.js                    | 7       |
| Animations        | Framer Motion              | 12      |
| Icons             | Lucide React               | latest  |
| Test runner       | Vitest                     | 4       |
| DOM environment   | happy-dom                  | 20      |
| Component testing | React Testing Library      | 16      |

---

## Project Structure

```
cinemap-sf/
├── index.html                   # App shell & <title>
├── vite.config.ts               # Vite + Vitest config
├── tsconfig.json                # TypeScript config
├── package.json
│
└── src/
    ├── main.tsx                 # React DOM entry point
    ├── App.tsx                  # Root component — layout, state, routing logic
    ├── theme.ts                 # Centralised design tokens & style objects
    ├── types.ts                 # Shared TypeScript interfaces
    ├── index.css                # Global reset / font imports
    │
    ├── services/
    │   ├── dataSF.ts            # API fetch + data normalisation
    │   └── dataSF.test.ts       # Unit tests for service layer
    │
    ├── hooks/
    │   ├── useMovieData.ts      # Data-fetching hook (fetch → normalise → markers)
    │   ├── useAppState.ts       # UI state hook (search, year filter, selection)
    │   └── tests/
    │       ├── useMovieData.test.ts
    │       └── useAppState.test.ts
    │
    ├── components/
    │   ├── Map/
    │   │   └── MapView.tsx      # react-map-gl map + marker rendering
    │   │
    │   ├── Search/
    │   │   ├── SearchBar.tsx    # Fuse.js fuzzy search input + dropdown
    │   │   └── SearchBar.test.tsx
    │   │
    │   ├── Sidebar/
    │   │   ├── MovieDetailPanel.tsx   # Slide-in panel orchestrator
    │   │   ├── MovieDetailPanel.test.tsx
    │   │   ├── PanelHeader.tsx        # Title + year heading row
    │   │   ├── PanelHeader.test.tsx
    │   │   ├── CreditsBlock.tsx       # Director / cast / production rows
    │   │   ├── CreditsBlock.test.tsx
    │   │   ├── LocationItem.tsx       # Single filming location row
    │   │   ├── LocationItem.test.tsx
    │   │   ├── LocationsSection.tsx   # Location list with count header
    │   │   └── LocationsSection.test.tsx
    │   │
    │   ├── LoadingScreen/
    │   │   ├── LoadingScreen.tsx      # Full-screen loading / error state
    │   │   └── LoadingScreen.test.tsx
    │   │
    │   ├── StatsBar/
    │   │   ├── StatsBar.tsx           # Movie + location count pill
    │   │   └── StatsBar.test.tsx
    │   │
    │   ├── YearFilter/
    │   │   ├── YearFilter.tsx         # Decade picker dropdown
    │   │   └── YearFilter.test.tsx
    │   │
    │   └── ReelSpotPin/
    │       └── ReelSpotPin.tsx        # SVG map pin component
    │
    ├── utils/
    │   └── logger.ts            # Structured logger (debug/info/warn/error levels)
    │
    └── test/
        └── setup.ts             # Vitest global setup (@testing-library/jest-dom)
```

---

## Architecture & Data Flow

```
Browser load
     │
     ▼
useMovieData (hook)
     │
     ├─► fetchFilmLocations()       GET /resource/yitu-d5am.json
     │         │
     │         ▼
     │   normaliseMovies()          RawRow[] → Movie[]
     │         │
     │         ▼
     │   build MapMarker[]          one marker per (movie × location)
     │
     ├─► setMovies(Movie[])
     └─► setMarkers(MapMarker[])
              │
              ▼
          App.tsx  (holds all UI state)
              │
    ┌─────────┼──────────────────────┐
    ▼         ▼                      ▼
MapView   SearchBar              YearFilter
(renders  (Fuse.js fuzzy search  (decade picker)
 markers)  → filteredTitles)
    │         │                      │
    └────►  activeFilter  ◄──────────┘
              │  (intersection of both filters)
              ▼
         MapView dims/hides
         non-matching markers
              │
    user clicks marker / suggestion
              │
              ▼
       selectedMovie state
              │
              ▼
       MovieDetailPanel (slide-in)
```

### Key design decisions

- **No geocoding** — lat/lng come straight from the DataSF API, so there are no CORS or rate-limit issues.
- **Single source of truth** — all filter state lives in `App.tsx`; child components receive callbacks.
- **Framer Motion only at layout level** — entrance animations are on the overlay panel, not on the 2 000+ map markers (avoids performance issues).
- **Centralised styles** — every `CSSProperties` object lives in `src/theme.ts`, keeping components free of inline style literals.

---

## Component Overview

### `App.tsx`

Root component. Owns all state:

- `searchFilter` — set of movie titles matched by search
- `yearFilter` — set of movie titles matched by decade
- `selectedMovie` — currently open detail panel
- `selectedMarkerId` — highlighted map pin

Computes `activeFilter` as the intersection of both filters when both are active.

### `MapView.tsx`

Wraps `react-map-gl` with the CARTO Voyager style. Renders one `<Marker>` per `MapMarker`. Selected and hovered pins receive distinct styles from `theme.ts`. Clicks bubble up via `onMarkerClick`.

### `SearchBar.tsx`

Initialises a `Fuse<Movie>` index on first render. Queries on every keystroke, limits to 8 results, and shows a dropdown with a `Film` icon + title + year · director for each result.

### `YearFilter.tsx`

Derives available decades dynamically from the loaded movie data. Emits a `Set<string>` of titles for the selected decade, or `null` to clear.

### `useAppState.ts`

Manages all UI interaction state: `searchFilter`, `yearFilter`, `selectedMovie`, and `selectedMarkerId`. Consumes `useMovieData` internally and exposes callbacks for child components.

### `MovieDetailPanel.tsx`

Slide-in panel orchestrator (Framer Motion). Composes the four sub-components below to display full movie metadata.

### `PanelHeader.tsx`

Renders the movie title in an `<h2>` with an optional release year badge and a `Film` icon.

### `CreditsBlock.tsx`

Displays director, cast (comma-joined), and production company rows. Each row is omitted entirely when its data is absent.

### `LocationItem.tsx`

Renders a single filming location description plus an optional fun-fact line.

### `LocationsSection.tsx`

Wraps all `LocationItem` instances with a section header showing the total count.

### `StatsBar.tsx`

Small pill displaying total movie count and total location pin count.

### `LoadingScreen.tsx`

Full-screen overlay shown while data is fetching or when a fetch error occurs.

### `logger.ts` (`src/utils/`)

Lightweight structured logger with four levels: `debug`, `info`, `warn`, `error`. Debug messages are suppressed in production builds (`import.meta.env.PROD`). An optional context object is forwarded as a third argument to the console method. To integrate a remote logging service (Sentry, Datadog, etc.), replace the console calls inside `logger.ts` without touching any call-sites.

---

## Theming System

All visual tokens are exported from **`src/theme.ts`**:

```ts
colors        // bgDeep, accent (#f5c518), red, pink, textPri, textSec …
fonts         // sans: Montserrat, serif: Playfair Display
radius        // sm(6) → xxl(18) → full(50%)
shadows       // card, popup, logo, marker …

// Named CSSProperties objects
glassPanel, logoBadge, gradientTitle, overlayPanel …

// Factory functions (runtime props)
locationPin(selected, hovered)
yearFilterBtn(active)
loadingIconStyle(hasError)
overlayPanelStyle(rightOffset)
```

No component file contains a hardcoded `style={{ ... }}` literal — everything is imported from `theme.ts`.

---

## Environment Variables

All runtime configuration is read from environment variables prefixed with `VITE_` so that Vite inlines them at build time.

### Setup

```bash
cp .env.example .env
# Edit .env if you need to point at a different API endpoint
```

`.env` is listed in `.gitignore` and is never committed. `.env.example` (committed) documents every variable:

| Variable              | Description                             | Default / example                                                      |
| --------------------- | --------------------------------------- | ---------------------------------------------------------------------- |
| `VITE_DATASF_API_URL` | DataSF Film Locations API endpoint      | `https://data.sfgov.org/resource/yitu-d5am.json?$limit=3000&$offset=0` |
| `VITE_MAP_STYLE_URL`  | Map tile style JSON (CARTO Voyager CDN) | `https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json`         |

Both URLs are public and require no authentication keys. Overriding them is useful when running a local API proxy or a self-hosted map tile server.

---

## Getting Started

### Prerequisites

- **Node.js 18+**
- **npm 9+**

### Install

```bash
git clone <repo-url>
cd cinemap-sf
npm install
cp .env.example .env   # configure environment variables
```

### Run development server

```bash
npm run dev
```

Opens at **http://localhost:5173** with hot module replacement.

---

## Available Scripts

| Command             | Description                                |
| ------------------- | ------------------------------------------ |
| `npm run dev`       | Start Vite dev server with HMR             |
| `npm run build`     | Type-check + compile to `dist/`            |
| `npm run preview`   | Serve the production build locally         |
| `npm test`          | Run tests in interactive watch mode        |
| `npm run test:run`  | Run tests once and exit (CI-friendly)      |
| `npm run coverage`  | Run tests and generate a coverage report   |
| `npm run deploy`    | Build and publish to GitHub Pages          |
| `npx vitest run -u` | Re-run tests and update all snapshot files |

---

## Running Tests

```bash
# Interactive watch mode (re-runs on file save)
npm test

# Single pass — exits with code 0 on success, 1 on failure
npm run test:run
```

### Test configuration

| Setting         | Value                                                              |
| --------------- | ------------------------------------------------------------------ |
| Runner          | Vitest 4                                                           |
| DOM environment | happy-dom                                                          |
| Globals         | `describe`, `it`, `expect`, `vi` available without imports         |
| Setup file      | `src/test/setup.ts` — imports `@testing-library/jest-dom` matchers |

### Test files

| File                                                  | Tests   | Snapshots | Scope                                                                                                                      |
| ----------------------------------------------------- | ------- | --------- | -------------------------------------------------------------------------------------------------------------------------- |
| `src/services/dataSF.test.ts`                         | 22      | —         | `normaliseMovies` (grouping, filtering, parsing) + `fetchFilmLocations` (success, HTTP error, empty data, network failure) |
| `src/hooks/tests/useMovieData.test.ts`                | 8       | —         | Initial state, successful load, error state, marker ID format, `search()`                                                  |
| `src/hooks/tests/useAppState.test.ts`                 | 31      | —         | Search filter, year filter, selection state, marker highlight, combined filter logic                                       |
| `src/components/LoadingScreen/LoadingScreen.test.tsx` | 10      | 2         | Loading vs error UI, SVG rendering, conditional visibility                                                                 |
| `src/components/StatsBar/StatsBar.test.tsx`           | 8       | 2         | Count display, labels, rerenders, zero values                                                                              |
| `src/components/YearFilter/YearFilter.test.tsx`       | 13      | 3         | Dropdown open/close, decade filtering, correct callbacks, clear via X                                                      |
| `src/components/Search/SearchBar.test.tsx`            | 13      | 2         | Input render, fuzzy suggestions, filter callbacks, movie selection, clear                                                  |
| `src/components/Sidebar/MovieDetailPanel.test.tsx`    | 18      | 3         | Full/minimal/null renders, metadata fields, optional section omission, close callback                                      |
| `src/components/Sidebar/PanelHeader.test.tsx`         | 9       | 2         | Title render, year badge presence/absence, SVG icon, snapshot                                                              |
| `src/components/Sidebar/CreditsBlock.test.tsx`        | 16      | 3         | Director/cast/production rows, omission when absent, snapshot                                                              |
| `src/components/Sidebar/LocationItem.test.tsx`        | 10      | 2         | Location description, fun-fact presence/absence, snapshot                                                                  |
| `src/components/Sidebar/LocationsSection.test.tsx`    | 11      | 3         | Count header, item rendering, empty list, snapshot                                                                         |
| `src/utils/logger.test.ts`                            | 7       | —         | Each log level, correct console method, prefix format, context forwarding, method isolation                                |
| **Total**                                             | **176** | **25**    |                                                                                                                            |

---

### Snapshot tests

Twelve tests across five component files use `toMatchSnapshot()` to lock in rendered HTML structure. On first run Vitest writes the snapshots to `__snapshots__/` directories alongside each test file:

```
src/components/LoadingScreen/__snapshots__/LoadingScreen.test.tsx.snap
src/components/StatsBar/__snapshots__/StatsBar.test.tsx.snap
src/components/YearFilter/__snapshots__/YearFilter.test.tsx.snap
src/components/Search/__snapshots__/SearchBar.test.tsx.snap
src/components/Sidebar/__snapshots__/MovieDetailPanel.test.tsx.snap
src/components/Sidebar/__snapshots__/PanelHeader.test.tsx.snap
src/components/Sidebar/__snapshots__/CreditsBlock.test.tsx.snap
src/components/Sidebar/__snapshots__/LocationItem.test.tsx.snap
src/components/Sidebar/__snapshots__/LocationsSection.test.tsx.snap
```

Subsequent runs diff the rendered output against those files. A mismatch fails the test.

**After intentional UI changes**, regenerate the snapshots:

```bash
npx vitest run --update-snapshots
# or shorter:
npx vitest run -u
```

Commit the updated `.snap` files together with the component changes so the CI baseline stays in sync.

> **Note:** `MovieDetailPanel.test.tsx` mocks `framer-motion` (`AnimatePresence` → passthrough fragment, `motion.div` → plain `<div>`) so that animation wrappers don't produce non-deterministic attributes in snapshots.

---

## Test Coverage

```bash
npm run coverage
```

Generates:

- A **text summary** in the terminal
- An **HTML report** at `coverage/index.html` (open in browser for line-level detail)

Coverage is collected from all `src/**/*.{ts,tsx}` files, excluding `src/main.tsx` and `src/test/**`.

---

## Building for Production

```bash
npm run build
```

Output is written to `dist/`. The build:

1. Type-checks the entire project via `tsc`
2. Bundles and minifies with Rollup (via Vite)
3. Inlines CSS and hashes asset filenames for cache busting

To preview the built app locally:

```bash
npm run preview
# → http://localhost:4173
```

---

## Environment Notes

- **maplibre-gl must be v3.x** — the project is pinned to `maplibre-gl@3.6.2`. v4/v5 introduced breaking API changes incompatible with `react-map-gl@7`.
- **`.env` is required at runtime** — copy `.env.example` to `.env` before starting the dev server. The variables are public (no secrets), so the defaults from `.env.example` work out of the box.
- **Map tiles** are served from `https://basemaps.cartocdn.com` (CARTO Voyager style) — an internet connection is required at runtime.

---

## Deployment

The app is hosted as a static site on **GitHub Pages** at:

```
https://adityankannan.github.io/ReelSpot-SF/
```

### How it works

- `npm run build` compiles the app into `dist/` with all asset paths prefixed by `/ReelSpot-SF/` (set via `base` in `vite.config.ts`)
- `npm run deploy` runs the build then pushes `dist/` to the `gh-pages` branch using the `gh-pages` package
- GitHub Pages serves the `gh-pages` branch publicly

### Redeploy after changes

```bash
npm run deploy
```

That's it — one command rebuilds and pushes the latest version live.
