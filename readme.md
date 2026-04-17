# Beam Analysis Calculator 📐

**Aplikasi web untuk menghitung dan memvisualisasikan analisis beam (balok) dalam ilmu mekanika struktur.**

---

## 🎯 Tujuan Project

Membuat kalkulator otomatis yang bisa:

1. ✅ Menghitung **defleksi (lendutan)** balok
2. ✅ Menghitung **gaya geser (shear force)**
3. ✅ Menghitung **momen lentur (bending moment)**
4. ✅ Menampilkan hasilnya dalam bentuk **grafik interaktif**

Cocok untuk mahasiswa teknik atau siapa saja yang butuh cepat hitung beam analysis tanpa manual!

---

## 🚀 Cara Pakai (Mudah!)

### Step 1: Buka File

Buka file **`index.html`** di browser favorit Anda.

### Step 2: Isi Form

Isi parameter beam Anda:

| Parameter               | Contoh           | Arti                          |
| ----------------------- | ---------------- | ----------------------------- |
| **Condition**           | Simply Supported | Tipe dukungan beam            |
| **Load Force (w)**      | 10               | Beban merata (kN/m)           |
| **Primary Span (L1)**   | 4                | Panjang span 1 (meter)        |
| **Secondary Span (L2)** | 3                | Panjang span 2 (untuk 2-span) |
| **EI**                  | 3150000000000    | Kekakuan bending (Nmm²)       |

### Step 3: Klik Calculate

Tekan tombol "Calculate" → Lihat 3 grafik!

---

## 📊 Input Contoh yang Bagus

### ✓ Simply Supported (Balok Sederhana)

```
Condition: Simply Supported
Load Force (w): 10 kN/m
Primary Span (L1): 4 m
EI: 3150000000000 Nmm²
```

**Hasilnya:** Defleksi membentuk kurva U terbalik, min di tengah

---

### ✓ Two Span Unequal (Balok 2 Span)

```
Condition: Two Span Unequal
Load Force (w): 10 kN/m
Primary Span (L1): 4 m
Secondary Span (L2): 3 m
EI: 3150000000000 Nmm²
```

**Hasilnya:** Defleksi lebih kompleks dengan 2 kurva

---

## 📁 File-File Penting

```
candidate-test-toolbox/
├── index.html                    ← BUKA INI DI BROWSER
├── style.css                     ← Styling (warna, ukuran, layout)
├── js/
│   ├── beam-analysis.js          ← Rumus-rumus perhitungan
│   └── analysis-plotter.js       ← Code menggambar grafik
├── excel/
│   └── beam-analysis.xlsx        ← Referensi rumus
└── images/
    └── *.png                     ← Contoh hasil yang benar
```

---

## 🔧 Penjelasan Code

### **beam-analysis.js** - Tempat Rumus Perhitungan

**1. Simply Supported Beam**

```javascript
// Defleksi = seberapa jauh balok melengkung
y = (w/24EI) × (L×x³ - 2L²×x² + L³×x)

// Momen = moment yang dialami di posisi x
M = (w/2) × x × (L - x)

// Gaya geser = gaya tegak lurus di posisi x
V = w × (L/2 - x)
```

**2. Two Span Unequal Beam**

- Menggunakan **Three Moment Equation** untuk hitung momen di support tengah
- Mb = -(w/12) × (L1³ + L2³) / (L1 + L2)
- Kemudian hitung defleksi per span

### **analysis-plotter.js** - Menggambar Grafik

File ini menggunakan **Canvas API** (bawaan HTML5) untuk:

- Gambar grid otomatis
- Gambar axes (sumbu X dan Y)
- Gambar kurva smooth dari data
- Display labels dengan nilai yang benar

---

## 📐 Satuan yang Dipakai

| Apa                | Satuan   | Keterangan          |
| ------------------ | -------- | ------------------- |
| Beban (w)          | kN/m     | Per meter panjang   |
| Panjang (L)        | m        | Meter               |
| EI                 | Nmm²     | Kekakuan material   |
| **Hasil Defleksi** | **mm**   | Millimeter (output) |
| **Hasil Moment**   | **kN·m** | Kilonewton·meter    |
| **Hasil Shear**    | **kN**   | Kilonewton          |

---

## 🎨 Fitur Visual

✅ **Grafik Responsive** - Menyesuaikan ukuran layar  
✅ **Grid Otomatis** - Garis grid membantu baca nilai  
✅ **Smooth Curve** - Kurva smooth (bukan bergerigi)  
✅ **Axis Labels** - Label X dan Y otomatis  
✅ **Professional UI** - Design rapi dan modern

---

## 🐛 Common Issues & Solusi

| Masalah                | Solusi                                       |
| ---------------------- | -------------------------------------------- |
| Grafik tidak muncul    | Refresh browser (Ctrl+F5), pastikan file ada |
| Y-axis semua 0         | Isi Load Force (w) dengan angka              |
| Defleksi terlalu besar | EI terlalu kecil, coba tambah                |
| Defleksi terlalu kecil | EI terlalu besar, coba kurangi               |

---

## 📚 Referensi Rumus

Rumus-rumus dari buku standar:

- **Mechanics of Materials** - Gere & Goodno
- **Structural Analysis** - Hibbeler
- **Engineering Mechanics** - Bedford & Fowler

---

## ✅ Expected Results (Target Output)

### Simply Supported Analysis

- ![Deflection](images/deflection-plot.png) Deflection Plot
- ![Shear Force](images/shear-force-plot.png) Shear Force Plot
- ![Bending Moment](images/bending-moment-plot.png) Bending Moment Plot

### Two Span Unequal Analysis

- ![Deflection](images/two-span-unequal-deflection-plot.png)
- ![Shear Force](images/two-span-unequal-shear-plot.png)
- ![Bending Moment](images/two-span-unequal-bending-plot.png)

---

## 👨‍💻 Implementasi

**Author:** Ego Widiarto  
**For:** Technical Assignment - Beam Analysis  
**Date:** April 17, 2026

---

## 📝 Changelog

### v1.0 - Main Features

- ✅ Implementasi Simply Supported Beam analysis
- ✅ Implementasi Two Span Unequal Beam analysis
- ✅ Canvas-based chart plotting
- ✅ Unit conversion (m ↔ mm)
- ✅ Responsive UI dengan Grid dan Axes
- ✅ Professional styling

---

**Happy Calculating!** 🎓📊
