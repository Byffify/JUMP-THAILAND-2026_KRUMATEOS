import { findTemplateById } from '../data/curriculum/index.js';

/* ==========================================================================
   KruMate OS — Store (localStorage: library, prefs, metrics)
   ========================================================================== */
const LS_LIB = 'krumate.library';
const LS_METRICS = 'krumate.metrics';
const LS_USER = 'krumate.user';
const LS_SEARCH = 'krumate.searches';
const HOURS_PER_MATERIAL = 0.75; // ~45 min saved per generated material

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) { return fallback; }
}
function write(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }

export const STORE = {
  // ---------- Library ----------
  getLibrary() { return read(LS_LIB, []); },

  find(id) {
    const lib = this.getLibrary();
    const item = lib.find(i => i.id === id);
    if (item) return item;
    const live = Live.get(id);
    if (live) return live;
    const tpl = findTemplateById(id);
    if (tpl) return Object.assign({}, tpl, { isTemplate: true });
    return null;
  },

  itemById(id) { return this.getLibrary().find(i => i.id === id) || null; },

  save(item) {
    const lib = this.getLibrary();
    const existing = lib.find(i => i.id === item.id);
    if (existing) {
      Object.assign(existing, item, { updatedAt: Date.now() });
    } else {
      lib.unshift(Object.assign({}, item, { createdAt: Date.now(), updatedAt: Date.now() }));
    }
    write(LS_LIB, lib);
    this.bumpMetric('materials', lib.length);
    return item;
  },

  cloneTemplate(template) {
    const copy = Object.assign({}, template, {
      id: crypto.randomUUID ? crypto.randomUUID() : 'tpl-' + Date.now() + '-' + Math.random().toString(36).slice(2),
      isTemplate: false,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
    return this.save(copy);
  },

  delete(id) {
    const lib = this.getLibrary().filter(i => i.id !== id);
    write(LS_LIB, lib);
    this.bumpMetric('materials', lib.length);
    return true;
  },

  // ---------- Search history ----------
  getSearchHistory() {
    const arr = read(LS_SEARCH, []);
    return Array.isArray(arr) ? arr : [];
  },
  searchHistory(limit) {
    const arr = this.getSearchHistory()
      .slice()
      .sort((a, b) => (b.lastUsed || 0) - (a.lastUsed || 0));
    return arr.slice(0, limit || 10);
  },
  addSearch(term) {
    term = (term || '').trim();
    if (!term) return;
    const entries = this.getSearchHistory();
    const existing = entries.find(e => e.term === term);
    const arr = entries.filter(e => e.term !== term);
    arr.unshift({
      term,
      lastUsed: Date.now(),
      count: existing ? (existing.count || 0) + 1 : 1
    });
    write(LS_SEARCH, arr.slice(0, 10));
  },
  removeSearch(term) {
    write(LS_SEARCH, this.getSearchHistory().filter(e => e.term !== term));
  },
  clearSearchHistory() { write(LS_SEARCH, []); },

  search(q, type, category, subject) {
    let items = this.getLibrary();
    q = (q || '').trim().toLowerCase();
    if (q) {
      items = items.filter(i =>
        (i.title || '').toLowerCase().includes(q) ||
        (i.subject || '').toLowerCase().includes(q) ||
        (i.prompt || '').toLowerCase().includes(q)
      );
    }
    if (type && type !== 'all') items = items.filter(i => i.type === type);
    if (category) items = items.filter(i => (i.category || '') === category);
    if (subject) items = items.filter(i => (i.subject || '') === subject);
    return items;
  },

  categories() {
    const set = new Set();
    this.getLibrary().forEach(i => { if (i.category) set.add(i.category); });
    return [...set];
  },

  recent(limit) {
    return this.getLibrary()
      .slice()
      .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
      .slice(0, limit || 5);
  },

  // ---------- Metrics ----------
  metrics() { return read(LS_METRICS, { generations: 0, hoursSaved: 0, materials: 0 }); },

  bumpMetric(key, val) {
    const m = this.metrics();
    if (key === 'generations') m.generations += (val || 1);
    else if (key === 'hoursSaved') m.hoursSaved += (val || HOURS_PER_MATERIAL);
    else if (key === 'materials') m.materials = val;
    write(LS_METRICS, m);
    return m;
  },

  recordGeneration(count) {
    const m = this.metrics();
    m.generations += 1;
    m.hoursSaved += (count || 1) * HOURS_PER_MATERIAL;
    write(LS_METRICS, m);
    return m;
  },

  // ---------- User ----------
  getUser() { return read(LS_USER, null); },
  setUser(u) { write(LS_USER, u); }
};

// Live (unsaved) generated items for the current session
export const Live = {
  map: {},
  put(item) { this.map[item.id] = item; },
  get(id) { return this.map[id] || null; },
  clear() { this.map = {}; },
  items() { return Object.values(this.map); }
};