'use strict';
/* =========================================================
   Slack風 研修用チャットUI
   データは Supabase（user_states テーブル）に利用者ごとに保存されます
   ========================================================= */

const DAY = 86400000;
const WEEK = ['日', '月', '火', '水', '木', '金', '土'];

/* ---------- アイコン ---------- */
const ICONS = {
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  left: '<path d="m12 19-7-7 7-7M19 12H5"/>',
  right: '<path d="M5 12h14m-7-7 7 7-7 7"/>',
  chev: '<path d="m9 18 6-6-6-6"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-5M12 8h.01"/>',
  extlink: '<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  help: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"/>',
  bot: '<rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4M8 16h.01M16 16h.01"/>',
  home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
  chat: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  belloff: '<path d="M8.7 3A6 6 0 0 1 18 8a21.3 21.3 0 0 0 .6 5M17 17H3s3-2 3-9a4.67 4.67 0 0 1 .3-1.7M10.3 21a1.94 1.94 0 0 0 3.4 0M2 2l20 20"/>',
  files: '<rect x="8" y="2" width="13" height="16" rx="2"/><path d="M4 6v14a2 2 0 0 0 2 2h11"/>',
  check: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  apps: '<circle cx="7" cy="7" r="3"/><circle cx="17" cy="7" r="3"/><circle cx="7" cy="17" r="3"/><circle cx="17" cy="17" r="3"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  down: '<path d="m6 9 6 6 6-6"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  rocket: '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
  thread: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 9h8M8 13h5"/>',
  headphones: '<path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>',
  send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
  bookmark: '<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  hashbox: '<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M8 10h8M8 14h8M11 7l-1 10M15 7l-1 10"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  more: '<circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>',
  smile: '<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>',
  smileplus: '<path d="M22 11v1a10 10 0 1 1-9-10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01M16 5h6M19 2v6"/>',
  at: '<circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"/>',
  video: '<path d="m22 8-6 4 6 4V8Z"/><rect x="2" y="6" width="14" height="12" rx="2"/>',
  mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3"/>',
  micoff: '<path d="M2 2l20 20M18.89 13.23A7 7 0 0 0 19 12v-2M5 10v2a7 7 0 0 0 12 5M15 9.34V5a3 3 0 0 0-5.68-1.33M9 9v3a3 3 0 0 0 5.12 2.12M12 19v3"/>',
  slashbox: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 15 15 9"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  olist: '<path d="M10 6h11M10 12h11M10 18h11M4 6h1v4M4 10h2M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/>',
  quote: '<path d="M4 4v16M9 6h11M9 12h11M9 18h7"/>',
  code: '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
  codeblock: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="m10 9-3 3 3 3M14 15l3-3-3-3"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  trash: '<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
  canvas: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v5h6M8 13h8M8 17h5"/>',
  canvasnote: '<path d="M14 21H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v8Z"/><path d="M14 21v-4a3 3 0 0 1 3-3h4M7 8h10M7 12h5"/>',
  copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  pin: '<path d="M12 17v5M9 10.76V6h6v4.76l2 3.24H7z"/><path d="M8 2h8"/>',
  filetab: '<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5Z"/><path d="M14 2v6h6"/>',
  msgtab: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
  hash: '<path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18"/>',
  listcheck: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="m7 9 1.5 1.5L11 8M7 15l1.5 1.5L11 14M14 9h3M14 15h3"/>',
  userplus: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
  cal: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  canvasplus: '<path d="M14 3H7a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h7l6-6V10"/><path d="M14 21v-3a3 3 0 0 1 3-3h3M18 2v6M15 5h6"/>',
};
const ic = (name, extra = '') => `<svg class="ic ${extra}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ''}</svg>`;
function hydrateIcons(root = document) {
  root.querySelectorAll('i[data-ic]').forEach(i => { i.outerHTML = ic(i.dataset.ic); });
}

/* ---------- ユーティリティ ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pick = a => a[Math.floor(Math.random() * a.length)];
const pad = n => String(n).padStart(2, '0');
const fmtTime = ts => { const d = new Date(ts); return `${pad(d.getHours())}:${pad(d.getMinutes())}`; };
function fmtDay(ts) {
  const d = new Date(ts), now = new Date();
  const sameDay = (a, b) => a.toDateString() === b.toDateString();
  if (sameDay(d, now)) return '今日';
  if (sameDay(d, new Date(now - DAY))) return '昨日';
  const base = `${d.getMonth() + 1}月${d.getDate()}日 (${WEEK[d.getDay()]})`;
  return d.getFullYear() === now.getFullYear() ? base : `${d.getFullYear()}年${base}`;
}
function fmtShort(ts) {
  const d = new Date(ts);
  return new Date().toDateString() === d.toDateString() ? fmtTime(ts) : `${d.getMonth() + 1}/${d.getDate()} ${fmtTime(ts)}`;
}
const fmtSize = b => b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(1)} MB`;
const plain = html => { const d = document.createElement('div'); d.innerHTML = html; return d.textContent || ''; };
function el(tag, cls, html) { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

let toastTimer;
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
}

/* ---------- ウィンドウ操作（─ □ ×） ----------
   アプリとしてインストールすると Windows 本物のボタンが使える。
   ブラウザのタブで開いている時は、できる範囲で代わりの動きをする。 */
let installPrompt = null;
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); installPrompt = e; });
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => {});
async function offerInstall(why) {
  if (installPrompt) {
    installPrompt.prompt();
    const r = await installPrompt.userChoice; installPrompt = null;
    if (r.outcome === 'accepted') toast('インストールしました。アプリから開くと最小化・サイズ変更ができます');
  } else if (location.protocol === 'file:') {
    toast(why + '（scripts\\start.ps1 で開くとアプリとしてインストールできます）');
  } else {
    toast(why + '（アドレスバー右端の「アプリをインストール」から入れてください）');
  }
}
function setupWindowControls() {
  const max = $('#winMax');
  const sync = () => { const fs = !!document.fullscreenElement; max.title = fs ? '元に戻す' : '最大化';
    max.innerHTML = fs ? '<svg viewBox="0 0 10 10"><path d="M2.5.5h7v7M.5 2.5h7v7h-7z"/></svg>' : '<svg viewBox="0 0 10 10"><rect x=".5" y=".5" width="9" height="9"/></svg>'; };
  document.addEventListener('fullscreenchange', sync);
  max.onclick = () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen().catch(() => toast('全画面にできませんでした'));
  $('#topbar').ondblclick = e => { if (!e.target.closest('button,input,.tb-search')) max.click(); };
  $('#winMin').onclick = () => offerInstall('ブラウザのタブからは最小化できません');
  $('#winClose').onclick = () => { window.close(); setTimeout(() => toast('ブラウザのタブは Ctrl+W で閉じられます'), 150); };
}

/* ---------- HTMLサニタイズ（送信メッセージ用） ---------- */
const ALLOWED = new Set(['B', 'STRONG', 'I', 'EM', 'U', 'S', 'STRIKE', 'DEL', 'CODE', 'PRE', 'A', 'UL', 'OL', 'LI', 'BR', 'DIV', 'P', 'BLOCKQUOTE', 'SPAN']);
function sanitize(html) {
  const tpl = document.createElement('template'); tpl.innerHTML = html;
  const walk = node => {
    [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) return;
      if (n.nodeType !== 1) { n.remove(); return; }
      if (['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'IMG', 'svg'].includes(n.tagName)) { n.remove(); return; }
      walk(n);
      if (!ALLOWED.has(n.tagName)) { n.replaceWith(...n.childNodes); return; }
      const keep = {};
      if (n.tagName === 'A') {
        const h = n.getAttribute('href') || '';
        if (/^(https?:|mailto:)/i.test(h)) keep.href = h;
      }
      if (n.tagName === 'SPAN' && n.classList.contains('mention')) { keep.class = 'mention'; keep['data-uid'] = n.getAttribute('data-uid') || ''; }
      [...n.attributes].forEach(a => n.removeAttribute(a.name));
      Object.entries(keep).forEach(([k, v]) => n.setAttribute(k, v));
      if (n.tagName === 'A') { n.setAttribute('target', '_blank'); n.setAttribute('rel', 'noopener noreferrer'); }
      if (n.tagName === 'SPAN' && !keep.class) n.replaceWith(...n.childNodes);
    });
  };
  walk(tpl.content);
  // 末尾の空行を除去
  let out = tpl.innerHTML.replace(/(<br\s*\/?>|<div><br><\/div>|\s|&nbsp;)+$/i, '');
  return out;
}
// テキスト中のURLを自動リンク
function autoLink(html) {
  const tpl = document.createElement('template'); tpl.innerHTML = html;
  const walker = document.createTreeWalker(tpl.content, NodeFilter.SHOW_TEXT);
  const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(t => {
    if (t.parentElement && t.parentElement.closest('a,code,pre')) return;
    const re = /https?:\/\/[^\s<>"']+/g;
    if (!re.test(t.data)) return;
    const frag = document.createDocumentFragment(); let last = 0; re.lastIndex = 0; let m;
    while ((m = re.exec(t.data))) {
      frag.append(t.data.slice(last, m.index));
      const a = document.createElement('a'); a.href = m[0]; a.textContent = m[0]; a.target = '_blank'; a.rel = 'noopener noreferrer';
      frag.append(a); last = m.index + m[0].length;
    }
    frag.append(t.data.slice(last)); t.replaceWith(frag);
  });
  return tpl.innerHTML;
}

/* ---------- 初期データ（本番：架空メンバー・研修用メッセージなし） ---------- */
function seed(profile = {}) {
  const now = Date.now();
  const users = {
    me: { id: 'me', name: profile.name || '自分', email: profile.email || '', color: '#e01e5a', title: '', status: '' },
    bot: { id: 'bot', name: 'Slackbot', color: '#4a154b', title: 'ボット', bot: true, status: '' },
  };
  const ch = (id, name, topic) => ({ id, type: 'channel', name, members: ['me'], topic, starred: false, muted: false, private: false, canvas: { title: '', body: '' } });
  const channels = [
    ch('c1', '全体', '全体へのお知らせ用チャンネルです'),
    ch('c2', '雑談', ''),
    { id: 'd_bot', type: 'dm', name: '', members: ['me', 'bot'], starred: false, muted: false, canvas: { title: '', body: '' } },
    { id: 'd_me', type: 'dm', name: '', members: ['me'], starred: false, muted: false, canvas: { title: '', body: '' } },
  ];
  return {
    v: 1, me: 'me', workspace: '会計事業部', theme: 'light', users, channels,
    messages: { c1: [], c2: [], d_bot: [], d_me: [] },
    lastRead: { c1: now, c2: now, d_bot: now, d_me: now },
    current: 'c1', drafts: {}, todos: [],
    activity: [], bannerClosed: {}, collapsed: {}, away: false,
    trash: [], starredFiles: [],
  };
}

/* ---------- Supabase（本番データの保存先・認証） ---------- */
const SB = window.supabase && window.SUPABASE_CONFIG
  ? window.supabase.createClient(window.SUPABASE_CONFIG.url, window.SUPABASE_CONFIG.key, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false } })
  : null;
let authUser = null;      // サインイン中のユーザー（Supabase）
let S = seed();           // サインインするまでは空のワークスペース
let saveTimer = 0, saveDirty = false, saving = null;

function normalizeState() {
  S.trash = S.trash || [];               // 削除済みファイル
  S.starredFiles = S.starredFiles || []; // スター付きファイル（キー）
  S.prefs = S.prefs || {};
  delete S.auth; delete S.signedOut;     // 旧ローカル認証の名残
  if (authUser) { const u = S.users[S.me]; if (u && !u.email) u.email = authUser.email; }
}
// サインインしたユーザーのデータを読み込む（初回は新しいワークスペースを作成）
async function loadRemote(user) {
  const { data, error } = await SB.from('user_states').select('data').eq('user_id', user.id).maybeSingle();
  if (error) throw error;
  if (data?.data?.v === 1) S = data.data;
  else {
    S = seed({ name: user.email.split('@')[0], email: user.email });
    const { error: e2 } = await SB.from('user_states').insert({ user_id: user.id, data: S });
    if (e2) throw e2;
  }
  normalizeState();
}
// 変更はまとめて少し後に保存（連続した操作で何度も送らないように）
function save() {
  if (!authUser) return;
  saveDirty = true;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(flushSave, 700);
}
async function flushSave() {
  clearTimeout(saveTimer);
  if (!authUser || !saveDirty) return saving;
  if (saving) { await saving; if (!saveDirty) return; }
  saveDirty = false;
  const body = { user_id: authUser.id, data: S };
  saving = SB.from('user_states').upsert(body).then(({ error }) => {
    if (error) { saveDirty = true; console.error(error); toast('保存できませんでした。通信状態を確認してください'); setTimeout(save, 5000); }
  }).finally(() => { saving = null; });
  return saving;
}
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flushSave(); });
window.addEventListener('beforeunload', e => { if (saveDirty || saving) { flushSave(); e.preventDefault(); e.returnValue = ''; } });

/* ---------- 画面状態（保存しない） ---------- */
const ui = {
  view: { type: 'channel', id: null },
  tab: 'messages',
  thread: null,        // { ch, id }
  profile: null,       // 右パネルに表示中のユーザーID
  filter: '',
  huddle: null,        // { ch, start, muted, timer }
  typing: {},          // chId -> userId
  newMarker: {},       // chId -> ts
  hist: [], histPos: -1,
};

/* ---------- データアクセス ---------- */
const U = id => S.users[id] || { id, name: '不明なユーザー', color: '#888' };
const me = () => S.users[S.me];
const getCh = id => S.channels.find(c => c.id === id);
const msgsOf = id => (S.messages[id] = S.messages[id] || []);
function chLabel(ch) {
  if (ch.type === 'channel') return ch.name;
  const others = ch.members.filter(m => m !== S.me);
  if (!others.length) return `${me().name}（自分）`;
  return others.map(o => U(o).name).join('、');
}
function dmPartner(ch) { return ch.members.find(m => m !== S.me) || S.me; }
function findMsg(chId, id) {
  for (const m of msgsOf(chId)) {
    if (m.id === id) return { msg: m, parent: null };
    const r = (m.replies || []).find(x => x.id === id);
    if (r) return { msg: r, parent: m };
  }
  return null;
}
function unreadCount(ch) {
  const lr = S.lastRead[ch.id] || 0;
  return msgsOf(ch.id).filter(m => m.ts > lr && m.user !== S.me).length;
}
function avatarHTML(userId, cls = '') {
  const u = U(userId);
  const letter = u.bot ? '🤖' : (u.name.match(/\d+$/)?.[0] || [...u.name][0]);
  if (u.photo) return `<span class="avatar ${cls}" style="background:${u.color} url(${u.photo}) center/cover" title="${esc(u.name)}"></span>`;
  return `<span class="avatar ${cls}" style="background:${u.color}" title="${esc(u.name)}">${esc(letter)}</span>`;
}

/* ---------- ナビゲーション ---------- */
function go(view, { push = true } = {}) {
  if (view.type === 'channel') {
    const ch = getCh(view.id); if (!ch) return;
    // 未読境界線（New）の位置を記録
    const lr = S.lastRead[ch.id] || 0;
    const firstNew = msgsOf(ch.id).find(m => m.ts > lr && m.user !== S.me);
    ui.newMarker[ch.id] = firstNew ? firstNew.ts : null;
    S.current = ch.id; S.lastRead[ch.id] = Date.now();
    if (!ui.view || ui.view.id !== view.id) ui.tab = 'messages';
    save();
  }
  if (push) {
    ui.hist = ui.hist.slice(0, ui.histPos + 1); ui.hist.push(view); ui.histPos = ui.hist.length - 1;
  }
  ui.view = view;
  document.body.classList.remove('sb-open');
  renderAll();
}
function openChannel(id) { go({ type: 'channel', id }); }
function openDM(userId) {
  let ch = S.channels.find(c => c.type === 'dm' && (userId === S.me ? c.members.length === 1 : c.members.length === 2 && c.members.includes(userId)));
  if (!ch) {
    ch = { id: 'd_' + uid(), type: 'dm', name: '', members: userId === S.me ? [S.me] : [S.me, userId], starred: false, muted: false, canvas: { title: '', body: '' } };
    S.channels.push(ch); S.messages[ch.id] = []; save();
  }
  openChannel(ch.id);
}

/* ---------- 全体描画 ---------- */
function renderAll() {
  renderRail();
  renderSidebar();
  renderMain();
  renderThread();
  renderProfile();
}

/* 左端レールのタブ（環境設定 > ナビゲーション で表示・並び順を変更できる） */
const RAIL_TABS = {
  bot: { label: 'Slackbot', icon: 'bot' }, home: { label: 'ホーム', icon: 'home' }, dms: { label: 'DM', icon: 'chat' },
  activity: { label: 'アクティビティ', icon: 'bell' }, files: { label: 'ファイル', icon: 'files' }, todo: { label: 'To-Do', icon: 'check' },
  apps: { label: 'エージェントとツール', icon: 'apps' },
};
const RAIL_FIXED = ['bot', 'home', 'activity'];
const railHidden = () => (S.prefs && S.prefs.railHidden) || [];
function railOrder() {
  const saved = ((S.prefs && S.prefs.railOrder) || []).filter(id => RAIL_TABS[id]);
  return [...saved, ...Object.keys(RAIL_TABS).filter(id => !saved.includes(id))];
}
function applyRailPrefs() {
  const rail = $('#rail'), grow = $('#rail > .grow');
  railOrder().forEach(id => { const b = $(`.rail-item[data-rail="${id}"]`, rail); if (b) { rail.insertBefore(b, grow); b.hidden = !RAIL_FIXED.includes(id) && railHidden().includes(id); } });
  document.body.classList.toggle('rail-icons', !!(S.prefs && S.prefs.railIconOnly));
}
function renderRail() {
  applyRailPrefs();
  const map = { channel: 'home', dms: 'dms', activity: 'activity', files: 'files', todo: 'todo', apps: 'apps' };
  let active = map[ui.view.type] || 'home';
  if (ui.view.type === 'channel' && getCh(ui.view.id)?.id === 'd_bot') active = 'bot';
  $$('.rail-item').forEach(b => b.classList.toggle('active', b.dataset.rail === active));
  const dmUnread = S.channels.filter(c => c.type === 'dm' && !c.muted).reduce((a, c) => a + unreadCount(c), 0);
  const db = $('#dmBadge'); db.hidden = !dmUnread; db.textContent = dmUnread;
  const actUnread = S.activity.filter(a => !a.read).length;
  const ab = $('#actBadge'); ab.hidden = !actUnread; ab.textContent = actUnread;
  $('#meAvatar').outerHTML = avatarHTML(S.me).replace('class="avatar ', 'id="meAvatar" class="avatar ');
  $('#mePresence').classList.toggle('away', !!S.away);
  $('#themeBtn').innerHTML = ic(S.theme === 'dark' ? 'sun' : 'moon');
  $('#wsNameText').textContent = S.workspace;
  $('#wsIcon').textContent = [...S.workspace].slice(0, 2).join('');
  $('#globalSearch').placeholder = `${S.workspace} 内を検索する`;
  document.title = `${ui.view.type === 'channel' && getCh(ui.view.id) ? chLabel(getCh(ui.view.id)) + ' - ' : ''}${S.workspace} - Slack研修`;
}

function chRow(ch) {
  const active = ui.view.type === 'channel' && ui.view.id === ch.id;
  const cnt = unreadCount(ch);
  const b = el('button', 'sb-row');
  b.dataset.ch = ch.id;
  if (active) b.classList.add('active');
  if (cnt && !active && !ch.muted) b.classList.add('unread');
  if (ch.muted) b.classList.add('muted-ch');
  let iconHTML;
  if (ch.type === 'channel') iconHTML = ch.private ? ic('lock') : '<span class="hash">#</span>';
  else iconHTML = avatarHTML(dmPartner(ch), 'mini-av');
  b.innerHTML = `${iconHTML}<span class="name">${esc(chLabel(ch))}</span>${ch.type === 'dm' && cnt && !active ? `<span class="cnt">${cnt}</span>` : ''}`;
  b.title = chLabel(ch);
  b.draggable = true;
  b.addEventListener('dragstart', e => e.dataTransfer.setData('text/ch', ch.id));
  b.onclick = () => openChannel(ch.id);
  b.oncontextmenu = e => { e.preventDefault(); channelMenu(ch, b); };
  return b;
}

/* ---------- ファイル画面のサイドバー ---------- */
function allFiles() {
  const items = [];
  S.channels.forEach(ch => msgsOf(ch.id).forEach(m => [m, ...(m.replies || [])].forEach(x => (x.files || []).forEach((f, i) => items.push({ key: x.id + ':' + i, ch, m: x, f, parent: x === m ? null : m })))));
  return items;
}
function isFileStarred(key) { return S.starredFiles.includes(key); }
function toggleFileStar(key) {
  if (isFileStarred(key)) { S.starredFiles = S.starredFiles.filter(k => k !== key); toast('スターを外しました'); }
  else { S.starredFiles.push(key); toast('スターを付けました'); }
  save(); renderSidebar(); renderMain();
}
function openCanvas(chId) {
  go({ type: 'channel', id: chId });
  ui.tab = 'canvas'; renderMain();
}
function renderFilesSidebar() {
  const sub = ui.view.sub || 'all';
  $$('#sbFiles [data-fsub]').forEach(b => b.classList.toggle('active', b.dataset.fsub === sub));
  const box = $('#starredFiles'); box.innerHTML = '';
  const map = Object.fromEntries(allFiles().map(it => [it.key, it]));
  const starred = S.starredFiles.map(k => map[k]).filter(Boolean);
  if (!starred.length) {
    box.append(el('div', 'hint', 'ファイルの ⭐ スターをクリックすると、ここに追加して後でアクセスできます。'));
    return;
  }
  starred.forEach(({ ch, m, f, parent }) => {
    const k = fileKind(f);
    const b = el('button', 'sb-row', `<span class="fc-icon" style="background:${k.color};width:20px;height:20px;border-radius:5px;font-size:${k.letter.length > 1 ? 7 : 11}px">${k.letter}</span><span class="name">${esc(f.name)}</span>`);
    b.title = f.name;
    b.onclick = () => jumpTo(ch.id, parent ? parent.id : m.id, !!parent);
    box.append(b);
  });
}

function renderSidebar() {
  const inFiles = ui.view.type === 'files';
  $('#sbFiles').hidden = !inFiles;
  $('#sbHome').hidden = inFiles;
  if (inFiles) { renderFilesSidebar(); $$('.sb-section').forEach(s => s.classList.toggle('collapsed', !!S.collapsed[s.dataset.sec])); renderHuddleBar(); return; }
  const f = ui.filter.trim().toLowerCase();
  const match = ch => !f || chLabel(ch).toLowerCase().includes(f);
  // ナビ（環境設定 > ホーム「サイドバーにいつも表示する項目」）
  const P = S.prefs || {};
  const navKey = { huddles: 'sbHuddles', threads: 'sbThreads', bookmarks: 'sbBookmarks', drafts: 'sbDrafts', directory: 'sbDirectory' };
  $$('.sb-nav .sb-row').forEach(b => {
    b.classList.toggle('active', ui.view.type === b.dataset.view);
    if (navKey[b.dataset.view]) b.hidden = P[navKey[b.dataset.view]] === false && ui.view.type !== b.dataset.view;
  });
  // 会話のフィルター・並べ替え（環境設定 > ホーム）
  const curId = ui.view.type === 'channel' ? ui.view.id : null;
  const lastTs = c => msgsOf(c.id).at(-1)?.ts || 0;
  const mentioned = c => msgsOf(c.id).some(m => m.ts > (S.lastRead[c.id] || 0) && m.html?.includes('data-uid="me"'));
  const flt = P.convFilter || 'active';
  const visible = c => {
    if (c.id === curId || f) return true; // 表示中の会話と検索中は常に表示
    if (c.muted && P.hideMuted !== false) return false;
    if (flt === 'active') return c.type === 'channel' || Date.now() - lastTs(c) < 30 * DAY || c.members.length === 1;
    if (flt === 'unread') return unreadCount(c) > 0;
    if (flt === 'mentions') return mentioned(c);
    return true;
  };
  const srt = P.convSort || 'alpha';
  const sorted = list => {
    const byName = (a, b) => chLabel(a).localeCompare(chLabel(b), 'ja');
    const byRecent = (a, b) => lastTs(b) - lastTs(a);
    let out = [...list].sort(srt === 'recent' || (srt === 'mixed' && list[0]?.type === 'dm') ? byRecent : byName);
    if (P.mentionsTop !== false) out = [...out.filter(mentioned), ...out.filter(c => !mentioned(c))];
    return out;
  };
  // スター付き
  const starred = sorted(S.channels.filter(c => c.starred && match(c)));
  const sl = $('#starredList'); sl.innerHTML = '';
  if (!starred.length) sl.append(el('div', 'hint', '重要なアイテムをここにドラッグ＆ドロップします'));
  starred.forEach(c => sl.append(chRow(c)));
  // チャンネル
  const cl = $('#channelList'); cl.innerHTML = '';
  sorted(S.channels.filter(c => c.type === 'channel' && !c.starred && match(c) && visible(c))).forEach(c => cl.append(chRow(c)));
  const addCh = el('button', 'sb-row add', `<span class="plusbox">${ic('plus')}</span><span class="name">チャンネルを追加する</span>`);
  addCh.onclick = () => addChannelModal(); cl.append(addCh);
  // DM
  const dl = $('#dmList'); dl.innerHTML = '';
  sorted(S.channels.filter(c => c.type === 'dm' && !c.starred && match(c) && visible(c))).forEach(c => dl.append(chRow(c)));
  const addDm = el('button', 'sb-row add', `<span class="plusbox">${ic('plus')}</span><span class="name">メンバーを追加する</span>`);
  addDm.onclick = () => newDmModal(); dl.append(addDm);
  // App
  const al = $('#appList'); al.innerHTML = '';
  const appRow = el('button', 'sb-row', `<span class="plusbox" style="width:20px;height:20px;border-radius:5px;background:rgba(255,255,255,.12);display:grid;place-items:center">${ic('plus')}</span><span class="name">App を追加する</span>`);
  appRow.classList.add('add'); appRow.onclick = () => go({ type: 'apps' }); al.append(appRow);
  // 折りたたみ
  $$('.sb-section').forEach(s => s.classList.toggle('collapsed', !!S.collapsed[s.dataset.sec]));
  renderHuddleBar();
}

/* ---------- メイン ---------- */
function renderMain() {
  const main = $('#main');
  const v = ui.view;
  if (v.type === 'channel') {
    if (!getCh(v.id)) { ui.view = { type: 'channel', id: S.channels[0].id }; }
    return renderChannel(main, getCh(ui.view.id));
  }
  const renderers = { threads: viewThreads, huddles: viewHuddles, drafts: viewDrafts, bookmarks: viewBookmarks, directory: viewDirectory, dms: viewDMs, activity: viewActivity, files: viewFiles, todo: viewTodo, apps: viewApps, search: viewSearch };
  main.innerHTML = '';
  (renderers[v.type] || viewThreads)(main);
}

function renderChannel(main, ch) {
  const scroller = $('.msg-scroll', main);
  const prevId = main.dataset.ch, prevTab = main.dataset.tab;
  const keepScroll = scroller && prevId === ch.id && prevTab === ui.tab;
  const nearBottom = keepScroll && scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight < 120;
  const oldTop = keepScroll ? scroller.scrollTop : 0;
  // 既存のコンポーザーを保持
  let composerWrap = (prevId === ch.id) ? $('.composer-wrap', main) : null;

  main.innerHTML = '';
  main.dataset.ch = ch.id; main.dataset.tab = ui.tab;

  /* ヘッダー */
  const head = el('div', 'ch-header');
  const isCh = ch.type === 'channel';
  const memberIds = ch.members;
  head.innerHTML = `
    <button class="star-btn ${ch.starred ? 'on' : ''}" title="スターを付ける">${ic('star')}</button>
    <button class="ch-title" title="チャンネル詳細">${isCh ? (ch.private ? ic('lock') : '<b>#</b>') : avatarHTML(dmPartner(ch), 'mini-av')}<span>${esc(chLabel(ch))}</span>${ic('down')}</button>
    <span class="grow"></span>
    <button class="member-stack" title="メンバーを表示"><span class="stack">${memberIds.slice(0, 4).map(m => avatarHTML(m)).join('')}</span>${memberIds.length}</button>
    <button class="hd-btn ${ui.huddle && ui.huddle.ch === ch.id ? 'on' : ''}" data-act="huddle" title="ハドルミーティング">${ic('headphones')}<span id="hdHuddleCaret">${ic('down')}</span></button>
    <button class="hd-btn" data-act="mute" title="${ch.muted ? 'ミュート解除' : '通知をミュート'}">${ic(ch.muted ? 'belloff' : 'bell')}</button>
    <button class="hd-btn" data-act="search" title="このチャンネル内を検索">${ic('search')}</button>
    <button class="hd-btn" data-act="more" title="その他">${ic('more')}</button>`;
  main.append(head);
  $('.star-btn', head).onclick = () => { ch.starred = !ch.starred; save(); renderAll(); toast(ch.starred ? 'スターを付けました' : 'スターを外しました'); };
  $('.ch-title', head).onclick = () => channelDetails(ch);
  $('.member-stack', head).onclick = () => channelDetails(ch, 'members');
  $('[data-act=huddle]', head).onclick = () => toggleHuddle(ch.id);
  $('[data-act=mute]', head).onclick = () => { ch.muted = !ch.muted; save(); renderAll(); toast(ch.muted ? '通知をミュートしました' : 'ミュートを解除しました'); };
  $('[data-act=search]', head).onclick = () => { const s = $('#globalSearch'); s.value = `in:${isCh ? '#' + ch.name : chLabel(ch)} `; s.focus(); };
  $('[data-act=more]', head).onclick = e => channelMenu(ch, e.currentTarget);
  if (ch.topic) main.append(el('div', 'ch-topic', esc(ch.topic)));

  /* タブ */
  const tabs = el('div', 'tabs');
  tabs.innerHTML = `
    <button class="tab ${ui.tab === 'messages' ? 'active' : ''}" data-tab="messages">${ic('msgtab')}メッセージ</button>
    <button class="tab ${ui.tab === 'canvas' ? 'active' : ''}" data-tab="canvas">${ic('canvas')}${ch.canvas && (ch.canvas.title || ch.canvas.body) ? 'canvas' : 'canvas を追加する'}</button>
    <button class="tab ${ui.tab === 'files' ? 'active' : ''}" data-tab="files">${ic('filetab')}ファイルとリンク</button>
    <button class="tab plus" title="タブを追加">${ic('plus')}</button>`;
  $$('.tab[data-tab]', tabs).forEach(t => t.onclick = () => { ui.tab = t.dataset.tab; renderMain(); });
  $('.tab.plus', tabs).onclick = e => popMenu(e.currentTarget, [
    { label: 'canvas を開く', icon: 'canvas', fn: () => { ui.tab = 'canvas'; renderMain(); } },
    { label: 'ファイルとリンク', icon: 'filetab', fn: () => { ui.tab = 'files'; renderMain(); } },
    { label: 'ワークフロー（研修版では未対応）', icon: 'apps', fn: () => toast('研修版では未対応の機能です') },
  ]);
  main.append(tabs);

  if (ui.tab === 'canvas') { main.append(canvasTab(ch)); return; }
  if (ui.tab === 'files') { main.append(filesTab(ch)); return; }

  /* メッセージ一覧 */
  const sc = el('div', 'msg-scroll');
  sc.append(renderMessageList(ch));
  main.append(sc);

  /* コンポーザー */
  if (!composerWrap) {
    composerWrap = el('div', 'composer-wrap');
    const placeholder = isCh ? `#${ch.name} へのメッセージ` : `${chLabel(ch)} へのメッセージ`;
    composerWrap.append(makeComposer({
      placeholder, draftKey: ch.id,
      onSend: (html, files) => sendMessage(ch.id, html, files),
    }));
    composerWrap.append(el('div', 'typing'));
    setupDrop(composerWrap);
  }
  main.append(composerWrap);
  updateTyping();

  // スクロール位置
  requestAnimationFrame(() => {
    if (ui.highlight) {
      const t = $(`.msg[data-id="${ui.highlight}"]`, sc);
      if (t) { t.scrollIntoView({ block: 'center' }); t.classList.add('flash'); }
      ui.highlight = null;
    } else if (!keepScroll || nearBottom) sc.scrollTop = sc.scrollHeight;
    else sc.scrollTop = oldTop;
  });
  if (!keepScroll && !ui.thread) $('.cmp-editor', composerWrap)?.focus();
}

function renderMessageList(ch) {
  const frag = document.createDocumentFragment();
  const list = msgsOf(ch.id);
  // チャンネル冒頭
  const intro = el('div', 'intro');
  if (ch.type === 'channel') {
    intro.innerHTML = `<h2># ${esc(ch.name)}</h2><p>このチャンネルの始まりです。${ch.topic ? esc(ch.topic) : ''}</p><div class="btns"><button class="btn sm" data-a="members">${ic('users')}メンバーを追加する</button><button class="btn sm" data-a="topic">${ic('edit')}説明を編集</button></div>`;
    $('[data-a=members]', intro).onclick = () => addMembersModal(ch);
    $('[data-a=topic]', intro).onclick = () => channelDetails(ch);
  } else {
    const p = dmPartner(ch), u = U(p);
    intro.innerHTML = `<div style="display:flex;gap:12px;align-items:center;margin-bottom:10px">${avatarHTML(p).replace('class="avatar', 'style="width:72px;height:72px;font-size:30px;border-radius:12px" class="avatar')}<div><h2 style="margin:0">${esc(u.name)}</h2><p style="margin:0">${esc(u.title || '')}</p></div></div><p>${p === S.me ? 'ここはあなた専用のスペースです。メモや下書き、リンクを保存しておきましょう。' : `これは <b>${esc(u.name)}</b> さんとのダイレクトメッセージの始まりです。`}</p>`;
  }
  frag.append(intro);

  // 有料プラン案内バナー（generalのみ・閉じられる）
  if (ch.id === 'c1' && !S.bannerClosed[ch.id]) {
    const bn = el('div', 'banner', `
      <button class="x" title="閉じる">${ic('x')}</button>
      <h4>90 日以上が経過したメッセージとファイルを表示する <span class="pro">プロ</span></h4>
      <p>Slack のフリープランのメッセージとファイルは、90 日後に非表示になります。メッセージとファイルの履歴にアクセスするには、無料トライアルを開始してください。<a href="#" class="more">もっと詳しく</a></p>
      <button class="btn primary">プランを比較する</button>`);
    $('.x', bn).onclick = () => { S.bannerClosed[ch.id] = true; save(); renderMain(); };
    $('.btn', bn).onclick = plansModal;
    $('.more', bn).onclick = e => { e.preventDefault(); plansModal(); };
    frag.append(bn);
  }

  let lastDay = '', prev = null;
  const marker = ui.newMarker[ch.id];
  list.forEach(m => {
    const day = new Date(m.ts).toDateString();
    if (day !== lastDay) {
      const dd = el('div', 'day-div sticky', `<span>${fmtDay(m.ts)}</span>`);
      frag.append(dd); lastDay = day; prev = null;
    }
    if (marker && m.ts === marker) { frag.append(el('div', 'new-div', '<span>New</span>')); prev = null; }
    const cont = prev && prev.user === m.user && m.ts - prev.ts < 5 * 60000 && !m.sub && !(prev.replies || []).length;
    frag.append(renderMsg(ch, m, { cont }));
    prev = m;
  });
  if (!list.length) frag.append(el('div', 'empty', '<div class="big">💬</div>まだメッセージはありません。最初のメッセージを送ってみましょう！'));
  return frag;
}

function renderMsg(ch, m, { cont = false, inThread = false, parent = null } = {}) {
  const u = U(m.user);
  const row = el('div', 'msg' + (cont ? ' cont' : ''));
  row.dataset.id = m.id;
  const gutter = cont ? `<div class="msg-gutter">${fmtTime(m.ts)}</div>` : `<div class="msg-gutter">${avatarHTML(m.user)}</div>`;
  const head = cont ? '' : `<div class="msg-head"><button class="msg-author">${esc(u.name)}</button>${u.bot ? '<span class="bot-tag">APP</span>' : ''}<span class="msg-time" title="${new Date(m.ts).toLocaleString('ja-JP')}">${fmtTime(m.ts)}</span></div>`;
  const sub = m.sub ? `<div class="sub-line">${esc(m.sub)}</div>` : '';
  let text = m.html ? autoLink(m.html) : '';
  // 自分宛てメンションを強調
  text = text.replace(/<span class="mention" data-uid="me">/g, '<span class="mention me" data-uid="me">');
  row.innerHTML = `${gutter}<div class="msg-body">${head}${sub}<div class="msg-text">${text}${m.edited ? '<span class="edited">(編集済み)</span>' : ''}</div></div>`;
  const body = $('.msg-body', row);
  if (m.files && m.files.length) body.append(renderFiles(m.files));
  // リアクション
  const rx = Object.entries(m.reactions || {}).filter(([, us]) => us.length);
  if (rx.length) {
    const box = el('div', 'reactions');
    rx.forEach(([emo, us]) => {
      const b = el('button', 'reaction' + (us.includes(S.me) ? ' mine' : ''), `${emo}<span>${us.length}</span>`);
      b.title = us.map(x => U(x).name).join('、') + ` が ${emo} でリアクションしました`;
      b.onclick = () => toggleReaction(ch.id, m, emo);
      box.append(b);
    });
    const add = el('button', 'reaction add', ic('smileplus'));
    add.title = 'リアクションを追加する';
    add.onclick = e => emojiPicker(e.currentTarget, emo => toggleReaction(ch.id, m, emo));
    box.append(add);
    body.append(box);
  }
  // スレッド要約
  if (!inThread && m.replies && m.replies.length) {
    const users = [...new Set(m.replies.map(r => r.user))].slice(0, 5);
    const last = m.replies[m.replies.length - 1];
    const ts = el('button', 'thread-sum', `${users.map(x => avatarHTML(x)).join('')}<span class="cnt">${m.replies.length}件の返信</span><span class="last">最終返信 ${fmtShort(last.ts)}</span>`);
    ts.onclick = () => openThread(ch.id, m.id);
    body.append(ts);
  }
  $('.msg-author', row)?.addEventListener('click', e => profilePop(e.currentTarget, m.user));

  // ホバーアクション
  const acts = el('div', 'msg-actions');
  const quick = ['✅', '👀', '🙌'];
  quick.forEach(q => { const b = el('button', '', q); b.title = `${q} でリアクション`; b.onclick = () => toggleReaction(ch.id, m, q); acts.append(b); });
  const addR = el('button', '', ic('smileplus')); addR.title = 'リアクションする';
  addR.onclick = e => { acts.classList.add('open'); emojiPicker(e.currentTarget, emo => toggleReaction(ch.id, m, emo), () => acts.classList.remove('open')); };
  acts.append(addR);
  if (!inThread) {
    const th = el('button', '', ic('thread')); th.title = 'スレッドで返信する';
    th.onclick = () => openThread(ch.id, m.id); acts.append(th);
  }
  const bm = el('button', m.bookmarked ? 'on' : '', ic('bookmark')); bm.title = m.bookmarked ? 'ブックマークを外す' : '後で確認する（ブックマーク）';
  bm.onclick = () => { m.bookmarked = !m.bookmarked; save(); rerender(); toast(m.bookmarked ? 'ブックマークに登録しました' : 'ブックマークを外しました'); };
  acts.append(bm);
  const more = el('button', '', ic('more')); more.title = 'その他';
  more.onclick = e => {
    acts.classList.add('open');
    const items = [
      { label: 'テキストをコピー', icon: 'copy', fn: () => { navigator.clipboard?.writeText(plain(m.html)); toast('コピーしました'); } },
      { label: '未読にする', icon: 'bell', fn: () => { S.lastRead[ch.id] = m.ts - 1; save(); toast('未読にしました'); renderSidebar(); renderRail(); } },
      { label: 'To-Do に追加', icon: 'check', fn: () => { S.todos.unshift({ id: uid(), text: plain(m.html).slice(0, 80) || (m.files?.[0]?.name ?? 'メッセージ'), done: false, ref: { ch: ch.id, id: m.id } }); save(); toast('To-Do に追加しました'); } },
    ];
    if (m.user === S.me) {
      items.push({ sep: true });
      items.push({ label: 'メッセージを編集する', icon: 'edit', fn: () => editInline(ch, m, row) });
      items.push({ label: 'メッセージを削除する', icon: 'trash', danger: true, fn: () => deleteMsg(ch.id, m, parent) });
    }
    popMenu(e.currentTarget, items, () => acts.classList.remove('open'));
  };
  acts.append(more);
  row.append(acts);
  row.ondblclick = e => { if (m.user === S.me && !e.target.closest('button,a,.file-card')) editInline(ch, m, row); };
  return row;
}

function rerender() { renderMain(); renderThread(); renderSidebar(); renderRail(); }

/* ---------- ファイル表示 ---------- */
function fileKind(f) {
  const ext = (f.name.split('.').pop() || '').toLowerCase();
  if (f.mime?.startsWith('image/')) return { k: 'img', label: '画像', color: '#1264a3', letter: '🖼' };
  if (['xlsx', 'xls', 'xlsm'].includes(ext)) return { k: 'xls', label: 'Excel スプレッドシート', color: '#107c41', letter: 'X' };
  if (ext === 'csv') return { k: 'csv', label: 'CSV', color: '#107c41', letter: 'CSV' };
  if (['docx', 'doc'].includes(ext)) return { k: 'doc', label: 'Word 文書', color: '#185abd', letter: 'W' };
  if (['pptx', 'ppt'].includes(ext)) return { k: 'ppt', label: 'PowerPoint プレゼンテーション', color: '#c43e1c', letter: 'P' };
  if (ext === 'pdf') return { k: 'pdf', label: 'PDF', color: '#e01e5a', letter: 'PDF' };
  if (['txt', 'md', 'json', 'js', 'html', 'css'].includes(ext)) return { k: 'txt', label: 'テキスト', color: '#616061', letter: 'T' };
  if (['zip', 'rar', '7z'].includes(ext)) return { k: 'zip', label: 'ZIP', color: '#9e7a00', letter: 'Z' };
  return { k: 'file', label: 'ファイル', color: '#616061', letter: '📄' };
}
function sheetPreview() {
  const names = Array.from({ length: 17 }, (_, i) => `テスト${i + 5}`);
  const amt = [8800, 5500, 5500, 11000, 11000, 11000, 11000, 11000, 5500, 11000, 26583, 11000, 11000, 16500, 22000, 22000, 16500];
  let h = '<table><tr><td class="r">　</td><td>→未納</td><td class="y">　</td><td colspan="4">→基金済(過去)</td><td></td><td></td><td></td><td></td></tr>';
  h += '<tr><td class="h">全体NO.</td><td class="h">マスターNO.</td><td class="h">責任</td><td class="h">担当</td><td class="h">紹介</td><td class="h">氏名</td><td class="h">1月</td><td class="h">基金遅れ</td><td class="h">2月</td><td class="h">3月</td><td class="h">4月</td></tr>';
  names.forEach((n, i) => {
    const a = '¥' + amt[i].toLocaleString();
    const red = i === 13 || i === 14 || i === 16;
    h += `<tr><td class="n">${i + 1}</td><td class="n">${[2, 3, 10, 12, 19, 22, 23, 24, 25, 31, 41, 44, 46, 54, 73, 74, 76][i]}</td><td>テストA</td><td>${i % 3 ? 'テストB' : 'テストC'}</td><td>${i % 4 ? 'テストD' : 'テストB'}</td><td>${n}</td><td class="n ${red ? 'r' : ''}">${a}</td><td></td><td class="n ${i === 14 ? 'r' : ''}">${a}</td><td class="n ${i === 13 ? 'r' : ''}">${a}</td><td class="n ${red ? 'r' : ''}">${a}</td></tr>`;
  });
  return h + '</table>';
}
function renderFiles(files) {
  const box = el('div', 'files');
  files.forEach(f => {
    const k = fileKind(f);
    if (k.k === 'img' && f.data) {
      const img = el('img', 'img-att'); img.src = f.data; img.alt = f.name; img.title = f.name;
      img.onclick = () => modal({ title: f.name, body: `<div style="text-align:center"><img class="img-view" src="${f.data}" alt=""></div>`, wide: true, buttons: [{ label: 'ダウンロード', fn: () => download(f) }, { label: '閉じる', primary: true }] });
      box.append(img); return;
    }
    const card = el('div', 'file-card');
    card.innerHTML = `<div class="fc-head"><span class="fc-icon" style="background:${k.color};font-size:${k.letter.length > 1 ? 13 : 18}px">${k.letter}</span><div class="fc-meta"><div class="fc-name">${esc(f.name)}</div><div class="fc-type">${k.label}${f.size ? ' · ' + fmtSize(f.size) : ''}</div></div><button class="fc-dl" title="ダウンロード">${ic('download')}</button></div>`;
    if (f.sample === 'sheet') card.append(el('div', 'sheet-preview', sheetPreview()));
    else if (f.preview) card.append(el('pre', 'text-preview', esc(f.preview)));
    $('.fc-dl', card).onclick = () => download(f);
    box.append(card);
  });
  return box;
}
function download(f) {
  if (!f.data) { toast('サンプルファイルのためダウンロードできません'); return; }
  const a = document.createElement('a'); a.href = f.data; a.download = f.name; a.click();
}

/* ---------- タブ：canvas / ファイル ---------- */
function canvasTab(ch) {
  const wrap = el('div', 'canvas-area');
  ch.canvas = ch.canvas || { title: '', body: '' };
  wrap.innerHTML = `<input placeholder="無題の canvas" value="${esc(ch.canvas.title)}"><textarea placeholder="ここにメモ・手順・議事録などを自由に書けます（自動保存）"></textarea><div class="canvas-saved"></div>`;
  const [ti, tx, st] = [$('input', wrap), $('textarea', wrap), $('.canvas-saved', wrap)];
  tx.value = ch.canvas.body;
  let t;
  const onIn = () => { clearTimeout(t); st.textContent = '保存中...'; t = setTimeout(() => { ch.canvas.title = ti.value; ch.canvas.body = tx.value; save(); st.textContent = `保存しました ${fmtTime(Date.now())}`; const tab = $('.tab[data-tab=canvas]'); if (tab) tab.lastChild.textContent = 'canvas'; }, 400); };
  ti.oninput = onIn; tx.oninput = onIn;
  return wrap;
}
function filesTab(ch) {
  const wrap = el('div', 'view-scroll');
  const items = [];
  msgsOf(ch.id).forEach(m => [m, ...(m.replies || [])].forEach(x => {
    (x.files || []).forEach(f => items.push({ type: 'file', f, m: x }));
    const d = document.createElement('div'); d.innerHTML = autoLink(x.html || '');
    $$('a[href]', d).forEach(a => items.push({ type: 'link', href: a.href, text: a.textContent, m: x }));
  }));
  if (!items.length) { wrap.innerHTML = `<div class="empty"><div class="big">📁</div>このチャンネルで共有されたファイルやリンクはまだありません</div>`; return wrap; }
  items.reverse().forEach(it => {
    const li = el('div', 'list-item');
    if (it.type === 'file') {
      const k = fileKind(it.f);
      li.innerHTML = `<span class="fc-icon" style="background:${k.color};width:40px;height:40px;font-size:${k.letter.length > 1 ? 12 : 16}px">${k.letter}</span><div class="li-main"><div class="li-title">${esc(it.f.name)}<span class="t">${fmtShort(it.m.ts)}</span></div><div class="li-sub">${esc(U(it.m.user).name)} · ${k.label}</div></div>`;
      li.onclick = () => jumpTo(ch.id, it.m.id);
    } else {
      li.innerHTML = `<span class="fc-icon" style="background:#1264a3;width:40px;height:40px">${ic('link')}</span><div class="li-main"><div class="li-title">${esc(it.text)}<span class="t">${fmtShort(it.m.ts)}</span></div><div class="li-sub">${esc(U(it.m.user).name)} · リンク</div></div>`;
      li.onclick = () => window.open(it.href, '_blank', 'noopener');
    }
    wrap.append(li);
  });
  return wrap;
}

/* ---------- コンポーザー ---------- */
const EMOJIS = '👍 ❤️ 😂 🎉 🙏 👀 ✅ 🙌 😊 😄 😅 🤣 😍 🥰 😎 🤔 😮 😢 😭 😡 🙇 🙇‍♀️ 👏 💪 🔥 💯 ✨ ⭐ 🚀 💡 📌 📝 📎 📅 ⏰ ☕ 🍵 🍣 🍙 🎂 🌸 ☀️ 🌧️ ⚠️ ❗ ❓ ⭕ ❌ 🆗 🆕 💰 💴 📊 📈 📉 🏢 🚃 🏠 💻 📞 ✉️'.split(' ');

function makeComposer({ placeholder, draftKey, onSend }) {
  const c = el('div', 'composer');
  c.innerHTML = `
    <div class="cmp-toolbar">
      <button data-cmd="bold" title="太字 (Ctrl+B)"><b>B</b></button>
      <button data-cmd="italic" title="斜体 (Ctrl+I)"><i>I</i></button>
      <button data-cmd="underline" title="下線 (Ctrl+U)"><u>U</u></button>
      <button data-cmd="strikeThrough" title="取り消し線"><s>S</s></button>
      <span class="sep"></span>
      <button data-cmd="link" title="リンク">${ic('link')}</button>
      <button data-cmd="insertOrderedList" title="番号付きリスト">${ic('olist')}</button>
      <button data-cmd="insertUnorderedList" title="箇条書き">${ic('list')}</button>
      <span class="sep"></span>
      <button data-cmd="quote" title="引用">${ic('quote')}</button>
      <button data-cmd="code" title="コード">${ic('code')}</button>
      <button data-cmd="codeblock" title="コードブロック">${ic('codeblock')}</button>
    </div>
    <div class="cmp-files"></div>
    <div class="cmp-editor" contenteditable="true" role="textbox" aria-multiline="true"></div>
    <div class="cmp-bottom">
      <button class="round" data-act="attach" title="ファイルを添付">${ic('plus')}</button>
      <button data-act="format" title="書式設定の表示/非表示"><span class="aa">Aa</span></button>
      <button data-act="emoji" title="絵文字">${ic('smile')}</button>
      <button data-act="mention" title="メンション">${ic('at')}</button>
      <span class="sep"></span>
      <button data-act="video" title="ビデオクリップを録画">${ic('video')}</button>
      <button data-act="mic" title="音声クリップを録音">${ic('mic')}</button>
      <span class="sep"></span>
      <button data-act="slash" title="ショートカットを実行">${ic('slashbox')}</button>
      <span class="grow"></span>
      <button class="send" data-act="send" title="送信 (Enter)">${ic('send')}</button>
      <input type="file" multiple hidden>
    </div>`;
  const ed = $('.cmp-editor', c), filesBox = $('.cmp-files', c), fileIn = $('input[type=file]', c), sendBtn = $('.send', c);
  ed.dataset.placeholder = placeholder;
  const pending = [];
  let saved = null;
  c._addFiles = list => addFiles(list);

  if (draftKey && S.drafts[draftKey]) ed.innerHTML = S.drafts[draftKey].html;

  const saveRange = () => { const s = getSelection(); if (s.rangeCount && ed.contains(s.anchorNode)) saved = s.getRangeAt(0).cloneRange(); };
  const restore = () => {
    ed.focus();
    if (saved) { const s = getSelection(); s.removeAllRanges(); s.addRange(saved); }
    else { const r = document.createRange(); r.selectNodeContents(ed); r.collapse(false); const s = getSelection(); s.removeAllRanges(); s.addRange(r); }
  };
  const isEmpty = () => !ed.textContent.trim() && !$('li,pre,blockquote', ed) && !$('.mention', ed);
  const update = () => {
    if (!ed.textContent.trim() && !$('li,pre,blockquote,.mention', ed) && ed.innerHTML !== '') ed.innerHTML = '';
    sendBtn.classList.toggle('ready', !isEmpty() || pending.length > 0);
    if (draftKey) {
      if (isEmpty()) delete S.drafts[draftKey];
      else S.drafts[draftKey] = { html: ed.innerHTML, ts: Date.now() };
      clearTimeout(c._dt); c._dt = setTimeout(save, 400);
    }
    // ツールバー状態
    ['bold', 'italic', 'underline', 'strikeThrough', 'insertOrderedList', 'insertUnorderedList'].forEach(cmd => {
      try { $(`[data-cmd=${cmd}]`, c).classList.toggle('on', document.queryCommandState(cmd) && ed.contains(getSelection().anchorNode)); } catch { }
    });
  };

  // ツールバー
  $$('.cmp-toolbar button', c).forEach(b => {
    b.onmousedown = e => e.preventDefault();
    b.onclick = () => {
      const cmd = b.dataset.cmd;
      if (document.activeElement !== ed) restore();
      if (cmd === 'link') return linkModal();
      if (cmd === 'code') {
        const s = getSelection(); const txt = s.toString();
        document.execCommand('insertHTML', false, `<code>${esc(txt || 'code')}</code>&#8203;`);
      } else if (cmd === 'codeblock') {
        const txt = getSelection().toString();
        document.execCommand('insertHTML', false, `<pre>${esc(txt) || '<br>'}</pre><div><br></div>`);
      } else if (cmd === 'quote') {
        document.execCommand('formatBlock', false, 'blockquote');
      } else document.execCommand(cmd);
      update();
    };
  });
  function linkModal() {
    saveRange();
    const selText = saved ? saved.toString() : '';
    const body = el('div', '', `<label class="field"><span>テキスト</span><input class="inp" name="t" value="${esc(selText)}"></label><label class="field"><span>リンク</span><input class="inp" name="u" placeholder="https://"></label>`);
    modal({
      title: 'リンクを追加する', body, buttons: [{ label: 'キャンセル' }, {
        label: '保存', primary: true, fn: () => {
          let u = $('[name=u]', body).value.trim(); const t = $('[name=t]', body).value.trim() || u;
          if (!u) return false;
          if (!/^(https?:|mailto:)/i.test(u)) u = 'https://' + u;
          restore(); document.execCommand('insertHTML', false, `<a href="${esc(u)}">${esc(t)}</a>&nbsp;`); update();
        }
      }], focus: selText ? '[name=u]' : '[name=t]',
    });
  }

  // 下部ボタン
  const act = name => $(`[data-act=${name}]`, c);
  act('attach').onclick = e => popMenu(e.currentTarget, [
    { label: 'コンピューターからアップロード', icon: 'download', fn: () => fileIn.click() },
    { label: 'canvas を作成', icon: 'canvas', fn: () => { ui.tab = 'canvas'; renderMain(); } },
    { label: 'To-Do を追加', icon: 'check', fn: () => go({ type: 'todo' }) },
  ]);
  fileIn.onchange = () => { addFiles(fileIn.files); fileIn.value = ''; };
  act('format').onclick = () => c.classList.toggle('hide-toolbar');
  act('emoji').onmousedown = e => { e.preventDefault(); saveRange(); };
  act('emoji').onclick = e => emojiPicker(e.currentTarget, emo => { restore(); document.execCommand('insertText', false, emo); saveRange(); update(); });
  act('mention').onmousedown = e => { e.preventDefault(); };
  act('mention').onclick = () => { restore(); document.execCommand('insertText', false, '@'); checkMention(); };
  act('video').onclick = () => toast('ビデオクリップ録画は研修版では未対応です');
  act('mic').onclick = () => toast('音声クリップ録音は研修版では未対応です');
  act('slash').onmousedown = e => e.preventDefault();
  act('slash').onclick = e => popMenu(e.currentTarget, [
    { label: 'ショートカット', header: true },
    { label: '/shrug  — ¯\\_(ツ)_/¯ を付けて送信', fn: () => setText('/shrug ') },
    { label: '/topic  — チャンネルの説明を設定', fn: () => setText('/topic ') },
    { label: '/todo  — To-Do に追加', fn: () => setText('/todo ') },
    { label: '/away  — 離席中/アクティブを切替', fn: () => setText('/away') },
    { label: '/clear  — 入力欄をクリア', fn: () => { ed.innerHTML = ''; update(); } },
  ]);
  function setText(t) { ed.textContent = t; const r = document.createRange(); r.selectNodeContents(ed); r.collapse(false); ed.focus(); const s = getSelection(); s.removeAllRanges(); s.addRange(r); update(); }
  sendBtn.onclick = () => doSend();

  function doSend() {
    if (isEmpty() && !pending.length) return;
    closeMention();
    const html = isEmpty() ? '' : sanitize(ed.innerHTML);
    const result = onSend(html, pending.splice(0));
    if (result === false) return;
    ed.innerHTML = ''; filesBox.innerHTML = '';
    if (draftKey) delete S.drafts[draftKey];
    update(); save(); ed.focus();
  }

  // ファイル
  function addFiles(list) {
    [...list].forEach(file => {
      if (file.size > 3 * 1024 * 1024) { toast(`${file.name} は大きすぎます（研修版は3MBまで）`); return; }
      const f = { id: uid(), name: file.name, size: file.size, mime: file.type };
      const reader = new FileReader();
      reader.onload = () => {
        f.data = reader.result;
        if (/^text\/|csv|json/.test(file.type) || /\.(csv|txt|md)$/i.test(file.name)) {
          const r2 = new FileReader(); r2.onload = () => { f.preview = String(r2.result).slice(0, 1200); }; r2.readAsText(file);
        }
        pending.push(f); renderPending();
      };
      reader.readAsDataURL(file);
    });
  }
  function renderPending() {
    filesBox.innerHTML = '';
    pending.forEach((f, i) => {
      const k = fileKind(f);
      const p = el('div', 'pend', `${k.k === 'img' ? `<img src="${f.data}" alt="">` : `<span class="fc-icon" style="background:${k.color};font-size:${k.letter.length > 1 ? 11 : 14}px">${k.letter}</span>`}<div style="min-width:0"><div class="nm">${esc(f.name)}</div><div class="fc-type">${fmtSize(f.size)}</div></div><button class="rm" title="削除">${ic('x')}</button>`);
      $('.rm', p).onclick = () => { pending.splice(i, 1); renderPending(); };
      filesBox.append(p);
    });
    update();
  }
  ed.addEventListener('paste', e => {
    const files = [...(e.clipboardData?.files || [])];
    if (files.length) { e.preventDefault(); addFiles(files); return; }
    // 書式付き貼り付けはプレーンテキストに
    e.preventDefault();
    document.execCommand('insertText', false, e.clipboardData.getData('text/plain'));
  });

  // メンション補完
  let mPop = null, mItems = [], mIdx = 0, mToken = null;
  function closeMention() { if (mPop) { mPop.remove(); mPop = null; } }
  function checkMention() {
    const s = getSelection(); if (!s.rangeCount) return closeMention();
    const r = s.getRangeAt(0); const n = r.startContainer;
    if (n.nodeType !== 3 || !ed.contains(n)) return closeMention();
    const before = n.data.slice(0, r.startOffset);
    const m = before.match(/(^|[\s ​])@([^\s@ ]*)$/);
    if (!m) return closeMention();
    mToken = { node: n, end: r.startOffset, len: m[2].length + 1 };
    const q = m[2].toLowerCase();
    mItems = Object.values(S.users).filter(u => u.name.toLowerCase().includes(q) || u.id.includes(q)).slice(0, 8);
    if ('channel'.startsWith(q) || 'here'.startsWith(q)) mItems.push({ id: 'channel', name: 'channel', special: 'チャンネルの全員に通知' });
    if (!mItems.length) return closeMention();
    mIdx = 0; drawMention();
  }
  function drawMention() {
    closeMention();
    mPop = el('div', 'pop mention-pop');
    mPop.append(el('div', 'menu-label', 'メンバー'));
    mItems.forEach((u, i) => {
      const b = el('button', 'menu-item' + (i === mIdx ? ' act' : ''), u.special ? `<span class="avatar" style="background:#616061">@</span><b>@${u.name}</b><span style="opacity:.7;font-size:12px">${u.special}</span>` : `${avatarHTML(u.id)}<b>${esc(u.name)}</b><span style="opacity:.7;font-size:12px">${esc(u.title || '')}</span>`);
      b.onmousedown = e => { e.preventDefault(); chooseMention(u); };
      mPop.append(b);
    });
    $('#popLayer').append(mPop);
    const rc = c.getBoundingClientRect();
    mPop.style.left = rc.left + 'px';
    mPop.style.bottom = (innerHeight - rc.top + 6) + 'px';
  }
  function chooseMention(u) {
    if (!mToken) return;
    const r = document.createRange();
    r.setStart(mToken.node, mToken.end - mToken.len); r.setEnd(mToken.node, mToken.end);
    r.deleteContents();
    const span = document.createElement('span'); span.className = 'mention'; span.contentEditable = 'false';
    span.dataset.uid = u.id; span.textContent = '@' + u.name;
    const sp = document.createTextNode(' ');
    r.insertNode(sp); r.insertNode(span);
    const s = getSelection(); const r2 = document.createRange(); r2.setStartAfter(sp); r2.collapse(true); s.removeAllRanges(); s.addRange(r2);
    closeMention(); update();
  }

  ed.addEventListener('keydown', e => {
    if (mPop) {
      if (e.key === 'ArrowDown') { e.preventDefault(); mIdx = (mIdx + 1) % mItems.length; drawMention(); return; }
      if (e.key === 'ArrowUp') { e.preventDefault(); mIdx = (mIdx - 1 + mItems.length) % mItems.length; drawMention(); return; }
      if ((e.key === 'Enter' || e.key === 'Tab') && !e.isComposing) { e.preventDefault(); chooseMention(mItems[mIdx]); return; }
      if (e.key === 'Escape') { e.preventDefault(); closeMention(); return; }
    }
    if (e.key === 'Enter' && !e.isComposing && e.keyCode !== 229) {
      // 環境設定 > 詳細設定「メッセージ作成画面で Enter を押した時」
      const P = S.prefs || {};
      const inCode = P.codeNoSend && /```/.test(ed.innerText) && (ed.innerText.match(/```/g) || []).length % 2 === 1;
      const send = P.enterKey === 'newline' || inCode ? (e.ctrlKey || e.metaKey || (inCode && e.shiftKey)) : !e.shiftKey;
      if (send) { e.preventDefault(); doSend(); return; }
    }
    if (e.key === 'ArrowUp' && isEmpty() && draftKey) {
      // 自分の最後のメッセージを編集
      const ch = getCh(draftKey); if (!ch) return;
      const mine = msgsOf(ch.id).filter(m => m.user === S.me).pop();
      if (mine) { e.preventDefault(); const row = $(`#main .msg[data-id="${mine.id}"]`); if (row) editInline(ch, mine, row); }
    }
    if (e.ctrlKey || e.metaKey) {
      const k = e.key.toLowerCase();
      if (k === 'b' || k === 'i' || k === 'u') setTimeout(update);
      if (e.shiftKey && k === 'x') { e.preventDefault(); document.execCommand('strikeThrough'); update(); }
    }
  });
  ed.addEventListener('input', () => { update(); checkMention(); });
  ed.addEventListener('keyup', e => { saveRange(); if (['ArrowLeft', 'ArrowRight'].includes(e.key)) { update(); checkMention(); } });
  ed.addEventListener('mouseup', () => { saveRange(); update(); });
  ed.addEventListener('blur', () => { saveRange(); setTimeout(closeMention, 150); });
  setTimeout(update);
  return c;
}

function setupDrop(wrap) {
  ['dragenter', 'dragover'].forEach(t => wrap.addEventListener(t, e => { if (e.dataTransfer.types.includes('Files')) { e.preventDefault(); wrap.classList.add('drag'); } }));
  ['dragleave', 'drop'].forEach(t => wrap.addEventListener(t, () => wrap.classList.remove('drag')));
  wrap.addEventListener('drop', e => { if (e.dataTransfer.files.length) { e.preventDefault(); $('.composer', wrap)._addFiles(e.dataTransfer.files); } });
}

/* ---------- 送信・編集・削除 ---------- */
function handleSlash(chId, html) {
  const text = plain(html).trim();
  if (!text.startsWith('/')) return html;
  const [cmd, ...rest] = text.split(/\s+/); const arg = rest.join(' ');
  const ch = getCh(chId);
  switch (cmd) {
    case '/shrug': return esc(arg ? arg + ' ' : '') + '¯\\_(ツ)_/¯';
    case '/topic': if (ch.type === 'channel') { ch.topic = arg; save(); renderMain(); toast('チャンネルの説明を更新しました'); } return null;
    case '/todo': if (arg) { S.todos.unshift({ id: uid(), text: arg, done: false }); save(); toast('To-Do に追加しました'); } return null;
    case '/away': S.away = !S.away; save(); renderRail(); toast(S.away ? '離席中に設定しました' : 'アクティブに設定しました'); return null;
    case '/clear': return null;
    default: toast(`「${cmd}」は無効なコマンドです`); return false;
  }
}
function sendMessage(chId, html, files, parentId = null) {
  if (html) {
    const r = handleSlash(chId, html);
    if (r === false) return false;
    if (r === null && !files.length) return;
    html = r || '';
  }
  const m = { id: uid(), user: S.me, ts: Date.now(), html, reactions: {}, replies: [], files: files || [] };
  if (parentId) {
    const p = findMsg(chId, parentId)?.msg; if (!p) return;
    p.replies.push(m);
  } else msgsOf(chId).push(m);
  S.lastRead[chId] = Date.now();
  save();
  rerender();
  simulateResponses(chId, m, parentId);
}
function toggleReaction(chId, m, emo, userId = S.me) {
  m.reactions = m.reactions || {};
  const list = m.reactions[emo] = m.reactions[emo] || [];
  const i = list.indexOf(userId);
  if (i >= 0) list.splice(i, 1); else list.push(userId);
  if (!list.length) delete m.reactions[emo];
  save(); rerender();
}
function editInline(ch, m, row) {
  const txt = $('.msg-text', row); if (!txt || $('.composer', row)) return;
  const body = $('.msg-body', row);
  const wrap = el('div', '');
  let done = false;
  const comp = makeComposer({
    placeholder: 'メッセージを編集', onSend: html => {
      if (!html && !(m.files || []).length) { deleteMsg(ch.id, m, findMsg(ch.id, m.id)?.parent); return; }
      done = true; m.html = html; m.edited = true; save(); rerender();
    }
  });
  $('.cmp-editor', comp).innerHTML = m.html;
  $('.send', comp).innerHTML = '保存';
  const bar = el('div', '', '<div style="display:flex;gap:8px;margin-top:6px"><button class="btn sm" data-a="c">キャンセル</button><button class="btn sm primary" data-a="s">保存</button></div>');
  $('[data-a=c]', bar).onclick = () => rerender();
  $('[data-a=s]', bar).onclick = () => $('.send', comp).click();
  comp.addEventListener('keydown', e => { if (e.key === 'Escape') rerender(); });
  wrap.append(comp, bar);
  txt.replaceWith(wrap);
  $('.msg-actions', row)?.remove();
  const ed = $('.cmp-editor', comp); ed.focus();
  const r = document.createRange(); r.selectNodeContents(ed); r.collapse(false); const s = getSelection(); s.removeAllRanges(); s.addRange(r);
  void body; void done;
}
function deleteMsg(chId, m, parent) {
  modal({
    title: 'メッセージを削除する', body: '<p>このメッセージを削除してもよろしいですか？この操作は取り消せません。</p>',
    buttons: [{ label: 'キャンセル' }, {
      label: '削除', danger: true, fn: () => {
        // 添付ファイルは「削除済み」へ移動
        [m, ...(parent ? [] : (m.replies || []))].forEach(x => (x.files || []).forEach((f, i) => {
          S.trash.push({ f, ch: chId, user: x.user, ts: x.ts, deletedAt: Date.now() });
          S.starredFiles = S.starredFiles.filter(k => k !== x.id + ':' + i);
        }));
        if (parent) parent.replies = parent.replies.filter(x => x.id !== m.id);
        else {
          S.messages[chId] = msgsOf(chId).filter(x => x.id !== m.id);
          if (ui.thread && ui.thread.id === m.id) ui.thread = null;
        }
        save(); rerender(); toast('メッセージを削除しました');
      }
    }],
  });
}

/* ---------- 自動応答（研修用シミュレーション） ---------- */
const REPLIES = ['了解です！', '確認しました👍', 'ありがとうございます！', '承知しました。対応しておきます。', 'なるほど、後ほど詳しく教えてください。', '少々お待ちください、確認します🙇', 'いいですね！', '資料ありがとうございます。目を通しておきます📝', '今日中に返信しますね。'];
const BOT_HELP = [
  '<b>使い方のヒント</b><ul><li><b>Enter</b> で送信、<b>Shift+Enter</b> で改行</li><li>メッセージにカーソルを合わせると、リアクション・スレッド返信・ブックマークができます</li><li><b>@</b> を入力するとメンションできます</li><li><b>Ctrl+K</b> で検索、<b>Esc</b> でパネルを閉じます</li><li>ファイルは ＋ ボタンか、入力欄にドラッグ＆ドロップで添付できます</li><li>自分のメッセージはダブルクリック（または入力欄が空の状態で ↑ キー）で編集できます</li></ul>',
  '<b>/</b> から始まるショートカットも使えます：<code>/shrug</code> <code>/topic</code> <code>/todo</code> <code>/away</code>',
  'サイドバーのチャンネルをドラッグして「スター付き」に入れると、よく使うチャンネルを上に固定できます⭐',
];
function simulateResponses(chId, m, parentId) {
  const ch = getCh(chId); if (!ch) return;
  const mentioned = [...m.html.matchAll(/data-uid="([^"]+)"/g)].map(x => x[1]).filter(x => x !== S.me && S.users[x]);
  let responders = [...mentioned];
  if (mentioned.length === 0 && /data-uid="channel"/.test(m.html)) responders = ch.members.filter(x => x !== S.me).slice(0, 2);
  if (ch.type === 'dm') { const p = dmPartner(ch); if (p !== S.me && !responders.includes(p)) responders.push(p); }
  // チャンネルでは時々誰かがリアクション
  if (ch.type === 'channel' && Math.random() < 0.5) {
    const who = pick(ch.members.filter(x => x !== S.me && !S.users[x]?.bot));
    if (who) setTimeout(() => {
      const target = findMsg(chId, m.id)?.msg; if (!target) return;
      const emo = pick(['👍', '🙏', '👀', '✅', '🎉']);
      target.reactions[emo] = target.reactions[emo] || [];
      if (!target.reactions[emo].includes(who)) target.reactions[emo].push(who);
      pushActivity({ type: 'reaction', ch: chId, msg: m.id, user: who, emo, parent: parentId });
      save(); rerender();
    }, 2500 + Math.random() * 2500);
  }
  responders.forEach((who, i) => {
    const delay = 1500 + i * 1800 + Math.random() * 1500;
    setTimeout(() => { ui.typing[chId] = who; updateTyping(); }, Math.max(300, delay - 1300));
    setTimeout(() => {
      if (ui.typing[chId] === who) delete ui.typing[chId];
      let html;
      if (who === 'bot') {
        const txt = plain(m.html);
        html = /ヘルプ|help|使い方|\?|？/i.test(txt) ? BOT_HELP[0] : pick(BOT_HELP);
      } else {
        html = pick(REPLIES);
        if (mentioned.includes(who) && ch.type === 'channel') html = `<span class="mention" data-uid="me">@${esc(me().name)}</span> ${html}`;
      }
      const r = { id: uid(), user: who, ts: Date.now(), html, reactions: {}, replies: [], files: [] };
      if (parentId) { const p = findMsg(chId, parentId)?.msg; if (p) p.replies.push(r); pushActivity({ type: 'reply', ch: chId, msg: r.id, parent: parentId, user: who }); }
      else msgsOf(chId).push(r);
      if (/data-uid="me"/.test(html)) pushActivity({ type: 'mention', ch: chId, msg: r.id, parent: parentId, user: who });
      const viewing = ui.view.type === 'channel' && ui.view.id === chId && document.hasFocus();
      if (viewing && !parentId) S.lastRead[chId] = Date.now();
      if (!viewing && !ch.muted && !S.notifyOff) toast(`💬 ${U(who).name}: ${plain(html).slice(0, 40)}`);
      save(); rerender(); updateTyping();
    }, delay);
  });
}
function pushActivity(a) { S.activity.unshift({ id: uid(), ts: Date.now(), read: ui.view.type === 'activity', ...a }); S.activity = S.activity.slice(0, 100); }
function updateTyping() {
  const box = $('#main .typing'); if (!box) return;
  const who = ui.view.type === 'channel' ? ui.typing[ui.view.id] : null;
  box.textContent = who ? `${U(who).name} さんが入力中…` : '';
  const tb = $('#threadPanel .typing'); if (tb) tb.textContent = ui.thread && ui.typing[ui.thread.ch] && !who ? '' : '';
}

/* ---------- スレッド ---------- */
function openThread(chId, id) { ui.thread = { ch: chId, id }; if (ui.profile) { ui.profile = null; renderProfile(); } renderThread(); setTimeout(() => $('#threadPanel .cmp-editor')?.focus(), 30); }
function renderThread() {
  const p = $('#threadPanel');
  if (!ui.thread) { p.hidden = true; p.innerHTML = ''; p.dataset.key = ''; return; }
  const ch = getCh(ui.thread.ch); const found = ch && findMsg(ch.id, ui.thread.id);
  if (!found) { ui.thread = null; p.hidden = true; return; }
  const parent = found.msg;
  const key = ch.id + ':' + parent.id;
  const sc0 = $('.msg-scroll', p);
  const near = sc0 && sc0.scrollHeight - sc0.scrollTop - sc0.clientHeight < 120;
  let comp = p.dataset.key === key ? $('.composer-wrap', p) : null;
  p.hidden = false; p.innerHTML = ''; p.dataset.key = key;
  const head = el('div', 'view-head', `スレッド<span class="sub">${ch.type === 'channel' ? '# ' + esc(ch.name) : esc(chLabel(ch))}</span><span class="grow"></span><button class="icon-btn" title="閉じる (Esc)">${ic('x')}</button>`);
  head.style.fontSize = '18px';
  $('.icon-btn', head).onclick = () => { ui.thread = null; renderThread(); };
  p.append(head);
  const sc = el('div', 'msg-scroll');
  sc.append(renderMsg(ch, parent, { inThread: true }));
  if (parent.replies.length) sc.append(el('div', 'day-div', `<span style="font-weight:400">${parent.replies.length}件の返信</span>`));
  parent.replies.forEach((r, i) => {
    const prev = parent.replies[i - 1];
    sc.append(renderMsg(ch, r, { inThread: true, parent, cont: prev && prev.user === r.user && r.ts - prev.ts < 300000 }));
  });
  p.append(sc);
  if (!comp) {
    comp = el('div', 'composer-wrap');
    const cmp = makeComposer({ placeholder: '返信する...', draftKey: 'th_' + parent.id, onSend: (html, files) => sendMessage(ch.id, html, files, parent.id) });
    cmp.classList.add('hide-toolbar');
    comp.append(cmp);
    setupDrop(comp);
  }
  p.append(comp);
  requestAnimationFrame(() => { if (!sc0 || near || p.dataset.fresh !== key) sc.scrollTop = sc.scrollHeight; p.dataset.fresh = key; });
}

/* ---------- その他のビュー ---------- */
function viewShell(main, title, sub = '') {
  main.innerHTML = '';
  main.dataset.ch = '';
  main.append(el('div', 'view-head', `${title}${sub ? `<span class="sub">${sub}</span>` : ''}`));
  const sc = el('div', 'view-scroll'); main.append(sc); return sc;
}
function msgListItem(chId, m, { parent = null, onClick, extra = '' } = {}) {
  const ch = getCh(chId);
  const li = el('div', 'list-item');
  const where = ch ? (ch.type === 'channel' ? '# ' + ch.name : chLabel(ch)) : '';
  li.innerHTML = `${avatarHTML(m.user)}<div class="li-main"><div class="li-sub">${esc(where)}${parent ? ' · スレッド' : ''}${extra}</div><div class="li-title">${esc(U(m.user).name)}<span class="t">${fmtShort(m.ts)}</span></div><div class="li-text">${esc(plain(m.html)) || (m.files?.length ? '📎 ' + esc(m.files.map(f => f.name).join(', ')) : '')}</div></div>`;
  li.onclick = onClick || (() => jumpTo(chId, parent ? parent.id : m.id, parent ? true : false));
  return li;
}
function jumpTo(chId, id, thread = false) {
  ui.highlight = id;
  go({ type: 'channel', id: chId });
  if (thread) openThread(chId, id);
}
function emptyView(sc, emoji, text) { sc.innerHTML = `<div class="empty"><div class="big">${emoji}</div>${text}</div>`; }

function viewThreads(main) {
  const sc = viewShell(main, 'スレッド', '参加しているスレッドの一覧');
  const items = [];
  S.channels.forEach(ch => msgsOf(ch.id).forEach(m => {
    if (m.replies?.length && (m.user === S.me || m.replies.some(r => r.user === S.me) || true)) items.push({ ch, m, last: m.replies[m.replies.length - 1].ts });
  }));
  items.sort((a, b) => b.last - a.last);
  if (!items.length) return emptyView(sc, '🧵', 'スレッドはまだありません。メッセージにカーソルを合わせて「スレッドで返信する」を押してみましょう。');
  items.forEach(({ ch, m }) => {
    const li = msgListItem(ch.id, m, { extra: ` · ${m.replies.length}件の返信` });
    li.onclick = () => jumpTo(ch.id, m.id, true);
    sc.append(li);
  });
}
function viewHuddles(main) {
  const sc = viewShell(main, 'ハドルミーティング');
  const box = el('div', 'empty', `<div class="big">🎧</div><p>ハドルミーティングは、チャンネルやDMで気軽に始められる音声通話です。<br>（研修版では実際の通話は行われません）</p>`);
  const sel = el('select', 'inp'); sel.style.cssText = 'max-width:320px;margin:10px auto;display:block';
  S.channels.forEach(c => sel.append(new Option((c.type === 'channel' ? '# ' : '') + chLabel(c), c.id)));
  const b = el('button', 'btn primary', `${ic('headphones')}${ui.huddle ? 'ハドルを終了する' : 'ハドルを開始する'}`);
  b.onclick = () => { toggleHuddle(ui.huddle ? ui.huddle.ch : sel.value); renderMain(); };
  box.append(sel, b); sc.append(box);
}
function viewDrafts(main) {
  const sc = viewShell(main, '下書き＆送信済み');
  sc.append(el('div', 'menu-label', '下書き'));
  const drafts = Object.entries(S.drafts).filter(([, d]) => d && plain(d.html).trim());
  if (!drafts.length) sc.append(el('div', 'li-sub', '<div style="padding:8px 20px 16px;color:var(--muted)">下書きはありません</div>'));
  drafts.forEach(([key, d]) => {
    const isTh = key.startsWith('th_');
    let chId = key, pid = null;
    if (isTh) { pid = key.slice(3); chId = S.channels.find(c => findMsg(c.id, pid))?.id; }
    const ch = getCh(chId); if (!ch) return;
    const li = el('div', 'list-item', `<span class="fc-icon" style="background:#616061;width:36px;height:36px">${ic('edit')}</span><div class="li-main"><div class="li-sub">${ch.type === 'channel' ? '# ' + esc(ch.name) : esc(chLabel(ch))}${isTh ? ' · スレッド' : ''}</div><div class="li-text">${esc(plain(d.html))}</div></div><button class="icon-btn" title="下書きを削除">${ic('trash')}</button>`);
    li.onclick = e => { if (e.target.closest('.icon-btn')) { delete S.drafts[key]; save(); renderMain(); return; } go({ type: 'channel', id: ch.id }); if (isTh) openThread(ch.id, pid); };
    sc.append(li);
  });
  sc.append(el('div', 'menu-label', '送信済み'));
  const sent = [];
  S.channels.forEach(ch => msgsOf(ch.id).forEach(m => { if (m.user === S.me) sent.push({ ch, m }); (m.replies || []).forEach(r => { if (r.user === S.me) sent.push({ ch, m: r, parent: m }); }); }));
  sent.sort((a, b) => b.m.ts - a.m.ts).slice(0, 50).forEach(({ ch, m, parent }) => sc.append(msgListItem(ch.id, m, { parent })));
  if (!sent.length) sc.append(el('div', '', '<div style="padding:8px 20px;color:var(--muted)">送信済みメッセージはありません</div>'));
}
function viewBookmarks(main) {
  const sc = viewShell(main, 'ブックマークに登録済み');
  const items = [];
  S.channels.forEach(ch => msgsOf(ch.id).forEach(m => { if (m.bookmarked) items.push({ ch, m }); (m.replies || []).forEach(r => { if (r.bookmarked) items.push({ ch, m: r, parent: m }); }); }));
  if (!items.length) return emptyView(sc, '🔖', 'ブックマークしたメッセージがここに表示されます。<br>メッセージにカーソルを合わせて 🔖 を押してみましょう。');
  items.sort((a, b) => b.m.ts - a.m.ts).forEach(({ ch, m, parent }) => sc.append(msgListItem(ch.id, m, { parent })));
}
function viewDirectory(main) {
  const sc = viewShell(main, 'ディレクトリ', 'メンバー');
  const g = el('div', 'dir-grid');
  Object.values(S.users).forEach(u => {
    const c = el('button', 'dir-card', `${avatarHTML(u.id)}<div class="dc-body"><div class="dc-name">${esc(u.name)}${u.id === S.me ? '（あなた）' : ''}</div><div class="dc-title">${esc(u.title || '')}</div><div class="dc-title">${esc(u.status || '')}</div></div>`);
    c.onclick = () => openDM(u.id);
    g.append(c);
  });
  sc.append(g);
}
function viewDMs(main) {
  const sc = viewShell(main, 'ダイレクトメッセージ');
  const dms = S.channels.filter(c => c.type === 'dm').map(c => ({ c, last: msgsOf(c.id).at(-1) })).sort((a, b) => (b.last?.ts || 0) - (a.last?.ts || 0));
  dms.forEach(({ c, last }) => {
    const cnt = unreadCount(c);
    const li = el('div', 'list-item', `${avatarHTML(dmPartner(c))}<div class="li-main"><div class="li-title" style="${cnt ? '' : 'font-weight:600'}">${esc(chLabel(c))}<span class="t">${last ? fmtShort(last.ts) : ''}</span></div><div class="li-text" style="color:var(--muted)">${last ? (last.user === S.me ? 'あなた: ' : '') + esc(plain(last.html) || '📎 ファイル') : 'メッセージはまだありません'}</div></div>${cnt ? `<span class="cnt" style="background:var(--red);color:#fff;border-radius:9px;padding:0 7px;font-size:12px;font-weight:700">${cnt}</span>` : ''}`);
    li.onclick = () => openChannel(c.id);
    sc.append(li);
  });
  const nb = el('div', '', `<div style="padding:16px 20px"><button class="btn">${ic('plus')}新しいメッセージ</button></div>`);
  $('.btn', nb).onclick = newDmModal; sc.append(nb);
}
function viewActivity(main) {
  const sc = viewShell(main, 'アクティビティ', 'メンション・リアクション・スレッド返信');
  const list = S.activity;
  if (!list.length) emptyView(sc, '🔔', 'まだアクティビティはありません。<br>チャンネルで誰かを <b>@メンション</b> したり、DMを送ってみましょう。');
  list.forEach(a => {
    const ch = getCh(a.ch); if (!ch) return;
    const f = findMsg(a.ch, a.msg);
    const label = a.type === 'mention' ? 'あなたをメンションしました' : a.type === 'reaction' ? `${a.emo} でリアクションしました` : 'スレッドに返信しました';
    const li = el('div', 'list-item', `${avatarHTML(a.user)}<div class="li-main"><div class="li-sub">${ch.type === 'channel' ? '# ' + esc(ch.name) : esc(chLabel(ch))}</div><div class="li-title">${esc(U(a.user).name)} さんが${label}<span class="t">${fmtShort(a.ts)}</span></div><div class="li-text">${f ? esc(plain(f.msg.html)) : '（削除されたメッセージ）'}</div></div>`);
    if (!a.read) li.style.background = 'var(--mention-bg)';
    li.onclick = () => { if (f) jumpTo(a.ch, f.parent ? f.parent.id : f.msg.id, !!f.parent); };
    sc.append(li);
  });
  S.activity.forEach(a => a.read = true); save();
  setTimeout(renderRail);
}
function fileThumb(f) {
  const k = fileKind(f);
  return k.k === 'img' && f.data
    ? `<img src="${f.data}" style="width:40px;height:40px;object-fit:cover;border-radius:8px;flex:none" alt="">`
    : `<span class="fc-icon" style="background:${k.color};width:40px;height:40px;flex:none;font-size:${k.letter.length > 1 ? 12 : 16}px">${k.letter}</span>`;
}
function viewFiles(main) {
  const sub = ui.view.sub || 'all';
  if (sub === 'canvas') return viewFilesCanvas(main);
  if (sub === 'deleted') return viewFilesDeleted(main);
  const sc = viewShell(main, '全ファイル', 'ワークスペースで共有されたすべてのファイル');
  const items = allFiles();
  if (!items.length) return emptyView(sc, '📁', 'ファイルはまだ共有されていません');
  items.sort((a, b) => b.m.ts - a.m.ts).forEach(({ key, ch, m, f, parent }) => {
    const k = fileKind(f);
    const on = isFileStarred(key);
    const li = el('div', 'list-item', `${fileThumb(f)}<div class="li-main"><div class="li-title">${esc(f.name)}<span class="t">${fmtShort(m.ts)}</span></div><div class="li-sub">${esc(U(m.user).name)} · ${ch.type === 'channel' ? '# ' + esc(ch.name) : esc(chLabel(ch))} · ${k.label}</div></div><button class="fstar ${on ? 'on' : ''}" title="${on ? 'スターを外す' : 'スターを付ける'}">${ic('star')}</button><button class="icon-btn" title="ダウンロード">${ic('download')}</button>`);
    li.onclick = e => {
      if (e.target.closest('.fstar')) return toggleFileStar(key);
      if (e.target.closest('.icon-btn')) return download(f);
      jumpTo(ch.id, parent ? parent.id : m.id, !!parent);
    };
    sc.append(li);
  });
}
function viewFilesCanvas(main) {
  const sc = viewShell(main, 'canvas', 'チャンネルや DM の canvas');
  const list = S.channels.filter(c => c.canvas && (c.canvas.title || c.canvas.body));
  if (!list.length) {
    emptyView(sc, '📝', 'canvas はまだありません<br><br>チャンネル上部の「canvas を追加する」タブから作成できます');
    return;
  }
  list.forEach(ch => {
    const li = el('div', 'list-item', `<span class="fc-icon" style="background:#2eb67d;width:40px;height:40px;flex:none;color:#fff">${ic('canvasnote')}</span><div class="li-main"><div class="li-title">${esc(ch.canvas.title || '無題の canvas')}</div><div class="li-sub">${ch.type === 'channel' ? '# ' + esc(ch.name) : esc(chLabel(ch))}</div><div class="li-text">${esc(ch.canvas.body.slice(0, 120))}</div></div>`);
    li.onclick = () => openCanvas(ch.id);
    sc.append(li);
  });
}
function viewFilesDeleted(main) {
  const sc = viewShell(main, '削除済み', '削除されたメッセージに添付されていたファイル');
  if (!S.trash.length) return emptyView(sc, '🗑️', '削除済みのファイルはありません');
  [...S.trash].sort((a, b) => b.deletedAt - a.deletedAt).forEach(t => {
    const ch = getCh(t.ch);
    const where = ch ? (ch.type === 'channel' ? '# ' + esc(ch.name) : esc(chLabel(ch))) : '不明な会話';
    const li = el('div', 'list-item', `${fileThumb(t.f)}<div class="li-main"><div class="li-title">${esc(t.f.name)}<span class="t">${fmtShort(t.deletedAt)} に削除</span></div><div class="li-sub">${esc(U(t.user).name)} · ${where} · ${fileKind(t.f).label}</div></div><button class="btn sm" data-a="restore">復元</button><button class="icon-btn" data-a="del" title="完全に削除">${ic('trash')}</button>`);
    $('[data-a=restore]', li).onclick = () => {
      if (!getCh(t.ch)) return toast('元の会話が見つかりません');
      msgsOf(t.ch).push({ id: uid(), user: t.user, ts: Date.now(), html: '', reactions: {}, replies: [], files: [t.f] });
      S.trash = S.trash.filter(x => x !== t); save(); rerender(); toast('ファイルを復元しました');
    };
    $('[data-a=del]', li).onclick = () => { S.trash = S.trash.filter(x => x !== t); save(); rerender(); toast('完全に削除しました'); };
    sc.append(li);
  });
}
function viewTodo(main) {
  const sc = viewShell(main, 'To-Do', `${S.todos.filter(t => !t.done).length} 件の未完了`);
  const add = el('form', 'todo-add', `<input class="inp" placeholder="新しいTo-Doを入力して Enter"><button class="btn primary">追加</button>`);
  add.onsubmit = e => { e.preventDefault(); const v = $('input', add).value.trim(); if (!v) return; S.todos.unshift({ id: uid(), text: v, done: false }); save(); renderMain(); setTimeout(() => $('#main .todo-add input')?.focus()); };
  sc.append(add);
  if (!S.todos.length) emptyView(sc, '✅', 'To-Do はありません');
  [...S.todos.filter(t => !t.done), ...S.todos.filter(t => t.done)].forEach(t => {
    const row = el('div', 'todo-item' + (t.done ? ' done' : ''), `<input type="checkbox" ${t.done ? 'checked' : ''}><span class="tt">${esc(t.text)}</span>${t.ref ? `<button class="btn sm" data-a="go">メッセージを表示</button>` : ''}<button class="icon-btn" data-a="del" title="削除">${ic('trash')}</button>`);
    $('input', row).onchange = () => { t.done = !t.done; save(); renderMain(); if (t.done) toast('完了しました 🎉'); };
    $('[data-a=del]', row).onclick = () => { S.todos = S.todos.filter(x => x !== t); save(); renderMain(); };
    const g = $('[data-a=go]', row); if (g) g.onclick = () => { const f = findMsg(t.ref.ch, t.ref.id); if (f) jumpTo(t.ref.ch, f.parent ? f.parent.id : t.ref.id, !!f.parent); else toast('メッセージが見つかりません'); };
    sc.append(row);
  });
}
function viewApps(main) {
  const sc = viewShell(main, 'エージェントとツール', 'App ディレクトリ（研修用のダミー）');
  const apps = [['📅', 'Google カレンダー', '予定の通知を受け取る', '#e8f0fe'], ['📁', 'Google ドライブ', 'ファイルをプレビュー・共有', '#e6f4ea'], ['📊', 'Excel', 'スプレッドシートを共有', '#e6f4ea'], ['🔄', 'ワークフロービルダー', '定型業務を自動化', '#f3e8f4'], ['📋', 'リスト', 'タスクやプロジェクトを管理', '#fef7e0'], ['🤖', 'Slackbot', 'ヒントとヘルプ', '#f3e8f4']];
  const g = el('div', 'app-grid');
  apps.forEach(([e, n, d, bg]) => {
    const c = el('div', 'app-card', `<span class="ai" style="background:${bg}">${e}</span><div><div class="an">${n}</div><div class="ad">${d}</div></div><button class="btn sm">追加</button>`);
    $('button', c).onclick = () => n === 'Slackbot' ? openChannel('d_bot') : toast(`「${n}」は研修版では追加できません`);
    g.append(c);
  });
  sc.append(g);
}

/* ---------- 検索 ---------- */
function runSearch(q) { q = q.trim(); if (!q) return; go({ type: 'search', q }); }
function viewSearch(main) {
  const raw = ui.view.q || '';
  let q = raw, inCh = null;
  const m = raw.match(/in:(#?)(\S+)/);
  if (m) {
    q = raw.replace(m[0], '').trim();
    inCh = S.channels.find(c => (m[1] ? c.name === m[2] : chLabel(c) === m[2] || c.name === m[2]));
  }
  const sc = viewShell(main, '検索結果', `「${esc(raw)}」`);
  const box = el('form', 'search-box', `<input class="inp" value="${esc(raw)}"><button class="btn primary">${ic('search')}検索</button>`);
  box.onsubmit = e => { e.preventDefault(); runSearch($('input', box).value); };
  sc.append(box);
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  const hits = [];
  // 環境設定 > 詳細設定「検索からこれらのチャンネルを除外する」
  const excluded = (S.prefs?.searchExclude || '').split(/[,、\s]+/).map(s => s.replace(/^#/, '').trim()).filter(Boolean);
  S.channels.forEach(ch => {
    if (inCh && ch.id !== inCh.id) return;
    if (!inCh && ch.type === 'channel' && excluded.includes(ch.name)) return;
    msgsOf(ch.id).forEach(mm => [mm, ...(mm.replies || [])].forEach(x => {
      const hay = (plain(x.html) + ' ' + (x.files || []).map(f => f.name).join(' ') + ' ' + U(x.user).name).toLowerCase();
      if (terms.every(t => hay.includes(t))) hits.push({ ch, m: x, parent: x === mm ? null : mm });
    }));
  });
  // チャンネル・メンバー名ヒット
  const chHits = S.channels.filter(c => terms.length && terms.every(t => chLabel(c).toLowerCase().includes(t)));
  chHits.forEach(c => {
    const li = el('div', 'list-item', `<span class="fc-icon" style="background:#4a154b;width:36px;height:36px">${c.type === 'channel' ? '#' : ic('chat')}</span><div class="li-main"><div class="li-title">${esc(chLabel(c))}</div><div class="li-sub">${c.type === 'channel' ? 'チャンネル' : 'ダイレクトメッセージ'}</div></div>`);
    li.onclick = () => openChannel(c.id); sc.append(li);
  });
  sc.append(el('div', 'menu-label', `メッセージ ${hits.length} 件${inCh ? `（${esc(chLabel(inCh))} 内）` : ''}`));
  if (!hits.length) return sc.append(el('div', 'empty', `<div class="big">🔍</div>一致するメッセージは見つかりませんでした`));
  const hl = s => { let h = esc(s); terms.forEach(t => { h = h.replace(new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), x => `<mark>${x}</mark>`); }); return h; };
  hits.sort((a, b) => b.m.ts - a.m.ts).forEach(({ ch, m: x, parent }) => {
    const li = msgListItem(ch.id, x, { parent });
    $('.li-text', li).innerHTML = hl(plain(x.html) || (x.files || []).map(f => '📎 ' + f.name).join(', '));
    sc.append(li);
  });
}

/* ---------- ハドル ---------- */
function toggleHuddle(chId) {
  if (ui.huddle) {
    clearInterval(ui.huddle.timer);
    const same = ui.huddle.ch === chId; ui.huddle = null;
    toast('ハドルミーティングを終了しました');
    if (same) { renderAll(); return; }
  }
  if (!chId) return renderAll();
  ui.huddle = { ch: chId, start: Date.now(), muted: false };
  ui.huddle.timer = setInterval(renderHuddleBar, 1000);
  toast(`🎧 ${chLabel(getCh(chId))} でハドルを開始しました`);
  renderAll();
}
function renderHuddleBar() {
  const bar = $('#huddleBar');
  if (!ui.huddle) { bar.hidden = true; return; }
  const h = ui.huddle, ch = getCh(h.ch); if (!ch) { toggleHuddle(); return; }
  const s = Math.floor((Date.now() - h.start) / 1000);
  bar.hidden = false;
  bar.innerHTML = `<div class="hb-top">${ic('headphones')}<span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${ch.type === 'channel' ? '# ' : ''}${esc(chLabel(ch))}</span><span>${pad(Math.floor(s / 60))}:${pad(s % 60)}</span></div><div class="hb-btns"><button data-a="mute">${h.muted ? 'ミュート解除' : 'ミュート'}</button><button class="leave" data-a="leave">退出</button></div>`;
  $('[data-a=mute]', bar).onclick = () => { h.muted = !h.muted; renderHuddleBar(); };
  $('[data-a=leave]', bar).onclick = () => toggleHuddle(h.ch);
}

/* ---------- ポップオーバー・モーダル ---------- */
let popClose = null;
function closePop() { $('#popLayer').innerHTML = ''; if (popClose) { const f = popClose; popClose = null; f(); } }
function placePop(pop, anchor) {
  $('#popLayer').append(pop);
  const r = anchor.getBoundingClientRect(), pr = pop.getBoundingClientRect();
  let left = Math.min(r.left, innerWidth - pr.width - 8);
  let top = r.bottom + 4;
  if (top + pr.height > innerHeight - 8) top = Math.max(8, r.top - pr.height - 4);
  pop.style.left = Math.max(8, left) + 'px'; pop.style.top = top + 'px';
}
function popMenu(anchor, items, onClose) {
  closePop();
  const pop = el('div', 'pop');
  items.forEach(it => {
    if (it.sep) return pop.append(el('div', 'menu-sep'));
    if (it.header) return pop.append(el('div', 'menu-label', esc(it.label)));
    if (it.html) return pop.append(el('div', '', it.html));
    const b = el('button', 'menu-item' + (it.danger ? ' danger' : ''), `${it.icon ? ic(it.icon) : ''}<span>${esc(it.label)}</span>`);
    b.onmousedown = e => e.preventDefault();
    b.onclick = () => { closePop(); it.fn?.(); };
    pop.append(b);
  });
  popClose = onClose || null;
  placePop(pop, anchor);
  return pop;
}
function emojiPicker(anchor, onPick, onClose) {
  closePop();
  const pop = el('div', 'pop emoji-pop');
  pop.innerHTML = `<input class="inp" placeholder="絵文字を選択"><div class="emoji-grid"></div>`;
  const grid = $('.emoji-grid', pop);
  EMOJIS.forEach(e => { const b = el('button', '', e); b.onmousedown = ev => ev.preventDefault(); b.onclick = () => { closePop(); onPick(e); }; grid.append(b); });
  $('input', pop).oninput = ev => { const v = ev.target.value.trim(); $$('button', grid).forEach(b => b.hidden = v && !b.textContent.includes(v)); };
  popClose = onClose || null;
  placePop(pop, anchor);
}
function profilePop(anchor, userId) {
  const u = U(userId);
  const items = [{ html: `<div class="menu-profile">${avatarHTML(userId)}<div><b>${esc(u.name)}</b><div style="font-size:13px;color:var(--muted)">${esc(u.title || '')}</div>${u.status ? `<div style="font-size:13px">${esc(u.status)}</div>` : ''}</div></div>` }, { sep: true }];
  items.push({ label: 'プロフィールを表示', icon: 'users', fn: () => openProfile(userId) });
  items.push({ label: userId === S.me ? 'メモを開く（自分のDM）' : 'メッセージを送信', icon: 'chat', fn: () => openDM(userId) });
  if (userId !== S.me && !u.bot) items.push({ label: 'ハドルを開始', icon: 'headphones', fn: () => { openDM(userId); toggleHuddle(S.current); } });
  popMenu(anchor, items);
}
function modal({ title, body, buttons = [{ label: '閉じる', primary: true }], wide = false, focus }) {
  const ov = el('div', 'overlay');
  const m = el('div', 'modal' + (wide ? ' wide' : ''));
  m.innerHTML = `<div class="modal-head">${esc(title)}<button class="icon-btn" title="閉じる">${ic('x')}</button></div><div class="modal-body"></div><div class="modal-foot"></div>`;
  const mb = $('.modal-body', m);
  if (typeof body === 'string') mb.innerHTML = body; else mb.append(body);
  const close = () => { ov.remove(); document.removeEventListener('keydown', onKey, true); };
  const onKey = e => { if (e.key === 'Escape') { e.stopPropagation(); close(); } };
  document.addEventListener('keydown', onKey, true);
  buttons.forEach(bt => {
    const b = el('button', 'btn' + (bt.primary ? ' primary' : '') + (bt.danger ? ' danger' : ''), esc(bt.label));
    b.onclick = () => { if (bt.fn && bt.fn(m) === false) return; close(); };
    $('.modal-foot', m).append(b);
  });
  $('.modal-head .icon-btn', m).onclick = close;
  ov.onmousedown = e => { if (e.target === ov) close(); };
  m.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.tagName === 'INPUT' && !e.isComposing) { e.preventDefault(); [...$$('.modal-foot .btn', m)].pop()?.click(); } });
  ov.append(m); $('#modalLayer').append(ov);
  setTimeout(() => (focus ? $(focus, m) : $('input,textarea,select', m))?.focus(), 30);
  return { close, el: m };
}

/* ---------- 各種モーダル ---------- */
/* 左端の「＋」：作成メニュー */
function createMenu(anchor) {
  closePop();
  const items = [
    { title: 'メッセージ', desc: 'DM またはチャンネルで会話を始める', icon: 'edit', bg: '#f4e3f7', fg: '#7c3085', right: '<span class="cm-key">Ctrl+N</span>', fn: composeModal },
    { title: 'チャンネル', desc: 'トピック別にグループで会話を始める', icon: 'hash', bg: '#ebebeb', fg: '#1d1c1d', fn: addChannelModal },
    { title: 'ハドルミーティング', desc: '動画または音声チャットを開始する', icon: 'headphones', bg: '#c9f2df', fg: '#007a5a', fn: () => go({ type: 'huddles' }) },
    { title: 'canvas', badge: '新規', desc: 'コンテンツを作成して共有する', icon: 'canvasplus', bg: '#d5ebfa', fg: '#1264a3', right: '<span class="pro">プロ</span>', fn: () => { openChannel(getCh(S.current) ? S.current : S.channels[0].id); ui.tab = 'canvas'; renderMain(); } },
    { title: 'リスト', desc: 'プロジェクトを追跡および管理する', icon: 'listcheck', bg: '#fde8b0', fg: '#8a5a00', right: '<span class="pro">プロ</span>', fn: () => go({ type: 'todo' }) },
  ];
  const pop = el('div', 'pop create-pop');
  pop.append(el('div', 'cm-head', '作成'));
  items.forEach(it => {
    const b = el('button', 'cm-item', `
      <span class="cm-ic" style="background:${it.bg};color:${it.fg}">${ic(it.icon)}</span>
      <span class="cm-txt"><span class="cm-title">${esc(it.title)}${it.badge ? `<span class="cm-badge">${esc(it.badge)}</span>` : ''}</span><span class="cm-desc">${esc(it.desc)}</span></span>
      ${it.right || ''}`);
    b.onclick = () => { closePop(); it.fn(); };
    pop.append(b);
  });
  pop.append(el('div', 'menu-sep'));
  const inv = el('button', 'cm-item cm-invite', `<span class="cm-ic plain">${ic('userplus')}</span><span class="cm-title">メンバーを招待する</span>`);
  inv.onclick = () => { closePop(); inviteModal(); };
  pop.append(inv);
  // レールの右横に表示
  $('#popLayer').append(pop);
  const r = anchor.getBoundingClientRect(), h = pop.offsetHeight, w = pop.offsetWidth;
  pop.style.left = Math.min(r.right + 10, innerWidth - w - 8) + 'px';
  pop.style.top = Math.max(8, Math.min(r.top - 12, innerHeight - h - 8)) + 'px';
  if (r.right + 10 + w > innerWidth) pop.style.top = Math.max(8, r.top - h - 8) + 'px';
}

/* 段階的に中身を差し替えられるモーダル（ウィザード用） */
function wizard() {
  const ov = el('div', 'overlay');
  const m = el('div', 'modal');
  const onKey = e => { if (e.key === 'Escape') { e.stopPropagation(); close(); } };
  const close = () => { ov.remove(); document.removeEventListener('keydown', onKey, true); };
  document.addEventListener('keydown', onKey, true);
  ov.onmousedown = e => { if (e.target === ov) close(); };
  ov.append(m); $('#modalLayer').append(ov);
  const head = (title, sub = '') => `<div class="modal-head"><div class="mh-text">${esc(title)}${sub ? `<div class="modal-sub">${sub}</div>` : ''}</div><button class="icon-btn" data-a="x" title="閉じる">${ic('x')}</button></div>`;
  return { m, close, head };
}

/* チャンネル作成：ステップ1 名前 → ステップ2 公開範囲 → メンバー追加 */
function addChannelModal() {
  const w = wizard();
  const st = { step: 1, name: '', topic: '', priv: false };
  const normalize = s => s.trim().replace(/\s+/g, '-');

  const draw = () => {
    if (st.step === 1) {
      w.m.innerHTML = w.head('チャンネルを作成する') + `
        <div class="modal-body">
          <label class="field"><span>名前</span>
            <div class="name-inp"><span>#</span><input class="inp" name="n" maxlength="80" placeholder="例：予算-2026年度" autocomplete="off"></div>
            <div class="field-row"><span class="field-err" data-err></span><span class="hint-text" data-cnt></span></div>
          </label>
          <label class="field"><span>説明 <span style="font-weight:400;color:var(--muted)">（任意）</span></span><input class="inp" name="t" placeholder="このチャンネルの目的" autocomplete="off"></label>
          <div class="hint-text">チャンネルでは、特定のトピックに関する会話をします。見つけやすく、わかりやすい名前を付けましょう。</div>
        </div>
        <div class="modal-foot"><span class="step">ステップ 1 / 2</span><span class="grow"></span><button class="btn primary" data-a="next">次へ</button></div>`;
      const ni = $('[name=n]', w.m), ti = $('[name=t]', w.m), err = $('[data-err]', w.m), cnt = $('[data-cnt]', w.m), next = $('[data-a=next]', w.m);
      ni.value = st.name; ti.value = st.topic;
      const upd = () => { cnt.textContent = 80 - ni.value.length; err.textContent = ''; next.disabled = !ni.value.trim(); };
      ni.oninput = upd; upd();
      const goNext = () => {
        const n = normalize(ni.value);
        if (!n) { err.textContent = 'チャンネル名を入力してください'; return; }
        if (S.channels.some(c => c.type === 'channel' && c.name === n)) { err.textContent = 'この名前のチャンネルはすでに存在します'; return; }
        st.name = n; st.topic = ti.value.trim(); st.step = 2; draw();
      };
      next.onclick = goNext;
      [ni, ti].forEach(i => i.onkeydown = e => { if (e.key === 'Enter' && !e.isComposing) { e.preventDefault(); goNext(); } });
      setTimeout(() => ni.focus(), 30);
    } else {
      w.m.innerHTML = w.head('チャンネルを作成する', `# ${esc(st.name)}`) + `
        <div class="modal-body">
          <div class="field"><span>公開範囲</span>
            <label class="radio"><input type="radio" name="v" value="pub"><div>パブリック : <b>${esc(S.workspace)}</b> 内の誰でも</div></label>
            <label class="radio"><input type="radio" name="v" value="priv"><div>プライベート : 特定のメンバーのみ<div class="hint-text" style="margin-top:2px">チャンネルの閲覧や参加には招待が必要です</div></div></label>
          </div>
        </div>
        <div class="modal-foot"><span class="step">ステップ 2 / 2</span><span class="grow"></span><button class="btn" data-a="back">戻る</button><button class="btn primary" data-a="create">作成</button></div>`;
      $(`[name=v][value=${st.priv ? 'priv' : 'pub'}]`, w.m).checked = true;
      $$('[name=v]', w.m).forEach(r => r.onchange = () => { st.priv = r.value === 'priv'; });
      $('[data-a=back]', w.m).onclick = () => { st.step = 1; draw(); };
      $('[data-a=create]', w.m).onclick = () => {
        const ch = { id: 'c_' + uid(), type: 'channel', name: st.name, members: [S.me], topic: st.topic, starred: false, muted: false, private: st.priv, canvas: { title: '', body: '' } };
        S.channels.push(ch);
        S.messages[ch.id] = [{ id: uid(), user: 'bot', ts: Date.now(), html: `<b>${ch.private ? '🔒' : '#'}${esc(ch.name)}</b> が作成されました。メンバーを追加して会話を始めましょう！`, reactions: {}, replies: [], files: [] }];
        save(); w.close(); openChannel(ch.id); toast(`#${ch.name} を作成しました`);
        addMembersModal(ch, true);
      };
    }
    $('[data-a=x]', w.m).onclick = w.close;
  };
  draw();
}

/* チャンネルにメンバーを追加する */
function addMembersModal(ch, afterCreate = false) {
  const w = wizard();
  const candidates = () => Object.values(S.users).filter(u => !u.bot && !ch.members.includes(u.id));
  const sel = new Set();
  let mode = ch.private ? 'some' : 'all';
  let q = '';
  const title = `${ch.private ? '🔒' : '#'} ${ch.name} にメンバーを追加する`;

  const draw = () => {
    const cands = candidates();
    let body;
    if (!cands.length) {
      body = `<div class="empty" style="padding:30px 0"><div class="big">👥</div>${esc(S.workspace)} のメンバーは全員このチャンネルに参加しています</div>`;
    } else {
      body = (ch.private ? '' : `
        <label class="radio"><input type="radio" name="m" value="all"><div><b>${esc(S.workspace)}</b> の全員（${cands.length}人）を追加する</div></label>
        <label class="radio"><input type="radio" name="m" value="some"><div>特定のメンバーを追加する</div></label>`) +
        (mode === 'some' ? `
        <div class="pick-box">
          <div class="chips"></div>
          <input class="inp" name="q" placeholder="名前または役職で検索" autocomplete="off">
          <div class="pick-list"></div>
        </div>` : '');
    }
    w.m.innerHTML = w.head(title, afterCreate ? 'チャンネルを作成しました。一緒に使うメンバーを追加しましょう。' : '') + `
      <div class="modal-body">${body}</div>
      <div class="modal-foot"><span class="step" data-sum></span><span class="grow"></span>
        <button class="btn" data-a="skip">${afterCreate ? 'スキップ' : 'キャンセル'}</button>
        ${cands.length ? '<button class="btn primary" data-a="add">追加</button>' : ''}
      </div>`;
    $('[data-a=x]', w.m).onclick = w.close;
    $('[data-a=skip]', w.m).onclick = w.close;
    const r = $(`[name=m][value=${mode}]`, w.m); if (r) r.checked = true;
    $$('[name=m]', w.m).forEach(x => x.onchange = () => { mode = x.value; draw(); });
    const qi = $('[name=q]', w.m);
    if (qi) { qi.value = q; qi.oninput = () => { q = qi.value; drawList(); }; setTimeout(() => qi.focus(), 30); }
    const add = $('[data-a=add]', w.m);
    if (add) add.onclick = () => doAdd(mode === 'all' ? cands.map(u => u.id) : [...sel]);
    drawList();
  };

  const drawList = () => {
    const cands = candidates();
    const list = $('.pick-list', w.m), chips = $('.chips', w.m), add = $('[data-a=add]', w.m), sum = $('[data-sum]', w.m);
    if (add) add.disabled = mode === 'some' && !sel.size;
    if (sum) sum.textContent = mode === 'all' ? `${cands.length}人を追加` : sel.size ? `${sel.size}人を選択中` : '';
    if (!list) return;
    chips.innerHTML = '';
    [...sel].forEach(id => {
      const c = el('span', 'chip', `${avatarHTML(id)}${esc(U(id).name)}<button title="選択を外す">${ic('x')}</button>`);
      $('button', c).onclick = () => { sel.delete(id); drawList(); };
      chips.append(c);
    });
    const term = q.trim().toLowerCase();
    const hits = cands.filter(u => !term || u.name.toLowerCase().includes(term) || (u.title || '').toLowerCase().includes(term));
    list.innerHTML = '';
    if (!hits.length) { list.append(el('div', 'hint-text', '<div style="padding:12px">該当するメンバーがいません</div>')); return; }
    hits.forEach(u => {
      const row = el('label', 'pick-row', `<input type="checkbox" ${sel.has(u.id) ? 'checked' : ''}>${avatarHTML(u.id)}<span class="nm">${esc(u.name)}</span><span class="tl">${esc(u.title || '')}</span>`);
      $('input', row).onchange = e => { e.target.checked ? sel.add(u.id) : sel.delete(u.id); drawList(); };
      list.append(row);
    });
  };

  const doAdd = ids => {
    if (!ids.length) return;
    ch.members.push(...ids.filter(id => !ch.members.includes(id)));
    const names = ids.map(id => U(id).name);
    msgsOf(ch.id).push({ id: uid(), user: 'bot', ts: Date.now(), html: `${esc(names.join('さん、'))}さんが ${ch.private ? '🔒' : '#'}${esc(ch.name)} に参加しました 👋`, reactions: {}, replies: [], files: [] });
    S.lastRead[ch.id] = Date.now();
    save(); w.close(); renderAll(); toast(`${ids.length}人のメンバーを追加しました`);
  };
  draw();
}
function newDmModal() {
  const body = el('div', '');
  body.append(el('div', 'hint-text', 'メッセージを送るメンバーを選んでください'));
  Object.values(S.users).forEach(u => {
    const r = el('button', 'member-row', `${avatarHTML(u.id)}<span class="nm">${esc(u.name)}${u.id === S.me ? '（あなた）' : ''}</span><span style="color:var(--muted);font-size:13px">${esc(u.title || '')}</span>`);
    r.style.width = '100%';
    r.onclick = () => { m.close(); openDM(u.id); };
    body.append(r);
  });
  const m = modal({ title: '新しいメッセージ', body, buttons: [{ label: 'キャンセル' }] });
}
function composeModal() {
  const body = el('div', '');
  const sel = el('select', 'inp');
  S.channels.forEach(c => sel.append(new Option((c.type === 'channel' ? '# ' : '@ ') + chLabel(c), c.id)));
  sel.value = S.current;
  body.append(el('label', 'field', '<span>宛先</span>'));
  $('label', body).append(sel);
  const ta = el('textarea', 'inp'); ta.placeholder = 'メッセージを入力';
  const f = el('label', 'field', '<span>メッセージ</span>'); f.append(ta); body.append(f);
  modal({
    title: '新規メッセージ', body, buttons: [{ label: 'キャンセル' }, {
      label: '送信', primary: true, fn: () => {
        const t = ta.value.trim(); if (!t) { toast('メッセージを入力してください'); return false; }
        sendMessage(sel.value, esc(t).replace(/\n/g, '<br>'), []); openChannel(sel.value);
      }
    }], focus: 'textarea',
  });
}
function channelDetails(ch, tab = 'about') {
  const body = el('div', '');
  const isCh = ch.type === 'channel';
  if (tab === 'members') {
    body.append(el('div', 'menu-label', `メンバー ${ch.members.length} 人`));
    ch.members.forEach(id => {
      const u = U(id);
      const r = el('div', 'member-row', `${avatarHTML(id)}<span class="nm">${esc(u.name)}${id === S.me ? '（あなた）' : ''}</span>${id !== S.me && isCh ? `<button class="btn sm">削除</button>` : ''}`);
      const b = $('button', r); if (b) b.onclick = () => { ch.members = ch.members.filter(x => x !== id); save(); m.close(); channelDetails(ch, 'members'); renderMain(); };
      body.append(r);
    });
    if (isCh) {
      const others = Object.keys(S.users).filter(x => !ch.members.includes(x));
      if (others.length) {
        body.append(el('div', 'menu-label', '追加できるメンバー'));
        others.forEach(id => {
          const r = el('div', 'member-row', `${avatarHTML(id)}<span class="nm">${esc(U(id).name)}</span><button class="btn sm primary">追加</button>`);
          $('button', r).onclick = () => { ch.members.push(id); save(); m.close(); channelDetails(ch, 'members'); renderMain(); toast(`${U(id).name} さんを追加しました`); };
          body.append(r);
        });
      }
    }
    var m = modal({ title: isCh ? `# ${ch.name}` : chLabel(ch), body, buttons: [{ label: '閉じる', primary: true }] });
    return;
  }
  if (isCh) {
    body.innerHTML = `
      <label class="field"><span>チャンネル名</span><input class="inp" name="n" value="${esc(ch.name)}"></label>
      <label class="field"><span>説明</span><textarea class="inp" name="t">${esc(ch.topic || '')}</textarea></label>
      <div class="hint-text">作成者・メンバー: ${ch.members.length} 人${ch.private ? ' ・ プライベート' : ''}</div>`;
  } else {
    body.innerHTML = `<p>${esc(chLabel(ch))} とのダイレクトメッセージです。</p>`;
  }
  modal({
    title: isCh ? `# ${ch.name}` : chLabel(ch), body,
    buttons: isCh ? [
      { label: 'チャンネルを削除', danger: true, fn: () => { confirmDelete(ch); } },
      { label: 'キャンセル' },
      {
        label: '保存', primary: true, fn: () => {
          const n = $('[name=n]', body).value.trim().replace(/\s+/g, '-'); if (!n) return false;
          ch.name = n; ch.topic = $('[name=t]', body).value.trim(); save(); renderAll(); toast('保存しました');
        }
      }] : [{ label: '閉じる', primary: true }],
  });
}
function confirmDelete(ch) {
  modal({
    title: 'チャンネルを削除しますか？', body: `<p><b>#${esc(ch.name)}</b> とそのすべてのメッセージが削除されます。この操作は取り消せません。</p>`,
    buttons: [{ label: 'キャンセル' }, {
      label: '削除する', danger: true, fn: () => {
        S.channels = S.channels.filter(c => c !== ch); delete S.messages[ch.id];
        if (ui.thread?.ch === ch.id) ui.thread = null;
        if (ui.huddle?.ch === ch.id) toggleHuddle(ch.id);
        save(); openChannel(S.channels.find(c => c.type === 'channel')?.id || S.channels[0].id); toast('チャンネルを削除しました');
      }
    }],
  });
}
function channelMenu(ch, anchor) {
  const items = [
    { label: 'チャンネル詳細を表示', icon: 'help', fn: () => channelDetails(ch) },
    { label: 'メンバー', icon: 'users', fn: () => channelDetails(ch, 'members') },
    { label: ch.starred ? 'スターを外す' : 'スターを付ける', icon: 'star', fn: () => { ch.starred = !ch.starred; save(); renderAll(); } },
    { label: ch.muted ? 'ミュートを解除' : '通知をミュート', icon: ch.muted ? 'bell' : 'belloff', fn: () => { ch.muted = !ch.muted; save(); renderAll(); } },
    { label: '既読にする', icon: 'check', fn: () => { S.lastRead[ch.id] = Date.now(); save(); renderAll(); } },
    { label: 'ハドルを開始', icon: 'headphones', fn: () => toggleHuddle(ch.id) },
  ];
  if (ch.type === 'channel') items.push({ sep: true }, { label: 'チャンネルを削除', icon: 'trash', danger: true, fn: () => confirmDelete(ch) });
  else if (ch.id !== 'd_bot' && ch.members.length > 1) items.push({ sep: true }, { label: 'DMを閉じる', icon: 'x', fn: () => { S.channels = S.channels.filter(c => c !== ch); save(); openChannel(S.channels[0].id); } });
  popMenu(anchor, items);
}
function plansModal() {
  modal({
    title: 'プランを比較する', wide: true,
    body: `<div class="plan-grid">
      <div class="plan cur"><h4>フリー</h4><div class="price">¥0</div><ul><li>90日間のメッセージ履歴</li><li>1対1のハドル</li><li>10件までのアプリ連携</li></ul><p style="font-size:12px;color:var(--green);font-weight:700">現在のプラン</p></div>
      <div class="plan"><h4>プロ</h4><div class="price">¥925<span style="font-size:13px;font-weight:400">/月</span></div><ul><li>無制限のメッセージ履歴</li><li>グループハドル</li><li>無制限のアプリ連携</li><li>canvas の共有</li></ul></div>
      <div class="plan"><h4>ビジネスプラス</h4><div class="price">¥1,600<span style="font-size:13px;font-weight:400">/月</span></div><ul><li>プロの全機能</li><li>SAML ベースの SSO</li><li>データエクスポート</li><li>24時間サポート</li></ul></div>
    </div><p class="hint-text">※ 研修用の表示です。実際の契約・課金は行われません。</p>`,
    buttons: [{ label: '閉じる', primary: true }],
  });
}
function meMenu(anchor) {
  closePop();
  const u = me();
  const pop = el('div', 'pop me-pop');
  pop.innerHTML = `
    <div class="me-head">${avatarHTML(S.me)}<div class="me-info"><b>${esc(u.name)}</b>
      <div class="me-state"><span class="me-dot${S.away ? ' away' : ''}"></span>${S.away ? '離席中' : 'アクティブ'}</div></div></div>
    <button class="me-status" data-a="status">${ic('smile')}<span>${u.status ? esc(u.status) : 'ステータスを更新する'}</span></button>
    <button class="menu-item" data-a="away"><span>ログイン状態を<b>${S.away ? 'アクティブ' : '離席中'}</b>に変更</span></button>
    <button class="menu-item" data-a="notify"><span>通知</span><span class="me-right">${S.notifyOff ? 'オフ' : 'オン'}${ic('chev')}</span></button>
    <div class="menu-sep"></div>
    <button class="menu-item" data-a="profile"><span>プロフィール</span></button>
    <button class="menu-item" data-a="prefs"><span>環境設定</span></button>
    <button class="menu-item" data-a="account"><span>アカウント設定</span><span class="me-right">${ic('extlink')}</span></button>
    <div class="menu-sep"></div>
    <button class="menu-item" data-a="downloads"><span class="me-ellipsis">ダウンロード済みアイテム</span><span class="me-right me-kbd">Ctrl+Shift+J</span></button>
    <div class="menu-sep"></div>
    <button class="menu-item" data-a="upgrade">${ic('rocket')}<span>${esc(S.workspace)} をアップグレード</span></button>
    <button class="menu-item" data-a="signout"><span>以下からサインアウト : ${esc(S.workspace)}</span></button>`;
  const acts = {
    status: statusModal,
    away: () => { S.away = !S.away; save(); renderRail(); toast(S.away ? '離席中に設定しました' : 'アクティブに設定しました'); },
    notify: () => { S.notifyOff = !S.notifyOff; save(); toast(S.notifyOff ? '通知をオフにしました' : '通知をオンにしました'); },
    profile: () => openProfile(S.me),
    prefs: prefsModal,
    account: () => signInScreen('workspace'),
    downloads: () => toast('ダウンロード済みのアイテムはありません'),
    upgrade: plansModal,
    signout: signOut,
  };
  $$('[data-a]', pop).forEach(b => {
    b.onmousedown = e => e.preventDefault();
    b.onclick = () => { closePop(); acts[b.dataset.a](); };
  });
  $('#popLayer').append(pop);
  const r = anchor.getBoundingClientRect(), pr = pop.getBoundingClientRect();
  pop.style.left = (r.right + 8) + 'px';
  pop.style.top = Math.max(8, Math.min(r.bottom - pr.height, innerHeight - pr.height - 8)) + 'px';
}
/* ---------- 左上「≡」アプリメニュー（ファイル／編集／表示／開始／履歴／ヘルプ） ---------- */
const ZOOMS = [0.5, 0.67, 0.75, 0.8, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2];
let zoom = 1;
try { zoom = parseFloat(localStorage.getItem('slack-zoom')) || 1; } catch {}
function applyZoom() { document.documentElement.style.zoom = zoom === 1 ? '' : zoom; }
function setZoom(dir) {
  if (dir === 0) zoom = 1;
  else { const i = ZOOMS.findIndex(z => z >= zoom - 0.001); zoom = ZOOMS[Math.max(0, Math.min(ZOOMS.length - 1, (i < 0 ? ZOOMS.length - 1 : i) + dir))]; }
  applyZoom(); try { localStorage.setItem('slack-zoom', zoom); } catch {}
  toast(`表示倍率 ${Math.round(zoom * 100)}%`);
}
function toggleSidebar() {
  if (innerWidth <= 860) return document.body.classList.toggle('sb-open');
  document.body.classList.toggle('sb-hidden');
}
function editCmd(cmd) {
  if (cmd === 'paste') {
    if (!navigator.clipboard?.readText) return toast('貼り付けは Ctrl+V を使ってください');
    navigator.clipboard.readText().then(t => document.execCommand('insertText', false, t)).catch(() => toast('貼り付けは Ctrl+V を使ってください'));
    return;
  }
  if (!document.execCommand(cmd)) toast('この操作は今は使えません');
}
function railGo(name) { $(`#rail [data-rail="${name}"]`).click(); document.body.classList.remove('sb-open'); }
function appMenuItems() {
  const back = () => $('#backBtn').click(), fwd = () => $('#fwdBtn').click();
  const fs = !!document.fullscreenElement;
  return {
    'ファイル': [
      { label: '新規メッセージ', key: 'Ctrl+N', fn: composeModal },
      { label: 'チャンネルを作成', fn: addChannelModal },
      { label: 'メンバーを招待', fn: inviteModal },
      { sep: true },
      { label: '環境設定', key: 'Ctrl+,', fn: prefsModal },
      { sep: true },
      { label: 'ウィンドウを閉じる', key: 'Ctrl+W', fn: () => $('#winClose').click() },
    ],
    '編集': [
      { label: '元に戻す', key: 'Ctrl+Z', fn: () => editCmd('undo') },
      { label: 'やり直す', key: 'Ctrl+Y', fn: () => editCmd('redo') },
      { sep: true },
      { label: '切り取り', key: 'Ctrl+X', fn: () => editCmd('cut') },
      { label: 'コピー', key: 'Ctrl+C', fn: () => editCmd('copy') },
      { label: '貼り付け', key: 'Ctrl+V', fn: () => editCmd('paste') },
      { label: 'すべて選択', key: 'Ctrl+A', fn: () => editCmd('selectAll') },
      { sep: true },
      { label: '検索', key: 'Ctrl+K', fn: () => { const g = $('#globalSearch'); g.focus(); g.select(); } },
    ],
    '表示': [
      { label: '再読み込み', key: 'Ctrl+R', fn: () => location.reload() },
      { sep: true },
      { label: '実際のサイズ', key: 'Ctrl+0', fn: () => setZoom(0) },
      { label: '拡大', key: 'Ctrl++', fn: () => setZoom(1) },
      { label: '縮小', key: 'Ctrl+-', fn: () => setZoom(-1) },
      { sep: true },
      { label: document.body.classList.contains('sb-hidden') ? 'サイドバーを表示' : 'サイドバーを非表示', key: 'Ctrl+Shift+D', fn: toggleSidebar },
      { label: S.theme === 'dark' ? 'ライトモード' : 'ダークモード', fn: toggleTheme },
      { label: fs ? '全画面表示を終了' : '全画面表示', key: 'F11', fn: () => $('#winMax').click() },
    ],
    '開始': [
      { label: 'ホーム', fn: () => railGo('home') },
      { label: 'DM', fn: () => railGo('dms') },
      { label: 'アクティビティ', fn: () => railGo('activity') },
      { label: 'ファイル', fn: () => railGo('files') },
      { label: 'To-Do', fn: () => railGo('todo') },
      { sep: true },
      { label: 'スレッド', fn: () => go({ type: 'threads' }) },
      { label: 'ハドルミーティング', fn: () => go({ type: 'huddles' }) },
      { label: '下書き＆送信済み', fn: () => go({ type: 'drafts' }) },
      { label: 'ブックマーク', fn: () => go({ type: 'bookmarks' }) },
      { label: 'ディレクトリ', fn: () => go({ type: 'directory' }) },
    ],
    '履歴': [
      { label: '戻る', key: 'Alt+←', fn: back, off: !(ui.histPos > 0) },
      { label: '進む', key: 'Alt+→', fn: fwd, off: !(ui.histPos < ui.hist.length - 1) },
      { sep: true },
      { label: '最近の履歴を表示', fn: () => $('#historyBtn').onclick({ currentTarget: $('#menuBtn') }) },
    ],
    'ヘルプ': [
      { label: 'ヘルプ・ショートカット', fn: helpModal },
      { label: 'Slackbot に質問する', fn: () => railGo('bot') },
      { sep: true },
      { label: 'アプリとしてインストール', fn: () => offerInstall('インストールできませんでした') },
      { label: 'データを初期状態に戻す', danger: true, fn: resetData },
    ],
  };
}
function appMenu(anchor) {
  closePop();
  const groups = appMenuItems();
  const pop = el('div', 'pop app-menu');
  let sub = null, subOf = null;
  const openSub = (btn, name) => {
    if (subOf === btn) return;
    sub?.remove(); $$('.menu-item', pop).forEach(b => b.classList.toggle('act', b === btn));
    subOf = btn; sub = el('div', 'pop app-menu app-sub');
    groups[name].forEach(it => {
      if (it.sep) return sub.append(el('div', 'menu-sep'));
      const b = el('button', 'menu-item' + (it.danger ? ' danger' : ''), `<span>${esc(it.label)}</span>${it.key ? `<span class="am-key">${esc(it.key)}</span>` : ''}`);
      b.disabled = !!it.off;
      b.onmousedown = e => e.preventDefault();
      b.onclick = () => { closePop(); it.fn(); };
      sub.append(b);
    });
    $('#popLayer').append(sub);
    const r = btn.getBoundingClientRect(), pr = sub.getBoundingClientRect();
    let left = r.right + 4; if (left + pr.width > innerWidth - 8) left = Math.max(8, r.left - pr.width - 4);
    sub.style.left = left + 'px';
    sub.style.top = Math.max(8, Math.min(r.top - 6, innerHeight - pr.height - 8)) + 'px';
  };
  Object.keys(groups).forEach(name => {
    const b = el('button', 'menu-item', `<span>${esc(name)}</span>${ic('chev')}`);
    b.onmousedown = e => e.preventDefault();
    b.onmouseenter = () => openSub(b, name);
    b.onclick = () => openSub(b, name);
    pop.append(b);
  });
  pop.addEventListener('keydown', e => {
    const items = $$('.menu-item', pop), i = items.indexOf(document.activeElement);
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); items[(i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length].focus(); }
    if (e.key === 'ArrowRight' && i >= 0) { items[i].click(); $('.menu-item:not(:disabled)', sub)?.focus(); }
  });
  placePop(pop, anchor);
}
/* ---------- 表示：フォント・カラーモード・サイドバーのテーマ ---------- */
const UI_FONTS = [
  ['Noto Sans JP（デフォルト）', '"Lato", "Noto Sans JP", "Hiragino Sans", "Yu Gothic UI", "Meiryo", sans-serif'],
  ['ヒラギノ角ゴ', '"Hiragino Sans", "Hiragino Kaku Gothic ProN", "Yu Gothic UI", sans-serif'],
  ['游ゴシック', '"Yu Gothic UI", "Yu Gothic", "YuGothic", sans-serif'],
  ['メイリオ', '"Meiryo", "Meiryo UI", sans-serif'],
  ['BIZ UDPゴシック', '"BIZ UDPGothic", "Yu Gothic UI", sans-serif'],
];
const SLACK_THEMES = [
  { group: 'Miles Davis の音楽を楽しみましょう', items: [['Kind of Blue', '#6db3e8', '#2c6aa0'], ['Funky Fresh', '#c9b6f7', '#5ccaa0'], ['Jazz Club', '#c8102e', '#3d0b3e'], ['Electric Fusion', '#d8f59a', '#8cf0b0'], ['Brassy', '#ecd062', '#b8902c'], ['Sunglasses Inside', '#5a1a5c', '#240826']] },
  { group: '単色', items: [['Aubergine', '#6a2a6c', '#3a0f3c'], ['Clementine', '#e8640c', '#a8360a'], ['Banana', '#fff2a8', '#f5d33a'], ['Jade', '#2a9a70', '#126b4c'], ['Lagoon', '#1478a8', '#123e66'], ['Barbra', '#ffc0d8', '#ff8fb8'], ['Gray', '#f2f2f2', '#cfcfcf'], ['Mood Indigo', '#2a3aa0', '#0f1a5c']] },
  { group: '見やすい配色（視覚補助）', items: [['Tritanopia', '#555555', '#000000'], ['Protanopia & Deuteranopia', '#6a4a6c', '#2a0f2c']] },
  { group: '楽しい色と新しい色', items: [['Raspberry Beret', '#f9d2f5', '#ff5fa0'], ['Big Business', '#666666', '#1e2a8a'], ['POG', '#f7b8d8', '#f0a820'], ['Mint Chip', '#c5f5b0', '#7a8cf0'], ['PB&J', '#e8d0a8', '#e08aa8'], ['Chill Vibes', '#1e8a66', '#0d4f6b'], ['Forest Floor', '#5f8a08', '#6b3d1a'], ['Slackr', '#ffb0d0', '#36c5f0'], ['Sea Glass', '#a8f0e8', '#d7a8f0'], ['Lemon Lime', '#d8b000', '#0a7a1a'], ['Falling Leaves', '#a8521a', '#6b5a1a'], ['Sunrise', '#ffe0c8', '#ffb0c0']] },
  { group: '更新されたクラシック', items: [['Choco Mint', '#7a3d14', '#145e48'], ['CMYK', '#a0eaf8', '#ff7ab6'], ['Haberdashery', '#0d4f6b', '#4a3a0a'], ['Hoth', '#ffffff', '#a8e3f5'], ['Ochin', '#1d6fb0', '#0b3d6b'], ['Sweet Treat', '#ffd0d0', '#ff9090']] },
];
const hexRgb = h => { const n = parseInt(h.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
const rgbHex = a => '#' + a.map(v => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');
const mixHex = (a, b, t) => { const x = hexRgb(a), y = hexRgb(b); return rgbHex(x.map((v, i) => v + (y[i] - v) * t)); };
const lum = h => { const [r, g, b] = hexRgb(h); return (0.299 * r + 0.587 * g + 0.114 * b) / 255; };
const LOOK_VARS = ['--top-bg', '--rail-bg', '--side-bg', '--side-text', '--side-muted', '--side-hover', '--side-active-bg', '--side-active-text'];
function themeVars() {
  const P = S.prefs || {};
  const root = document.documentElement.style;
  if (P.customTheme) {
    const c = P.customTheme, light = lum(c.side) > 0.6;
    return { '--top-bg': c.top, '--rail-bg': c.top, '--side-bg': c.side, '--side-text': c.text, '--side-muted': mixHex(c.text, c.side, 0.3),
      '--side-hover': light ? 'rgba(0,0,0,.06)' : 'rgba(255,255,255,.08)', '--side-active-bg': c.active, '--side-active-text': lum(c.active) > 0.6 ? '#1d1c1d' : '#ffffff' };
  }
  const name = P.slackTheme || 'Aubergine';
  if (name === 'Aubergine') return null; // 既定の配色（style.css のまま）
  const t = SLACK_THEMES.flatMap(g => g.items).find(i => i[0] === name);
  if (!t) return null;
  const [, g1, g2] = t, side = mixHex(g1, g2, 0.45), light = lum(side) > 0.62;
  const top = light ? mixHex(side, '#000000', 0.08) : mixHex(g2, '#000000', 0.25);
  return { '--top-bg': top, '--rail-bg': top, '--side-bg': side,
    '--side-text': light ? '#1d1c1d' : '#ffffff', '--side-muted': light ? '#454245' : 'rgba(255,255,255,.75)',
    '--side-hover': light ? 'rgba(0,0,0,.06)' : 'rgba(255,255,255,.1)',
    '--side-active-bg': light ? mixHex(g2, '#000000', 0.35) : '#ffffff', '--side-active-text': light ? '#ffffff' : mixHex(g2, '#000000', 0.2) };
}
function applyLook() {
  const P = S.prefs || {}, root = document.documentElement.style;
  const vars = themeVars();
  LOOK_VARS.forEach(k => root.removeProperty(k));
  if (vars) Object.entries(vars).forEach(([k, v]) => root.setProperty(k, S.theme === 'dark' && k.endsWith('-bg') && !v.startsWith('rgba') ? mixHex(v, '#121016', 0.45) : v));
  const f = UI_FONTS.find(x => x[0] === P.font);
  document.body.style.fontFamily = f && f !== UI_FONTS[0] ? f[1] : '';
}
let colorMq;
function applyColorMode() {
  const mode = (S.prefs || {}).colorMode;
  if (!mode) return;
  if (!colorMq && window.matchMedia) { colorMq = matchMedia('(prefers-color-scheme: dark)'); colorMq.addEventListener('change', () => { if ((S.prefs || {}).colorMode === 'system') applyColorMode(); }); }
  const want = mode === 'system' ? (colorMq?.matches ? 'dark' : 'light') : mode;
  if (want !== S.theme) { S.theme = want; save(); applyTheme(); renderRail(); }
}
/* ---------- 環境設定（本物のSlackと同じ 左メニュー＋右ペイン） ---------- */
const PREF_TIMES = Array.from({ length: 48 }, (_, i) => `${pad(Math.floor(i / 2))}:${i % 2 ? '30' : '00'}`);
const prefSel = (key, opts, val) => `<span class="pf-sel"><select data-p="${key}">${opts.map(o => `<option${o === val ? ' selected' : ''}>${esc(o)}</option>`).join('')}</select>${ic('down')}</span>`;
const prefChk = (key, label, on = false, dis = false) => `<label class="pf-chk${dis ? ' dis' : ''}"><input type="checkbox" data-p="${key}"${on ? ' checked' : ''}${dis ? ' disabled' : ''}><span>${label}</span></label>`;
const prefRad = (key, opts, val) => opts.map(o => `<label class="pf-chk"><input type="radio" name="${key}" data-p="${key}" value="${esc(o)}"${o === val ? ' checked' : ''}><span>${esc(o)}</span></label>`).join('');
const PREF_SECTIONS = [
  { id: 'login', label: 'ログイン状態', icon: 'clock', html: () => `
    <h3>勤務時間</h3><p class="pf-desc">選択した時間にだけ通知を受信します。それ以外の時間は通知が一時停止されます。</p>
    <div class="pf-label">通知を許可 :</div>
    <div class="pf-row">${prefSel('workDays', ['毎日', '平日', 'カスタム'], '毎日')}${prefSel('workFrom', PREF_TIMES, '08:00')}<span>から</span>${prefSel('workTo', PREF_TIMES, '22:00')}</div>
    <hr>
    <h3>自動ステータス</h3><p class="pf-desc">返信が遅れる可能性があることを知らせておきましょう。あなたが設定したステータスを Slack が変更することはありません。</p>
    <div class="pf-label">ステータスを設定 :</div>
    ${prefChk('autoHuddle', 'ハドルミーティング用の 🎧 <b>ハドルミーティング中</b>', true)}
    ${prefChk('autoFocus', '集中モード用の 🔭 <b>集中モード中</b>', true)}
    ${prefChk('autoOff', '勤務時間外になったら ⏰ <b>勤務時間外</b>と表示')}
    <hr>
    <h3>その他のオプション</h3>
    <div class="pf-label">次の場合に集中モードを有効化 :</div>
    ${prefChk('focusCal', 'カレンダーに集中タイムがある', false, true)}` },
  { id: 'notify', label: '通知', icon: 'bell', html: () => `
    <h3>通知を受け取るタイミング</h3>
    ${prefRad('notifyLevel', ['すべての新規メッセージ', 'ダイレクトメッセージ、メンション、キーワード', 'なし'], S.notifyOff ? 'なし' : 'すべての新規メッセージ')}
    <hr><h3>サウンドと見た目</h3>
    ${prefChk('notifySound', 'メッセージ通知のサウンドを鳴らす', true)}
    ${prefChk('notifyPreview', '通知にメッセージのプレビューを表示する', true)}` },
  { id: 'nav', label: 'ナビゲーション', icon: 'list', html: () => `
    <h3 class="nv-title">これらのタブをナビゲーションバーに設定する :</h3>
    <p class="pf-desc nv-desc">表示するタブを選択して、ドラッグして並べ替えます。小さなウィンドウでは一部のタブが表示されない場合があります。</p>
    <div class="nv-list">${railOrder().map(id => { const t = RAIL_TABS[id], fixed = RAIL_FIXED.includes(id), on = fixed || !railHidden().includes(id);
      return `<label class="nv-item${fixed ? ' dis' : ''}" draggable="true" data-tab="${id}"><input type="checkbox" data-nav="${id}"${on ? ' checked' : ''}${fixed ? ' disabled' : ''}>${id === 'bot' ? '<span class="nv-bot"></span>' : ic(t.icon)}<span>${esc(t.label)}</span></label>`; }).join('')}</div>
    <h3 class="nv-title">ナビゲーションタブの外観</h3>
    <label class="pf-chk nv-rad"><input type="radio" name="navLook" data-look="full"${S.prefs.railIconOnly ? '' : ' checked'}><span>アイコン＆テキスト</span></label>
    <label class="pf-chk nv-rad"><input type="radio" name="navLook" data-look="icon"${S.prefs.railIconOnly ? ' checked' : ''}><span>アイコンのみ<small>ナビゲーションタブを小さくし、数字のバッジを自動的にオフにします。</small></span></label>`,
    init: pane => {
      const list = $('.nv-list', pane);
      const commit = () => {
        S.prefs.railOrder = $$('.nv-item', list).map(x => x.dataset.tab);
        S.prefs.railHidden = $$('[data-nav]', list).filter(x => !x.checked && !x.disabled).map(x => x.dataset.nav);
        save(); renderRail();
      };
      $$('[data-nav]', list).forEach(c => c.onchange = commit);
      let drag = null;
      $$('.nv-item', list).forEach(it => {
        it.ondragstart = e => { drag = it; it.classList.add('drag'); e.dataTransfer.effectAllowed = 'move'; };
        it.ondragend = () => { it.classList.remove('drag'); drag = null; commit(); };
        it.ondragover = e => {
          if (!drag || drag === it) return;
          e.preventDefault();
          const r = it.getBoundingClientRect();
          list.insertBefore(drag, e.clientY < r.top + r.height / 2 ? it : it.nextSibling);
        };
      });
      $$('[data-look]', pane).forEach(r => r.onchange = () => { S.prefs.railIconOnly = r.dataset.look === 'icon'; save(); renderRail(); });
    } },
  { id: 'home', label: 'ホーム', icon: 'home', noTitle: true, html: () => {
    const item = (key, icon, label, on = true) => `<label class="pf-chk hm-item"><input type="checkbox" data-p="${key}"${on ? ' checked' : ''}>${icon}<span>${label}</span></label>`;
    const rad = (key, val, label, on, desc = '') => `<label class="pf-chk pf-top"><input type="radio" name="${key}" data-p="${key}" value="${val}"${on ? ' checked' : ''}><span>${label}${desc ? `<small>${desc}</small>` : ''}</span></label>`;
    return `
    <h3>チャンネルの整理</h3>
    ${prefChk('chSuggest', '新しいチャンネルで始め方に関する提案を表示する', true)}
    <hr>
    <h3>アクティビティを表示する</h3>
    ${prefChk('homeDot', `<span class="hm-dot">${ic('home')}</span>未読のアクティビティがある時、ホームアイコンにドットを表示する`, true)}
    <hr>
    <div class="hm-head"><h3>サイドバーにいつも表示する項目</h3><button type="button" class="pf-link" data-goto="more">もっと詳しく ${ic('help')}</button></div>
    ${item('sbBot', ic('bot'), 'Slackbot')}
    ${item('sbUnread', ic('chat'), '未読メッセージ', false)}
    ${item('sbHuddles', ic('headphones'), 'ハドルミーティング')}
    ${item('sbThreads', ic('thread'), 'スレッド')}
    ${item('sbBookmarks', ic('bookmark'), 'ブックマーク')}
    ${item('sbDrafts', ic('send'), '下書き＆送信済み')}
    ${item('sbDirectory', ic('users'), 'ディレクトリ')}
    <hr>
    <div class="pf-label">会話を次の条件でフィルター :</div>
    ${rad('convFilter', 'active', 'アクティブのみ', true, 'New messages with the last 30 days')}
    ${rad('convFilter', 'unread', '未読メッセージ')}
    ${rad('convFilter', 'mentions', 'メンション')}
    ${rad('convFilter', 'all', 'すべて')}
    <hr>
    <div class="pf-label">会話を次の条件で並べ替え :</div>
    ${rad('convSort', 'alpha', 'アルファベット順（昇順）', true)}
    ${rad('convSort', 'recent', '新しい順')}
    ${rad('convSort', 'mixed', 'チャンネルはアルファベット順、DM は最近のアクティビティ順')}
    <hr>
    <h3>サイドバーの整理</h3>
    ${prefChk('dmPhotos', 'DM の横にプロフィール写真を表示する', true)}
    ${prefChk('splitPrivate', 'サイドバーでプライベートチャンネルとパブリックチャンネルを分ける')}
    ${prefChk('splitDmApps', 'サイドバーでダイレクトメッセージとアプリをチャンネルと分けて表示する')}
    ${prefChk('mentionsTop', '未読のメンション（<span class="hm-badge">1</span>）がある項目をセクション上部へ移動する', true)}
    ${prefChk('externalSec', '社外との会話を「外部とのつながり」セクションに整理する', true)}
    ${prefChk('onlineTop', 'オンラインユーザーを DM セクションの上部に移動する', true)}
    ${prefChk('hideMuted', 'ミュートしたチャンネルをサイドバーで非表示にする', true)}`;
  } },
  { id: 'theme', label: '表示', icon: 'sun', html: () => {
    const P = S.prefs, cur = P.slackTheme || 'Aubergine', mode = P.colorMode || (S.theme === 'dark' ? 'dark' : 'light');
    const tile = ([name, g1, g2]) => `<button type="button" class="th-tile${!P.customTheme && name === cur ? ' act' : ''}" data-theme-name="${esc(name)}"><span class="th-dot" style="background:linear-gradient(135deg,${g1},${g2})"></span><span>${esc(name)}</span></button>`;
    const c = P.customTheme || { top: '#3a0f3c', side: '#5a2a5c', active: '#f3e8f4', text: '#e8dbe9' };
    return `
    <h3>フォント</h3>
    <span class="pf-sel th-font"><select data-p="font">${UI_FONTS.map(f => `<option${f[0] === (P.font || UI_FONTS[0][0]) ? ' selected' : ''}>${esc(f[0])}</option>`).join('')}</select>${ic('down')}</span>
    <hr>
    <h3>カラーモード</h3>
    <p class="th-desc">Slack の画面のライトとダークを切り替えます。コンピューターの設定に合わせることもできます。</p>
    <div class="th-modes">
      <button type="button" data-mode="light" class="${mode === 'light' ? 'act' : ''}">${ic('sun')}ライト</button>
      <button type="button" data-mode="dark" class="${mode === 'dark' ? 'act' : ''}">${ic('moon')}ダーク</button>
      <button type="button" data-mode="system" class="${mode === 'system' ? 'act' : ''}"><svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M2 20h20M7 12h.01M11 12h.01M15 12h.01"/></svg>システム</button>
    </div>
    ${prefChk('focusDark', '集中モードの時は常にダークモードを使用する。', true)}
    <div class="th-tabs"><button type="button" data-tab="slack" class="act">Slack テーマ</button><button type="button" data-tab="custom">カスタムテーマ</button></div>
    <div class="th-pane" data-pane="slack">
      ${SLACK_THEMES.map((g, i) => `<div class="th-group-head"><b>${esc(g.group)}</b>${i === 0 ? `<button type="button" class="btn th-share" data-pact="share">${ic('send')}共有</button>` : ''}</div>
        <div class="th-grid">${g.items.map(tile).join('')}</div>`).join('')}
    </div>
    <div class="th-pane" data-pane="custom" hidden>
      <p class="th-desc">好きな色を選んで、自分だけのテーマを作れます。</p>
      <div class="th-custom">
        ${[['top', '上部バー'], ['side', 'サイドバー'], ['active', '選択中の項目'], ['text', 'サイドバーの文字']].map(([k, l]) => `<label><input type="color" data-ct="${k}" value="${c[k]}"><span>${l}</span></label>`).join('')}
      </div>
      <button type="button" class="btn primary" data-pact="custom-apply">このテーマを使う</button>
      ${P.customTheme ? '<button type="button" class="btn" data-pact="custom-reset">Slack テーマに戻す</button>' : ''}
    </div>`;
  },
    init: pane => {
      const P = S.prefs;
      $$('[data-mode]', pane).forEach(b => b.onclick = () => {
        P.colorMode = b.dataset.mode; save(); applyColorMode();
        $$('[data-mode]', pane).forEach(x => x.classList.toggle('act', x === b));
      });
      $('[data-p=font]', pane).addEventListener('change', () => applyLook());
      $$('[data-tab]', pane).forEach(b => b.onclick = () => {
        $$('[data-tab]', pane).forEach(x => x.classList.toggle('act', x === b));
        $$('[data-pane]', pane).forEach(p => p.hidden = p.dataset.pane !== b.dataset.tab);
      });
      $$('[data-theme-name]', pane).forEach(b => b.onclick = () => {
        P.slackTheme = b.dataset.themeName; delete P.customTheme; save(); applyLook();
        $$('[data-theme-name]', pane).forEach(x => x.classList.toggle('act', x === b));
      });
      $('[data-pact=share]', pane).onclick = () => {
        const t = P.customTheme ? Object.values(P.customTheme).join(',') : (P.slackTheme || 'Aubergine');
        (navigator.clipboard?.writeText(`Slack テーマ: ${t}`) || Promise.reject()).then(() => toast('テーマをクリップボードにコピーしました'), () => toast('コピーできませんでした'));
      };
      $('[data-pact=custom-apply]', pane).onclick = () => {
        P.customTheme = Object.fromEntries($$('[data-ct]', pane).map(i => [i.dataset.ct, i.value])); save(); applyLook();
        $$('[data-theme-name]', pane).forEach(x => x.classList.remove('act'));
        toast('カスタムテーマを適用しました');
      };
      $('[data-pact=custom-reset]', pane)?.addEventListener('click', () => { delete P.customTheme; save(); applyLook(); toast('Slack テーマに戻しました'); });
    } },
  { id: 'media', label: 'メッセージ & メディア', icon: 'chat', html: () => {
    const P = S.prefs, quick = P.quickEmojis || ['✅', '👀', '🙌'];
    const SKIN = ['✋', '✋🏻', '✋🏼', '✋🏽', '✋🏾', '✋🏿'];
    return `
    <h3>テーマ</h3>
    ${prefRad('msgTheme', ['クリーン', 'コンパクト'], 'クリーン')}
    <div class="mm-ex-label">例 :</div><div class="mm-ex" data-ex="theme"></div>
    <hr>
    <h3>名前</h3>
    ${prefRad('nameShow', ['氏名と表示名', '表示名のみ'], '表示名のみ')}
    <div class="mm-ex-label">例 :</div><div class="mm-ex" data-ex="name"></div>
    <p class="mm-note">氏名と表示名は、<button class="mm-link" data-pact="profile">プロフィール</button> で変更できます。</p>
    <hr>
    <h3>その他のオプション</h3>
    ${prefChk('showTyping', 'メッセージを入力しているメンバーの情報を表示する', true)}
    ${prefChk('colorSwatch', 'カラーコードの横に色見本を表示する', true)}
    <hr>
    <h3>絵文字</h3>
    <div class="mm-sub">デフォルトの肌の色</div>
    <p class="pf-desc">一部の絵文字をリアクションやメッセージに使う時に適用される、デフォルトの肌の色を選択します。</p>
    <div class="mm-skins">${SKIN.map((e, i) => `<button type="button" class="mm-emo${(P.skinTone || 0) === i ? ' act' : ''}" data-skin="${i}">${e}</button>`).join('')}</div>
    ${prefChk('emojiPlain', '絵文字をプレーンテキストとして表示する')}
    ${prefChk('jumbomoji', '<b>ジャンボモジ</b>を表示する<small>テキスト無しのメッセージの場合に、絵文字が大きく表示されます。(1 度につき最大 23 個！)</small>', true)}
    ${prefChk('emojiConvert', '入力したエモティコンを絵文字に変換します。例 : :D が 😄 になります。', true)}
    ${prefChk('quickReact', 'メッセージにワンクリック絵文字リアクションを表示する', true)}
    <div class="mm-quick">
      ${prefRad('quickMode', ['自分がよく使う絵文字', 'カスタム'], 'カスタム')}
      <div class="mm-custom"><p class="pf-desc">以下をクリックして、使用したい絵文字を選択します。</p>
        <div class="mm-skins">${quick.map((e, i) => `<button type="button" class="mm-emo" data-q="${i}">${e}</button>`).join('')}</div></div>
    </div>
    <div class="mm-ex-label">例 :</div><div class="mm-ex mm-ex-hover" data-ex="react"></div>
    <hr>
    <h3>メディア & リンクのインライン表示</h3>
    ${prefChk('inlineImg', 'Slackへアップロードされた画像やファイルを展開して表示する', true)}
    ${prefChk('inlineLinkImg', 'リンクしたサイトからの画像やファイルを展開して表示する', true)}
    <div class="mm-indent">${prefChk('inlineBig', '20 MB を超える場合も表示する')}</div>
    ${prefChk('inlineLink', 'リンクしたサイトのテキストプレビューを表示する', true)}
    <hr>
    <h3>Slack へのメールの転送</h3>
    <p class="mm-body">どんな重要メールも、固有のユニークメールアドレスに転送することで Slack にアップロードすることができます。メールは Slack がお届けし、ご希望に応じて非公開のままにしておくことも、またはチームと共有することも可能です。</p>
    <button type="button" class="btn mm-btn" data-pact="fwd">転送先メールアドレスを取得する</button>`;
  },
    init: pane => {
      const P = S.prefs, t = fmtTime(Date.now());
      const msg = (who, color, letter, name, html, extra = '') => `<div class="mm-msg${extra}"><span class="avatar" style="background:${color}">${letter}</span><div><div class="mm-head"><b>${name}</b><span>${t}</span></div><div>${html}</div></div></div>`;
      const paint = () => {
        const compact = (P.msgTheme || 'クリーン') === 'コンパクト';
        $('[data-ex=theme]', pane).innerHTML = compact
          ? `<div class="mm-compact"><span class="mm-time">${t}</span><b>Slackbot</b> 元気です！</div>`
          : msg('bot', '#4a154b', '🤖', 'Slackbot', '元気です！');
        const full = (P.nameShow || '表示名のみ') === '氏名と表示名';
        $('[data-ex=name]', pane).innerHTML = msg('meg', '#9b59b6', 'メ', full ? 'メグ <span class="mm-full">Meg Tanaka</span>' : 'メグ', '👋 こんにちは、<span class="mm-mention">@Meg</span>です');
        const q = P.quickEmojis || ['✅', '👀', '🙌'];
        const bar = P.quickReact === false ? '' : `<div class="mm-bar">${q.map(e => `<span>${e}</span>`).join('')}${ic('smileplus')}${ic('thread')}${ic('send')}${ic('bookmark')}${ic('more')}</div>`;
        $('[data-ex=react]', pane).innerHTML = bar + msg('marcel', '#1264a3', 'M', 'Marcel', '検証が終わりました。すぐにフィードバックを送ります');
        $('.mm-quick', pane).classList.toggle('dis', P.quickReact === false);
        $('.mm-custom', pane).hidden = (P.quickMode || 'カスタム') !== 'カスタム';
      };
      $$('[data-p]', pane).forEach(inp => inp.addEventListener('change', paint));
      $$('[data-skin]', pane).forEach(b => b.onclick = () => { P.skinTone = +b.dataset.skin; save(); $$('[data-skin]', pane).forEach(x => x.classList.toggle('act', x === b)); });
      $$('[data-q]', pane).forEach(b => b.onclick = () => emojiPicker(b, e => {
        const q = [...(P.quickEmojis || ['✅', '👀', '🙌'])]; q[+b.dataset.q] = e; P.quickEmojis = q; save(); b.textContent = e; paint();
      }));
      $('[data-pact=profile]', pane).onclick = () => { $('.prefs-modal').closest('.overlay')?.remove(); profileModal(); };
      $('[data-pact=fwd]', pane).onclick = () => toast('研修用のため、転送先メールアドレスは発行できません');
      paint();
    } },
  { id: 'lang', label: '言語 & 地域', icon: 'link', html: () => `
    <h3>表示言語</h3>
    <div class="lg-wide">${prefSel('lang', ['日本語', 'English (US)', 'English (UK)', 'Español', 'Français', 'Deutsch', 'Português (Brasil)', '中文（简体）', '中文（繁體）', '한국어'], '日本語')}</div>
    <p class="pf-desc lg-help">Slack で使用する言語を選択してください。</p>
    <h3 class="lg-gap">タイムゾーン</h3>
    ${prefChk('tzAuto', 'タイムゾーンを自動で設定する', true)}
    <div class="lg-wide">${prefSel('tz', TIMEZONES, me().tz && TIMEZONES.includes(me().tz) ? me().tz : '(UTC+09:00) 大阪、札幌、東京')}</div>
    <p class="pf-desc lg-help">Slack はサマリーや通知メールの送信、アクティビティフィードやリマインダーの時間にお住まいの地域のタイムゾーンを使用しています。</p>
    <h3 class="lg-gap lg-gap2">スペルチェック</h3>
    ${prefChk('spell', 'メッセージと canvas のスペルチェックを有効にする', true)}
    <div class="lg-chips" tabindex="0"></div>
    <p class="pf-desc lg-help">Slackでの入力時にスペルチェックしたい言語を選択します。</p>`,
    init: pane => {
      const tzSel = $('[data-p=tz]', pane), auto = $('[data-p=tzAuto]', pane);
      const syncTz = () => { tzSel.disabled = auto.checked; tzSel.closest('.pf-sel').classList.toggle('dis', auto.checked); };
      auto.addEventListener('change', syncTz); syncTz();
      tzSel.addEventListener('change', () => { me().tz = tzSel.value; save(); renderProfile(); });
      $('[data-p=lang]', pane).addEventListener('change', e => { if (e.target.value !== '日本語') toast('研修用のため、表示は日本語のままです'); });
      const SPELL = ['English (US)', 'English (UK)', '日本語', 'Español', 'Français', 'Deutsch', 'Português', '한국어'];
      const box = $('.lg-chips', pane), spellOn = $('[data-p=spell]', pane);
      const paint = () => {
        const langs = S.prefs.spellLangs || ['English (US)'];
        const rest = SPELL.filter(l => !langs.includes(l));
        box.innerHTML = langs.map(l => `<span class="lg-chip">${esc(l)}<button type="button" data-rm="${esc(l)}" title="削除">${ic('x')}</button></span>`).join('') +
          (rest.length ? `<select class="lg-add"><option value="">${langs.length ? '' : '言語を追加…'}</option>${rest.map(l => `<option>${esc(l)}</option>`).join('')}</select>` : '');
        box.classList.toggle('dis', !spellOn.checked);
        $$('[data-rm]', box).forEach(b => b.onclick = () => { S.prefs.spellLangs = langs.filter(x => x !== b.dataset.rm); save(); paint(); });
        const add = $('.lg-add', box);
        if (add) add.onchange = () => { if (add.value) { S.prefs.spellLangs = [...langs, add.value]; save(); paint(); } };
      };
      spellOn.addEventListener('change', paint); paint();
    } },
  { id: 'a11y', label: 'アクセシビリティ', icon: 'users', html: () => {
    const radD = (key, val, label, desc, on) => `<label class="pf-chk pf-top"><input type="radio" name="${key}" data-p="${key}" value="${val}"${on ? ' checked' : ''}><span><b>${label}</b>${desc ? `<small>${desc}</small>` : ''}</span></label>`;
    const chkD = (key, label, desc, on = true) => `<label class="pf-chk pf-top"><input type="checkbox" data-p="${key}"${on ? ' checked' : ''}><span>${label}${desc ? `<small>${desc}</small>` : ''}</span></label>`;
    const zooms = ['70', '80', '90', '100', '110', '125', '150', '175', '200'];
    const cur = String(Math.round(zoom * 100));
    const zoomRad = zooms.map(z => `<label class="pf-chk"><input type="radio" name="zoom" data-zoom="${z}"${z === cur ? ' checked' : ''}><span>${z === '100' ? '<b>100%</b>デフォルト' : z + '%'}</span></label>`).join('');
    const order = S.prefs.srOrder || SR_ITEMS.map(i => i[0]);
    const srList = order.map(k => SR_ITEMS.find(i => i[0] === k)).filter(Boolean).map(([k, label, desc, locked]) => `
      <div class="sr-item" data-k="${k}"><span class="sr-grip">⠿</span>
        <label class="pf-chk pf-top${locked ? ' dis' : ''}"><input type="checkbox" data-p="sr_${k}" checked${locked ? ' disabled' : ''}><span>${label}${desc ? `<small>${desc}</small>` : ''}</span></label>
        <span class="sr-move"><button type="button" data-mv="-1" title="上へ">↑</button><button type="button" data-mv="1" title="下へ">↓</button></span></div>`).join('');
    return `
    <h2 class="pf-h">表示</h2>
    <h3>シンプルレイアウトモード</h3>
    <p class="pf-desc">Slack のすべての機能がコンパクトで直感的に操作可能なレイアウトに配置されるため、画面をスムーズに移動できるようになり、仕事に集中しやすくなります。</p>
    <button type="button" class="btn pf-btn" data-pact="simple">${S.prefs.simpleLayout ? 'オフにする' : 'オンにする'}</button>
    <h3 class="pf-mt">拡大/縮小</h3>${zoomRad}
    <p class="pf-note">拡大/縮小のレベルは Ctrl +/- を押して変更することもできます</p>
    <hr>
    <h3>代替テキストリマインダー</h3>${prefChk('altReminder', '画像のアップロード時に画像の説明の追加を求める通知を表示する')}
    <h3 class="pf-mt">ほかの表示オプション</h3>
    ${chkD('tabPreview', 'タブにマウスポインターを重ねた時にプレビューを表示する', '')}
    ${chkD('linkUnderline', 'ウェブサイトへのリンクに下線を表示する', '', false)}
    ${chkD('allowAnim', 'アニメーションを許可する', 'ハドルミーティングと Slack 全体で絵文字アニメーション、GIF、絵文字リアクション、エフェクトに適用されます')}
    <hr>
    <h2 class="pf-h">キーボード</h2>
    <p class="pf-desc"><button type="button" class="pf-link" data-goto="shortcuts">キーボードショートカット</button> をマスターすれば、Slack がより使いやすくなります。</p>
    <div class="pf-label pf-mt">空欄のメッセージフィールドで <kbd class="pf-kbd">▲</kbd> を押すと、以下を実行することができます :</div>
    ${radD('upKey', 'focus', 'フォーカスをメッセージリストに移動する', 'リスト内の最新のメッセージが選択されます')}
    ${radD('upKey', 'focusEmpty', 'メッセージフィールドが空の場合のみ、メッセージリストにフォーカスを移動します', 'リスト内の最新のメッセージが選択されます')}
    ${radD('upKey', 'edit', '直近のメッセージを編集', 'あなたが最後に送信したメッセージが選択され、編集モードになります', true)}
    <p class="pf-desc">注 : <kbd class="pf-kbd">Ctrl</kbd> + <kbd class="pf-kbd">▲</kbd> を押せば、いつでも最新のメッセージを編集できます。</p>
    <h3 class="pf-mt">リストのキーボード操作</h3>
    <p class="pf-desc">リストでのキーボードの使用方法を選択してください。</p>
    ${radD('listKeys', 'data', 'データ入力モード<span class="pf-normal">（デフォルト）</span>', 'セル間の水平移動に Tab、垂直移動に Enter を使用します', true)}
    ${radD('listKeys', 'full', 'フルキーボードモード<span class="pf-normal">（アシスティブテクノロジー向け）</span>', 'インタラクティブ要素間を Tab で移動し、Enter で編集します')}
    <hr>
    <h2 class="pf-h">スクリーンリーダー</h2>
    <p class="pf-desc">スクリーンリーダーの使用感をカスタマイズ</p>
    <h3 class="pf-mt">メッセージの詳細度</h3>
    <p class="pf-desc">含めるメッセージの部分を選択し、読み上げる順番を指定してください。</p>
    <div class="sr-list">${srList}</div>
    <div class="pf-row pf-mt"><button type="button" class="btn pf-btn" data-pact="srPreview">▷ プレビューを再生する</button><button type="button" class="btn pf-btn" data-pact="srReset">デフォルト設定にリセットする</button></div>
    <h3 class="pf-mt2">ARIA アプリケーションロールの使用</h3>${prefChk('ariaList', 'リストビューに適用する')}
    <h3 class="pf-mt">スクリーンリーダーによる通知</h3>
    ${prefChk('srNewMsg', '現在の会話の新規メッセージを自動的に読み上げる', true)}
    ${prefChk('srHuddleReact', 'ハドルミーティングで受信した絵文字リアクションを読み上げる', true)}
    ${prefChk('srHuddleSound', 'ハドルミーティングで絵文字を送信または受信した時にサウンドを再生する', true)}
    <p class="pf-desc pf-mt">通知音を変更するには <button type="button" class="pf-link" data-goto="notify">通知</button> に移動します</p>
    <hr>
    <p class="pf-desc">Slack のフォントを変更しますか？「表示」設定の <button type="button" class="pf-link" data-goto="theme">フォント</button> をチェックしてみてください。</p>`;
  } },
  { id: 'read', label: '既読にする', icon: 'check', html: () => `
    <p class="pf-desc rd-intro">Slack では、チャンネルを表示するとそのチャンネルが既読としてマークされますが、これは必要に応じて変更することが可能です。</p>
    <div class="pf-label">チャンネルを開いたとき :</div>
    ${prefRad('readPos', ['前回最後にメッセージを確認したところから表示され、そこから確認をスタートします。チャンネルは既読になります。', '一番新しいメッセージが表示され、そこから確認をスタートします。チャンネルは既読になります。', '一番新しいメッセージが表示され、そこから確認をスタートします。表示されなかったメッセージは未読のままになります。'], '前回最後にメッセージを確認したところから表示され、そこから確認をスタートします。チャンネルは既読になります。')}
    <div class="pf-label pf-mt">すべて既読にした時 :</div>
    ${prefChk('readConfirm', '確認を求めるメッセージ', true)}
    <h3 class="pf-mt">キーボードショートカット</h3>
    <ul class="rd-keys">
      <li>現在のチャンネルのすべてのメッセージを既読にする <kbd class="pf-kbd">Esc</kbd></li>
      <li>全メッセージを既読にする <kbd class="pf-kbd">Shift</kbd> <kbd class="pf-kbd">Esc</kbd></li>
      <li>メッセージを未読にする <kbd class="pf-kbd">Alt</kbd> + メッセージをクリック</li>
    </ul>
    <p class="pf-desc">これだけではありません。キーボードショートカットの一覧を、<kbd class="pf-kbd">Ctrl</kbd> + <kbd class="pf-kbd">・</kbd> の簡単操作で確認することができます。</p>` },
  { id: 'av', label: '音声とビデオ', icon: 'video', noTitle: true, init: avInit, html: () => `
    <h3>カメラ</h3>
    <div class="av-cam"><video autoplay muted playsinline hidden></video><button type="button" class="btn pf-btn av-start">${ic('video')}カメラのプレビューを開始</button></div>
    <span class="pf-sel av-sel"><select data-dev="videoinput"><option>既定のカメラ</option></select>${ic('down')}</span>
    <hr>
    <h3>マイク</h3>
    <span class="pf-sel av-sel"><select data-dev="audioinput"><option>既定のマイク</option></select>${ic('down')}</span>
    <div class="av-level"><span>入力レベル :</span><span class="av-dots">${'<i></i>'.repeat(15)}</span></div>
    <div class="av-two">${prefChk('agc', '入力レベル自動調整を有効にする', true)}${prefChk('noiseSup', 'ノイズ抑制を有効にする', true)}</div>
    <h3 class="pf-mt">スピーカー</h3>
    <div class="av-spk"><span class="pf-sel av-sel"><select data-dev="audiooutput"><option>既定のスピーカー（システムデフォルト）（推奨）</option></select>${ic('down')}</span><button type="button" class="btn pf-btn av-test">テスト</button></div>
    <hr>
    <h3>音声または動画の再生時...</h3>
    ${prefChk('pipPin', 'スクロールするか、別の場所に移動した時に隅に自動で固定する', true)}
    <hr>
    <h3>ハドルミーティングへの参加時...</h3>
    ${prefChk('huddleMute', 'マイクをミュートする')}
    ${prefChk('huddleCaption', 'ハドルミーティングでは自動的にキャプションをオンにする')}
    ${prefChk('huddleWarn150', '150 人を超えるメンバーがいるチャンネルにてハドルミーティングを始める時に警告を送信する', true)}
    ${prefChk('huddleBlur', 'カメラがオンの状態でハドルミーティングに参加している時にビデオの背景をぼかす')}
    ${prefChk('huddlePreview', '音声とビデオのプレビューを表示する', true)}
    <h3 class="pf-mt">バックグラウンドで Slack が実行されているとき :</h3>
    <label class="pf-chk pf-top"><input type="checkbox" data-p="bgMuteKey" checked><span>キーボードショートカットでミュートできるようにする<small><kbd class="pf-kbd">Ctrl</kbd><kbd class="pf-kbd">Shift</kbd><kbd class="pf-kbd">Space</kbd> を使ってマイクのミュートを切り替えます。</small></span></label>
    <h3 class="pf-mt">ハドルミーティングのモーション</h3>
    ${prefChk('huddleMotion', '絵文字リアクションとエフェクトに対して許可する', true)}
    <h3 class="pf-mt">ハドルミーティングにほかの参加者がいない時...</h3>
    ${prefChk('huddleMusic', '音楽を再生する', true)}
    <div class="av-music">${prefSel('huddleTrack', ['ハドルの音楽（デフォルト）', 'ローファイ', 'ジャズ', 'クラシック', 'アンビエント'], 'ハドルの音楽（デフォルト）')}</div>
    <hr>
    <h3>スクリーンセーバーが起動した場合やコンピューターがロックされた場合...</h3>
    ${prefChk('huddleLockLeave', 'ハドルミーティングから自動的に退出する', true)}
    <hr>
    <h3>トラブルシューティング</h3>
    <div class="av-trouble"><span>音声、ビデオ、画面共有のテストを実行します。</span><button type="button" class="btn pf-btn av-run">テストを実行する</button></div>` },
  { id: 'sf', label: 'Salesforce', icon: 'apps', html: () => `<h3>Salesforce</h3><p class="pf-desc">Salesforce のアカウントを接続すると、レコードを Slack で確認できます。（研修用のため接続できません）</p>` },
  { id: 'accounts', label: '連携アカウント', icon: 'link', html: () => `
    <p class="pf-desc pf-lead">Slack アカウントをほかのアプリと連携させれば、すばやくサインインしたり、リンクでプレビューできる情報を増やしたりすることができます。<button type="button" class="pf-link" data-goto="more">もっと詳しく</button></p>
    <hr>
    <h3>Slack でサインイン済み</h3>
    <div class="pf-box">現時点では、Slack でサインインしたアプリを<button type="button" class="pf-link" data-goto="apps">アプリ管理ページ</button>で確認できます。</div>
    <hr>
    <h3>ほかのアプリからのリンクとコンテンツ</h3>
    <p class="pf-desc">別のアプリやサービスからのリンクを開く時に、Slack のサインイン情報を使ってアカウントに接続し、リンク先のコンテンツを見ることができます。アプリのリンクを開くと、連携のリクエストがアプリから送られてきます。</p>
    ${prefChk('allowConnect', 'Slack とほかのアプリとの連携を許可する', true)}
    <div class="pf-box">連携中のアプリはありません。</div>
    <hr>
    <h3>ワークフローで連携しているアプリ</h3>
    <p class="pf-desc pf-muted">ワークフロー、機能、アプリの作成や使用の際にセットアップしたサードパーティからのアカウント</p>
    <div class="pf-box">連携中のアカウントはありません。</div>` },
  { id: 'privacy', label: 'プライバシーと可視性', icon: 'lock', noTitle: true, html: () => {
    const rad = (key, val, label, on, desc = '') => `<label class="pf-chk pf-top"><input type="radio" name="${key}" data-p="${key}" value="${val}"${on ? ' checked' : ''}><span>${label}${desc ? `<small>${desc}</small>` : ''}</span></label>`;
    const email = me().email;
    return `
    <h3>Slack コネクトの公開範囲</h3>
    <p class="pf-desc">Slack 検索であなたを見つけることができる人を選択します。相手にわかるのは、あなたが Slack を使っていることだけです。個人やワークスペースについての詳細情報が共有されることはありません。<button type="button" class="pf-link" data-goto="more">もっと詳しく</button></p>
    <div class="pf-gap">
      ${rad('connectVis', 'email', `あなたのメールアドレス（<b>${email ? esc(email) : 'プロフィールで未設定'}</b>）を知っている人なら誰でも`, true)}
      ${rad('connectVis', 'none', 'すべて許可しない')}
    </div>
    <div class="pf-info">${ic('info')}<div><b>環境設定はこのワークスペースにのみ適用されます</b><p>誰かが検索した場合でも自分が表示されないようにするには、すべてのワークスペースでこの設定を変更してください。</p><button type="button" class="pf-link" data-goto="more">ワークスペースを検索する</button></div></div>
    <hr>
    <h3>連絡先の共有</h3>
    <p class="pf-desc">${esc(S.workspace)} 外の人に紹介してもらうため、あなたの連絡先情報を共有できる人を選択します。<button type="button" class="pf-link" data-goto="more">もっと詳しく</button></p>
    <div class="pf-gap">
      ${rad('contactShare', 'external', '社外のメンバー', true, 'Slack で連携できる外部の人を含みます。')}
      ${rad('contactShare', 'none', 'すべて許可しない')}
    </div>
    <hr>
    <h3>ブロック済みの招待</h3>
    <p class="pf-desc">これらのメンバーからの Slack コネクトの招待受信を停止しました。</p>
    <div class="pf-box pf-boxi">${ic('info')}<span>まだ誰からの招待もブロックしていません。</span></div>
    <hr>
    <h3>非表示にしているメンバー</h3>
    <p class="pf-desc">これらの人からの通知の受信やメッセージの表示は行われません。<button type="button" class="pf-link" data-goto="more">もっと詳しく</button></p>
    <div class="pf-box pf-boxi">${ic('info')}<span>まだ誰も非表示にしていません。</span></div>`;
  } },
  { id: 'ai', label: 'Slack AI', icon: 'smile', html: () => `
    <h3>Slackbot Mini キーボードショートカット</h3>
    <div class="pf-label">ミニウィンドウを開く</div>
    ${prefSel('aiMiniKey', AI_MINI_KEYS, 'なし')}
    <hr>
    <h3>Slackbot AI</h3>` },
  { id: 'adv', label: '詳細設定', icon: 'gear', noTitle: true, html: () => {
    const k = s => `<kbd class="pf-kbd">${s}</kbd>`;
    const chk = (key, label, desc = '', on = false, cls = '') => `<label class="pf-chk pf-top${cls}"><input type="checkbox" data-p="${key}"${on ? ' checked' : ''}><span>${label}${desc ? `<small>${desc}</small>` : ''}</span></label>`;
    const rad = (key, val, label, on, desc = '') => `<label class="pf-chk pf-top"><input type="radio" name="${key}" data-p="${key}" value="${val}"${on ? ' checked' : ''}><span>${label}${desc ? `<small>${desc}</small>` : ''}</span></label>`;
    return `
    <h3>入力オプション</h3>
    <div class="pf-gap">
    ${chk('smartQuotes', 'スマート引用符と記号を有効にする', `引用符 ${k('" "')} を入力すると曲線引用符 ${k('“ ”')} が作成されます<br>${k('--')} を入力するとエムダッシュ ${k('—')} が作成されます<br>${k('...')} を入力すると 3 つのドット ${k('…')} が作成されます<br>${k('-')} と ${k('&gt;')} または ${k('&lt;')} と ${k('-')} を入力すると、矢印 ${k('→')} ${k('←')} が作成されます`, true)}
    ${chk('codeNoSend', `\`\`\` でコードを入力するとき、${k('Enter')} キーでメッセージが送信されないようにします。`, `これをチェックして、${k('Shift')}${k('Enter')} で送信します。`)}
    ${chk('markup', 'マークアップでメッセージを書式設定する', 'テキストの書式設定ツールバーはコンポーザーには表示されません。')}
    ${chk('shortLinks', '外部リンクを短くする', 'リンクを Slack 以外の場所にペーストすると、URL が短くなります。', true)}
    </div>
    <div class="pf-label pf-mt">メッセージ作成画面で ${k('Enter')} を押した時 :</div>
    ${rad('enterKey', 'send', 'メッセージを送信する', true)}
    ${rad('enterKey', 'newline', `改行する (送信する時は ${k('Ctrl')}${k('Enter')} を押す)`)}
    <hr>
    <h3>リリースチャネル</h3>
    <div class="pf-gap">${prefSel('releaseCh', ['Production', 'Beta', 'Alpha'], 'Production')}</div>
    <p class="pf-note pf-mt-s">注意: これはこのコンピューターのみでの設定となります。アプリのアップデートを受け取るタイミングが変わります。</p>
    <hr>
    <h3>検索オプション</h3>
    <div class="pf-label pf-mt">検索からこれらのチャンネルを除外する :</div>
    <input class="inp pf-inp" data-p="searchExclude" placeholder="チャンネル名を入力する..." list="pfChList" autocomplete="off">
    <datalist id="pfChList">${S.channels.filter(c => c.type === 'channel').map(c => `<option value="${esc(c.name)}">`).join('')}</datalist>
    <div class="pf-label pf-mt">並べ替えオプションのデフォルト :</div>
    ${rad('searchSort', 'relevance', '関連度順', true)}
    ${rad('searchSort', 'last', '最後に使用したオプション :', false, '新しい検索を実行するたびに、最後に使用したオプションがデフォルトで選択されます')}
    <hr>
    <h3>ダウンロードのロケーション</h3>
    <div class="pf-gap">${chk('askDownload', '各ダウンロードの場所を選択')}</div>
    <div class="pf-row pf-dl"><input class="inp pf-inp" value="Downloads" readonly><button type="button" class="btn pf-btn" data-goto="dlchange">変更...</button></div>
    <p class="pf-note pf-mt-s">注意: これはこのコンピューターのみでの設定となり、あなたがサインインしているワークスペースすべてで反映されます。</p>
    <hr>
    <h3>確認と警告</h3>
    <div class="pf-gap">${chk('undoConfirm', `${k('Ctrl')}${k('Z')} を使って送信済みメッセージを取り消す時に、確認メッセージを表示する`, '', true)}</div>
    <hr>
    <h3>その他のオプション</h3>
    <div class="pf-gap">
    ${chk('surveys', 'たまに送られるアンケートを受信する', 'Slack をより使いやすくするため、ユーザーの皆さんからのフィードバックを心待ちにしています。', true)}
    ${chk('noHwAccel', 'ハードウェアアクセラレーションを無効にする')}
    ${chk('launchLogin', 'ログイン時にアプリを起動する', '', true)}
    ${chk('launchHidden', 'ログイン時の起動後にウィンドウを非表示にする', '', true, ' pf-indent')}
    ${chk('trayKeep', 'ウィンドウが閉じてる間もアプリを通知領域で起動中にしておく', '', true)}
    </div>`;
  } },
];
/* 音声とビデオ：実際のカメラ・マイク・スピーカーを一覧表示し、プレビューと入力レベルを表示 */
function avInit(pane) {
  S.prefs.avDev = S.prefs.avDev || {};
  let stream = null, raf = 0, actx = null;
  const video = $('.av-cam video', pane), startBtn = $('.av-start', pane), dots = $$('.av-dots i', pane);
  const stop = () => {
    cancelAnimationFrame(raf); raf = 0;
    stream?.getTracks().forEach(t => t.stop()); stream = null;
    actx?.close(); actx = null;
    dots.forEach(d => d.classList.remove('on'));
  };
  // 設定画面を閉じたり別ページに移ったら、カメラとマイクを止める
  const watch = setInterval(() => { if (!video.isConnected) { stop(); clearInterval(watch); } }, 500);
  const fill = async () => {
    if (!navigator.mediaDevices?.enumerateDevices) return;
    const devs = await navigator.mediaDevices.enumerateDevices();
    $$('[data-dev]', pane).forEach(sel => {
      const kind = sel.dataset.dev, list = devs.filter(d => d.kind === kind && d.label);
      if (!list.length) return;
      sel.innerHTML = list.map(d => `<option value="${esc(d.deviceId)}">${esc(d.label)}</option>`).join('');
      if (S.prefs.avDev[kind] && list.some(d => d.deviceId === S.prefs.avDev[kind])) sel.value = S.prefs.avDev[kind];
    });
  };
  const meter = s => {
    try {
      actx = new AudioContext();
      const an = actx.createAnalyser(); an.fftSize = 512;
      actx.createMediaStreamSource(s).connect(an);
      const buf = new Uint8Array(an.fftSize);
      const tick = () => {
        an.getByteTimeDomainData(buf);
        let sum = 0; for (const v of buf) sum += (v - 128) ** 2;
        const lvl = Math.min(15, Math.round(Math.sqrt(sum / buf.length) / 2.5));
        dots.forEach((d, i) => d.classList.toggle('on', i < lvl));
        raf = requestAnimationFrame(tick);
      };
      tick();
    } catch {}
  };
  const start = async () => {
    stop();
    const v = $('[data-dev=videoinput]', pane).value, a = $('[data-dev=audioinput]', pane).value;
    const isId = x => x && !x.startsWith('既定');
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: isId(v) ? { deviceId: { exact: v } } : true,
        audio: { ...(isId(a) ? { deviceId: { exact: a } } : {}), autoGainControl: S.prefs.agc !== false, noiseSuppression: S.prefs.noiseSup !== false },
      });
    } catch { toast('カメラまたはマイクを使用できませんでした（ブラウザの許可を確認してください）'); return; }
    if (!video.isConnected) return stop();
    video.srcObject = stream; video.hidden = false; startBtn.hidden = true;
    meter(stream);
    await fill();
  };
  startBtn.onclick = start;
  $$('[data-dev]', pane).forEach(sel => sel.onchange = () => {
    S.prefs.avDev[sel.dataset.dev] = sel.value; save();
    if (stream && sel.dataset.dev !== 'audiooutput') start();
  });
  $('.av-test', pane).onclick = async () => {
    // スピーカーのテスト音（ポーン）
    try {
      const ctx = new AudioContext(), out = $('[data-dev=audiooutput]', pane).value;
      if (ctx.setSinkId && out && !out.startsWith('既定')) await ctx.setSinkId(out).catch(() => {});
      [880, 660].forEach((f, i) => {
        const o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime + i * 0.25;
        o.frequency.value = f; g.gain.setValueAtTime(0.25, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
        o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + 0.4);
      });
      setTimeout(() => ctx.close(), 1000);
    } catch { toast('テスト音を再生できませんでした'); }
  };
  $('.av-run', pane).onclick = async () => {
    if (!navigator.mediaDevices?.enumerateDevices) return toast('このブラウザではテストを実行できません');
    const d = await navigator.mediaDevices.enumerateDevices();
    const n = k => d.filter(x => x.kind === k).length;
    const share = !!navigator.mediaDevices.getDisplayMedia;
    modal({ title: 'テスト結果', body: `<ul class="av-result"><li>${n('videoinput') ? '✅' : '⚠️'} カメラ：${n('videoinput')} 台</li><li>${n('audioinput') ? '✅' : '⚠️'} マイク：${n('audioinput')} 台</li><li>${n('audiooutput') ? '✅' : '⚠️'} スピーカー：${n('audiooutput')} 台</li><li>${share ? '✅' : '⚠️'} 画面共有：${share ? '利用できます' : '利用できません'}</li></ul>` });
  };
  fill();
}
// スクリーンリーダーで読み上げるメッセージの部分 [キー, 表示名, 説明, 無効化不可]
const SR_ITEMS = [
  ['sender', '送信者', '並べ替えることはできますが、無効にすることはできません。', true],
  ['message', 'メッセージ', '並べ替えることはできますが、無効にすることはできません。', true],
  ['alt', '画像の代替テキスト'],
  ['time', '日時'],
  ['reactions', 'リアクションの数'],
  ['replies', '返信の数', '返信の件数と送信予約済みの返信の件数。'],
  ['links', 'リンクの数'],
  ['files', '添付ファイルの数', '画像、ビデオ、ファイル、canvas、メッセージの展開などの添付ファイルの数。'],
  ['draft', '返信の下書きがある'],
  ['pinned', 'ピン留め'],
  ['edited', '編集済み'],
  ['later', '「後で」にブックマーク済み', 'メッセージは「後で」にブックマークされているか、リマインダーとして設定されています。'],
  ['alsoSent', '会話にも送信済み', 'スレッド内の返信が会話にも送信されたことを示しています。'],
  ['parent', '返信の開始メッセージ', '会話に送信された返信の前に、スレッドの開始メッセージを含めます。'],
  ['translate', '翻訳を利用できます'],
];
/* Slack AI：Slackbot Mini を開くショートカット（選んだキーで Slackbot の DM を開く） */
const AI_MINI_KEYS = ['なし', 'Ctrl+Shift+Space', 'Ctrl+Alt+Space', 'Ctrl+Shift+J'];
document.addEventListener('keydown', e => {
  const k = (S.prefs || {}).aiMiniKey;
  if (!k || k === 'なし' || !e.ctrlKey) return;
  const want = k.split('+'), key = want.pop();
  const hit = want.includes('Shift') === e.shiftKey && want.includes('Alt') === e.altKey && (key === 'Space' ? e.code === 'Space' : e.key.toUpperCase() === key);
  if (hit) { e.preventDefault(); closePop(); railGo('bot'); }
});
function prefsModal(startId = 'login') {
  S.prefs = S.prefs || {};
  const body = el('div', 'pf-wrap', `<nav class="pf-nav"></nav><div class="pf-pane"></div>`);
  const nav = $('.pf-nav', body), pane = $('.pf-pane', body);
  const m = modal({ title: '環境設定', body, buttons: [] });
  m.el.classList.add('prefs-modal');
  const show = id => {
    const sec = PREF_SECTIONS.find(s => s.id === id) || PREF_SECTIONS[0];
    $$('button', nav).forEach(b => b.classList.toggle('act', b.dataset.id === sec.id));
    pane.innerHTML = `${sec.noTitle ? '' : `<h2>${esc(sec.label)}</h2>`}${sec.html()}`;
    pane.scrollTop = 0;
    // 保存済みの値を反映
    $$('[data-p]', pane).forEach(inp => {
      const v = S.prefs[inp.dataset.p];
      if (v === undefined) return;
      if (inp.type === 'checkbox') inp.checked = v;
      else if (inp.type === 'radio') inp.checked = inp.value === v;
      else inp.value = v;
    });
    $$('[data-p]', pane).forEach(inp => inp.onchange = () => {
      const k = inp.dataset.p, v = inp.type === 'checkbox' ? inp.checked : inp.value;
      S.prefs[k] = v;
      if (k === 'notifyLevel') S.notifyOff = v === 'なし';
      if (k === 'themeMode' && (v === 'ダーク') !== (S.theme === 'dark')) toggleTheme();
      save(); applyTheme(); renderSidebar();
    });
    $('[data-pact=reset]', pane)?.addEventListener('click', () => { m.close(); resetData(); });
    // 他の設定ページへのリンク
    $$('[data-goto]', pane).forEach(b => b.onclick = () => {
      if (b.dataset.goto === 'shortcuts') return toast('Ctrl + / でキーボードショートカットを確認できます');
      if (b.dataset.goto === 'more') return toast('研修用のため、ヘルプページは開けません');
      if (b.dataset.goto === 'dlchange') return toast('ブラウザ版ではダウンロード先はブラウザの設定に従います');
      if (b.dataset.goto === 'apps') { m.close(); return railGo('apps'); }
      show(b.dataset.goto);
    });
    // アクセシビリティ：拡大/縮小（Ctrl +/- と同じ倍率設定を共有）
    $$('[data-zoom]', pane).forEach(r => r.onchange = () => {
      zoom = +r.dataset.zoom / 100; applyZoom();
      try { localStorage.setItem('slack-zoom', zoom); } catch {}
    });
    // アクセシビリティ：シンプルレイアウト
    $('[data-pact=simple]', pane)?.addEventListener('click', e => {
      S.prefs.simpleLayout = !S.prefs.simpleLayout; save(); applyTheme();
      e.currentTarget.textContent = S.prefs.simpleLayout ? 'オフにする' : 'オンにする';
      toast(S.prefs.simpleLayout ? 'シンプルレイアウトモードをオンにしました' : 'シンプルレイアウトモードをオフにしました');
    });
    // アクセシビリティ：読み上げ項目の並べ替え
    $$('.sr-item [data-mv]', pane).forEach(b => b.onclick = () => {
      const item = b.closest('.sr-item'), dir = +b.dataset.mv;
      const sib = dir < 0 ? item.previousElementSibling : item.nextElementSibling;
      if (!sib) return;
      dir < 0 ? sib.before(item) : sib.after(item);
      S.prefs.srOrder = $$('.sr-item', pane).map(x => x.dataset.k); save();
      $(`.sr-item[data-k="${item.dataset.k}"] [data-mv="${dir}"]`, pane)?.focus();
    });
    $('[data-pact=srReset]', pane)?.addEventListener('click', () => {
      delete S.prefs.srOrder;
      SR_ITEMS.forEach(([k]) => delete S.prefs['sr_' + k]);
      save(); const top = pane.scrollTop; show('a11y'); pane.scrollTop = top;
      toast('デフォルト設定にリセットしました');
    });
    $('[data-pact=srPreview]', pane)?.addEventListener('click', () => {
      const parts = $$('.sr-item', pane).filter(x => $('input', x).checked).map(x => $('.pf-chk > span', x).firstChild.textContent.trim());
      toast('読み上げ順：' + parts.join('、'));
    });
    sec.init?.(pane);
  };
  PREF_SECTIONS.forEach(s => {
    const b = el('button', '', `${ic(s.icon)}<span>${esc(s.label)}</span>`);
    b.dataset.id = s.id;
    b.onclick = () => show(s.id);
    nav.append(b);
  });
  show(startId);
}
function statusModal() {
  const u = me();
  const body = el('div', '', `<label class="field"><span>ステータス</span><input class="inp" name="s" value="${esc(u.status || '')}" placeholder="例：🏠 在宅勤務"></label><div style="display:flex;gap:6px;flex-wrap:wrap"></div>`);
  ['📅 会議中', '🚃 移動中', '🤒 体調不良', '🌴 休暇中', '🏠 在宅勤務', '🍱 昼休憩'].forEach(s => { const b = el('button', 'btn sm', s); b.onclick = () => $('[name=s]', body).value = s; $('div', body).append(b); });
  modal({ title: 'ステータスを設定', body, buttons: [{ label: 'クリア', fn: () => { u.status = ''; save(); renderAll(); } }, { label: '保存', primary: true, fn: () => { u.status = $('[name=s]', body).value.trim(); save(); renderAll(); toast('ステータスを更新しました'); } }] });
}
/* ---------- プロフィール（右パネル） ---------- */
function openProfile(userId) {
  ui.profile = userId;
  if (ui.thread) { ui.thread = null; renderThread(); }
  renderProfile();
}
let profileClock;
function renderProfile() {
  const p = $('#profilePanel');
  clearInterval(profileClock);
  if (!ui.profile || !S.users[ui.profile]) { ui.profile = null; p.hidden = true; p.innerHTML = ''; return; }
  const id = ui.profile, u = U(id), mine = id === S.me;
  const away = mine && S.away;
  const now = () => fmtTime(Date.now());
  const add = (label, field) => mine ? `<button class="pf-add" data-edit="${field}">${ic('plus')}<span>${esc(label)}</span></button>` : '';
  const editBtn = field => mine ? `<button class="pf-edit" data-edit="${field}">編集</button>` : '';
  const contact = (icon, label, val, href) => `<div class="pf-contact"><span class="pf-cicon">${ic(icon)}</span><div><div class="pf-clabel">${esc(label)}</div><a href="${esc(href)}">${esc(val)}</a></div></div>`;
  const photo = u.photo
    ? `<img src="${u.photo}" alt="">`
    : `<svg viewBox="0 0 280 280" aria-hidden="true"><circle cx="140" cy="105" r="62" fill="rgba(255,255,255,.93)"/><path d="M28 280c0-74 50-118 112-118s112 44 112 118z" fill="rgba(255,255,255,.93)"/></svg>`;
  p.hidden = false;
  p.innerHTML = `
    <div class="view-head" style="font-size:18px">プロフィール<span class="grow"></span><button class="icon-btn" data-a="close" title="閉じる (Esc)">${ic('x')}</button></div>
    <div class="pf-scroll">
      <div class="pf-photo" style="background:${u.color}">${photo}
        ${mine ? `<button class="pf-upload" data-a="upload">${u.photo ? '画像を変更' : '画像をアップロード'}</button>` : ''}
      </div>
      <div class="pf-sec pf-main">
        <div class="pf-namerow"><h2>${esc(u.name)}</h2>${editBtn('n')}</div>
        ${u.title ? `<div class="pf-title">${esc(u.title)}</div>` : ''}
        ${u.pron ? `<div class="pf-line pf-muted">${ic('mic')}<span>${esc(u.pron)}</span></div>` : add('名前の発音を追加する', 'pron')}
        ${u.status ? `<div class="pf-line">${esc(u.status)}</div>` : ''}
        <div class="pf-line"><span class="pf-dot${away ? ' away' : ''}"></span><span>${away ? '離席中' : 'アクティブ'}</span></div>
        <div class="pf-line">${ic('clock')}<span>現地時間 <span class="pf-time">${now()}</span></span></div>
        <div class="pf-btns">
          ${mine
            ? `<button class="btn" data-a="status">ステータスを設定</button><button class="btn" data-a="vis">表示条件${ic('down')}</button>`
            : `<button class="btn" data-a="dm">${ic('chat')}メッセージ</button>${u.bot ? '' : `<button class="btn" data-a="huddle">${ic('headphones')}ハドル</button>`}`}
          <button class="btn pf-more" data-a="more" title="その他">${ic('more')}</button>
        </div>
      </div>
      <div class="pf-sec">
        <div class="pf-sechead"><h3>連絡先情報</h3>${editBtn('email')}</div>
        ${u.email ? contact('mail', 'メールアドレス', u.email, 'mailto:' + u.email) : add('メールアドレス を追加する', 'email')}
        ${u.phone ? contact('phone', '電話', u.phone, 'tel:' + u.phone.replace(/[^\d+]/g, '')) : add('電話 を追加する', 'phone')}
        ${!mine && !u.email && !u.phone ? '<div class="pf-muted">連絡先は登録されていません</div>' : ''}
      </div>
      <div class="pf-sec">
        <div class="pf-sechead"><h3>自分の概要</h3>${editBtn('start')}</div>
        ${u.start ? `<div class="pf-line">${ic('cal')}<span>開始日 ${esc(u.start.replace(/-/g, '/'))}</span></div>` : add('開始日 を追加する', 'start')}
        ${!mine && !u.start ? '<div class="pf-muted">情報は登録されていません</div>' : ''}
      </div>
    </div>`;
  profileClock = setInterval(() => { const t = $('.pf-time', p); if (t) t.textContent = now(); }, 15000);
  const acts = {
    close: () => { ui.profile = null; renderProfile(); },
    upload: uploadPhoto,
    status: statusModal,
    vis: b => popMenu(b, [
      { header: true, label: '表示条件' },
      { label: (S.away ? '' : '✓ ') + 'アクティブ', fn: () => { S.away = false; save(); renderAll(); } },
      { label: (S.away ? '✓ ' : '') + '離席中', fn: () => { S.away = true; save(); renderAll(); } },
    ]),
    dm: () => openDM(id),
    huddle: () => { openDM(id); toggleHuddle(S.current); },
    more: b => popMenu(b, [
      ...(mine ? [{ label: 'プロフィールを編集', icon: 'edit', fn: () => profileModal() }] : []),
      ...(mine && u.photo ? [{ label: 'プロフィール画像を削除', icon: 'trash', danger: true, fn: () => { delete u.photo; save(); renderAll(); } }] : []),
      { label: 'メンバーIDをコピー', icon: 'copy', fn: () => navigator.clipboard?.writeText(id).then(() => toast('コピーしました'), () => toast('コピーできませんでした')) },
    ]),
  };
  $$('[data-a]', p).forEach(b => b.onclick = () => acts[b.dataset.a](b));
  $$('[data-edit]', p).forEach(b => b.onclick = () => profileModal(b.dataset.edit));
}
function uploadPhoto(onPick) {
  const f = el('input'); f.type = 'file'; f.accept = 'image/*';
  f.onchange = () => {
    const file = f.files[0]; if (!file) return;
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas'), n = 320; c.width = c.height = n;
      const s = Math.min(img.width, img.height);
      c.getContext('2d').drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, n, n);
      const data = c.toDataURL('image/jpeg', 0.85); URL.revokeObjectURL(img.src);
      if (typeof onPick === 'function') return onPick(data);
      me().photo = data;
      save(); renderAll(); toast('プロフィール画像を更新しました');
    };
    img.onerror = () => toast('画像を読み込めませんでした');
    img.src = URL.createObjectURL(file);
  };
  f.click();
}
const TIMEZONES = ['(UTC-08:00) 太平洋標準時（米国およびカナダ）', '(UTC-05:00) 東部標準時（米国およびカナダ）', '(UTC+00:00) ロンドン', '(UTC+01:00) パリ、ベルリン', '(UTC+08:00) 北京、シンガポール、台北', '(UTC+09:00) 大阪、札幌、東京', '(UTC+09:00) ソウル', '(UTC+10:00) シドニー'];
const AVATAR_SILHOUETTE = '<svg viewBox="0 0 100 100" class="pe-sil" aria-hidden="true"><circle cx="50" cy="38" r="18"/><path d="M8 100c2-24 20-38 42-38s40 14 42 38z"/></svg>';
function profileModal(focusField = 'n') {
  // 連絡先・自分の概要は本物と同じく別の小さい画面で編集する
  if (focusField === 'email' || focusField === 'phone') return contactModal(focusField);
  if (focusField === 'start') return aboutModal();
  const u = me();
  let photo = u.photo || null;
  const fld = (name, label, val, attrs = '', help = '') => `<label class="field pe-field"><span>${label}</span><input class="inp" name="${name}" value="${esc(val || '')}" ${attrs}>${help ? `<small>${help}</small>` : ''}</label>`;
  const body = el('div', 'pe-form', `
    <div class="pe-top">
      <div class="pe-left">
        ${fld('full', '氏名', u.fullName ?? u.name)}
        ${fld('n', '表示名', u.name, '', 'これは名字や名前、ニックネームなど、好きに設定できます。Slack でメンバーから呼ばれたい名前にしましょう。')}
        ${fld('title', 'タイトル', u.title, 'placeholder="タイトル"', `${esc(S.workspace)} でのあなたの役割を説明しましょう。`)}
        <div class="field pe-field"><span>名前の録音</span><button type="button" class="btn pe-rec">${ic('mic')}音声クリップを録音する</button></div>
      </div>
      <div class="pe-right">
        <div class="pe-label">プロフィール写真</div>
        <div class="pe-photo" style="background-color:${u.color}"></div>
        <button type="button" class="btn pe-upload">写真をアップロード</button>
        <button type="button" class="pe-remove" hidden>写真を削除</button>
      </div>
    </div>
    ${fld('pron', '名前の発音', u.pron, 'placeholder="浅田（読みは「あさだ」）"', '音声での読みや、名前の読みに似ているものの例を記入できます。')}
    <label class="field pe-field"><span>タイムゾーン</span><span class="pf-sel pe-tz"><select name="tz">${TIMEZONES.map(t => `<option${t === (u.tz || '(UTC+09:00) 大阪、札幌、東京') ? ' selected' : ''}>${esc(t)}</option>`).join('')}</select>${ic('down')}</span>
      <small>現在のタイムゾーン。サマリーや通知メールの送信、アクティビティフィードやリマインダーの時間に使われます。</small></label>`);
  const box = $('.pe-photo', body), rm = $('.pe-remove', body);
  const paint = () => {
    box.style.backgroundImage = photo ? `url(${photo})` : '';
    box.innerHTML = photo ? '' : AVATAR_SILHOUETTE;
    rm.hidden = !photo;
  };
  paint();
  $('.pe-upload', body).onclick = () => uploadPhoto(d => { photo = d; paint(); });
  rm.onclick = () => { photo = null; paint(); };
  $('.pe-rec', body).onclick = () => toast('研修用のため、音声の録音はできません');
  const m = modal({
    title: 'プロフィールを編集', body, focus: `[name=${focusField}]`, buttons: [{ label: 'キャンセル' }, {
      label: '変更を保存', primary: true, fn: () => {
        const v = k => $(`[name=${k}]`, body).value.trim();
        if (!v('n')) { $('[name=n]', body).focus(); toast('表示名を入力してください'); return false; }
        u.fullName = v('full'); u.name = v('n'); u.title = v('title'); u.pron = v('pron'); u.tz = $('[name=tz]', body).value;
        if (photo) u.photo = photo; else delete u.photo;
        save(); renderAll(); toast('プロフィールを更新しました');
      }
    }],
  });
  m.el.classList.add('profile-edit');
}
function contactModal(focusField = 'email') {
  const u = me();
  const body = el('div', 'pe-form', `
    <label class="field pe-field"><span>メールアドレス</span><input class="inp" name="email" type="email" value="${esc(u.email || '')}" placeholder="name@example.com"></label>
    <label class="field pe-field"><span>電話</span><input class="inp" name="phone" type="tel" value="${esc(u.phone || '')}" placeholder="090-1234-5678"></label>`);
  modal({
    title: '連絡先情報を編集', body, focus: `[name=${focusField}]`, buttons: [{ label: 'キャンセル' }, {
      label: '変更を保存', primary: true, fn: () => {
        const em = $('[name=email]', body);
        if (em.value.trim() && !em.checkValidity()) { em.focus(); toast('メールアドレスの形式が正しくありません'); return false; }
        u.email = em.value.trim(); u.phone = $('[name=phone]', body).value.trim();
        save(); renderAll(); toast('連絡先情報を更新しました');
      }
    }],
  });
}
function aboutModal() {
  const u = me();
  const body = el('div', 'pe-form', `<label class="field pe-field"><span>開始日</span><input class="inp" name="start" type="date" value="${esc(u.start || '')}"></label>`);
  modal({
    title: '自分の概要を編集', body, focus: '[name=start]', buttons: [{ label: 'キャンセル' }, {
      label: '変更を保存', primary: true, fn: () => { u.start = $('[name=start]', body).value; save(); renderAll(); toast('プロフィールを更新しました'); }
    }],
  });
}
/* 左上「会計」アイコン：ワークスペース切り替え（本物と同じ表示） */
function wsSwitcher(anchor) {
  closePop();
  const pop = el('div', 'pop ws-pop');
  pop.innerHTML = `
    <button class="ws-row ws-cur" data-a="cur"><span class="ws-ava">${esc([...S.workspace].slice(0, 2).join(''))}</span>
      <span class="ws-txt"><b>${esc(S.workspace)}</b><small>kaikei-kensyu.slack.com</small></span><span class="ws-key">Ctrl 1</span></button>
    <button class="ws-row" data-a="add"><span class="ws-ava ws-plus">${ic('plus')}</span><span class="ws-txt">ワークスペースを追加する</span></button>`;
  $('[data-a=cur]', pop).onclick = () => { closePop(); railGo('home'); };
  $('[data-a=add]', pop).onclick = () => { closePop(); addWorkspaceModal(); };
  $('#popLayer').append(pop);
  const r = anchor.getBoundingClientRect();
  pop.style.left = (r.left - 4) + 'px';
  pop.style.top = (r.top - 6) + 'px';
}
/* 「ワークスペースを追加する」画面 */
function addWorkspaceModal() {
  const rows = [
    { icon: 'userplus', label: '他のワークスペースにサインインする', fn: signInScreen },
    { icon: 'search', label: 'ワークスペースを検索する', msg: '研修用のため、ワークスペースは検索できません' },
    { icon: 'plus', label: 'ワークスペースを新規作成する', msg: '研修用のため、ワークスペースは新規作成できません' },
  ];
  const body = el('div', 'aw-list');
  const m = modal({ title: 'ワークスペースを追加する', body, buttons: [] });
  m.el.classList.add('aw-modal');
  rows.forEach(r => {
    const b = el('button', 'aw-row', `<span class="aw-ic">${ic(r.icon)}</span><span>${esc(r.label)}</span>`);
    b.onclick = () => { m.close(); r.fn ? r.fn() : toast(r.msg); };
    body.append(b);
  });
}
/* ---------- アカウント（Supabase Auth：メールアドレス＋パスワード） ----------
   アカウントは管理者が発行します（scripts\admin-users.ps1）。サイトからの新規登録はできません。 */
const PW_MIN = 8;
const authErrorText = e => {
  const m = (e?.message || '').toLowerCase();
  if (m.includes('invalid login')) return 'メールアドレスまたはパスワードが正しくありません。';
  if (m.includes('should be different')) return '新しいパスワードは今のパスワードと別のものにしてください。';
  if (m.includes('password')) return `パスワードは ${PW_MIN} 文字以上で、推測されにくいものにしてください。`;
  if (m.includes('rate') || m.includes('too many')) return '試行回数が多すぎます。しばらく待ってからもう一度お試しください。';
  if (m.includes('fetch') || m.includes('network')) return '通信できませんでした。インターネット接続を確認してください。';
  return '処理できませんでした。時間をおいてもう一度お試しください。';
};
/* パスワード変更（サイドバー上部メニュー／初回サインイン時の仮パスワード変更） */
function passwordModal({ forced = false } = {}) {
  if (!authUser) return;
  const body = el('div', '', `
    <p class="hint-text" style="margin:0 0 14px">${forced ? '管理者が発行した<b>仮パスワード</b>でサインインしています。自分だけが知っている新しいパスワードに変更してください。' : `アカウント：<b>${esc(authUser.email)}</b>`}</p>
    ${forced ? '' : '<label class="field"><span>現在のパスワード</span><input class="inp" type="password" name="cur" autocomplete="current-password"></label>'}
    <label class="field"><span>新しいパスワード</span><input class="inp" type="password" name="ap" placeholder="${PW_MIN} 文字以上" autocomplete="new-password"></label>
    <label class="field"><span>新しいパスワード（確認）</span><input class="inp" type="password" name="ap2" autocomplete="new-password"></label>`);
  let busy = false;
  const m = modal({
    title: forced ? '新しいパスワードを設定' : 'パスワードを変更', body,
    buttons: [...(forced ? [{ label: 'あとで' }] : [{ label: 'キャンセル' }]), {
      label: '変更する', primary: true, fn: () => {
        const p = $('[name=ap]', body), p2 = $('[name=ap2]', body), cur = $('[name=cur]', body);
        if (cur && !cur.value) { cur.focus(); toast('現在のパスワードを入力してください'); return false; }
        if (p.value.length < PW_MIN) { p.focus(); toast(`パスワードは ${PW_MIN} 文字以上にしてください`); return false; }
        if (p.value !== p2.value) { p2.focus(); toast('確認用のパスワードが一致しません'); return false; }
        if (busy) return false;
        busy = true;
        (async () => {
          try {
            if (cur) {
              const { error } = await SB.auth.signInWithPassword({ email: authUser.email, password: cur.value });
              if (error) { toast('現在のパスワードが正しくありません'); return; }
            }
            const { data, error } = await SB.auth.updateUser({ password: p.value, data: { must_change_password: false } });
            if (error) { toast(authErrorText(error)); return; }
            authUser = data.user;
            toast('パスワードを変更しました'); m.close();
          } finally { busy = false; }
        })();
        return false; // 非同期で確認してから閉じる
      }
    }],
    focus: forced ? '[name=ap]' : '[name=cur]',
  });
}
const accountModal = () => passwordModal();
/* 自分メニュー「以下からサインアウト」 */
async function signOut() {
  closePop();
  if (ui.huddle) { try { toggleHuddle(ui.huddle.ch); } catch {} }
  await flushSave();
  await SB?.auth.signOut();
  location.reload(); // 画面上のデータを残さないよう読み込み直す（サインイン画面から始まる）
}
// サインイン完了後：本人のデータを読み込んで画面を表示
async function enterWorkspace(user) {
  authUser = user;
  try { await loadRemote(user); }
  catch (e) {
    console.error(e);
    authUser = null;
    await SB.auth.signOut().catch(() => {});
    document.body.classList.remove('booting');
    signInScreen('workspace', { locked: true });
    toast('データを読み込めませんでした。時間をおいてもう一度サインインしてください');
    return false;
  }
  applyTheme();
  ui.view = { type: 'channel', id: null };
  openChannel(getCh(S.current) ? S.current : S.channels.find(c => c.type === 'channel')?.id || 'c1');
  renderAll();
  document.body.classList.remove('booting');
  if (user.user_metadata?.must_change_password) setTimeout(() => passwordModal({ forced: true }), 400);
  return true;
}
async function finishSignIn(scr, user) {
  scr.remove();
  if (await enterWorkspace(user)) toast('サインインしました');
}
// 起動：保存済みのセッションがあればそのまま入る。なければサインイン画面
async function boot() {
  if (!SB) {
    document.body.classList.remove('booting');
    document.body.innerHTML = '<div style="padding:40px;font:16px sans-serif">サーバーに接続するためのプログラムを読み込めませんでした。インターネット接続を確認して、ページを再読み込みしてください。</div>';
    return;
  }
  const { data: { session } } = await SB.auth.getSession();
  if (session?.user) await enterWorkspace(session.user);
  else { document.body.classList.remove('booting'); signInScreen('workspace', { locked: true }); }
  // 別のタブでサインアウトした場合などはこのタブも閉じる
  SB.auth.onAuthStateChange(ev => { if (ev === 'SIGNED_OUT' && authUser) location.reload(); });
}
/* 「他のワークスペースにサインインする」：全画面のサインイン画面
   locked: true のときはサインアウト後の画面（閉じられない・本当にサインインする） */
function signInScreen(startMode = 'signin', { locked = false } = {}) {
  $('#signinScreen')?.remove();
  const scr = el('div', 'si-screen' + (locked ? ' locked' : ''));
  scr.id = 'signinScreen';
  const close = () => { if (locked) return; scr.remove(); document.removeEventListener('keydown', onKey, true); };
  const onKey = e => { if (e.key === 'Escape' && !locked) { e.stopPropagation(); close(); } };
  document.addEventListener('keydown', onKey, true);
  // mode: 'signin'（サインイン）／'signup'（アカウントを作成する）
  const step1 = (mode = 'signin') => {
    const up = mode === 'signup';
    const ws = mode === 'workspace';
    const formHTML = `        <form class="si-form" novalidate>
          <input class="si-inp" type="email" name="email" placeholder="名前@work-email.com" autocomplete="off">
          <div class="si-err" hidden>メールアドレスを正しく入力してください。</div>
          <button class="si-primary" type="submit">${up ? '続行する' : 'メールアドレスでサインインする'}</button>
        </form>
`;
    const orHTML = `<div class="si-or"><span>${ws ? 'あるいは' : up ? 'その他の方法' : '次の方法でサインインする：'}</span></div>`;
    const altHTML = `        <div class="si-alt">
          <button data-p="Google"><svg class="si-logo-ic" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg><span>Google</span></button>
          <button data-p="Microsoft"><svg class="si-logo-ic" viewBox="0 0 21 21" aria-hidden="true"><path fill="#F25022" d="M0 0h10v10H0z"/><path fill="#7FBA00" d="M11 0h10v10H11z"/><path fill="#00A4EF" d="M0 11h10v10H0z"/><path fill="#FFB900" d="M11 11h10v10H11z"/></svg><span>Microsoft</span></button>
          <button data-p="Apple"><svg class="si-logo-ic si-apple" viewBox="0 0 814 1000" aria-hidden="true"><path fill="currentColor" d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/></svg><span>Apple</span></button>
        </div>
`;
    const wsBody = altHTML + orHTML + formHTML +
      `<div class="si-magic"><span class="si-spark">✨</span><span>パスワードなしでサインインできるマジックコードをメールで送信します。<button data-a="pw">代わりにパスワードでサインインする</button>こともできます。</span></div>`;
    scr.innerHTML = `
      ${locked ? '<span></span>' : `<button class="si-back" data-a="back">${ic('left')}<span>${esc(S.workspace)} に戻る</span></button>`}
      <div class="si-wrap">
        <div class="si-logo"><span class="si-mark">会計</span><span>研修ワークスペース</span></div>
        <h1>${ws ? `<span class="si-wsname">${esc(S.workspace)}</span> にサインインする` : up ? '最初にメールアドレスを入力してください' : 'サインインするにはメールアドレスを入力してください'}</h1>
        <p class="si-sub">${ws ? 'kaikei-kensyu.slack.com' : up ? '<b>仕事用のメールアドレス</b>をおすすめします。' : 'アプリはすぐに再度使用できるようになります。'}</p>
${ws ? wsBody : formHTML + orHTML + altHTML}
        ${ws ? '' : up
          ? `<label class="si-check"><input type="checkbox" checked><span>製品、サービス、イベントに関する最新情報をメールで受け取る（配信はいつでも停止できます）</span></label>
             <p class="si-terms">続行することにより、研修用ワークスペースの利用ルールに同意したものとみなされます。さらに詳細な情報が、<button data-a="help">プライバシーポリシー</button>と <button data-a="help">Cookie ポリシー</button>に開示されています。</p>`
          : `<p class="si-trouble">うまくいかない場合は、<button data-a="help">ワークスペースの URL を入力してみてください</button></p>`}
        <p class="si-legal">${locked ? '研修用：アカウント情報はこのブラウザの中にだけ保存されます。' : '研修用の練習画面です。入力内容はどこにも送信・保存されません。'}</p>
      </div>
      ${ws ? '<div class="si-banner">このページを見るためにはサインインする必要があります。</div>' : ''}
      <div class="si-new"${ws && !locked ? ' hidden' : ''}>${up ? 'すでに Slack を使っていますか？<button data-a="signin">サインインする</button>' : 'Slack を使うのは初めてですか？<button data-a="signup">アカウントを作成する</button>'}</div>
      <footer class="si-foot"><button data-a="help">プライバシーと利用規約</button><button data-a="help">お問い合わせ</button><button data-a="help"><svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 0 20M12 2a15.3 15.3 0 0 0 0 20"/></svg>地域を変更${ic('down')}</button></footer>`;
    const form = $('.si-form', scr), inp = $('[name=email]', scr), err = $('.si-err', scr);
    form.onsubmit = e => {
      e.preventDefault();
      const v = inp.value.trim();
      if (!v || !inp.checkValidity()) { err.hidden = false; inp.classList.add('bad'); inp.focus(); return; }
      // サインアウト後：メールのコードは届かないので、パスワード入力へ進む
      if (locked) return up ? stepSignup(v) : stepPw(v);
      step2(v, mode);
    };
    inp.oninput = () => { err.hidden = true; inp.classList.remove('bad'); };
    $$('[data-p]', scr).forEach(b => b.onclick = () => toast(`研修用のため、${b.dataset.p} では${up ? '登録' : 'サインイン'}できません`));
    $('[data-a=pw]', scr)?.addEventListener('click', () => locked ? stepPw(inp.value.trim()) : toast('研修用のため、パスワードでのサインインはできません'));
    $('[data-a=signup]', scr)?.addEventListener('click', () => locked ? stepSignup() : step1('signup'));
    $('[data-a=signin]', scr)?.addEventListener('click', () => step1(locked ? 'workspace' : 'signin'));
    $$('[data-a=help]', scr).forEach(b => b.onclick = () => toast('研修用のため、このページは開けません'));
    $('[data-a=back]', scr)?.addEventListener('click', close);
    setTimeout(() => inp.focus(), 30);
  };
  // パスワードでサインイン
  const stepPw = (email = '') => {
    $('.si-wrap', scr).innerHTML = `
      <div class="si-logo"><span class="si-mark">会計</span><span>研修ワークスペース</span></div>
      <h1><span class="si-wsname">${esc(S.workspace)}</span> にサインインする</h1>
      <p class="si-sub">メールアドレスとパスワードを入力してください。</p>
      <form class="si-form si-pwform" novalidate>
        <input class="si-inp" type="email" name="email" placeholder="名前@work-email.com" value="${esc(email)}" autocomplete="username">
        <input class="si-inp" type="password" name="pw" placeholder="パスワード" autocomplete="current-password">
        <div class="si-err" hidden></div>
        <button class="si-primary" type="submit">サインイン</button>
      </form>
      <p class="si-trouble"><button data-a="forgot">パスワードをお忘れですか？</button></p>
      <p class="si-trouble">アカウントをお持ちでないですか？ <button data-a="signup2">アカウントを作成する</button></p>`;
    const f = $('.si-pwform', scr), em = $('[name=email]', f), pw = $('[name=pw]', f), err = $('.si-err', f);
    const fail = msg => { err.textContent = msg; err.hidden = false; };
    f.onsubmit = async e => {
      e.preventDefault();
      if (!em.value.trim() || !em.checkValidity()) { fail('メールアドレスを正しく入力してください。'); return em.focus(); }
      if (!pw.value) { fail('パスワードを入力してください。'); return pw.focus(); }
      const btn = $('.si-primary', f); btn.disabled = true; btn.textContent = 'サインインしています…';
      const { data, error } = await SB.auth.signInWithPassword({ email: em.value.trim(), password: pw.value });
      btn.disabled = false; btn.textContent = 'サインイン';
      if (error) { fail(authErrorText(error)); pw.value = ''; return pw.focus(); }
      finishSignIn(scr, data.user);
    };
    [em, pw].forEach(x => x.oninput = () => { err.hidden = true; });
    $('[data-a=forgot]', scr).onclick = () => stepReset(em.value.trim());
    $('[data-a=signup2]', scr).onclick = () => stepSignup(em.value.trim());
    setTimeout(() => (email ? pw : em).focus(), 30);
  };
  // パスワードを忘れた場合：管理者が仮パスワードを再発行する
  const stepReset = () => {
    $('.si-wrap', scr).innerHTML = `
      <div class="si-logo"><span class="si-mark">会計</span><span>研修ワークスペース</span></div>
      <h1>パスワードをお忘れですか？</h1>
      <p class="si-sub">管理者に連絡して、<b>仮パスワードの再発行</b>を依頼してください。<br>仮パスワードでサインインすると、新しいパスワードの設定画面が表示されます。</p>
      <button class="si-primary" data-a="back2">サインイン画面に戻る</button>`;
    $('[data-a=back2]', scr).onclick = () => stepPw();
  };
  // アカウントを作成する（メールアドレス確認なし：登録するとそのままサインイン）
  const stepSignup = (email = '') => {
    $('.si-wrap', scr).innerHTML = `
      <div class="si-logo"><span class="si-mark">会計</span><span>研修ワークスペース</span></div>
      <h1>アカウントを作成する</h1>
      <p class="si-sub">メールアドレスとパスワードを入力してください。</p>
      <form class="si-form si-pwform" novalidate>
        <input class="si-inp" type="email" name="email" placeholder="名前@work-email.com" value="${esc(email)}" autocomplete="username">
        <input class="si-inp" type="password" name="pw" placeholder="パスワード（${PW_MIN} 文字以上）" autocomplete="new-password">
        <input class="si-inp" type="password" name="pw2" placeholder="パスワード（確認）" autocomplete="new-password">
        <div class="si-err" hidden></div>
        <button class="si-primary" type="submit">アカウントを作成する</button>
      </form>
      <p class="si-trouble">すでにアカウントをお持ちですか？ <button data-a="back2">サインインする</button></p>`;
    const f = $('.si-pwform', scr), err = $('.si-err', f), fail = m => { err.textContent = m; err.hidden = false; };
    const em = $('[name=email]', f), p1 = $('[name=pw]', f), p2 = $('[name=pw2]', f);
    f.onsubmit = async e => {
      e.preventDefault();
      if (!em.value.trim() || !em.checkValidity()) { fail('メールアドレスを正しく入力してください。'); return em.focus(); }
      if (p1.value.length < PW_MIN) { fail(`パスワードは ${PW_MIN} 文字以上にしてください。`); return p1.focus(); }
      if (p1.value !== p2.value) { fail('確認用のパスワードが一致しません。'); return p2.focus(); }
      const btn = $('.si-primary', f); btn.disabled = true; btn.textContent = '作成しています…';
      const { data, error } = await SB.auth.signUp({ email: em.value.trim(), password: p1.value });
      btn.disabled = false; btn.textContent = 'アカウントを作成する';
      if (error) {
        const m = (error.message || '').toLowerCase();
        return fail(m.includes('already') ? 'このメールアドレスは既に登録されています。サインインしてください。' : authErrorText(error));
      }
      // 既に登録済みのアドレスの場合、Supabase はエラーにせず空の identities を返す
      if (!data.session || !data.user?.identities?.length) return fail('このメールアドレスは既に登録されています。サインインしてください。');
      finishSignIn(scr, data.user);
    };
    [em, p1, p2].forEach(x => x.oninput = () => { err.hidden = true; });
    $('[data-a=back2]', scr).onclick = () => stepPw(em.value.trim());
    setTimeout(() => (email ? p1 : em).focus(), 30);
  };
  const step2 = (email, mode) => {
    $('.si-wrap', scr).innerHTML = `
      <div class="si-logo"><span class="si-mark">会計</span><span>研修ワークスペース</span></div>
      <h1>コードをメールで確認してください</h1>
      <p class="si-sub"><b>${esc(email)}</b> に 6 桁のコードを送信したという想定の練習画面です。<br>研修用のため、実際にはメールは届きません。</p>
      <div class="si-code">${'<input maxlength="1" inputmode="numeric">'.repeat(6)}</div>
      <button class="si-primary" data-a="done">${esc(S.workspace)} に戻る</button>
      <button class="si-link" data-a="again">別のメールアドレスを使う</button>`;
    const boxes = $$('.si-code input', scr);
    boxes.forEach((b, i) => {
      b.oninput = () => { b.value = b.value.replace(/\D/g, ''); if (b.value && boxes[i + 1]) boxes[i + 1].focus(); if (boxes.every(x => x.value)) toast('研修用のため、コードの確認は行われません'); };
      b.onkeydown = e => { if (e.key === 'Backspace' && !b.value && boxes[i - 1]) boxes[i - 1].focus(); };
    });
    $('[data-a=done]', scr).onclick = close;
    $('[data-a=again]', scr).onclick = () => step1(mode);
    boxes[0].focus();
  };
  step1(startMode);
  if (locked) stepPw(); // 本番：サインアウト後はメールアドレス＋パスワードで直接サインイン
  document.body.append(scr);
}
function wsMenu(anchor) {
  popMenu(anchor, [
    { html: `<div class="menu-profile"><span class="avatar" style="background:#e5e5e5;color:#3a0f3c">${esc([...S.workspace].slice(0, 2).join(''))}</span><div><b>${esc(S.workspace)}</b><div style="font-size:13px;color:var(--muted)">フリープラン（研修用）</div></div></div>` },
    { sep: true },
    { label: 'ワークスペース名を変更', icon: 'edit', fn: () => { const body = el('div', '', `<label class="field"><span>ワークスペース名</span><input class="inp" name="w" value="${esc(S.workspace)}"></label>`); modal({ title: 'ワークスペース名を変更', body, buttons: [{ label: 'キャンセル' }, { label: '保存', primary: true, fn: () => { const v = $('[name=w]', body).value.trim(); if (!v) return false; S.workspace = v; save(); renderAll(); } }] }); } },
    { label: 'チャンネルを作成', icon: 'plus', fn: addChannelModal },
    { label: 'メンバーを招待', icon: 'users', fn: inviteModal },
    { label: 'プランをアップグレード', icon: 'rocket', fn: plansModal },
    { label: 'パスワードを変更', icon: 'lock', fn: () => passwordModal() },
    { sep: true },
    { label: 'データを初期状態に戻す', icon: 'trash', danger: true, fn: resetData },
  ]);
}
function inviteModal() {
  modal({
    title: `${S.workspace} にメンバーを招待する`,
    body: '<p>このワークスペースは各自の練習用です。</p><p class="hint-text">サイトの URL を伝えれば、相手はサインイン画面の「アカウントを作成する」から自分で登録できます。</p>',
  });
}
function helpModal() {
  modal({
    title: 'ヘルプ・ショートカット',
    body: `<ul style="line-height:2;padding-left:20px;margin:0">
      <li><b>Enter</b>：送信 ／ <b>Shift + Enter</b>：改行</li>
      <li><b>Ctrl + B / I / U</b>：太字・斜体・下線、<b>Ctrl + Shift + X</b>：取り消し線</li>
      <li><b>@</b>：メンション（↑↓で選択、Enterで確定）</li>
      <li><b>Ctrl + K</b>：検索 ／ <b>Esc</b>：スレッド・メニューを閉じる</li>
      <li><b>Alt + ↑ / ↓</b>：前後のチャンネルへ移動</li>
      <li>入力欄が空のとき <b>↑</b>：直前の自分のメッセージを編集</li>
      <li>ファイルは入力欄にドラッグ＆ドロップ、または貼り付けで添付</li>
      <li>サイドバーのチャンネルを右クリック：メニュー表示</li>
      <li>チャンネルを「スター付き」へドラッグ：スターを付ける</li>
      <li><code>/shrug</code> <code>/topic 説明</code> <code>/todo 内容</code> <code>/away</code></li>
    </ul><p class="hint-text">データはサーバーに保存され、同じアカウントならどの端末からでも続きを使えます。</p>`,
  });
}
function resetData() {
  modal({
    title: 'データを初期状態に戻す', body: '<p>送信したメッセージ・チャンネル・設定がすべて消え、初期状態に戻ります。よろしいですか？</p>',
    buttons: [{ label: 'キャンセル' }, { label: '初期化する', danger: true, fn: () => {
      const u = me();
      S = seed({ name: u.name, email: u.email || authUser?.email }); normalizeState();
      save(); flushSave().then(() => location.reload());
    } }],
  });
}
function toggleTheme() { S.theme = S.theme === 'dark' ? 'light' : 'dark'; if (S.prefs) S.prefs.colorMode = S.theme; applyTheme(); save(); renderRail(); }
function applyTheme() {
  document.documentElement.dataset.theme = S.theme;
  applyLook();
  // アクセシビリティ設定の反映（拡大/縮小・リンク下線・アニメーション・シンプルレイアウト）
  const p = S.prefs || {};
  document.body.classList.toggle('a11y-underline', !!p.linkUnderline);
  document.body.classList.toggle('a11y-noanim', p.allowAnim === false);
  document.body.classList.toggle('simple-layout', !!p.simpleLayout);
}

/* ---------- 初期化・イベント ---------- */
function bind() {
  hydrateIcons();
  $$('.rail-item').forEach(b => b.onclick = () => {
    const r = b.dataset.rail;
    if (r === 'home') return openChannel(S.current && getCh(S.current) ? S.current : S.channels[0].id);
    if (r === 'bot') return openChannel('d_bot');
    go({ type: r });
  });
  $$('#sbHome .sb-nav .sb-row').forEach(b => b.onclick = () => go({ type: b.dataset.view }));
  $$('#sbFiles [data-fsub]').forEach(b => b.onclick = () => go({ type: 'files', sub: b.dataset.fsub }));
  $('#sbFilesAdd').onclick = e => popMenu(e.currentTarget, [
    { label: 'canvas を作成する', icon: 'canvasnote', fn: () => openCanvas(S.current && getCh(S.current) ? S.current : S.channels[0].id) },
    { label: 'ファイルをアップロードする', icon: 'download', fn: () => { openChannel(S.current && getCh(S.current) ? S.current : S.channels[0].id); setTimeout(() => $('#main .composer input[type=file]')?.click()); } },
  ]);
  $$('.sb-sec-head').forEach(h => h.onclick = () => { const s = h.parentElement.dataset.sec; S.collapsed[s] = !S.collapsed[s]; save(); renderSidebar(); });
  // スター付きへドラッグ＆ドロップ
  const starBody = $('#starredList');
  starBody.addEventListener('dragover', e => { if (e.dataTransfer.types.includes('text/ch')) { e.preventDefault(); starBody.classList.add('drop-on'); } });
  starBody.addEventListener('dragleave', () => starBody.classList.remove('drop-on'));
  starBody.addEventListener('drop', e => { e.preventDefault(); starBody.classList.remove('drop-on'); const ch = getCh(e.dataTransfer.getData('text/ch')); if (ch) { ch.starred = true; save(); renderAll(); toast('スターを付けました'); } });

  $('#sbFilter').oninput = e => { ui.filter = e.target.value; renderSidebar(); };
  $('#sbFilter').onkeydown = e => { if (e.key === 'Enter') { const first = $('#sidebar .sb-sec-body .sb-row[data-ch]'); if (first) { first.click(); e.target.value = ''; ui.filter = ''; renderSidebar(); } } };
  $('#upgradeBtn').onclick = plansModal;
  $('#sbCompose').onclick = composeModal;
  $('#sbSettings').onclick = e => wsMenu(e.currentTarget);
  $('#wsName').onclick = e => wsMenu(e.currentTarget);
  $('#wsIcon').onclick = e => wsSwitcher(e.currentTarget);
  $('#railAdd').onclick = e => createMenu(e.currentTarget);
  $('#themeBtn').onclick = toggleTheme;
  $('#meBtn').onclick = e => meMenu(e.currentTarget);
  $('#helpBtn').onclick = helpModal;
  $('#aiBtn').onclick = () => $('#rail [data-rail="bot"]').click();
  setupWindowControls();
  $('#menuBtn').onmousedown = e => { e.preventDefault(); e.stopPropagation(); };
  $('#menuBtn').onclick = e => { if ($('#popLayer .app-menu')) return closePop(); appMenu(e.currentTarget); };
  applyZoom();
  applyColorMode();
  $('#backBtn').onclick = () => { if (ui.histPos > 0) { ui.histPos--; go(ui.hist[ui.histPos], { push: false }); } };
  $('#fwdBtn').onclick = () => { if (ui.histPos < ui.hist.length - 1) { ui.histPos++; go(ui.hist[ui.histPos], { push: false }); } };
  $('#historyBtn').onclick = e => {
    const seen = []; const items = [{ label: '最近の履歴', header: true }];
    [...ui.hist].reverse().forEach(v => {
      const key = v.type + (v.id || v.q || ''); if (seen.includes(key) || seen.length >= 10) return; seen.push(key);
      const label = v.type === 'channel' ? (getCh(v.id) ? (getCh(v.id).type === 'channel' ? '# ' : '') + chLabel(getCh(v.id)) : null) : ({ threads: 'スレッド', huddles: 'ハドル', drafts: '下書き＆送信済み', bookmarks: 'ブックマーク', directory: 'ディレクトリ', dms: 'DM', activity: 'アクティビティ', files: 'ファイル', todo: 'To-Do', apps: 'エージェントとツール', search: '検索: ' + v.q })[v.type];
      if (label) items.push({ label, fn: () => go(v) });
    });
    popMenu(e.currentTarget, items);
  };
  const gs = $('#globalSearch');
  gs.onkeydown = e => { if (e.key === 'Enter' && !e.isComposing) { runSearch(gs.value); gs.blur(); } if (e.key === 'Escape') gs.blur(); };

  document.addEventListener('mousedown', e => { if (!e.target.closest('#popLayer')) closePop(); });
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); gs.focus(); gs.select(); }
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'n') { e.preventDefault(); closePop(); composeModal(); }
    if ((e.ctrlKey || e.metaKey) && !e.altKey) {
      if (e.key === '0') { e.preventDefault(); setZoom(0); }
      if (e.key === '+' || e.key === '=' || e.key === ';') { e.preventDefault(); setZoom(1); }
      if (e.key === '-') { e.preventDefault(); setZoom(-1); }
      if (e.key === ',') { e.preventDefault(); closePop(); prefsModal(); }
      if (e.shiftKey && e.key.toLowerCase() === 'd') { e.preventDefault(); toggleSidebar(); }
    }
    if (e.altKey && !e.ctrlKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight') && !/INPUT|TEXTAREA/.test(document.activeElement?.tagName) && !document.activeElement?.isContentEditable) {
      e.preventDefault(); $(e.key === 'ArrowLeft' ? '#backBtn' : '#fwdBtn').click();
    }
    if (e.key === 'Escape') {
      if ($('#popLayer').children.length) return closePop();
      if (ui.thread) { ui.thread = null; renderThread(); }
      if (ui.profile) { ui.profile = null; renderProfile(); }
      document.body.classList.remove('sb-open');
    }
    if (e.altKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
      e.preventDefault();
      const ids = $$('#sidebar .sb-row[data-ch]').map(b => b.dataset.ch);
      const i = ids.indexOf(ui.view.id);
      const n = ids[(i + (e.key === 'ArrowDown' ? 1 : -1) + ids.length) % ids.length];
      if (n) openChannel(n);
    }
  });
  window.addEventListener('resize', closePop);
  // ユーザーがホイール操作したときだけメニューを閉じる（自動スクロールでは閉じない）
  document.addEventListener('wheel', e => { if (!e.target.closest?.('#popLayer')) closePop(); }, { capture: true, passive: true });
  // 時刻表示（今日/昨日）を定期更新
  setInterval(() => { if (ui.view.type === 'channel' && !document.querySelector('#main .msg .composer')) renderSidebar(); }, 60000);
}

// 本番：サインインが確認できるまで画面を隠し、Supabase から本人のデータを読み込む
document.body.classList.add('booting');
applyTheme();
bind();
openChannel('c1');
boot();
