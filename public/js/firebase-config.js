/* =====================================================================
   1) FIREBASE CONFIG — gantikan nilai di bawah dengan config projek anda
      (Firebase Console → Project settings → Your apps → Web app → Config)
   ---------------------------------------------------------------------
   2) STRUKTUR FIRESTORE
      settings/site   (1 dokumen) : name, heroTitle, heroSubtitle, heroImage, about, aboutTitle, aboutImage,
                                    address, phone, whatsapp (cth 60123456789), email, openTime "11:00",
                                    closeTime "22:00", closedDays [0..6] (0=Ahad), hours ["Isnin–Jumaat: 11:00–22:00"],
                                    stats [{value,label}], mapQuery, facebook, instagram, tiktok
      menu            (koleksi)   : name, description, price (nombor), category, image (URL), featured (bool),
                                    available (bool), order (nombor)
      promotions      (koleksi)   : title, description, badge, price, oldPrice, image, validUntil ("2026-12-31"
                                    atau Timestamp), active (bool)
      gallery         (koleksi)   : url, caption
      reviews         (koleksi)   : name, text, rating (1-5)
      reservations    (koleksi)   : ditulis oleh borang tempahan
   ---------------------------------------------------------------------
   3) FIRESTORE RULES — lihat fail firestore.rules di akar projek (deploy dengan: firebase deploy --only firestore:rules)
   ===================================================================== */
export const firebaseConfig = {
  apiKey: "ISI_API_KEY",
  authDomain: "ISI_PROJECT_ID.firebaseapp.com",
  projectId: "ISI_PROJECT_ID",
  storageBucket: "ISI_PROJECT_ID.appspot.com",
  messagingSenderId: "ISI_SENDER_ID",
  appId: "ISI_APP_ID"
};
export const FB_VERSION = "10.14.1";
