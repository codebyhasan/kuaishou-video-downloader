/* ============================================================
   Kuaishou Video Downloader — content.js  v3
   Works on: feed pages + /short-video/{id} direct pages
   ============================================================ */
(() => {
  'use strict';

  // ─── CSS ──────────────────────────────────────────────────────────────────────
  const STYLE = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600&display=swap');

    #ksdown-widget {
      position: fixed !important;
      bottom: 32px !important;
      right: 32px !important;
      z-index: 2147483647 !important;
      font-family: 'DM Sans', system-ui, sans-serif !important;
      line-height: 1 !important;
      font-size: 13px !important;
    }
    #ksdown-widget, #ksdown-widget * {
      box-sizing: border-box !important;
    }

    /* ─ Pill ──────────────────────────────── */
    #ksdown-pill {
      display: flex !important;
      align-items: center !important;
      gap: 10px !important;
      background: rgba(10,10,10,0.94) !important;
      backdrop-filter: blur(20px) saturate(180%) !important;
      -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
      border: 1px solid rgba(255,255,255,0.09) !important;
      border-radius: 100px !important;
      padding: 11px 18px 11px 13px !important;
      cursor: pointer !important;
      transition: all 0.22s cubic-bezier(0.34,1.56,0.64,1) !important;
      box-shadow: 0 8px 32px rgba(0,0,0,0.45), 0 1px 0 rgba(255,255,255,0.04) inset !important;
      user-select: none !important;
      white-space: nowrap !important;
      margin: 0 !important;
      padding-top: 11px !important;
      padding-bottom: 11px !important;
    }
    #ksdown-pill:hover {
      border-color: rgba(255,84,0,0.28) !important;
      transform: translateY(-2px) !important;
      box-shadow: 0 14px 44px rgba(0,0,0,0.5), 0 0 0 3px rgba(255,84,0,0.07) !important;
    }
    #ksdown-pill.no-video #ksdown-pill-icon { background: rgba(255,255,255,0.08) !important; box-shadow: none !important; }
    #ksdown-pill.no-video #ksdown-pill-label { color: rgba(255,255,255,0.3) !important; }
    #ksdown-pill.is-open #ksdown-pill-arrow { transform: rotate(180deg) !important; color: rgba(255,255,255,0.65) !important; }

    #ksdown-pill-icon {
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      width: 24px !important;
      height: 24px !important;
      min-width: 24px !important;
      background: #FF5400 !important;
      border-radius: 7px !important;
      box-shadow: 0 2px 8px rgba(255,84,0,0.4) !important;
      transition: all 0.2s ease !important;
    }
    #ksdown-pill-icon svg { width: 13px !important; height: 13px !important; display: block !important; }
    #ksdown-pill-label {
      color: rgba(255,255,255,0.85) !important;
      font-size: 13px !important;
      font-weight: 400 !important;
      letter-spacing: 0.01em !important;
      font-family: 'DM Sans', system-ui, sans-serif !important;
    }
    #ksdown-pill-divider {
      display: block !important;
      width: 1px !important;
      height: 14px !important;
      min-height: 14px !important;
      background: rgba(255,255,255,0.1) !important;
    }
    #ksdown-pill-arrow {
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      width: 20px !important;
      height: 20px !important;
      color: rgba(255,255,255,0.3) !important;
      transition: transform 0.28s cubic-bezier(0.34,1.56,0.64,1), color 0.2s !important;
    }
    #ksdown-pill-arrow svg { width: 11px !important; height: 11px !important; display: block !important; }

    /* ─ Panel ─────────────────────────────── */
    #ksdown-panel {
      display: block !important;
      position: absolute !important;
      bottom: calc(100% + 12px) !important;
      right: 0 !important;
      width: 350px !important;
      background: rgba(8,8,8,0.97) !important;
      backdrop-filter: blur(28px) saturate(200%) !important;
      -webkit-backdrop-filter: blur(28px) saturate(200%) !important;
      border: 1px solid rgba(255,255,255,0.09) !important;
      border-radius: 20px !important;
      overflow: hidden !important;
      box-shadow: 0 32px 80px rgba(0,0,0,0.7), 0 0 0 0.5px rgba(255,255,255,0.03) !important;
      opacity: 0 !important;
      transform: translateY(10px) scale(0.96) !important;
      pointer-events: none !important;
      transition: opacity 0.24s ease, transform 0.24s cubic-bezier(0.34,1.3,0.64,1) !important;
      transform-origin: bottom right !important;
    }
    #ksdown-panel.is-visible {
      opacity: 1 !important;
      transform: translateY(0) scale(1) !important;
      pointer-events: all !important;
    }

    #ksdown-panel.is-visible {
      opacity: 1 !important;
      transform: translateY(0) scale(1) !important;
      pointer-events: all !important;
    }

    /* Header */
    #ksdown-panel-header {
      display: flex !important;
      align-items: center !important;
      gap: 9px !important;
      padding: 18px 20px 15px !important;
      border-bottom: 1px solid rgba(255,255,255,0.05) !important;
    }
    #ksdown-status-dot {
      display: block !important;
      width: 7px !important;
      height: 7px !important;
      min-width: 7px !important;
      border-radius: 50% !important;
      background: rgba(255,255,255,0.15) !important;
      transition: background 0.3s !important;
    }
    #ksdown-status-dot.active {
      background: #FF5400 !important;
      box-shadow: 0 0 6px rgba(255,84,0,0.5) !important;
      animation: ksd-pulse 2.5s ease-in-out infinite !important;
    }
    @keyframes ksd-pulse { 0%,100%{box-shadow:0 0 6px rgba(255,84,0,0.4)} 50%{box-shadow:0 0 14px rgba(255,84,0,0.75)} }
    #ksdown-panel-hdrtitle {
      display: block !important;
      color: rgba(255,255,255,0.38) !important;
      font-size: 10.5px !important;
      font-weight: 600 !important;
      letter-spacing: 0.1em !important;
      text-transform: uppercase !important;
      flex: 1 !important;
      font-family: 'DM Sans', system-ui !important;
    }
    #ksdown-refresh-btn {
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      width: 28px !important;
      height: 28px !important;
      min-width: 28px !important;
      border-radius: 8px !important;
      background: rgba(255,255,255,0.05) !important;
      border: 1px solid rgba(255,255,255,0.07) !important;
      cursor: pointer !important;
      color: rgba(255,255,255,0.28) !important;
      transition: all 0.18s ease !important;
    }
    #ksdown-refresh-btn:hover { background: rgba(255,255,255,0.09) !important; color: rgba(255,255,255,0.65) !important; }
    #ksdown-refresh-btn svg { width: 12px !important; height: 12px !important; display: block !important; }
    #ksdown-refresh-btn.spinning svg { animation: ksd-spin 0.55s linear infinite !important; }
    @keyframes ksd-spin { to { transform: rotate(360deg) !important; } }

    /* Info rows */
    .ksd-row {
      display: block !important;
      padding: 14px 20px !important;
      border-bottom: 1px solid rgba(255,255,255,0.04) !important;
    }
    .ksd-row.hidden { display: none !important; }
    .ksd-row:last-child { border-bottom: none !important; }
    .ksd-lbl {
      display: block !important;
      color: rgba(255,255,255,0.5) !important;
      font-size: 10px !important;
      font-weight: 600 !important;
      letter-spacing: 0.1em !important;
      text-transform: uppercase !important;
      margin-bottom: 7px !important;
      font-family: 'DM Sans', system-ui !important;
    }
    .ksd-val {
      display: block !important;
      color: rgba(255,255,255,0.78) !important;
      font-size: 13px !important;
      font-weight: 400 !important;
      line-height: 1.55 !important;
      word-break: break-word !important;
      font-family: 'DM Sans', system-ui !important;
    }
    .ksd-val.mono {
      font-family: 'DM Mono', monospace !important;
      font-size: 11.5px !important;
      color: rgba(255,190,130,0.9) !important;
      letter-spacing: 0.03em !important;
    }
    .ksd-val.muted { color: rgba(255,255,255,0.25) !important; font-style: italic !important; }
    .ksd-val.placeholder { color: rgba(255,255,255,0.3) !important; font-style: italic !important; }
    .ksd-row.clickable { cursor: pointer !important; transition: background 0.15s ease !important; }
    .ksd-row.clickable:hover { background: rgba(255,255,255,0.04) !important; }
    .ksd-row.clickable:active { background: rgba(255,255,255,0.07) !important; }
    #ksd-fname-block.clickable { cursor: pointer !important; transition: background 0.15s ease !important; border-radius: 12px !important; }
    #ksd-fname-block.clickable:hover { background: rgba(255,84,0,0.08) !important; }
    #ksd-fname-block.clickable:active { background: rgba(255,84,0,0.12) !important; }
    #ksd-fname-block.clickable .ksd-val { cursor: copy !important; }
    .ksd-val.url {
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      white-space: nowrap !important;
      max-width: 100% !important;
    }
    .ksd-row.clickable .ksd-val { cursor: copy !important; }

    /* Filename block */
    #ksd-fname-block {
      display: block !important;
      margin: 8px 16px 6px !important;
      border-radius: 12px !important;
      background: rgba(255,84,0,0.05) !important;
      border: 1px solid rgba(255,84,0,0.12) !important;
      padding: 14px 16px !important;
    }
    #ksd-fname-block .ksd-lbl { color: rgba(255,130,60,0.7) !important; margin-bottom: 8px !important; }
    #ksd-fname-block .ksd-val { font-family: 'DM Mono', monospace !important; font-size: 11px !important; color: rgba(255,190,130,0.82) !important; line-height: 1.7 !important; }

    /* Progress */
    #ksd-prog-wrap { display: none !important; padding: 2px 16px 12px !important; }
    #ksd-prog-wrap.show { display: block !important; }
    #ksd-prog-meta { display: flex !important; justify-content: space-between !important; font-size: 10.5px !important; color: rgba(255,255,255,0.32) !important; margin-bottom: 7px !important; font-family: 'DM Sans', system-ui !important; }
    #ksd-prog-bg { display: block !important; height: 3px !important; background: rgba(255,255,255,0.07) !important; border-radius: 100px !important; overflow: hidden !important; }
    #ksd-prog-fill { display: block !important; height: 100% !important; background: linear-gradient(90deg,#FF5400,#ff8040) !important; border-radius: 100px !important; width: 0% !important; transition: width 0.25s ease !important; }

    /* Actions */
    #ksd-actions { display: flex !important; flex-direction: column !important; gap: 8px !important; padding: 10px 16px 18px !important; }
    #ksd-dl-row { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 8px !important; }
    .ksd-btn {
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 7px !important;
      padding: 12px 14px !important;
      border-radius: 11px !important;
      border: none !important;
      cursor: pointer !important;
      font-family: 'DM Sans', system-ui, sans-serif !important;
      font-size: 12.5px !important;
      font-weight: 500 !important;
      letter-spacing: 0.01em !important;
      transition: all 0.18s ease !important;
      white-space: nowrap !important;
      text-decoration: none !important;
    }
    .ksd-btn svg { width: 13px !important; height: 13px !important; min-width: 13px !important; display: block !important; }
    .ksd-btn-ghost { background: rgba(255,255,255,0.055) !important; color: rgba(255,255,255,0.58) !important; border: 1px solid rgba(255,255,255,0.08) !important; }
    .ksd-btn-ghost:hover { background: rgba(255,255,255,0.09) !important; color: rgba(255,255,255,0.88) !important; border-color: rgba(255,255,255,0.14) !important; }
    .ksd-btn-ghost:disabled, .ksd-btn-primary:disabled { opacity: 0.28 !important; cursor: not-allowed !important; pointer-events: none !important; }
    .ksd-btn-primary { grid-column: 1 / -1 !important; background: #FF5400 !important; color: #fff !important; border: 1px solid transparent !important; box-shadow: 0 2px 12px rgba(255,84,0,0.28) !important; }
    .ksd-btn-primary:hover { background: #ff6820 !important; transform: translateY(-1px) !important; box-shadow: 0 6px 22px rgba(255,84,0,0.42) !important; }
    .ksd-btn.loading { pointer-events: none !important; opacity: 0.65 !important; }
    .ksd-btn.success { background: rgba(34,197,94,0.1) !important; color: #4ade80 !important; border-color: rgba(34,197,94,0.16) !important; box-shadow: none !important; transform: none !important; }

    /* Toast */
    #ksdown-toast {
      display: block !important;
      position: fixed !important;
      bottom: 92px !important;
      right: 32px !important;
      background: rgba(10,10,10,0.95) !important;
      border: 1px solid rgba(255,255,255,0.09) !important;
      color: rgba(255,255,255,0.8) !important;
      font-family: 'DM Sans', system-ui !important;
      font-size: 12.5px !important;
      padding: 10px 16px !important;
      border-radius: 10px !important;
      z-index: 2147483647 !important;
      opacity: 0 !important;
      transform: translateY(5px) !important;
      transition: all 0.22s ease !important;
      pointer-events: none !important;
      backdrop-filter: blur(16px) !important;
      box-shadow: 0 8px 28px rgba(0,0,0,0.5) !important;
      max-width: 290px !important;
    }
    #ksdown-toast.show { opacity: 1 !important; transform: translateY(0) !important; }
  `;

  // ─── Icons ────────────────────────────────────────────────────────────────────
  const I = {
    dl:      `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 2v7M5.5 6.5 8 9l2.5-2.5M3 13h10" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    chevron: `<svg viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 4 5.5 7.5 9 4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    copy:    `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="5" width="8" height="9" rx="1.5" stroke="currentColor" stroke-width="1.6"/><path d="M3 11V3.5A1.5 1.5 0 0 1 4.5 2H10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
    open:    `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 3H3v10h10v-3M9 2h5v5M14 2 8 9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    check:   `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 8l4 4 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    spin:    `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.5 8A5.5 5.5 0 1 1 8 2.5M13.5 2.5v3.5H10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    img:     `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.5"/><circle cx="5.5" cy="5.5" r="1" fill="currentColor"/><path d="M2 11l3.5-3.5L8 10l2-2 4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    film:    `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="2.5" stroke="currentColor" stroke-width="1.5"/><line x1="7" y1="3" x2="7" y2="21" stroke="currentColor" stroke-width="1.3"/><line x1="17" y1="3" x2="17" y2="21" stroke="currentColor" stroke-width="1.3"/><line x1="3" y1="8" x2="7" y2="8" stroke="currentColor" stroke-width="1.3"/><line x1="17" y1="8" x2="21" y2="8" stroke="currentColor" stroke-width="1.3"/><line x1="3" y1="12" x2="7" y2="12" stroke="currentColor" stroke-width="1.3"/><line x1="17" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="1.3"/></svg>`,
  };

  // ─── State ────────────────────────────────────────────────────────────────────
  let isOpen = false;
  let currentData = null;
  let isDownloading = false;

  // ─── Safe DOM helpers ─────────────────────────────────────────────────────────
  function sq(root, sel) { try { return (root || document).querySelector(sel); } catch (e) { return null; } }
  function sqa(root, sel) { try { return Array.from((root || document).querySelectorAll(sel)); } catch (e) { return []; } }
  function txt(el) { try { return el ? (el.textContent || '').trim() : ''; } catch (e) { return ''; } }
  function src(el) { try { return el ? (el.src || el.getAttribute('src') || '') : ''; } catch (e) { return ''; } }

  // ─── Page type detection ──────────────────────────────────────────────────────
  function isShortVideoPage() {
    return /\/short-video\//.test(location.pathname);
  }

  // ─── Video ID from URL (for /short-video/ pages) ──────────────────────────────
  function getIdFromUrl() {
    const m = location.pathname.match(/\/short-video\/([a-zA-Z0-9]+)/);
    return m ? m[1] : null;
  }

  // ─── Find video element — works on both feed and single video pages ───────────
  function findVideoEl() {
    // Short-video page: .player-video
    if (isShortVideoPage()) {
      const shortVideoEl = document.querySelector('.player-video');
      if (shortVideoEl && shortVideoEl.src && !shortVideoEl.src.startsWith('blob:')) {
        return shortVideoEl;
      }
    }
    
    // Default/Feed page: find active video in swiper
    const activeSelectors = [
      '.swiper-slide-active video[src*="kwaicdn"]',
      '.swiper-slide-active video[src*="ksc2"]',
      '.swiper-slide-active video[src*="kwai"]',
      '.swiper-slide-active video.kplayer-video',
      '.feed-video-container video[src*="kwai"]',
      '.video-playing video[src*="kwai"]',
    ];
    
    for (const sel of activeSelectors) {
      try {
        const v = document.querySelector(sel);
        if (v && v.src && !v.src.startsWith('blob:')) return v;
      } catch (e) { /* continue */ }
    }
    
    // Try other selectors
    const selectors = [
      'video[src*="kwaicdn"]',
      'video[src*="ksc2"]', 
      'video[src*="kwai"]',
      'video.kplayer-video',
    ];

    for (const sel of selectors) {
      try {
        const v = document.querySelector(sel);
        if (v && v.src && !v.src.startsWith('blob:')) return v;
      } catch (e) { /* continue */ }
    }

    return null;
  }

  // ─── Metadata scrapers — multiple strategies ──────────────────────────────────
  function scrapeTitle(container) {
    // Short-video page: .video-info-title
    if (isShortVideoPage()) {
      let el = document.querySelector('.video-info-title');
      if (el) {
        const t = txt(el).replace(/\s+/g, ' ').trim();
        if (t.length > 3) return t.slice(0, 200);
      }
    }
    
    // Default/Feed page: look in active swiper slide
    const activeTitle = document.querySelector('.swiper-slide-active .caption');
    if (activeTitle) {
      const t = txt(activeTitle).replace(/\s+/g, ' ').trim();
      if (t.length > 3) return t.slice(0, 200);
    }
    
    // Try container first - look for caption
    const capSelectors = ['.caption', '.video-caption'];
    for (const sel of capSelectors) {
      const el2 = sq(container, sel);
      if (el2) {
        const t = txt(el2).replace(/\s+/g, ' ').trim();
        if (t.length > 3) return t.slice(0, 200);
      }
    }
    
    // Try page level caption
    const pageCaps = document.querySelectorAll('.caption, [class*="caption"]');
    for (const el3 of pageCaps) {
      const t = txt(el3).replace(/\s+/g, ' ').trim();
      if (t.length > 3 && !t.startsWith('#')) return t.slice(0, 200);
    }
    
    // Try page title
    try {
      const pageTitle = document.title || '';
      if (pageTitle && pageTitle !== '快手' && pageTitle.length > 3) {
        return pageTitle.replace(/_快手.*$/, '').replace(/-快手.*$/, '').trim();
      }
    } catch (e) { /* ignore */ }
    
    // Try og:title
    try {
      const og = document.querySelector('meta[property="og:title"]');
      if (og) return og.getAttribute('content') || '';
    } catch (e) { /* ignore */ }
    
    return '';
  }

  function scrapeCreator(container) {
    // Short-video page: .profile-user-name-title
    if (isShortVideoPage()) {
      let el = document.querySelector('.profile-user-name-title');
      if (el) {
        const t = txt(el).replace(/^@/, '').trim();
        if (t) return t;
      }
    }
    
    // Default/Feed page: look in active swiper slide
    const activeCreator = document.querySelector('.swiper-slide-active .author-name, .swiper-slide-active [class*="author"] .name, .swiper-slide-active .user-name');
    if (activeCreator) {
      const t = txt(activeCreator).replace(/^@/, '').trim();
      if (t) return t;
    }
    
    // Try container first
    const containerSelectors = [
      '.author-name', 
      '[class*="author"] .name',
      '[class*="user"] .name',
      '.user-name',
      '.nick-name',
    ];
    for (const sel of containerSelectors) {
      const el2 = sq(container, sel);
      const t = txt(el2).replace(/^@/, '').trim();
      if (t) return t;
    }
    
    // Try page level
    const pageSelectors = [
      'span.name', 
      'a[href*="/profile/"] .name',
      '.user-info .name',
      '[class*="profile"] [class*="name"]',
    ];
    for (const sel of pageSelectors) {
      const el2 = document.querySelector(sel);
      const t = txt(el2).replace(/^@/, '').trim();
      if (t) return t;
    }
    
    // Try page meta
    try {
      const og = document.querySelector('meta[name="author"], meta[property="og:site_name"]');
      if (og) return (og.getAttribute('content') || '').trim();
    } catch (e) { /* ignore */ }
    
    return '';
  }

  function scrapeThumb(container) {
    // Short-video page: check video poster attribute first
    const posterVideo = document.querySelector('.video-container-player[poster]');
    if (posterVideo) {
      const poster = posterVideo.getAttribute('poster');
      if (poster && !poster.startsWith('data:')) return poster;
    }
    
    // Short-video page: check background-image style
    const bgEl = document.querySelector('.backimg-area');
    if (bgEl) {
      const style = bgEl.getAttribute('style') || '';
      const match = style.match(/url\(["']?([^"')]+)["']?\)/);
      if (match && match[1]) return match[1];
    }
    
    // Try container
    const selectors = [
      'img.background', 'img[class*="background"]', 'img[class*="poster"]',
      'img[class*="thumb"]', 'img[class*="cover"]',
    ];
    for (const sel of selectors) {
      const el = sq(container, sel) || document.querySelector(sel);
      const s = src(el);
      if (s && !s.startsWith('data:') && (s.includes('kwai') || s.includes('http'))) return s;
    }
    // og:image
    try {
      const og = document.querySelector('meta[property="og:image"]');
      if (og) { const u = og.getAttribute('content'); if (u) return u; }
    } catch (e) { /* ignore */ }
    return '';
  }

  function scrapeTimestamp(container) {
    // Short-video page: .photo-time
    if (isShortVideoPage()) {
      let el = document.querySelector('.photo-time');
      if (el) {
        const t = txt(el).trim();
        if (t) return t;
      }
    }
    
    // Default/Feed page: look in active swiper slide
    const activeTime = document.querySelector('.swiper-slide-active .timestamp, .swiper-slide-active [class*="time"]');
    if (activeTime) {
      const t = txt(activeTime).trim();
      if (t && t.length > 0 && t.length < 50) return t;
    }
    
    const selectors = ['.timestamp', '[class*="time"]', '[class*="date"]'];
    for (const sel of selectors) {
      const el2 = sq(container, sel) || document.querySelector(sel);
      const t = txt(el2);
      if (t && t.length > 0 && t.length < 50) return t;
    }
    return '';
  }

  // ─── Main extraction ──────────────────────────────────────────────────────────
  function extractVideoData() {
    try {
      const videoEl = findVideoEl();
      if (!videoEl) return null;

      const rawSrc = videoEl.src || '';
      if (!rawSrc) return null;

      // Parse clientCacheKey from URL
      let videoId = '';
      try {
        const u = new URL(rawSrc);
        const cck = u.searchParams.get('clientCacheKey') || '';
        videoId = cck.split('_')[0];
      } catch (e) { /* ignore */ }

      // Fallback: get ID from page URL for /short-video/ pages
      if (!videoId) videoId = getIdFromUrl() || '';
      if (!videoId) return null;

      // Find the closest meaningful container
      let container;
      if (isShortVideoPage()) {
        container = videoEl.closest('[class*="video"]') || document.body;
      } else {
        // Default/Feed page: use active swiper slide
        const activeSlide = document.querySelector('.swiper-slide-active');
        container = activeSlide || videoEl.closest('[class*="video"]') || videoEl.closest('[class*="feed"]') || document.body;
      }

      const title      = scrapeTitle(container);
      const creator    = scrapeCreator(container);
      const thumbSrc   = scrapeThumb(container);
      const timestamp  = scrapeTimestamp(container);
      const directUrl  = 'https://www.kuaishou.com/short-video/' + videoId;

      const clean = (s) => (s || '').replace(/[/\\?%*:|"<>\n\r\t]/g, ' ').replace(/\s+/g, ' ').trim();
      const safeTitle   = clean(title).slice(0, 120) || 'kuaishou-video';
      const safeCreator = clean(creator) || 'unknown';
      const baseName    = safeTitle + ' @' + safeCreator + ' [Kuaishou ' + videoId + ']';

      return {
        videoId, creator, title, timestamp,
        directUrl,
        videoSrc:     rawSrc,
        thumbnailSrc: thumbSrc,
        filename:     baseName + '.mp4',
        thumbname:    baseName + '.jpg',
      };
    } catch (e) {
      console.warn('[KsDown] extractVideoData error:', e);
      return null;
    }
  }

  // ─── Blob downloader ──────────────────────────────────────────────────────────
  async function blobDownload(url, filename, onProgress) {
    if (!url || !filename) return;
    try {
      const resp = await fetch(url, { mode: 'cors' });
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      const total = parseInt(resp.headers.get('Content-Length') || '0', 10);
      const reader = resp.body.getReader();
      const chunks = [];
      let received = 0;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        received += value.length;
        if (onProgress && total > 0) onProgress(Math.round(received / total * 100));
      }
      const blob = new Blob(chunks);
      const blobUrl = URL.createObjectURL(blob);
      fireAnchor(blobUrl, filename);
      setTimeout(() => { try { URL.revokeObjectURL(blobUrl); } catch (e) {} }, 8000);
    } catch (e) {
      console.warn('[KsDown] fetch failed, anchor fallback:', e);
      fireAnchor(url, filename);
    }
  }

  function fireAnchor(url, filename) {
    try {
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.style.cssText = 'position:fixed;opacity:0;pointer-events:none;top:-999px';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => { try { document.body.removeChild(a); } catch (e) {} }, 300);
    } catch (e) { console.warn('[KsDown] anchor error:', e); }
  }

  // ─── Widget ───────────────────────────────────────────────────────────────────
  function buildWidget() {
    try {
      const s = document.createElement('style');
      s.id = 'ksdown-style';
      s.textContent = STYLE;
      document.head.appendChild(s);
    } catch (e) {}

    const toast = document.createElement('div');
    toast.id = 'ksdown-toast';
    document.body.appendChild(toast);

    const w = document.createElement('div');
    w.id = 'ksdown-widget';
    w.innerHTML = `
      <div id="ksdown-panel">
        <div id="ksdown-panel-header">
          <div id="ksdown-status-dot"></div>
          <span id="ksdown-panel-hdrtitle">Detected Video</span>
          <button id="ksdown-refresh-btn" title="Re-scan">${I.spin}</button>
        </div>
        <div id="ksdown-panel-body">
          <div class="ksd-row clickable" id="ksd-row-title" data-copy="title">
            <span class="ksd-lbl">Title</span>
            <span class="ksd-val" id="ksd-v-title">—</span>
          </div>
          <div class="ksd-row clickable" id="ksd-row-creator" data-copy="creator">
            <span class="ksd-lbl">Creator</span>
            <span class="ksd-val" id="ksd-v-creator">—</span>
          </div>
          <div class="ksd-row clickable" id="ksd-row-videoid" data-copy="videoId">
            <span class="ksd-lbl">Video ID</span>
            <span class="ksd-val mono" id="ksd-v-id">—</span>
          </div>
          <div class="ksd-row clickable hidden" id="ksd-row-time" data-copy="timestamp">
            <span class="ksd-lbl">Posted</span>
            <span class="ksd-val" id="ksd-v-time">—</span>
          </div>
          <div class="ksd-row clickable" id="ksd-row-thumburl" data-copy="thumbnailSrc">
            <span class="ksd-lbl">Thumbnail URL</span>
            <span class="ksd-val mono url" id="ksd-v-thumburl">—</span>
          </div>
          <div class="ksd-row clickable" id="ksd-row-videourl" data-copy="videoSrc">
            <span class="ksd-lbl">Video URL</span>
            <span class="ksd-val mono url" id="ksd-v-videourl">—</span>
          </div>
          <div class="ksd-row clickable" id="ksd-row-directurl" data-copy="directUrl">
            <span class="ksd-lbl">Direct URL</span>
            <span class="ksd-val mono url" id="ksd-v-directurl">—</span>
          </div>
        </div>
        <div id="ksd-fname-block" class="clickable" data-copy="filename">
          <span class="ksd-lbl">Output Filename</span>
          <span class="ksd-val" id="ksd-v-fname">—</span>
        </div>
        <div id="ksd-prog-wrap">
          <div id="ksd-prog-meta">
            <span id="ksd-prog-text">Downloading…</span>
            <span id="ksd-prog-pct"></span>
          </div>
          <div id="ksd-prog-bg"><div id="ksd-prog-fill"></div></div>
        </div>
        <div id="ksd-actions">
          <button class="ksd-btn ksd-btn-ghost" id="ksd-open">${I.open} Open in Short Page</button>
          <div id="ksd-dl-row">
            <button class="ksd-btn ksd-btn-ghost" id="ksd-dl-thumb">${I.img} Thumbnail</button>
            <button class="ksd-btn ksd-btn-ghost" id="ksd-dl-video">${I.dl} Video</button>
          </div>
          <button class="ksd-btn ksd-btn-primary" id="ksd-dl-all">${I.dl} Download</button>
        </div>
      </div>
      <div id="ksdown-pill">
        <div id="ksdown-pill-icon">${I.dl}</div>
        <span id="ksdown-pill-label">Download Kuaishou Video</span>
        <span id="ksdown-pill-divider"></span>
        <div id="ksdown-pill-arrow">${I.chevron}</div>
      </div>
    `;
    document.body.appendChild(w);
    attachEvents();
    updatePillState();
  }

  function attachEvents() {
    const pill  = document.getElementById('ksdown-pill');
    const panel = document.getElementById('ksdown-panel');

    pill.addEventListener('click', function (e) {
      e.stopPropagation();
      isOpen = !isOpen;
      pill.classList.toggle('is-open', isOpen);
      panel.classList.toggle('is-visible', isOpen);
      if (isOpen) refreshPanel();
    });

    document.getElementById('ksdown-refresh-btn').addEventListener('click', function (e) {
      e.stopPropagation();
      const btn = document.getElementById('ksdown-refresh-btn');
      btn.classList.add('spinning');
      refreshPanel();
      setTimeout(() => btn.classList.remove('spinning'), 500);
    });

    document.getElementById('ksd-open').addEventListener('click', function (e) {
      e.stopPropagation();
      if (currentData && currentData.directUrl) window.open(currentData.directUrl, '_blank');
    });

    document.getElementById('ksd-dl-thumb').addEventListener('click', async function (e) {
      e.stopPropagation();
      try {
        if (!currentData || !currentData.thumbnailSrc) { showToast('No thumbnail found'); return; }
        btnBusy('#ksd-dl-thumb', I.spin + ' Saving…');
        await blobDownload(currentData.thumbnailSrc, currentData.thumbname, null);
        btnOk('#ksd-dl-thumb', I.check + ' Saved!', I.img + ' Thumbnail');
        showToast('✓ Thumbnail saved');
      } catch (err) {
        console.warn('[KsDown] thumb err:', err);
        btnOk('#ksd-dl-thumb', I.img + ' Thumbnail', I.img + ' Thumbnail', 0);
        showToast('Failed — try again');
      }
    });

    document.getElementById('ksd-dl-video').addEventListener('click', async function (e) {
      e.stopPropagation();
      try {
        if (!currentData || !currentData.videoSrc || isDownloading) return;
        isDownloading = true;
        btnBusy('#ksd-dl-video', I.spin + ' Saving…');
        showProg(true);
        await blobDownload(currentData.videoSrc, currentData.filename, setPct);
        btnOk('#ksd-dl-video', I.check + ' Saved!', I.dl + ' Video');
        showToast('✓ Video saved: ' + currentData.filename);
      } catch (err) {
        console.warn('[KsDown] video err:', err);
        showToast('Failed — try again');
      } finally {
        isDownloading = false;
        showProg(false);
      }
    });

    document.getElementById('ksd-dl-all').addEventListener('click', async function (e) {
      e.stopPropagation();
      if (!currentData || isDownloading) return;
      isDownloading = true;
      const btn = document.getElementById('ksd-dl-all');
      try {
        if (btn) { btn.classList.add('loading'); btn.innerHTML = I.spin + ' Downloading…'; }
        showProg(true);
        setProgLabel('Downloading video…');
        await blobDownload(currentData.videoSrc, currentData.filename, setPct);
        if (currentData.thumbnailSrc) {
          setProgLabel('Downloading thumbnail…');
          setPct(0);
          await blobDownload(currentData.thumbnailSrc, currentData.thumbname, null);
        }
        if (btn) { btn.classList.remove('loading'); btn.classList.add('success'); btn.innerHTML = I.check + ' All done!'; }
        showToast('✓ Video & thumbnail saved!');
        setTimeout(function () {
          try { if (btn) { btn.classList.remove('success'); btn.innerHTML = I.dl + ' Download Video + Thumbnail'; } } catch (e) {}
          isDownloading = false;
        }, 3000);
      } catch (err) {
        console.warn('[KsDown] dl-all err:', err);
        if (btn) { btn.classList.remove('loading'); btn.innerHTML = I.dl + ' Download Video + Thumbnail'; }
        showToast('Failed — try again');
        isDownloading = false;
      } finally {
        showProg(false);
      }
    });

    document.addEventListener('click', function (e) {
      const w = document.getElementById('ksdown-widget');
      if (w && !w.contains(e.target) && isOpen) {
        isOpen = false;
        const p = document.getElementById('ksdown-pill');
        const pan = document.getElementById('ksdown-panel');
        if (p) p.classList.remove('is-open');
        if (pan) pan.classList.remove('is-visible');
      }
    });

    // Click to copy for rows
    function handleCopyClick(e) {
      const row = e.currentTarget;
      const field = row.getAttribute('data-copy');
      if (!currentData || !field || !currentData[field]) return;
      
      let valEl;
      let originalText;
      
      // Handle filename block which has different structure
      if (row.id === 'ksd-fname-block') {
        valEl = row.querySelector('.ksd-val');
      } else {
        valEl = row.querySelector('.ksd-val');
      }
      
      originalText = valEl ? valEl.textContent : '';
      
      try {
        navigator.clipboard.writeText(currentData[field]).then(function() {
          if (valEl) {
            valEl.textContent = '✓ Copied!';
            valEl.style.color = '#4ade80';
            setTimeout(function() {
              valEl.textContent = originalText;
              valEl.style.color = '';
            }, 2000);
          }
        });
      } catch (err) { 
        if (valEl) {
          valEl.textContent = '✗ Failed';
          valEl.style.color = '#f87171';
          setTimeout(function() {
            valEl.textContent = originalText;
            valEl.style.color = '';
          }, 2000);
        }
      }
    }
    
    document.querySelectorAll('.ksd-row.clickable').forEach(function(row) {
      row.addEventListener('click', handleCopyClick);
    });
    
    const fnameBlock = document.getElementById('ksd-fname-block');
    if (fnameBlock) {
      fnameBlock.addEventListener('click', handleCopyClick);
    }
  }

  // ─── Refresh panel content ────────────────────────────────────────────────────
  function refreshPanel() {
    try {
      currentData = extractVideoData();
      const dot     = document.getElementById('ksdown-status-dot');
      const timeRow = document.getElementById('ksd-row-time');

      function sv(id, val, isPlaceholder) {
        const el = document.getElementById(id);
        if (el) {
          el.textContent = val || '—';
          if (isPlaceholder || !val) {
            el.classList.add('placeholder');
          } else {
            el.classList.remove('placeholder');
          }
        }
      }

      if (!currentData) {
        if (dot) dot.classList.remove('active');
        const t = document.getElementById('ksd-v-title');
        if (t) { t.textContent = 'No video detected — scroll to a video or wait a moment'; t.classList.add('muted'); }
        sv('ksd-v-creator', '', true); sv('ksd-v-id', '', true); sv('ksd-v-fname', '', true);
        if (timeRow) timeRow.classList.add('hidden');
        const thumbUrlRow = document.getElementById('ksd-row-thumburl');
        const videoUrlRow = document.getElementById('ksd-row-videourl');
        const directUrlRow = document.getElementById('ksd-row-directurl');
        if (thumbUrlRow) thumbUrlRow.classList.add('hidden');
        if (videoUrlRow) videoUrlRow.classList.add('hidden');
        if (directUrlRow) directUrlRow.classList.add('hidden');
        setDlBtnsDisabled(true);
        return;
      }

      if (dot) dot.classList.add('active');
      const t = document.getElementById('ksd-v-title');
      if (t) { t.textContent = currentData.title || '(no title)'; t.classList.remove('muted'); }
      sv('ksd-v-creator', currentData.creator ? '@' + currentData.creator : '');
      sv('ksd-v-id', currentData.videoId);
      sv('ksd-v-fname', currentData.filename);

      const fnameBlock = document.getElementById('ksd-fname-block');
      if (fnameBlock) fnameBlock.classList.add('clickable');

      if (currentData.timestamp && timeRow) {
        timeRow.classList.remove('hidden');
        sv('ksd-v-time', currentData.timestamp);
      } else if (timeRow) {
        timeRow.classList.remove('hidden');
        sv('ksd-v-time', 'No timestamp', true);
      }

      // URL fields - show placeholder text when hidden or empty
      const thumbUrlRow = document.getElementById('ksd-row-thumburl');
      const videoUrlRow = document.getElementById('ksd-row-videourl');
      const directUrlRow = document.getElementById('ksd-row-directurl');
      
      if (currentData.thumbnailSrc) {
        if (thumbUrlRow) thumbUrlRow.classList.remove('hidden');
        sv('ksd-v-thumburl', currentData.thumbnailSrc);
      } else {
        if (thumbUrlRow) {
          thumbUrlRow.classList.remove('hidden');
          sv('ksd-v-thumburl', 'No thumbnail', true);
        }
      }
      
      if (currentData.videoSrc) {
        if (videoUrlRow) videoUrlRow.classList.remove('hidden');
        sv('ksd-v-videourl', currentData.videoSrc);
      } else {
        if (videoUrlRow) {
          videoUrlRow.classList.remove('hidden');
          sv('ksd-v-videourl', 'No video URL', true);
        }
      }
      
      if (currentData.directUrl) {
        if (directUrlRow) directUrlRow.classList.remove('hidden');
        sv('ksd-v-directurl', currentData.directUrl);
      } else {
        if (directUrlRow) {
          directUrlRow.classList.remove('hidden');
          sv('ksd-v-directurl', 'No direct URL', true);
        }
      }

      setDlBtnsDisabled(false);
      const thumbBtn = document.getElementById('ksd-dl-thumb');
      if (thumbBtn) thumbBtn.disabled = !currentData.thumbnailSrc;
    } catch (e) {
      console.warn('[KsDown] refreshPanel error:', e);
    }
  }

  function updatePillState() {
    try {
      const data = extractVideoData();
      const pill = document.getElementById('ksdown-pill');
      if (pill) pill.classList.toggle('no-video', !data);
    } catch (e) { /* silent */ }
  }

  function setDlBtnsDisabled(v) {
    ['#ksd-dl-all', '#ksd-dl-video'].forEach(function (sel) {
      const b = document.querySelector(sel); if (b) b.disabled = v;
    });
  }

  // ─── Progress helpers ─────────────────────────────────────────────────────────
  function showProg(v) {
    const el = document.getElementById('ksd-prog-wrap');
    if (el) el.classList.toggle('show', v);
    if (!v) setPct(0);
  }
  function setPct(n) {
    const f = document.getElementById('ksd-prog-fill'); if (f) f.style.width = (n || 0) + '%';
    const p = document.getElementById('ksd-prog-pct');  if (p) p.textContent = n ? n + '%' : '';
  }
  function setProgLabel(s) { const el = document.getElementById('ksd-prog-text'); if (el) el.textContent = s; }

  // ─── Button helpers ───────────────────────────────────────────────────────────
  function btnBusy(sel, html) {
    const b = document.querySelector(sel);
    if (!b) return;
    b.classList.add('loading');
    b.innerHTML = html;
  }
  function btnOk(sel, ok, reset, delay) {
    const b = document.querySelector(sel);
    if (!b) return;
    b.classList.remove('loading');
    b.classList.add('success');
    b.innerHTML = ok;
    setTimeout(function () { try { b.classList.remove('success'); b.innerHTML = reset; } catch (e) {} }, delay != null ? delay : 2400);
  }

  // ─── Toast ────────────────────────────────────────────────────────────────────
  function showToast(msg) {
    try {
      const t = document.getElementById('ksdown-toast');
      if (!t) return;
      t.textContent = msg;
      t.classList.add('show');
      clearTimeout(t._timer);
      t._timer = setTimeout(function () { t.classList.remove('show'); }, 3200);
    } catch (e) { /* silent */ }
  }

  // ─── Observer ─────────────────────────────────────────────────────────────────
  function initObserver() {
    let timer;
    function debounced() {
      clearTimeout(timer);
      timer = setTimeout(function () {
        try { updatePillState(); if (isOpen) refreshPanel(); } catch (e) { /* silent */ }
      }, 700);
    }

    new MutationObserver(debounced).observe(document.body, { childList: true, subtree: true });

    // Hook video[src] attribute changes
    function hookVids() {
      try {
        document.querySelectorAll('video').forEach(function (v) {
          if (v._ksd_hooked) return;
          v._ksd_hooked = true;
          new MutationObserver(debounced).observe(v, { attributes: true, attributeFilter: ['src'] });
        });
      } catch (e) { /* silent */ }
    }
    hookVids();
    [1500, 3000, 6000].forEach(function (t) { setTimeout(hookVids, t); });
  }

  // ─── Init with retry (for slow SPA pages like /short-video/) ─────────────────
  function init() {
    try {
      if (document.getElementById('ksdown-widget')) return;
      buildWidget();

      // Retry detection several times to handle slow hydration
      let tries = 0;
      function tryDetect() {
        tries++;
        updatePillState();
        if (tries < 6) setTimeout(tryDetect, tries * 1000);
      }

      setTimeout(function () {
        tryDetect();
        initObserver();
      }, 800);
    } catch (e) {
      console.warn('[KsDown] init error:', e);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 300);
  }

})();
