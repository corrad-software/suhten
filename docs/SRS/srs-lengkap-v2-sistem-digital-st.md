# SRS Lengkap v2 - Sistem Digital ST

| Field | Value |
|-------|-------|
| Source PDF | `docs/SRS/SRS Lengkap v2 - Sistem Digital ST.pdf` |
| Original | `C:/ST/SRS/SRS Lengkap v2 - Sistem Digital ST.pdf` |
| Pages | 135 (135 with extractable text) |
| Full text | [`srs-lengkap-v2-sistem-digital-st-full-text.md`](./srs-lengkap-v2-sistem-digital-st-full-text.md) |

> Machine-extracted for AI-assisted development. Scanned/image-only pages may be empty — refer to the original PDF for diagrams and tables.

## About

**SRS Lengkap v2 — Sistem Digital ST**. Primary software requirements specification.

## Extracted Content by Page

### Page 1

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
DOKUMEN SPESIFIKASI KEPERLUAN SISTEM (SRS) 
Disediakan mengikut format D03, Buku Panduan Kejuruteraan Sistem Aplikasi Sektor Awam (KRISA), BPI MAMPU
SISTEM DIGITAL SURUHANJAYA TENAGA (ST) 
Projek Pembangunan Sistem Digital Suruhanjaya Tenaga
Nama Sistem Sistem Digital Suruhanjaya Tenaga (ST)
Nama Agensi Suruhanjaya Tenaga (ST)
Nama Agensi Induk
Kementerian Peralihan Tenaga dan Transformasi Air 
(PETRA)
Tarikh Dokumen Jun 2026
Versi Dokumen 1.0

### Page 2

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
Keterangan Dokumen 
Dokumen Spesifikasi Keperluan Sistem (SRS) ini menjelaskan secara menyeluruh keperluan fungsian 
dan bukan fungsian bagi Sistem Digital Suruhanjaya Tenaga (ST), disediakan mengikut format D03 
dalam Buku Panduan Kejuruteraan Sistem Aplikasi Sektor Awam (KRISA, BPI MAMPU). Konteks dan 
keperluan sistem diperoleh daripada Appendix G (Keterangan Modul), Appendix D1 (Spesifikasi Fungsi) 
dan Appendix D11 (Pembentangan Prototaip). Dokumen menjadi rujukan utama bagi fasa rekabentuk 
(SDS), pembangunan, pengujian dan pentauliahan.

### Page 3

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
Semakan dan Pengesahan Dokumen 
Semakan Dokumen 
Pengesahan Dokumen 
Disemak Oleh Jawatan Tandatangan Tarikh
Ketua Pasukan Analisis & Rekabentuk
Ketua Business Analyst
Disahkan Oleh Jawatan Tandatangan Tarikh
Pengurus Projek
Pengarah / Seksyen Teknologi Digital ST

### Page 4

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
Kawalan Dokumen 
No. Versi Tarikh Ringkasan Pindaan Penyedia
1.0 Jun 2026 Pengeluaran pertama dokumen SRS Pasukan Projek

### Page 5

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
Kandungan 
Keterangan Dokumen 2
Semakan dan Pengesahan Dokumen 3
Semakan Dokumen 3
Pengesahan Dokumen 3
Kawalan Dokumen 4
Kandungan 5
Senarai Gambar Rajah 9
Senarai Jadual 12
Definisi dan Akronim 13
Akronim 13
Definisi 13
Sumber Rujukan 14
1. PENGENALAN 15
1.1 Tujuan Sistem 15
1.2 Skop Sistem 15
1.2.1 Gambaran Keseluruhan 15
1.2.2 Senarai Modul mengikut Domain 15
1.2.3 Ciri Sepunya Semua Modul 16
1.3 Senarai Aktor Sistem 16
2. PEMODELAN FUNGSI SISTEM 17
2.1 Penggunaan Notasi 17
2.2 Rajah Hierarki Fungsian Sistem 17
2.2.2 Pecahan Transaksi mengikut Modul 17
2.3 Jadual Pemadanan Aktor dengan Fungsi Sistem 19
3. PEMODELAN USE CASE 20
3.1 Penggunaan Notasi 20
3.2 Model Use Case 20
3.2.1 Rajah Use Case Keseluruhan Sistem 20
3.2.2 Senarai Use Case mengikut Modul 20
3.2.3 Contoh Rajah Use Case & Aliran (Modul RG-KE) 23

### Page 6

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
4. PEMODELAN MAKLUMAT 24
4.1 Penggunaan Notasi 24
4.2 Model Maklumat (ERD) 24
4.3 Definisi Kamus Data 24
5. PEMODELAN PROSES SISTEM 25
5.1 Penggunaan Notasi 25
5.2 Model Proses Sistem 25
5.2.1 Rajah Aktiviti (Swimlane) — Aliran Permohonan Umum 26
5.2.2 Carta Alir Proses Bisnes mengikut Modul (Notasi PFD — selaras Tender) 
26
5.2.3 Lapisan Integriti Kalis-Usik (Blockchain) 27
5.3 Definisi Aliran Data 27
6. PENENTUAN KEPERLUAN BUKAN FUNGSIAN 28
6.1 Jadual Ciri-ciri Kualiti Sistem 28
7. PENENTUAN SAIZ SISTEM APLIKASI 29
7.1 Kaedah Function Point Analysis 29
8. LAMPIRAN 30
8.1 Spesifikasi Aktiviti & Skrin Terperinci 30
8.1 Modul LC-LE — Pelesenan Elektrik 31
Sub-Modul & Fungsian: 32
Maklumat Antara Muka — Skrin Pengguna: 32
8.1 Modul LC-PE — Pepasangan Elektrik 37
Sub-Modul & Fungsian: 38
Maklumat Antara Muka — Skrin Pengguna: 38
8.1 Modul LC-LG — Pelesenan Gas 43
Sub-Modul & Fungsian: 44
Maklumat Antara Muka — Skrin Pengguna: 44
8.1 Modul LC-PG — Pepasangan Gas 49
Sub-Modul & Fungsian: 50
Maklumat Antara Muka — Skrin Pengguna: 50
8.1 Modul RG-KE — Pendaftaran Orang Kompeten Elektrik 55
Sub-Modul & Fungsian: 56

### Page 7

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
Maklumat Antara Muka — Skrin Pengguna: 56
8.1 Modul RG-KG — Pendaftaran Orang Kompeten Gas 62
Sub-Modul & Fungsian: 63
Maklumat Antara Muka — Skrin Pengguna: 63
8.1 Modul RG-CE — Pendaftaran Kontraktor Elektrik 68
Sub-Modul & Fungsian: 69
Maklumat Antara Muka — Skrin Pengguna: 69
8.1 Modul RG-CG — Pendaftaran Kontraktor Gas 75
Sub-Modul & Fungsian: 76
Maklumat Antara Muka — Skrin Pengguna: 76
8.1 Modul PE-ID — Pengurusan ID & Akaun Pengguna 81
Sub-Modul & Fungsian: 82
Maklumat Antara Muka — Skrin Pengguna: 82
8.1 Modul PE-RV — Pengurusan Hasil 87
Sub-Modul & Fungsian: 88
Maklumat Antara Muka — Skrin Pengguna: 88
8.1 Modul PE-SV — Lawatan Tapak / Pemeriksaan / Audit 93
Sub-Modul & Fungsian: 94
Maklumat Antara Muka — Skrin Pengguna: 94
8.1 Modul PE-JK — Kelulusan Jawatankuasa 99
Sub-Modul & Fungsian: 100
Maklumat Antara Muka — Skrin Pengguna: 100
8.1 Modul CC-XE — Peperiksaan Elektrik 105
Sub-Modul & Fungsian: 106
Maklumat Antara Muka — Skrin Pengguna: 106
8.1 Modul CC-XG — Peperiksaan Gas 111
Sub-Modul & Fungsian: 112
Maklumat Antara Muka — Skrin Pengguna: 112
8.1 Modul CC-CD — Pembangunan Berterusan (CPD) 117
Sub-Modul & Fungsian: 118
Maklumat Antara Muka — Skrin Pengguna: 118
8.1 Modul EE-KT — Kecekapan Tenaga 123

### Page 8

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
Sub-Modul & Fungsian: 124
Maklumat Antara Muka — Skrin Pengguna: 124
8.1 Modul EN-IV — Penguatkuasaan & Penyiasatan 129
Sub-Modul & Fungsian: 130
Maklumat Antara Muka — Skrin Pengguna: 130
8.2 Matriks Keterunutan Keperluan Fungsian 135
8.3 Rujukan Perundangan 135

### Page 9

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
Senarai Gambar Rajah
- Rajah 1: Rajah Hierarki Fungsian Sistem Digital ST
- Rajah 2: Rajah Use Case Keseluruhan Sistem Digital ST
- Rajah 3: Rajah Use Case — Pendaftaran Orang Kompeten Elektrik (RG-KE)
- Rajah 4: Rajah Hubungan Entiti (ERD) Teras
- Rajah 5: Rajah Konteks Sistem Digital ST (DFD Aras 0)
- Rajah 6: Rajah Aliran Data (DFD Aras 1)
- Rajah 7: Rajah Aktiviti (Swimlane) Aliran Permohonan Hujung-ke-Hujung
- Rajah 8: Carta Alir PFD-RG-KE-NA — Permohonan Pendaftaran Kompeten (Elektrik)
- Rajah 9: Rajah Use Case — Modul LC-LE: Pelesenan Elektrik
- Rajah 10: Rajah Aliran Data (DFD) — Modul LC-LE: Pelesenan Elektrik
- Rajah 11: Rajah Hubungan Entiti (ERD) — Modul LC-LE: Pelesenan Elektrik
- Rajah 12: Carta Alir PFD-LC-LE-NA — Permohonan Pelesenan Elektrik
- Rajah 13: Rajah Use Case — Modul LC-PE: Pepasangan Elektrik
- Rajah 14: Rajah Aliran Data (DFD) — Modul LC-PE: Pepasangan Elektrik
- Rajah 15: Rajah Hubungan Entiti (ERD) — Modul LC-PE: Pepasangan Elektrik
- Rajah 16: Carta Alir PFD-LC-PE-NA — Permohonan Pepasangan Elektrik
- Rajah 17: Rajah Use Case — Modul LC-LG: Pelesenan Gas
- Rajah 18: Rajah Aliran Data (DFD) — Modul LC-LG: Pelesenan Gas
- Rajah 19: Rajah Hubungan Entiti (ERD) — Modul LC-LG: Pelesenan Gas
- Rajah 20: Carta Alir PFD-LC-LG-NA — Permohonan Pelesenan Gas
- Rajah 21: Rajah Use Case — Modul LC-PG: Pepasangan Gas
- Rajah 22: Rajah Aliran Data (DFD) — Modul LC-PG: Pepasangan Gas
- Rajah 23: Rajah Hubungan Entiti (ERD) — Modul LC-PG: Pepasangan Gas
- Rajah 24: Carta Alir PFD-LC-PG-NA — Permohonan Pepasangan Gas
- Rajah 25: Rajah Use Case — Modul RG-KE: Pendaftaran Orang Kompeten Elektrik
- Rajah 26: Rajah Aliran Data (DFD) — Modul RG-KE: Pendaftaran Orang Kompeten Elektrik
- Rajah 27: Rajah Hubungan Entiti (ERD) — Modul RG-KE: Pendaftaran Orang Kompeten Elektrik
- Rajah 28: Carta Alir PFD-RG-KE-NA — Permohonan Pendaftaran Kompeten (Elektrik)
- Rajah 29: Rajah Use Case — Modul RG-KG: Pendaftaran Orang Kompeten Gas
- Rajah 30: Rajah Aliran Data (DFD) — Modul RG-KG: Pendaftaran Orang Kompeten Gas
- Rajah 31: Rajah Hubungan Entiti (ERD) — Modul RG-KG: Pendaftaran Orang Kompeten Gas
- Rajah 32: Carta Alir PFD-RG-KG-NA — Permohonan Pendaftaran Kompeten (Gas)
- Rajah 33: Rajah Use Case — Modul RG-CE: Pendaftaran Kontraktor Elektrik
- Rajah 34: Rajah Aliran Data (DFD) — Modul RG-CE: Pendaftaran Kontraktor Elektrik
- Rajah 35: Rajah Hubungan Entiti (ERD) — Modul RG-CE: Pendaftaran Kontraktor Elektrik
- Rajah 36: Carta Alir PFD-RG-CE-NA — Permohonan Pendaftaran Kontraktor (Elektrik)
- Rajah 37: Rajah Use Case — Modul RG-CG: Pendaftaran Kontraktor Gas
- Rajah 38: Rajah Aliran Data (DFD) — Modul RG-CG: Pendaftaran Kontraktor Gas

### Page 10

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
- Rajah 39: Rajah Hubungan Entiti (ERD) — Modul RG-CG: Pendaftaran Kontraktor Gas
- Rajah 40: Carta Alir PFD-RG-CG-NA — Permohonan Pendaftaran Kontraktor (Gas)
- Rajah 41: Rajah Use Case — Modul PE-ID: Pengurusan ID & Akaun Pengguna
- Rajah 42: Rajah Aliran Data (DFD) — Modul PE-ID: Pengurusan ID & Akaun Pengguna
- Rajah 43: Rajah Hubungan Entiti (ERD) — Modul PE-ID: Pengurusan ID & Akaun Pengguna
- Rajah 44: Carta Alir PFD-PE-ID-NA — Pengurusan ID & Akaun Pengguna
- Rajah 45: Rajah Use Case — Modul PE-RV: Pengurusan Hasil
- Rajah 46: Rajah Aliran Data (DFD) — Modul PE-RV: Pengurusan Hasil
- Rajah 47: Rajah Hubungan Entiti (ERD) — Modul PE-RV: Pengurusan Hasil
- Rajah 48: Carta Alir PFD-PE-RV-NA — Pengurusan Hasil & Bayaran
- Rajah 49: Rajah Use Case — Modul PE-SV: Lawatan Tapak / Pemeriksaan / Audit
- Rajah 50: Rajah Aliran Data (DFD) — Modul PE-SV: Lawatan Tapak / Pemeriksaan / Audit
- Rajah 51: Rajah Hubungan Entiti (ERD) — Modul PE-SV: Lawatan Tapak / Pemeriksaan / Audit
- Rajah 52: Carta Alir PFD-PE-SV-NA — Lawatan Tapak / Pemeriksaan / Audit
- Rajah 53: Rajah Use Case — Modul PE-JK: Kelulusan Jawatankuasa
- Rajah 54: Rajah Aliran Data (DFD) — Modul PE-JK: Kelulusan Jawatankuasa
- Rajah 55: Rajah Hubungan Entiti (ERD) — Modul PE-JK: Kelulusan Jawatankuasa
- Rajah 56: Carta Alir PFD-PE-JK-NA — Kelulusan Jawatankuasa
- Rajah 57: Rajah Use Case — Modul CC-XE: Peperiksaan Elektrik
- Rajah 58: Rajah Aliran Data (DFD) — Modul CC-XE: Peperiksaan Elektrik
- Rajah 59: Rajah Hubungan Entiti (ERD) — Modul CC-XE: Peperiksaan Elektrik
- Rajah 60: Carta Alir PFD-CC-XE-NA — Permohonan Peperiksaan Elektrik
- Rajah 61: Rajah Use Case — Modul CC-XG: Peperiksaan Gas
- Rajah 62: Rajah Aliran Data (DFD) — Modul CC-XG: Peperiksaan Gas
- Rajah 63: Rajah Hubungan Entiti (ERD) — Modul CC-XG: Peperiksaan Gas
- Rajah 64: Carta Alir PFD-CC-XG-NA — Permohonan Peperiksaan Gas
- Rajah 65: Rajah Use Case — Modul CC-CD: Pembangunan Berterusan (CPD)
- Rajah 66: Rajah Aliran Data (DFD) — Modul CC-CD: Pembangunan Berterusan (CPD)
- Rajah 67: Rajah Hubungan Entiti (ERD) — Modul CC-CD: Pembangunan Berterusan (CPD)
- Rajah 68: Carta Alir PFD-CC-CD-NA — Pembangunan Berterusan (CPD)
- Rajah 69: Rajah Use Case — Modul EE-KT: Kecekapan Tenaga
- Rajah 70: Rajah Aliran Data (DFD) — Modul EE-KT: Kecekapan Tenaga
- Rajah 71: Rajah Hubungan Entiti (ERD) — Modul EE-KT: Kecekapan Tenaga
- Rajah 72: Carta Alir PFD-EE-KT-NA — Kecekapan Tenaga (Pengurus/Audit Tenaga)
- Rajah 73: Rajah Use Case — Modul EN-IV: Penguatkuasaan & Penyiasatan
- Rajah 74: Rajah Aliran Data (DFD) — Modul EN-IV: Penguatkuasaan & Penyiasatan
- Rajah 75: Rajah Hubungan Entiti (ERD) — Modul EN-IV: Penguatkuasaan & Penyiasatan
- Rajah 76: Carta Alir PFD-EN-IV-NA — Penguatkuasaan & Penyiasatan

### Page 11

SRS — Sistem Digital Suruhanjaya Tenaga (ST)

### Page 12

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
Senarai Jadual
- Jadual 1: Senarai 17 Modul Sistem Digital ST mengikut Domain & Fasa
- Jadual 2: Senarai Aktor Sistem
- Jadual 3: Hierarki Fungsian — Transaksi mengikut Modul
- Jadual 4: Pemadanan Aktor dengan Fungsi Sistem
- Jadual 5: Senarai Use Case mengikut Modul
- Jadual 6: Definisi Kamus Data (Entiti Teras)
- Jadual 7: Definisi Aliran Data
- Jadual 8: Keperluan Bukan Fungsian (Ciri-ciri Kualiti Sistem)
- Jadual 9: Anggaran Saiz Sistem (Function Point)
- Jadual 10: Matriks Keterunutan Keperluan Fungsian

### Page 13

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
Definisi dan Akronim 
Akronim 
Definisi 
Akronim Keterangan
ST Suruhanjaya Tenaga
SRS Software Requirements Specification
SDS System Design Specification
KRISA Buku Panduan Kejuruteraan Sistem Aplikasi Sektor Awam
OCR Optical Character Recognition
AI Artificial Intelligence
VLM Vision-Language Model
LOA Limits of Authority
SOS Seksyen Operasi Perkhidmatan
RBAC Role-Based Access Control
SSO Single Sign-On
API Application Programming Interface
FPX Financial Process Exchange
QR Quick Response Code
CMS Content Management System
OK Orang Kompeten
CPD Continuous Professional Development
UAT User Acceptance Test
FAT Final Acceptance Test
ERD Entity Relationship Diagram
DFD Data Flow Diagram
CPD Pembangunan Berterusan
Terma / Istilah Definisi
Orang Kompeten Individu berkelayakan & berdaftar dengan ST untuk kerja pepasangan elektrik/gas.
Perakuan Digital Sijil pelesenan/pendaftaran digital berserta kod QR, metadata & tandatangan digital.
Piagam Pelanggan Tempoh pemprosesan permohonan yang ditetapkan oleh ST.
Limits of Authority (LOA) Had kuasa kelulusan mengikut jenis/kategori lesen atau pendaftaran.

### Page 14

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
Sumber Rujukan 
1.Appendix G — Keterangan Modul
2.Appendix D1 — Jadual Pematuhan Spesifikasi Fungsi
3.Appendix D11 — Jadual Pematuhan Pembentangan Prototaip
4.Buku Panduan Kejuruteraan Sistem Aplikasi Sektor Awam (KRISA), BPI MAMPU, 2019
5.ISO/IEC/IEEE 29148-2011; IEEE Std 830-1998
6.Akta Bekalan Elektrik 1990 (Akta 447) & Peraturan berkaitan
7.Akta Bekalan Gas 1993 (Akta 501) & Peraturan berkaitan
8.Akta Kecekapan dan Konservasi Tenaga 2024

### Page 15

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
1. PENGENALAN 
1.1 Tujuan Sistem 
Sistem Digital ST dibangunkan untuk mendigital dan menyepadukan keseluruhan perkhidmatan teras 
Suruhanjaya Tenaga — pelesenan, pendaftaran, pensijilan/kompetensi, kecekapan tenaga dan 
penguatkuasaan — dalam satu platform digital bersepadu, mesra pengguna dan selamat. Objektif 
utama:
- Membolehkan permohonan dibuat sepenuhnya secara atas talian oleh individu & syarikat 
berdaftar.
- Mengautomasikan aliran semakan, pengesahan & kelulusan mengikut LOA dan Piagam 
Pelanggan.
- Menjana Perakuan Pelesenan/Pendaftaran digital berserta kod QR & tandatangan digital.
- Menyepadukan bayaran fi dalam talian (ST Payment Gateway) serta pemantauan hasil.
- Menyediakan pengesahan dokumen sokongan automatik menggunakan OCR & AI.
- Merekod jejak audit komprehensif bagi setiap transaksi.
1.2 Skop Sistem 
1.2.1 Gambaran Keseluruhan 
Skop merangkumi Portal Digital ST (Landing Page, Sistem Digital ST Awam, Sistem Digital ST 
Kakitangan) serta 17 modul perkhidmatan, dilaksanakan dalam dua (2) fasa. Sistem turut merangkumi 
integrasi sistem dalaman & luaran, migrasi data, enjin aliran kerja, CMS, pengesahan dokumen OCR/AI, 
dan keselamatan siber.
1.2.2 Senarai Modul mengikut Domain 
Domain Modul Fasa
Pelesenan & Pepasangan LC-LE — Pelesenan Elektrik Fasa 1
Pelesenan & Pepasangan LC-PE — Pepasangan Elektrik Fasa 1
Pelesenan & Pepasangan LC-LG — Pelesenan Gas Fasa 1
Pelesenan & Pepasangan LC-PG — Pepasangan Gas Fasa 1
Pendaftaran RG-KE — Pendaftaran Orang Kompeten Elektrik Fasa 1
Pendaftaran RG-KG — Pendaftaran Orang Kompeten Gas Fasa 1
Pendaftaran RG-CE — Pendaftaran Kontraktor Elektrik Fasa 1
Pendaftaran RG-CG — Pendaftaran Kontraktor Gas Fasa 1
Operasi & Perkhidmatan PE-ID — Pengurusan ID & Akaun Pengguna Fasa 1
Operasi & Perkhidmatan PE-RV — Pengurusan Hasil Fasa 1
Operasi & Perkhidmatan PE-SV — Lawatan Tapak / Pemeriksaan / Audit Fasa 1
Operasi & Perkhidmatan PE-JK — Kelulusan Jawatankuasa Fasa 1
Pensijilan & Kompetensi CC-XE — Peperiksaan Elektrik Fasa 2
Pensijilan & Kompetensi CC-XG — Peperiksaan Gas Fasa 2

### Page 16

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
Jadual 1: Senarai 17 Modul Sistem Digital ST mengikut Domain & Fasa
1.2.3 Ciri Sepunya Semua Modul
- Permohonan hanya oleh individu/syarikat berdaftar dengan akaun pengguna ST.
- Permohonan sepenuhnya atas talian.
- Notifikasi & pemantauan bayaran fi; pembatalan automatik jika lewat.
- Aliran semakan dokumen (SOS) & semakan teknikal automatik.
- Aliran kelulusan mengikut kategori/jenis & Limits of Authority (LOA).
- Penjanaan Perakuan digital berserta kod QR, metadata & tandatangan digital.
- Pengiraan masa pemprosesan mengikut Piagam Pelanggan.
- Rekod jejak audit komprehensif.
- Pengesahan dokumen sokongan automatik (OCR & AI).
1.3 Senarai Aktor Sistem 
Jadual 2: Senarai Aktor Sistem
Pensijilan & Kompetensi CC-CD — Pembangunan Berterusan (CPD) Fasa 2
Kecekapan & Penguatkuasaan EE-KT — Kecekapan Tenaga Fasa 2
Kecekapan & Penguatkuasaan EN-IV — Penguatkuasaan & Penyiasatan Fasa 2
Domain Modul Fasa
Aktor Keterangan
Pemohon Awam / Individu Individu berdaftar yang memohon perkhidmatan & membuat bayaran.
Wakil Syarikat / Kontraktor
Wakil syarikat berdaftar yang memohon pelesenan/pendaftaran kontraktor/
pepasangan.
Orang Kompeten (OK) Individu berkelayakan yang menerima/mengesah pelantikan.
Majikan Mengesahkan pelantikan/perhubungan pekerjaan OK.
Pegawai SOS Menyemak kelengkapan dokumen permohonan.
Pegawai Teknikal Melaksanakan semakan teknikal mengikut bidang.
Pegawai Pelulus Meluluskan permohonan mengikut LOA.
Ahli Jawatankuasa Kelulusan peringkat jawatankuasa/kementerian.
Pegawai Penguatkuasa/Penyiasat Mengurus aduan, kes, siasatan & kompaun.
Pentadbir Sistem Mengurus akaun, peranan, kandungan (CMS), konfigurasi & pemantauan.

### Page 17

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
2. PEMODELAN FUNGSI SISTEM 
2.1 Penggunaan Notasi 
Model Fungsi Sistem menggunakan notasi hierarki fungsian: Sistem → Subsistem/Domain → Modul → 
Submodul/Transaksi. Setiap modul dirujuk dengan kod standard (cth. LC-LE).
2.2 Rajah Hierarki Fungsian Sistem 
 
Rajah 1: Rajah Hierarki Fungsian Sistem Digital ST
2.2.2 Pecahan Transaksi mengikut Modul 
Modul Transaksi / Submodul Utama
LC-LE — Pelesenan Elektrik
Permohonan Pelesenan Baru; Permohonan Pelesenan Semula; Permohonan Pembatalan 
Pelesenan; Permohonan Pindaaan Maklumat Lesen; Pemantauan Bayaran Fi Tahunan dan 
Pengiraan Surcaj bagi Bayaran; Pemantauan Jaminan Bank; Pemantauan Syarat-Syarat 
Lesen; Audit Pematuhan Peraturan (Regulatory Compliance Audit); Borang I; Kutipan 
Caruman Kumpulan Wang Industri Elektrik; Proses Tuntutan Pelarasan ICPT (Imbalance 
Cost Pass Through); Pemantauan Lesen Tamat Tempoh
LC-PE — Pepasangan Elektrik
Pepasangan yang menerima tenaga daripada pemegang lesen pada; Janakuasa tunggu 
sedia yang dipasang bagi maksud membekal tenaga

### Page 18

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
LC-LG — Pelesenan Gas
Permohonan Pelesenan (pelbagai jenis lesen gas); Pembaharuan Pelesenan; Permohonan 
Pembatalan Pelesenan; Permohonan Perubahan Skop dan Kawasan Pembekalan; 
Pemantauan Bayaran Fi Tahunan; Pemantauan Forecast vs. Actual Declaration Reserve 
Capacity dan Proses; Pembayaran Balik Lebihan Fi Tahunan; Pemantauan Jaminan Bank; 
Pemantauan Laporan Senggaraan; Pemantauan Syarat-Syarat Lesen; Proses Pengaktifan 
Semula Lesen selepas Rayuan
LC-PG — Pepasangan Gas
Permohonan Kelulusan untuk Memasang; Permohonan Kelulusan untuk Mengendali; 
Permohonan Menaik Taraf/Menurun Taraf Sistem Pepasangan Gas; Permohonan 
Pertukaran Hakmilik Mengendali Pepasangan Gas; Permohonan Pembatalan Kelulusan 
Memasang dan/atau Mengendali; Permohonan Nombor Rujukan Khas (Special Reference 
Number); Pemeriksaan Berkala; Pembatalan Kelulusan melalui Penguatkuasaan
RG-KE — Pendaftaran Orang 
Kompeten Elektrik
Permohonan Pendaftaran Orang Kompeten; Permohonan Pendaftaran Orang Kompeten 
oleh Majikan (selain daripada; Permohonan Pembaharuan Pendaftaran Orang Kompeten; 
Permohonan Pembaharuan Pendaftaran Orang Kompeten oleh Majikan; Permohonan 
Penamatan Pendaftaran Orang Kompeten; Permohonan Penamatan Pendaftaran Orang 
Kompeten oleh Majikan; Pembatalan Pendaftaran Orang Kompeten melalui 
Penguatkuasaan; Permohonan Pendaftaran Lebih Dari Satu Majikan
RG-KG — Pendaftaran Orang 
Kompeten Gas
Permohonan Pendaftaran Orang Kompeten; Permohonan Pendaftaran Orang Kompeten 
oleh Majikan (selain daripada; Permohonan Pembaharuan Pendaftaran Orang Kompeten; 
Permohonan Pembaharuan Pendaftaran Orang Kompeten oleh Majikan; Permohonan 
Penamatan Pendaftaran Orang Kompeten; Permohonan Penamatan Pendaftaran Orang 
Kompeten oleh Majikan; Pembatalan Pendaftaran Orang Kompeten melalui 
Penguatkuasaan
RG-CE — Pendaftaran Kontraktor 
Elektrik
Permohonan Pendaftaran Kontraktor Elektrik; Permohonan Pembaharuan Pendaftaran 
Kontraktor Elektrik; Permohonan Pendaftaran Orang Kompeten oleh Kontraktor Elektrik; 
Permohonan Penamatan Pendaftaran Orang Kompeten oleh Kontraktor; Permohonan 
Perubahan Kelas Kontraktor; Permohonan Penamatan Pendaftaran Kontraktor Elektrik; 
Pembatalan Pendaftaran Kontraktor Elektrik melalui Penguatkuasaan
RG-CG — Pendaftaran Kontraktor 
Gas
Permohonan Pendaftaran Kontraktor Gas; Permohonan Pembaharuan Pendaftaran 
Kontraktor Gas; Permohonan Pendaftaran Orang Kompeten oleh Kontraktor Gas; 
Permohonan Penamatan Pendaftaran Orang Kompeten oleh Kontraktor; Permohonan 
Perubahan Kelas Kontraktor; Permohonan Penamatan Pendaftaran Kontraktor Gas; 
Pembatalan Pendaftaran Kontraktor Gas melalui Penguatkuasaan
PE-ID — Pengurusan ID & Akaun 
Pengguna
Pendaftaran Pengguna; Pendaftaran Kakitangan ST; Pengurusan Akses Pengguna; 
Pendaftaran Entiti Bisnes / Organisasi; Pertukaran Maklumat Pengguna
PE-RV — Pengurusan Hasil
Proses Bayaran Dalam Talian Menerusi FPX/DOBW; Proses Bayaran Menggunakan 
Virtual Account; Permohonan Virtual Account Tetap; Proses Bayaran Kompaun Dalam 
Talian (Pengguna Berdaftar dan; Pengurusan Penerimaan Bayaran Kompaun Manual 
Pembatalan; Proses Bayaran Terbuka; Pembatalan Resit; Pemulangan Bayaran; Laporan 
Penerimaan Hasil Harian; Laporan Unjuran Hasil; Laporan Serahan Bulanan
PE-SV — Lawatan Tapak / 
Pemeriksaan / Audit
Perancangan dan Penjadualan Pemeriksaan Tapak/Audit; Pelaksanaan Pemeriksaan 
Tapak/Audit dan Penjanaan Laporan; Pemantauan Notis Tindakan Pembetulan; 
Penyediaan dan Kemaskini Senarai Semak Borang/Pemeriksaan/Audit
PE-JK — Kelulusan Jawatankuasa
Penjanaan Kertas Cadangan Kelulusan.; Wujud/Kemaskini Templat Kertas Cadangan.; 
Kemasukan keputusan kelulusan jawatankuasa termasuk di kementerian
Modul Transaksi / Submodul Utama

### Page 19

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
Jadual 3: Hierarki Fungsian — Transaksi mengikut Modul
2.3 Jadual Pemadanan Aktor dengan Fungsi Sistem 
Jadual 4: Pemadanan Aktor dengan Fungsi Sistem
CC-XE — Peperiksaan Elektrik
Penyediaan dan Penerbitan Jadual Peperiksaan ST; Permohonan Menduduki Peperiksaan 
dan Naiktaraf Kompetensi/PV; Pelaksanaan Peperiksaan Teori (Bertulis); Permohonan 
Menduduki Peperiksaan Praktikal; Pelaksanaan Peperiksaan Praktikal; Permohonan 
Menduduki Temuduga; Penyediaan Kertas Kerja; Pelaksanaan Temuduga; Permohonan 
Penjadualan Semula Peperiksaan; Pembatalan Perakuan Kekompetenan melalui 
Penguatkuasaan; Pembatalan Peperiksaan melalui Penguatkuasaan; Pentauliahan Institusi 
Latihan - Kursus Kekompetenan
CC-XG — Peperiksaan Gas
Penyediaan dan Penerbitan Jadual Peperiksaan ST; Permohonan Menduduki Peperiksaan; 
Pelaksanaan Peperiksaan Teori (Bertulis); Permohonan Menduduki Temuduga; 
Pelaksanaan Temuduga; Permohonan Penjadualan Semula Peperiksaan; Pembatalan 
Perakuan Kekompetenan melalui Penguatkuasaan; Pembatalan Peperiksaan melalui 
Penguatkuasaan; Pentauliahan Institusi Latihan - Kursus Kekompetenan; Pembaharuan 
Pentauliahan Institusi Latihan - Kursus Kekompetenan; Permohonan Pembatalan 
Pentauliahan; Pembatalan Pentauliahan melalui Penguatkuasaan
CC-CD — Pembangunan Berterusan 
(CPD)
Penyediaan dan Penerbitan Skema Pembangunan Kekompetenan Individu; Permohonan 
menduduki kursus mandatori kekompetenan ST; Kemaskini maklumat CDP dan muat 
naik dokumen sokongan; Pengiraan mata CDP terkumpul; penggunaan; baki dan tempoh 
sah laku
EE-KT — Kecekapan Tenaga
Permohonan Pendaftaran Pengurus Tenaga dan Juruaudit Tenaga; Penjadualan Sesi 
Temuduga (Panel dan Calon); Pelaksanaan Sesi Temuduga; Repository bank soalan bagi 
sesi ujian bertulis Juruaudit Tenaga dan; Pelaksanaan pengiraan markah bagi Pendaftaran 
Pengurus Tenaga dan; Permohonan Pembaharuan Sijil Amalan Pengurus Tenaga dan 
Juruaudit; Pentakrifan Sebagai Pengguna Tenaga; Pelantikan Pengurus Tenaga oleh 
Pengguna Tenaga; Tatacara Pelantikan Pengurus Tenaga; Permohonan Perletakan 
Jawatan/Penamatan Perkhidmatan Pengurus; Pembatalan Pendaftaran Pengurus Tenaga 
menerusi Penguatkuasaan; Pelantikan Juruaudit Tenaga
EN-IV — Penguatkuasaan & 
Penyiasatan
Perancangan dan Penjadualan Aktiviti Penguatkuasaan; Pengurusan Aktiviti 
Penguatkuasaan Ketidakpatuhan dari Modul; Pembatalan Perakuan oleh Penguatkuasaan; 
Pengurusan Aduan; Pelaksanaan Aktiviti Pemeriksaan dan Serbuan; Pengurusan dan 
Penyiasatan Kes Kemalangan/Gangguan; Pengeluaran dan Pembatalan Stop Work Order; 
Pembukaan Kertas Siasatan; Pertukaran Pegawai Siasatan; Pelaksanaan Kompaun; 
Pengurusan Barang Rampasan; Pelupusan Barang Rampasan
Modul Transaksi / Submodul Utama
Aktor
Permohona
n
Bayaran
Semakan 
Dok.
Semakan 
Tek.
KelulusanPentadbiran
Pemohon / Wakil Syarikat ✓ ✓
Orang Kompeten / Majikan ✓
Pegawai SOS ✓
Pegawai Teknikal ✓
Pegawai Pelulus / JK ✓
Pentadbir Sistem ✓

### Page 20

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
3. PEMODELAN USE CASE 
3.1 Penggunaan Notasi 
Model Use Case menggunakan notasi UML: aktor, use case (ellipse), sempadan sistem, serta hubungan 
association, «include» dan «extend». Rajah use case, rajah aktiviti (swimlane) dan rajah jujukan bagi 
setiap modul disediakan sebagai fail PlantUML (uc_<kod>.puml, act_<kod>.puml, seq_<kod>.puml).
3.2 Model Use Case 
3.2.1 Rajah Use Case Keseluruhan Sistem 
 
Rajah 2: Rajah Use Case Keseluruhan Sistem Digital ST
3.2.2 Senarai Use Case mengikut Modul 
Modul Use Case Utama
LC-LE — Pelesenan Elektrik
UC-LC-LE-01: Permohonan Pelesenan Baru; UC-LC-LE-02: Permohonan Pelesenan 
Semula; UC-LC-LE-03: Permohonan Pembatalan Pelesenan; UC-LC-LE-04: Permohonan 
Pindaaan Maklumat Lesen; UC-LC-LE-05: Pemantauan Bayaran Fi Tahunan dan 
Pengiraan Surcaj bagi Bayaran; UC-LC-LE-06: Pemantauan Jaminan Bank
LC-PE — Pepasangan Elektrik
UC-LC-PE-01: Pepasangan yang menerima tenaga daripada pemegang lesen pada; UC-
LC-PE-02: Janakuasa tunggu sedia yang dipasang bagi maksud membekal tenaga

### Page 21

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
LC-LG — Pelesenan Gas
UC-LC-LG-01: Permohonan Pelesenan (pelbagai jenis lesen gas); UC-LC-LG-02: 
Pembaharuan Pelesenan; UC-LC-LG-03: Permohonan Pembatalan Pelesenan; UC-LC-
LG-04: Permohonan Perubahan Skop dan Kawasan Pembekalan; UC-LC-LG-05: 
Pemantauan Bayaran Fi Tahunan; UC-LC-LG-06: Pemantauan Forecast vs. Actual 
Declaration Reserve Capacity dan Proses
LC-PG — Pepasangan Gas
UC-LC-PG-01: Permohonan Kelulusan untuk Memasang; UC-LC-PG-02: Permohonan 
Kelulusan untuk Mengendali; UC-LC-PG-03: Permohonan Menaik Taraf/Menurun Taraf 
Sistem Pepasangan Gas; UC-LC-PG-04: Permohonan Pertukaran Hakmilik Mengendali 
Pepasangan Gas; UC-LC-PG-05: Permohonan Pembatalan Kelulusan Memasang dan/atau 
Mengendali; UC-LC-PG-06: Permohonan Nombor Rujukan Khas (Special Reference 
Number)
RG-KE — Pendaftaran Orang 
Kompeten Elektrik
UC-RG-KE-01: Permohonan Pendaftaran Orang Kompeten; UC-RG-KE-02: Permohonan 
Pendaftaran Orang Kompeten oleh Majikan (selain daripada; UC-RG-KE-03: 
Permohonan Pembaharuan Pendaftaran Orang Kompeten; UC-RG-KE-04: Permohonan 
Pembaharuan Pendaftaran Orang Kompeten oleh Majikan; UC-RG-KE-05: Permohonan 
Penamatan Pendaftaran Orang Kompeten; UC-RG-KE-06: Permohonan Penamatan 
Pendaftaran Orang Kompeten oleh Majikan
RG-KG — Pendaftaran Orang 
Kompeten Gas
UC-RG-KG-01: Permohonan Pendaftaran Orang Kompeten; UC-RG-KG-02: 
Permohonan Pendaftaran Orang Kompeten oleh Majikan (selain daripada; UC-RG-
KG-03: Permohonan Pembaharuan Pendaftaran Orang Kompeten; UC-RG-KG-04: 
Permohonan Pembaharuan Pendaftaran Orang Kompeten oleh Majikan; UC-RG-KG-05: 
Permohonan Penamatan Pendaftaran Orang Kompeten; UC-RG-KG-06: Permohonan 
Penamatan Pendaftaran Orang Kompeten oleh Majikan
RG-CE — Pendaftaran Kontraktor 
Elektrik
UC-RG-CE-01: Permohonan Pendaftaran Kontraktor Elektrik; UC-RG-CE-02: 
Permohonan Pembaharuan Pendaftaran Kontraktor Elektrik; UC-RG-CE-03: Permohonan 
Pendaftaran Orang Kompeten oleh Kontraktor Elektrik; UC-RG-CE-04: Permohonan 
Penamatan Pendaftaran Orang Kompeten oleh Kontraktor; UC-RG-CE-05: Permohonan 
Perubahan Kelas Kontraktor; UC-RG-CE-06: Permohonan Penamatan Pendaftaran 
Kontraktor Elektrik
RG-CG — Pendaftaran Kontraktor 
Gas
UC-RG-CG-01: Permohonan Pendaftaran Kontraktor Gas; UC-RG-CG-02: Permohonan 
Pembaharuan Pendaftaran Kontraktor Gas; UC-RG-CG-03: Permohonan Pendaftaran 
Orang Kompeten oleh Kontraktor Gas; UC-RG-CG-04: Permohonan Penamatan 
Pendaftaran Orang Kompeten oleh Kontraktor; UC-RG-CG-05: Permohonan Perubahan 
Kelas Kontraktor; UC-RG-CG-06: Permohonan Penamatan Pendaftaran Kontraktor Gas
PE-ID — Pengurusan ID & Akaun 
Pengguna
UC-PE-ID-01: Pendaftaran Pengguna; UC-PE-ID-02: Pendaftaran Kakitangan ST; UC-
PE-ID-03: Pengurusan Akses Pengguna; UC-PE-ID-04: Pendaftaran Entiti Bisnes / 
Organisasi; UC-PE-ID-05: Pertukaran Maklumat Pengguna
PE-RV — Pengurusan Hasil
UC-PE-RV-01: Proses Bayaran Dalam Talian Menerusi FPX/DOBW; UC-PE-RV-02: 
Proses Bayaran Menggunakan Virtual Account; UC-PE-RV-03: Permohonan Virtual 
Account Tetap; UC-PE-RV-04: Proses Bayaran Kompaun Dalam Talian (Pengguna 
Berdaftar dan; UC-PE-RV-05: Pengurusan Penerimaan Bayaran Kompaun Manual 
Pembatalan; UC-PE-RV-06: Proses Bayaran Terbuka
PE-SV — Lawatan Tapak / 
Pemeriksaan / Audit
UC-PE-SV-01: Perancangan dan Penjadualan Pemeriksaan Tapak/Audit; UC-PE-SV-02: 
Pelaksanaan Pemeriksaan Tapak/Audit dan Penjanaan Laporan; UC-PE-SV-03: 
Pemantauan Notis Tindakan Pembetulan; UC-PE-SV-04: Penyediaan dan Kemaskini 
Senarai Semak Borang/Pemeriksaan/Audit
PE-JK — Kelulusan Jawatankuasa
UC-PE-JK-01: Penjanaan Kertas Cadangan Kelulusan.; UC-PE-JK-02: Wujud/Kemaskini 
Templat Kertas Cadangan.; UC-PE-JK-03: Kemasukan keputusan kelulusan jawatankuasa 
termasuk di kementerian
Modul Use Case Utama

### Page 22

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
Jadual 5: Senarai Use Case mengikut Modul
CC-XE — Peperiksaan Elektrik
UC-CC-XE-01: Penyediaan dan Penerbitan Jadual Peperiksaan ST; UC-CC-XE-02: 
Permohonan Menduduki Peperiksaan dan Naiktaraf Kompetensi/PV; UC-CC-XE-03: 
Pelaksanaan Peperiksaan Teori (Bertulis); UC-CC-XE-04: Permohonan Menduduki 
Peperiksaan Praktikal; UC-CC-XE-05: Pelaksanaan Peperiksaan Praktikal; UC-CC-
XE-06: Permohonan Menduduki Temuduga
CC-XG — Peperiksaan Gas
UC-CC-XG-01: Penyediaan dan Penerbitan Jadual Peperiksaan ST; UC-CC-XG-02: 
Permohonan Menduduki Peperiksaan; UC-CC-XG-03: Pelaksanaan Peperiksaan Teori 
(Bertulis); UC-CC-XG-04: Permohonan Menduduki Temuduga; UC-CC-XG-05: 
Pelaksanaan Temuduga; UC-CC-XG-06: Permohonan Penjadualan Semula Peperiksaan
CC-CD — Pembangunan Berterusan 
(CPD)
UC-CC-CD-01: Penyediaan dan Penerbitan Skema Pembangunan Kekompetenan 
Individu; UC-CC-CD-02: Permohonan menduduki kursus mandatori kekompetenan ST; 
UC-CC-CD-03: Kemaskini maklumat CDP dan muat naik dokumen sokongan; UC-CC-
CD-04: Pengiraan mata CDP terkumpul; penggunaan; baki dan tempoh sah laku
EE-KT — Kecekapan Tenaga
UC-EE-KT-01: Permohonan Pendaftaran Pengurus Tenaga dan Juruaudit Tenaga; UC-EE-
KT-02: Penjadualan Sesi Temuduga (Panel dan Calon); UC-EE-KT-03: Pelaksanaan Sesi 
Temuduga; UC-EE-KT-04: Repository bank soalan bagi sesi ujian bertulis Juruaudit 
Tenaga dan; UC-EE-KT-05: Pelaksanaan pengiraan markah bagi Pendaftaran Pengurus 
Tenaga dan; UC-EE-KT-06: Permohonan Pembaharuan Sijil Amalan Pengurus Tenaga 
dan Juruaudit
EN-IV — Penguatkuasaan & 
Penyiasatan
UC-EN-IV-01: Perancangan dan Penjadualan Aktiviti Penguatkuasaan; UC-EN-IV-02: 
Pengurusan Aktiviti Penguatkuasaan Ketidakpatuhan dari Modul; UC-EN-IV-03: 
Pembatalan Perakuan oleh Penguatkuasaan; UC-EN-IV-04: Pengurusan Aduan; UC-EN-
IV-05: Pelaksanaan Aktiviti Pemeriksaan dan Serbuan; UC-EN-IV-06: Pengurusan dan 
Penyiasatan Kes Kemalangan/Gangguan
Modul Use Case Utama

### Page 23

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
3.2.3 Contoh Rajah Use Case & Aliran (Modul RG-KE) 
 
Rajah 3: Rajah Use Case — Pendaftaran Orang Kompeten Elektrik (RG-KE)

### Page 24

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
4. PEMODELAN MAKLUMAT 
4.1 Penggunaan Notasi 
Model Maklumat menggunakan notasi Rajah Hubungan Entiti (ERD) dengan kardinaliti 1:1, 1:N dan N:M.
4.2 Model Maklumat (ERD) 
 
Rajah 4: Rajah Hubungan Entiti (ERD) Teras
4.3 Definisi Kamus Data 
Jadual 6: Definisi Kamus Data (Entiti Teras)
Entiti Atribut Utama Keterangan
PENGGUNA
id_pengguna (PK), no_kp/no_pendaftaran, nama, emel, 
no_telefon, jenis_pengguna, status_akaun
Akaun individu/syarikat berdaftar.
AKAUN_PERANAN id_peranan (PK), id_pengguna (FK), peranan, skop_akses (LOA)
Pemetaan peranan & kebenaran 
(RBAC).
PERMOHONAN
id_permohonan (PK), id_pengguna (FK), kod_modul (FK), 
jenis, status, tarikh, masa_pemprosesan
Transaksi permohonan merentas 
modul.
DOKUMEN_SOKO
NGAN
id_dokumen (PK), id_permohonan (FK), jenis, lokasi_fail, 
status_OCR, versi, tag
Dokumen disahkan OCR/AI.
PEMBAYARAN
id_bayaran (PK), id_permohonan (FK), amaun, kaedah, no_resit, 
status
Transaksi bayaran fi.
PERAKUAN_DIGIT
AL
id_perakuan (PK), id_permohonan (FK), no_siri, kod_QR, 
tandatangan_digital, tarikh_luput
Perakuan digital.
JEJAK_AUDIT
id_audit (PK), id_permohonan (FK), id_pengguna, tindakan, 
nilai_lama, nilai_baru, cap_masa
Rekod jejak audit.

### Page 25

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
5. PEMODELAN PROSES SISTEM 
5.1 Penggunaan Notasi 
Model Proses menggunakan Rajah Konteks, Rajah Aliran Data (DFD) dan Rajah Aktiviti (swimlane). 
Proses = bulatan; entiti luaran = kotak; stor data = kotak data; aliran = anak panah.
5.2 Model Proses Sistem 
 
Rajah 5: Rajah Konteks Sistem Digital ST (DFD Aras 0)
 
Rajah 6: Rajah Aliran Data (DFD Aras 1)

### Page 26

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
5.2.1 Rajah Aktiviti (Swimlane) — Aliran Permohonan Umum 
 
Rajah 7: Rajah Aktiviti (Swimlane) Aliran Permohonan Hujung-ke-Hujung
Rajah aktiviti (swimlane) & rajah jujukan khusus bagi setiap 17 modul disediakan sebagai fail PlantUML 
(act_<kod>.puml dan seq_<kod>.puml).
5.2.2 Carta Alir Proses Bisnes mengikut Modul (Notasi PFD — selaras Tender) 
Selaras konvensyen tender (Business Requirement Specification / PFD), proses bisnes utama setiap 
modul dimodelkan sebagai carta alir BPMN berlorong peranan, lengkap dengan kod aktiviti PFD, 
gateway keputusan (Ya/Tidak), laluan tolak & kemaskini, serta acara Mula/Tamat. Contoh bagi modul 
Pendaftaran Kompeten Elektrik (PFD-RG-KE-NA) ditunjukkan di bawah; carta alir penuh bagi kesemua 
17 modul beserta jadual Definisi Aktiviti Fungsi Bisnes disediakan dalam Lampiran §8.1.
 
Rajah 8: Carta Alir PFD-RG-KE-NA — Permohonan Pendaftaran Kompeten (Elektrik)

### Page 27

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
5.2.3 Lapisan Integriti Kalis-Usik (Blockchain) 
Sebagai lapisan kepercayaan tambahan, cap-jari kriptografi (hash) bagi setiap Perakuan Pelesenan/
Pendaftaran, keputusan kelulusan dan transaksi kritikal ditambat (anchored) pada blockchain 
berkebenaran (permissioned distributed ledger — Hyperledger Fabric) yang beroperasi sepenuhnya on-
premise dalam sempadan berdaulat ST. Rekod pada ledger adalah tidak boleh diubah (immutable) dan 
bercap masa. Orang awam, agensi atau majikan boleh mengesahkan ketulenan & status semasa 
sesuatu perakuan dengan mengimbas kod QR, yang memadankan dokumen dengan rekod pada 
blockchain — mencegah pemalsuan sijil dan mengukuhkan integriti jejak audit.
5.3 Definisi Aliran Data 
Jadual 7: Definisi Aliran Data
ID Aliran Data Sumber → Destinasi Keterangan
AF-01 Maklumat Permohonan Pemohon → P2
Data borang, jenis perkhidmatan, 
maklumat pemohon.
AF-02 Dokumen Sokongan Pemohon → P3 Fail untuk pengesahan OCR/AI.
AF-03 Arahan Bayaran P4 → Payment Gateway Permintaan & status bayaran fi.
AF-04 Keputusan Kelulusan P5 → P6 Status kelulusan mengikut LOA.
AF-05 Perakuan Digital P6 → Pemohon (Inbox)
Perakuan + kod QR + tandatangan 
digital.

### Page 28

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
6. PENENTUAN KEPERLUAN BUKAN FUNGSIAN 
6.1 Jadual Ciri-ciri Kualiti Sistem 
Jadual 8: Keperluan Bukan Fungsian (Ciri-ciri Kualiti Sistem)
ID Ciri Kualiti Aspek Keperluan
NF-01 Prestasi Sistem Responsif; sokong pemprosesan masa nyata bagi integrasi & transaksi.
NF-02 Skalabiliti Sistem
Seni bina modular & fleksibel; modul boleh dikemas kini tanpa jejas 
kestabilan.
NF-03 Ketersediaan Sistem Sandaran berjadual & pemulihan; sokongan DRC.
NF-04 Keselamatan Sistem
Hardening, SSL, kawalan siber terhadap akses tanpa kebenaran, malware & 
kebocoran data.
NF-05 Integriti & KesahihanSistem
Tandatangan & sijil digital; pengesahan dokumen OCR/AI; jejak audit 
penuh.
NF-06 Storan Fail Sistem File storage dengan tagging/label; retensi 7 tahun.
NF-07 Aliran Kerja Sistem Workflow engine menyokong konfigurasi kelulusan mengikut LOA.
NF-08 Kebolehgunaan Dalaman Antara muka mesra, dwi-bahasa (BM/EN), papan pemuka & notifikasi.
NF-09 Kawalan Akses Dalaman RBAC, SSO, pengurusan ID berpusat (PE-ID).
NF-10 Pematuhan SLA Dalaman Kritikal: respons ≤30 min / selesai ≤4 jam; jaminan 1 tahun.
NF-11 KebolehselenggaraanDalaman Perisian versi terkini & tidak EOL dalam 5 tahun; OS RHEL.
NF-12 Integrasi Luaran Luaran
API selamat & terenkripsi ke Payment Gateway, MyDigital ID, JPN, SSM, 
TNB, CIDB, Pos Digicert.
NF-13
Pematuhan 
Perundangan
Luaran
Akta Bekalan Elektrik 1990, Akta Bekalan Gas 1993, Akta Kecekapan 
Tenaga 2024.
NF-14 Migrasi Data Luaran Migrasi data historikal + BLOB legasi secara selamat & boleh remap.
NF-15
Integriti Kalis-Usik 
(Blockchain)
Sistem
Permissioned blockchain (Hyperledger Fabric, on-premise) merekod cap-
jari (hash) perakuan digital & transaksi kritikal — tidak boleh diubah 
(immutable/tamper-proof); pengesahan ketulenan sijil menerusi kod QR 
(QR ↔ ledger).

### Page 29

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
7. PENENTUAN SAIZ SISTEM APLIKASI 
7.1 Kaedah Function Point Analysis 
Saiz dianggar menggunakan Function Point Analysis (FPA) berdasarkan elemen dalam SRS. Pengiraan 
terperinci dimuktamadkan dalam fasa rekabentuk.
Jadual 9: Anggaran Saiz Sistem (Function Point)
Jumlah UFP dianggar ~3,602; selepas pelarasan VAF, saiz fungsian dalam julat 3,200–4,000 Function 
Points.
Jenis Fungsi Contoh Elemen Bilangan Pemberat UFP
External Inputs (EI)
Borang permohonan, kemaskini, 
bayaran
~210 6 1,260
External Outputs (EO) Perakuan digital, notis, laporan~130 7 910
External Inquiries (EQ)Carian, semakan status, paparan~120 6 720
Internal Logical Files (ILF)Entiti teras & rekod modul ~60 10 600
External Interface Files (EIF)Antara muka integrasi luaran (8 sistem)~16 7 112

### Page 30

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
8. LAMPIRAN 
8.1 Spesifikasi Aktiviti & Skrin Terperinci 
Seksyen ini memperincikan setiap modul mengikut konvensyen tender (PFD): maklumat modul & antara 
muka, Carta Alir Proses Bisnes (BPMN berlorong peranan dengan kod aktiviti PFD), serta jadual Definisi 
Aktiviti Fungsi Bisnes bagi setiap aktiviti. Carta alir PFD-RG-KE-NA (Kompeten) & PFD-RG-CE-NA 
(Kontraktor) diselaras tepat dengan contoh rasmi tender (Appendix D11/G); modul lain mengikut corak 
yang sama untuk dimuktamadkan dalam fasa analisis (CRP).

### Page 31

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
8.1 Modul LC-LE — Pelesenan Elektrik 
 
Rajah 9: Rajah Use Case — Modul LC-LE: Pelesenan Elektrik
 
Rajah 10: Rajah Aliran Data (DFD) — Modul LC-LE: Pelesenan Elektrik
Elemen Keterangan
Kod Modul LC-LE
Fungsi (PFD) PFD-LC-LE-NA — Permohonan Pelesenan Elektrik
Domain / Fasa Pelesenan & Pepasangan / Fasa 1
Keterangan
Modul Pelesenan Elektrik adalah satu modul gunasama yang melibatkan permohonan pelesenan 
persendirian dan pelesenan awam bagi aktiviti penjanaan, penghantaran, pembahagian dan 
janakuasa mudah-alih berdasarkan peruntukan di bawah Akta Bekalan Elektrik 1991 (Pindaan 
2001) dan Peraturan berkaitan.
Aktor Utama Wakil Syarikat / Kontraktor
Lorong Peranan Pemohon / Pengguna, Pegawai SOS, Pegawai Teknikal, Pelulus

### Page 32

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
Rajah 11: Rajah Hubungan Entiti (ERD) — Modul LC-LE: Pelesenan Elektrik
Sub-Modul & Fungsian: 
Maklumat Antara Muka — Skrin Pengguna:
- Skrin Log Masuk & Dashboard Pengguna
- Skrin Borang Permohonan
- Skrin Muat Naik & Pengesahan Dokumen (OCR/AI)
- Skrin Notis & Bayaran Fi
- Inbox & Notifikasi
- Skrin Semakan (SOS/Teknikal)
- Skrin Kelulusan (LOA)
- Paparan & Muat Turun Perakuan Digital (QR)
- Skrin Carian & Semakan Status
- Skrin Laporan & Statistik (AIRR)
Sub-Modul Fungsian Utama
Permohonan & Pemprosesan
Permohonan Pelesenan Baru; Permohonan Pelesenan Semula; Permohonan Pembatalan 
Pelesenan; Permohonan Pindaaan Maklumat Lesen
Semakan & Kelulusan
Semakan dokumen (SOS), semakan teknikal, kelulusan mengikut LOA, kelulusan 
jawatankuasa (jika berkaitan)
Bayaran & Hasil
Penjanaan invois/notis fi, integrasi Payment Gateway, resit, pemantauan & rekonsiliasi 
hasil
Perakuan & Notifikasi Penjanaan perakuan digital + QR + e-tandatangan, notifikasi emel/inbox
Pemantauan & Pematuhan Pemantauan tarikh luput/jaminan/syarat, peringatan automatik, audit pematuhan
Pelaporan & Statistik Laporan operasi & statistik (AIRR), papan pemuka, eksport
Pentadbiran & Konfigurasi Reference table (jenis dokumen, fi, hari bayaran, ayat notifikasi), kawalan akses (RBAC)

### Page 33

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
Maklumat Antara Muka — Integrasi Sistem (API):
- ST Payment Gateway (FPX/CIMB)
- SSM (MyDataSSM)
- TNB (MyTNB)
- MyDigital ID (NACSA)
- Pos Digicert (e-Signature)
Entiti Data Utama Modul:
 
Rajah 12: Carta Alir PFD-LC-LE-NA — Permohonan Pelesenan Elektrik
Definisi Aktiviti Fungsi Bisnes (format Tender):
Entiti Atribut Utama
LESEN_ELEKTRIK no_lesen (PK), jenis, kategori, kapasiti, tarikh_luput, status
JAMINAN_BANK id (PK), no_lesen (FK), amaun, tarikh_luput
FI_TAHUNAN id (PK), no_lesen (FK), tahun, amaun, surcaj, status
DEFINISI AKTIVITI FUNGSI BISNES — PFD-LC-LE-NA-01 Membuat Permohonan
Rujukan Fungsi PFD-LC-LE-NA Rujukan Aktiviti PFD-LC-LE-NA-01
Nama Fungsi Permohonan Pelesenan ElektrikNama Aktiviti Membuat Permohonan
Keterangan Aktiviti
Pemohon mengisi borang 
permohonan Permohonan Pelesenan 
Elektrik secara atas talian dan 
memuat naik dokumen sokongan.
Aktor Pemohon / Pemegang Lesen Tanggungjawab
Melengkapkan borang & memuat 
naik dokumen sebelum 
menghantar.
Aktiviti Sebelum - Aktiviti Selepas PFD-LC-LE-NA-02
Kaedah / Operasi 
(Bagaimana)
1. Log masuk ke Dashboard 
pengguna. 
2. Pilih modul & menu Permohonan 
Baharu. 
3. Isi maklumat permohonan. 
4. Muat naik dokumen sokongan 
(pengesahan OCR/AI). 
5. Buat perakuan ketepatan 
maklumat. 
6. Hantar permohonan.

### Page 34

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
 
 
 
DEFINISI AKTIVITI FUNGSI BISNES — PFD-LC-LE-NA-02 Membuat Bayaran Fi Proses
Rujukan Fungsi PFD-LC-LE-NA Rujukan Aktiviti PFD-LC-LE-NA-02
Nama Fungsi Permohonan Pelesenan ElektrikNama Aktiviti Membuat Bayaran Fi Proses
Keterangan Aktiviti
Pemohon membuat bayaran fi proses 
melalui ST Payment Gateway (FPX).
Aktor Pemohon / Pemegang Lesen Tanggungjawab
Menjelaskan fi proses dalam 
tempoh ditetapkan.
Aktiviti Sebelum PFD-LC-LE-NA-01 Aktiviti Selepas PFD-LC-LE-NA-03
Kaedah / Operasi 
(Bagaimana)
1. Sistem mengira fi proses. 
2. Pemohon membuat bayaran 
melalui FPX. 
3. Sistem menjana resit & mengemas 
kini status.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-LC-LE-NA-03 Membuat Semakan Dokumen
Rujukan Fungsi PFD-LC-LE-NA Rujukan Aktiviti PFD-LC-LE-NA-03
Nama Fungsi Permohonan Pelesenan ElektrikNama Aktiviti Membuat Semakan Dokumen
Keterangan Aktiviti
Pegawai SOS menyemak 
kelengkapan & kesahihan dokumen 
permohonan.
Aktor Pegawai SOS Tanggungjawab
Memastikan dokumen lengkap & 
sah sebelum semakan teknikal.
Aktiviti Sebelum PFD-LC-LE-NA-02 Aktiviti Selepas PFD-LC-LE-NA-04
Kaedah / Operasi 
(Bagaimana)
1. Semak dokumen yang dimuat naik. 
2. Sahkan kelengkapan & kesahihan. 
3. Jika tidak lengkap, kembalikan 
untuk kemaskini.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-LC-LE-NA-04 Membuat Semakan Teknikal
Rujukan Fungsi PFD-LC-LE-NA Rujukan Aktiviti PFD-LC-LE-NA-04
Nama Fungsi Permohonan Pelesenan ElektrikNama Aktiviti Membuat Semakan Teknikal
Keterangan Aktiviti
Pegawai Teknikal menilai pematuhan 
teknikal permohonan Permohonan 
Pelesenan Elektrik.
Aktor Pegawai Teknikal Tanggungjawab
Menilai pematuhan teknikal & 
syarat kelayakan.
Aktiviti Sebelum PFD-LC-LE-NA-03 Aktiviti Selepas PFD-LC-LE-NA-06
Kaedah / Operasi 
(Bagaimana)
1. Semak butiran teknikal 
permohonan. 
2. Sahkan pematuhan syarat & 
peraturan. 
3. Tanda lulus/tidak lulus semakan 
teknikal.

### Page 35

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
 
 
DEFINISI AKTIVITI FUNGSI BISNES — PFD-LC-LE-NA-05 Kemaskini Permohonan
Rujukan Fungsi PFD-LC-LE-NA Rujukan Aktiviti PFD-LC-LE-NA-05
Nama Fungsi Permohonan Pelesenan ElektrikNama Aktiviti Kemaskini Permohonan
Keterangan Aktiviti
Pemohon mengemas kini 
permohonan/dokumen yang tidak 
lengkap atau perlu pembetulan.
Aktor Pemohon / Pemegang Lesen Tanggungjawab
Membetulkan & melengkapkan 
maklumat/dokumen yang diminta.
Aktiviti Sebelum
PFD-LC-LE-NA-03 / PFD-LC-LE-
NA-04
Aktiviti Selepas (kembali ke semakan)
Kaedah / Operasi 
(Bagaimana)
1. Terima notifikasi kemaskini. 
2. Betulkan maklumat / muat naik 
dokumen baharu. 
3. Hantar semula untuk semakan.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-LC-LE-NA-06 Membuat Kelulusan
Rujukan Fungsi PFD-LC-LE-NA Rujukan Aktiviti PFD-LC-LE-NA-06
Nama Fungsi Permohonan Pelesenan ElektrikNama Aktiviti Membuat Kelulusan
Keterangan Aktiviti
Pelulus membuat keputusan 
kelulusan mengikut Limit of 
Authority (LOA).
Aktor Pegawai Pelulus Tanggungjawab
Membuat keputusan lulus/tolak 
mengikut LOA.
Aktiviti Sebelum PFD-LC-LE-NA-04 Aktiviti Selepas
PFD-LC-LE-NA-07 / PFD-LC-LE-
NA-09
Kaedah / Operasi 
(Bagaimana)
1. Semak syor & dokumen sokongan. 
2. Buat keputusan mengikut LOA. 
3. Rekod keputusan dengan jejak 
audit.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-LC-LE-NA-07 Membuat Bayaran Pendaftaran
Rujukan Fungsi PFD-LC-LE-NA Rujukan Aktiviti PFD-LC-LE-NA-07
Nama Fungsi Permohonan Pelesenan ElektrikNama Aktiviti Membuat Bayaran Pendaftaran
Keterangan Aktiviti
Pemohon membuat bayaran 
pendaftaran/perakuan selepas 
permohonan diluluskan.
Aktor Pemohon / Pemegang Lesen Tanggungjawab
Menjelaskan fi pendaftaran melalui 
FPX.
Aktiviti Sebelum PFD-LC-LE-NA-06 Aktiviti Selepas PFD-LC-LE-NA-08
Kaedah / Operasi 
(Bagaimana)
1. Sistem mengira fi pendaftaran. 
2. Pemohon membuat bayaran 
melalui FPX. 
3. Sistem mengemas kini status & 
menjana resit.

### Page 36

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
 
DEFINISI AKTIVITI FUNGSI BISNES — PFD-LC-LE-NA-08 Menerima Perakuan Digital + QR
Rujukan Fungsi PFD-LC-LE-NA Rujukan Aktiviti PFD-LC-LE-NA-08
Nama Fungsi Permohonan Pelesenan ElektrikNama Aktiviti Menerima Perakuan Digital + QR
Keterangan Aktiviti
Sistem menjana perakuan digital 
berserta kod QR (ditambat pada 
blockchain) kepada pemohon.
Aktor Pemohon / Pemegang Lesen Tanggungjawab
Memuat turun & menyimpan 
perakuan digital.
Aktiviti Sebelum PFD-LC-LE-NA-07 Aktiviti Selepas -
Kaedah / Operasi 
(Bagaimana)
1. Sistem menjana perakuan digital + 
QR. 
2. Hash perakuan ditambat pada 
blockchain. 
3. Pemohon memuat turun perakuan; 
boleh disahkan via imbasan QR.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-LC-LE-NA-09 Menerima Makluman Permohonan Ditolak
Rujukan Fungsi PFD-LC-LE-NA Rujukan Aktiviti PFD-LC-LE-NA-09
Nama Fungsi Permohonan Pelesenan ElektrikNama Aktiviti
Menerima Makluman Permohonan 
Ditolak
Keterangan Aktiviti
Pemohon menerima makluman 
penolakan beserta sebab.
Aktor Pemohon / Pemegang Lesen Tanggungjawab
Menyemak sebab penolakan & 
tindakan susulan.
Aktiviti Sebelum PFD-LC-LE-NA-06 Aktiviti Selepas -
Kaedah / Operasi 
(Bagaimana)
1. Sistem menghantar makluman 
penolakan. 
2. Pemohon menyemak sebab. 
3. Pemohon boleh memohon semula 
jika berkenaan.

### Page 37

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
8.1 Modul LC-PE — Pepasangan Elektrik 
 
Rajah 13: Rajah Use Case — Modul LC-PE: Pepasangan Elektrik 
 
Rajah 14: Rajah Aliran Data (DFD) — Modul LC-PE: Pepasangan Elektrik
Elemen Keterangan
Kod Modul LC-PE
Fungsi (PFD) PFD-LC-PE-NA — Permohonan Pepasangan Elektrik
Domain / Fasa Pelesenan & Pepasangan / Fasa 1
Keterangan
Modul Pepasangan Elektrik adalah satu modul gunasama yang melibatkan permohonan 
pendaftaran pepasangan elektrik berdasarkan peruntukan di bawah Akta Bekalan Elektrik 1990 
(Akta 447) Seksyen 21 dan Peraturan-peraturan berkaitan. Pepasangan elektrik yang terlibat di 
bawah peruntukan Seksyen 21 adalah:
Aktor Utama Wakil Syarikat / Kontraktor
Lorong Peranan Pemohon / Pengguna, Pegawai SOS, Pegawai Teknikal, Pelulus

### Page 38

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
Rajah 15: Rajah Hubungan Entiti (ERD) — Modul LC-PE: Pepasangan Elektrik
Sub-Modul & Fungsian: 
Maklumat Antara Muka — Skrin Pengguna:
- Skrin Log Masuk & Dashboard Pengguna
- Skrin Borang Permohonan
- Skrin Muat Naik & Pengesahan Dokumen (OCR/AI)
- Skrin Notis & Bayaran Fi
- Inbox & Notifikasi
- Skrin Semakan (SOS/Teknikal)
- Skrin Kelulusan (LOA)
- Paparan & Muat Turun Perakuan Digital (QR)
- Skrin Carian & Semakan Status
- Skrin Laporan & Statistik (AIRR)
Sub-Modul Fungsian Utama
Permohonan & Pemprosesan
Pepasangan yang menerima tenaga daripada pemegang lesen pada; Janakuasa tunggu 
sedia yang dipasang bagi maksud membekal tenaga
Semakan & Kelulusan
Semakan dokumen (SOS), semakan teknikal, kelulusan mengikut LOA, kelulusan 
jawatankuasa (jika berkaitan)
Bayaran & Hasil
Penjanaan invois/notis fi, integrasi Payment Gateway, resit, pemantauan & rekonsiliasi 
hasil
Perakuan & Notifikasi Penjanaan perakuan digital + QR + e-tandatangan, notifikasi emel/inbox
Pemantauan & Pematuhan Pemantauan tarikh luput/jaminan/syarat, peringatan automatik, audit pematuhan
Pelaporan & Statistik Laporan operasi & statistik (AIRR), papan pemuka, eksport
Pentadbiran & Konfigurasi Reference table (jenis dokumen, fi, hari bayaran, ayat notifikasi), kawalan akses (RBAC)

### Page 39

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
Maklumat Antara Muka — Integrasi Sistem (API):
- ST Payment Gateway (FPX/CIMB)
- SSM (MyDataSSM)
- TNB (MyTNB)
- MyDigital ID (NACSA)
- Pos Digicert (e-Signature)
Entiti Data Utama Modul:
 
Rajah 16: Carta Alir PFD-LC-PE-NA — Permohonan Pepasangan Elektrik
Definisi Aktiviti Fungsi Bisnes (format Tender):
Entiti Atribut Utama
PEPASANGAN_ELEKTRIK no_pendaftaran (PK), kapasiti, jenis, lokasi, status
PELANTIKAN_OK id (PK), no_pendaftaran (FK), id_OK (FK), peranan
BORANG_GHI id (PK), no_pendaftaran (FK), jenis_borang, tarikh
DEFINISI AKTIVITI FUNGSI BISNES — PFD-LC-PE-NA-01 Membuat Permohonan
Rujukan Fungsi PFD-LC-PE-NA Rujukan Aktiviti PFD-LC-PE-NA-01
Nama Fungsi Permohonan Pepasangan ElektrikNama Aktiviti Membuat Permohonan
Keterangan Aktiviti
Pemohon mengisi borang 
permohonan Permohonan 
Pepasangan Elektrik secara atas talian 
dan memuat naik dokumen sokongan.
Aktor Pemohon / Pemilik PepasanganTanggungjawab
Melengkapkan borang & memuat 
naik dokumen sebelum 
menghantar.
Aktiviti Sebelum - Aktiviti Selepas PFD-LC-PE-NA-02

### Page 40

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
 
 
Kaedah / Operasi 
(Bagaimana)
1. Log masuk ke Dashboard 
pengguna. 
2. Pilih modul & menu Permohonan 
Baharu. 
3. Isi maklumat permohonan. 
4. Muat naik dokumen sokongan 
(pengesahan OCR/AI). 
5. Buat perakuan ketepatan 
maklumat. 
6. Hantar permohonan.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-LC-PE-NA-02 Membuat Bayaran Fi Proses
Rujukan Fungsi PFD-LC-PE-NA Rujukan Aktiviti PFD-LC-PE-NA-02
Nama Fungsi Permohonan Pepasangan ElektrikNama Aktiviti Membuat Bayaran Fi Proses
Keterangan Aktiviti
Pemohon membuat bayaran fi proses 
melalui ST Payment Gateway (FPX).
Aktor Pemohon / Pemilik PepasanganTanggungjawab
Menjelaskan fi proses dalam 
tempoh ditetapkan.
Aktiviti Sebelum PFD-LC-PE-NA-01 Aktiviti Selepas PFD-LC-PE-NA-03
Kaedah / Operasi 
(Bagaimana)
1. Sistem mengira fi proses. 
2. Pemohon membuat bayaran 
melalui FPX. 
3. Sistem menjana resit & mengemas 
kini status.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-LC-PE-NA-03 Membuat Semakan Dokumen
Rujukan Fungsi PFD-LC-PE-NA Rujukan Aktiviti PFD-LC-PE-NA-03
Nama Fungsi Permohonan Pepasangan ElektrikNama Aktiviti Membuat Semakan Dokumen
Keterangan Aktiviti
Pegawai SOS menyemak 
kelengkapan & kesahihan dokumen 
permohonan.
Aktor Pegawai SOS Tanggungjawab
Memastikan dokumen lengkap & 
sah sebelum semakan teknikal.
Aktiviti Sebelum PFD-LC-PE-NA-02 Aktiviti Selepas PFD-LC-PE-NA-04
Kaedah / Operasi 
(Bagaimana)
1. Semak dokumen yang dimuat naik. 
2. Sahkan kelengkapan & kesahihan. 
3. Jika tidak lengkap, kembalikan 
untuk kemaskini.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-LC-PE-NA-04 Membuat Semakan Teknikal
Rujukan Fungsi PFD-LC-PE-NA Rujukan Aktiviti PFD-LC-PE-NA-04
Nama Fungsi Permohonan Pepasangan ElektrikNama Aktiviti Membuat Semakan Teknikal

### Page 41

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
 
 
Keterangan Aktiviti
Pegawai Teknikal menilai pematuhan 
teknikal permohonan Permohonan 
Pepasangan Elektrik.
Aktor Pegawai Teknikal Tanggungjawab
Menilai pematuhan teknikal & 
syarat kelayakan.
Aktiviti Sebelum PFD-LC-PE-NA-03 Aktiviti Selepas PFD-LC-PE-NA-06
Kaedah / Operasi 
(Bagaimana)
1. Semak butiran teknikal 
permohonan. 
2. Sahkan pematuhan syarat & 
peraturan. 
3. Tanda lulus/tidak lulus semakan 
teknikal.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-LC-PE-NA-05 Kemaskini Permohonan
Rujukan Fungsi PFD-LC-PE-NA Rujukan Aktiviti PFD-LC-PE-NA-05
Nama Fungsi Permohonan Pepasangan ElektrikNama Aktiviti Kemaskini Permohonan
Keterangan Aktiviti
Pemohon mengemas kini 
permohonan/dokumen yang tidak 
lengkap atau perlu pembetulan.
Aktor Pemohon / Pemilik PepasanganTanggungjawab
Membetulkan & melengkapkan 
maklumat/dokumen yang diminta.
Aktiviti Sebelum
PFD-LC-PE-NA-03 / PFD-LC-PE-
NA-04
Aktiviti Selepas (kembali ke semakan)
Kaedah / Operasi 
(Bagaimana)
1. Terima notifikasi kemaskini. 
2. Betulkan maklumat / muat naik 
dokumen baharu. 
3. Hantar semula untuk semakan.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-LC-PE-NA-06 Membuat Kelulusan
Rujukan Fungsi PFD-LC-PE-NA Rujukan Aktiviti PFD-LC-PE-NA-06
Nama Fungsi Permohonan Pepasangan ElektrikNama Aktiviti Membuat Kelulusan
Keterangan Aktiviti
Pelulus membuat keputusan 
kelulusan mengikut Limit of 
Authority (LOA).
Aktor Pegawai Pelulus Tanggungjawab
Membuat keputusan lulus/tolak 
mengikut LOA.
Aktiviti Sebelum PFD-LC-PE-NA-04 Aktiviti Selepas
PFD-LC-PE-NA-07 / PFD-LC-PE-
NA-09
Kaedah / Operasi 
(Bagaimana)
1. Semak syor & dokumen sokongan. 
2. Buat keputusan mengikut LOA. 
3. Rekod keputusan dengan jejak 
audit.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-LC-PE-NA-07 Membuat Bayaran Pendaftaran
Rujukan Fungsi PFD-LC-PE-NA Rujukan Aktiviti PFD-LC-PE-NA-07

### Page 42

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
 
 
Nama Fungsi Permohonan Pepasangan ElektrikNama Aktiviti Membuat Bayaran Pendaftaran
Keterangan Aktiviti
Pemohon membuat bayaran 
pendaftaran/perakuan selepas 
permohonan diluluskan.
Aktor Pemohon / Pemilik PepasanganTanggungjawab
Menjelaskan fi pendaftaran melalui 
FPX.
Aktiviti Sebelum PFD-LC-PE-NA-06 Aktiviti Selepas PFD-LC-PE-NA-08
Kaedah / Operasi 
(Bagaimana)
1. Sistem mengira fi pendaftaran. 
2. Pemohon membuat bayaran 
melalui FPX. 
3. Sistem mengemas kini status & 
menjana resit.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-LC-PE-NA-08 Menerima Perakuan Digital + QR
Rujukan Fungsi PFD-LC-PE-NA Rujukan Aktiviti PFD-LC-PE-NA-08
Nama Fungsi Permohonan Pepasangan ElektrikNama Aktiviti Menerima Perakuan Digital + QR
Keterangan Aktiviti
Sistem menjana perakuan digital 
berserta kod QR (ditambat pada 
blockchain) kepada pemohon.
Aktor Pemohon / Pemilik PepasanganTanggungjawab
Memuat turun & menyimpan 
perakuan digital.
Aktiviti Sebelum PFD-LC-PE-NA-07 Aktiviti Selepas -
Kaedah / Operasi 
(Bagaimana)
1. Sistem menjana perakuan digital + 
QR. 
2. Hash perakuan ditambat pada 
blockchain. 
3. Pemohon memuat turun perakuan; 
boleh disahkan via imbasan QR.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-LC-PE-NA-09 Menerima Makluman Permohonan Ditolak
Rujukan Fungsi PFD-LC-PE-NA Rujukan Aktiviti PFD-LC-PE-NA-09
Nama Fungsi Permohonan Pepasangan ElektrikNama Aktiviti
Menerima Makluman Permohonan 
Ditolak
Keterangan Aktiviti
Pemohon menerima makluman 
penolakan beserta sebab.
Aktor Pemohon / Pemilik PepasanganTanggungjawab
Menyemak sebab penolakan & 
tindakan susulan.
Aktiviti Sebelum PFD-LC-PE-NA-06 Aktiviti Selepas -
Kaedah / Operasi 
(Bagaimana)
1. Sistem menghantar makluman 
penolakan. 
2. Pemohon menyemak sebab. 
3. Pemohon boleh memohon semula 
jika berkenaan.

### Page 43

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
8.1 Modul LC-LG — Pelesenan Gas 
 
Rajah 17: Rajah Use Case — Modul LC-LG: Pelesenan Gas
 
Rajah 18: Rajah Aliran Data (DFD) — Modul LC-LG: Pelesenan Gas
Elemen Keterangan
Kod Modul LC-LG
Fungsi (PFD) PFD-LC-LG-NA — Permohonan Pelesenan Gas
Domain / Fasa Pelesenan & Pepasangan / Fasa 1
Keterangan
Modul Pelesenan Gas adalah satu modul gunasama yang melibatkan permohonan pelesenan 
persendirian dan pelesenan awam bagi aktiviti pembekalan gas melalui talian paip berdasarkan 
peruntukan di bawah Akta Bekalan Gas (Pindaan) 2016 dan Peraturan berkaitan. Proses-proses 
yang terlibat adalah seperti ber
Aktor Utama Wakil Syarikat / Kontraktor
Lorong Peranan Pemohon / Pengguna, Pegawai SOS, Pegawai Teknikal, Pelulus

### Page 44

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
Rajah 19: Rajah Hubungan Entiti (ERD) — Modul LC-LG: Pelesenan Gas
Sub-Modul & Fungsian: 
Maklumat Antara Muka — Skrin Pengguna:
- Skrin Log Masuk & Dashboard Pengguna
- Skrin Borang Permohonan
- Skrin Muat Naik & Pengesahan Dokumen (OCR/AI)
- Skrin Notis & Bayaran Fi
- Inbox & Notifikasi
- Skrin Semakan (SOS/Teknikal)
- Skrin Kelulusan (LOA)
- Paparan & Muat Turun Perakuan Digital (QR)
- Skrin Carian & Semakan Status
- Skrin Laporan & Statistik (AIRR)
Maklumat Antara Muka — Integrasi Sistem (API):
- ST Payment Gateway (FPX/CIMB)
- SSM (MyDataSSM)
- TNB (MyTNB)
- MyDigital ID (NACSA)
Sub-Modul Fungsian Utama
Permohonan & Pemprosesan
Permohonan Pelesenan (pelbagai jenis lesen gas); Pembaharuan Pelesenan; Permohonan 
Pembatalan Pelesenan; Permohonan Perubahan Skop dan Kawasan Pembekalan
Semakan & Kelulusan
Semakan dokumen (SOS), semakan teknikal, kelulusan mengikut LOA, kelulusan 
jawatankuasa (jika berkaitan)
Bayaran & Hasil
Penjanaan invois/notis fi, integrasi Payment Gateway, resit, pemantauan & rekonsiliasi 
hasil
Perakuan & Notifikasi Penjanaan perakuan digital + QR + e-tandatangan, notifikasi emel/inbox
Pemantauan & Pematuhan Pemantauan tarikh luput/jaminan/syarat, peringatan automatik, audit pematuhan
Pelaporan & Statistik Laporan operasi & statistik (AIRR), papan pemuka, eksport
Pentadbiran & Konfigurasi Reference table (jenis dokumen, fi, hari bayaran, ayat notifikasi), kawalan akses (RBAC)

### Page 45

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
•Pos Digicert (e-Signature)
Entiti Data Utama Modul:
 
Rajah 20: Carta Alir PFD-LC-LG-NA — Permohonan Pelesenan Gas
Definisi Aktiviti Fungsi Bisnes (format Tender):
 
Entiti Atribut Utama
LESEN_GAS no_lesen (PK), jenis, kategori, kapasiti, tarikh_luput, status
JAMINAN_BANK id (PK), no_lesen (FK), amaun, tarikh_luput
DEFINISI AKTIVITI FUNGSI BISNES — PFD-LC-LG-NA-01 Membuat Permohonan
Rujukan Fungsi PFD-LC-LG-NA Rujukan Aktiviti PFD-LC-LG-NA-01
Nama Fungsi Permohonan Pelesenan Gas Nama Aktiviti Membuat Permohonan
Keterangan Aktiviti
Pemohon mengisi borang 
permohonan Permohonan Pelesenan 
Gas secara atas talian dan memuat 
naik dokumen sokongan.
Aktor Pemohon / Pemegang Lesen Tanggungjawab
Melengkapkan borang & memuat 
naik dokumen sebelum 
menghantar.
Aktiviti Sebelum - Aktiviti Selepas PFD-LC-LG-NA-02
Kaedah / Operasi 
(Bagaimana)
1. Log masuk ke Dashboard 
pengguna. 
2. Pilih modul & menu Permohonan 
Baharu. 
3. Isi maklumat permohonan. 
4. Muat naik dokumen sokongan 
(pengesahan OCR/AI). 
5. Buat perakuan ketepatan 
maklumat. 
6. Hantar permohonan.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-LC-LG-NA-02 Membuat Bayaran Fi Proses
Rujukan Fungsi PFD-LC-LG-NA Rujukan Aktiviti PFD-LC-LG-NA-02
Nama Fungsi Permohonan Pelesenan Gas Nama Aktiviti Membuat Bayaran Fi Proses
Keterangan Aktiviti
Pemohon membuat bayaran fi proses 
melalui ST Payment Gateway (FPX).

### Page 46

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
 
 
Aktor Pemohon / Pemegang Lesen Tanggungjawab
Menjelaskan fi proses dalam 
tempoh ditetapkan.
Aktiviti Sebelum PFD-LC-LG-NA-01 Aktiviti Selepas PFD-LC-LG-NA-03
Kaedah / Operasi 
(Bagaimana)
1. Sistem mengira fi proses. 
2. Pemohon membuat bayaran 
melalui FPX. 
3. Sistem menjana resit & mengemas 
kini status.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-LC-LG-NA-03 Membuat Semakan Dokumen
Rujukan Fungsi PFD-LC-LG-NA Rujukan Aktiviti PFD-LC-LG-NA-03
Nama Fungsi Permohonan Pelesenan Gas Nama Aktiviti Membuat Semakan Dokumen
Keterangan Aktiviti
Pegawai SOS menyemak 
kelengkapan & kesahihan dokumen 
permohonan.
Aktor Pegawai SOS Tanggungjawab
Memastikan dokumen lengkap & 
sah sebelum semakan teknikal.
Aktiviti Sebelum PFD-LC-LG-NA-02 Aktiviti Selepas PFD-LC-LG-NA-04
Kaedah / Operasi 
(Bagaimana)
1. Semak dokumen yang dimuat naik. 
2. Sahkan kelengkapan & kesahihan. 
3. Jika tidak lengkap, kembalikan 
untuk kemaskini.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-LC-LG-NA-04 Membuat Semakan Teknikal
Rujukan Fungsi PFD-LC-LG-NA Rujukan Aktiviti PFD-LC-LG-NA-04
Nama Fungsi Permohonan Pelesenan Gas Nama Aktiviti Membuat Semakan Teknikal
Keterangan Aktiviti
Pegawai Teknikal menilai pematuhan 
teknikal permohonan Permohonan 
Pelesenan Gas.
Aktor Pegawai Teknikal Tanggungjawab
Menilai pematuhan teknikal & 
syarat kelayakan.
Aktiviti Sebelum PFD-LC-LG-NA-03 Aktiviti Selepas PFD-LC-LG-NA-06
Kaedah / Operasi 
(Bagaimana)
1. Semak butiran teknikal 
permohonan. 
2. Sahkan pematuhan syarat & 
peraturan. 
3. Tanda lulus/tidak lulus semakan 
teknikal.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-LC-LG-NA-05 Kemaskini Permohonan
Rujukan Fungsi PFD-LC-LG-NA Rujukan Aktiviti PFD-LC-LG-NA-05
Nama Fungsi Permohonan Pelesenan Gas Nama Aktiviti Kemaskini Permohonan
Keterangan Aktiviti
Pemohon mengemas kini 
permohonan/dokumen yang tidak 
lengkap atau perlu pembetulan.

### Page 47

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
 
 
Aktor Pemohon / Pemegang Lesen Tanggungjawab
Membetulkan & melengkapkan 
maklumat/dokumen yang diminta.
Aktiviti Sebelum
PFD-LC-LG-NA-03 / PFD-LC-
LG-NA-04
Aktiviti Selepas (kembali ke semakan)
Kaedah / Operasi 
(Bagaimana)
1. Terima notifikasi kemaskini. 
2. Betulkan maklumat / muat naik 
dokumen baharu. 
3. Hantar semula untuk semakan.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-LC-LG-NA-06 Membuat Kelulusan
Rujukan Fungsi PFD-LC-LG-NA Rujukan Aktiviti PFD-LC-LG-NA-06
Nama Fungsi Permohonan Pelesenan Gas Nama Aktiviti Membuat Kelulusan
Keterangan Aktiviti
Pelulus membuat keputusan 
kelulusan mengikut Limit of 
Authority (LOA).
Aktor Pegawai Pelulus Tanggungjawab
Membuat keputusan lulus/tolak 
mengikut LOA.
Aktiviti Sebelum PFD-LC-LG-NA-04 Aktiviti Selepas
PFD-LC-LG-NA-07 / PFD-LC-
LG-NA-09
Kaedah / Operasi 
(Bagaimana)
1. Semak syor & dokumen sokongan. 
2. Buat keputusan mengikut LOA. 
3. Rekod keputusan dengan jejak 
audit.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-LC-LG-NA-07 Membuat Bayaran Pendaftaran
Rujukan Fungsi PFD-LC-LG-NA Rujukan Aktiviti PFD-LC-LG-NA-07
Nama Fungsi Permohonan Pelesenan Gas Nama Aktiviti Membuat Bayaran Pendaftaran
Keterangan Aktiviti
Pemohon membuat bayaran 
pendaftaran/perakuan selepas 
permohonan diluluskan.
Aktor Pemohon / Pemegang Lesen Tanggungjawab
Menjelaskan fi pendaftaran melalui 
FPX.
Aktiviti Sebelum PFD-LC-LG-NA-06 Aktiviti Selepas PFD-LC-LG-NA-08
Kaedah / Operasi 
(Bagaimana)
1. Sistem mengira fi pendaftaran. 
2. Pemohon membuat bayaran 
melalui FPX. 
3. Sistem mengemas kini status & 
menjana resit.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-LC-LG-NA-08 Menerima Perakuan Digital + QR
Rujukan Fungsi PFD-LC-LG-NA Rujukan Aktiviti PFD-LC-LG-NA-08
Nama Fungsi Permohonan Pelesenan Gas Nama Aktiviti Menerima Perakuan Digital + QR
Keterangan Aktiviti
Sistem menjana perakuan digital 
berserta kod QR (ditambat pada 
blockchain) kepada pemohon.

### Page 48

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
 
Aktor Pemohon / Pemegang Lesen Tanggungjawab
Memuat turun & menyimpan 
perakuan digital.
Aktiviti Sebelum PFD-LC-LG-NA-07 Aktiviti Selepas -
Kaedah / Operasi 
(Bagaimana)
1. Sistem menjana perakuan digital + 
QR. 
2. Hash perakuan ditambat pada 
blockchain. 
3. Pemohon memuat turun perakuan; 
boleh disahkan via imbasan QR.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-LC-LG-NA-09 Menerima Makluman Permohonan Ditolak
Rujukan Fungsi PFD-LC-LG-NA Rujukan Aktiviti PFD-LC-LG-NA-09
Nama Fungsi Permohonan Pelesenan Gas Nama Aktiviti
Menerima Makluman Permohonan 
Ditolak
Keterangan Aktiviti
Pemohon menerima makluman 
penolakan beserta sebab.
Aktor Pemohon / Pemegang Lesen Tanggungjawab
Menyemak sebab penolakan & 
tindakan susulan.
Aktiviti Sebelum PFD-LC-LG-NA-06 Aktiviti Selepas -
Kaedah / Operasi 
(Bagaimana)
1. Sistem menghantar makluman 
penolakan. 
2. Pemohon menyemak sebab. 
3. Pemohon boleh memohon semula 
jika berkenaan.

### Page 49

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
8.1 Modul LC-PG — Pepasangan Gas 
 
Rajah 21: Rajah Use Case — Modul LC-PG: Pepasangan Gas
 
Rajah 22: Rajah Aliran Data (DFD) — Modul LC-PG: Pepasangan Gas
Elemen Keterangan
Kod Modul LC-PG
Fungsi (PFD) PFD-LC-PG-NA — Permohonan Pepasangan Gas
Domain / Fasa Pelesenan & Pepasangan / Fasa 1
Keterangan
Modul Pepasangan Gas adalah satu modul gunasama yang melibatkan permohonan Kelulusan 
untuk Memasang dan Kelulusan untuk Mengendali bagi pepasangan gas yang dipasang bagi 
pembekalan gas melalui talian paip berdasarkan peruntukan di bawah Akta Bekalan Gas 1993 
dan Peraturan- peraturan Bekalan Gas 1997
Aktor Utama Wakil Syarikat / Kontraktor
Lorong Peranan Pemohon / Pengguna, Pegawai SOS, Pegawai Teknikal, Pelulus

### Page 50

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
Rajah 23: Rajah Hubungan Entiti (ERD) — Modul LC-PG: Pepasangan Gas
Sub-Modul & Fungsian: 
Maklumat Antara Muka — Skrin Pengguna:
- Skrin Log Masuk & Dashboard Pengguna
- Skrin Borang Permohonan
- Skrin Muat Naik & Pengesahan Dokumen (OCR/AI)
- Skrin Notis & Bayaran Fi
- Inbox & Notifikasi
- Skrin Semakan (SOS/Teknikal)
- Skrin Kelulusan (LOA)
- Paparan & Muat Turun Perakuan Digital (QR)
- Skrin Carian & Semakan Status
- Skrin Laporan & Statistik (AIRR)
Maklumat Antara Muka — Integrasi Sistem (API):
- ST Payment Gateway (FPX/CIMB)
- SSM (MyDataSSM)
- TNB (MyTNB)
- MyDigital ID (NACSA)
Sub-Modul Fungsian Utama
Permohonan & Pemprosesan
Permohonan Kelulusan untuk Memasang; Permohonan Kelulusan untuk Mengendali; 
Permohonan Menaik Taraf/Menurun Taraf Sistem Pepasangan Gas; Permohonan 
Pertukaran Hakmilik Mengendali Pepasangan Gas
Semakan & Kelulusan
Semakan dokumen (SOS), semakan teknikal, kelulusan mengikut LOA, kelulusan 
jawatankuasa (jika berkaitan)
Bayaran & Hasil
Penjanaan invois/notis fi, integrasi Payment Gateway, resit, pemantauan & rekonsiliasi 
hasil
Perakuan & Notifikasi Penjanaan perakuan digital + QR + e-tandatangan, notifikasi emel/inbox
Pemantauan & Pematuhan Pemantauan tarikh luput/jaminan/syarat, peringatan automatik, audit pematuhan
Pelaporan & Statistik Laporan operasi & statistik (AIRR), papan pemuka, eksport
Pentadbiran & Konfigurasi Reference table (jenis dokumen, fi, hari bayaran, ayat notifikasi), kawalan akses (RBAC)

### Page 51

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
•Pos Digicert (e-Signature)
Entiti Data Utama Modul:
 
Rajah 24: Carta Alir PFD-LC-PG-NA — Permohonan Pepasangan Gas
Definisi Aktiviti Fungsi Bisnes (format Tender):
 
Entiti Atribut Utama
PEPASANGAN_GAS no_pendaftaran (PK), kapasiti, jenis, status
KELULUSAN_GAS id (PK), no_pendaftaran (FK), jenis (memasang/mengendali), status
DEFINISI AKTIVITI FUNGSI BISNES — PFD-LC-PG-NA-01 Membuat Permohonan
Rujukan Fungsi PFD-LC-PG-NA Rujukan Aktiviti PFD-LC-PG-NA-01
Nama Fungsi Permohonan Pepasangan Gas Nama Aktiviti Membuat Permohonan
Keterangan Aktiviti
Pemohon mengisi borang 
permohonan Permohonan 
Pepasangan Gas secara atas talian dan 
memuat naik dokumen sokongan.
Aktor Pemohon / Pemilik PepasanganTanggungjawab
Melengkapkan borang & memuat 
naik dokumen sebelum 
menghantar.
Aktiviti Sebelum - Aktiviti Selepas PFD-LC-PG-NA-02
Kaedah / Operasi 
(Bagaimana)
1. Log masuk ke Dashboard 
pengguna. 
2. Pilih modul & menu Permohonan 
Baharu. 
3. Isi maklumat permohonan. 
4. Muat naik dokumen sokongan 
(pengesahan OCR/AI). 
5. Buat perakuan ketepatan 
maklumat. 
6. Hantar permohonan.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-LC-PG-NA-02 Membuat Bayaran Fi Proses
Rujukan Fungsi PFD-LC-PG-NA Rujukan Aktiviti PFD-LC-PG-NA-02
Nama Fungsi Permohonan Pepasangan Gas Nama Aktiviti Membuat Bayaran Fi Proses
Keterangan Aktiviti
Pemohon membuat bayaran fi proses 
melalui ST Payment Gateway (FPX).

### Page 52

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
 
 
Aktor Pemohon / Pemilik PepasanganTanggungjawab
Menjelaskan fi proses dalam 
tempoh ditetapkan.
Aktiviti Sebelum PFD-LC-PG-NA-01 Aktiviti Selepas PFD-LC-PG-NA-03
Kaedah / Operasi 
(Bagaimana)
1. Sistem mengira fi proses. 
2. Pemohon membuat bayaran 
melalui FPX. 
3. Sistem menjana resit & mengemas 
kini status.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-LC-PG-NA-03 Membuat Semakan Dokumen
Rujukan Fungsi PFD-LC-PG-NA Rujukan Aktiviti PFD-LC-PG-NA-03
Nama Fungsi Permohonan Pepasangan Gas Nama Aktiviti Membuat Semakan Dokumen
Keterangan Aktiviti
Pegawai SOS menyemak 
kelengkapan & kesahihan dokumen 
permohonan.
Aktor Pegawai SOS Tanggungjawab
Memastikan dokumen lengkap & 
sah sebelum semakan teknikal.
Aktiviti Sebelum PFD-LC-PG-NA-02 Aktiviti Selepas PFD-LC-PG-NA-04
Kaedah / Operasi 
(Bagaimana)
1. Semak dokumen yang dimuat naik. 
2. Sahkan kelengkapan & kesahihan. 
3. Jika tidak lengkap, kembalikan 
untuk kemaskini.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-LC-PG-NA-04 Membuat Semakan Teknikal
Rujukan Fungsi PFD-LC-PG-NA Rujukan Aktiviti PFD-LC-PG-NA-04
Nama Fungsi Permohonan Pepasangan Gas Nama Aktiviti Membuat Semakan Teknikal
Keterangan Aktiviti
Pegawai Teknikal menilai pematuhan 
teknikal permohonan Permohonan 
Pepasangan Gas.
Aktor Pegawai Teknikal Tanggungjawab
Menilai pematuhan teknikal & 
syarat kelayakan.
Aktiviti Sebelum PFD-LC-PG-NA-03 Aktiviti Selepas PFD-LC-PG-NA-06
Kaedah / Operasi 
(Bagaimana)
1. Semak butiran teknikal 
permohonan. 
2. Sahkan pematuhan syarat & 
peraturan. 
3. Tanda lulus/tidak lulus semakan 
teknikal.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-LC-PG-NA-05 Kemaskini Permohonan
Rujukan Fungsi PFD-LC-PG-NA Rujukan Aktiviti PFD-LC-PG-NA-05
Nama Fungsi Permohonan Pepasangan Gas Nama Aktiviti Kemaskini Permohonan
Keterangan Aktiviti
Pemohon mengemas kini 
permohonan/dokumen yang tidak 
lengkap atau perlu pembetulan.

### Page 53

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
 
 
Aktor Pemohon / Pemilik PepasanganTanggungjawab
Membetulkan & melengkapkan 
maklumat/dokumen yang diminta.
Aktiviti Sebelum
PFD-LC-PG-NA-03 / PFD-LC-PG-
NA-04
Aktiviti Selepas (kembali ke semakan)
Kaedah / Operasi 
(Bagaimana)
1. Terima notifikasi kemaskini. 
2. Betulkan maklumat / muat naik 
dokumen baharu. 
3. Hantar semula untuk semakan.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-LC-PG-NA-06 Membuat Kelulusan
Rujukan Fungsi PFD-LC-PG-NA Rujukan Aktiviti PFD-LC-PG-NA-06
Nama Fungsi Permohonan Pepasangan Gas Nama Aktiviti Membuat Kelulusan
Keterangan Aktiviti
Pelulus membuat keputusan 
kelulusan mengikut Limit of 
Authority (LOA).
Aktor Pegawai Pelulus Tanggungjawab
Membuat keputusan lulus/tolak 
mengikut LOA.
Aktiviti Sebelum PFD-LC-PG-NA-04 Aktiviti Selepas
PFD-LC-PG-NA-07 / PFD-LC-PG-
NA-09
Kaedah / Operasi 
(Bagaimana)
1. Semak syor & dokumen sokongan. 
2. Buat keputusan mengikut LOA. 
3. Rekod keputusan dengan jejak 
audit.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-LC-PG-NA-07 Membuat Bayaran Pendaftaran
Rujukan Fungsi PFD-LC-PG-NA Rujukan Aktiviti PFD-LC-PG-NA-07
Nama Fungsi Permohonan Pepasangan Gas Nama Aktiviti Membuat Bayaran Pendaftaran
Keterangan Aktiviti
Pemohon membuat bayaran 
pendaftaran/perakuan selepas 
permohonan diluluskan.
Aktor Pemohon / Pemilik PepasanganTanggungjawab
Menjelaskan fi pendaftaran melalui 
FPX.
Aktiviti Sebelum PFD-LC-PG-NA-06 Aktiviti Selepas PFD-LC-PG-NA-08
Kaedah / Operasi 
(Bagaimana)
1. Sistem mengira fi pendaftaran. 
2. Pemohon membuat bayaran 
melalui FPX. 
3. Sistem mengemas kini status & 
menjana resit.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-LC-PG-NA-08 Menerima Perakuan Digital + QR
Rujukan Fungsi PFD-LC-PG-NA Rujukan Aktiviti PFD-LC-PG-NA-08
Nama Fungsi Permohonan Pepasangan Gas Nama Aktiviti Menerima Perakuan Digital + QR
Keterangan Aktiviti
Sistem menjana perakuan digital 
berserta kod QR (ditambat pada 
blockchain) kepada pemohon.

### Page 54

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
 
Aktor Pemohon / Pemilik PepasanganTanggungjawab
Memuat turun & menyimpan 
perakuan digital.
Aktiviti Sebelum PFD-LC-PG-NA-07 Aktiviti Selepas -
Kaedah / Operasi 
(Bagaimana)
1. Sistem menjana perakuan digital + 
QR. 
2. Hash perakuan ditambat pada 
blockchain. 
3. Pemohon memuat turun perakuan; 
boleh disahkan via imbasan QR.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-LC-PG-NA-09 Menerima Makluman Permohonan Ditolak
Rujukan Fungsi PFD-LC-PG-NA Rujukan Aktiviti PFD-LC-PG-NA-09
Nama Fungsi Permohonan Pepasangan Gas Nama Aktiviti
Menerima Makluman Permohonan 
Ditolak
Keterangan Aktiviti
Pemohon menerima makluman 
penolakan beserta sebab.
Aktor Pemohon / Pemilik PepasanganTanggungjawab
Menyemak sebab penolakan & 
tindakan susulan.
Aktiviti Sebelum PFD-LC-PG-NA-06 Aktiviti Selepas -
Kaedah / Operasi 
(Bagaimana)
1. Sistem menghantar makluman 
penolakan. 
2. Pemohon menyemak sebab. 
3. Pemohon boleh memohon semula 
jika berkenaan.

### Page 55

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
8.1 Modul RG-KE — Pendaftaran Orang Kompeten Elektrik 
 
Rajah 25: Rajah Use Case — Modul RG-KE: Pendaftaran Orang Kompeten Elektrik
 
Rajah 26: Rajah Aliran Data (DFD) — Modul RG-KE: Pendaftaran Orang Kompeten Elektrik
Elemen Keterangan
Kod Modul RG-KE
Fungsi (PFD) PFD-RG-KE-NA — Permohonan Pendaftaran Kompeten (Elektrik)
Domain / Fasa Pendaftaran / Fasa 1
Keterangan
Modul Kompeten Elektrik adalah satu modul gunasama yang melibatkan permohonan 
Pendaftaran Orang Kompeten Elektrik yang berkelayakan berdasarkan peruntukan di bawah 
Akta Bekalan Elektrik 1990 (Akta 447) dan Peraturan-peraturan berkaitan. Proses-proses yang 
terlibat adalah seperti berikut: a.
Aktor Utama Pemohon / Individu
Lorong Peranan Orang Kompeten, Majikan, Pegawai SOS, Pegawai Teknikal, Pelulus

### Page 56

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
Rajah 27: Rajah Hubungan Entiti (ERD) — Modul RG-KE: Pendaftaran Orang Kompeten Elektrik
Sub-Modul & Fungsian: 
Maklumat Antara Muka — Skrin Pengguna:
- Skrin Log Masuk & Dashboard Pengguna
- Skrin Borang Permohonan
- Skrin Muat Naik & Pengesahan Dokumen (OCR/AI)
- Skrin Notis & Bayaran Fi
- Inbox & Notifikasi
- Skrin Semakan (SOS/Teknikal)
- Skrin Kelulusan (LOA)
- Paparan & Muat Turun Perakuan Digital (QR)
- Skrin Carian & Semakan Status
- Skrin Laporan & Statistik (AIRR)
Maklumat Antara Muka — Integrasi Sistem (API):
- ST Payment Gateway (FPX)
Sub-Modul Fungsian Utama
Permohonan & Pemprosesan
Permohonan Pendaftaran Orang Kompeten; Permohonan Pendaftaran Orang Kompeten 
oleh Majikan (selain daripada; Permohonan Pembaharuan Pendaftaran Orang Kompeten; 
Permohonan Pembaharuan Pendaftaran Orang Kompeten oleh Majikan
Semakan & Kelulusan
Semakan dokumen (SOS), semakan teknikal, kelulusan mengikut LOA, kelulusan 
jawatankuasa (jika berkaitan)
Bayaran & Hasil
Penjanaan invois/notis fi, integrasi Payment Gateway, resit, pemantauan & rekonsiliasi 
hasil
Perakuan & Notifikasi Penjanaan perakuan digital + QR + e-tandatangan, notifikasi emel/inbox
Pemantauan & Pematuhan Pemantauan tarikh luput/jaminan/syarat, peringatan automatik, audit pematuhan
Pelaporan & Statistik Laporan operasi & statistik (AIRR), papan pemuka, eksport
Pentadbiran & Konfigurasi Reference table (jenis dokumen, fi, hari bayaran, ayat notifikasi), kawalan akses (RBAC)

### Page 57

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
- JPN (ALIS)
- MyDigital ID (NACSA)
- Pos Digicert (e-Signature)
Entiti Data Utama Modul:
 
Rajah 28: Carta Alir PFD-RG-KE-NA — Permohonan Pendaftaran Kompeten (Elektrik)
Definisi Aktiviti Fungsi Bisnes (format Tender):
Entiti Atribut Utama
ORANG_KOMPETEN id_OK (PK), no_perakuan, kategori, sekatan_voltan, status
MAJIKAN id_majikan (PK), nama, no_ssm
PELANTIKAN id (PK), id_OK (FK), id_majikan (FK), status
DEFINISI AKTIVITI FUNGSI BISNES — PFD-RG-KE-NA-01 Membuat Permohonan
Rujukan Fungsi PFD-RG-KE-NA Rujukan Aktiviti PFD-RG-KE-NA-01
Nama Fungsi
Permohonan Pendaftaran 
Kompeten (Elektrik)
Nama Aktiviti Membuat Permohonan
Keterangan Aktiviti
Pengguna mengisi borang untuk 
membuat permohonan pendaftaran 
orang kompeten.
Aktor Orang Kompeten Tanggungjawab
Melengkapkan borang permohonan 
dan memuat naik dokumen 
sokongan sebelum menghantar.
Aktiviti Sebelum - Aktiviti Selepas
PFD-RG-KE-NA-02 / PFD-RG-
KE-NA-04

### Page 58

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
 
Kaedah / Operasi 
(Bagaimana)
1. Dari Dashboard OK, sistem 
paparkan modul & perkhidmatan. 
2. Pilih modul & menu Permohonan 
Pendaftaran. 
3. Masukkan maklumat permohonan 
& pilih kekompetenan. 
4. Pilih tempoh pendaftaran (1-5 
tahun). 
5. Muat naik dokumen sokongan (& 
laporan OSH jika melebihi had 
umur). 
6. Pilih kategori majikan (Syarikat / 
Bekerja Sendiri). 
7. Buat perakuan ketepatan maklumat 
& hantar.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-RG-KE-NA-02 Memilih Majikan
Rujukan Fungsi PFD-RG-KE-NA Rujukan Aktiviti PFD-RG-KE-NA-02
Nama Fungsi
Permohonan Pendaftaran 
Kompeten (Elektrik)
Nama Aktiviti Memilih Majikan
Keterangan Aktiviti
OK memilih majikan bagi 
pendaftaran.
Aktor Orang Kompeten Tanggungjawab
Memastikan pilihan majikan adalah 
betul.
Aktiviti Sebelum PFD-RG-KE-NA-01 Aktiviti Selepas PFD-RG-KE-NA-03
Kaedah / Operasi 
(Bagaimana)
1. Pilih kategori majikan (Kontraktor/
Pepasangan/Pelesenan/Institusi/
Individu). 
2. Cari nama syarikat/individu, no. 
pendaftaran ST/MyKad. 
3. Pilih majikan berstatus aktif dari 
senarai.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-RG-KE-NA-03 Mengesahkan Pelantikan Kompeten
Rujukan Fungsi PFD-RG-KE-NA Rujukan Aktiviti PFD-RG-KE-NA-03
Nama Fungsi
Permohonan Pendaftaran 
Kompeten (Elektrik)
Nama Aktiviti
Mengesahkan Pelantikan 
Kompeten
Keterangan Aktiviti
Majikan mengesahkan pelantikan 
OK.
Aktor Majikan Tanggungjawab
Mengesah/menolak pelantikan OK 
dalam tempoh ditetapkan.
Aktiviti Sebelum PFD-RG-KE-NA-02 Aktiviti Selepas
PFD-RG-KE-NA-04 / Tidak 
Diteruskan

### Page 59

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
 
 
Kaedah / Operasi 
(Bagaimana)
1. Majikan menerima notifikasi 
pelantikan. 
2. Semak butiran OK. 
3. Sahkan atau tolak pelantikan.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-RG-KE-NA-04 Membuat Bayaran Fi Proses
Rujukan Fungsi PFD-RG-KE-NA Rujukan Aktiviti PFD-RG-KE-NA-04
Nama Fungsi
Permohonan Pendaftaran 
Kompeten (Elektrik)
Nama Aktiviti Membuat Bayaran Fi Proses
Keterangan Aktiviti
OK membuat bayaran fi proses 
melalui ST Payment Gateway (FPX).
Aktor Orang Kompeten Tanggungjawab
Menjelaskan fi proses dalam 
tempoh ditetapkan.
Aktiviti Sebelum PFD-RG-KE-NA-03 Aktiviti Selepas PFD-RG-KE-NA-05
Kaedah / Operasi 
(Bagaimana)
1. Sistem mengira fi proses. 
2. OK membuat bayaran melalui 
FPX. 
3. Sistem menjana resit & kemas kini 
status.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-RG-KE-NA-05 Membuat Semakan Dokumen
Rujukan Fungsi PFD-RG-KE-NA Rujukan Aktiviti PFD-RG-KE-NA-05
Nama Fungsi
Permohonan Pendaftaran 
Kompeten (Elektrik)
Nama Aktiviti Membuat Semakan Dokumen
Keterangan Aktiviti
Pegawai SOS menyemak 
kelengkapan & kesahihan dokumen.
Aktor Pegawai SOS Tanggungjawab
Memastikan dokumen lengkap & 
sah.
Aktiviti Sebelum PFD-RG-KE-NA-04 Aktiviti Selepas
PFD-RG-KE-NA-06 / PFD-RG-
KE-NA-07
Kaedah / Operasi 
(Bagaimana)
1. Semak dokumen yang dimuat naik. 
2. Sahkan kelengkapan & kesahihan. 
3. Jika tidak lengkap, kembalikan 
untuk kemaskini.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-RG-KE-NA-06 Membuat Semakan Teknikal
Rujukan Fungsi PFD-RG-KE-NA Rujukan Aktiviti PFD-RG-KE-NA-06
Nama Fungsi
Permohonan Pendaftaran 
Kompeten (Elektrik)
Nama Aktiviti Membuat Semakan Teknikal
Keterangan Aktiviti
Pegawai Teknikal menilai pematuhan 
teknikal permohonan.
Aktor Pegawai Teknikal Tanggungjawab
Menilai pematuhan teknikal & 
kelayakan kekompetenan.

### Page 60

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
 
 
Aktiviti Sebelum PFD-RG-KE-NA-05 Aktiviti Selepas
PFD-RG-KE-NA-08 / PFD-RG-
KE-NA-07
Kaedah / Operasi 
(Bagaimana)
1. Semak butiran teknikal & 
kelayakan. 
2. Sahkan pematuhan syarat & 
peraturan. 
3. Tanda lulus/tidak lulus.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-RG-KE-NA-07 Kemaskini Permohonan
Rujukan Fungsi PFD-RG-KE-NA Rujukan Aktiviti PFD-RG-KE-NA-07
Nama Fungsi
Permohonan Pendaftaran 
Kompeten (Elektrik)
Nama Aktiviti Kemaskini Permohonan
Keterangan Aktiviti
OK mengemas kini permohonan/
dokumen yang tidak lengkap.
Aktor Orang Kompeten Tanggungjawab
Membetulkan & melengkapkan 
maklumat/dokumen.
Aktiviti Sebelum
PFD-RG-KE-NA-05 / PFD-RG-
KE-NA-06
Aktiviti Selepas (kembali ke semakan)
Kaedah / Operasi 
(Bagaimana)
1. Terima notifikasi kemaskini. 
2. Betulkan/lengkapkan maklumat & 
dokumen. 
3. Hantar semula untuk semakan.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-RG-KE-NA-08 Membuat Kelulusan
Rujukan Fungsi PFD-RG-KE-NA Rujukan Aktiviti PFD-RG-KE-NA-08
Nama Fungsi
Permohonan Pendaftaran 
Kompeten (Elektrik)
Nama Aktiviti Membuat Kelulusan
Keterangan Aktiviti
Pelulus membuat keputusan 
kelulusan mengikut LOA.
Aktor Pegawai Pelulus Tanggungjawab
Membuat keputusan lulus/tolak 
mengikut LOA.
Aktiviti Sebelum PFD-RG-KE-NA-06 Aktiviti Selepas
PFD-RG-KE-NA-09 / PFD-RG-
KE-NA-11
Kaedah / Operasi 
(Bagaimana)
1. Semak syor & dokumen sokongan. 
2. Buat keputusan mengikut LOA. 
3. Rekod keputusan dengan jejak 
audit.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-RG-KE-NA-09 Membuat Bayaran Pendaftaran
Rujukan Fungsi PFD-RG-KE-NA Rujukan Aktiviti PFD-RG-KE-NA-09
Nama Fungsi
Permohonan Pendaftaran 
Kompeten (Elektrik)
Nama Aktiviti Membuat Bayaran Pendaftaran
Keterangan Aktiviti
OK membuat bayaran pendaftaran 
selepas diluluskan.

### Page 61

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
 
 
Aktor Orang Kompeten Tanggungjawab
Menjelaskan fi pendaftaran melalui 
FPX.
Aktiviti Sebelum PFD-RG-KE-NA-08 Aktiviti Selepas PFD-RG-KE-NA-10
Kaedah / Operasi 
(Bagaimana)
1. Sistem mengira fi pendaftaran. 
2. OK membuat bayaran melalui 
FPX. 
3. Sistem kemas kini status & resit.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-RG-KE-NA-10 Menerima Perakuan Pendaftaran
Rujukan Fungsi PFD-RG-KE-NA Rujukan Aktiviti PFD-RG-KE-NA-10
Nama Fungsi
Permohonan Pendaftaran 
Kompeten (Elektrik)
Nama Aktiviti Menerima Perakuan Pendaftaran
Keterangan Aktiviti
OK menerima perakuan pendaftaran 
digital berserta QR (ditambat 
blockchain).
Aktor Orang Kompeten Tanggungjawab
Memuat turun & menyimpan 
perakuan.
Aktiviti Sebelum PFD-RG-KE-NA-09 Aktiviti Selepas -
Kaedah / Operasi 
(Bagaimana)
1. Sistem menjana perakuan digital + 
QR. 
2. Hash ditambat pada blockchain. 
3. OK memuat turun; boleh disahkan 
via imbasan QR.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-RG-KE-NA-11 Menerima Makluman Permohonan Ditolak
Rujukan Fungsi PFD-RG-KE-NA Rujukan Aktiviti PFD-RG-KE-NA-11
Nama Fungsi
Permohonan Pendaftaran 
Kompeten (Elektrik)
Nama Aktiviti
Menerima Makluman Permohonan 
Ditolak
Keterangan Aktiviti
OK menerima makluman penolakan 
beserta sebab.
Aktor Orang Kompeten Tanggungjawab
Menyemak sebab penolakan & 
tindakan susulan.
Aktiviti Sebelum PFD-RG-KE-NA-08 Aktiviti Selepas -
Kaedah / Operasi 
(Bagaimana)
1. Sistem menghantar makluman 
penolakan. 
2. OK menyemak sebab. 
3. OK boleh memohon semula jika 
berkenaan.

### Page 62

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
8.1 Modul RG-KG — Pendaftaran Orang Kompeten Gas 
 
Rajah 29: Rajah Use Case — Modul RG-KG: Pendaftaran Orang Kompeten Gas
 
Rajah 30: Rajah Aliran Data (DFD) — Modul RG-KG: Pendaftaran Orang Kompeten Gas
Elemen Keterangan
Kod Modul RG-KG
Fungsi (PFD) PFD-RG-KG-NA — Permohonan Pendaftaran Kompeten (Gas)
Domain / Fasa Pendaftaran / Fasa 1
Keterangan
Modul Kompeten Gas adalah satu modul gunasama yang melibatkan permohonan Pendaftaran 
Orang Kompeten Gas yang berkelayakan berdasarkan peruntukan di bawah Akta Bekalan Gas 
113 (Akta 501) dan Peraturan-peraturan berkaitan. Proses-proses yang terlibat adalah seperti 
berikut: a.
Aktor Utama Pemohon / Individu
Lorong Peranan Pemohon / Pengguna, Pegawai SOS, Pegawai Teknikal, Pelulus

### Page 63

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
Rajah 31: Rajah Hubungan Entiti (ERD) — Modul RG-KG: Pendaftaran Orang Kompeten Gas
Sub-Modul & Fungsian: 
Maklumat Antara Muka — Skrin Pengguna:
- Skrin Log Masuk & Dashboard Pengguna
- Skrin Borang Permohonan
- Skrin Muat Naik & Pengesahan Dokumen (OCR/AI)
- Skrin Notis & Bayaran Fi
- Inbox & Notifikasi
- Skrin Semakan (SOS/Teknikal)
- Skrin Kelulusan (LOA)
- Paparan & Muat Turun Perakuan Digital (QR)
- Skrin Carian & Semakan Status
- Skrin Laporan & Statistik (AIRR)
Maklumat Antara Muka — Integrasi Sistem (API):
- ST Payment Gateway (FPX)
- JPN (ALIS)
- MyDigital ID (NACSA)
- Pos Digicert (e-Signature)
Sub-Modul Fungsian Utama
Permohonan & Pemprosesan
Permohonan Pendaftaran Orang Kompeten; Permohonan Pendaftaran Orang Kompeten 
oleh Majikan (selain daripada; Permohonan Pembaharuan Pendaftaran Orang Kompeten; 
Permohonan Pembaharuan Pendaftaran Orang Kompeten oleh Majikan
Semakan & Kelulusan
Semakan dokumen (SOS), semakan teknikal, kelulusan mengikut LOA, kelulusan 
jawatankuasa (jika berkaitan)
Bayaran & Hasil
Penjanaan invois/notis fi, integrasi Payment Gateway, resit, pemantauan & rekonsiliasi 
hasil
Perakuan & Notifikasi Penjanaan perakuan digital + QR + e-tandatangan, notifikasi emel/inbox
Pemantauan & Pematuhan Pemantauan tarikh luput/jaminan/syarat, peringatan automatik, audit pematuhan
Pelaporan & Statistik Laporan operasi & statistik (AIRR), papan pemuka, eksport
Pentadbiran & Konfigurasi Reference table (jenis dokumen, fi, hari bayaran, ayat notifikasi), kawalan akses (RBAC)

### Page 64

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
Entiti Data Utama Modul:
 
Rajah 32: Carta Alir PFD-RG-KG-NA — Permohonan Pendaftaran Kompeten (Gas)
Definisi Aktiviti Fungsi Bisnes (format Tender):
 
Entiti Atribut Utama
ORANG_KOMPETEN_GAS id_OK (PK), no_perakuan, kategori, status
MAJIKAN id_majikan (PK), nama, no_ssm
DEFINISI AKTIVITI FUNGSI BISNES — PFD-RG-KG-NA-01 Membuat Permohonan
Rujukan Fungsi PFD-RG-KG-NA Rujukan Aktiviti PFD-RG-KG-NA-01
Nama Fungsi
Permohonan Pendaftaran 
Kompeten (Gas)
Nama Aktiviti Membuat Permohonan
Keterangan Aktiviti
Pemohon mengisi borang 
permohonan Permohonan 
Pendaftaran Kompeten (Gas) secara 
atas talian dan memuat naik dokumen 
sokongan.
Aktor Orang Kompeten Tanggungjawab
Melengkapkan borang & memuat 
naik dokumen sebelum 
menghantar.
Aktiviti Sebelum - Aktiviti Selepas PFD-RG-KG-NA-02
Kaedah / Operasi 
(Bagaimana)
1. Log masuk ke Dashboard 
pengguna. 
2. Pilih modul & menu Permohonan 
Baharu. 
3. Isi maklumat permohonan. 
4. Muat naik dokumen sokongan 
(pengesahan OCR/AI). 
5. Buat perakuan ketepatan 
maklumat. 
6. Hantar permohonan.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-RG-KG-NA-02 Membuat Bayaran Fi Proses
Rujukan Fungsi PFD-RG-KG-NA Rujukan Aktiviti PFD-RG-KG-NA-02
Nama Fungsi
Permohonan Pendaftaran 
Kompeten (Gas)
Nama Aktiviti Membuat Bayaran Fi Proses

### Page 65

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
 
 
Keterangan Aktiviti
Pemohon membuat bayaran fi proses 
melalui ST Payment Gateway (FPX).
Aktor Orang Kompeten Tanggungjawab
Menjelaskan fi proses dalam 
tempoh ditetapkan.
Aktiviti Sebelum PFD-RG-KG-NA-01 Aktiviti Selepas PFD-RG-KG-NA-03
Kaedah / Operasi 
(Bagaimana)
1. Sistem mengira fi proses. 
2. Pemohon membuat bayaran 
melalui FPX. 
3. Sistem menjana resit & mengemas 
kini status.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-RG-KG-NA-03 Membuat Semakan Dokumen
Rujukan Fungsi PFD-RG-KG-NA Rujukan Aktiviti PFD-RG-KG-NA-03
Nama Fungsi
Permohonan Pendaftaran 
Kompeten (Gas)
Nama Aktiviti Membuat Semakan Dokumen
Keterangan Aktiviti
Pegawai SOS menyemak 
kelengkapan & kesahihan dokumen 
permohonan.
Aktor Pegawai SOS Tanggungjawab
Memastikan dokumen lengkap & 
sah sebelum semakan teknikal.
Aktiviti Sebelum PFD-RG-KG-NA-02 Aktiviti Selepas PFD-RG-KG-NA-04
Kaedah / Operasi 
(Bagaimana)
1. Semak dokumen yang dimuat naik. 
2. Sahkan kelengkapan & kesahihan. 
3. Jika tidak lengkap, kembalikan 
untuk kemaskini.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-RG-KG-NA-04 Membuat Semakan Teknikal
Rujukan Fungsi PFD-RG-KG-NA Rujukan Aktiviti PFD-RG-KG-NA-04
Nama Fungsi
Permohonan Pendaftaran 
Kompeten (Gas)
Nama Aktiviti Membuat Semakan Teknikal
Keterangan Aktiviti
Pegawai Teknikal menilai pematuhan 
teknikal permohonan Permohonan 
Pendaftaran Kompeten (Gas).
Aktor Pegawai Teknikal Tanggungjawab
Menilai pematuhan teknikal & 
syarat kelayakan.
Aktiviti Sebelum PFD-RG-KG-NA-03 Aktiviti Selepas PFD-RG-KG-NA-06
Kaedah / Operasi 
(Bagaimana)
1. Semak butiran teknikal 
permohonan. 
2. Sahkan pematuhan syarat & 
peraturan. 
3. Tanda lulus/tidak lulus semakan 
teknikal.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-RG-KG-NA-05 Kemaskini Permohonan
Rujukan Fungsi PFD-RG-KG-NA Rujukan Aktiviti PFD-RG-KG-NA-05

### Page 66

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
 
 
Nama Fungsi
Permohonan Pendaftaran 
Kompeten (Gas)
Nama Aktiviti Kemaskini Permohonan
Keterangan Aktiviti
Pemohon mengemas kini 
permohonan/dokumen yang tidak 
lengkap atau perlu pembetulan.
Aktor Orang Kompeten Tanggungjawab
Membetulkan & melengkapkan 
maklumat/dokumen yang diminta.
Aktiviti Sebelum
PFD-RG-KG-NA-03 / PFD-RG-
KG-NA-04
Aktiviti Selepas (kembali ke semakan)
Kaedah / Operasi 
(Bagaimana)
1. Terima notifikasi kemaskini. 
2. Betulkan maklumat / muat naik 
dokumen baharu. 
3. Hantar semula untuk semakan.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-RG-KG-NA-06 Membuat Kelulusan
Rujukan Fungsi PFD-RG-KG-NA Rujukan Aktiviti PFD-RG-KG-NA-06
Nama Fungsi
Permohonan Pendaftaran 
Kompeten (Gas)
Nama Aktiviti Membuat Kelulusan
Keterangan Aktiviti
Pelulus membuat keputusan 
kelulusan mengikut Limit of 
Authority (LOA).
Aktor Pegawai Pelulus Tanggungjawab
Membuat keputusan lulus/tolak 
mengikut LOA.
Aktiviti Sebelum PFD-RG-KG-NA-04 Aktiviti Selepas
PFD-RG-KG-NA-07 / PFD-RG-
KG-NA-09
Kaedah / Operasi 
(Bagaimana)
1. Semak syor & dokumen sokongan. 
2. Buat keputusan mengikut LOA. 
3. Rekod keputusan dengan jejak 
audit.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-RG-KG-NA-07 Membuat Bayaran Pendaftaran
Rujukan Fungsi PFD-RG-KG-NA Rujukan Aktiviti PFD-RG-KG-NA-07
Nama Fungsi
Permohonan Pendaftaran 
Kompeten (Gas)
Nama Aktiviti Membuat Bayaran Pendaftaran
Keterangan Aktiviti
Pemohon membuat bayaran 
pendaftaran/perakuan selepas 
permohonan diluluskan.
Aktor Orang Kompeten Tanggungjawab
Menjelaskan fi pendaftaran melalui 
FPX.
Aktiviti Sebelum PFD-RG-KG-NA-06 Aktiviti Selepas PFD-RG-KG-NA-08
Kaedah / Operasi 
(Bagaimana)
1. Sistem mengira fi pendaftaran. 
2. Pemohon membuat bayaran 
melalui FPX. 
3. Sistem mengemas kini status & 
menjana resit.

### Page 67

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
 
DEFINISI AKTIVITI FUNGSI BISNES — PFD-RG-KG-NA-08 Menerima Perakuan Digital + QR
Rujukan Fungsi PFD-RG-KG-NA Rujukan Aktiviti PFD-RG-KG-NA-08
Nama Fungsi
Permohonan Pendaftaran 
Kompeten (Gas)
Nama Aktiviti Menerima Perakuan Digital + QR
Keterangan Aktiviti
Sistem menjana perakuan digital 
berserta kod QR (ditambat pada 
blockchain) kepada pemohon.
Aktor Orang Kompeten Tanggungjawab
Memuat turun & menyimpan 
perakuan digital.
Aktiviti Sebelum PFD-RG-KG-NA-07 Aktiviti Selepas -
Kaedah / Operasi 
(Bagaimana)
1. Sistem menjana perakuan digital + 
QR. 
2. Hash perakuan ditambat pada 
blockchain. 
3. Pemohon memuat turun perakuan; 
boleh disahkan via imbasan QR.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-RG-KG-NA-09 Menerima Makluman Permohonan Ditolak
Rujukan Fungsi PFD-RG-KG-NA Rujukan Aktiviti PFD-RG-KG-NA-09
Nama Fungsi
Permohonan Pendaftaran 
Kompeten (Gas)
Nama Aktiviti
Menerima Makluman Permohonan 
Ditolak
Keterangan Aktiviti
Pemohon menerima makluman 
penolakan beserta sebab.
Aktor Orang Kompeten Tanggungjawab
Menyemak sebab penolakan & 
tindakan susulan.
Aktiviti Sebelum PFD-RG-KG-NA-06 Aktiviti Selepas -
Kaedah / Operasi 
(Bagaimana)
1. Sistem menghantar makluman 
penolakan. 
2. Pemohon menyemak sebab. 
3. Pemohon boleh memohon semula 
jika berkenaan.

### Page 68

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
8.1 Modul RG-CE — Pendaftaran Kontraktor Elektrik 
 
Rajah 33: Rajah Use Case — Modul RG-CE: Pendaftaran Kontraktor Elektrik
 
Rajah 34: Rajah Aliran Data (DFD) — Modul RG-CE: Pendaftaran Kontraktor Elektrik
Elemen Keterangan
Kod Modul RG-CE
Fungsi (PFD) PFD-RG-CE-NA — Permohonan Pendaftaran Kontraktor (Elektrik)
Domain / Fasa Pendaftaran / Fasa 1
Keterangan
Modul Kontraktor Elektrik adalah satu modul gunasama yang melibatkan permohonan 
Pendaftaran Kontraktor Elektrik yang berkelayakan berdasarkan peruntukan di bawah 
Peraturan-Peraturan Elektrik 1994 (Peraturan 75-79). Proses-proses yang terlibat adalah seperti 
berikut: a.
Aktor Utama Wakil Syarikat / Kontraktor
Lorong Peranan Wakil Kontraktor, Orang Kompeten, Pegawai SOS, Pegawai Teknikal, Pelulus

### Page 69

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
Rajah 35: Rajah Hubungan Entiti (ERD) — Modul RG-CE: Pendaftaran Kontraktor Elektrik
Sub-Modul & Fungsian: 
Maklumat Antara Muka — Skrin Pengguna:
- Skrin Log Masuk & Dashboard Pengguna
- Skrin Borang Permohonan
- Skrin Muat Naik & Pengesahan Dokumen (OCR/AI)
- Skrin Notis & Bayaran Fi
- Inbox & Notifikasi
- Skrin Semakan (SOS/Teknikal)
- Skrin Kelulusan (LOA)
- Paparan & Muat Turun Perakuan Digital (QR)
- Skrin Carian & Semakan Status
- Skrin Laporan & Statistik (AIRR)
Maklumat Antara Muka — Integrasi Sistem (API):
- ST Payment Gateway (FPX)
- SSM (MyDataSSM)
- CIDB (CIMS)
- JPN (ALIS)
Sub-Modul Fungsian Utama
Permohonan & Pemprosesan
Permohonan Pendaftaran Kontraktor Elektrik; Permohonan Pembaharuan Pendaftaran 
Kontraktor Elektrik; Permohonan Pendaftaran Orang Kompeten oleh Kontraktor Elektrik; 
Permohonan Penamatan Pendaftaran Orang Kompeten oleh Kontraktor
Semakan & Kelulusan
Semakan dokumen (SOS), semakan teknikal, kelulusan mengikut LOA, kelulusan 
jawatankuasa (jika berkaitan)
Bayaran & Hasil
Penjanaan invois/notis fi, integrasi Payment Gateway, resit, pemantauan & rekonsiliasi 
hasil
Perakuan & Notifikasi Penjanaan perakuan digital + QR + e-tandatangan, notifikasi emel/inbox
Pemantauan & Pematuhan Pemantauan tarikh luput/jaminan/syarat, peringatan automatik, audit pematuhan
Pelaporan & Statistik Laporan operasi & statistik (AIRR), papan pemuka, eksport
Pentadbiran & Konfigurasi Reference table (jenis dokumen, fi, hari bayaran, ayat notifikasi), kawalan akses (RBAC)

### Page 70

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
•Pos Digicert (e-Signature)
Entiti Data Utama Modul:
 
Rajah 36: Carta Alir PFD-RG-CE-NA — Permohonan Pendaftaran Kontraktor (Elektrik)
Definisi Aktiviti Fungsi Bisnes (format Tender):
 
Entiti Atribut Utama
KONTRAKTOR_ELEKTRIK id_kontraktor (PK), gred, no_pendaftaran, status
PELANTIKAN_OK id (PK), id_kontraktor (FK), id_OK (FK)
DEFINISI AKTIVITI FUNGSI BISNES — PFD-RG-CE-NA-01 Membuat Permohonan
Rujukan Fungsi PFD-RG-CE-NA Rujukan Aktiviti PFD-RG-CE-NA-01
Nama Fungsi
Permohonan Pendaftaran 
Kontraktor (Elektrik)
Nama Aktiviti Membuat Permohonan
Keterangan Aktiviti
Wakil kontraktor membuat 
permohonan pendaftaran kontraktor 
secara atas talian.
Aktor Wakil Kontraktor Tanggungjawab
Melengkapkan borang & memuat 
naik dokumen syarikat.
Aktiviti Sebelum - Aktiviti Selepas PFD-RG-CE-NA-02
Kaedah / Operasi 
(Bagaimana)
1. Log masuk Dashboard. 
2. Pilih menu Permohonan 
Pendaftaran Kontraktor. 
3. Isi maklumat syarikat & 
permohonan. 
4. Muat naik dokumen sokongan.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-RG-CE-NA-02 Carian OK
Rujukan Fungsi PFD-RG-CE-NA Rujukan Aktiviti PFD-RG-CE-NA-02
Nama Fungsi
Permohonan Pendaftaran 
Kontraktor (Elektrik)
Nama Aktiviti Carian OK
Keterangan Aktiviti
Kontraktor mencari & memilih Orang 
Kompeten untuk dilantik.
Aktor Wakil Kontraktor Tanggungjawab
Memilih OK yang sah untuk 
pelantikan.
Aktiviti Sebelum PFD-RG-CE-NA-01 Aktiviti Selepas PFD-RG-CE-NA-03

### Page 71

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
 
 
Kaedah / Operasi 
(Bagaimana)
1. Cari OK melalui no. perakuan/
MyKad. 
2. Sahkan kelayakan OK. 
3. Hantar tawaran pelantikan.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-RG-CE-NA-03 Menerima Pelantikan
Rujukan Fungsi PFD-RG-CE-NA Rujukan Aktiviti PFD-RG-CE-NA-03
Nama Fungsi
Permohonan Pendaftaran 
Kontraktor (Elektrik)
Nama Aktiviti Menerima Pelantikan
Keterangan Aktiviti
OK menerima/menolak pelantikan 
oleh kontraktor.
Aktor Orang Kompeten Tanggungjawab Mengesah/menolak pelantikan.
Aktiviti Sebelum PFD-RG-CE-NA-02 Aktiviti Selepas
PFD-RG-CE-NA-04 / Tidak 
Diteruskan
Kaedah / Operasi 
(Bagaimana)
1. OK terima notifikasi pelantikan. 
2. Semak butiran kontraktor. 
3. Sahkan atau tolak pelantikan.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-RG-CE-NA-04 Hantar Permohonan
Rujukan Fungsi PFD-RG-CE-NA Rujukan Aktiviti PFD-RG-CE-NA-04
Nama Fungsi
Permohonan Pendaftaran 
Kontraktor (Elektrik)
Nama Aktiviti Hantar Permohonan
Keterangan Aktiviti
Kontraktor menghantar permohonan 
selepas pelantikan disahkan.
Aktor Wakil Kontraktor Tanggungjawab
Mengesahkan & menghantar 
permohonan lengkap.
Aktiviti Sebelum PFD-RG-CE-NA-03 Aktiviti Selepas PFD-RG-CE-NA-05
Kaedah / Operasi 
(Bagaimana)
1. Semak kelengkapan permohonan. 
2. Buat perakuan ketepatan. 
3. Hantar permohonan.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-RG-CE-NA-05 Membuat Pembayaran Fi Proses
Rujukan Fungsi PFD-RG-CE-NA Rujukan Aktiviti PFD-RG-CE-NA-05
Nama Fungsi
Permohonan Pendaftaran 
Kontraktor (Elektrik)
Nama Aktiviti Membuat Pembayaran Fi Proses
Keterangan Aktiviti
Kontraktor membuat bayaran fi 
proses melalui FPX.
Aktor Wakil Kontraktor Tanggungjawab Menjelaskan fi proses.
Aktiviti Sebelum PFD-RG-CE-NA-04 Aktiviti Selepas PFD-RG-CE-NA-06
Kaedah / Operasi 
(Bagaimana)
1. Sistem mengira fi. 
2. Bayar melalui FPX. 
3. Sistem jana resit & kemas kini 
status.

### Page 72

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
 
 
 
DEFINISI AKTIVITI FUNGSI BISNES — PFD-RG-CE-NA-06 Membuat Semakan Dokumen
Rujukan Fungsi PFD-RG-CE-NA Rujukan Aktiviti PFD-RG-CE-NA-06
Nama Fungsi
Permohonan Pendaftaran 
Kontraktor (Elektrik)
Nama Aktiviti Membuat Semakan Dokumen
Keterangan Aktiviti
Pegawai SOS menyemak 
kelengkapan & kesahihan dokumen.
Aktor Pegawai SOS Tanggungjawab
Memastikan dokumen lengkap & 
sah.
Aktiviti Sebelum PFD-RG-CE-NA-05 Aktiviti Selepas
PFD-RG-CE-NA-07 / PFD-RG-
CE-NA-08
Kaedah / Operasi 
(Bagaimana)
1. Semak dokumen. 
2. Sahkan kelengkapan. 
3. Jika tidak lengkap, kembalikan 
untuk kemaskini.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-RG-CE-NA-07 Membuat Semakan Teknikal
Rujukan Fungsi PFD-RG-CE-NA Rujukan Aktiviti PFD-RG-CE-NA-07
Nama Fungsi
Permohonan Pendaftaran 
Kontraktor (Elektrik)
Nama Aktiviti Membuat Semakan Teknikal
Keterangan Aktiviti
Pegawai Teknikal menilai pematuhan 
teknikal & kelayakan kontraktor.
Aktor Pegawai Teknikal Tanggungjawab
Menilai pematuhan syarat kelas/
kategori.
Aktiviti Sebelum PFD-RG-CE-NA-06 Aktiviti Selepas
PFD-RG-CE-NA-09 / PFD-RG-
CE-NA-08
Kaedah / Operasi 
(Bagaimana)
1. Semak butiran teknikal & kelas. 
2. Sahkan pematuhan. 
3. Tanda lulus/tidak lulus.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-RG-CE-NA-08 Kemaskini Permohonan
Rujukan Fungsi PFD-RG-CE-NA Rujukan Aktiviti PFD-RG-CE-NA-08
Nama Fungsi
Permohonan Pendaftaran 
Kontraktor (Elektrik)
Nama Aktiviti Kemaskini Permohonan
Keterangan Aktiviti
Kontraktor mengemas kini 
permohonan/dokumen.
Aktor Wakil Kontraktor Tanggungjawab Membetulkan & melengkapkan.
Aktiviti Sebelum
PFD-RG-CE-NA-06 / PFD-RG-
CE-NA-07
Aktiviti Selepas (kembali ke semakan)
Kaedah / Operasi 
(Bagaimana)
1. Terima notifikasi kemaskini. 
2. Betulkan maklumat/dokumen. 
3. Hantar semula.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-RG-CE-NA-09 Membuat Kelulusan

### Page 73

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
 
 
Rujukan Fungsi PFD-RG-CE-NA Rujukan Aktiviti PFD-RG-CE-NA-09
Nama Fungsi
Permohonan Pendaftaran 
Kontraktor (Elektrik)
Nama Aktiviti Membuat Kelulusan
Keterangan Aktiviti
Pelulus membuat keputusan mengikut 
LOA.
Aktor Pegawai Pelulus Tanggungjawab
Keputusan lulus/tolak mengikut 
LOA.
Aktiviti Sebelum PFD-RG-CE-NA-07 Aktiviti Selepas
PFD-RG-CE-NA-10 / PFD-RG-
CE-NA-12
Kaedah / Operasi 
(Bagaimana)
1. Semak syor. 
2. Buat keputusan mengikut LOA. 
3. Rekod dengan jejak audit.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-RG-CE-NA-10 Membuat Bayaran Pendaftaran
Rujukan Fungsi PFD-RG-CE-NA Rujukan Aktiviti PFD-RG-CE-NA-10
Nama Fungsi
Permohonan Pendaftaran 
Kontraktor (Elektrik)
Nama Aktiviti Membuat Bayaran Pendaftaran
Keterangan Aktiviti
Kontraktor membuat bayaran 
pendaftaran.
Aktor Wakil Kontraktor Tanggungjawab Menjelaskan fi pendaftaran.
Aktiviti Sebelum PFD-RG-CE-NA-09 Aktiviti Selepas PFD-RG-CE-NA-11
Kaedah / Operasi 
(Bagaimana)
1. Sistem mengira fi pendaftaran. 
2. Bayar melalui FPX. 
3. Kemas kini status & resit.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-RG-CE-NA-11 Menerima Perakuan Pendaftaran
Rujukan Fungsi PFD-RG-CE-NA Rujukan Aktiviti PFD-RG-CE-NA-11
Nama Fungsi
Permohonan Pendaftaran 
Kontraktor (Elektrik)
Nama Aktiviti Menerima Perakuan Pendaftaran
Keterangan Aktiviti
Kontraktor menerima perakuan 
digital + QR (blockchain).
Aktor Wakil Kontraktor Tanggungjawab
Memuat turun & menyimpan 
perakuan.
Aktiviti Sebelum PFD-RG-CE-NA-10 Aktiviti Selepas -
Kaedah / Operasi 
(Bagaimana)
1. Sistem jana perakuan + QR. 
2. Hash ditambat blockchain. 
3. Muat turun; disahkan via QR.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-RG-CE-NA-12 Menerima Makluman Permohonan Ditolak
Rujukan Fungsi PFD-RG-CE-NA Rujukan Aktiviti PFD-RG-CE-NA-12
Nama Fungsi
Permohonan Pendaftaran 
Kontraktor (Elektrik)
Nama Aktiviti
Menerima Makluman Permohonan 
Ditolak

### Page 74

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
Keterangan Aktiviti
Kontraktor menerima makluman 
penolakan.
Aktor Wakil Kontraktor Tanggungjawab
Menyemak sebab & tindakan 
susulan.
Aktiviti Sebelum PFD-RG-CE-NA-09 Aktiviti Selepas -
Kaedah / Operasi 
(Bagaimana)
1. Sistem hantar makluman. 
2. Semak sebab. 
3. Mohon semula jika berkenaan.

### Page 75

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
8.1 Modul RG-CG — Pendaftaran Kontraktor Gas 
 
Rajah 37: Rajah Use Case — Modul RG-CG: Pendaftaran Kontraktor Gas
 
Rajah 38: Rajah Aliran Data (DFD) — Modul RG-CG: Pendaftaran Kontraktor Gas
Elemen Keterangan
Kod Modul RG-CG
Fungsi (PFD) PFD-RG-CG-NA — Permohonan Pendaftaran Kontraktor (Gas)
Domain / Fasa Pendaftaran / Fasa 1
Keterangan
Modul Kontraktor Gas adalah satu modul gunasama yang melibatkan permohonan Pendaftaran 
Kontraktor Gas yang berkelayakan berdasarkan peruntukan di bawah Peraturan Bekalan Gas 
1997 (Peraturan 103). Proses-proses yang terlibat adalah seperti berikut: a.
Aktor Utama Wakil Syarikat / Kontraktor
Lorong Peranan Pemohon / Pengguna, Pegawai SOS, Pegawai Teknikal, Pelulus

### Page 76

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
Rajah 39: Rajah Hubungan Entiti (ERD) — Modul RG-CG: Pendaftaran Kontraktor Gas
Sub-Modul & Fungsian: 
Maklumat Antara Muka — Skrin Pengguna:
- Skrin Log Masuk & Dashboard Pengguna
- Skrin Borang Permohonan
- Skrin Muat Naik & Pengesahan Dokumen (OCR/AI)
- Skrin Notis & Bayaran Fi
- Inbox & Notifikasi
- Skrin Semakan (SOS/Teknikal)
- Skrin Kelulusan (LOA)
- Paparan & Muat Turun Perakuan Digital (QR)
- Skrin Carian & Semakan Status
- Skrin Laporan & Statistik (AIRR)
Maklumat Antara Muka — Integrasi Sistem (API):
- ST Payment Gateway (FPX)
- SSM (MyDataSSM)
- CIDB (CIMS)
- JPN (ALIS)
Sub-Modul Fungsian Utama
Permohonan & Pemprosesan
Permohonan Pendaftaran Kontraktor Gas; Permohonan Pembaharuan Pendaftaran 
Kontraktor Gas; Permohonan Pendaftaran Orang Kompeten oleh Kontraktor Gas; 
Permohonan Penamatan Pendaftaran Orang Kompeten oleh Kontraktor
Semakan & Kelulusan
Semakan dokumen (SOS), semakan teknikal, kelulusan mengikut LOA, kelulusan 
jawatankuasa (jika berkaitan)
Bayaran & Hasil
Penjanaan invois/notis fi, integrasi Payment Gateway, resit, pemantauan & rekonsiliasi 
hasil
Perakuan & Notifikasi Penjanaan perakuan digital + QR + e-tandatangan, notifikasi emel/inbox
Pemantauan & Pematuhan Pemantauan tarikh luput/jaminan/syarat, peringatan automatik, audit pematuhan
Pelaporan & Statistik Laporan operasi & statistik (AIRR), papan pemuka, eksport
Pentadbiran & Konfigurasi Reference table (jenis dokumen, fi, hari bayaran, ayat notifikasi), kawalan akses (RBAC)

### Page 77

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
•Pos Digicert (e-Signature)
Entiti Data Utama Modul:
 
Rajah 40: Carta Alir PFD-RG-CG-NA — Permohonan Pendaftaran Kontraktor (Gas)
Definisi Aktiviti Fungsi Bisnes (format Tender):
 
Entiti Atribut Utama
KONTRAKTOR_GAS id_kontraktor (PK), gred, no_pendaftaran, status
PELANTIKAN_OK id (PK), id_kontraktor (FK), id_OK (FK)
DEFINISI AKTIVITI FUNGSI BISNES — PFD-RG-CG-NA-01 Membuat Permohonan
Rujukan Fungsi PFD-RG-CG-NA Rujukan Aktiviti PFD-RG-CG-NA-01
Nama Fungsi
Permohonan Pendaftaran 
Kontraktor (Gas)
Nama Aktiviti Membuat Permohonan
Keterangan Aktiviti
Pemohon mengisi borang 
permohonan Permohonan 
Pendaftaran Kontraktor (Gas) secara 
atas talian dan memuat naik dokumen 
sokongan.
Aktor Wakil Kontraktor Tanggungjawab
Melengkapkan borang & memuat 
naik dokumen sebelum 
menghantar.
Aktiviti Sebelum - Aktiviti Selepas PFD-RG-CG-NA-02
Kaedah / Operasi 
(Bagaimana)
1. Log masuk ke Dashboard 
pengguna. 
2. Pilih modul & menu Permohonan 
Baharu. 
3. Isi maklumat permohonan. 
4. Muat naik dokumen sokongan 
(pengesahan OCR/AI). 
5. Buat perakuan ketepatan 
maklumat. 
6. Hantar permohonan.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-RG-CG-NA-02 Membuat Bayaran Fi Proses
Rujukan Fungsi PFD-RG-CG-NA Rujukan Aktiviti PFD-RG-CG-NA-02
Nama Fungsi
Permohonan Pendaftaran 
Kontraktor (Gas)
Nama Aktiviti Membuat Bayaran Fi Proses

### Page 78

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
 
 
Keterangan Aktiviti
Pemohon membuat bayaran fi proses 
melalui ST Payment Gateway (FPX).
Aktor Wakil Kontraktor Tanggungjawab
Menjelaskan fi proses dalam 
tempoh ditetapkan.
Aktiviti Sebelum PFD-RG-CG-NA-01 Aktiviti Selepas PFD-RG-CG-NA-03
Kaedah / Operasi 
(Bagaimana)
1. Sistem mengira fi proses. 
2. Pemohon membuat bayaran 
melalui FPX. 
3. Sistem menjana resit & mengemas 
kini status.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-RG-CG-NA-03 Membuat Semakan Dokumen
Rujukan Fungsi PFD-RG-CG-NA Rujukan Aktiviti PFD-RG-CG-NA-03
Nama Fungsi
Permohonan Pendaftaran 
Kontraktor (Gas)
Nama Aktiviti Membuat Semakan Dokumen
Keterangan Aktiviti
Pegawai SOS menyemak 
kelengkapan & kesahihan dokumen 
permohonan.
Aktor Pegawai SOS Tanggungjawab
Memastikan dokumen lengkap & 
sah sebelum semakan teknikal.
Aktiviti Sebelum PFD-RG-CG-NA-02 Aktiviti Selepas PFD-RG-CG-NA-04
Kaedah / Operasi 
(Bagaimana)
1. Semak dokumen yang dimuat naik. 
2. Sahkan kelengkapan & kesahihan. 
3. Jika tidak lengkap, kembalikan 
untuk kemaskini.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-RG-CG-NA-04 Membuat Semakan Teknikal
Rujukan Fungsi PFD-RG-CG-NA Rujukan Aktiviti PFD-RG-CG-NA-04
Nama Fungsi
Permohonan Pendaftaran 
Kontraktor (Gas)
Nama Aktiviti Membuat Semakan Teknikal
Keterangan Aktiviti
Pegawai Teknikal menilai pematuhan 
teknikal permohonan Permohonan 
Pendaftaran Kontraktor (Gas).
Aktor Pegawai Teknikal Tanggungjawab
Menilai pematuhan teknikal & 
syarat kelayakan.
Aktiviti Sebelum PFD-RG-CG-NA-03 Aktiviti Selepas PFD-RG-CG-NA-06
Kaedah / Operasi 
(Bagaimana)
1. Semak butiran teknikal 
permohonan. 
2. Sahkan pematuhan syarat & 
peraturan. 
3. Tanda lulus/tidak lulus semakan 
teknikal.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-RG-CG-NA-05 Kemaskini Permohonan
Rujukan Fungsi PFD-RG-CG-NA Rujukan Aktiviti PFD-RG-CG-NA-05

### Page 79

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
 
 
Nama Fungsi
Permohonan Pendaftaran 
Kontraktor (Gas)
Nama Aktiviti Kemaskini Permohonan
Keterangan Aktiviti
Pemohon mengemas kini 
permohonan/dokumen yang tidak 
lengkap atau perlu pembetulan.
Aktor Wakil Kontraktor Tanggungjawab
Membetulkan & melengkapkan 
maklumat/dokumen yang diminta.
Aktiviti Sebelum
PFD-RG-CG-NA-03 / PFD-RG-
CG-NA-04
Aktiviti Selepas (kembali ke semakan)
Kaedah / Operasi 
(Bagaimana)
1. Terima notifikasi kemaskini. 
2. Betulkan maklumat / muat naik 
dokumen baharu. 
3. Hantar semula untuk semakan.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-RG-CG-NA-06 Membuat Kelulusan
Rujukan Fungsi PFD-RG-CG-NA Rujukan Aktiviti PFD-RG-CG-NA-06
Nama Fungsi
Permohonan Pendaftaran 
Kontraktor (Gas)
Nama Aktiviti Membuat Kelulusan
Keterangan Aktiviti
Pelulus membuat keputusan 
kelulusan mengikut Limit of 
Authority (LOA).
Aktor Pegawai Pelulus Tanggungjawab
Membuat keputusan lulus/tolak 
mengikut LOA.
Aktiviti Sebelum PFD-RG-CG-NA-04 Aktiviti Selepas
PFD-RG-CG-NA-07 / PFD-RG-
CG-NA-09
Kaedah / Operasi 
(Bagaimana)
1. Semak syor & dokumen sokongan. 
2. Buat keputusan mengikut LOA. 
3. Rekod keputusan dengan jejak 
audit.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-RG-CG-NA-07 Membuat Bayaran Pendaftaran
Rujukan Fungsi PFD-RG-CG-NA Rujukan Aktiviti PFD-RG-CG-NA-07
Nama Fungsi
Permohonan Pendaftaran 
Kontraktor (Gas)
Nama Aktiviti Membuat Bayaran Pendaftaran
Keterangan Aktiviti
Pemohon membuat bayaran 
pendaftaran/perakuan selepas 
permohonan diluluskan.
Aktor Wakil Kontraktor Tanggungjawab
Menjelaskan fi pendaftaran melalui 
FPX.
Aktiviti Sebelum PFD-RG-CG-NA-06 Aktiviti Selepas PFD-RG-CG-NA-08
Kaedah / Operasi 
(Bagaimana)
1. Sistem mengira fi pendaftaran. 
2. Pemohon membuat bayaran 
melalui FPX. 
3. Sistem mengemas kini status & 
menjana resit.

### Page 80

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
 
DEFINISI AKTIVITI FUNGSI BISNES — PFD-RG-CG-NA-08 Menerima Perakuan Digital + QR
Rujukan Fungsi PFD-RG-CG-NA Rujukan Aktiviti PFD-RG-CG-NA-08
Nama Fungsi
Permohonan Pendaftaran 
Kontraktor (Gas)
Nama Aktiviti Menerima Perakuan Digital + QR
Keterangan Aktiviti
Sistem menjana perakuan digital 
berserta kod QR (ditambat pada 
blockchain) kepada pemohon.
Aktor Wakil Kontraktor Tanggungjawab
Memuat turun & menyimpan 
perakuan digital.
Aktiviti Sebelum PFD-RG-CG-NA-07 Aktiviti Selepas -
Kaedah / Operasi 
(Bagaimana)
1. Sistem menjana perakuan digital + 
QR. 
2. Hash perakuan ditambat pada 
blockchain. 
3. Pemohon memuat turun perakuan; 
boleh disahkan via imbasan QR.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-RG-CG-NA-09 Menerima Makluman Permohonan Ditolak
Rujukan Fungsi PFD-RG-CG-NA Rujukan Aktiviti PFD-RG-CG-NA-09
Nama Fungsi
Permohonan Pendaftaran 
Kontraktor (Gas)
Nama Aktiviti
Menerima Makluman Permohonan 
Ditolak
Keterangan Aktiviti
Pemohon menerima makluman 
penolakan beserta sebab.
Aktor Wakil Kontraktor Tanggungjawab
Menyemak sebab penolakan & 
tindakan susulan.
Aktiviti Sebelum PFD-RG-CG-NA-06 Aktiviti Selepas -
Kaedah / Operasi 
(Bagaimana)
1. Sistem menghantar makluman 
penolakan. 
2. Pemohon menyemak sebab. 
3. Pemohon boleh memohon semula 
jika berkenaan.

### Page 81

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
8.1 Modul PE-ID — Pengurusan ID & Akaun Pengguna 
 
Rajah 41: Rajah Use Case — Modul PE-ID: Pengurusan ID & Akaun Pengguna
 
Rajah 42: Rajah Aliran Data (DFD) — Modul PE-ID: Pengurusan ID & Akaun Pengguna
Elemen Keterangan
Kod Modul PE-ID
Fungsi (PFD) PFD-PE-ID-NA — Pengurusan ID & Akaun Pengguna
Domain / Fasa Operasi & Perkhidmatan / Fasa 1
Keterangan
Modul Pengurusan Akses Pengguna adalah satu modul gunasama yang akan digunakan untuk 
pendaftaran pengguna sistem serta kawalan akses/penggunaan sistem. Modul ini juga 
menyediakan platform profil pengguna yang komprehensif yang mengandungi semua maklumat 
pengguna dan/atau syarikat, peranan, transaksi
Aktor Utama Pengguna ST / Pegawai
Lorong Peranan Pemohon / Pengguna, Pegawai SOS, Pegawai Teknikal, Pelulus

### Page 82

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
Rajah 43: Rajah Hubungan Entiti (ERD) — Modul PE-ID: Pengurusan ID & Akaun Pengguna
Sub-Modul & Fungsian: 
Maklumat Antara Muka — Skrin Pengguna:
- Skrin Log Masuk & Dashboard Pengguna
- Skrin Borang Permohonan
- Skrin Muat Naik & Pengesahan Dokumen (OCR/AI)
- Skrin Notis & Bayaran Fi
- Inbox & Notifikasi
- Skrin Semakan (SOS/Teknikal)
- Skrin Kelulusan (LOA)
- Paparan & Muat Turun Perakuan Digital (QR)
- Skrin Carian & Semakan Status
- Skrin Laporan & Statistik (AIRR)
Maklumat Antara Muka — Integrasi Sistem (API):
- MyDigital ID (NACSA)
- JPN (ALIS)
- SSM (MyDataSSM)
Entiti Data Utama Modul:
Sub-Modul Fungsian Utama
Permohonan & Pemprosesan
Pendaftaran Pengguna; Pendaftaran Kakitangan ST; Pengurusan Akses Pengguna; 
Pendaftaran Entiti Bisnes / Organisasi
Semakan & Kelulusan
Semakan dokumen (SOS), semakan teknikal, kelulusan mengikut LOA, kelulusan 
jawatankuasa (jika berkaitan)
Bayaran & Hasil
Penjanaan invois/notis fi, integrasi Payment Gateway, resit, pemantauan & rekonsiliasi 
hasil
Perakuan & Notifikasi Penjanaan perakuan digital + QR + e-tandatangan, notifikasi emel/inbox
Pemantauan & Pematuhan Pemantauan tarikh luput/jaminan/syarat, peringatan automatik, audit pematuhan
Pelaporan & Statistik Laporan operasi & statistik (AIRR), papan pemuka, eksport
Pentadbiran & Konfigurasi Reference table (jenis dokumen, fi, hari bayaran, ayat notifikasi), kawalan akses (RBAC)

### Page 83

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
Rajah 44: Carta Alir PFD-PE-ID-NA — Pengurusan ID & Akaun Pengguna
Definisi Aktiviti Fungsi Bisnes (format Tender):
 
Entiti Atribut Utama
AKAUN_PERANAN id_peranan (PK), id_pengguna (FK), peranan, skop_LOA
PROFIL_PENGGUNA id (PK), id_pengguna (FK), maklumat, syarikat
DEFINISI AKTIVITI FUNGSI BISNES — PFD-PE-ID-NA-01 Membuat Permohonan
Rujukan Fungsi PFD-PE-ID-NA Rujukan Aktiviti PFD-PE-ID-NA-01
Nama Fungsi Pengurusan ID & Akaun PenggunaNama Aktiviti Membuat Permohonan
Keterangan Aktiviti
Pemohon mengisi borang 
permohonan Pengurusan ID & Akaun 
Pengguna secara atas talian dan 
memuat naik dokumen sokongan.
Aktor Pengguna Awam Tanggungjawab
Melengkapkan borang & memuat 
naik dokumen sebelum 
menghantar.
Aktiviti Sebelum - Aktiviti Selepas PFD-PE-ID-NA-02
Kaedah / Operasi 
(Bagaimana)
1. Log masuk ke Dashboard 
pengguna. 
2. Pilih modul & menu Permohonan 
Baharu. 
3. Isi maklumat permohonan. 
4. Muat naik dokumen sokongan 
(pengesahan OCR/AI). 
5. Buat perakuan ketepatan 
maklumat. 
6. Hantar permohonan.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-PE-ID-NA-02 Membuat Bayaran Fi Proses
Rujukan Fungsi PFD-PE-ID-NA Rujukan Aktiviti PFD-PE-ID-NA-02
Nama Fungsi Pengurusan ID & Akaun PenggunaNama Aktiviti Membuat Bayaran Fi Proses
Keterangan Aktiviti
Pemohon membuat bayaran fi proses 
melalui ST Payment Gateway (FPX).
Aktor Pengguna Awam Tanggungjawab
Menjelaskan fi proses dalam 
tempoh ditetapkan.

### Page 84

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
 
 
Aktiviti Sebelum PFD-PE-ID-NA-01 Aktiviti Selepas PFD-PE-ID-NA-03
Kaedah / Operasi 
(Bagaimana)
1. Sistem mengira fi proses. 
2. Pemohon membuat bayaran 
melalui FPX. 
3. Sistem menjana resit & mengemas 
kini status.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-PE-ID-NA-03 Membuat Semakan Dokumen
Rujukan Fungsi PFD-PE-ID-NA Rujukan Aktiviti PFD-PE-ID-NA-03
Nama Fungsi Pengurusan ID & Akaun PenggunaNama Aktiviti Membuat Semakan Dokumen
Keterangan Aktiviti
Pegawai SOS menyemak 
kelengkapan & kesahihan dokumen 
permohonan.
Aktor Pegawai SOS Tanggungjawab
Memastikan dokumen lengkap & 
sah sebelum semakan teknikal.
Aktiviti Sebelum PFD-PE-ID-NA-02 Aktiviti Selepas PFD-PE-ID-NA-04
Kaedah / Operasi 
(Bagaimana)
1. Semak dokumen yang dimuat naik. 
2. Sahkan kelengkapan & kesahihan. 
3. Jika tidak lengkap, kembalikan 
untuk kemaskini.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-PE-ID-NA-04 Membuat Semakan Teknikal
Rujukan Fungsi PFD-PE-ID-NA Rujukan Aktiviti PFD-PE-ID-NA-04
Nama Fungsi Pengurusan ID & Akaun PenggunaNama Aktiviti Membuat Semakan Teknikal
Keterangan Aktiviti
Pegawai Teknikal menilai pematuhan 
teknikal permohonan Pengurusan ID 
& Akaun Pengguna.
Aktor Pegawai Teknikal Tanggungjawab
Menilai pematuhan teknikal & 
syarat kelayakan.
Aktiviti Sebelum PFD-PE-ID-NA-03 Aktiviti Selepas PFD-PE-ID-NA-06
Kaedah / Operasi 
(Bagaimana)
1. Semak butiran teknikal 
permohonan. 
2. Sahkan pematuhan syarat & 
peraturan. 
3. Tanda lulus/tidak lulus semakan 
teknikal.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-PE-ID-NA-05 Kemaskini Permohonan
Rujukan Fungsi PFD-PE-ID-NA Rujukan Aktiviti PFD-PE-ID-NA-05
Nama Fungsi Pengurusan ID & Akaun PenggunaNama Aktiviti Kemaskini Permohonan
Keterangan Aktiviti
Pemohon mengemas kini 
permohonan/dokumen yang tidak 
lengkap atau perlu pembetulan.
Aktor Pengguna Awam Tanggungjawab
Membetulkan & melengkapkan 
maklumat/dokumen yang diminta.

### Page 85

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
 
 
Aktiviti Sebelum
PFD-PE-ID-NA-03 / PFD-PE-ID-
NA-04
Aktiviti Selepas (kembali ke semakan)
Kaedah / Operasi 
(Bagaimana)
1. Terima notifikasi kemaskini. 
2. Betulkan maklumat / muat naik 
dokumen baharu. 
3. Hantar semula untuk semakan.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-PE-ID-NA-06 Membuat Kelulusan
Rujukan Fungsi PFD-PE-ID-NA Rujukan Aktiviti PFD-PE-ID-NA-06
Nama Fungsi Pengurusan ID & Akaun PenggunaNama Aktiviti Membuat Kelulusan
Keterangan Aktiviti
Pelulus membuat keputusan 
kelulusan mengikut Limit of 
Authority (LOA).
Aktor Pegawai Pelulus Tanggungjawab
Membuat keputusan lulus/tolak 
mengikut LOA.
Aktiviti Sebelum PFD-PE-ID-NA-04 Aktiviti Selepas
PFD-PE-ID-NA-07 / PFD-PE-ID-
NA-09
Kaedah / Operasi 
(Bagaimana)
1. Semak syor & dokumen sokongan. 
2. Buat keputusan mengikut LOA. 
3. Rekod keputusan dengan jejak 
audit.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-PE-ID-NA-07 Membuat Bayaran Pendaftaran
Rujukan Fungsi PFD-PE-ID-NA Rujukan Aktiviti PFD-PE-ID-NA-07
Nama Fungsi Pengurusan ID & Akaun PenggunaNama Aktiviti Membuat Bayaran Pendaftaran
Keterangan Aktiviti
Pemohon membuat bayaran 
pendaftaran/perakuan selepas 
permohonan diluluskan.
Aktor Pengguna Awam Tanggungjawab
Menjelaskan fi pendaftaran melalui 
FPX.
Aktiviti Sebelum PFD-PE-ID-NA-06 Aktiviti Selepas PFD-PE-ID-NA-08
Kaedah / Operasi 
(Bagaimana)
1. Sistem mengira fi pendaftaran. 
2. Pemohon membuat bayaran 
melalui FPX. 
3. Sistem mengemas kini status & 
menjana resit.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-PE-ID-NA-08 Menerima Perakuan Digital + QR
Rujukan Fungsi PFD-PE-ID-NA Rujukan Aktiviti PFD-PE-ID-NA-08
Nama Fungsi Pengurusan ID & Akaun PenggunaNama Aktiviti Menerima Perakuan Digital + QR
Keterangan Aktiviti
Sistem menjana perakuan digital 
berserta kod QR (ditambat pada 
blockchain) kepada pemohon.
Aktor Pengguna Awam Tanggungjawab
Memuat turun & menyimpan 
perakuan digital.

### Page 86

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
 
Aktiviti Sebelum PFD-PE-ID-NA-07 Aktiviti Selepas -
Kaedah / Operasi 
(Bagaimana)
1. Sistem menjana perakuan digital + 
QR. 
2. Hash perakuan ditambat pada 
blockchain. 
3. Pemohon memuat turun perakuan; 
boleh disahkan via imbasan QR.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-PE-ID-NA-09 Menerima Makluman Permohonan Ditolak
Rujukan Fungsi PFD-PE-ID-NA Rujukan Aktiviti PFD-PE-ID-NA-09
Nama Fungsi Pengurusan ID & Akaun PenggunaNama Aktiviti
Menerima Makluman Permohonan 
Ditolak
Keterangan Aktiviti
Pemohon menerima makluman 
penolakan beserta sebab.
Aktor Pengguna Awam Tanggungjawab
Menyemak sebab penolakan & 
tindakan susulan.
Aktiviti Sebelum PFD-PE-ID-NA-06 Aktiviti Selepas -
Kaedah / Operasi 
(Bagaimana)
1. Sistem menghantar makluman 
penolakan. 
2. Pemohon menyemak sebab. 
3. Pemohon boleh memohon semula 
jika berkenaan.

### Page 87

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
8.1 Modul PE-RV — Pengurusan Hasil 
 
Rajah 45: Rajah Use Case — Modul PE-RV: Pengurusan Hasil
 
Rajah 46: Rajah Aliran Data (DFD) — Modul PE-RV: Pengurusan Hasil
Elemen Keterangan
Kod Modul PE-RV
Fungsi (PFD) PFD-PE-RV-NA — Pengurusan Hasil & Bayaran
Domain / Fasa Operasi & Perkhidmatan / Fasa 1
Keterangan Modul gunasama Sistem Digital ST.
Aktor Utama Pengguna ST / Pegawai
Lorong Peranan Pemohon / Pengguna, Pegawai SOS, Pegawai Teknikal, Pelulus

### Page 88

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
Rajah 47: Rajah Hubungan Entiti (ERD) — Modul PE-RV: Pengurusan Hasil
Sub-Modul & Fungsian: 
Maklumat Antara Muka — Skrin Pengguna:
- Skrin Log Masuk & Dashboard Pengguna
- Skrin Borang Permohonan
- Skrin Muat Naik & Pengesahan Dokumen (OCR/AI)
- Skrin Notis & Bayaran Fi
- Inbox & Notifikasi
- Skrin Semakan (SOS/Teknikal)
- Skrin Kelulusan (LOA)
- Paparan & Muat Turun Perakuan Digital (QR)
- Skrin Carian & Semakan Status
- Skrin Laporan & Statistik (AIRR)
Maklumat Antara Muka — Integrasi Sistem (API):
- ST Payment Gateway (FPX)
- CIMB H2H
Sub-Modul Fungsian Utama
Permohonan & Pemprosesan
Proses Bayaran Dalam Talian Menerusi FPX/DOBW; Proses Bayaran Menggunakan 
Virtual Account; Permohonan Virtual Account Tetap; Proses Bayaran Kompaun Dalam 
Talian (Pengguna Berdaftar dan
Semakan & Kelulusan
Semakan dokumen (SOS), semakan teknikal, kelulusan mengikut LOA, kelulusan 
jawatankuasa (jika berkaitan)
Bayaran & Hasil
Penjanaan invois/notis fi, integrasi Payment Gateway, resit, pemantauan & rekonsiliasi 
hasil
Perakuan & Notifikasi Penjanaan perakuan digital + QR + e-tandatangan, notifikasi emel/inbox
Pemantauan & Pematuhan Pemantauan tarikh luput/jaminan/syarat, peringatan automatik, audit pematuhan
Pelaporan & Statistik Laporan operasi & statistik (AIRR), papan pemuka, eksport
Pentadbiran & Konfigurasi Reference table (jenis dokumen, fi, hari bayaran, ayat notifikasi), kawalan akses (RBAC)

### Page 89

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
Entiti Data Utama Modul:
 
Rajah 48: Carta Alir PFD-PE-RV-NA — Pengurusan Hasil & Bayaran
Definisi Aktiviti Fungsi Bisnes (format Tender):
 
Entiti Atribut Utama
INVOIS id_invois (PK), id_permohonan (FK), amaun, status
RESIT id_resit (PK), id_invois (FK), tarikh, kaedah
AKAUN_HASIL id (PK), kod_hasil, jumlah_kutipan
DEFINISI AKTIVITI FUNGSI BISNES — PFD-PE-RV-NA-01 Membuat Permohonan
Rujukan Fungsi PFD-PE-RV-NA Rujukan Aktiviti PFD-PE-RV-NA-01
Nama Fungsi Pengurusan Hasil & Bayaran Nama Aktiviti Membuat Permohonan
Keterangan Aktiviti
Pemohon mengisi borang 
permohonan Pengurusan Hasil & 
Bayaran secara atas talian dan 
memuat naik dokumen sokongan.
Aktor Pemohon / Pembayar Tanggungjawab
Melengkapkan borang & memuat 
naik dokumen sebelum 
menghantar.
Aktiviti Sebelum - Aktiviti Selepas PFD-PE-RV-NA-02
Kaedah / Operasi 
(Bagaimana)
1. Log masuk ke Dashboard 
pengguna. 
2. Pilih modul & menu Permohonan 
Baharu. 
3. Isi maklumat permohonan. 
4. Muat naik dokumen sokongan 
(pengesahan OCR/AI). 
5. Buat perakuan ketepatan 
maklumat. 
6. Hantar permohonan.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-PE-RV-NA-02 Membuat Bayaran Fi Proses
Rujukan Fungsi PFD-PE-RV-NA Rujukan Aktiviti PFD-PE-RV-NA-02
Nama Fungsi Pengurusan Hasil & Bayaran Nama Aktiviti Membuat Bayaran Fi Proses
Keterangan Aktiviti
Pemohon membuat bayaran fi proses 
melalui ST Payment Gateway (FPX).

### Page 90

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
 
 
Aktor Pemohon / Pembayar Tanggungjawab
Menjelaskan fi proses dalam 
tempoh ditetapkan.
Aktiviti Sebelum PFD-PE-RV-NA-01 Aktiviti Selepas PFD-PE-RV-NA-03
Kaedah / Operasi 
(Bagaimana)
1. Sistem mengira fi proses. 
2. Pemohon membuat bayaran 
melalui FPX. 
3. Sistem menjana resit & mengemas 
kini status.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-PE-RV-NA-03 Membuat Semakan Dokumen
Rujukan Fungsi PFD-PE-RV-NA Rujukan Aktiviti PFD-PE-RV-NA-03
Nama Fungsi Pengurusan Hasil & Bayaran Nama Aktiviti Membuat Semakan Dokumen
Keterangan Aktiviti
Pegawai SOS menyemak 
kelengkapan & kesahihan dokumen 
permohonan.
Aktor Pegawai SOS Tanggungjawab
Memastikan dokumen lengkap & 
sah sebelum semakan teknikal.
Aktiviti Sebelum PFD-PE-RV-NA-02 Aktiviti Selepas PFD-PE-RV-NA-04
Kaedah / Operasi 
(Bagaimana)
1. Semak dokumen yang dimuat naik. 
2. Sahkan kelengkapan & kesahihan. 
3. Jika tidak lengkap, kembalikan 
untuk kemaskini.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-PE-RV-NA-04 Membuat Semakan Teknikal
Rujukan Fungsi PFD-PE-RV-NA Rujukan Aktiviti PFD-PE-RV-NA-04
Nama Fungsi Pengurusan Hasil & Bayaran Nama Aktiviti Membuat Semakan Teknikal
Keterangan Aktiviti
Pegawai Teknikal menilai pematuhan 
teknikal permohonan Pengurusan 
Hasil & Bayaran.
Aktor Pegawai Teknikal Tanggungjawab
Menilai pematuhan teknikal & 
syarat kelayakan.
Aktiviti Sebelum PFD-PE-RV-NA-03 Aktiviti Selepas PFD-PE-RV-NA-06
Kaedah / Operasi 
(Bagaimana)
1. Semak butiran teknikal 
permohonan. 
2. Sahkan pematuhan syarat & 
peraturan. 
3. Tanda lulus/tidak lulus semakan 
teknikal.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-PE-RV-NA-05 Kemaskini Permohonan
Rujukan Fungsi PFD-PE-RV-NA Rujukan Aktiviti PFD-PE-RV-NA-05
Nama Fungsi Pengurusan Hasil & Bayaran Nama Aktiviti Kemaskini Permohonan
Keterangan Aktiviti
Pemohon mengemas kini 
permohonan/dokumen yang tidak 
lengkap atau perlu pembetulan.

### Page 91

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
 
 
Aktor Pemohon / Pembayar Tanggungjawab
Membetulkan & melengkapkan 
maklumat/dokumen yang diminta.
Aktiviti Sebelum
PFD-PE-RV-NA-03 / PFD-PE-RV-
NA-04
Aktiviti Selepas (kembali ke semakan)
Kaedah / Operasi 
(Bagaimana)
1. Terima notifikasi kemaskini. 
2. Betulkan maklumat / muat naik 
dokumen baharu. 
3. Hantar semula untuk semakan.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-PE-RV-NA-06 Membuat Kelulusan
Rujukan Fungsi PFD-PE-RV-NA Rujukan Aktiviti PFD-PE-RV-NA-06
Nama Fungsi Pengurusan Hasil & Bayaran Nama Aktiviti Membuat Kelulusan
Keterangan Aktiviti
Pelulus membuat keputusan 
kelulusan mengikut Limit of 
Authority (LOA).
Aktor Pegawai Pelulus Tanggungjawab
Membuat keputusan lulus/tolak 
mengikut LOA.
Aktiviti Sebelum PFD-PE-RV-NA-04 Aktiviti Selepas
PFD-PE-RV-NA-07 / PFD-PE-RV-
NA-09
Kaedah / Operasi 
(Bagaimana)
1. Semak syor & dokumen sokongan. 
2. Buat keputusan mengikut LOA. 
3. Rekod keputusan dengan jejak 
audit.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-PE-RV-NA-07 Membuat Bayaran Pendaftaran
Rujukan Fungsi PFD-PE-RV-NA Rujukan Aktiviti PFD-PE-RV-NA-07
Nama Fungsi Pengurusan Hasil & Bayaran Nama Aktiviti Membuat Bayaran Pendaftaran
Keterangan Aktiviti
Pemohon membuat bayaran 
pendaftaran/perakuan selepas 
permohonan diluluskan.
Aktor Pemohon / Pembayar Tanggungjawab
Menjelaskan fi pendaftaran melalui 
FPX.
Aktiviti Sebelum PFD-PE-RV-NA-06 Aktiviti Selepas PFD-PE-RV-NA-08
Kaedah / Operasi 
(Bagaimana)
1. Sistem mengira fi pendaftaran. 
2. Pemohon membuat bayaran 
melalui FPX. 
3. Sistem mengemas kini status & 
menjana resit.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-PE-RV-NA-08 Menerima Perakuan Digital + QR
Rujukan Fungsi PFD-PE-RV-NA Rujukan Aktiviti PFD-PE-RV-NA-08
Nama Fungsi Pengurusan Hasil & Bayaran Nama Aktiviti Menerima Perakuan Digital + QR
Keterangan Aktiviti
Sistem menjana perakuan digital 
berserta kod QR (ditambat pada 
blockchain) kepada pemohon.

### Page 92

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
 
Aktor Pemohon / Pembayar Tanggungjawab
Memuat turun & menyimpan 
perakuan digital.
Aktiviti Sebelum PFD-PE-RV-NA-07 Aktiviti Selepas -
Kaedah / Operasi 
(Bagaimana)
1. Sistem menjana perakuan digital + 
QR. 
2. Hash perakuan ditambat pada 
blockchain. 
3. Pemohon memuat turun perakuan; 
boleh disahkan via imbasan QR.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-PE-RV-NA-09 Menerima Makluman Permohonan Ditolak
Rujukan Fungsi PFD-PE-RV-NA Rujukan Aktiviti PFD-PE-RV-NA-09
Nama Fungsi Pengurusan Hasil & Bayaran Nama Aktiviti
Menerima Makluman Permohonan 
Ditolak
Keterangan Aktiviti
Pemohon menerima makluman 
penolakan beserta sebab.
Aktor Pemohon / Pembayar Tanggungjawab
Menyemak sebab penolakan & 
tindakan susulan.
Aktiviti Sebelum PFD-PE-RV-NA-06 Aktiviti Selepas -
Kaedah / Operasi 
(Bagaimana)
1. Sistem menghantar makluman 
penolakan. 
2. Pemohon menyemak sebab. 
3. Pemohon boleh memohon semula 
jika berkenaan.

### Page 93

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
8.1 Modul PE-SV — Lawatan Tapak / Pemeriksaan / Audit 
 
Rajah 49: Rajah Use Case — Modul PE-SV: Lawatan Tapak / Pemeriksaan / Audit
 
Rajah 50: Rajah Aliran Data (DFD) — Modul PE-SV: Lawatan Tapak / Pemeriksaan / Audit
 
Elemen Keterangan
Kod Modul PE-SV
Fungsi (PFD) PFD-PE-SV-NA — Lawatan Tapak / Pemeriksaan / Audit
Domain / Fasa Operasi & Perkhidmatan / Fasa 1
Keterangan Modul gunasama Sistem Digital ST.
Aktor Utama Pengguna ST / Pegawai
Lorong Peranan Pemohon / Pengguna, Pegawai SOS, Pegawai Teknikal, Pelulus

### Page 94

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
Rajah 51: Rajah Hubungan Entiti (ERD) — Modul PE-SV: Lawatan Tapak / Pemeriksaan / Audit
Sub-Modul & Fungsian: 
Maklumat Antara Muka — Skrin Pengguna:
- Skrin Log Masuk & Dashboard Pengguna
- Skrin Borang Permohonan
- Skrin Muat Naik & Pengesahan Dokumen (OCR/AI)
- Skrin Notis & Bayaran Fi
- Inbox & Notifikasi
- Skrin Semakan (SOS/Teknikal)
- Skrin Kelulusan (LOA)
- Paparan & Muat Turun Perakuan Digital (QR)
- Skrin Carian & Semakan Status
- Skrin Laporan & Statistik (AIRR)
Maklumat Antara Muka — Integrasi Sistem (API):
- ST Payment Gateway (FPX)
- MyDigital ID (NACSA)
- Pos Digicert (e-Signature)
Entiti Data Utama Modul:
Sub-Modul Fungsian Utama
Permohonan & Pemprosesan
Perancangan dan Penjadualan Pemeriksaan Tapak/Audit; Pelaksanaan Pemeriksaan 
Tapak/Audit dan Penjanaan Laporan; Pemantauan Notis Tindakan Pembetulan; 
Penyediaan dan Kemaskini Senarai Semak Borang/Pemeriksaan/Audit
Semakan & Kelulusan
Semakan dokumen (SOS), semakan teknikal, kelulusan mengikut LOA, kelulusan 
jawatankuasa (jika berkaitan)
Bayaran & Hasil
Penjanaan invois/notis fi, integrasi Payment Gateway, resit, pemantauan & rekonsiliasi 
hasil
Perakuan & Notifikasi Penjanaan perakuan digital + QR + e-tandatangan, notifikasi emel/inbox
Pemantauan & Pematuhan Pemantauan tarikh luput/jaminan/syarat, peringatan automatik, audit pematuhan
Pelaporan & Statistik Laporan operasi & statistik (AIRR), papan pemuka, eksport
Pentadbiran & Konfigurasi Reference table (jenis dokumen, fi, hari bayaran, ayat notifikasi), kawalan akses (RBAC)
Entiti Atribut Utama
LAWATAN id_lawatan (PK), id_permohonan (FK), jenis, tarikh, pegawai
SENARAI_SEMAK id (PK), id_lawatan (FK), item, status
LAPORAN_AUDIT id (PK), id_lawatan (FK), penemuan, syor

### Page 95

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
Rajah 52: Carta Alir PFD-PE-SV-NA — Lawatan Tapak / Pemeriksaan / Audit
Definisi Aktiviti Fungsi Bisnes (format Tender):
 
DEFINISI AKTIVITI FUNGSI BISNES — PFD-PE-SV-NA-01 Membuat Permohonan
Rujukan Fungsi PFD-PE-SV-NA Rujukan Aktiviti PFD-PE-SV-NA-01
Nama Fungsi
Lawatan Tapak / Pemeriksaan / 
Audit
Nama Aktiviti Membuat Permohonan
Keterangan Aktiviti
Pemohon mengisi borang 
permohonan Lawatan Tapak / 
Pemeriksaan / Audit secara atas talian 
dan memuat naik dokumen sokongan.
Aktor Pegawai ST Tanggungjawab
Melengkapkan borang & memuat 
naik dokumen sebelum 
menghantar.
Aktiviti Sebelum - Aktiviti Selepas PFD-PE-SV-NA-02
Kaedah / Operasi 
(Bagaimana)
1. Log masuk ke Dashboard 
pengguna. 
2. Pilih modul & menu Permohonan 
Baharu. 
3. Isi maklumat permohonan. 
4. Muat naik dokumen sokongan 
(pengesahan OCR/AI). 
5. Buat perakuan ketepatan 
maklumat. 
6. Hantar permohonan.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-PE-SV-NA-02 Membuat Bayaran Fi Proses
Rujukan Fungsi PFD-PE-SV-NA Rujukan Aktiviti PFD-PE-SV-NA-02
Nama Fungsi
Lawatan Tapak / Pemeriksaan / 
Audit
Nama Aktiviti Membuat Bayaran Fi Proses
Keterangan Aktiviti
Pemohon membuat bayaran fi proses 
melalui ST Payment Gateway (FPX).
Aktor Pegawai ST Tanggungjawab
Menjelaskan fi proses dalam 
tempoh ditetapkan.
Aktiviti Sebelum PFD-PE-SV-NA-01 Aktiviti Selepas PFD-PE-SV-NA-03

### Page 96

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
 
 
Kaedah / Operasi 
(Bagaimana)
1. Sistem mengira fi proses. 
2. Pemohon membuat bayaran 
melalui FPX. 
3. Sistem menjana resit & mengemas 
kini status.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-PE-SV-NA-03 Membuat Semakan Dokumen
Rujukan Fungsi PFD-PE-SV-NA Rujukan Aktiviti PFD-PE-SV-NA-03
Nama Fungsi
Lawatan Tapak / Pemeriksaan / 
Audit
Nama Aktiviti Membuat Semakan Dokumen
Keterangan Aktiviti
Pegawai SOS menyemak 
kelengkapan & kesahihan dokumen 
permohonan.
Aktor Pegawai SOS Tanggungjawab
Memastikan dokumen lengkap & 
sah sebelum semakan teknikal.
Aktiviti Sebelum PFD-PE-SV-NA-02 Aktiviti Selepas PFD-PE-SV-NA-04
Kaedah / Operasi 
(Bagaimana)
1. Semak dokumen yang dimuat naik. 
2. Sahkan kelengkapan & kesahihan. 
3. Jika tidak lengkap, kembalikan 
untuk kemaskini.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-PE-SV-NA-04 Membuat Semakan Teknikal
Rujukan Fungsi PFD-PE-SV-NA Rujukan Aktiviti PFD-PE-SV-NA-04
Nama Fungsi
Lawatan Tapak / Pemeriksaan / 
Audit
Nama Aktiviti Membuat Semakan Teknikal
Keterangan Aktiviti
Pegawai Teknikal menilai pematuhan 
teknikal permohonan Lawatan 
Tapak / Pemeriksaan / Audit.
Aktor Pegawai Teknikal Tanggungjawab
Menilai pematuhan teknikal & 
syarat kelayakan.
Aktiviti Sebelum PFD-PE-SV-NA-03 Aktiviti Selepas PFD-PE-SV-NA-06
Kaedah / Operasi 
(Bagaimana)
1. Semak butiran teknikal 
permohonan. 
2. Sahkan pematuhan syarat & 
peraturan. 
3. Tanda lulus/tidak lulus semakan 
teknikal.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-PE-SV-NA-05 Kemaskini Permohonan
Rujukan Fungsi PFD-PE-SV-NA Rujukan Aktiviti PFD-PE-SV-NA-05
Nama Fungsi
Lawatan Tapak / Pemeriksaan / 
Audit
Nama Aktiviti Kemaskini Permohonan
Keterangan Aktiviti
Pemohon mengemas kini 
permohonan/dokumen yang tidak 
lengkap atau perlu pembetulan.

### Page 97

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
 
 
Aktor Pegawai ST Tanggungjawab
Membetulkan & melengkapkan 
maklumat/dokumen yang diminta.
Aktiviti Sebelum
PFD-PE-SV-NA-03 / PFD-PE-SV-
NA-04
Aktiviti Selepas (kembali ke semakan)
Kaedah / Operasi 
(Bagaimana)
1. Terima notifikasi kemaskini. 
2. Betulkan maklumat / muat naik 
dokumen baharu. 
3. Hantar semula untuk semakan.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-PE-SV-NA-06 Membuat Kelulusan
Rujukan Fungsi PFD-PE-SV-NA Rujukan Aktiviti PFD-PE-SV-NA-06
Nama Fungsi
Lawatan Tapak / Pemeriksaan / 
Audit
Nama Aktiviti Membuat Kelulusan
Keterangan Aktiviti
Pelulus membuat keputusan 
kelulusan mengikut Limit of 
Authority (LOA).
Aktor Pegawai Pelulus Tanggungjawab
Membuat keputusan lulus/tolak 
mengikut LOA.
Aktiviti Sebelum PFD-PE-SV-NA-04 Aktiviti Selepas
PFD-PE-SV-NA-07 / PFD-PE-SV-
NA-09
Kaedah / Operasi 
(Bagaimana)
1. Semak syor & dokumen sokongan. 
2. Buat keputusan mengikut LOA. 
3. Rekod keputusan dengan jejak 
audit.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-PE-SV-NA-07 Membuat Bayaran Pendaftaran
Rujukan Fungsi PFD-PE-SV-NA Rujukan Aktiviti PFD-PE-SV-NA-07
Nama Fungsi
Lawatan Tapak / Pemeriksaan / 
Audit
Nama Aktiviti Membuat Bayaran Pendaftaran
Keterangan Aktiviti
Pemohon membuat bayaran 
pendaftaran/perakuan selepas 
permohonan diluluskan.
Aktor Pegawai ST Tanggungjawab
Menjelaskan fi pendaftaran melalui 
FPX.
Aktiviti Sebelum PFD-PE-SV-NA-06 Aktiviti Selepas PFD-PE-SV-NA-08
Kaedah / Operasi 
(Bagaimana)
1. Sistem mengira fi pendaftaran. 
2. Pemohon membuat bayaran 
melalui FPX. 
3. Sistem mengemas kini status & 
menjana resit.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-PE-SV-NA-08 Menerima Perakuan Digital + QR
Rujukan Fungsi PFD-PE-SV-NA Rujukan Aktiviti PFD-PE-SV-NA-08
Nama Fungsi
Lawatan Tapak / Pemeriksaan / 
Audit
Nama Aktiviti Menerima Perakuan Digital + QR

### Page 98

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
 
Keterangan Aktiviti
Sistem menjana perakuan digital 
berserta kod QR (ditambat pada 
blockchain) kepada pemohon.
Aktor Pegawai ST Tanggungjawab
Memuat turun & menyimpan 
perakuan digital.
Aktiviti Sebelum PFD-PE-SV-NA-07 Aktiviti Selepas -
Kaedah / Operasi 
(Bagaimana)
1. Sistem menjana perakuan digital + 
QR. 
2. Hash perakuan ditambat pada 
blockchain. 
3. Pemohon memuat turun perakuan; 
boleh disahkan via imbasan QR.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-PE-SV-NA-09 Menerima Makluman Permohonan Ditolak
Rujukan Fungsi PFD-PE-SV-NA Rujukan Aktiviti PFD-PE-SV-NA-09
Nama Fungsi
Lawatan Tapak / Pemeriksaan / 
Audit
Nama Aktiviti
Menerima Makluman Permohonan 
Ditolak
Keterangan Aktiviti
Pemohon menerima makluman 
penolakan beserta sebab.
Aktor Pegawai ST Tanggungjawab
Menyemak sebab penolakan & 
tindakan susulan.
Aktiviti Sebelum PFD-PE-SV-NA-06 Aktiviti Selepas -
Kaedah / Operasi 
(Bagaimana)
1. Sistem menghantar makluman 
penolakan. 
2. Pemohon menyemak sebab. 
3. Pemohon boleh memohon semula 
jika berkenaan.

### Page 99

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
8.1 Modul PE-JK — Kelulusan Jawatankuasa 
 
Rajah 53: Rajah Use Case — Modul PE-JK: Kelulusan Jawatankuasa
 
Rajah 54: Rajah Aliran Data (DFD) — Modul PE-JK: Kelulusan Jawatankuasa
 
Rajah 55: Rajah Hubungan Entiti (ERD) — Modul PE-JK: Kelulusan Jawatankuasa
Elemen Keterangan
Kod Modul PE-JK
Fungsi (PFD) PFD-PE-JK-NA — Kelulusan Jawatankuasa
Domain / Fasa Operasi & Perkhidmatan / Fasa 1
Keterangan Modul gunasama Sistem Digital ST.
Aktor Utama Pengguna ST / Pegawai
Lorong Peranan Pemohon / Pengguna, Pegawai SOS, Pegawai Teknikal, Pelulus

### Page 100

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
Sub-Modul & Fungsian: 
Maklumat Antara Muka — Skrin Pengguna:
- Skrin Log Masuk & Dashboard Pengguna
- Skrin Borang Permohonan
- Skrin Muat Naik & Pengesahan Dokumen (OCR/AI)
- Skrin Notis & Bayaran Fi
- Inbox & Notifikasi
- Skrin Semakan (SOS/Teknikal)
- Skrin Kelulusan (LOA)
- Paparan & Muat Turun Perakuan Digital (QR)
- Skrin Carian & Semakan Status
- Skrin Laporan & Statistik (AIRR)
Maklumat Antara Muka — Integrasi Sistem (API):
- ST Payment Gateway (FPX)
- MyDigital ID (NACSA)
- Pos Digicert (e-Signature)
Entiti Data Utama Modul:
Sub-Modul Fungsian Utama
Permohonan & Pemprosesan
Penjanaan Kertas Cadangan Kelulusan.; Wujud/Kemaskini Templat Kertas Cadangan.; 
Kemasukan keputusan kelulusan jawatankuasa termasuk di kementerian
Semakan & Kelulusan
Semakan dokumen (SOS), semakan teknikal, kelulusan mengikut LOA, kelulusan 
jawatankuasa (jika berkaitan)
Bayaran & Hasil
Penjanaan invois/notis fi, integrasi Payment Gateway, resit, pemantauan & rekonsiliasi 
hasil
Perakuan & Notifikasi Penjanaan perakuan digital + QR + e-tandatangan, notifikasi emel/inbox
Pemantauan & Pematuhan Pemantauan tarikh luput/jaminan/syarat, peringatan automatik, audit pematuhan
Pelaporan & Statistik Laporan operasi & statistik (AIRR), papan pemuka, eksport
Pentadbiran & Konfigurasi Reference table (jenis dokumen, fi, hari bayaran, ayat notifikasi), kawalan akses (RBAC)
Entiti Atribut Utama
MESYUARAT_JK id (PK), tarikh, peringkat, status
AGENDA id (PK), id_mesyuarat (FK), id_permohonan (FK)
KEPUTUSAN_JK id (PK), id_agenda (FK), keputusan, catatan

### Page 101

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
Rajah 56: Carta Alir PFD-PE-JK-NA — Kelulusan Jawatankuasa
Definisi Aktiviti Fungsi Bisnes (format Tender):
 
DEFINISI AKTIVITI FUNGSI BISNES — PFD-PE-JK-NA-01 Membuat Permohonan
Rujukan Fungsi PFD-PE-JK-NA Rujukan Aktiviti PFD-PE-JK-NA-01
Nama Fungsi Kelulusan Jawatankuasa Nama Aktiviti Membuat Permohonan
Keterangan Aktiviti
Pemohon mengisi borang 
permohonan Kelulusan Jawatankuasa 
secara atas talian dan memuat naik 
dokumen sokongan.
Aktor Urus Setia / Ahli JawatankuasaTanggungjawab
Melengkapkan borang & memuat 
naik dokumen sebelum 
menghantar.
Aktiviti Sebelum - Aktiviti Selepas PFD-PE-JK-NA-02
Kaedah / Operasi 
(Bagaimana)
1. Log masuk ke Dashboard 
pengguna. 
2. Pilih modul & menu Permohonan 
Baharu. 
3. Isi maklumat permohonan. 
4. Muat naik dokumen sokongan 
(pengesahan OCR/AI). 
5. Buat perakuan ketepatan 
maklumat. 
6. Hantar permohonan.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-PE-JK-NA-02 Membuat Bayaran Fi Proses
Rujukan Fungsi PFD-PE-JK-NA Rujukan Aktiviti PFD-PE-JK-NA-02
Nama Fungsi Kelulusan Jawatankuasa Nama Aktiviti Membuat Bayaran Fi Proses
Keterangan Aktiviti
Pemohon membuat bayaran fi proses 
melalui ST Payment Gateway (FPX).
Aktor Urus Setia / Ahli JawatankuasaTanggungjawab
Menjelaskan fi proses dalam 
tempoh ditetapkan.
Aktiviti Sebelum PFD-PE-JK-NA-01 Aktiviti Selepas PFD-PE-JK-NA-03

### Page 102

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
 
 
Kaedah / Operasi 
(Bagaimana)
1. Sistem mengira fi proses. 
2. Pemohon membuat bayaran 
melalui FPX. 
3. Sistem menjana resit & mengemas 
kini status.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-PE-JK-NA-03 Membuat Semakan Dokumen
Rujukan Fungsi PFD-PE-JK-NA Rujukan Aktiviti PFD-PE-JK-NA-03
Nama Fungsi Kelulusan Jawatankuasa Nama Aktiviti Membuat Semakan Dokumen
Keterangan Aktiviti
Pegawai SOS menyemak 
kelengkapan & kesahihan dokumen 
permohonan.
Aktor Pegawai SOS Tanggungjawab
Memastikan dokumen lengkap & 
sah sebelum semakan teknikal.
Aktiviti Sebelum PFD-PE-JK-NA-02 Aktiviti Selepas PFD-PE-JK-NA-04
Kaedah / Operasi 
(Bagaimana)
1. Semak dokumen yang dimuat naik. 
2. Sahkan kelengkapan & kesahihan. 
3. Jika tidak lengkap, kembalikan 
untuk kemaskini.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-PE-JK-NA-04 Membuat Semakan Teknikal
Rujukan Fungsi PFD-PE-JK-NA Rujukan Aktiviti PFD-PE-JK-NA-04
Nama Fungsi Kelulusan Jawatankuasa Nama Aktiviti Membuat Semakan Teknikal
Keterangan Aktiviti
Pegawai Teknikal menilai pematuhan 
teknikal permohonan Kelulusan 
Jawatankuasa.
Aktor Pegawai Teknikal Tanggungjawab
Menilai pematuhan teknikal & 
syarat kelayakan.
Aktiviti Sebelum PFD-PE-JK-NA-03 Aktiviti Selepas PFD-PE-JK-NA-06
Kaedah / Operasi 
(Bagaimana)
1. Semak butiran teknikal 
permohonan. 
2. Sahkan pematuhan syarat & 
peraturan. 
3. Tanda lulus/tidak lulus semakan 
teknikal.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-PE-JK-NA-05 Kemaskini Permohonan
Rujukan Fungsi PFD-PE-JK-NA Rujukan Aktiviti PFD-PE-JK-NA-05
Nama Fungsi Kelulusan Jawatankuasa Nama Aktiviti Kemaskini Permohonan
Keterangan Aktiviti
Pemohon mengemas kini 
permohonan/dokumen yang tidak 
lengkap atau perlu pembetulan.
Aktor Urus Setia / Ahli JawatankuasaTanggungjawab
Membetulkan & melengkapkan 
maklumat/dokumen yang diminta.

### Page 103

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
 
 
Aktiviti Sebelum
PFD-PE-JK-NA-03 / PFD-PE-JK-
NA-04
Aktiviti Selepas (kembali ke semakan)
Kaedah / Operasi 
(Bagaimana)
1. Terima notifikasi kemaskini. 
2. Betulkan maklumat / muat naik 
dokumen baharu. 
3. Hantar semula untuk semakan.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-PE-JK-NA-06 Membuat Kelulusan
Rujukan Fungsi PFD-PE-JK-NA Rujukan Aktiviti PFD-PE-JK-NA-06
Nama Fungsi Kelulusan Jawatankuasa Nama Aktiviti Membuat Kelulusan
Keterangan Aktiviti
Pelulus membuat keputusan 
kelulusan mengikut Limit of 
Authority (LOA).
Aktor Pegawai Pelulus Tanggungjawab
Membuat keputusan lulus/tolak 
mengikut LOA.
Aktiviti Sebelum PFD-PE-JK-NA-04 Aktiviti Selepas
PFD-PE-JK-NA-07 / PFD-PE-JK-
NA-09
Kaedah / Operasi 
(Bagaimana)
1. Semak syor & dokumen sokongan. 
2. Buat keputusan mengikut LOA. 
3. Rekod keputusan dengan jejak 
audit.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-PE-JK-NA-07 Membuat Bayaran Pendaftaran
Rujukan Fungsi PFD-PE-JK-NA Rujukan Aktiviti PFD-PE-JK-NA-07
Nama Fungsi Kelulusan Jawatankuasa Nama Aktiviti Membuat Bayaran Pendaftaran
Keterangan Aktiviti
Pemohon membuat bayaran 
pendaftaran/perakuan selepas 
permohonan diluluskan.
Aktor Urus Setia / Ahli JawatankuasaTanggungjawab
Menjelaskan fi pendaftaran melalui 
FPX.
Aktiviti Sebelum PFD-PE-JK-NA-06 Aktiviti Selepas PFD-PE-JK-NA-08
Kaedah / Operasi 
(Bagaimana)
1. Sistem mengira fi pendaftaran. 
2. Pemohon membuat bayaran 
melalui FPX. 
3. Sistem mengemas kini status & 
menjana resit.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-PE-JK-NA-08 Menerima Perakuan Digital + QR
Rujukan Fungsi PFD-PE-JK-NA Rujukan Aktiviti PFD-PE-JK-NA-08
Nama Fungsi Kelulusan Jawatankuasa Nama Aktiviti Menerima Perakuan Digital + QR
Keterangan Aktiviti
Sistem menjana perakuan digital 
berserta kod QR (ditambat pada 
blockchain) kepada pemohon.
Aktor Urus Setia / Ahli JawatankuasaTanggungjawab
Memuat turun & menyimpan 
perakuan digital.

### Page 104

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
 
Aktiviti Sebelum PFD-PE-JK-NA-07 Aktiviti Selepas -
Kaedah / Operasi 
(Bagaimana)
1. Sistem menjana perakuan digital + 
QR. 
2. Hash perakuan ditambat pada 
blockchain. 
3. Pemohon memuat turun perakuan; 
boleh disahkan via imbasan QR.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-PE-JK-NA-09 Menerima Makluman Permohonan Ditolak
Rujukan Fungsi PFD-PE-JK-NA Rujukan Aktiviti PFD-PE-JK-NA-09
Nama Fungsi Kelulusan Jawatankuasa Nama Aktiviti
Menerima Makluman Permohonan 
Ditolak
Keterangan Aktiviti
Pemohon menerima makluman 
penolakan beserta sebab.
Aktor Urus Setia / Ahli JawatankuasaTanggungjawab
Menyemak sebab penolakan & 
tindakan susulan.
Aktiviti Sebelum PFD-PE-JK-NA-06 Aktiviti Selepas -
Kaedah / Operasi 
(Bagaimana)
1. Sistem menghantar makluman 
penolakan. 
2. Pemohon menyemak sebab. 
3. Pemohon boleh memohon semula 
jika berkenaan.

### Page 105

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
8.1 Modul CC-XE — Peperiksaan Elektrik 
 
Rajah 57: Rajah Use Case — Modul CC-XE: Peperiksaan Elektrik
 
Rajah 58: Rajah Aliran Data (DFD) — Modul CC-XE: Peperiksaan Elektrik
Elemen Keterangan
Kod Modul CC-XE
Fungsi (PFD) PFD-CC-XE-NA — Permohonan Peperiksaan Elektrik
Domain / Fasa Pensijilan & Kompetensi / Fasa 2
Keterangan
Modul Peperiksaan Elektrik adalah satu modul gunasama yang melibatkan pengurusan 
peperiksaan Kekompetenan Elektrik, pengeluaran Perakuan Kekompetenan Elektrik dan 
pentauliahan Kursus Kekompetenan yang dilaksanakan oleh Institusi Latihan luar. Proses-
proses yang terlibat di dalam modul ini adalah sep
Aktor Utama Pemohon / Individu
Lorong Peranan Pemohon / Pengguna, Pegawai SOS, Pegawai Teknikal, Pelulus

### Page 106

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
Rajah 59: Rajah Hubungan Entiti (ERD) — Modul CC-XE: Peperiksaan Elektrik
Sub-Modul & Fungsian: 
Maklumat Antara Muka — Skrin Pengguna:
- Skrin Log Masuk & Dashboard Pengguna
- Skrin Borang Permohonan
- Skrin Muat Naik & Pengesahan Dokumen (OCR/AI)
- Skrin Notis & Bayaran Fi
- Inbox & Notifikasi
- Skrin Semakan (SOS/Teknikal)
- Skrin Kelulusan (LOA)
- Paparan & Muat Turun Perakuan Digital (QR)
- Skrin Carian & Semakan Status
- Skrin Laporan & Statistik (AIRR)
Maklumat Antara Muka — Integrasi Sistem (API):
- ST Payment Gateway (FPX)
- MyDigital ID (NACSA)
Sub-Modul Fungsian Utama
Permohonan & Pemprosesan
Penyediaan dan Penerbitan Jadual Peperiksaan ST; Permohonan Menduduki Peperiksaan 
dan Naiktaraf Kompetensi/PV; Pelaksanaan Peperiksaan Teori (Bertulis); Permohonan 
Menduduki Peperiksaan Praktikal
Semakan & Kelulusan
Semakan dokumen (SOS), semakan teknikal, kelulusan mengikut LOA, kelulusan 
jawatankuasa (jika berkaitan)
Bayaran & Hasil
Penjanaan invois/notis fi, integrasi Payment Gateway, resit, pemantauan & rekonsiliasi 
hasil
Perakuan & Notifikasi Penjanaan perakuan digital + QR + e-tandatangan, notifikasi emel/inbox
Pemantauan & Pematuhan Pemantauan tarikh luput/jaminan/syarat, peringatan automatik, audit pematuhan
Pelaporan & Statistik Laporan operasi & statistik (AIRR), papan pemuka, eksport
Pentadbiran & Konfigurasi Reference table (jenis dokumen, fi, hari bayaran, ayat notifikasi), kawalan akses (RBAC)

### Page 107

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
•Pos Digicert (e-Signature)
Entiti Data Utama Modul:
 
Rajah 60: Carta Alir PFD-CC-XE-NA — Permohonan Peperiksaan Elektrik
Definisi Aktiviti Fungsi Bisnes (format Tender):
 
Entiti Atribut Utama
PEPERIKSAAN id (PK), jenis, tarikh, lokasi
CALON id (PK), id_pengguna (FK), id_peperiksaan (FK), keputusan
INSTITUSI_LATIHAN id (PK), nama, status_tauliah
DEFINISI AKTIVITI FUNGSI BISNES — PFD-CC-XE-NA-01 Membuat Permohonan
Rujukan Fungsi PFD-CC-XE-NA Rujukan Aktiviti PFD-CC-XE-NA-01
Nama Fungsi Permohonan Peperiksaan ElektrikNama Aktiviti Membuat Permohonan
Keterangan Aktiviti
Pemohon mengisi borang 
permohonan Permohonan 
Peperiksaan Elektrik secara atas 
talian dan memuat naik dokumen 
sokongan.
Aktor Calon Peperiksaan Tanggungjawab
Melengkapkan borang & memuat 
naik dokumen sebelum 
menghantar.
Aktiviti Sebelum - Aktiviti Selepas PFD-CC-XE-NA-02
Kaedah / Operasi 
(Bagaimana)
1. Log masuk ke Dashboard 
pengguna. 
2. Pilih modul & menu Permohonan 
Baharu. 
3. Isi maklumat permohonan. 
4. Muat naik dokumen sokongan 
(pengesahan OCR/AI). 
5. Buat perakuan ketepatan 
maklumat. 
6. Hantar permohonan.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-CC-XE-NA-02 Membuat Bayaran Fi Proses
Rujukan Fungsi PFD-CC-XE-NA Rujukan Aktiviti PFD-CC-XE-NA-02
Nama Fungsi Permohonan Peperiksaan ElektrikNama Aktiviti Membuat Bayaran Fi Proses

### Page 108

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
 
 
Keterangan Aktiviti
Pemohon membuat bayaran fi proses 
melalui ST Payment Gateway (FPX).
Aktor Calon Peperiksaan Tanggungjawab
Menjelaskan fi proses dalam 
tempoh ditetapkan.
Aktiviti Sebelum PFD-CC-XE-NA-01 Aktiviti Selepas PFD-CC-XE-NA-03
Kaedah / Operasi 
(Bagaimana)
1. Sistem mengira fi proses. 
2. Pemohon membuat bayaran 
melalui FPX. 
3. Sistem menjana resit & mengemas 
kini status.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-CC-XE-NA-03 Membuat Semakan Dokumen
Rujukan Fungsi PFD-CC-XE-NA Rujukan Aktiviti PFD-CC-XE-NA-03
Nama Fungsi Permohonan Peperiksaan ElektrikNama Aktiviti Membuat Semakan Dokumen
Keterangan Aktiviti
Pegawai SOS menyemak 
kelengkapan & kesahihan dokumen 
permohonan.
Aktor Pegawai SOS Tanggungjawab
Memastikan dokumen lengkap & 
sah sebelum semakan teknikal.
Aktiviti Sebelum PFD-CC-XE-NA-02 Aktiviti Selepas PFD-CC-XE-NA-04
Kaedah / Operasi 
(Bagaimana)
1. Semak dokumen yang dimuat naik. 
2. Sahkan kelengkapan & kesahihan. 
3. Jika tidak lengkap, kembalikan 
untuk kemaskini.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-CC-XE-NA-04 Membuat Semakan Teknikal
Rujukan Fungsi PFD-CC-XE-NA Rujukan Aktiviti PFD-CC-XE-NA-04
Nama Fungsi Permohonan Peperiksaan ElektrikNama Aktiviti Membuat Semakan Teknikal
Keterangan Aktiviti
Pegawai Teknikal menilai pematuhan 
teknikal permohonan Permohonan 
Peperiksaan Elektrik.
Aktor Pegawai Teknikal Tanggungjawab
Menilai pematuhan teknikal & 
syarat kelayakan.
Aktiviti Sebelum PFD-CC-XE-NA-03 Aktiviti Selepas PFD-CC-XE-NA-06
Kaedah / Operasi 
(Bagaimana)
1. Semak butiran teknikal 
permohonan. 
2. Sahkan pematuhan syarat & 
peraturan. 
3. Tanda lulus/tidak lulus semakan 
teknikal.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-CC-XE-NA-05 Kemaskini Permohonan
Rujukan Fungsi PFD-CC-XE-NA Rujukan Aktiviti PFD-CC-XE-NA-05
Nama Fungsi Permohonan Peperiksaan ElektrikNama Aktiviti Kemaskini Permohonan

### Page 109

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
 
 
Keterangan Aktiviti
Pemohon mengemas kini 
permohonan/dokumen yang tidak 
lengkap atau perlu pembetulan.
Aktor Calon Peperiksaan Tanggungjawab
Membetulkan & melengkapkan 
maklumat/dokumen yang diminta.
Aktiviti Sebelum
PFD-CC-XE-NA-03 / PFD-CC-
XE-NA-04
Aktiviti Selepas (kembali ke semakan)
Kaedah / Operasi 
(Bagaimana)
1. Terima notifikasi kemaskini. 
2. Betulkan maklumat / muat naik 
dokumen baharu. 
3. Hantar semula untuk semakan.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-CC-XE-NA-06 Membuat Kelulusan
Rujukan Fungsi PFD-CC-XE-NA Rujukan Aktiviti PFD-CC-XE-NA-06
Nama Fungsi Permohonan Peperiksaan ElektrikNama Aktiviti Membuat Kelulusan
Keterangan Aktiviti
Pelulus membuat keputusan 
kelulusan mengikut Limit of 
Authority (LOA).
Aktor Pegawai Pelulus Tanggungjawab
Membuat keputusan lulus/tolak 
mengikut LOA.
Aktiviti Sebelum PFD-CC-XE-NA-04 Aktiviti Selepas
PFD-CC-XE-NA-07 / PFD-CC-
XE-NA-09
Kaedah / Operasi 
(Bagaimana)
1. Semak syor & dokumen sokongan. 
2. Buat keputusan mengikut LOA. 
3. Rekod keputusan dengan jejak 
audit.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-CC-XE-NA-07 Membuat Bayaran Pendaftaran
Rujukan Fungsi PFD-CC-XE-NA Rujukan Aktiviti PFD-CC-XE-NA-07
Nama Fungsi Permohonan Peperiksaan ElektrikNama Aktiviti Membuat Bayaran Pendaftaran
Keterangan Aktiviti
Pemohon membuat bayaran 
pendaftaran/perakuan selepas 
permohonan diluluskan.
Aktor Calon Peperiksaan Tanggungjawab
Menjelaskan fi pendaftaran melalui 
FPX.
Aktiviti Sebelum PFD-CC-XE-NA-06 Aktiviti Selepas PFD-CC-XE-NA-08
Kaedah / Operasi 
(Bagaimana)
1. Sistem mengira fi pendaftaran. 
2. Pemohon membuat bayaran 
melalui FPX. 
3. Sistem mengemas kini status & 
menjana resit.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-CC-XE-NA-08 Menerima Perakuan Digital + QR
Rujukan Fungsi PFD-CC-XE-NA Rujukan Aktiviti PFD-CC-XE-NA-08
Nama Fungsi Permohonan Peperiksaan ElektrikNama Aktiviti Menerima Perakuan Digital + QR

### Page 110

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
 
Keterangan Aktiviti
Sistem menjana perakuan digital 
berserta kod QR (ditambat pada 
blockchain) kepada pemohon.
Aktor Calon Peperiksaan Tanggungjawab
Memuat turun & menyimpan 
perakuan digital.
Aktiviti Sebelum PFD-CC-XE-NA-07 Aktiviti Selepas -
Kaedah / Operasi 
(Bagaimana)
1. Sistem menjana perakuan digital + 
QR. 
2. Hash perakuan ditambat pada 
blockchain. 
3. Pemohon memuat turun perakuan; 
boleh disahkan via imbasan QR.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-CC-XE-NA-09 Menerima Makluman Permohonan Ditolak
Rujukan Fungsi PFD-CC-XE-NA Rujukan Aktiviti PFD-CC-XE-NA-09
Nama Fungsi Permohonan Peperiksaan ElektrikNama Aktiviti
Menerima Makluman Permohonan 
Ditolak
Keterangan Aktiviti
Pemohon menerima makluman 
penolakan beserta sebab.
Aktor Calon Peperiksaan Tanggungjawab
Menyemak sebab penolakan & 
tindakan susulan.
Aktiviti Sebelum PFD-CC-XE-NA-06 Aktiviti Selepas -
Kaedah / Operasi 
(Bagaimana)
1. Sistem menghantar makluman 
penolakan. 
2. Pemohon menyemak sebab. 
3. Pemohon boleh memohon semula 
jika berkenaan.

### Page 111

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
8.1 Modul CC-XG — Peperiksaan Gas 
 
Rajah 61: Rajah Use Case — Modul CC-XG: Peperiksaan Gas
 
Rajah 62: Rajah Aliran Data (DFD) — Modul CC-XG: Peperiksaan Gas
Elemen Keterangan
Kod Modul CC-XG
Fungsi (PFD) PFD-CC-XG-NA — Permohonan Peperiksaan Gas
Domain / Fasa Pensijilan & Kompetensi / Fasa 2
Keterangan
Modul Peperiksaan Gas adalah satu modul gunasama yang melibatkan pengurusan peperiksaan 
Kekompetenan Gas, pengeluaran Perakuan Kekompetenan Gas dan pentauliahan Kursus 
Kekompetenan yang dilaksanakan oleh Institusi Latihan luar. Proses-proses yang terlibat di 
dalam modul ini adalah seperti berikut: a
Aktor Utama Pemohon / Individu
Lorong Peranan Pemohon / Pengguna, Pegawai SOS, Pegawai Teknikal, Pelulus

### Page 112

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
Rajah 63: Rajah Hubungan Entiti (ERD) — Modul CC-XG: Peperiksaan Gas
Sub-Modul & Fungsian: 
Maklumat Antara Muka — Skrin Pengguna:
- Skrin Log Masuk & Dashboard Pengguna
- Skrin Borang Permohonan
- Skrin Muat Naik & Pengesahan Dokumen (OCR/AI)
- Skrin Notis & Bayaran Fi
- Inbox & Notifikasi
- Skrin Semakan (SOS/Teknikal)
- Skrin Kelulusan (LOA)
- Paparan & Muat Turun Perakuan Digital (QR)
- Skrin Carian & Semakan Status
- Skrin Laporan & Statistik (AIRR)
Maklumat Antara Muka — Integrasi Sistem (API):
- ST Payment Gateway (FPX)
- MyDigital ID (NACSA)
- Pos Digicert (e-Signature)
Entiti Data Utama Modul:
Sub-Modul Fungsian Utama
Permohonan & Pemprosesan
Penyediaan dan Penerbitan Jadual Peperiksaan ST; Permohonan Menduduki Peperiksaan; 
Pelaksanaan Peperiksaan Teori (Bertulis); Permohonan Menduduki Temuduga
Semakan & Kelulusan
Semakan dokumen (SOS), semakan teknikal, kelulusan mengikut LOA, kelulusan 
jawatankuasa (jika berkaitan)
Bayaran & Hasil
Penjanaan invois/notis fi, integrasi Payment Gateway, resit, pemantauan & rekonsiliasi 
hasil
Perakuan & Notifikasi Penjanaan perakuan digital + QR + e-tandatangan, notifikasi emel/inbox
Pemantauan & Pematuhan Pemantauan tarikh luput/jaminan/syarat, peringatan automatik, audit pematuhan
Pelaporan & Statistik Laporan operasi & statistik (AIRR), papan pemuka, eksport
Pentadbiran & Konfigurasi Reference table (jenis dokumen, fi, hari bayaran, ayat notifikasi), kawalan akses (RBAC)

### Page 113

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
Rajah 64: Carta Alir PFD-CC-XG-NA — Permohonan Peperiksaan Gas
Definisi Aktiviti Fungsi Bisnes (format Tender):
 
Entiti Atribut Utama
PEPERIKSAAN_GAS id (PK), jenis, tarikh
CALON id (PK), id_pengguna (FK), keputusan
DEFINISI AKTIVITI FUNGSI BISNES — PFD-CC-XG-NA-01 Membuat Permohonan
Rujukan Fungsi PFD-CC-XG-NA Rujukan Aktiviti PFD-CC-XG-NA-01
Nama Fungsi Permohonan Peperiksaan Gas Nama Aktiviti Membuat Permohonan
Keterangan Aktiviti
Pemohon mengisi borang 
permohonan Permohonan 
Peperiksaan Gas secara atas talian 
dan memuat naik dokumen sokongan.
Aktor Calon Peperiksaan Tanggungjawab
Melengkapkan borang & memuat 
naik dokumen sebelum 
menghantar.
Aktiviti Sebelum - Aktiviti Selepas PFD-CC-XG-NA-02
Kaedah / Operasi 
(Bagaimana)
1. Log masuk ke Dashboard 
pengguna. 
2. Pilih modul & menu Permohonan 
Baharu. 
3. Isi maklumat permohonan. 
4. Muat naik dokumen sokongan 
(pengesahan OCR/AI). 
5. Buat perakuan ketepatan 
maklumat. 
6. Hantar permohonan.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-CC-XG-NA-02 Membuat Bayaran Fi Proses
Rujukan Fungsi PFD-CC-XG-NA Rujukan Aktiviti PFD-CC-XG-NA-02
Nama Fungsi Permohonan Peperiksaan Gas Nama Aktiviti Membuat Bayaran Fi Proses
Keterangan Aktiviti
Pemohon membuat bayaran fi proses 
melalui ST Payment Gateway (FPX).
Aktor Calon Peperiksaan Tanggungjawab
Menjelaskan fi proses dalam 
tempoh ditetapkan.

### Page 114

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
 
 
Aktiviti Sebelum PFD-CC-XG-NA-01 Aktiviti Selepas PFD-CC-XG-NA-03
Kaedah / Operasi 
(Bagaimana)
1. Sistem mengira fi proses. 
2. Pemohon membuat bayaran 
melalui FPX. 
3. Sistem menjana resit & mengemas 
kini status.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-CC-XG-NA-03 Membuat Semakan Dokumen
Rujukan Fungsi PFD-CC-XG-NA Rujukan Aktiviti PFD-CC-XG-NA-03
Nama Fungsi Permohonan Peperiksaan Gas Nama Aktiviti Membuat Semakan Dokumen
Keterangan Aktiviti
Pegawai SOS menyemak 
kelengkapan & kesahihan dokumen 
permohonan.
Aktor Pegawai SOS Tanggungjawab
Memastikan dokumen lengkap & 
sah sebelum semakan teknikal.
Aktiviti Sebelum PFD-CC-XG-NA-02 Aktiviti Selepas PFD-CC-XG-NA-04
Kaedah / Operasi 
(Bagaimana)
1. Semak dokumen yang dimuat naik. 
2. Sahkan kelengkapan & kesahihan. 
3. Jika tidak lengkap, kembalikan 
untuk kemaskini.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-CC-XG-NA-04 Membuat Semakan Teknikal
Rujukan Fungsi PFD-CC-XG-NA Rujukan Aktiviti PFD-CC-XG-NA-04
Nama Fungsi Permohonan Peperiksaan Gas Nama Aktiviti Membuat Semakan Teknikal
Keterangan Aktiviti
Pegawai Teknikal menilai pematuhan 
teknikal permohonan Permohonan 
Peperiksaan Gas.
Aktor Pegawai Teknikal Tanggungjawab
Menilai pematuhan teknikal & 
syarat kelayakan.
Aktiviti Sebelum PFD-CC-XG-NA-03 Aktiviti Selepas PFD-CC-XG-NA-06
Kaedah / Operasi 
(Bagaimana)
1. Semak butiran teknikal 
permohonan. 
2. Sahkan pematuhan syarat & 
peraturan. 
3. Tanda lulus/tidak lulus semakan 
teknikal.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-CC-XG-NA-05 Kemaskini Permohonan
Rujukan Fungsi PFD-CC-XG-NA Rujukan Aktiviti PFD-CC-XG-NA-05
Nama Fungsi Permohonan Peperiksaan Gas Nama Aktiviti Kemaskini Permohonan
Keterangan Aktiviti
Pemohon mengemas kini 
permohonan/dokumen yang tidak 
lengkap atau perlu pembetulan.
Aktor Calon Peperiksaan Tanggungjawab
Membetulkan & melengkapkan 
maklumat/dokumen yang diminta.

### Page 115

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
 
 
Aktiviti Sebelum
PFD-CC-XG-NA-03 / PFD-CC-
XG-NA-04
Aktiviti Selepas (kembali ke semakan)
Kaedah / Operasi 
(Bagaimana)
1. Terima notifikasi kemaskini. 
2. Betulkan maklumat / muat naik 
dokumen baharu. 
3. Hantar semula untuk semakan.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-CC-XG-NA-06 Membuat Kelulusan
Rujukan Fungsi PFD-CC-XG-NA Rujukan Aktiviti PFD-CC-XG-NA-06
Nama Fungsi Permohonan Peperiksaan Gas Nama Aktiviti Membuat Kelulusan
Keterangan Aktiviti
Pelulus membuat keputusan 
kelulusan mengikut Limit of 
Authority (LOA).
Aktor Pegawai Pelulus Tanggungjawab
Membuat keputusan lulus/tolak 
mengikut LOA.
Aktiviti Sebelum PFD-CC-XG-NA-04 Aktiviti Selepas
PFD-CC-XG-NA-07 / PFD-CC-
XG-NA-09
Kaedah / Operasi 
(Bagaimana)
1. Semak syor & dokumen sokongan. 
2. Buat keputusan mengikut LOA. 
3. Rekod keputusan dengan jejak 
audit.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-CC-XG-NA-07 Membuat Bayaran Pendaftaran
Rujukan Fungsi PFD-CC-XG-NA Rujukan Aktiviti PFD-CC-XG-NA-07
Nama Fungsi Permohonan Peperiksaan Gas Nama Aktiviti Membuat Bayaran Pendaftaran
Keterangan Aktiviti
Pemohon membuat bayaran 
pendaftaran/perakuan selepas 
permohonan diluluskan.
Aktor Calon Peperiksaan Tanggungjawab
Menjelaskan fi pendaftaran melalui 
FPX.
Aktiviti Sebelum PFD-CC-XG-NA-06 Aktiviti Selepas PFD-CC-XG-NA-08
Kaedah / Operasi 
(Bagaimana)
1. Sistem mengira fi pendaftaran. 
2. Pemohon membuat bayaran 
melalui FPX. 
3. Sistem mengemas kini status & 
menjana resit.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-CC-XG-NA-08 Menerima Perakuan Digital + QR
Rujukan Fungsi PFD-CC-XG-NA Rujukan Aktiviti PFD-CC-XG-NA-08
Nama Fungsi Permohonan Peperiksaan Gas Nama Aktiviti Menerima Perakuan Digital + QR
Keterangan Aktiviti
Sistem menjana perakuan digital 
berserta kod QR (ditambat pada 
blockchain) kepada pemohon.
Aktor Calon Peperiksaan Tanggungjawab
Memuat turun & menyimpan 
perakuan digital.

### Page 116

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
 
Aktiviti Sebelum PFD-CC-XG-NA-07 Aktiviti Selepas -
Kaedah / Operasi 
(Bagaimana)
1. Sistem menjana perakuan digital + 
QR. 
2. Hash perakuan ditambat pada 
blockchain. 
3. Pemohon memuat turun perakuan; 
boleh disahkan via imbasan QR.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-CC-XG-NA-09 Menerima Makluman Permohonan Ditolak
Rujukan Fungsi PFD-CC-XG-NA Rujukan Aktiviti PFD-CC-XG-NA-09
Nama Fungsi Permohonan Peperiksaan Gas Nama Aktiviti
Menerima Makluman Permohonan 
Ditolak
Keterangan Aktiviti
Pemohon menerima makluman 
penolakan beserta sebab.
Aktor Calon Peperiksaan Tanggungjawab
Menyemak sebab penolakan & 
tindakan susulan.
Aktiviti Sebelum PFD-CC-XG-NA-06 Aktiviti Selepas -
Kaedah / Operasi 
(Bagaimana)
1. Sistem menghantar makluman 
penolakan. 
2. Pemohon menyemak sebab. 
3. Pemohon boleh memohon semula 
jika berkenaan.

### Page 117

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
8.1 Modul CC-CD — Pembangunan Berterusan (CPD) 
 
Rajah 65: Rajah Use Case — Modul CC-CD: Pembangunan Berterusan (CPD)
 
Rajah 66: Rajah Aliran Data (DFD) — Modul CC-CD: Pembangunan Berterusan (CPD)
 
Rajah 67: Rajah Hubungan Entiti (ERD) — Modul CC-CD: Pembangunan Berterusan (CPD)
Elemen Keterangan
Kod Modul CC-CD
Fungsi (PFD) PFD-CC-CD-NA — Pembangunan Berterusan (CPD)
Domain / Fasa Pensijilan & Kompetensi / Fasa 2
Keterangan
Modul Pembangunan Berterusan adalah satu modul gunasama untuk pengurusan pengumpulan 
mata pembangunan berterusan (CDP) bagi individu yang telah menerima Perakuan 
Kekompetenan (Elektrik/Gas). Proses-proses yang terlibat di dalam modul ini adalah seperti 
berikut: a.
Aktor Utama Pemohon / Individu
Lorong Peranan Pemohon / Pengguna, Pegawai SOS, Pegawai Teknikal, Pelulus

### Page 118

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
Sub-Modul & Fungsian: 
Maklumat Antara Muka — Skrin Pengguna:
- Skrin Log Masuk & Dashboard Pengguna
- Skrin Borang Permohonan
- Skrin Muat Naik & Pengesahan Dokumen (OCR/AI)
- Skrin Notis & Bayaran Fi
- Inbox & Notifikasi
- Skrin Semakan (SOS/Teknikal)
- Skrin Kelulusan (LOA)
- Paparan & Muat Turun Perakuan Digital (QR)
- Skrin Carian & Semakan Status
- Skrin Laporan & Statistik (AIRR)
Maklumat Antara Muka — Integrasi Sistem (API):
- ST Payment Gateway (FPX)
- MyDigital ID (NACSA)
- Pos Digicert (e-Signature)
Entiti Data Utama Modul:
Sub-Modul Fungsian Utama
Permohonan & Pemprosesan
Penyediaan dan Penerbitan Skema Pembangunan Kekompetenan Individu; Permohonan 
menduduki kursus mandatori kekompetenan ST; Kemaskini maklumat CDP dan muat 
naik dokumen sokongan; Pengiraan mata CDP terkumpul; penggunaan; baki dan tempoh 
sah laku
Semakan & Kelulusan
Semakan dokumen (SOS), semakan teknikal, kelulusan mengikut LOA, kelulusan 
jawatankuasa (jika berkaitan)
Bayaran & Hasil
Penjanaan invois/notis fi, integrasi Payment Gateway, resit, pemantauan & rekonsiliasi 
hasil
Perakuan & Notifikasi Penjanaan perakuan digital + QR + e-tandatangan, notifikasi emel/inbox
Pemantauan & Pematuhan Pemantauan tarikh luput/jaminan/syarat, peringatan automatik, audit pematuhan
Pelaporan & Statistik Laporan operasi & statistik (AIRR), papan pemuka, eksport
Pentadbiran & Konfigurasi Reference table (jenis dokumen, fi, hari bayaran, ayat notifikasi), kawalan akses (RBAC)
Entiti Atribut Utama
REKOD_CPD id (PK), id_OK (FK), tahun, jumlah_mata
AKTIVITI_CPD id (PK), id_rekod (FK), jenis, mata, status_sah

### Page 119

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
Rajah 68: Carta Alir PFD-CC-CD-NA — Pembangunan Berterusan (CPD)
Definisi Aktiviti Fungsi Bisnes (format Tender):
 
DEFINISI AKTIVITI FUNGSI BISNES — PFD-CC-CD-NA-01 Membuat Permohonan
Rujukan Fungsi PFD-CC-CD-NA Rujukan Aktiviti PFD-CC-CD-NA-01
Nama Fungsi Pembangunan Berterusan (CPD)Nama Aktiviti Membuat Permohonan
Keterangan Aktiviti
Pemohon mengisi borang 
permohonan Pembangunan 
Berterusan (CPD) secara atas talian 
dan memuat naik dokumen sokongan.
Aktor Orang Kompeten Tanggungjawab
Melengkapkan borang & memuat 
naik dokumen sebelum 
menghantar.
Aktiviti Sebelum - Aktiviti Selepas PFD-CC-CD-NA-02
Kaedah / Operasi 
(Bagaimana)
1. Log masuk ke Dashboard 
pengguna. 
2. Pilih modul & menu Permohonan 
Baharu. 
3. Isi maklumat permohonan. 
4. Muat naik dokumen sokongan 
(pengesahan OCR/AI). 
5. Buat perakuan ketepatan 
maklumat. 
6. Hantar permohonan.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-CC-CD-NA-02 Membuat Bayaran Fi Proses
Rujukan Fungsi PFD-CC-CD-NA Rujukan Aktiviti PFD-CC-CD-NA-02
Nama Fungsi Pembangunan Berterusan (CPD)Nama Aktiviti Membuat Bayaran Fi Proses
Keterangan Aktiviti
Pemohon membuat bayaran fi proses 
melalui ST Payment Gateway (FPX).
Aktor Orang Kompeten Tanggungjawab
Menjelaskan fi proses dalam 
tempoh ditetapkan.
Aktiviti Sebelum PFD-CC-CD-NA-01 Aktiviti Selepas PFD-CC-CD-NA-03

### Page 120

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
 
 
Kaedah / Operasi 
(Bagaimana)
1. Sistem mengira fi proses. 
2. Pemohon membuat bayaran 
melalui FPX. 
3. Sistem menjana resit & mengemas 
kini status.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-CC-CD-NA-03 Membuat Semakan Dokumen
Rujukan Fungsi PFD-CC-CD-NA Rujukan Aktiviti PFD-CC-CD-NA-03
Nama Fungsi Pembangunan Berterusan (CPD)Nama Aktiviti Membuat Semakan Dokumen
Keterangan Aktiviti
Pegawai SOS menyemak 
kelengkapan & kesahihan dokumen 
permohonan.
Aktor Pegawai SOS Tanggungjawab
Memastikan dokumen lengkap & 
sah sebelum semakan teknikal.
Aktiviti Sebelum PFD-CC-CD-NA-02 Aktiviti Selepas PFD-CC-CD-NA-04
Kaedah / Operasi 
(Bagaimana)
1. Semak dokumen yang dimuat naik. 
2. Sahkan kelengkapan & kesahihan. 
3. Jika tidak lengkap, kembalikan 
untuk kemaskini.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-CC-CD-NA-04 Membuat Semakan Teknikal
Rujukan Fungsi PFD-CC-CD-NA Rujukan Aktiviti PFD-CC-CD-NA-04
Nama Fungsi Pembangunan Berterusan (CPD)Nama Aktiviti Membuat Semakan Teknikal
Keterangan Aktiviti
Pegawai Teknikal menilai pematuhan 
teknikal permohonan Pembangunan 
Berterusan (CPD).
Aktor Pegawai Teknikal Tanggungjawab
Menilai pematuhan teknikal & 
syarat kelayakan.
Aktiviti Sebelum PFD-CC-CD-NA-03 Aktiviti Selepas PFD-CC-CD-NA-06
Kaedah / Operasi 
(Bagaimana)
1. Semak butiran teknikal 
permohonan. 
2. Sahkan pematuhan syarat & 
peraturan. 
3. Tanda lulus/tidak lulus semakan 
teknikal.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-CC-CD-NA-05 Kemaskini Permohonan
Rujukan Fungsi PFD-CC-CD-NA Rujukan Aktiviti PFD-CC-CD-NA-05
Nama Fungsi Pembangunan Berterusan (CPD)Nama Aktiviti Kemaskini Permohonan
Keterangan Aktiviti
Pemohon mengemas kini 
permohonan/dokumen yang tidak 
lengkap atau perlu pembetulan.
Aktor Orang Kompeten Tanggungjawab
Membetulkan & melengkapkan 
maklumat/dokumen yang diminta.

### Page 121

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
 
 
Aktiviti Sebelum
PFD-CC-CD-NA-03 / PFD-CC-
CD-NA-04
Aktiviti Selepas (kembali ke semakan)
Kaedah / Operasi 
(Bagaimana)
1. Terima notifikasi kemaskini. 
2. Betulkan maklumat / muat naik 
dokumen baharu. 
3. Hantar semula untuk semakan.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-CC-CD-NA-06 Membuat Kelulusan
Rujukan Fungsi PFD-CC-CD-NA Rujukan Aktiviti PFD-CC-CD-NA-06
Nama Fungsi Pembangunan Berterusan (CPD)Nama Aktiviti Membuat Kelulusan
Keterangan Aktiviti
Pelulus membuat keputusan 
kelulusan mengikut Limit of 
Authority (LOA).
Aktor Pegawai Pelulus Tanggungjawab
Membuat keputusan lulus/tolak 
mengikut LOA.
Aktiviti Sebelum PFD-CC-CD-NA-04 Aktiviti Selepas
PFD-CC-CD-NA-07 / PFD-CC-
CD-NA-09
Kaedah / Operasi 
(Bagaimana)
1. Semak syor & dokumen sokongan. 
2. Buat keputusan mengikut LOA. 
3. Rekod keputusan dengan jejak 
audit.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-CC-CD-NA-07 Membuat Bayaran Pendaftaran
Rujukan Fungsi PFD-CC-CD-NA Rujukan Aktiviti PFD-CC-CD-NA-07
Nama Fungsi Pembangunan Berterusan (CPD)Nama Aktiviti Membuat Bayaran Pendaftaran
Keterangan Aktiviti
Pemohon membuat bayaran 
pendaftaran/perakuan selepas 
permohonan diluluskan.
Aktor Orang Kompeten Tanggungjawab
Menjelaskan fi pendaftaran melalui 
FPX.
Aktiviti Sebelum PFD-CC-CD-NA-06 Aktiviti Selepas PFD-CC-CD-NA-08
Kaedah / Operasi 
(Bagaimana)
1. Sistem mengira fi pendaftaran. 
2. Pemohon membuat bayaran 
melalui FPX. 
3. Sistem mengemas kini status & 
menjana resit.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-CC-CD-NA-08 Menerima Perakuan Digital + QR
Rujukan Fungsi PFD-CC-CD-NA Rujukan Aktiviti PFD-CC-CD-NA-08
Nama Fungsi Pembangunan Berterusan (CPD)Nama Aktiviti Menerima Perakuan Digital + QR
Keterangan Aktiviti
Sistem menjana perakuan digital 
berserta kod QR (ditambat pada 
blockchain) kepada pemohon.
Aktor Orang Kompeten Tanggungjawab
Memuat turun & menyimpan 
perakuan digital.

### Page 122

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
 
Aktiviti Sebelum PFD-CC-CD-NA-07 Aktiviti Selepas -
Kaedah / Operasi 
(Bagaimana)
1. Sistem menjana perakuan digital + 
QR. 
2. Hash perakuan ditambat pada 
blockchain. 
3. Pemohon memuat turun perakuan; 
boleh disahkan via imbasan QR.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-CC-CD-NA-09 Menerima Makluman Permohonan Ditolak
Rujukan Fungsi PFD-CC-CD-NA Rujukan Aktiviti PFD-CC-CD-NA-09
Nama Fungsi Pembangunan Berterusan (CPD)Nama Aktiviti
Menerima Makluman Permohonan 
Ditolak
Keterangan Aktiviti
Pemohon menerima makluman 
penolakan beserta sebab.
Aktor Orang Kompeten Tanggungjawab
Menyemak sebab penolakan & 
tindakan susulan.
Aktiviti Sebelum PFD-CC-CD-NA-06 Aktiviti Selepas -
Kaedah / Operasi 
(Bagaimana)
1. Sistem menghantar makluman 
penolakan. 
2. Pemohon menyemak sebab. 
3. Pemohon boleh memohon semula 
jika berkenaan.

### Page 123

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
8.1 Modul EE-KT — Kecekapan Tenaga 
 
Rajah 69: Rajah Use Case — Modul EE-KT: Kecekapan Tenaga
 
Rajah 70: Rajah Aliran Data (DFD) — Modul EE-KT: Kecekapan Tenaga
Elemen Keterangan
Kod Modul EE-KT
Fungsi (PFD) PFD-EE-KT-NA — Kecekapan Tenaga (Pengurus/Audit Tenaga)
Domain / Fasa Kecekapan & Penguatkuasaan / Fasa 2
Keterangan
Modul Kecekapan Tenaga adalah satu modul gunasama yang melibatkan permohonan 
Pendaftaran Pengurus Tenaga dan Juruaudit Tenaga; serta Pentauliahan Institusi Latihan yang 
berkelayakan berdasarkan peruntukan di bawah Akta Kecekapan dan Konservasi Tenaga 2024. 
Proses-proses yang terlibat adalah seperti 
Aktor Utama Pemohon / Individu
Lorong Peranan Pemohon / Pengguna, Pegawai SOS, Pegawai Teknikal, Pelulus

### Page 124

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
Rajah 71: Rajah Hubungan Entiti (ERD) — Modul EE-KT: Kecekapan Tenaga
Sub-Modul & Fungsian: 
Maklumat Antara Muka — Skrin Pengguna:
- Skrin Log Masuk & Dashboard Pengguna
- Skrin Borang Permohonan
- Skrin Muat Naik & Pengesahan Dokumen (OCR/AI)
- Skrin Notis & Bayaran Fi
- Inbox & Notifikasi
- Skrin Semakan (SOS/Teknikal)
- Skrin Kelulusan (LOA)
- Paparan & Muat Turun Perakuan Digital (QR)
- Skrin Carian & Semakan Status
- Skrin Laporan & Statistik (AIRR)
Maklumat Antara Muka — Integrasi Sistem (API):
- ST Payment Gateway (FPX)
- MyDigital ID (NACSA)
- Pos Digicert (e-Signature)
Entiti Data Utama Modul:
Sub-Modul Fungsian Utama
Permohonan & Pemprosesan
Permohonan Pendaftaran Pengurus Tenaga dan Juruaudit Tenaga; Penjadualan Sesi 
Temuduga (Panel dan Calon); Pelaksanaan Sesi Temuduga; Repository bank soalan bagi 
sesi ujian bertulis Juruaudit Tenaga dan
Semakan & Kelulusan
Semakan dokumen (SOS), semakan teknikal, kelulusan mengikut LOA, kelulusan 
jawatankuasa (jika berkaitan)
Bayaran & Hasil
Penjanaan invois/notis fi, integrasi Payment Gateway, resit, pemantauan & rekonsiliasi 
hasil
Perakuan & Notifikasi Penjanaan perakuan digital + QR + e-tandatangan, notifikasi emel/inbox
Pemantauan & Pematuhan Pemantauan tarikh luput/jaminan/syarat, peringatan automatik, audit pematuhan
Pelaporan & Statistik Laporan operasi & statistik (AIRR), papan pemuka, eksport
Pentadbiran & Konfigurasi Reference table (jenis dokumen, fi, hari bayaran, ayat notifikasi), kawalan akses (RBAC)

### Page 125

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
Rajah 72: Carta Alir PFD-EE-KT-NA — Kecekapan Tenaga (Pengurus/Audit Tenaga)
Definisi Aktiviti Fungsi Bisnes (format Tender):
 
Entiti Atribut Utama
PENGURUS_TENAGA id (PK), id_pengguna (FK), no_pendaftaran, status
LAPORAN_TENAGA id (PK), id_pengurus (FK), tahun, penggunaan
DEFINISI AKTIVITI FUNGSI BISNES — PFD-EE-KT-NA-01 Membuat Permohonan
Rujukan Fungsi PFD-EE-KT-NA Rujukan Aktiviti PFD-EE-KT-NA-01
Nama Fungsi
Kecekapan Tenaga (Pengurus/
Audit Tenaga)
Nama Aktiviti Membuat Permohonan
Keterangan Aktiviti
Pemohon mengisi borang 
permohonan Kecekapan Tenaga 
(Pengurus/Audit Tenaga) secara atas 
talian dan memuat naik dokumen 
sokongan.
Aktor Pemohon / Pengurus Tenaga Tanggungjawab
Melengkapkan borang & memuat 
naik dokumen sebelum 
menghantar.
Aktiviti Sebelum - Aktiviti Selepas PFD-EE-KT-NA-02
Kaedah / Operasi 
(Bagaimana)
1. Log masuk ke Dashboard 
pengguna. 
2. Pilih modul & menu Permohonan 
Baharu. 
3. Isi maklumat permohonan. 
4. Muat naik dokumen sokongan 
(pengesahan OCR/AI). 
5. Buat perakuan ketepatan 
maklumat. 
6. Hantar permohonan.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-EE-KT-NA-02 Membuat Bayaran Fi Proses
Rujukan Fungsi PFD-EE-KT-NA Rujukan Aktiviti PFD-EE-KT-NA-02
Nama Fungsi
Kecekapan Tenaga (Pengurus/
Audit Tenaga)
Nama Aktiviti Membuat Bayaran Fi Proses
Keterangan Aktiviti
Pemohon membuat bayaran fi proses 
melalui ST Payment Gateway (FPX).

### Page 126

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
 
 
Aktor Pemohon / Pengurus Tenaga Tanggungjawab
Menjelaskan fi proses dalam 
tempoh ditetapkan.
Aktiviti Sebelum PFD-EE-KT-NA-01 Aktiviti Selepas PFD-EE-KT-NA-03
Kaedah / Operasi 
(Bagaimana)
1. Sistem mengira fi proses. 
2. Pemohon membuat bayaran 
melalui FPX. 
3. Sistem menjana resit & mengemas 
kini status.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-EE-KT-NA-03 Membuat Semakan Dokumen
Rujukan Fungsi PFD-EE-KT-NA Rujukan Aktiviti PFD-EE-KT-NA-03
Nama Fungsi
Kecekapan Tenaga (Pengurus/
Audit Tenaga)
Nama Aktiviti Membuat Semakan Dokumen
Keterangan Aktiviti
Pegawai SOS menyemak 
kelengkapan & kesahihan dokumen 
permohonan.
Aktor Pegawai SOS Tanggungjawab
Memastikan dokumen lengkap & 
sah sebelum semakan teknikal.
Aktiviti Sebelum PFD-EE-KT-NA-02 Aktiviti Selepas PFD-EE-KT-NA-04
Kaedah / Operasi 
(Bagaimana)
1. Semak dokumen yang dimuat naik. 
2. Sahkan kelengkapan & kesahihan. 
3. Jika tidak lengkap, kembalikan 
untuk kemaskini.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-EE-KT-NA-04 Membuat Semakan Teknikal
Rujukan Fungsi PFD-EE-KT-NA Rujukan Aktiviti PFD-EE-KT-NA-04
Nama Fungsi
Kecekapan Tenaga (Pengurus/
Audit Tenaga)
Nama Aktiviti Membuat Semakan Teknikal
Keterangan Aktiviti
Pegawai Teknikal menilai pematuhan 
teknikal permohonan Kecekapan 
Tenaga (Pengurus/Audit Tenaga).
Aktor Pegawai Teknikal Tanggungjawab
Menilai pematuhan teknikal & 
syarat kelayakan.
Aktiviti Sebelum PFD-EE-KT-NA-03 Aktiviti Selepas PFD-EE-KT-NA-06
Kaedah / Operasi 
(Bagaimana)
1. Semak butiran teknikal 
permohonan. 
2. Sahkan pematuhan syarat & 
peraturan. 
3. Tanda lulus/tidak lulus semakan 
teknikal.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-EE-KT-NA-05 Kemaskini Permohonan
Rujukan Fungsi PFD-EE-KT-NA Rujukan Aktiviti PFD-EE-KT-NA-05
Nama Fungsi
Kecekapan Tenaga (Pengurus/
Audit Tenaga)
Nama Aktiviti Kemaskini Permohonan

### Page 127

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
 
 
Keterangan Aktiviti
Pemohon mengemas kini 
permohonan/dokumen yang tidak 
lengkap atau perlu pembetulan.
Aktor Pemohon / Pengurus Tenaga Tanggungjawab
Membetulkan & melengkapkan 
maklumat/dokumen yang diminta.
Aktiviti Sebelum
PFD-EE-KT-NA-03 / PFD-EE-KT-
NA-04
Aktiviti Selepas (kembali ke semakan)
Kaedah / Operasi 
(Bagaimana)
1. Terima notifikasi kemaskini. 
2. Betulkan maklumat / muat naik 
dokumen baharu. 
3. Hantar semula untuk semakan.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-EE-KT-NA-06 Membuat Kelulusan
Rujukan Fungsi PFD-EE-KT-NA Rujukan Aktiviti PFD-EE-KT-NA-06
Nama Fungsi
Kecekapan Tenaga (Pengurus/
Audit Tenaga)
Nama Aktiviti Membuat Kelulusan
Keterangan Aktiviti
Pelulus membuat keputusan 
kelulusan mengikut Limit of 
Authority (LOA).
Aktor Pegawai Pelulus Tanggungjawab
Membuat keputusan lulus/tolak 
mengikut LOA.
Aktiviti Sebelum PFD-EE-KT-NA-04 Aktiviti Selepas
PFD-EE-KT-NA-07 / PFD-EE-KT-
NA-09
Kaedah / Operasi 
(Bagaimana)
1. Semak syor & dokumen sokongan. 
2. Buat keputusan mengikut LOA. 
3. Rekod keputusan dengan jejak 
audit.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-EE-KT-NA-07 Membuat Bayaran Pendaftaran
Rujukan Fungsi PFD-EE-KT-NA Rujukan Aktiviti PFD-EE-KT-NA-07
Nama Fungsi
Kecekapan Tenaga (Pengurus/
Audit Tenaga)
Nama Aktiviti Membuat Bayaran Pendaftaran
Keterangan Aktiviti
Pemohon membuat bayaran 
pendaftaran/perakuan selepas 
permohonan diluluskan.
Aktor Pemohon / Pengurus Tenaga Tanggungjawab
Menjelaskan fi pendaftaran melalui 
FPX.
Aktiviti Sebelum PFD-EE-KT-NA-06 Aktiviti Selepas PFD-EE-KT-NA-08
Kaedah / Operasi 
(Bagaimana)
1. Sistem mengira fi pendaftaran. 
2. Pemohon membuat bayaran 
melalui FPX. 
3. Sistem mengemas kini status & 
menjana resit.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-EE-KT-NA-08 Menerima Perakuan Digital + QR

### Page 128

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
 
Rujukan Fungsi PFD-EE-KT-NA Rujukan Aktiviti PFD-EE-KT-NA-08
Nama Fungsi
Kecekapan Tenaga (Pengurus/
Audit Tenaga)
Nama Aktiviti Menerima Perakuan Digital + QR
Keterangan Aktiviti
Sistem menjana perakuan digital 
berserta kod QR (ditambat pada 
blockchain) kepada pemohon.
Aktor Pemohon / Pengurus Tenaga Tanggungjawab
Memuat turun & menyimpan 
perakuan digital.
Aktiviti Sebelum PFD-EE-KT-NA-07 Aktiviti Selepas -
Kaedah / Operasi 
(Bagaimana)
1. Sistem menjana perakuan digital + 
QR. 
2. Hash perakuan ditambat pada 
blockchain. 
3. Pemohon memuat turun perakuan; 
boleh disahkan via imbasan QR.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-EE-KT-NA-09 Menerima Makluman Permohonan Ditolak
Rujukan Fungsi PFD-EE-KT-NA Rujukan Aktiviti PFD-EE-KT-NA-09
Nama Fungsi
Kecekapan Tenaga (Pengurus/
Audit Tenaga)
Nama Aktiviti
Menerima Makluman Permohonan 
Ditolak
Keterangan Aktiviti
Pemohon menerima makluman 
penolakan beserta sebab.
Aktor Pemohon / Pengurus Tenaga Tanggungjawab
Menyemak sebab penolakan & 
tindakan susulan.
Aktiviti Sebelum PFD-EE-KT-NA-06 Aktiviti Selepas -
Kaedah / Operasi 
(Bagaimana)
1. Sistem menghantar makluman 
penolakan. 
2. Pemohon menyemak sebab. 
3. Pemohon boleh memohon semula 
jika berkenaan.

### Page 129

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
8.1 Modul EN-IV — Penguatkuasaan & Penyiasatan 
 
Rajah 73: Rajah Use Case — Modul EN-IV: Penguatkuasaan & Penyiasatan
 
Rajah 74: Rajah Aliran Data (DFD) — Modul EN-IV: Penguatkuasaan & Penyiasatan
Elemen Keterangan
Kod Modul EN-IV
Fungsi (PFD) PFD-EN-IV-NA — Penguatkuasaan & Penyiasatan
Domain / Fasa Kecekapan & Penguatkuasaan / Fasa 2
Keterangan
Modul Penguatkuasaan dan Penyiasatan adalah satu modul dalaman ST yang akan digunakan 
bagi perancangan dan pelaksanaan operasi/aktiviti penguatkuasaan; merekod serta memantau 
perjalanan proses penyiasatan dan keputusan penyiasatan. Pelaksanaan aktiviti-aktiviti di bawah 
modul ini adalah berdasarkan 
Aktor Utama Pengguna ST / Pegawai
Lorong Peranan Pemohon / Pengguna, Pegawai SOS, Pegawai Teknikal, Pelulus

### Page 130

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
Rajah 75: Rajah Hubungan Entiti (ERD) — Modul EN-IV: Penguatkuasaan & Penyiasatan
Sub-Modul & Fungsian: 
Maklumat Antara Muka — Skrin Pengguna:
- Skrin Log Masuk & Dashboard Pengguna
- Skrin Borang Permohonan
- Skrin Muat Naik & Pengesahan Dokumen (OCR/AI)
- Skrin Notis & Bayaran Fi
- Inbox & Notifikasi
- Skrin Semakan (SOS/Teknikal)
- Skrin Kelulusan (LOA)
- Paparan & Muat Turun Perakuan Digital (QR)
- Skrin Carian & Semakan Status
- Skrin Laporan & Statistik (AIRR)
Sub-Modul Fungsian Utama
Permohonan & Pemprosesan
Perancangan dan Penjadualan Aktiviti Penguatkuasaan; Pengurusan Aktiviti 
Penguatkuasaan Ketidakpatuhan dari Modul; Pembatalan Perakuan oleh Penguatkuasaan; 
Pengurusan Aduan
Semakan & Kelulusan
Semakan dokumen (SOS), semakan teknikal, kelulusan mengikut LOA, kelulusan 
jawatankuasa (jika berkaitan)
Bayaran & Hasil
Penjanaan invois/notis fi, integrasi Payment Gateway, resit, pemantauan & rekonsiliasi 
hasil
Perakuan & Notifikasi Penjanaan perakuan digital + QR + e-tandatangan, notifikasi emel/inbox
Pemantauan & Pematuhan Pemantauan tarikh luput/jaminan/syarat, peringatan automatik, audit pematuhan
Pelaporan & Statistik Laporan operasi & statistik (AIRR), papan pemuka, eksport
Pentadbiran & Konfigurasi Reference table (jenis dokumen, fi, hari bayaran, ayat notifikasi), kawalan akses (RBAC)

### Page 131

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
Maklumat Antara Muka — Integrasi Sistem (API):
- ST Payment Gateway (FPX)
- MyDigital ID (NACSA)
- Pos Digicert (e-Signature)
Entiti Data Utama Modul:
 
Rajah 76: Carta Alir PFD-EN-IV-NA — Penguatkuasaan & Penyiasatan
Definisi Aktiviti Fungsi Bisnes (format Tender):
 
Entiti Atribut Utama
ADUAN id (PK), sumber, tarikh, status
KES id (PK), id_aduan (FK), jenis, status
SIASATAN id (PK), id_kes (FK), pegawai, keputusan
KOMPAUN id (PK), id_kes (FK), amaun, status
DEFINISI AKTIVITI FUNGSI BISNES — PFD-EN-IV-NA-01 Membuat Permohonan
Rujukan Fungsi PFD-EN-IV-NA Rujukan Aktiviti PFD-EN-IV-NA-01
Nama Fungsi Penguatkuasaan & PenyiasatanNama Aktiviti Membuat Permohonan
Keterangan Aktiviti
Pemohon mengisi borang 
permohonan Penguatkuasaan & 
Penyiasatan secara atas talian dan 
memuat naik dokumen sokongan.
Aktor Pegawai Penguatkuasa Tanggungjawab
Melengkapkan borang & memuat 
naik dokumen sebelum 
menghantar.
Aktiviti Sebelum - Aktiviti Selepas PFD-EN-IV-NA-02
Kaedah / Operasi 
(Bagaimana)
1. Log masuk ke Dashboard 
pengguna. 
2. Pilih modul & menu Permohonan 
Baharu. 
3. Isi maklumat permohonan. 
4. Muat naik dokumen sokongan 
(pengesahan OCR/AI). 
5. Buat perakuan ketepatan 
maklumat. 
6. Hantar permohonan.

### Page 132

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
 
 
DEFINISI AKTIVITI FUNGSI BISNES — PFD-EN-IV-NA-02 Membuat Bayaran Fi Proses
Rujukan Fungsi PFD-EN-IV-NA Rujukan Aktiviti PFD-EN-IV-NA-02
Nama Fungsi Penguatkuasaan & PenyiasatanNama Aktiviti Membuat Bayaran Fi Proses
Keterangan Aktiviti
Pemohon membuat bayaran fi proses 
melalui ST Payment Gateway (FPX).
Aktor Pegawai Penguatkuasa Tanggungjawab
Menjelaskan fi proses dalam 
tempoh ditetapkan.
Aktiviti Sebelum PFD-EN-IV-NA-01 Aktiviti Selepas PFD-EN-IV-NA-03
Kaedah / Operasi 
(Bagaimana)
1. Sistem mengira fi proses. 
2. Pemohon membuat bayaran 
melalui FPX. 
3. Sistem menjana resit & mengemas 
kini status.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-EN-IV-NA-03 Membuat Semakan Dokumen
Rujukan Fungsi PFD-EN-IV-NA Rujukan Aktiviti PFD-EN-IV-NA-03
Nama Fungsi Penguatkuasaan & PenyiasatanNama Aktiviti Membuat Semakan Dokumen
Keterangan Aktiviti
Pegawai SOS menyemak 
kelengkapan & kesahihan dokumen 
permohonan.
Aktor Pegawai SOS Tanggungjawab
Memastikan dokumen lengkap & 
sah sebelum semakan teknikal.
Aktiviti Sebelum PFD-EN-IV-NA-02 Aktiviti Selepas PFD-EN-IV-NA-04
Kaedah / Operasi 
(Bagaimana)
1. Semak dokumen yang dimuat naik. 
2. Sahkan kelengkapan & kesahihan. 
3. Jika tidak lengkap, kembalikan 
untuk kemaskini.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-EN-IV-NA-04 Membuat Semakan Teknikal
Rujukan Fungsi PFD-EN-IV-NA Rujukan Aktiviti PFD-EN-IV-NA-04
Nama Fungsi Penguatkuasaan & PenyiasatanNama Aktiviti Membuat Semakan Teknikal
Keterangan Aktiviti
Pegawai Teknikal menilai pematuhan 
teknikal permohonan Penguatkuasaan 
& Penyiasatan.
Aktor Pegawai Teknikal Tanggungjawab
Menilai pematuhan teknikal & 
syarat kelayakan.
Aktiviti Sebelum PFD-EN-IV-NA-03 Aktiviti Selepas PFD-EN-IV-NA-06
Kaedah / Operasi 
(Bagaimana)
1. Semak butiran teknikal 
permohonan. 
2. Sahkan pematuhan syarat & 
peraturan. 
3. Tanda lulus/tidak lulus semakan 
teknikal.

### Page 133

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
 
 
DEFINISI AKTIVITI FUNGSI BISNES — PFD-EN-IV-NA-05 Kemaskini Permohonan
Rujukan Fungsi PFD-EN-IV-NA Rujukan Aktiviti PFD-EN-IV-NA-05
Nama Fungsi Penguatkuasaan & PenyiasatanNama Aktiviti Kemaskini Permohonan
Keterangan Aktiviti
Pemohon mengemas kini 
permohonan/dokumen yang tidak 
lengkap atau perlu pembetulan.
Aktor Pegawai Penguatkuasa Tanggungjawab
Membetulkan & melengkapkan 
maklumat/dokumen yang diminta.
Aktiviti Sebelum
PFD-EN-IV-NA-03 / PFD-EN-IV-
NA-04
Aktiviti Selepas (kembali ke semakan)
Kaedah / Operasi 
(Bagaimana)
1. Terima notifikasi kemaskini. 
2. Betulkan maklumat / muat naik 
dokumen baharu. 
3. Hantar semula untuk semakan.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-EN-IV-NA-06 Membuat Kelulusan
Rujukan Fungsi PFD-EN-IV-NA Rujukan Aktiviti PFD-EN-IV-NA-06
Nama Fungsi Penguatkuasaan & PenyiasatanNama Aktiviti Membuat Kelulusan
Keterangan Aktiviti
Pelulus membuat keputusan 
kelulusan mengikut Limit of 
Authority (LOA).
Aktor Pegawai Pelulus Tanggungjawab
Membuat keputusan lulus/tolak 
mengikut LOA.
Aktiviti Sebelum PFD-EN-IV-NA-04 Aktiviti Selepas
PFD-EN-IV-NA-07 / PFD-EN-IV-
NA-09
Kaedah / Operasi 
(Bagaimana)
1. Semak syor & dokumen sokongan. 
2. Buat keputusan mengikut LOA. 
3. Rekod keputusan dengan jejak 
audit.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-EN-IV-NA-07 Membuat Bayaran Pendaftaran
Rujukan Fungsi PFD-EN-IV-NA Rujukan Aktiviti PFD-EN-IV-NA-07
Nama Fungsi Penguatkuasaan & PenyiasatanNama Aktiviti Membuat Bayaran Pendaftaran
Keterangan Aktiviti
Pemohon membuat bayaran 
pendaftaran/perakuan selepas 
permohonan diluluskan.
Aktor Pegawai Penguatkuasa Tanggungjawab
Menjelaskan fi pendaftaran melalui 
FPX.
Aktiviti Sebelum PFD-EN-IV-NA-06 Aktiviti Selepas PFD-EN-IV-NA-08
Kaedah / Operasi 
(Bagaimana)
1. Sistem mengira fi pendaftaran. 
2. Pemohon membuat bayaran 
melalui FPX. 
3. Sistem mengemas kini status & 
menjana resit.

### Page 134

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
 
 
DEFINISI AKTIVITI FUNGSI BISNES — PFD-EN-IV-NA-08 Menerima Perakuan Digital + QR
Rujukan Fungsi PFD-EN-IV-NA Rujukan Aktiviti PFD-EN-IV-NA-08
Nama Fungsi Penguatkuasaan & PenyiasatanNama Aktiviti Menerima Perakuan Digital + QR
Keterangan Aktiviti
Sistem menjana perakuan digital 
berserta kod QR (ditambat pada 
blockchain) kepada pemohon.
Aktor Pegawai Penguatkuasa Tanggungjawab
Memuat turun & menyimpan 
perakuan digital.
Aktiviti Sebelum PFD-EN-IV-NA-07 Aktiviti Selepas -
Kaedah / Operasi 
(Bagaimana)
1. Sistem menjana perakuan digital + 
QR. 
2. Hash perakuan ditambat pada 
blockchain. 
3. Pemohon memuat turun perakuan; 
boleh disahkan via imbasan QR.
DEFINISI AKTIVITI FUNGSI BISNES — PFD-EN-IV-NA-09 Menerima Makluman Permohonan Ditolak
Rujukan Fungsi PFD-EN-IV-NA Rujukan Aktiviti PFD-EN-IV-NA-09
Nama Fungsi Penguatkuasaan & PenyiasatanNama Aktiviti
Menerima Makluman Permohonan 
Ditolak
Keterangan Aktiviti
Pemohon menerima makluman 
penolakan beserta sebab.
Aktor Pegawai Penguatkuasa Tanggungjawab
Menyemak sebab penolakan & 
tindakan susulan.
Aktiviti Sebelum PFD-EN-IV-NA-06 Aktiviti Selepas -
Kaedah / Operasi 
(Bagaimana)
1. Sistem menghantar makluman 
penolakan. 
2. Pemohon menyemak sebab. 
3. Pemohon boleh memohon semula 
jika berkenaan.

### Page 135

SRS — Sistem Digital Suruhanjaya Tenaga (ST)
8.2 Matriks Keterunutan Keperluan Fungsian 
Jadual 10: Matriks Keterunutan Keperluan Fungsian
8.3 Rujukan Perundangan
- Akta Bekalan Elektrik 1990 (Akta 447) & Peraturan-Peraturan Elektrik
- Akta Bekalan Gas 1993 (Akta 501) & Peraturan Bekalan Gas 1997
- Akta Kecekapan dan Konservasi Tenaga 2024
- Peraturan & Limits of Authority (LOA) ST yang berkuat kuasa
Modul Sumber (Appendix) Pemetaan SRS
LC-LE — Pelesenan Elektrik Appendix G; D1 §2.2.2, §3.2, §8.1
LC-PE — Pepasangan Elektrik Appendix G; D1 §2.2.2, §3.2, §8.1
LC-LG — Pelesenan Gas Appendix G; D1 §2.2.2, §3.2, §8.1
LC-PG — Pepasangan Gas Appendix G; D1 §2.2.2, §3.2, §8.1
RG-KE — Pendaftaran Orang 
Kompeten Elektrik
Appendix G; D1; D11 §2.2.2, §3.2, §8.1
RG-KG — Pendaftaran Orang 
Kompeten Gas
Appendix G; D1 §2.2.2, §3.2, §8.1
RG-CE — Pendaftaran Kontraktor 
Elektrik
Appendix G; D1; D11 §2.2.2, §3.2, §8.1
RG-CG — Pendaftaran Kontraktor 
Gas
Appendix G; D1 §2.2.2, §3.2, §8.1
PE-ID — Pengurusan ID & Akaun 
Pengguna
Appendix G; D1 §2.2.2, §3.2, §8.1
PE-RV — Pengurusan Hasil Appendix G; D1 §2.2.2, §3.2, §8.1
PE-SV — Lawatan Tapak / 
Pemeriksaan / Audit
Appendix G; D1 §2.2.2, §3.2, §8.1
PE-JK — Kelulusan JawatankuasaAppendix G; D1 §2.2.2, §3.2, §8.1
CC-XE — Peperiksaan ElektrikAppendix G; D1 §2.2.2, §3.2, §8.1
CC-XG — Peperiksaan Gas Appendix G; D1 §2.2.2, §3.2, §8.1
CC-CD — Pembangunan Berterusan 
(CPD)
Appendix G; D1 §2.2.2, §3.2, §8.1
EE-KT — Kecekapan Tenaga Appendix G; D1 §2.2.2, §3.2, §8.1
EN-IV — Penguatkuasaan & 
Penyiasatan
Appendix G; D1 §2.2.2, §3.2, §8.1
