// Cloudflare Worker for the legacy origin (wc2026-tracker.….workers.dev).
//
// The World Cup 2026 tracker that used to live here was retired after the
// tournament ended. This origin now has exactly two jobs:
//
//   1. Keep serving the Forager's Atlas (/foraging.html + its assets).
//      The Atlas MUST stay on this origin: its field journal and favourites
//      live in per-origin browser storage, and its service worker registers
//      at root scope — moving it under HQ's URL would both orphan that data
//      and let its cache controller interfere with the HQ app.
//   2. Redirect everything else (old tracker bookmarks, the legacy
//      /kova.html copy of HQ) to https://hq.aarondweymann.workers.dev.
//
// /schedule.ics answers 410 Gone so subscribed calendar apps stop politely
// instead of re-downloading an HTML redirect forever.

import { handleSync } from './sync-api.js';

const HQ = 'https://hq.aarondweymann.workers.dev/';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const p = url.pathname;

    if (p === '/schedule.ics') {
      return new Response('This calendar feed ended with the 2026 World Cup. You can unsubscribe.', {
        status: 410,
        headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=86400' },
      });
    }
    if (p.startsWith('/api/sync')) return handleSync(request, env); // 501 — sync lives on hq
    if (p === '/' || p === '/index.html' || p === '/kova.html' || p === '/kova-guide.html' || p === '/guide.html') {
      return Response.redirect(HQ, 301);
    }

    const asset = await env.ASSETS.fetch(request);
    if (asset.status === 404) return Response.redirect(HQ, 302);
    return asset;
  },
};
