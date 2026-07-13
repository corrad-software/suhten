# SRS — Sistem Digital Suruhanjaya Tenaga (ST)

| Field | Value |
|-------|-------|
| Format | D03 — KRISA/MAMPU |
| Version | 1.0 |
| Date | Jun 2026 |
| Agency | Suruhanjaya Tenaga (ST) |
| Parent Ministry | Kementerian Peralihan Tenaga dan Transformasi Air (PETRA) |
| Source PDF | `docs/SRS Lengkap v2 - Sistem Digital ST.pdf` |
| Full text | [`SRS-Sistem-Digital-ST-full-text.md`](./SRS-Sistem-Digital-ST-full-text.md) |
| References | Appendix G (Modul), Appendix D1 (Fungsi), Appendix D11 (Prototaip) |

> **Note:** Diagrams (ERD, DFD, Use Case, PFD swimlanes) exist only in the PDF. This markdown captures all extractable text for AI-assisted development.

## Table of Contents

1. [Document Overview](#1-document-overview)
2. [System Scope & Objectives](#2-system-scope--objectives)
3. [Module Index (17 Modules)](#3-module-index-17-modules)
4. [System Actors](#4-system-actors)
5. [Common Module Features](#5-common-module-features)
6. [Standard User Screens](#6-standard-user-screens)
7. [Standard PFD Workflow Activities](#7-standard-pfd-workflow-activities)
8. [Core Data Entities](#8-core-data-entities)
9. [Use Cases by Module](#9-use-cases-by-module)
10. [Transactions by Module](#10-transactions-by-module)
11. [External Integrations](#11-external-integrations)
12. [Non-Functional Requirements](#12-non-functional-requirements)
13. [System Size (Function Points)](#13-system-size-function-points)
14. [Module Specifications](#14-module-specifications)
15. [Legal References](#15-legal-references)
16. [Glossary & Acronyms](#16-glossary--acronyms)

---

## 1. Document Overview

Keterangan Dokumen 
Dokumen Spesifikasi Keperluan Sistem (SRS) ini menjelaskan secara menyeluruh keperluan fungsian 
dan bukan fungsian bagi Sistem Digital Suruhanjaya Tenaga (ST), disediakan mengikut format D03 
dalam Buku Panduan Kejuruteraan Sistem Aplikasi Sektor Awam (KRISA, BPI MAMPU). Konteks dan 
keperluan sistem diperoleh daripada Appendix G (Keterangan Modul), Appendix D1 (Spesifikasi Fungsi) 
dan Appendix D11 (Pembentangan Prototaip). Dokumen menjadi rujukan utama bagi fasa rekabentuk 
(SDS), pembangunan, pengujian dan pentauliahan.

### Source References

Sumber Rujukan 
1.Appendix G — Keterangan Modul
2.Appendix D1 — Jadual Pematuhan Spesifikasi Fungsi
3.Appendix D11 — Jadual Pematuhan Pembentangan Prototaip
4.Buku Panduan Kejuruteraan Sistem Aplikasi Sektor Awam (KRISA), BPI MAMPU, 2019
5.ISO/IEC/IEEE 29148-2011; IEEE Std 830-1998
6.Akta Bekalan Elektrik 1990 (Akta 447) & Peraturan berkaitan
7.Akta Bekalan Gas 1993 (Akta 501) & Peraturan berkaitan
8.Akta Kecekapan dan Konservasi Tenaga 2024

---

## 2. System Scope & Objectives

### 2.1 Purpose

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

### 2.2 Overall Scope

Portal Digital ST comprises:

- Landing Page
- Sistem Digital ST Awam (public portal)
- Sistem Digital ST Kakitangan (staff portal)
- 17 service modules across 2 phases
- Internal/external integrations, data migration, workflow engine, CMS, OCR/AI document validation, cybersecurity

---

## 3. Module Index (17 Modules)

| # | Code | Module | Domain | Phase |
|---|------|--------|--------|-------|
| 1 | [LC-LE](#modul-lc-le) | Pelesenan Elektrik | Pelesenan & Pepasangan | Fasa 1 |
| 2 | [LC-PE](#modul-lc-pe) | Pepasangan Elektrik | Pelesenan & Pepasangan | Fasa 1 |
| 3 | [LC-LG](#modul-lc-lg) | Pelesenan Gas | Pelesenan & Pepasangan | Fasa 1 |
| 4 | [LC-PG](#modul-lc-pg) | Pepasangan Gas | Pelesenan & Pepasangan | Fasa 1 |
| 5 | [RG-KE](#modul-rg-ke) | Pendaftaran Orang Kompeten Elektrik | Pendaftaran | Fasa 1 |
| 6 | [RG-KG](#modul-rg-kg) | Pendaftaran Orang Kompeten Gas | Pendaftaran | Fasa 1 |
| 7 | [RG-CE](#modul-rg-ce) | Pendaftaran Kontraktor Elektrik | Pendaftaran | Fasa 1 |
| 8 | [RG-CG](#modul-rg-cg) | Pendaftaran Kontraktor Gas | Pendaftaran | Fasa 1 |
| 9 | [PE-ID](#modul-pe-id) | Pengurusan ID & Akaun Pengguna | Operasi & Perkhidmatan | Fasa 1 |
| 10 | [PE-RV](#modul-pe-rv) | Pengurusan Hasil | Operasi & Perkhidmatan | Fasa 1 |
| 11 | [PE-SV](#modul-pe-sv) | Lawatan Tapak / Pemeriksaan / Audit | Operasi & Perkhidmatan | Fasa 1 |
| 12 | [PE-JK](#modul-pe-jk) | Kelulusan Jawatankuasa | Operasi & Perkhidmatan | Fasa 1 |
| 13 | [CC-XE](#modul-cc-xe) | Peperiksaan Elektrik | Pensijilan & Kompetensi | Fasa 2 |
| 14 | [CC-XG](#modul-cc-xg) | Peperiksaan Gas | Pensijilan & Kompetensi | Fasa 2 |
| 15 | [CC-CD](#modul-cc-cd) | Pembangunan Berterusan (CPD) | Pensijilan & Kompetensi | Fasa 2 |
| 16 | [EE-KT](#modul-ee-kt) | Kecekapan Tenaga | Kecekapan & Penguatkuasaan | Fasa 2 |
| 17 | [EN-IV](#modul-en-iv) | Penguatkuasaan & Penyiasatan | Kecekapan & Penguatkuasaan | Fasa 2 |

---

## 4. System Actors

| Actor | Description |
|-------|-------------|
| Pemohon Awam / Individu | Registered individual applying for services and making payments |
| Wakil Syarikat / Kontraktor | Company representative applying for contractor/installation/licensing |
| Orang Kompeten (OK) | Qualified individual accepting/confirming appointment |
| Majikan | Confirms OK appointment / employment relationship |
| Pegawai SOS | Reviews document completeness |
| Pegawai Teknikal | Conducts technical review |
| Pegawai Pelulus | Approves applications per LOA |
| Ahli Jawatankuasa | Committee/ministry-level approval |
| Pegawai Penguatkuasa/Penyiasat | Manages complaints, cases, investigations, compounds |
| Pentadbir Sistem | Manages accounts, roles, CMS content, configuration, monitoring |

---

## 5. Common Module Features

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

---

## 6. Standard User Screens

Every service module includes these screens:

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

### Standard Sub-Modules

| Sub-Module | Functions |
|------------|-----------|
| Permohonan & Pemprosesan | New/renewal/termination applications |
| Semakan & Kelulusan | SOS review, technical review, LOA approval, committee (if applicable) |
| Bayaran & Hasil | Invoice/fee notice, payment gateway, receipt, revenue monitoring & reconciliation |
| Perakuan & Notifikasi | Digital certificate + QR + e-signature, email/inbox notifications |
| Pemantauan & Pematuhan | Expiry/guarantee/condition monitoring, auto reminders, compliance audit |
| Pelaporan & Statistik | Operational reports, AIRR statistics, dashboard, export |
| Pentadbiran & Konfigurasi | Reference tables (doc types, fees, payment days, notification text), RBAC |

---

## 7. Standard PFD Workflow Activities

Standard end-to-end application flow (`*-NA` = new application):

| Step | Activity ID Pattern | Actor | Description |
|------|-------------------|-------|-------------|
| 01 | `PFD-*-NA-01` | Pemohon | Fill form, upload documents (OCR/AI), declare accuracy, submit |
| 02 | `PFD-*-NA-02` | OK / Majikan | Select employer or confirm appointment (RG-KE/CE specific) |
| 03 | `PFD-*-NA-03` | Pemohon | Pay processing fee via FPX |
| 04 | `PFD-*-NA-04` | Pegawai SOS | Verify document completeness & validity |
| 05 | `PFD-*-NA-05` | Pemohon | Correct incomplete/incorrect info when queried |
| 06 | `PFD-*-NA-06` | Pegawai Teknikal | Technical compliance review |
| 07 | `PFD-*-NA-07` | Pegawai Pelulus | Approve/reject per LOA with audit trail |
| 08 | `PFD-*-NA-08` | Pemohon | Pay registration fee after approval |
| 09 | `PFD-*-NA-09` | Pemohon | Receive digital certificate; hash anchored on blockchain |
| 10 | `PFD-*-NA-10` | Pemohon | Receive rejection notice with reason |

---

## 8. Core Data Entities

| Entity | Key Attributes | Description |
|--------|----------------|-------------|
| PENGGUNA | id_pengguna (PK), no_kp/no_pendaftaran, nama, emel, no_telefon, jenis_pengguna, status_akaun | Registered individual/company account |
| AKAUN_PERANAN | id_peranan (PK), id_pengguna (FK), peranan, skop_akses (LOA) | RBAC role mapping |
| PERMOHONAN | id_permohonan (PK), id_pengguna (FK), kod_modul (FK), jenis, status, tarikh, masa_pemprosesan | Application transaction across modules |
| DOKUMEN_SOKONGAN | id_dokumen (PK), id_permohonan (FK), jenis, lokasi_fail, status_OCR, versi, tag | Supporting documents with OCR/AI validation |
| PEMBAYARAN | id_bayaran (PK), id_permohonan (FK), amaun, kaedah, no_resit, status | Payment transactions |
| PERAKUAN_DIGITAL | id_perakuan (PK), id_permohonan (FK), no_siri, kod_QR, tandatangan_digital, tarikh_luput | Digital certificate/permit |
| JEJAK_AUDIT | id_audit (PK), id_permohonan (FK), id_pengguna, tindakan, nilai_lama, nilai_baru, cap_masa | Audit trail |

### Data Flows

| ID | Flow | Description |
|----|------|-------------|
| AF-01 | Pemohon → P2 | Application form data, service type, applicant info |
| AF-02 | Pemohon → P3 | Supporting documents for OCR/AI validation |
| AF-03 | P4 → Payment Gateway | Payment request & status |
| AF-04 | P5 → P6 | Approval decision per LOA |
| AF-05 | P6 → Pemohon (Inbox) | Digital certificate + QR + digital signature |

---

## 9. Use Cases by Module

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

---

## 10. Transactions by Module

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

---

## 11. External Integrations

| System | Purpose | Used By |
|--------|---------|---------|
| ST Payment Gateway (FPX/CIMB) | Online fee payment | All modules |
| MyDigital ID (NACSA) | Identity / SSO | PE-ID, registration modules |
| JPN (ALIS) | Identity verification (alive/deceased) | RG-KE, RG-CE |
| SSM (MyDataSSM) | Company registration verification | LC-*, RG-CE/CG |
| TNB (MyTNB) | Utility data | LC-LE, LC-PE |
| CIDB | Contractor registration | RG-CE |
| Pos Digicert | e-Signature / digital signing | Approval & certificate issuance |
| Hyperledger Fabric (on-premise) | Blockchain anchoring of certificate hashes | Certificate issuance |

---

## 12. Non-Functional Requirements

| ID | Quality | Aspect | Requirement |
|----|---------|--------|-------------|
| NF-01 | Performance | System | Responsive; real-time processing for integrations & transactions |
| NF-02 | Scalability | System | Modular & flexible architecture; modules updatable without stability impact |
| NF-03 | Availability | System | Scheduled backup & recovery; DRC support |
| NF-04 | Security | System | Hardening, SSL, cyber controls against unauthorized access, malware & data leakage |
| NF-05 | Integrity & Validity | System | Digital signatures & certificates; OCR/AI doc validation; full audit trail |
| NF-06 | File Storage | System | Tagging/labeling; 7-year retention |
| NF-07 | Workflow | System | Workflow engine supporting LOA-based approval configuration |
| NF-08 | Usability | Internal | User-friendly, bilingual (BM/EN), dashboard & notifications |
| NF-09 | Access Control | Internal | RBAC, SSO, centralized ID management (PE-ID) |
| NF-10 | SLA Compliance | Internal | Critical: response ≤30 min / resolve ≤4 hours; 1-year warranty |
| NF-11 | Maintainability | Internal | Current software versions; OS RHEL; no EOL within 5 years |
| NF-12 | External Integration | External | Secure encrypted APIs to Payment Gateway, MyDigital ID, JPN, SSM, TNB, CIDB, Pos Digicert |
| NF-13 | Legal Compliance | External | Electricity Supply Act 1990, Gas Supply Act 1993, Energy Efficiency Act 2024 |
| NF-14 | Data Migration | External | Historical data + legacy BLOB migration safely with remapping |
| NF-15 | Tamper-Proof (Blockchain) | System | Hyperledger Fabric records certificate hashes & critical transactions; QR ↔ ledger verification |

---

## 13. System Size (Function Points)

| Function Type | Example Elements | Count | Weight | UFP |
|---------------|------------------|-------|--------|-----|
| External Inputs (EI) | Application forms, updates, payments | ~210 | 6 | 1,260 |
| External Outputs (EO) | Digital certificates, notices, reports | ~130 | 7 | 910 |
| External Inquiries (EQ) | Search, status check, display | ~120 | 6 | 720 |
| Internal Logical Files (ILF) | Core entities & module records | ~60 | 10 | 600 |
| External Interface Files (EIF) | External system interfaces (8 systems) | ~16 | 7 | 112 |

**Total UFP:** ~3,602 | **Adjusted range:** 3,200–4,000 Function Points

---

## 14. Module Specifications

> Detailed PFD activity definitions per module. See also [`SRS-Sistem-Digital-ST-full-text.md`](./SRS-Sistem-Digital-ST-full-text.md) for complete page-level text.

### Modul LC-LE

**Pelesenan Elektrik**

#### PDF Page 31

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

#### PDF Page 32

Rajah 11: Rajah Hubungan Entiti (ERD) — Modul LC-LE: Pelesenan Elektrik
Sub-Modul & Fungsian: 
Maklumat Antara Muka — Skrin Pengguna: 
•Skrin Log Masuk & Dashboard Pengguna
•Skrin Borang Permohonan
•Skrin Muat Naik & Pengesahan Dokumen (OCR/AI)
•Skrin Notis & Bayaran Fi
•Inbox & Notifikasi
•Skrin Semakan (SOS/Teknikal)
•Skrin Kelulusan (LOA)
•Paparan & Muat Turun Perakuan Digital (QR)
•Skrin Carian & Semakan Status
•Skrin Laporan & Statistik (AIRR)
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

#### PDF Page 33

Maklumat Antara Muka — Integrasi Sistem (API):
•ST Payment Gateway (FPX/CIMB)
•SSM (MyDataSSM)
•TNB (MyTNB)
•MyDigital ID (NACSA)
•Pos Digicert (e-Signature)
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

#### PDF Page 34

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

#### PDF Page 35

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

#### PDF Page 36

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

### Modul LC-PE

**Pepasangan Elektrik**

#### PDF Page 37

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

#### PDF Page 38

Rajah 15: Rajah Hubungan Entiti (ERD) — Modul LC-PE: Pepasangan Elektrik
Sub-Modul & Fungsian: 
Maklumat Antara Muka — Skrin Pengguna: 
•Skrin Log Masuk & Dashboard Pengguna
•Skrin Borang Permohonan
•Skrin Muat Naik & Pengesahan Dokumen (OCR/AI)
•Skrin Notis & Bayaran Fi
•Inbox & Notifikasi
•Skrin Semakan (SOS/Teknikal)
•Skrin Kelulusan (LOA)
•Paparan & Muat Turun Perakuan Digital (QR)
•Skrin Carian & Semakan Status
•Skrin Laporan & Statistik (AIRR)
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

#### PDF Page 39

Maklumat Antara Muka — Integrasi Sistem (API):
•ST Payment Gateway (FPX/CIMB)
•SSM (MyDataSSM)
•TNB (MyTNB)
•MyDigital ID (NACSA)
•Pos Digicert (e-Signature)
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

#### PDF Page 40

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

#### PDF Page 41

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

#### PDF Page 42

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

### Modul LC-LG

**Pelesenan Gas**

#### PDF Page 43

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

#### PDF Page 44

Rajah 19: Rajah Hubungan Entiti (ERD) — Modul LC-LG: Pelesenan Gas
Sub-Modul & Fungsian: 
Maklumat Antara Muka — Skrin Pengguna: 
•Skrin Log Masuk & Dashboard Pengguna
•Skrin Borang Permohonan
•Skrin Muat Naik & Pengesahan Dokumen (OCR/AI)
•Skrin Notis & Bayaran Fi
•Inbox & Notifikasi
•Skrin Semakan (SOS/Teknikal)
•Skrin Kelulusan (LOA)
•Paparan & Muat Turun Perakuan Digital (QR)
•Skrin Carian & Semakan Status
•Skrin Laporan & Statistik (AIRR)
Maklumat Antara Muka — Integrasi Sistem (API):
•ST Payment Gateway (FPX/CIMB)
•SSM (MyDataSSM)
•TNB (MyTNB)
•MyDigital ID (NACSA)
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

#### PDF Page 45

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

#### PDF Page 46

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

#### PDF Page 47

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

#### PDF Page 48

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

### Modul LC-PG

**Pepasangan Gas**

#### PDF Page 49

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

#### PDF Page 50

Rajah 23: Rajah Hubungan Entiti (ERD) — Modul LC-PG: Pepasangan Gas
Sub-Modul & Fungsian: 
Maklumat Antara Muka — Skrin Pengguna: 
•Skrin Log Masuk & Dashboard Pengguna
•Skrin Borang Permohonan
•Skrin Muat Naik & Pengesahan Dokumen (OCR/AI)
•Skrin Notis & Bayaran Fi
•Inbox & Notifikasi
•Skrin Semakan (SOS/Teknikal)
•Skrin Kelulusan (LOA)
•Paparan & Muat Turun Perakuan Digital (QR)
•Skrin Carian & Semakan Status
•Skrin Laporan & Statistik (AIRR)
Maklumat Antara Muka — Integrasi Sistem (API):
•ST Payment Gateway (FPX/CIMB)
•SSM (MyDataSSM)
•TNB (MyTNB)
•MyDigital ID (NACSA)
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

#### PDF Page 51

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

#### PDF Page 52

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

#### PDF Page 53

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

#### PDF Page 54

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

### Modul RG-KE

**Pendaftaran Orang Kompeten Elektrik**

#### PDF Page 55

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

#### PDF Page 56

Rajah 27: Rajah Hubungan Entiti (ERD) — Modul RG-KE: Pendaftaran Orang Kompeten Elektrik
Sub-Modul & Fungsian: 
Maklumat Antara Muka — Skrin Pengguna: 
•Skrin Log Masuk & Dashboard Pengguna
•Skrin Borang Permohonan
•Skrin Muat Naik & Pengesahan Dokumen (OCR/AI)
•Skrin Notis & Bayaran Fi
•Inbox & Notifikasi
•Skrin Semakan (SOS/Teknikal)
•Skrin Kelulusan (LOA)
•Paparan & Muat Turun Perakuan Digital (QR)
•Skrin Carian & Semakan Status
•Skrin Laporan & Statistik (AIRR)
Maklumat Antara Muka — Integrasi Sistem (API):
•ST Payment Gateway (FPX)
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

#### PDF Page 57

•JPN (ALIS)
•MyDigital ID (NACSA)
•Pos Digicert (e-Signature)
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

#### PDF Page 58

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

#### PDF Page 59

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

#### PDF Page 60

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

#### PDF Page 61

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

### Modul RG-KG

**Pendaftaran Orang Kompeten Gas**

#### PDF Page 62

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

#### PDF Page 63

Rajah 31: Rajah Hubungan Entiti (ERD) — Modul RG-KG: Pendaftaran Orang Kompeten Gas
Sub-Modul & Fungsian: 
Maklumat Antara Muka — Skrin Pengguna: 
•Skrin Log Masuk & Dashboard Pengguna
•Skrin Borang Permohonan
•Skrin Muat Naik & Pengesahan Dokumen (OCR/AI)
•Skrin Notis & Bayaran Fi
•Inbox & Notifikasi
•Skrin Semakan (SOS/Teknikal)
•Skrin Kelulusan (LOA)
•Paparan & Muat Turun Perakuan Digital (QR)
•Skrin Carian & Semakan Status
•Skrin Laporan & Statistik (AIRR)
Maklumat Antara Muka — Integrasi Sistem (API):
•ST Payment Gateway (FPX)
•JPN (ALIS)
•MyDigital ID (NACSA)
•Pos Digicert (e-Signature)
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

#### PDF Page 64

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

#### PDF Page 65

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

#### PDF Page 66

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

#### PDF Page 67

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

### Modul RG-CE

**Pendaftaran Kontraktor Elektrik**

#### PDF Page 68

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

#### PDF Page 69

Rajah 35: Rajah Hubungan Entiti (ERD) — Modul RG-CE: Pendaftaran Kontraktor Elektrik
Sub-Modul & Fungsian: 
Maklumat Antara Muka — Skrin Pengguna: 
•Skrin Log Masuk & Dashboard Pengguna
•Skrin Borang Permohonan
•Skrin Muat Naik & Pengesahan Dokumen (OCR/AI)
•Skrin Notis & Bayaran Fi
•Inbox & Notifikasi
•Skrin Semakan (SOS/Teknikal)
•Skrin Kelulusan (LOA)
•Paparan & Muat Turun Perakuan Digital (QR)
•Skrin Carian & Semakan Status
•Skrin Laporan & Statistik (AIRR)
Maklumat Antara Muka — Integrasi Sistem (API):
•ST Payment Gateway (FPX)
•SSM (MyDataSSM)
•CIDB (CIMS)
•JPN (ALIS)
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

#### PDF Page 70

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

#### PDF Page 71

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

#### PDF Page 72

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

#### PDF Page 73

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

#### PDF Page 74

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

### Modul RG-CG

**Pendaftaran Kontraktor Gas**

#### PDF Page 75

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

#### PDF Page 76

Rajah 39: Rajah Hubungan Entiti (ERD) — Modul RG-CG: Pendaftaran Kontraktor Gas
Sub-Modul & Fungsian: 
Maklumat Antara Muka — Skrin Pengguna: 
•Skrin Log Masuk & Dashboard Pengguna
•Skrin Borang Permohonan
•Skrin Muat Naik & Pengesahan Dokumen (OCR/AI)
•Skrin Notis & Bayaran Fi
•Inbox & Notifikasi
•Skrin Semakan (SOS/Teknikal)
•Skrin Kelulusan (LOA)
•Paparan & Muat Turun Perakuan Digital (QR)
•Skrin Carian & Semakan Status
•Skrin Laporan & Statistik (AIRR)
Maklumat Antara Muka — Integrasi Sistem (API):
•ST Payment Gateway (FPX)
•SSM (MyDataSSM)
•CIDB (CIMS)
•JPN (ALIS)
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

#### PDF Page 77

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

#### PDF Page 78

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

#### PDF Page 79

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

#### PDF Page 80

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

### Modul PE-ID

**Pengurusan ID & Akaun Pengguna**

#### PDF Page 81

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

#### PDF Page 82

Rajah 43: Rajah Hubungan Entiti (ERD) — Modul PE-ID: Pengurusan ID & Akaun Pengguna
Sub-Modul & Fungsian: 
Maklumat Antara Muka — Skrin Pengguna: 
•Skrin Log Masuk & Dashboard Pengguna
•Skrin Borang Permohonan
•Skrin Muat Naik & Pengesahan Dokumen (OCR/AI)
•Skrin Notis & Bayaran Fi
•Inbox & Notifikasi
•Skrin Semakan (SOS/Teknikal)
•Skrin Kelulusan (LOA)
•Paparan & Muat Turun Perakuan Digital (QR)
•Skrin Carian & Semakan Status
•Skrin Laporan & Statistik (AIRR)
Maklumat Antara Muka — Integrasi Sistem (API):
•MyDigital ID (NACSA)
•JPN (ALIS)
•SSM (MyDataSSM)
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

#### PDF Page 83

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

#### PDF Page 84

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

#### PDF Page 85

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

#### PDF Page 86

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

### Modul PE-RV

**Pengurusan Hasil**

#### PDF Page 87

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

#### PDF Page 88

Rajah 47: Rajah Hubungan Entiti (ERD) — Modul PE-RV: Pengurusan Hasil
Sub-Modul & Fungsian: 
Maklumat Antara Muka — Skrin Pengguna: 
•Skrin Log Masuk & Dashboard Pengguna
•Skrin Borang Permohonan
•Skrin Muat Naik & Pengesahan Dokumen (OCR/AI)
•Skrin Notis & Bayaran Fi
•Inbox & Notifikasi
•Skrin Semakan (SOS/Teknikal)
•Skrin Kelulusan (LOA)
•Paparan & Muat Turun Perakuan Digital (QR)
•Skrin Carian & Semakan Status
•Skrin Laporan & Statistik (AIRR)
Maklumat Antara Muka — Integrasi Sistem (API):
•ST Payment Gateway (FPX)
•CIMB H2H
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

#### PDF Page 89

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

#### PDF Page 90

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

#### PDF Page 91

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

#### PDF Page 92

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

### Modul PE-SV

**Lawatan Tapak / Pemeriksaan / Audit**

#### PDF Page 93

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

#### PDF Page 94

Rajah 51: Rajah Hubungan Entiti (ERD) — Modul PE-SV: Lawatan Tapak / Pemeriksaan / Audit
Sub-Modul & Fungsian: 
Maklumat Antara Muka — Skrin Pengguna: 
•Skrin Log Masuk & Dashboard Pengguna
•Skrin Borang Permohonan
•Skrin Muat Naik & Pengesahan Dokumen (OCR/AI)
•Skrin Notis & Bayaran Fi
•Inbox & Notifikasi
•Skrin Semakan (SOS/Teknikal)
•Skrin Kelulusan (LOA)
•Paparan & Muat Turun Perakuan Digital (QR)
•Skrin Carian & Semakan Status
•Skrin Laporan & Statistik (AIRR)
Maklumat Antara Muka — Integrasi Sistem (API):
•ST Payment Gateway (FPX)
•MyDigital ID (NACSA)
•Pos Digicert (e-Signature)
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

#### PDF Page 95

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

#### PDF Page 96

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

#### PDF Page 97

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

#### PDF Page 98

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

### Modul PE-JK

**Kelulusan Jawatankuasa**

#### PDF Page 99

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

#### PDF Page 100

Sub-Modul & Fungsian: 
Maklumat Antara Muka — Skrin Pengguna: 
•Skrin Log Masuk & Dashboard Pengguna
•Skrin Borang Permohonan
•Skrin Muat Naik & Pengesahan Dokumen (OCR/AI)
•Skrin Notis & Bayaran Fi
•Inbox & Notifikasi
•Skrin Semakan (SOS/Teknikal)
•Skrin Kelulusan (LOA)
•Paparan & Muat Turun Perakuan Digital (QR)
•Skrin Carian & Semakan Status
•Skrin Laporan & Statistik (AIRR)
Maklumat Antara Muka — Integrasi Sistem (API):
•ST Payment Gateway (FPX)
•MyDigital ID (NACSA)
•Pos Digicert (e-Signature)
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

#### PDF Page 101

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

#### PDF Page 102

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

#### PDF Page 103

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

#### PDF Page 104

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

### Modul CC-XE

**Peperiksaan Elektrik**

#### PDF Page 105

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

#### PDF Page 106

Rajah 59: Rajah Hubungan Entiti (ERD) — Modul CC-XE: Peperiksaan Elektrik
Sub-Modul & Fungsian: 
Maklumat Antara Muka — Skrin Pengguna: 
•Skrin Log Masuk & Dashboard Pengguna
•Skrin Borang Permohonan
•Skrin Muat Naik & Pengesahan Dokumen (OCR/AI)
•Skrin Notis & Bayaran Fi
•Inbox & Notifikasi
•Skrin Semakan (SOS/Teknikal)
•Skrin Kelulusan (LOA)
•Paparan & Muat Turun Perakuan Digital (QR)
•Skrin Carian & Semakan Status
•Skrin Laporan & Statistik (AIRR)
Maklumat Antara Muka — Integrasi Sistem (API):
•ST Payment Gateway (FPX)
•MyDigital ID (NACSA)
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

#### PDF Page 107

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

#### PDF Page 108

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

#### PDF Page 109

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

#### PDF Page 110

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

### Modul CC-XG

**Peperiksaan Gas**

#### PDF Page 111

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

#### PDF Page 112

Rajah 63: Rajah Hubungan Entiti (ERD) — Modul CC-XG: Peperiksaan Gas
Sub-Modul & Fungsian: 
Maklumat Antara Muka — Skrin Pengguna: 
•Skrin Log Masuk & Dashboard Pengguna
•Skrin Borang Permohonan
•Skrin Muat Naik & Pengesahan Dokumen (OCR/AI)
•Skrin Notis & Bayaran Fi
•Inbox & Notifikasi
•Skrin Semakan (SOS/Teknikal)
•Skrin Kelulusan (LOA)
•Paparan & Muat Turun Perakuan Digital (QR)
•Skrin Carian & Semakan Status
•Skrin Laporan & Statistik (AIRR)
Maklumat Antara Muka — Integrasi Sistem (API):
•ST Payment Gateway (FPX)
•MyDigital ID (NACSA)
•Pos Digicert (e-Signature)
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

#### PDF Page 113

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

#### PDF Page 114

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

#### PDF Page 115

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

#### PDF Page 116

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

### Modul CC-CD

**Pembangunan Berterusan (CPD)**

#### PDF Page 117

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

#### PDF Page 118

Sub-Modul & Fungsian: 
Maklumat Antara Muka — Skrin Pengguna: 
•Skrin Log Masuk & Dashboard Pengguna
•Skrin Borang Permohonan
•Skrin Muat Naik & Pengesahan Dokumen (OCR/AI)
•Skrin Notis & Bayaran Fi
•Inbox & Notifikasi
•Skrin Semakan (SOS/Teknikal)
•Skrin Kelulusan (LOA)
•Paparan & Muat Turun Perakuan Digital (QR)
•Skrin Carian & Semakan Status
•Skrin Laporan & Statistik (AIRR)
Maklumat Antara Muka — Integrasi Sistem (API):
•ST Payment Gateway (FPX)
•MyDigital ID (NACSA)
•Pos Digicert (e-Signature)
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

#### PDF Page 119

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

#### PDF Page 120

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

#### PDF Page 121

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

#### PDF Page 122

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

### Modul EE-KT

**Kecekapan Tenaga**

#### PDF Page 123

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

#### PDF Page 124

Rajah 71: Rajah Hubungan Entiti (ERD) — Modul EE-KT: Kecekapan Tenaga
Sub-Modul & Fungsian: 
Maklumat Antara Muka — Skrin Pengguna: 
•Skrin Log Masuk & Dashboard Pengguna
•Skrin Borang Permohonan
•Skrin Muat Naik & Pengesahan Dokumen (OCR/AI)
•Skrin Notis & Bayaran Fi
•Inbox & Notifikasi
•Skrin Semakan (SOS/Teknikal)
•Skrin Kelulusan (LOA)
•Paparan & Muat Turun Perakuan Digital (QR)
•Skrin Carian & Semakan Status
•Skrin Laporan & Statistik (AIRR)
Maklumat Antara Muka — Integrasi Sistem (API):
•ST Payment Gateway (FPX)
•MyDigital ID (NACSA)
•Pos Digicert (e-Signature)
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

#### PDF Page 125

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

#### PDF Page 126

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

#### PDF Page 127

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

#### PDF Page 128

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

### Modul EN-IV

**Penguatkuasaan & Penyiasatan**

#### PDF Page 129

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

#### PDF Page 130

Rajah 75: Rajah Hubungan Entiti (ERD) — Modul EN-IV: Penguatkuasaan & Penyiasatan
Sub-Modul & Fungsian: 
Maklumat Antara Muka — Skrin Pengguna: 
•Skrin Log Masuk & Dashboard Pengguna
•Skrin Borang Permohonan
•Skrin Muat Naik & Pengesahan Dokumen (OCR/AI)
•Skrin Notis & Bayaran Fi
•Inbox & Notifikasi
•Skrin Semakan (SOS/Teknikal)
•Skrin Kelulusan (LOA)
•Paparan & Muat Turun Perakuan Digital (QR)
•Skrin Carian & Semakan Status
•Skrin Laporan & Statistik (AIRR)
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

#### PDF Page 131

Maklumat Antara Muka — Integrasi Sistem (API):
•ST Payment Gateway (FPX)
•MyDigital ID (NACSA)
•Pos Digicert (e-Signature)
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

#### PDF Page 132

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

#### PDF Page 133

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

#### PDF Page 134

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

#### PDF Page 135

8.2 Matriks Keterunutan Keperluan Fungsian 
Jadual 10: Matriks Keterunutan Keperluan Fungsian
8.3 Rujukan Perundangan 
•Akta Bekalan Elektrik 1990 (Akta 447) & Peraturan-Peraturan Elektrik
•Akta Bekalan Gas 1993 (Akta 501) & Peraturan Bekalan Gas 1997
•Akta Kecekapan dan Konservasi Tenaga 2024
•Peraturan & Limits of Authority (LOA) ST yang berkuat kuasa
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

---

## 15. Legal References

- Akta Bekalan Elektrik 1990 (Akta 447) & Peraturan berkaitan
- Akta Bekalan Gas 1993 (Akta 501) & Peraturan berkaitan
- Akta Kecekapan dan Konservasi Tenaga 2024

---

## 16. Glossary & Acronyms

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
