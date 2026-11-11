import { firebaseConfig, FB_VERSION } from "./firebase-config.js";


/* ---------- Data demo (dipaparkan jika Firebase belum disambung) ---------- */
const IMG = id => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=70`;
const DEFAULT_SITE = {
  name: "Selera Nusantara",
  heroTitle: "Cita rasa <em>autentik</em>, dihidang dengan sepenuh hati",
  heroSubtitle: "Nikmati hidangan segar yang disediakan setiap hari oleh chef berpengalaman dalam suasana selesa untuk keluarga dan rakan.",
  heroImage: IMG("photo-1517248135467-4c7edcad34c4"),
  aboutTitle: "Kisah di sebalik setiap hidangan",
  about: "Bermula sebagai dapur kecil keluarga, kami kini menghidangkan masakan tradisional dengan sentuhan moden. Setiap hidangan disediakan menggunakan bahan segar dan resipi yang diwarisi turun-temurun — kerana kami percaya makanan yang baik bermula dengan hati yang ikhlas.",
  aboutImage: IMG("photo-1555396273-367ea4eb4db5"),
  address: "No. 12, Jalan Contoh 1, Taman Contoh, 47400 Petaling Jaya, Selangor",
  phone: "03-1234 5678", whatsapp: "60123456789", email: "hello@seleranusantara.my",
  openTime: "11:00", closeTime: "22:00", closedDays: [],
  hours: ["Isnin – Jumaat: 11:00 – 22:00", "Sabtu – Ahad: 10:00 – 23:00"],
  stats: [{value:"4.8★",label:"Penilaian pelanggan"},{value:"15+",label:"Tahun pengalaman"},{value:"50+",label:"Pilihan hidangan"}],
  mapQuery: "", facebook: "", instagram: "", tiktok: ""
};
const DEFAULT_MENU = [
  {id:"1",name:"Nasi Ayam Panggang Madu",description:"Ayam panggang berlapis madu, nasi lemak rempah dan sambal belacan.",price:16.9,category:"Hidangan Utama",image:IMG("photo-1414235077428-338989a2e8c0"),featured:true,order:1},
  {id:"2",name:"Daging Salai Gulai Lemak",description:"Daging salai lembut dimasak perlahan dalam gulai cili api.",price:22.9,category:"Hidangan Utama",image:IMG("photo-1504674900247-0877df9cc836"),order:2},
  {id:"3",name:"Pizza Rendang Ayam",description:"Pizza nipis rangup bersama rendang ayam dan keju mozzarella.",price:28,category:"Hidangan Utama",image:IMG("photo-1565299624946-b28f40a0ae38"),featured:true,order:3},
  {id:"4",name:"Salad Ulam Segar",description:"Campuran ulam kampung, udang rebus dan sos kerisik.",price:14.5,category:"Pembuka Selera",image:IMG("photo-1546069901-ba9599a7e63c"),order:4},
  {id:"5",name:"Lempeng Pisang Karamel",description:"Lempeng gebu, pisang karamel dan aiskrim vanila.",price:12.9,category:"Pencuci Mulut",image:IMG("photo-1567620905732-2d1ec7ab7445"),order:5},
  {id:"6",name:"Teh Tarik Special",description:"Teh tarik berbuih tebal, dibancuh segar.",price:5.5,category:"Minuman",image:"",order:6}
];
const DEFAULT_PROMOS = [
  {id:"p1",title:"Set Keluarga 4 Orang",description:"2 hidangan utama, 2 lauk, nasi untuk 4 dan 4 minuman pilihan.",badge:"JIMAT 25%",price:79.9,oldPrice:106,image:IMG("photo-1504674900247-0877df9cc836"),validUntil:"2026-12-31"},
  {id:"p2",title:"Makan Tengah Hari Eksekutif",description:"Set makan tengah hari lengkap dengan minuman. Isnin – Jumaat, 11am – 3pm.",badge:"BARU",price:15.9,oldPrice:21.9,image:IMG("photo-1414235077428-338989a2e8c0"),validUntil:"2026-12-31"}
];
const DEFAULT_GALLERY = [
  {url:IMG("photo-1517248135467-4c7edcad34c4")},{url:IMG("photo-1555396273-367ea4eb4db5")},
  {url:IMG("photo-1414235077428-338989a2e8c0")},{url:IMG("photo-1504674900247-0877df9cc836")},
  {url:IMG("photo-1565299624946-b28f40a0ae38")},{url:IMG("photo-1546069901-ba9599a7e63c")}
];
const DEFAULT_REVIEWS = [
  {name:"Aisyah R.",rating:5,text:"Makanan sedap dan layanan mesra. Suasana sangat sesuai untuk makan bersama keluarga."},
  {name:"Kevin L.",rating:5,text:"Rendang ayam pizza memang wajib cuba! Pasti akan datang lagi."},
  {name:"Farid H.",rating:4,text:"Harga berpatutan, portion cukup besar. Servis pantas walaupun waktu puncak."}
];

/* ---------- Utiliti ---------- */
const $ = s => document.querySelector(s);
const esc = v => String(v ?? "").replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeUrl = u => /^https?:\/\//i.test(u || "") ? esc(u) : "";
const money = n => (n === undefined || n === null || n === "" || isNaN(n)) ? "" : "RM " + Number(n).toFixed(2);
const byOrder = (a, b) => (a.order ?? 999) - (b.order ?? 999) || String(a.name || "").localeCompare(String(b.name || ""));
const toDate = v => v?.toDate ? v.toDate() : (v ? new Date(v) : null);
const mediaImg = (url, alt) => { const u = safeUrl(url); return u ? `<img loading="lazy" src="${u}" alt="${esc(alt)}" onerror="this.closest('.media').classList.add('noimg');this.remove()">` : ""; };
const mediaCls = url => safeUrl(url) ? "media" : "media noimg";

let toastTimer;
function toast(msg){ const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 3200); }

const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12 });
const observe = root => (root || document).querySelectorAll(".reveal:not(.in)").forEach(el => io.observe(el));

/* ---------- State ---------- */
const state = { site: { ...DEFAULT_SITE }, menu: DEFAULT_MENU, promos: DEFAULT_PROMOS, gallery: DEFAULT_GALLERY, reviews: DEFAULT_REVIEWS, cat: "Semua", q: "" };

/* ---------- Render ---------- */
function renderSite(){
  const s = state.site;
  document.title = `${s.name} — Restoran`;
  document.querySelectorAll("[data-site=name]").forEach(el => el.textContent = s.name);
  const initial = (s.name || "R").trim().charAt(0).toUpperCase();
  $("#logoMark").textContent = initial; $("#logoMark2").textContent = initial;
  const hero = $("#utama"); const hi = safeUrl(s.heroImage); hero.style.backgroundImage = hi ? `url("${hi}")` : "";
  $("#heroTitle").innerHTML = s.heroTitle ? esc(s.heroTitle).replace(/&lt;em&gt;/g,"<em>").replace(/&lt;\/em&gt;/g,"</em>") : "";
  $("#heroSub").textContent = s.heroSubtitle || "";
  $("#stats").innerHTML = (s.stats || []).map(x => `<div><b>${esc(x.value)}</b><span>${esc(x.label)}</span></div>`).join("");
  $("#aboutTitle").textContent = s.aboutTitle || "";
  $("#aboutText").textContent = s.about || "";
  const am = $("#aboutMedia"); am.className = mediaCls(s.aboutImage); am.innerHTML = mediaImg(s.aboutImage, s.name);
  $("#addr").textContent = s.address || "";
  const ph = $("#phoneLink"); ph.textContent = s.phone || ""; ph.href = s.phone ? "tel:" + String(s.phone).replace(/[^\d+]/g, "") : "#";
  const ml = $("#mailLink"); ml.textContent = s.email || ""; ml.href = s.email ? "mailto:" + s.email : "#";
  $("#hoursList").innerHTML = (s.hours || []).map(esc).join("<br>");
  const q = encodeURIComponent(s.mapQuery || s.address || s.name || "");
  $("#mapFrame").src = `https://www.google.com/maps?q=${q}&output=embed`;
  const soc = [["Facebook", s.facebook], ["Instagram", s.instagram], ["TikTok", s.tiktok]].filter(x => safeUrl(x[1]));
  $("#socials").innerHTML = soc.map(x => `<a href="${safeUrl(x[1])}" target="_blank" rel="noopener">${x[0]}</a>`).join("");
  updateOpen();
}

function updateOpen(){
  const s = state.site, now = new Date();
  const toMin = t => { const [h, m] = String(t || "0:0").split(":").map(Number); return h * 60 + (m || 0); };
  const cur = now.getHours() * 60 + now.getMinutes(), o = toMin(s.openTime), c = toMin(s.closeTime);
  const closedToday = (s.closedDays || []).includes(now.getDay());
  const open = !closedToday && (o <= c ? cur >= o && cur < c : cur >= o || cur < c);
  $("#openDot").className = "dot " + (open ? "on" : "off");
  $("#openText").textContent = open ? `Buka sekarang · hingga ${s.closeTime}` : (closedToday ? "Tutup hari ini" : `Tutup · buka semula ${s.openTime}`);
}

function renderPromos(){
  const now = new Date();
  const list = state.promos.filter(p => p.active !== false).filter(p => { const d = toDate(p.validUntil); if (!d) return true; d.setHours(23,59,59); return d >= now; });
  $("#promosi").style.display = list.length ? "" : "none";
  $("#navPromo").style.display = list.length ? "" : "none";
  $("#promoGrid").innerHTML = list.map(p => {
    const d = toDate(p.validUntil);
    const until = d ? `Sah hingga ${d.toLocaleDateString("ms-MY", { day: "numeric", month: "long", year: "numeric" })}` : "";
    return `<article class="promo reveal"><div class="${mediaCls(p.image)}" style="aspect-ratio:16/10">${mediaImg(p.image, p.title)}${p.badge ? `<span class="badge">${esc(p.badge)}</span>` : ""}</div>
      <div class="body"><h3>${esc(p.title)}</h3><p>${esc(p.description)}</p>
      <div class="foot"><div><span class="price-now">${money(p.price)}</span>${p.oldPrice ? `<span class="price-old">${money(p.oldPrice)}</span>` : ""}</div><span class="until">${until}</span></div></div></article>`;
  }).join("");
  observe($("#promoGrid"));
}

function renderTabs(){
  const cats = ["Semua", ...new Set(state.menu.map(i => i.category).filter(Boolean))];
  if (!cats.includes(state.cat)) state.cat = "Semua";
  $("#tabs").innerHTML = cats.map(c => `<button class="tab ${c === state.cat ? "active" : ""}" data-cat="${esc(c)}">${esc(c)}</button>`).join("");
}
function renderDishes(){
  const q = state.q.trim().toLowerCase();
  const list = [...state.menu].sort(byOrder).filter(i => (state.cat === "Semua" || i.category === state.cat) && (!q || `${i.name} ${i.description}`.toLowerCase().includes(q)));
  $("#dishGrid").innerHTML = list.length ? list.map(i => {
    const sold = i.available === false;
    return `<article class="dish ${sold ? "soldout" : ""}"><div class="${mediaCls(i.image)}">${mediaImg(i.image, i.name)}${i.featured && !sold ? `<span class="tag">⭐ Pilihan Chef</span>` : ""}${sold ? `<span class="tag sold">Habis</span>` : ""}</div>
      <div class="body"><div class="row"><h3>${esc(i.name)}</h3><span class="price">${money(i.price)}</span></div><p>${esc(i.description)}</p></div></article>`;
  }).join("") : `<p class="empty">Tiada hidangan ditemui.</p>`;
}
function renderMenu(){ renderTabs(); renderDishes(); }

function renderGallery(){
  const list = state.gallery.filter(g => safeUrl(g.url));
  $("#galeri").style.display = list.length ? "" : "none";
  $("#navGallery").style.display = list.length ? "" : "none";
  $("#galleryGrid").innerHTML = list.map(g => `<div class="g-item reveal" data-src="${safeUrl(g.url)}"><img loading="lazy" src="${safeUrl(g.url)}" alt="${esc(g.caption || "Galeri")}" onerror="this.closest('.g-item').remove()"></div>`).join("");
  observe($("#galleryGrid"));
}

function renderReviews(){
  const list = state.reviews;
  $("#ulasan").style.display = list.length ? "" : "none";
  $("#navReviews").style.display = list.length ? "" : "none";
  $("#revGrid").innerHTML = list.map(r => {
    const n = Math.max(0, Math.min(5, Math.round(Number(r.rating) || 5)));
    return `<div class="rev reveal"><div class="stars">${"★".repeat(n)}${"☆".repeat(5 - n)}</div><p>“${esc(r.text)}”</p><div class="who"><span class="avatar">${esc((r.name || "?").charAt(0).toUpperCase())}</span>${esc(r.name)}</div></div>`;
  }).join("");
  observe($("#revGrid"));
}

const renderers = { site: renderSite, menu: renderMenu, promos: renderPromos, gallery: renderGallery, reviews: renderReviews };

/* ---------- Interaksi UI ---------- */
$("#tabs").addEventListener("click", e => { const b = e.target.closest(".tab"); if (!b) return; state.cat = b.dataset.cat; renderMenu(); });
$("#search").addEventListener("input", e => { state.q = e.target.value; renderDishes(); });
$("#galleryGrid").addEventListener("click", e => { const g = e.target.closest(".g-item"); if (!g) return; const lb = $("#lightbox"); lb.querySelector("img").src = g.dataset.src; lb.classList.add("open"); });
$("#lightbox").addEventListener("click", () => $("#lightbox").classList.remove("open"));
document.addEventListener("keydown", e => { if (e.key === "Escape") $("#lightbox").classList.remove("open"); });
$("#burger").addEventListener("click", () => $("#menuList").classList.toggle("open"));
$("#menuList").addEventListener("click", e => { if (e.target.tagName === "A") $("#menuList").classList.remove("open"); });
const header = $("#top"); const onScroll = () => header.classList.toggle("scrolled", scrollY > 40); addEventListener("scroll", onScroll, { passive: true }); onScroll();
$("#year").textContent = new Date().getFullYear();
$("#fDate").min = new Date().toISOString().split("T")[0];

/* ---------- Render awal (data demo / lalai) ---------- */
Object.values(renderers).forEach(fn => fn());
observe();
setInterval(updateOpen, 60000);

/* ---------- Firebase (real-time) ---------- */
const fb = {};
const isConfigured = firebaseConfig.apiKey && !String(firebaseConfig.apiKey).startsWith("ISI_");

function setLive(ok, text){ $("#liveDot").className = "dot " + (ok ? "on" : "off"); $("#liveText").textContent = text; }
setLive(false, isConfigured ? "Menyambung…" : "Mod demo");
$("#liveDot").className = "dot";

if (isConfigured) {
  try {
    const base = `https://www.gstatic.com/firebasejs/${FB_VERSION}`;
    const [{ initializeApp }, fs] = await Promise.all([import(`${base}/firebase-app.js`), import(`${base}/firebase-firestore.js`)]);
    const app = initializeApp(firebaseConfig);
    const db = fs.getFirestore(app);
    Object.assign(fb, { db, ...fs });
    const seen = new Set();

    const afterSnap = (key, snap) => {
      if (snap.metadata.fromCache && !seen.has("any")) { /* tunggu data pelayan */ }
      setLive(true, "Langsung");
      if (seen.has(key) && !snap.metadata.hasPendingWrites) toast("✨ Kandungan dikemas kini");
      seen.add(key); seen.add("any");
    };
    const onErr = err => { console.error(err); setLive(false, "Tiada sambungan"); };

    // Dokumen tetapan
    fs.onSnapshot(fs.doc(db, "settings", "site"), snap => {
      if (snap.exists()) { state.site = { ...DEFAULT_SITE, ...snap.data() }; renderSite(); }
      afterSnap("site", snap);
    }, onErr);

    // Koleksi
    const listen = (col, key) => fs.onSnapshot(fs.collection(db, col), snap => {
      state[key] = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      renderers[key](); afterSnap(key, snap);
    }, onErr);
    listen("menu", "menu"); listen("promotions", "promos"); listen("gallery", "gallery"); listen("reviews", "reviews");
  } catch (err) {
    console.error(err); setLive(false, "Ralat Firebase");
  }
}

/* ---------- Borang tempahan ---------- */
$("#resForm").addEventListener("submit", async e => {
  e.preventDefault();
  const f = Object.fromEntries(new FormData(e.target));
  const d = new Date(f.tarikh + "T00:00").toLocaleDateString("ms-MY", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const msg = `Salam, saya ingin membuat tempahan meja di ${state.site.name}:\n\nNama: ${f.nama}\nTelefon: ${f.telefon}\nTarikh: ${d}\nMasa: ${f.masa}\nBilangan orang: ${f.pax}${f.nota ? `\nNota: ${f.nota}` : ""}`;
  if (fb.db) {
    try { await fb.addDoc(fb.collection(fb.db, "reservations"), { ...f, pax: Number(f.pax), status: "baru", createdAt: fb.serverTimestamp() }); }
    catch (err) { console.warn("Tempahan tidak disimpan ke Firestore:", err); }
  }
  const wa = String(state.site.whatsapp || "").replace(/\D/g, "");
  if (wa) window.open(`https://wa.me/${wa}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
  toast("✅ Terima kasih! Tempahan anda dihantar.");
  e.target.reset(); $("#fTime").value = "19:00"; $("#fPax").value = "2";
});
