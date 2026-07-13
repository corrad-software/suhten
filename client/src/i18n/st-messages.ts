import type { DisplayLanguage } from "@/types";

export type StMessageKey =
  // Common
  | "st.common.refNo"
  | "st.common.applicant"
  | "st.common.type"
  | "st.common.date"
  | "st.common.status"
  | "st.common.action"
  | "st.common.view"
  | "st.common.open"
  | "st.common.search"
  | "st.common.filterAll"
  | "st.common.noResults"
  | "st.common.mockNote"
  | "st.common.officer"
  | "st.common.employer"
  | "st.common.category"
  | "st.common.class"
  | "st.common.fee"
  | "st.common.cdp"
  | "st.common.identity"
  | "st.common.certificate"
  | "st.common.expires"
  | "st.common.module"
  | "st.common.submitted"
  | "st.common.takeOpen"
  | "st.common.limitFull"
  | "st.common.activeTasks"
  | "st.common.fifo"
  // Inbox
  | "st.inbox.title"
  | "st.inbox.subtitle"
  | "st.inbox.charterHours"
  | "st.inbox.charterDays"
  | "st.inbox.tabNew"
  | "st.inbox.tabQuery"
  | "st.inbox.tabDone"
  | "st.inbox.empty"
  | "st.inbox.slaGreen"
  | "st.inbox.slaYellow"
  | "st.inbox.slaRed"
  | "st.inbox.fifoHint"
  | "st.inbox.selected"
  | "st.inbox.bulkApprove"
  | "st.inbox.bulkTitle"
  | "st.inbox.bulkMsg"
  | "st.inbox.continue"
  // Notifications
  | "st.notif.title"
  | "st.notif.unread"
  | "st.notif.markAll"
  | "st.notif.empty"
  // Search
  | "st.search.title"
  | "st.search.subtitle"
  | "st.search.placeholder"
  | "st.search.hint"
  | "st.search.results"
  | "st.search.applications"
  | "st.search.registrations"
  | "st.search.noHit"
  | "st.search.kindApp"
  | "st.search.kindReg"
  | "st.search.quickTitle"
  | "st.search.quick1"
  | "st.search.quick2"
  | "st.search.quick3"
  // Registration shared
  | "st.reg.applications"
  | "st.reg.review"
  | "st.reg.compliance"
  | "st.reg.reports"
  | "st.reg.subtitleOk"
  | "st.reg.subtitleContractor"
  | "st.reg.statTotal"
  | "st.reg.statInProgress"
  | "st.reg.statQuery"
  | "st.reg.statIssued"
  | "st.reg.newApplication"
  | "st.reg.filterStatus"
  | "st.reg.filterType"
  | "st.reg.emptyApps"
  | "st.reg.reviewTitle"
  | "st.reg.reviewSubtitle"
  | "st.reg.reviewEmpty"
  | "st.reg.complianceTitle"
  | "st.reg.complianceSubtitle"
  | "st.reg.complianceActive"
  | "st.reg.complianceExpiring"
  | "st.reg.complianceExpired"
  | "st.reg.complianceSuspended"
  | "st.reg.reportsTitle"
  | "st.reg.reportsSubtitle"
  | "st.reg.reportByType"
  | "st.reg.reportByStatus"
  | "st.reg.reportSla"
  | "st.reg.reportVolume"
  | "st.reg.processTypes"
  | "st.reg.guidedTitle"
  | "st.reg.guidedBody"
  | "st.reg.eligibility"
  | "st.reg.docChecklist"
  | "st.reg.startMock"
  // App types
  | "st.appType.new_registration"
  | "st.appType.renewal"
  | "st.appType.termination"
  | "st.appType.multi_employer"
  | "st.appType.class_change"
  | "st.appType.ok_appointment"
  | "st.appType.ok_termination"
  | "st.appType.employer_registration"
  | "st.appType.enforcement_cancellation"
  // Compliance
  | "st.compliance.active"
  | "st.compliance.expiring_soon"
  | "st.compliance.expired"
  | "st.compliance.suspended"
  // Status
  | "st.status.draft"
  | "st.status.awaiting_employer_confirm"
  | "st.status.awaiting_processing_payment"
  | "st.status.sos_review"
  | "st.status.query_applicant"
  | "st.status.technical_review"
  | "st.status.pending_approval"
  | "st.status.awaiting_registration_payment"
  | "st.status.certificate_issued"
  | "st.status.rejected"
  | "st.status.withdrawn"
  // Module titles
  | "st.mod.RG-KE"
  | "st.mod.RG-KG"
  | "st.mod.RG-CE"
  | "st.mod.RG-CG"
  | "st.mod.RG-KE.short"
  | "st.mod.RG-KG.short"
  | "st.mod.RG-CE.short"
  | "st.mod.RG-CG.short"
  | "st.mod.LC-LE"
  | "st.mod.LC-PE"
  | "st.mod.LC-LG"
  | "st.mod.LC-PG"
  | "st.mod.CC-XE"
  | "st.mod.CC-XG"
  | "st.mod.CC-CD"
  | "st.mod.EE-KT"
  | "st.mod.EN-IV"
  | "st.mod.PE-ID"
  | "st.mod.PE-RV"
  | "st.mod.PE-SV"
  | "st.mod.PE-JK"
  // Workspace (non-registration menus)
  | "st.ws.phase2"
  | "st.ws.guidedBody"
  | "st.ws.dismiss"
  | "st.ws.nextSteps"
  | "st.ws.stepEligibility"
  | "st.ws.stepDocs"
  | "st.ws.stepPay"
  | "st.ws.stepReview"
  | "st.ws.workspace"
  | "st.ws.publicUsers"
  | "st.ws.staffUsers"
  | "st.ws.organisations"
  | "st.ws.access"
  | "st.ws.payments"
  | "st.ws.reconciliation"
  | "st.ws.revenueReports"
  | "st.ws.schedule"
  | "st.ws.inspections"
  | "st.ws.visitReports"
  | "st.ws.jkQueue"
  | "st.ws.jkDecisions"
  | "st.ws.lastLogin"
  | "st.ws.orgName"
  | "st.ws.accessMatrix"
  | "st.ws.accessBody"
  | "st.ws.accessRequests"
  | "st.ws.collected"
  | "st.ws.pendingPay"
  | "st.ws.failedPay"
  | "st.ws.receipt"
  | "st.ws.reconTitle"
  | "st.ws.reconBody"
  | "st.ws.fpxTotal"
  | "st.ws.ledgerTotal"
  | "st.ws.variance"
  | "st.ws.byModule"
  | "st.ws.scheduled"
  | "st.ws.inProgress"
  | "st.ws.completed"
  | "st.ws.site"
  | "st.ws.agenda"
  | "st.ws.meeting"
  | "st.ws.airr"
  | "st.ws.sla"
  | "st.ws.export"
  | "st.ws.auditTrail"
  | "st.ws.analyticsSubtitle"
  | "st.ws.vsPrev"
  | "st.ws.airrNote"
  | "st.ws.airrBody"
  | "st.ws.distribution"
  | "st.ws.exportApps"
  | "st.ws.exportPayments"
  | "st.ws.exportSla"
  | "st.ws.exportAudit"
  | "st.ws.exportAirr"
  | "st.ws.exportCompliance"
  | "st.ws.exportDemo"
  | "st.ws.actor"
  | "st.ws.action"
  | "st.ws.adminRef"
  | "st.ws.adminFees"
  | "st.ws.adminNotif"
  | "st.ws.adminWorkflow"
  | "st.ws.adminRoles"
  | "st.ws.adminPerms"
  | "st.ws.adminAudit"
  | "st.ws.adminIntegrations"
  | "st.ws.adminSubtitle"
  | "st.ws.tableName"
  | "st.ws.rows"
  | "st.ws.updated"
  | "st.ws.feeItem"
  | "st.ws.template"
  | "st.ws.channel"
  | "st.ws.stage"
  | "st.ws.role"
  | "st.ws.users"
  | "st.ws.scope"
  | "st.ws.permsNote"
  | "st.ws.lastSync"
  | "st.wsProc.new_licence"
  | "st.wsProc.renewal"
  | "st.wsProc.amendment"
  | "st.wsProc.installation_approval"
  | "st.wsProc.completion_inspection"
  | "st.wsProc.exam_registration"
  | "st.wsProc.exam_result"
  | "st.wsProc.programme_approval"
  | "st.wsProc.efficiency_report"
  | "st.wsProc.investigation"
  // OK Electric apply wizard
  | "st.okApply.title"
  | "st.okApply.subtitle"
  | "st.okApply.stepProfile"
  | "st.okApply.stepCompetency"
  | "st.okApply.stepEmployer"
  | "st.okApply.stepDocs"
  | "st.okApply.stepReview"
  | "st.okApply.fullName"
  | "st.okApply.ic"
  | "st.okApply.dob"
  | "st.okApply.age"
  | "st.okApply.gender"
  | "st.okApply.genderMale"
  | "st.okApply.genderFemale"
  | "st.okApply.phone"
  | "st.okApply.email"
  | "st.okApply.address"
  | "st.okApply.prefillNote"
  | "st.okApply.certNo"
  | "st.okApply.voltage"
  | "st.okApply.place"
  | "st.okApply.period"
  | "st.okApply.periodYear"
  | "st.okApply.periodHint"
  | "st.okApply.oshRequired"
  | "st.okApply.oshDownload"
  | "st.okApply.oshUpload"
  | "st.okApply.oshDone"
  | "st.okApply.employerCat"
  | "st.okApply.company"
  | "st.okApply.selfEmployed"
  | "st.okApply.selfEmployedHint"
  | "st.okApply.selfEmployedBlocked"
  | "st.okApply.searchEmployer"
  | "st.okApply.cdpBonus"
  | "st.okApply.eligibilityOk"
  | "st.okApply.eligibilityFailCert"
  | "st.okApply.eligibilityFailSuspend"
  | "st.okApply.decl1"
  | "st.okApply.decl2"
  | "st.okApply.decl3"
  | "st.okApply.pin"
  | "st.okApply.pinHint"
  | "st.okApply.next"
  | "st.okApply.back"
  | "st.okApply.submit"
  | "st.okApply.incomplete"
  | "st.okApply.submitted"
  | "st.okApply.draftSaved"
  | "st.okApply.saveDraft"
  | "st.okDetail.title"
  | "st.okDetail.timeline"
  | "st.okDetail.documents"
  | "st.okDetail.backList"
  | "st.common.years"
  | "st.common.next"
  | "st.common.back"
  | "st.common.submit"
  // RG-CE apply wizard
  | "st.ceApply.title"
  | "st.ceApply.subtitle"
  | "st.ceApply.stepA"
  | "st.ceApply.stepB"
  | "st.ceApply.stepC"
  | "st.ceApply.stepD"
  | "st.ceApply.stepEF"
  | "st.ceApply.stepG"
  | "st.ceApply.kind"
  | "st.ceApply.class"
  | "st.ceApply.voltage"
  | "st.ceApply.period"
  | "st.ceApply.repName"
  | "st.ceApply.repIc"
  | "st.ceApply.companyName"
  | "st.ceApply.companyReg"
  | "st.ceApply.companyAddress"
  | "st.ceApply.postcode"
  | "st.ceApply.city"
  | "st.ceApply.state"
  | "st.ceApply.companyEmail"
  | "st.ceApply.companyPhone"
  | "st.ceApply.companyFax"
  | "st.ceApply.directors"
  | "st.ceApply.addDirector"
  | "st.ceApply.sharePercent"
  | "st.ceApply.searchOk"
  | "st.ceApply.okPeriod"
  | "st.ceApply.okBlocked"
  | "st.ceApply.skilled"
  | "st.ceApply.addSkilled"
  | "st.ceApply.qualification"
  | "st.ceApply.field"
  | "st.ceApply.engineers"
  | "st.ceApply.addEngineer"
  | "st.ceApply.engReg"
  | "st.ceApply.equipment"
  | "st.ceApply.addEquip"
  | "st.ceApply.equipType"
  | "st.ceApply.serial"
  | "st.ceApply.brand"
  | "st.ceApply.model"
  | "st.ceApply.confirmTitle"
  | "st.ceApply.docsTitle"
  | "st.ceApply.classReq"
  | "st.ceApply.submitted"
  | "st.ceApply.remove"
  | "st.ceDetail.title"
  | "st.ceDetail.backList";

const BM: Record<StMessageKey, string> = {
  "st.common.refNo": "No. Rujukan",
  "st.common.applicant": "Pemohon",
  "st.common.type": "Jenis",
  "st.common.date": "Tarikh",
  "st.common.status": "Status",
  "st.common.action": "Tindakan",
  "st.common.view": "Lihat",
  "st.common.open": "Buka",
  "st.common.search": "Cari",
  "st.common.filterAll": "Semua",
  "st.common.noResults": "Tiada rekod dijumpai.",
  "st.common.mockNote": "Data contoh untuk prototaip Fasa 2 — belum disambung ke API.",
  "st.common.officer": "Pegawai",
  "st.common.employer": "Majikan",
  "st.common.category": "Kategori",
  "st.common.class": "Kelas",
  "st.common.fee": "Fi (RM)",
  "st.common.cdp": "Mata CDP",
  "st.common.identity": "No. Pengenalan",
  "st.common.certificate": "No. Perakuan",
  "st.common.expires": "Tamat Tempoh",
  "st.common.module": "Modul",
  "st.common.submitted": "Dihantar",
  "st.common.takeOpen": "Ambil & Buka",
  "st.common.limitFull": "Had penuh",
  "st.common.activeTasks": "Tugasan aktif",
  "st.common.fifo": "Giliran FIFO",

  "st.inbox.title": "Peti Tugasan",
  "st.inbox.subtitle": "Giliran kerja mengikut peranan dan piagam pelanggan",
  "st.inbox.charterHours": "Piagam Pelanggan: {n} jam setiap permohonan",
  "st.inbox.charterDays": "Piagam Pelanggan: {n} hari setiap permohonan",
  "st.inbox.tabNew": "Baharu",
  "st.inbox.tabQuery": "Pertanyaan",
  "st.inbox.tabDone": "Selesai",
  "st.inbox.empty": "Tiada tugasan dalam tab ini.",
  "st.inbox.slaGreen": "Dalam tempoh",
  "st.inbox.slaYellow": "Hampir tamat",
  "st.inbox.slaRed": "Melebihi tempoh",
  "st.inbox.fifoHint": "Giliran disusun FIFO · Had 3 tugasan aktif",
  "st.inbox.selected": "{n} permohonan dipilih",
  "st.inbox.bulkApprove": "Lulus & Tandatangan Pukal",
  "st.inbox.bulkTitle": "Lulus & tandatangan secara pukal?",
  "st.inbox.bulkMsg": "{n} permohonan akan diluluskan dan ditandatangani secara digital dengan satu PIN.",
  "st.inbox.continue": "Teruskan",

  "st.notif.title": "Notifikasi",
  "st.notif.unread": "{n} belum dibaca",
  "st.notif.markAll": "Tanda semua dibaca",
  "st.notif.empty": "Tiada notifikasi buat masa ini.",

  "st.search.title": "Carian & Semakan Status",
  "st.search.subtitle": "Cari permohonan atau perakuan berdaftar merentas modul Pendaftaran",
  "st.search.placeholder": "No. rujukan, nama, MyKad, SSM, atau no. perakuan…",
  "st.search.hint": "Contoh: ST/RG-KE/2026/00041 · Ahmad · 850101 · Elektro Prima",
  "st.search.results": "Hasil carian",
  "st.search.applications": "Permohonan",
  "st.search.registrations": "Pendaftaran aktif",
  "st.search.noHit": "Tiada padanan. Cuba no. rujukan penuh atau sebahagian nama.",
  "st.search.kindApp": "Permohonan",
  "st.search.kindReg": "Berdaftar",
  "st.search.quickTitle": "Carian pantas (contoh)",
  "st.search.quick1": "Ahmad bin Ismail",
  "st.search.quick2": "ST/RG-CE/2026",
  "st.search.quick3": "GasLink",

  "st.reg.applications": "Permohonan",
  "st.reg.review": "Semakan & Kelulusan",
  "st.reg.compliance": "Pemantauan & Pematuhan",
  "st.reg.reports": "Laporan Modul",
  "st.reg.subtitleOk": "Pendaftaran Orang Kompeten — aliran digital berpandu",
  "st.reg.subtitleContractor": "Pendaftaran Kontraktor — kelas, pelantikan OK & pembaharuan",
  "st.reg.statTotal": "Jumlah",
  "st.reg.statInProgress": "Dalam proses",
  "st.reg.statQuery": "Pertanyaan",
  "st.reg.statIssued": "Sijil dikeluarkan",
  "st.reg.newApplication": "Permohonan Baharu",
  "st.reg.filterStatus": "Status",
  "st.reg.filterType": "Jenis permohonan",
  "st.reg.emptyApps": "Tiada permohonan untuk penapis ini.",
  "st.reg.reviewTitle": "Giliran semakan",
  "st.reg.reviewSubtitle": "Tugasan menunggu tindakan pegawai bagi modul ini",
  "st.reg.reviewEmpty": "Tiada item menunggu semakan.",
  "st.reg.complianceTitle": "Pemantauan pendaftaran",
  "st.reg.complianceSubtitle": "Status perakuan, tempoh sah & mata CDP",
  "st.reg.complianceActive": "Aktif",
  "st.reg.complianceExpiring": "Akan tamat",
  "st.reg.complianceExpired": "Tamat tempoh",
  "st.reg.complianceSuspended": "Digantung",
  "st.reg.reportsTitle": "Laporan operasi modul",
  "st.reg.reportsSubtitle": "Ringkasan volum, status dan prestasi SLA (data contoh)",
  "st.reg.reportByType": "Mengikut jenis permohonan",
  "st.reg.reportByStatus": "Mengikut status",
  "st.reg.reportSla": "Prestasi SLA (giliran semasa)",
  "st.reg.reportVolume": "Volum 30 hari",
  "st.reg.processTypes": "Jenis proses disokong",
  "st.reg.guidedTitle": "Aliran permohonan berpandu",
  "st.reg.guidedBody": "Bukan salinan borang kertas — langkah jelas, semakan kelayakan automatik, muat naik dokumen, pengesahan majikan/OK dalam talian, dan bayaran FPX.",
  "st.reg.eligibility": "Kelayakan",
  "st.reg.docChecklist": "Dokumen sokongan",
  "st.reg.startMock": "Mula (prototaip)",

  "st.appType.new_registration": "Pendaftaran Baharu",
  "st.appType.renewal": "Pembaharuan",
  "st.appType.termination": "Penamatan",
  "st.appType.multi_employer": "Lebih Dari Satu Majikan",
  "st.appType.class_change": "Perubahan Kelas",
  "st.appType.ok_appointment": "Pelantikan Orang Kompeten",
  "st.appType.ok_termination": "Penamatan Pelantikan OK",
  "st.appType.employer_registration": "Pendaftaran oleh Majikan",
  "st.appType.enforcement_cancellation": "Pembatalan (Penguatkuasaan)",

  "st.compliance.active": "Aktif",
  "st.compliance.expiring_soon": "Akan tamat",
  "st.compliance.expired": "Tamat tempoh",
  "st.compliance.suspended": "Digantung",

  "st.status.draft": "Draf",
  "st.status.awaiting_employer_confirm": "Menunggu Pengesahan Lantikan",
  "st.status.awaiting_processing_payment": "Menunggu Bayaran Pemprosesan",
  "st.status.sos_review": "Semakan SOS",
  "st.status.query_applicant": "Pertanyaan Pemohon",
  "st.status.technical_review": "Semakan Teknikal",
  "st.status.pending_approval": "Menunggu Kelulusan",
  "st.status.awaiting_registration_payment": "Menunggu Bayaran Pendaftaran",
  "st.status.certificate_issued": "Sijil Dikeluarkan",
  "st.status.rejected": "Ditolak",
  "st.status.withdrawn": "Ditarik Balik",

  "st.mod.RG-KE": "OK Elektrik",
  "st.mod.RG-KG": "OK Gas",
  "st.mod.RG-CE": "Kontraktor Elektrik",
  "st.mod.RG-CG": "Kontraktor Gas",
  "st.mod.RG-KE.short": "OK-E",
  "st.mod.RG-KG.short": "OK-G",
  "st.mod.RG-CE.short": "KE",
  "st.mod.RG-CG.short": "KG",

  "st.okApply.title": "Permohonan Pendaftaran OK Elektrik",
  "st.okApply.subtitle": "Aliran berpandu RG-KE — bukan salinan borang kertas",
  "st.okApply.stepProfile": "Profil",
  "st.okApply.stepCompetency": "Kekompetenan",
  "st.okApply.stepEmployer": "Majikan",
  "st.okApply.stepDocs": "Dokumen",
  "st.okApply.stepReview": "Semakan",
  "st.okApply.fullName": "Nama penuh",
  "st.okApply.ic": "No. MyKad",
  "st.okApply.dob": "Tarikh lahir",
  "st.okApply.age": "Umur",
  "st.okApply.gender": "Jantina",
  "st.okApply.genderMale": "Lelaki",
  "st.okApply.genderFemale": "Perempuan",
  "st.okApply.phone": "Telefon",
  "st.okApply.email": "E-mel",
  "st.okApply.address": "Alamat",
  "st.okApply.prefillNote": "Dipraisi dari profil akaun Sistem Digital ST (PE-ID).",
  "st.okApply.certNo": "No. Perakuan Kekompetenan",
  "st.okApply.voltage": "Sekatan voltan",
  "st.okApply.place": "Sekatan tempat",
  "st.okApply.period": "Tempoh pendaftaran",
  "st.okApply.periodYear": "{n} tahun",
  "st.okApply.periodHint": "Tempoh maksimum mengikut umur & kategori: {n} tahun",
  "st.okApply.oshRequired": "Laporan OSH diperlukan (melebihi had umur). Muat turun templat, dapatkan pengesahan pengamal perubatan, kemudian muat naik semula.",
  "st.okApply.oshDownload": "Muat turun templat OSH",
  "st.okApply.oshUpload": "Muat naik laporan OSH ditandatangani",
  "st.okApply.oshDone": "Laporan OSH dimuat naik",
  "st.okApply.employerCat": "Kategori majikan",
  "st.okApply.company": "Syarikat",
  "st.okApply.selfEmployed": "Bekerja sendiri",
  "st.okApply.selfEmployedHint": "Hanya untuk JPE, JEK atau PE.",
  "st.okApply.selfEmployedBlocked": "Kategori kekompetenan ini tidak dibenarkan bekerja sendiri.",
  "st.okApply.searchEmployer": "Cari nama syarikat majikan…",
  "st.okApply.cdpBonus": "Mata bonus CDP untuk pendaftaran kali pertama akan dijana selepas kelulusan (contoh: +{n}).",
  "st.okApply.eligibilityOk": "Kelayakan dipenuhi — perakuan aktif & tidak digantung.",
  "st.okApply.eligibilityFailCert": "Perakuan kekompetenan mesti aktif untuk membuat permohonan.",
  "st.okApply.eligibilityFailSuspend": "Perakuan digantung — permohonan tidak dibenarkan.",
  "st.okApply.decl1": "Saya mengaku semua maklumat dalam permohonan ini adalah benar dan tepat.",
  "st.okApply.decl2": "Saya bersetuju mematuhi syarat pendaftaran Suruhanjaya Tenaga.",
  "st.okApply.decl3": "Saya faham pelanggaran Akta Bekalan Elektrik 1990 [Akta 447] boleh membawa akibat undang-undang.",
  "st.okApply.pin": "PIN keselamatan",
  "st.okApply.pinHint": "PIN demo: {n}",
  "st.okApply.next": "Seterusnya",
  "st.okApply.back": "Kembali",
  "st.okApply.submit": "Hantar permohonan",
  "st.okApply.incomplete": "Sila lengkapkan medan wajib sebelum meneruskan.",
  "st.okApply.submitted": "Permohonan dihantar. Rujukan: {n}",
  "st.okApply.draftSaved": "Draf disimpan pada peranti ini (auto-simpan).",
  "st.okApply.saveDraft": "Simpan draf",
  "st.okDetail.title": "Butiran permohonan",
  "st.okDetail.timeline": "Jejak proses",
  "st.okDetail.documents": "Dokumen sokongan",
  "st.okDetail.backList": "Kembali ke senarai",
  "st.common.years": "tahun",
  "st.common.next": "Seterusnya",
  "st.common.back": "Kembali",
  "st.common.submit": "Hantar",

  "st.ceApply.title": "Permohonan Pendaftaran Kontraktor Elektrik",
  "st.ceApply.subtitle": "Aliran berpandu RG-CE — semua medan Bahagian A–G, UI baharu",
  "st.ceApply.stepA": "Jenis & Kelas",
  "st.ceApply.stepB": "Syarikat",
  "st.ceApply.stepC": "Personel",
  "st.ceApply.stepD": "Peralatan",
  "st.ceApply.stepEF": "Semakan & Dokumen",
  "st.ceApply.stepG": "Pengakuan",
  "st.ceApply.kind": "Jenis kontraktor",
  "st.ceApply.class": "Kategori / Kelas",
  "st.ceApply.voltage": "Voltan",
  "st.ceApply.period": "Tempoh pendaftaran",
  "st.ceApply.repName": "Nama wakil syarikat",
  "st.ceApply.repIc": "No. MyKad wakil",
  "st.ceApply.companyName": "Nama syarikat",
  "st.ceApply.companyReg": "No. pendaftaran syarikat (SSM)",
  "st.ceApply.companyAddress": "Alamat syarikat / premis",
  "st.ceApply.postcode": "Poskod",
  "st.ceApply.city": "Bandar",
  "st.ceApply.state": "Negeri",
  "st.ceApply.companyEmail": "Emel syarikat",
  "st.ceApply.companyPhone": "No. telefon syarikat",
  "st.ceApply.companyFax": "No. faksimili",
  "st.ceApply.directors": "Ahli lembaga pengarah / pemegang saham",
  "st.ceApply.addDirector": "Tambah pengarah / pemegang saham",
  "st.ceApply.sharePercent": "Milikan (%)",
  "st.ceApply.searchOk": "Cari No. MyKad, No. Perakuan atau nama…",
  "st.ceApply.okPeriod": "Tempoh OK (tahun)",
  "st.ceApply.okBlocked": "OK ini telah / sedang berkhidmat di syarikat lain — tidak boleh dilantik.",
  "st.ceApply.skilled": "Orang berkemahiran (Pembaikan Elektrik)",
  "st.ceApply.addSkilled": "Tambah orang berkemahiran",
  "st.ceApply.qualification": "Kelayakan",
  "st.ceApply.field": "Bidang",
  "st.ceApply.engineers": "Jurutera profesional (Pengilang Papan Suis)",
  "st.ceApply.addEngineer": "Tambah jurutera profesional",
  "st.ceApply.engReg": "No. pendaftaran jurutera",
  "st.ceApply.equipment": "Peralatan menguji",
  "st.ceApply.addEquip": "Tambah peralatan",
  "st.ceApply.equipType": "Peralatan menguji",
  "st.ceApply.serial": "No. siri",
  "st.ceApply.brand": "Jenama",
  "st.ceApply.model": "Model",
  "st.ceApply.confirmTitle": "Pengesahan / senarai semak",
  "st.ceApply.docsTitle": "Foto / dokumen sokongan",
  "st.ceApply.classReq": "Syarat minima kelas",
  "st.ceApply.submitted": "Permohonan dihantar. Rujukan: {n}",
  "st.ceApply.remove": "Buang",
  "st.ceDetail.title": "Butiran permohonan kontraktor",
  "st.ceDetail.backList": "Kembali ke senarai",

  "st.mod.LC-LE": "Pelesenan Elektrik",
  "st.mod.LC-PE": "Pepasangan Elektrik",
  "st.mod.LC-LG": "Pelesenan Gas",
  "st.mod.LC-PG": "Pepasangan Gas",
  "st.mod.CC-XE": "Peperiksaan Elektrik",
  "st.mod.CC-XG": "Peperiksaan Gas",
  "st.mod.CC-CD": "Pembangunan Berterusan (CPD)",
  "st.mod.EE-KT": "Kecekapan Tenaga",
  "st.mod.EN-IV": "Penguatkuasaan & Penyiasatan",
  "st.mod.PE-ID": "Pengurusan ID & Akaun",
  "st.mod.PE-RV": "Pengurusan Hasil",
  "st.mod.PE-SV": "Lawatan Tapak / Pemeriksaan",
  "st.mod.PE-JK": "Kelulusan Jawatankuasa",

  "st.ws.phase2": "Fasa 2",
  "st.ws.guidedBody": "Ruang kerja modul — senarai, semakan, pematuhan & laporan dengan data contoh. Wizard domain penuh akan menyusul mengikut keutamaan SRS.",
  "st.ws.dismiss": "Tutup",
  "st.ws.nextSteps": "Langkah tipikal",
  "st.ws.stepEligibility": "Semakan kelayakan & dokumen",
  "st.ws.stepDocs": "Muat naik sokongan",
  "st.ws.stepPay": "Bayaran FPX (jika berkenaan)",
  "st.ws.stepReview": "Semakan pegawai & kelulusan",
  "st.ws.workspace": "Ruang kerja",
  "st.ws.publicUsers": "Pengguna Awam",
  "st.ws.staffUsers": "Kakitangan ST",
  "st.ws.organisations": "Entiti Perniagaan",
  "st.ws.access": "Pengurusan Akses",
  "st.ws.payments": "Bayaran & Resit",
  "st.ws.reconciliation": "Rekonsiliasi Hasil",
  "st.ws.revenueReports": "Laporan Hasil",
  "st.ws.schedule": "Penjadualan Lawatan",
  "st.ws.inspections": "Pemeriksaan & Audit",
  "st.ws.visitReports": "Laporan Lawatan",
  "st.ws.jkQueue": "Senarai Kelulusan JK",
  "st.ws.jkDecisions": "Minit & Keputusan",
  "st.ws.lastLogin": "Log masuk terakhir",
  "st.ws.orgName": "Nama entiti",
  "st.ws.accessMatrix": "Matriks akses peranan",
  "st.ws.accessBody": "Ringkasan LOA mengikut peranan persona (prototip).",
  "st.ws.accessRequests": "Permintaan akses",
  "st.ws.collected": "Kutipan berjaya",
  "st.ws.pendingPay": "Menunggu",
  "st.ws.failedPay": "Gagal",
  "st.ws.receipt": "No. resit",
  "st.ws.reconTitle": "Rekonsiliasi harian",
  "st.ws.reconBody": "Padanan transaksi FPX dengan lejar hasil modul.",
  "st.ws.fpxTotal": "Jumlah FPX",
  "st.ws.ledgerTotal": "Jumlah lejar",
  "st.ws.variance": "Beza",
  "st.ws.byModule": "Mengikut modul",
  "st.ws.scheduled": "Dijadualkan",
  "st.ws.inProgress": "Sedang dijalankan",
  "st.ws.completed": "Selesai",
  "st.ws.site": "Tapak",
  "st.ws.agenda": "Agenda",
  "st.ws.meeting": "Mesyuarat",
  "st.ws.airr": "Statistik AIRR",
  "st.ws.sla": "Piagam Pelanggan (SLA)",
  "st.ws.export": "Eksport Data",
  "st.ws.auditTrail": "Jejak Audit Transaksi",
  "st.ws.analyticsSubtitle": "Pelaporan & analitik merentas modul",
  "st.ws.vsPrev": "vs tempoh sebelumnya",
  "st.ws.airrNote": "Nota AIRR",
  "st.ws.airrBody": "Angka contoh untuk pembentangan protaip — sumber sebenar akan dihubungkan ke gudang data operasi.",
  "st.ws.distribution": "Taburan",
  "st.ws.exportApps": "Eksport permohonan",
  "st.ws.exportPayments": "Eksport bayaran",
  "st.ws.exportSla": "Laporan SLA",
  "st.ws.exportAudit": "Eksport jejak audit",
  "st.ws.exportAirr": "Pakej AIRR",
  "st.ws.exportCompliance": "Eksport pematuhan",
  "st.ws.exportDemo": "Muat turun demo",
  "st.ws.actor": "Pelaku",
  "st.ws.action": "Tindakan",
  "st.ws.adminRef": "Jadual Rujukan",
  "st.ws.adminFees": "Fi & Hari Bayaran",
  "st.ws.adminNotif": "Templat Notifikasi",
  "st.ws.adminWorkflow": "Aliran Kerja & LOA",
  "st.ws.adminRoles": "Peranan (RBAC)",
  "st.ws.adminPerms": "Kebenaran Modul",
  "st.ws.adminAudit": "Audit Trail",
  "st.ws.adminIntegrations": "Integrasi Luaran",
  "st.ws.adminSubtitle": "Konfigurasi & pentadbiran Sistem Digital ST",
  "st.ws.tableName": "Nama jadual",
  "st.ws.rows": "Baris",
  "st.ws.updated": "Dikemas kini",
  "st.ws.feeItem": "Item fi",
  "st.ws.template": "Templat",
  "st.ws.channel": "Saluran",
  "st.ws.stage": "Peringkat",
  "st.ws.role": "Peranan",
  "st.ws.users": "Pengguna",
  "st.ws.scope": "Skop",
  "st.ws.permsNote": "Kebenaran modul dipetakan kepada peranan di atas (prototip).",
  "st.ws.lastSync": "Segerak terakhir",
  "st.wsProc.new_licence": "Lesen baharu",
  "st.wsProc.renewal": "Pembaharuan",
  "st.wsProc.amendment": "Pindaan",
  "st.wsProc.installation_approval": "Kelulusan pepasangan",
  "st.wsProc.completion_inspection": "Pemeriksaan siap",
  "st.wsProc.exam_registration": "Pendaftaran peperiksaan",
  "st.wsProc.exam_result": "Keputusan peperiksaan",
  "st.wsProc.programme_approval": "Kelulusan program",
  "st.wsProc.efficiency_report": "Laporan kecekapan",
  "st.wsProc.investigation": "Siasatan",
};

const BI: Record<StMessageKey, string> = {
  "st.common.refNo": "Reference No.",
  "st.common.applicant": "Applicant",
  "st.common.type": "Type",
  "st.common.date": "Date",
  "st.common.status": "Status",
  "st.common.action": "Action",
  "st.common.view": "View",
  "st.common.open": "Open",
  "st.common.search": "Search",
  "st.common.filterAll": "All",
  "st.common.noResults": "No records found.",
  "st.common.mockNote": "Sample data for Phase 2 prototype — not yet connected to API.",
  "st.common.officer": "Officer",
  "st.common.employer": "Employer",
  "st.common.category": "Category",
  "st.common.class": "Class",
  "st.common.fee": "Fee (RM)",
  "st.common.cdp": "CDP Points",
  "st.common.identity": "ID Number",
  "st.common.certificate": "Certificate No.",
  "st.common.expires": "Expires",
  "st.common.module": "Module",
  "st.common.submitted": "Submitted",
  "st.common.takeOpen": "Take & Open",
  "st.common.limitFull": "At limit",
  "st.common.activeTasks": "Active tasks",
  "st.common.fifo": "FIFO queue",

  "st.inbox.title": "Task Inbox",
  "st.inbox.subtitle": "Work queue by role and customer charter",
  "st.inbox.charterHours": "Customer charter: {n} hours per application",
  "st.inbox.charterDays": "Customer charter: {n} days per application",
  "st.inbox.tabNew": "New",
  "st.inbox.tabQuery": "Query",
  "st.inbox.tabDone": "Completed",
  "st.inbox.empty": "No tasks in this tab.",
  "st.inbox.slaGreen": "On track",
  "st.inbox.slaYellow": "At risk",
  "st.inbox.slaRed": "Overdue",
  "st.inbox.fifoHint": "FIFO queue · Max 3 active tasks",
  "st.inbox.selected": "{n} applications selected",
  "st.inbox.bulkApprove": "Bulk Approve & Sign",
  "st.inbox.bulkTitle": "Bulk approve & sign?",
  "st.inbox.bulkMsg": "{n} applications will be approved and digitally signed with one PIN.",
  "st.inbox.continue": "Continue",

  "st.notif.title": "Notifications",
  "st.notif.unread": "{n} unread",
  "st.notif.markAll": "Mark all as read",
  "st.notif.empty": "No notifications right now.",

  "st.search.title": "Search & Status Check",
  "st.search.subtitle": "Find applications or registered certificates across Registration modules",
  "st.search.placeholder": "Reference no., name, MyKad, SSM, or certificate no.…",
  "st.search.hint": "Examples: ST/RG-KE/2026/00041 · Ahmad · 850101 · Elektro Prima",
  "st.search.results": "Search results",
  "st.search.applications": "Applications",
  "st.search.registrations": "Active registrations",
  "st.search.noHit": "No matches. Try a full reference number or part of a name.",
  "st.search.kindApp": "Application",
  "st.search.kindReg": "Registered",
  "st.search.quickTitle": "Quick search (samples)",
  "st.search.quick1": "Ahmad bin Ismail",
  "st.search.quick2": "ST/RG-CE/2026",
  "st.search.quick3": "GasLink",

  "st.reg.applications": "Applications",
  "st.reg.review": "Review & Approval",
  "st.reg.compliance": "Monitoring & Compliance",
  "st.reg.reports": "Module Reports",
  "st.reg.subtitleOk": "Competent Person registration — guided digital flow",
  "st.reg.subtitleContractor": "Contractor registration — class, OK appointment & renewal",
  "st.reg.statTotal": "Total",
  "st.reg.statInProgress": "In progress",
  "st.reg.statQuery": "Queries",
  "st.reg.statIssued": "Certificates issued",
  "st.reg.newApplication": "New Application",
  "st.reg.filterStatus": "Status",
  "st.reg.filterType": "Application type",
  "st.reg.emptyApps": "No applications for this filter.",
  "st.reg.reviewTitle": "Review queue",
  "st.reg.reviewSubtitle": "Items awaiting officer action for this module",
  "st.reg.reviewEmpty": "Nothing waiting for review.",
  "st.reg.complianceTitle": "Registration monitoring",
  "st.reg.complianceSubtitle": "Certificate status, validity & CDP points",
  "st.reg.complianceActive": "Active",
  "st.reg.complianceExpiring": "Expiring soon",
  "st.reg.complianceExpired": "Expired",
  "st.reg.complianceSuspended": "Suspended",
  "st.reg.reportsTitle": "Module operations report",
  "st.reg.reportsSubtitle": "Volume, status and SLA snapshot (sample data)",
  "st.reg.reportByType": "By application type",
  "st.reg.reportByStatus": "By status",
  "st.reg.reportSla": "SLA performance (current queue)",
  "st.reg.reportVolume": "30-day volume",
  "st.reg.processTypes": "Supported process types",
  "st.reg.guidedTitle": "Guided application journey",
  "st.reg.guidedBody": "Not a paper-form clone — clear steps, automated eligibility checks, document upload, online employer/OK confirmation, and FPX payment.",
  "st.reg.eligibility": "Eligibility",
  "st.reg.docChecklist": "Supporting documents",
  "st.reg.startMock": "Start (prototype)",

  "st.appType.new_registration": "New Registration",
  "st.appType.renewal": "Renewal",
  "st.appType.termination": "Termination",
  "st.appType.multi_employer": "Multiple Employers",
  "st.appType.class_change": "Class Change",
  "st.appType.ok_appointment": "Competent Person Appointment",
  "st.appType.ok_termination": "OK Appointment Termination",
  "st.appType.employer_registration": "Employer-submitted Registration",
  "st.appType.enforcement_cancellation": "Cancellation (Enforcement)",

  "st.compliance.active": "Active",
  "st.compliance.expiring_soon": "Expiring soon",
  "st.compliance.expired": "Expired",
  "st.compliance.suspended": "Suspended",

  "st.status.draft": "Draft",
  "st.status.awaiting_employer_confirm": "Awaiting Appointment Confirmation",
  "st.status.awaiting_processing_payment": "Awaiting Processing Payment",
  "st.status.sos_review": "SOS Review",
  "st.status.query_applicant": "Applicant Query",
  "st.status.technical_review": "Technical Review",
  "st.status.pending_approval": "Pending Approval",
  "st.status.awaiting_registration_payment": "Awaiting Registration Payment",
  "st.status.certificate_issued": "Certificate Issued",
  "st.status.rejected": "Rejected",
  "st.status.withdrawn": "Withdrawn",

  "st.mod.RG-KE": "Electrical Competent Person",
  "st.mod.RG-KG": "Gas Competent Person",
  "st.mod.RG-CE": "Electrical Contractor",
  "st.mod.RG-CG": "Gas Contractor",
  "st.mod.RG-KE.short": "CP-E",
  "st.mod.RG-KG.short": "CP-G",
  "st.mod.RG-CE.short": "EC",
  "st.mod.RG-CG.short": "GC",

  "st.okApply.title": "Electrical CP Registration Application",
  "st.okApply.subtitle": "Guided RG-KE journey — not a paper-form clone",
  "st.okApply.stepProfile": "Profile",
  "st.okApply.stepCompetency": "Competency",
  "st.okApply.stepEmployer": "Employer",
  "st.okApply.stepDocs": "Documents",
  "st.okApply.stepReview": "Review",
  "st.okApply.fullName": "Full name",
  "st.okApply.ic": "MyKad No.",
  "st.okApply.dob": "Date of birth",
  "st.okApply.age": "Age",
  "st.okApply.gender": "Gender",
  "st.okApply.genderMale": "Male",
  "st.okApply.genderFemale": "Female",
  "st.okApply.phone": "Phone",
  "st.okApply.email": "Email",
  "st.okApply.address": "Address",
  "st.okApply.prefillNote": "Pre-filled from your ST Digital account profile (PE-ID).",
  "st.okApply.certNo": "Competency certificate No.",
  "st.okApply.voltage": "Voltage restriction",
  "st.okApply.place": "Place restriction",
  "st.okApply.period": "Registration period",
  "st.okApply.periodYear": "{n} year(s)",
  "st.okApply.periodHint": "Maximum period by age & category: {n} year(s)",
  "st.okApply.oshRequired": "OSH medical report required (over age limit). Download the template, obtain registered medical practitioner endorsement, then re-upload.",
  "st.okApply.oshDownload": "Download OSH template",
  "st.okApply.oshUpload": "Upload signed OSH report",
  "st.okApply.oshDone": "OSH report uploaded",
  "st.okApply.employerCat": "Employer category",
  "st.okApply.company": "Company",
  "st.okApply.selfEmployed": "Self-employed",
  "st.okApply.selfEmployedHint": "Only for JPE, JEK or PE.",
  "st.okApply.selfEmployedBlocked": "This competency category cannot register as self-employed.",
  "st.okApply.searchEmployer": "Search employer company name…",
  "st.okApply.cdpBonus": "First-registration CDP bonus points will be generated after approval (sample: +{n}).",
  "st.okApply.eligibilityOk": "Eligibility met — certificate active and not suspended.",
  "st.okApply.eligibilityFailCert": "An active competency certificate is required to apply.",
  "st.okApply.eligibilityFailSuspend": "Certificate is suspended — application not allowed.",
  "st.okApply.decl1": "I confirm that all information in this application is true and correct.",
  "st.okApply.decl2": "I agree to comply with the Energy Commission registration terms and conditions.",
  "st.okApply.decl3": "I understand that any violation of the Electricity Supply Act 1990 [Act 447] may result in legal consequences.",
  "st.okApply.pin": "Security PIN",
  "st.okApply.pinHint": "Demo PIN: {n}",
  "st.okApply.next": "Next",
  "st.okApply.back": "Back",
  "st.okApply.submit": "Submit application",
  "st.okApply.incomplete": "Please complete required fields before continuing.",
  "st.okApply.submitted": "Application submitted. Reference: {n}",
  "st.okApply.draftSaved": "Draft saved on this device (auto-save).",
  "st.okApply.saveDraft": "Save draft",
  "st.okDetail.title": "Application details",
  "st.okDetail.timeline": "Process trail",
  "st.okDetail.documents": "Supporting documents",
  "st.okDetail.backList": "Back to list",
  "st.common.years": "years",
  "st.common.next": "Next",
  "st.common.back": "Back",
  "st.common.submit": "Submit",

  "st.ceApply.title": "Electrical Contractor Registration Application",
  "st.ceApply.subtitle": "Guided RG-CE journey — all Section A–G fields, new UI",
  "st.ceApply.stepA": "Type & Class",
  "st.ceApply.stepB": "Company",
  "st.ceApply.stepC": "Personnel",
  "st.ceApply.stepD": "Equipment",
  "st.ceApply.stepEF": "Checks & Documents",
  "st.ceApply.stepG": "Declaration",
  "st.ceApply.kind": "Contractor type",
  "st.ceApply.class": "Category / Class",
  "st.ceApply.voltage": "Voltage",
  "st.ceApply.period": "Registration period",
  "st.ceApply.repName": "Company representative name",
  "st.ceApply.repIc": "Representative MyKad No.",
  "st.ceApply.companyName": "Company name",
  "st.ceApply.companyReg": "Company registration No. (SSM)",
  "st.ceApply.companyAddress": "Company / premise address",
  "st.ceApply.postcode": "Postcode",
  "st.ceApply.city": "City",
  "st.ceApply.state": "State",
  "st.ceApply.companyEmail": "Company email",
  "st.ceApply.companyPhone": "Company phone",
  "st.ceApply.companyFax": "Fax No.",
  "st.ceApply.directors": "Board members / shareholders",
  "st.ceApply.addDirector": "Add director / shareholder",
  "st.ceApply.sharePercent": "Share (%)",
  "st.ceApply.searchOk": "Search MyKad, certificate No. or name…",
  "st.ceApply.okPeriod": "OK period (years)",
  "st.ceApply.okBlocked": "This CP is already employed by another company — cannot appoint.",
  "st.ceApply.skilled": "Skilled persons (Electrical Repair)",
  "st.ceApply.addSkilled": "Add skilled person",
  "st.ceApply.qualification": "Qualification",
  "st.ceApply.field": "Field",
  "st.ceApply.engineers": "Professional engineers (Switchboard Manufacturer)",
  "st.ceApply.addEngineer": "Add professional engineer",
  "st.ceApply.engReg": "Engineer registration No.",
  "st.ceApply.equipment": "Test equipment",
  "st.ceApply.addEquip": "Add equipment",
  "st.ceApply.equipType": "Test equipment",
  "st.ceApply.serial": "Serial No.",
  "st.ceApply.brand": "Brand",
  "st.ceApply.model": "Model",
  "st.ceApply.confirmTitle": "Confirmation checklist",
  "st.ceApply.docsTitle": "Photos / supporting documents",
  "st.ceApply.classReq": "Minimum class requirements",
  "st.ceApply.submitted": "Application submitted. Reference: {n}",
  "st.ceApply.remove": "Remove",
  "st.ceDetail.title": "Contractor application details",
  "st.ceDetail.backList": "Back to list",

  "st.mod.LC-LE": "Electrical Licensing",
  "st.mod.LC-PE": "Electrical Installation",
  "st.mod.LC-LG": "Gas Licensing",
  "st.mod.LC-PG": "Gas Installation",
  "st.mod.CC-XE": "Electrical Examination",
  "st.mod.CC-XG": "Gas Examination",
  "st.mod.CC-CD": "Continuing Professional Development (CPD)",
  "st.mod.EE-KT": "Energy Efficiency",
  "st.mod.EN-IV": "Enforcement & Investigation",
  "st.mod.PE-ID": "Identity & Account Management",
  "st.mod.PE-RV": "Revenue Management",
  "st.mod.PE-SV": "Site Visits / Inspections",
  "st.mod.PE-JK": "Committee Approvals",

  "st.ws.phase2": "Phase 2",
  "st.ws.guidedBody": "Module workspace — lists, review, compliance & reports with sample data. Full domain wizards will follow SRS priority.",
  "st.ws.dismiss": "Dismiss",
  "st.ws.nextSteps": "Typical steps",
  "st.ws.stepEligibility": "Eligibility & document checks",
  "st.ws.stepDocs": "Supporting uploads",
  "st.ws.stepPay": "FPX payment (where applicable)",
  "st.ws.stepReview": "Officer review & approval",
  "st.ws.workspace": "Workspace",
  "st.ws.publicUsers": "Public Users",
  "st.ws.staffUsers": "ST Staff",
  "st.ws.organisations": "Business Entities",
  "st.ws.access": "Access Management",
  "st.ws.payments": "Payments & Receipts",
  "st.ws.reconciliation": "Revenue Reconciliation",
  "st.ws.revenueReports": "Revenue Reports",
  "st.ws.schedule": "Visit Scheduling",
  "st.ws.inspections": "Inspections & Audits",
  "st.ws.visitReports": "Visit Reports",
  "st.ws.jkQueue": "Committee Approval Queue",
  "st.ws.jkDecisions": "Minutes & Decisions",
  "st.ws.lastLogin": "Last login",
  "st.ws.orgName": "Entity name",
  "st.ws.accessMatrix": "Role access matrix",
  "st.ws.accessBody": "LOA summary by persona role (prototype).",
  "st.ws.accessRequests": "Access requests",
  "st.ws.collected": "Successful collections",
  "st.ws.pendingPay": "Pending",
  "st.ws.failedPay": "Failed",
  "st.ws.receipt": "Receipt No.",
  "st.ws.reconTitle": "Daily reconciliation",
  "st.ws.reconBody": "Match FPX transactions to module revenue ledger.",
  "st.ws.fpxTotal": "FPX total",
  "st.ws.ledgerTotal": "Ledger total",
  "st.ws.variance": "Variance",
  "st.ws.byModule": "By module",
  "st.ws.scheduled": "Scheduled",
  "st.ws.inProgress": "In progress",
  "st.ws.completed": "Completed",
  "st.ws.site": "Site",
  "st.ws.agenda": "Agenda",
  "st.ws.meeting": "Meeting",
  "st.ws.airr": "AIRR Statistics",
  "st.ws.sla": "Customer Charter (SLA)",
  "st.ws.export": "Data Export",
  "st.ws.auditTrail": "Transaction Audit Trail",
  "st.ws.analyticsSubtitle": "Cross-module reporting & analytics",
  "st.ws.vsPrev": "vs previous period",
  "st.ws.airrNote": "AIRR note",
  "st.ws.airrBody": "Sample figures for prototype presentation — live source will connect to the operations data warehouse.",
  "st.ws.distribution": "Distribution",
  "st.ws.exportApps": "Export applications",
  "st.ws.exportPayments": "Export payments",
  "st.ws.exportSla": "SLA report",
  "st.ws.exportAudit": "Export audit trail",
  "st.ws.exportAirr": "AIRR pack",
  "st.ws.exportCompliance": "Export compliance",
  "st.ws.exportDemo": "Demo download",
  "st.ws.actor": "Actor",
  "st.ws.action": "Action",
  "st.ws.adminRef": "Reference Tables",
  "st.ws.adminFees": "Fees & Payment Days",
  "st.ws.adminNotif": "Notification Templates",
  "st.ws.adminWorkflow": "Workflow & LOA",
  "st.ws.adminRoles": "Roles (RBAC)",
  "st.ws.adminPerms": "Module Permissions",
  "st.ws.adminAudit": "Audit Trail",
  "st.ws.adminIntegrations": "External Integrations",
  "st.ws.adminSubtitle": "ST Digital system configuration & administration",
  "st.ws.tableName": "Table name",
  "st.ws.rows": "Rows",
  "st.ws.updated": "Updated",
  "st.ws.feeItem": "Fee item",
  "st.ws.template": "Template",
  "st.ws.channel": "Channel",
  "st.ws.stage": "Stage",
  "st.ws.role": "Role",
  "st.ws.users": "Users",
  "st.ws.scope": "Scope",
  "st.ws.permsNote": "Module permissions are mapped to the roles above (prototype).",
  "st.ws.lastSync": "Last sync",
  "st.wsProc.new_licence": "New licence",
  "st.wsProc.renewal": "Renewal",
  "st.wsProc.amendment": "Amendment",
  "st.wsProc.installation_approval": "Installation approval",
  "st.wsProc.completion_inspection": "Completion inspection",
  "st.wsProc.exam_registration": "Exam registration",
  "st.wsProc.exam_result": "Exam result",
  "st.wsProc.programme_approval": "Programme approval",
  "st.wsProc.efficiency_report": "Efficiency report",
  "st.wsProc.investigation": "Investigation",
};

export const stMessages: Record<DisplayLanguage, Record<StMessageKey, string>> = { bm: BM, bi: BI };

export function translateSt(key: StMessageKey, locale: DisplayLanguage, vars?: Record<string, string | number>): string {
  let text = stMessages[locale][key] ?? stMessages.bi[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      text = text.replace(`{${k}}`, String(v));
    }
  }
  return text;
}
