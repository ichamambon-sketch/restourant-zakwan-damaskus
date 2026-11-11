# Laman Web Restoran — Projek Firebase Hosting (belum di-publish)

Laman web restoran moden dengan kandungan **real-time**: bila anda ubah data di Firebase Console, laman
yang sedang dibuka terus berubah **tanpa refresh** (menggunakan Firestore `onSnapshot`).

## Struktur projek

```
restoran-project/
├── public/                  ← apa yang akan diterbitkan (Hosting)
│   ├── index.html
│   ├── css/style.css
│   └── js/
│       ├── app.js           ← logik laman + sambungan real-time
│       └── firebase-config.js   ← ★ ISI CONFIG FIREBASE DI SINI
├── firebase.json            ← konfigurasi Hosting + Firestore
├── .firebaserc              ← ★ tukar ISI_PROJECT_ID kepada ID projek anda
├── firestore.rules          ← peraturan keselamatan
├── firestore.indexes.json
└── tools/seed.mjs           ← (pilihan) isi data contoh ke Firestore
```

## Cuba dahulu di komputer (tanpa Firebase)

Selagi `firebase-config.js` belum diisi, laman memaparkan **data demo**.

```bash
cd public
python3 -m http.server 8080      # atau: npx serve public
# buka http://localhost:8080
```

> Gunakan pelayan setempat (bukan klik dua kali pada fail) kerana laman guna JavaScript modul.

## Sambung ke Firebase

1. **Firebase Console → Project settings → Your apps → Web app** → salin `firebaseConfig`.
2. Tampal nilainya dalam `public/js/firebase-config.js`.
3. Dalam `.firebaserc`, tukar `ISI_PROJECT_ID` kepada Project ID anda.
4. **Firestore Database → Create database** (jika belum ada).
5. (Pilihan) Isi data contoh: lihat arahan di atas `tools/seed.mjs`. Atau cipta data sendiri di Console.

### Struktur data Firestore

| Laluan | Medan |
|---|---|
| `settings/site` (1 dokumen) | `name`, `heroTitle`, `heroSubtitle`, `heroImage`, `about`, `aboutTitle`, `aboutImage`, `address`, `phone`, `whatsapp` (cth `60123456789`), `email`, `openTime` `"11:00"`, `closeTime` `"22:00"`, `closedDays` `[0..6]` (0 = Ahad), `hours` (array teks), `stats` `[{value,label}]`, `mapQuery`, `facebook`, `instagram`, `tiktok` |
| `menu/*` | `name`, `description`, `price` (nombor), `category`, `image` (URL), `featured` (bool), `available` (bool), `order` (nombor) |
| `promotions/*` | `title`, `description`, `badge`, `price`, `oldPrice`, `image`, `validUntil` (`"2026-12-31"` atau Timestamp), `active` (bool) |
| `gallery/*` | `url`, `caption` |
| `reviews/*` | `name`, `text`, `rating` (1–5) |
| `reservations/*` | ditulis oleh borang tempahan (dibaca admin sahaja) |

Petua: promosi akan hilang sendiri selepas `validUntil`, dan hidangan dengan `available: false` dipaparkan sebagai "Habis".

## Bila sedia untuk publish (belum dibuat lagi)

```bash
npm i -g firebase-tools
firebase login
firebase deploy --only firestore:rules   # peraturan keselamatan
firebase deploy --only hosting           # terbitkan laman web
```

URL laman: `https://ISI_PROJECT_ID.web.app`

## Keselamatan

- `firestore.rules`: orang ramai boleh **baca** kandungan laman; hanya pengguna **log masuk (admin)** boleh ubah.
  Pelanggan hanya boleh **menghantar** tempahan (dengan had saiz medan).
- Untuk mengedit melalui Firebase Console, anda log masuk sebagai pemilik projek — peraturan tidak menghalang Console.
- `apiKey` Firebase untuk web memang dimaksudkan untuk kelihatan di pelayar; keselamatan datang daripada **rules**.
- Jangan commit `tools/serviceAccountKey.json` (sudah ada dalam `.gitignore`).
