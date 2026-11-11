// Skrip pilihan: isi Firestore dengan data contoh supaya anda boleh terus lihat hasilnya.
// Guna sekali sahaja SEBELUM/semasa persediaan. Ia TIDAK ikut di-deploy ke Hosting.
//
// Cara guna:
//   1. cd tools && npm init -y && npm i firebase-admin
//   2. Firebase Console → Project settings → Service accounts → Generate new private key
//      Simpan sebagai tools/serviceAccountKey.json  (JANGAN kongsi / commit fail ini)
//   3. node seed.mjs
import { readFileSync } from "node:fs";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const key = JSON.parse(readFileSync(new URL("./serviceAccountKey.json", import.meta.url)));
initializeApp({ credential: cert(key) });
const db = getFirestore();

const IMG = id => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=70`;

const site = {
  name: "Nama Restoran Anda",
  heroTitle: "Cita rasa <em>autentik</em>, dihidang dengan sepenuh hati",
  heroSubtitle: "Nikmati hidangan segar yang disediakan setiap hari oleh chef berpengalaman.",
  heroImage: IMG("photo-1517248135467-4c7edcad34c4"),
  aboutTitle: "Kisah di sebalik setiap hidangan",
  about: "Ceritakan sejarah dan keistimewaan restoran anda di sini.",
  aboutImage: IMG("photo-1555396273-367ea4eb4db5"),
  address: "Alamat restoran anda",
  phone: "03-0000 0000",
  whatsapp: "60123456789",
  email: "hello@contoh.my",
  openTime: "11:00",
  closeTime: "22:00",
  closedDays: [],
  hours: ["Isnin – Jumaat: 11:00 – 22:00", "Sabtu – Ahad: 10:00 – 23:00"],
  stats: [
    { value: "4.8★", label: "Penilaian pelanggan" },
    { value: "15+", label: "Tahun pengalaman" },
    { value: "50+", label: "Pilihan hidangan" }
  ],
  mapQuery: "", facebook: "", instagram: "", tiktok: ""
};

const menu = [
  { name: "Nasi Ayam Panggang Madu", description: "Ayam panggang berlapis madu, nasi lemak rempah dan sambal belacan.", price: 16.9, category: "Hidangan Utama", image: IMG("photo-1414235077428-338989a2e8c0"), featured: true, available: true, order: 1 },
  { name: "Daging Salai Gulai Lemak", description: "Daging salai lembut dimasak perlahan dalam gulai cili api.", price: 22.9, category: "Hidangan Utama", image: IMG("photo-1504674900247-0877df9cc836"), available: true, order: 2 },
  { name: "Salad Ulam Segar", description: "Campuran ulam kampung, udang rebus dan sos kerisik.", price: 14.5, category: "Pembuka Selera", image: IMG("photo-1546069901-ba9599a7e63c"), available: true, order: 3 },
  { name: "Lempeng Pisang Karamel", description: "Lempeng gebu, pisang karamel dan aiskrim vanila.", price: 12.9, category: "Pencuci Mulut", image: IMG("photo-1567620905732-2d1ec7ab7445"), available: true, order: 4 },
  { name: "Teh Tarik Special", description: "Teh tarik berbuih tebal, dibancuh segar.", price: 5.5, category: "Minuman", image: "", available: true, order: 5 }
];

const promotions = [
  { title: "Set Keluarga 4 Orang", description: "2 hidangan utama, 2 lauk, nasi untuk 4 dan 4 minuman pilihan.", badge: "JIMAT 25%", price: 79.9, oldPrice: 106, image: IMG("photo-1504674900247-0877df9cc836"), validUntil: "2026-12-31", active: true }
];

const gallery = [
  { url: IMG("photo-1517248135467-4c7edcad34c4"), caption: "Ruang makan" },
  { url: IMG("photo-1414235077428-338989a2e8c0"), caption: "Hidangan istimewa" },
  { url: IMG("photo-1565299624946-b28f40a0ae38"), caption: "Pilihan chef" }
];

const reviews = [
  { name: "Aisyah R.", rating: 5, text: "Makanan sedap dan layanan mesra." },
  { name: "Farid H.", rating: 4, text: "Harga berpatutan, servis pantas." }
];

const batch = db.batch();
batch.set(db.doc("settings/site"), site);
for (const [col, items] of Object.entries({ menu, promotions, gallery, reviews })) {
  for (const item of items) batch.set(db.collection(col).doc(), item);
}
await batch.commit();
console.log("Siap! Data contoh telah dimasukkan ke Firestore.");
