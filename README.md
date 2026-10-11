# ◉ HQ — Personal Command Center

**Live app:** https://hq.aarondweymann.workers.dev
*(open on your phone → Share → Add to Home Screen to install)*

HQ deploys as its own Cloudflare Worker (`wrangler.kova.jsonc`, staged by
`build-kova.js`, dashboard at the root path; the `kova-*` file names are
historic internals from the framework document's working title). The same app
also remains reachable at `…/kova.html` on the tracker's URL — browser data is
**per-origin**, so if you entered anything at the old URL, use
Settings → Export backup there and Import at the new one (or enable
device sync on both).

HQ is a personal operating system built from the Product Framework (whose
working title was "KOVA OS" — renamed so the personal dashboard doesn't carry
the Kova business brand): one prioritized view across your day, companies,
real estate, finances, investments, family, health, documents, goals and AI
agents.
This repo also hosts the [Forager's Atlas](#-foragers-atlas) further down.
(The World Cup 2026 tracker this repo was born as is retired — see the note
at the bottom.)

**Screens (the framework's 15-screen MVP):** Command Center · Today (with morning
brief + evening shutdown) · Universal Inbox · Calendar · Tasks · Projects ·
Business Portfolio (Kova Holdings / Living / Stays / TRIBE) · Real Estate
(pipeline, buy-box scoring, **live underwriting calculator**, owned-asset ops) ·
Finance & Net Worth (balance sheet, 90-day cash forecast, scenario modeling) ·
Investments (positions, covered-call/CSP tracking, concentration alerts) ·
**AI Agent Control Center** · Family & Health · Documents & Knowledge ·
Goals & Reviews (weekly review flow + decision journal) · Settings & Integrations.

**Global controls:** `⌘K` command palette & universal search · `c` quick capture
(with voice, on supported browsers) · approval queue · notification center ·
privacy mode (blurs all money values) · installable as a phone app (PWA manifest).

### Local-first by design

All data lives in **your browser's localStorage** — nothing readable is sent to any
server. The deployed page ships representative demo data; your edits stay on your
device. Export/import JSON backups from Settings → Data.

### Device sync (end-to-end encrypted)

Sync between phone and desktop runs through the hq Worker (`/api/sync`),
backed by a **Durable Object that deploys with the Worker itself** — no
namespaces, tokens, or setup steps. The app derives both the record id and an
AES-256-GCM key from your passphrase (PBKDF2, 310k iterations) and **encrypts
state in the browser before upload** — the server stores only ciphertext, and
a lost passphrase is unrecoverable by design. Conflicts are last-writer-wins
with an explicit "take cloud copy / overwrite" prompt.

To use it: on each device, open HQ → Settings → **Device sync** → same
passphrase everywhere. (Sync is served on the hq URL; the legacy `/kova.html`
copy on the tracker's address shows "not configured" by design.)

### Connecting your local AI model

The **AI Agents** screen supervises 12 agents (daily brief, comms triage, calendar
prep, RE sourcing, underwriting, market/options monitor, TRIBE content, document
filing, bill monitor, travel, health summary, weekly review compiler). Until a
model is connected they run in clearly-labeled **simulation** using your live data.
To make them real:

1. On your AI machine: `OLLAMA_ORIGINS="*" ollama serve` (or LM Studio with CORS
   enabled — anything with an OpenAI-compatible `/v1` endpoint works).
2. `ollama pull llama3.1:8b` (or your model of choice).
3. In HQ: **Settings → AI Gateway** → pick preset → **Test & save connection**.

Every run is logged; agents *propose*, you *approve* (approval levels L0–L4 per
the framework §14.3). The **Copilot** chat (✦ button) answers across a live
snapshot of your system — entirely on your hardware.

Communications (Gmail, Google Calendar, Shopify, Apple Health) bridge in through
**n8n** running on the same machine — configure the webhook under Settings, and
the Inbox "Sync" button pulls from it. The expected payload is documented in-app.

### Calendar export

The Calendar screen can export your upcoming HQ events as an `.ics` file —
open it on iPhone/Mac to drop the events into Apple Calendar.

-----

## 🌿 Forager's Atlas

**Live app:** https://wc2026-tracker.aarondweymann.workers.dev/foraging.html
*(this address must stay as-is — the Atlas's field journal and favourites are
saved in the browser against it)*

This repo also hosts a standalone **Forager's Atlas** at [`/foraging.html`](foraging.html) — a safety-first, region-based reference to wild **edible & medicinal plants**.

- **Pick a region/territory** (21 regions across 6 continents) and see every plant that grows there
- **Search by name, use, or ailment** (e.g. "cough", "sore throat", "blood pressure")
- Filter by **use** (food / medicine) and **season**
- Each plant has a **procedurally-drawn botanical illustration** (self-contained SVG — always loads, no external images), plus **identification notes, colour-coded toxic look-alike warnings, benefits, and recipes** to make food and medicine, with dosage cautions and sustainable-harvest notes
- Deep **United States** coverage across all eight sub-regions (Eastern Woodlands, Southeast, Midwest & Plains, Pacific Northwest, California, Southwest, Rockies, Boreal)
- **Installable offline PWA** (`manifest.json` + `sw.js`) — works in the field with no signal
- **Seasonal tools:** "in season now", a month-by-month foraging calendar, and geolocation "Near me" region detection
- **Discovery:** shareable deep-link URLs per plant/region, filters by plant part & conservation status (invasive vs. at-risk), and an ailment quick-select row
- **Safety mode:** a deadly/toxic look-alike comparison guide, one-tap poison-control, and a "before you eat" checklist
- **Favourites** (saved locally) and optional **reference photos** fetched on demand from Wikipedia (with the illustration as a guaranteed fallback)
- **Field journal** (log your finds with date/place/notes, saved locally), a **preparation-methods glossary** (tincture, decoction, infusion, salve, poultice, syrup, oxymel), and a **printable field guide** of the current filtered list
- 120+ plants · 145+ recipes & remedies · zero dependencies, pure HTML/CSS/JS

Data lives in [`forage-data.js`](forage-data.js) — add plants by appending to the `FORAGE_DATA` array (schema documented at the top of the file). Illustrations are generated by [`forage-art.js`](forage-art.js); a plant can set an `img` URL to override the drawing with a real photo (falls back to the drawing if the photo fails to load).

> ⚠️ **Educational use only.** Never eat or medicate with a wild plant without in-person expert confirmation — several listed species have deadly look-alikes. Not medical advice.

-----

## 🏁 Retired: World Cup 2026 Tracker

This repository began life as a live World Cup 2026 tracker (scores, group
standings, knockout bracket, stats, venues, an iCloud calendar feed). The
tournament ended, so the app was removed; its old address now redirects to
HQ, the Atlas keeps serving from `/foraging.html`, and `/schedule.ics`
answers 410 Gone so subscribed calendars stop cleanly. The full tracker
lives on in the git history if it's ever wanted for 2030.

-----

## Stack

Pure HTML/CSS/JS · zero dependencies · zero build tools (a small Node script
stages HQ's bundle) · two Cloudflare Workers (`hq`, and the legacy origin
hosting the Atlas) deployed by GitHub Actions on every push.
