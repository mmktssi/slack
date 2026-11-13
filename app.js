'use strict';
/* =========================================================
   Slack風 研修用チャットUI
   データはブラウザの localStorage に保存されます
   ========================================================= */

const STORE_KEY = 'slack-kensyu-v2';
const DAY = 86400000;
const WEEK = ['日', '月', '火', '水', '木', '金', '土'];

/* ---------- アイコン ---------- */
const ICONS = {
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  left: '<path d="m12 19-7-7 7-7M19 12H5"/>',
  right: '<path d="M5 12h14m-7-7 7 7-7 7"/>',
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

/* ---------- 初期データ ---------- */
function seed() {
  const now = Date.now();
  const t = (daysAgo, h, m) => { const d = new Date(now - daysAgo * DAY); d.setHours(h, m, 0, 0); return d.getTime(); };
  const msg = (user, ts, html, extra = {}) => ({ id: uid(), user, ts, html, reactions: {}, replies: [], files: [], ...extra });
  const users = {
    me: { id: 'me', name: '自分', color: '#e01e5a', title: '会計事業部 メンバー', status: '' },
    u1: { id: 'u1', name: 'テスト1', color: '#1264a3', title: '経理担当', status: '🏢 出社中' },
    u2: { id: 'u2', name: 'テスト2', color: '#2eb67d', title: '事務局', status: '' },
    u3: { id: 'u3', name: 'テスト3', color: '#e8912d', title: '営業', status: '🚃 移動中' },
    u4: { id: 'u4', name: 'テスト4', color: '#9b59b6', title: '社長室', status: '' },
    bot: { id: 'bot', name: 'Slackbot', color: '#4a154b', title: 'ボット', bot: true, status: '' },
  };
  const all = ['me', 'u1', 'u2', 'u3', 'u4'];
  const channels = [
    { id: 'c1', type: 'channel', name: 'テストチャンネル1', members: all, topic: '全体連絡用チャンネルです', starred: false, muted: false, private: false, canvas: { title: '', body: '' } },
    { id: 'c2', type: 'channel', name: 'テストチャンネル2', members: all, topic: '毎月の引き落とし予定額の確認資料を共有します', starred: false, muted: false, private: false, canvas: { title: '', body: '' } },
    { id: 'c3', type: 'channel', name: 'テストチャンネル3', members: all, topic: '未納状況の報告', starred: false, muted: false, private: false, canvas: { title: '', body: '' } },
    { id: 'd_bot', type: 'dm', name: '', members: ['me', 'bot'], starred: false, muted: false, canvas: { title: '', body: '' } },
    { id: 'd_u1', type: 'dm', name: '', members: ['me', 'u1'], starred: false, muted: false, canvas: { title: '', body: '' } },
    { id: 'd_u2', type: 'dm', name: '', members: ['me', 'u2'], starred: false, muted: false, canvas: { title: '', body: '' } },
    { id: 'd_me', type: 'dm', name: '', members: ['me'], starred: false, muted: false, canvas: { title: '', body: '' } },
  ];
  const xlsx = { id: uid(), name: 'R.8　引き落とし予定額 確認資料 (2).xlsx', size: 48213, mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', sample: 'sheet' };
  const general = [
    msg('u2', t(9, 9, 12), '皆さんおはようございます！今月もよろしくお願いします🙇‍♀️', { reactions: { '👍': ['u1', 'u3'], '🙇': ['u4'] } }),
    msg('u1', t(9, 9, 30), '今月の締め日は<b>25日</b>です。請求書の提出をお忘れなく。'),
    msg('u4', t(5, 14, 2), '来週の定例会議は水曜 15:00 からに変更になりました。', {
      replies: [
        msg('u3', t(5, 14, 20), '承知しました！'),
        msg('u2', t(5, 14, 41), '会議室を予約しておきます📌'),
      ],
    }),
    msg('u1', t(2, 20, 57), '', { sub: 'Excel スプレッドシート', files: [xlsx] }),
  ];
  const c2 = [
    msg('u2', t(4, 10, 5), '確認資料をアップロードしました。各担当の欄を確認して<span class="mention" data-uid="me">@自分</span> さん、チェックをお願いします。'),
    msg('u3', t(4, 11, 40), '<ul><li>テスト5さん分 → 確認済み</li><li>テスト6さん分 → 確認中</li></ul>'),
  ];
  const c3 = [
    msg('u4', t(3, 16, 0), '<b>【全体連絡】</b>未納が発生している件について、各担当者は今週中に状況を報告してください。', { reactions: { '✅': ['u1', 'u2', 'u3'] } }),
  ];
  const botDm = [
    msg('bot', t(10, 9, 0), 'ようこそ！ここは研修用のSlack風ワークスペースです 🎉<br>メッセージ送信、スレッド返信、リアクション、ファイル添付、検索などを自由に試してみてください。<br>わからないことがあれば、ここに「ヘルプ」と送ってみてください。'),
  ];
  const dmU1 = [
    msg('u1', t(1, 18, 22), 'お疲れさまです。明日の資料、確認できたら教えてください！'),
  ];
  const meDm = [
    msg('me', t(6, 8, 0), 'ここは自分用のメモスペースです。<br>To-Doや下書きを残しておくのに便利です。'),
  ];
  return {
    v: 1, me: 'me', workspace: '会計事業部', theme: 'light', users, channels,
    messages: { c1: general, c2, c3, d_bot: botDm, d_u1: dmU1, d_u2: [], d_me: meDm },
    lastRead: { c1: t(3, 0, 0), c2: now, c3: t(4, 0, 0), d_bot: now, d_u1: t(2, 0, 0), d_u2: now, d_me: now },
    current: 'c1', drafts: {}, todos: [
      { id: uid(), text: '引き落とし予定額の確認資料をチェック', done: false },
      { id: uid(), text: '未納報告を社長室へ提出', done: false },
    ],
    activity: [], bannerClosed: {}, collapsed: {}, away: false,
  };
}

let S;
function load() {
  try { S = JSON.parse(localStorage.getItem(STORE_KEY)); } catch { S = null; }
  if (!S || S.v !== 1) S = seed();
  S.trash = S.trash || [];               // 削除済みファイル
  S.starredFiles = S.starredFiles || []; // スター付きファイル（キー）
}
function save() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(S)); }
  catch (e) { toast('保存容量を超えました。大きなファイルを削除してください'); }
}

/* ---------- 画面状態（保存しない） ---------- */
const ui = {
  view: { type: 'channel', id: null },
  tab: 'messages',
  thread: null,        // { ch, id }
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
}

function renderRail() {
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
  // ナビ
  $$('.sb-nav .sb-row').forEach(b => b.classList.toggle('active', ui.view.type === b.dataset.view));
  // スター付き
  const starred = S.channels.filter(c => c.starred && match(c));
  const sl = $('#starredList'); sl.innerHTML = '';
  if (!starred.length) sl.append(el('div', 'hint', '重要なアイテムをここにドラッグ＆ドロップします'));
  starred.forEach(c => sl.append(chRow(c)));
  // チャンネル
  const cl = $('#channelList'); cl.innerHTML = '';
  S.channels.filter(c => c.type === 'channel' && !c.starred && match(c)).forEach(c => cl.append(chRow(c)));
  const addCh = el('button', 'sb-row add', `<span class="plusbox">${ic('plus')}</span><span class="name">チャンネルを追加する</span>`);
  addCh.onclick = () => addChannelModal(); cl.append(addCh);
  // DM
  const dl = $('#dmList'); dl.innerHTML = '';
  S.channels.filter(c => c.type === 'dm' && !c.starred && match(c)).forEach(c => dl.append(chRow(c)));
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
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing && e.keyCode !== 229) { e.preventDefault(); doSend(); return; }
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
      if (!viewing && !ch.muted) toast(`💬 ${U(who).name}: ${plain(html).slice(0, 40)}`);
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
function openThread(chId, id) { ui.thread = { ch: chId, id }; renderThread(); setTimeout(() => $('#threadPanel .cmp-editor')?.focus(), 30); }
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
  S.channels.forEach(ch => {
    if (inCh && ch.id !== inCh.id) return;
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
  const u = me();
  popMenu(anchor, [
    { html: `<div class="menu-profile">${avatarHTML(S.me)}<div><b>${esc(u.name)}</b><div style="font-size:13px;color:var(--muted)">${S.away ? '○ 離席中' : '● アクティブ'}</div>${u.status ? `<div style="font-size:13px">${esc(u.status)}</div>` : ''}</div></div>` },
    { label: 'ステータスを設定', icon: 'smile', fn: statusModal },
    { label: S.away ? 'アクティブに設定' : '離席中に設定', icon: 'clock', fn: () => { S.away = !S.away; save(); renderRail(); } },
    { sep: true },
    { label: 'プロフィールを編集', icon: 'edit', fn: profileModal },
    { label: S.theme === 'dark' ? 'ライトモードにする' : 'ダークモードにする', icon: S.theme === 'dark' ? 'sun' : 'moon', fn: toggleTheme },
    { sep: true },
    { label: 'データを初期状態に戻す', icon: 'trash', danger: true, fn: resetData },
  ]);
}
function statusModal() {
  const u = me();
  const body = el('div', '', `<label class="field"><span>ステータス</span><input class="inp" name="s" value="${esc(u.status || '')}" placeholder="例：🏠 在宅勤務"></label><div style="display:flex;gap:6px;flex-wrap:wrap"></div>`);
  ['📅 会議中', '🚃 移動中', '🤒 体調不良', '🌴 休暇中', '🏠 在宅勤務', '🍱 昼休憩'].forEach(s => { const b = el('button', 'btn sm', s); b.onclick = () => $('[name=s]', body).value = s; $('div', body).append(b); });
  modal({ title: 'ステータスを設定', body, buttons: [{ label: 'クリア', fn: () => { u.status = ''; save(); renderAll(); } }, { label: '保存', primary: true, fn: () => { u.status = $('[name=s]', body).value.trim(); save(); renderAll(); toast('ステータスを更新しました'); } }] });
}
function profileModal() {
  const u = me();
  const colors = ['#e01e5a', '#1264a3', '#2eb67d', '#e8912d', '#9b59b6', '#4a154b', '#616061'];
  const body = el('div', '', `<label class="field"><span>表示名</span><input class="inp" name="n" value="${esc(u.name)}"></label><label class="field"><span>役職</span><input class="inp" name="t" value="${esc(u.title || '')}"></label><div class="field"><span>アイコンの色</span><div style="display:flex;gap:8px" class="cols"></div></div>`);
  let col = u.color;
  colors.forEach(c => { const b = el('button', ''); b.style.cssText = `width:30px;height:30px;border-radius:50%;background:${c};outline-offset:2px;${c === col ? 'outline:2px solid ' + c : ''}`; b.onclick = () => { col = c; $$('.cols button', body).forEach(x => x.style.outline = ''); b.style.outline = '2px solid ' + c; }; $('.cols', body).append(b); });
  modal({ title: 'プロフィールを編集', body, buttons: [{ label: 'キャンセル' }, { label: '保存', primary: true, fn: () => { const n = $('[name=n]', body).value.trim(); if (!n) return false; u.name = n; u.title = $('[name=t]', body).value.trim(); u.color = col; save(); renderAll(); toast('プロフィールを更新しました'); } }] });
}
function wsMenu(anchor) {
  popMenu(anchor, [
    { html: `<div class="menu-profile"><span class="avatar" style="background:#e5e5e5;color:#3a0f3c">${esc([...S.workspace].slice(0, 2).join(''))}</span><div><b>${esc(S.workspace)}</b><div style="font-size:13px;color:var(--muted)">フリープラン（研修用）</div></div></div>` },
    { sep: true },
    { label: 'ワークスペース名を変更', icon: 'edit', fn: () => { const body = el('div', '', `<label class="field"><span>ワークスペース名</span><input class="inp" name="w" value="${esc(S.workspace)}"></label>`); modal({ title: 'ワークスペース名を変更', body, buttons: [{ label: 'キャンセル' }, { label: '保存', primary: true, fn: () => { const v = $('[name=w]', body).value.trim(); if (!v) return false; S.workspace = v; save(); renderAll(); } }] }); } },
    { label: 'チャンネルを作成', icon: 'plus', fn: addChannelModal },
    { label: 'メンバーを招待', icon: 'users', fn: inviteModal },
    { label: 'プランをアップグレード', icon: 'rocket', fn: plansModal },
    { sep: true },
    { label: 'データを初期状態に戻す', icon: 'trash', danger: true, fn: resetData },
  ]);
}
function inviteModal() {
  const body = el('div', '', `<label class="field"><span>名前</span><input class="inp" name="n" placeholder="例：山田 花子"></label><label class="field"><span>役職</span><input class="inp" name="t" placeholder="例：経理"></label><div class="hint-text">研修用のダミーメンバーとして追加されます。DMを送ると自動で返信します。</div>`);
  modal({
    title: `${S.workspace} にメンバーを招待する`, body, buttons: [{ label: 'キャンセル' }, {
      label: '招待', primary: true, fn: () => {
        const n = $('[name=n]', body).value.trim(); if (!n) return false;
        const id = 'u_' + uid();
        S.users[id] = { id, name: n, title: $('[name=t]', body).value.trim(), color: pick(['#1264a3', '#2eb67d', '#e8912d', '#9b59b6', '#36c5f0', '#ecb22e']), status: '' };
        S.channels.filter(c => c.type === 'channel' && !c.private).forEach(c => c.members.push(id));
        save(); renderAll(); toast(`${n} さんを招待しました`);
      }
    }],
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
    </ul><p class="hint-text">データはこのブラウザ内（localStorage）にのみ保存されます。</p>`,
  });
}
function resetData() {
  modal({
    title: 'データを初期状態に戻す', body: '<p>送信したメッセージ・チャンネル・設定がすべて消え、初期状態に戻ります。よろしいですか？</p>',
    buttons: [{ label: 'キャンセル' }, { label: '初期化する', danger: true, fn: () => { localStorage.removeItem(STORE_KEY); location.reload(); } }],
  });
}
function toggleTheme() { S.theme = S.theme === 'dark' ? 'light' : 'dark'; applyTheme(); save(); renderRail(); }
function applyTheme() { document.documentElement.dataset.theme = S.theme; }

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
  $('#wsIcon').onclick = e => wsMenu(e.currentTarget);
  $('#railAdd').onclick = e => createMenu(e.currentTarget);
  $('#themeBtn').onclick = toggleTheme;
  $('#meBtn').onclick = e => meMenu(e.currentTarget);
  $('#helpBtn').onclick = helpModal;
  $('#menuBtn').onclick = () => document.body.classList.toggle('sb-open');
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
    if (e.key === 'Escape') {
      if ($('#popLayer').children.length) return closePop();
      if (ui.thread) { ui.thread = null; renderThread(); }
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

load();
applyTheme();
bind();
openChannel(getCh(S.current) ? S.current : 'c1');
