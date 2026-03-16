/* =====================================================
   MarketPrice+  |  main.js
   Vanilla JavaScript — shared across all pages
   ===================================================== */

'use strict';

/* ── VENDOR DATA ─────────────────────────────────────── */
const VENDORS = [
  { id:1, name:'Eko Grains Ltd',       location:'Lagos',         category:'Food',        verified:true,  products:[{name:'Rice (50kg)',price:78000},{name:'Garri (25kg)',price:14500}] },
  { id:2, name:'Abuja Provisions',     location:'Abuja',         category:'Food',        verified:true,  products:[{name:'Rice (50kg)',price:79500},{name:'Beans (50kg)',price:65000}] },
  { id:3, name:'Kano Agro Stores',     location:'Kano',          category:'Food',        verified:false, products:[{name:'Rice (50kg)',price:77000},{name:'Maize (50kg)',price:42000}] },
  { id:4, name:'PH Telecom Hub',       location:'Port Harcourt', category:'Electronics', verified:true,  products:[{name:'Data Bundle 5GB',price:2000},{name:'Sim Card',price:100}] },
  { id:5, name:'Ibadan Mega Stores',   location:'Ibadan',        category:'Food',        verified:true,  products:[{name:'Rice (50kg)',price:76500},{name:'Tomatoes (basket)',price:28000}] },
  { id:6, name:'Delta FuelMart',       location:'Warri',         category:'Fuel',        verified:true,  products:[{name:'Petrol (litre)',price:617},{name:'Diesel (litre)',price:1190}] },
  { id:7, name:'Kaduna Wholesale',     location:'Kaduna',        category:'Food',        verified:false, products:[{name:'Sugar (50kg)',price:55000},{name:'Salt (25kg)',price:12000}] },
  { id:8, name:'Enugu Electronics',    location:'Enugu',         category:'Electronics', verified:true,  products:[{name:'Mobile Data 10GB',price:3500},{name:'Power Bank',price:18000}] },
];

/* ── REPORTS DATA ─────────────────────────────────────── */
const REPORTS = {
  'RPT-2024-001': { product:'Rice (50kg)',    vendor:'Ugo Stores Ikeja', price:'₦95,000', location:'Lagos', agency:'FCCPC', status:'Investigating', date:'2024-06-01' },
  'RPT-2024-002': { product:'Data Bundle 5GB',vendor:'TechZone Abuja',   price:'₦4,500',  location:'Abuja', agency:'NCC',   status:'Resolved',     date:'2024-05-28' },
  'RPT-2024-003': { product:'Petrol (litre)', vendor:'FastFuel Warri',    price:'₦900',    location:'Warri', agency:'FCCPC', status:'Submitted',    date:'2024-06-05' },
};

const STATUS_STEPS  = ['Submitted','Seen','Investigating','Processing','Resolved'];
const STATUS_COLORS = { Submitted:'#FFA726', Seen:'#42A5F5', Investigating:'#AB47BC', Processing:'#FF7043', Resolved:'#4CAF50' };
const STEP_DESCS    = [
  'Report received and assigned an ID.',
  'Agency has viewed your complaint.',
  'Active investigation has been launched.',
  'Enforcement action is in progress.',
  'Case closed — resolution achieved.'
];

/* ── NAVBAR ACTIVE LINK ───────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (current === href || (current === 'index.html' && href === 'index.html'))) {
      link.classList.add('navbar__link--active');
    }
  });
});

/* ── VENDOR SEARCH / FILTER (vendors.html) ───────────── */
function filterVendors() {
  const search  = (document.getElementById('vendor-search')?.value || '').toLowerCase();
  const loc     = document.getElementById('vendor-loc-filter')?.value || '';
  const cat     = document.getElementById('vendor-cat-filter')?.value || '';
  const cards   = document.querySelectorAll('#vendor-grid .vendor-card');
  let   visible = 0;

  cards.forEach(card => {
    const matchLoc  = !loc  || card.dataset.location === loc;
    const matchCat  = !cat  || card.dataset.category === cat;
    const matchText = !search ||
      card.dataset.name.toLowerCase().includes(search) ||
      card.dataset.products.toLowerCase().includes(search);

    const show = matchLoc && matchCat && matchText;
    card.style.display = show ? '' : 'none';
    if (show) visible++;
  });

  const countEl = document.getElementById('vendor-count');
  if (countEl) countEl.innerHTML = `Showing <strong>${visible}</strong> vendor${visible !== 1 ? 's' : ''}`;

  const emptyEl = document.getElementById('vendor-empty');
  const gridEl  = document.getElementById('vendor-grid');
  if (emptyEl) emptyEl.style.display = visible === 0 ? 'block' : 'none';
  if (gridEl)  gridEl.style.display  = visible === 0 ? 'none'  : '';
}

/* ── REPORT FORM (report.html) ───────────────────────── */
function submitReport(event) {
  event.preventDefault();

  const name    = document.getElementById('r-name')?.value.trim();
  const email   = document.getElementById('r-email')?.value.trim();
  const product = document.getElementById('r-product')?.value.trim();
  const vendor  = document.getElementById('r-vendor')?.value.trim();
  const price   = document.getElementById('r-price')?.value.trim();

  if (!name || !email || !product || !vendor || !price) {
    alert('Please fill in all required fields.'); return;
  }

  const id = 'RPT-2024-' + (Math.floor(Math.random() * 9000) + 1000);
  const idEl = document.getElementById('generated-id');
  if (idEl) idEl.textContent = id;

  document.getElementById('report-form-section')?.classList.add('hidden');
  document.getElementById('report-success')?.classList.remove('hidden');
  window.scrollTo(0, 0);
}

function resetReport() {
  document.getElementById('report-success')?.classList.add('hidden');
  document.getElementById('report-form-section')?.classList.remove('hidden');
  document.getElementById('report-form')?.reset();
}

/* ── TRACK REPORT (track.html) ───────────────────────── */
function trackReport(event) {
  event?.preventDefault();

  const id       = (document.getElementById('track-id')?.value || '').trim().toUpperCase();
  const notFound = document.getElementById('track-not-found');
  const result   = document.getElementById('track-result');

  notFound?.classList.add('hidden');
  result?.classList.add('hidden');

  const r = REPORTS[id];
  if (!r) { notFound?.classList.remove('hidden'); return; }

  /* populate header */
  const idEl   = document.getElementById('tr-id');
  const dateEl = document.getElementById('tr-date');
  const pillEl = document.getElementById('tr-pill');
  if (idEl)   idEl.textContent   = id;
  if (dateEl) dateEl.textContent = 'Filed on ' + r.date;
  if (pillEl) {
    pillEl.textContent       = r.status;
    pillEl.style.background  = STATUS_COLORS[r.status] + '22';
    pillEl.style.color       = STATUS_COLORS[r.status];
    pillEl.style.border      = '1px solid ' + STATUS_COLORS[r.status] + '44';
  }

  /* populate details */
  const detailsEl = document.getElementById('tr-details');
  if (detailsEl) {
    detailsEl.innerHTML = [
      ['Product', r.product], ['Vendor', r.vendor],
      ['Price Reported', r.price], ['Agency', r.agency], ['Location', r.location]
    ].map(([k, v]) => `<div><span style="color:var(--silver-dim)">${k}:</span> <strong style="color:var(--silver-light)">${v}</strong></div>`).join('');
  }

  /* build timeline */
  const tlEl   = document.getElementById('tr-timeline');
  const step   = STATUS_STEPS.indexOf(r.status);
  if (tlEl) {
    tlEl.innerHTML = STATUS_STEPS.map((s, i) => {
      const done = i < step, cur = i === step;
      const dotClass  = done ? 'track-dot--done' : cur ? 'track-dot--active' : '';
      const stepClass = done ? 'track-step--done' : cur ? 'track-step--active' : '';
      const color     = cur ? STATUS_COLORS[s] : done ? 'var(--green)' : 'var(--silver-dim)';
      return `
        <div class="track-step ${stepClass}">
          <div class="track-dot ${dotClass}">${done ? '✓' : cur ? '●' : i + 1}</div>
          <div class="track-info">
            <h4 style="color:${color}">${s}</h4>
            <p>${STEP_DESCS[i]}</p>
          </div>
        </div>`;
    }).join('');
  }

  result?.classList.remove('hidden');
}

/* ── QUICK TRACK (index.html shortcut) ──────────────── */
function quickTrack() {
  const val = document.getElementById('quick-track-id')?.value.trim();
  if (val) {
    window.location.href = 'track.html?id=' + encodeURIComponent(val);
  } else {
    window.location.href = 'track.html';
  }
}

/* auto-fill track ID from query string */
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const prefillId = params.get('id');
  const trackInput = document.getElementById('track-id');
  if (prefillId && trackInput) {
    trackInput.value = prefillId;
    trackReport();
  }
});

/* ── LOGIN PAGE (login.html) ─────────────────────────── */
let currentRole   = 'consumer';
let isRegisterMode = false;

function setLoginRole(btn, role) {
  document.querySelectorAll('.role-tab').forEach(b => b.classList.remove('role-tab--active'));
  btn.classList.add('role-tab--active');
  currentRole = role;

  const adminNotice = document.getElementById('admin-notice');
  if (adminNotice) adminNotice.style.display = role === 'admin' ? 'block' : 'none';
}

function toggleRegisterMode() {
  isRegisterMode = !isRegisterMode;
  const title    = document.getElementById('login-title');
  const btnEl    = document.getElementById('login-btn');
  const nameWrap = document.getElementById('name-field');
  const toggleEl = document.getElementById('toggle-text');
  const toggleLk = document.getElementById('toggle-link');

  if (title)    title.textContent     = isRegisterMode ? 'Create Account' : 'Welcome Back';
  if (btnEl)    btnEl.textContent     = isRegisterMode ? 'Create Account →' : 'Login →';
  if (nameWrap) nameWrap.style.display = isRegisterMode ? 'block' : 'none';
  if (toggleEl) toggleEl.textContent  = isRegisterMode ? 'Already have an account? ' : 'New to MarketPrice+? ';
  if (toggleLk) toggleLk.textContent  = isRegisterMode ? 'Login' : 'Register free';
}

function doLogin(event) {
  event.preventDefault();
  if (currentRole === 'vendor') {
    window.location.href = 'vendor-dashboard.html';
  } else if (currentRole === 'admin') {
    window.location.href = 'admin-dashboard.html';
  } else {
    window.location.href = 'index.html';
  }
}
