# Example of SRS Format

| Field | Value |
|-------|-------|
| Source PDF | `docs/SRS/Example of SRS Format.pdf` |
| Original | `C:/ST/SRS/Example of SRS Format.pdf` |
| Pages | 24 (24 with extractable text) |
| Full text | [`example-of-srs-format-full-text.md`](./example-of-srs-format-full-text.md) |

> Machine-extracted for AI-assisted development. Scanned/image-only pages may be empty — refer to the original PDF for diagrams and tables.

## About

**Example of SRS Format**. Reference template for SRS structure.

## Extracted Content by Page

### Page 1

SRS — Kesuma Dewi (KD) Chatbot · MOHR
Software Requirements 
Specification 
Kesuma Dewi (KD) 
AI Chatbot for Kementerian Sumber Manusia (KESUMA / MOHR) 
Version 1.0 · 3 June 2026 
Build specification for AI-assisted development 
Stack: Laravel · Vue 3 · MySQL · Corrad-Laravel base 
Page 1

### Page 2

SRS — Kesuma Dewi (KD) Chatbot · MOHR
Table of Contents 
Page 2

### Page 3

SRS — Kesuma Dewi (KD) Chatbot · MOHR
Kesuma Dewi (KD) — AI Chatbot for Kementerian Sumber Manusia (KESUMA / MOHR) 
Document Version: 1.0 
Date: 3 June 2026 
Prepared for: Kementerian Sumber Manusia (Ministry of Human Resources, Malaysia) 
Prepared as: Build specification for AI-assisted ("vibe coding") development 
Target stack: Laravel (API) · Vue 3 (SPA/admin) · MySQL · Corrad-Laravel base (https://github.com/
mfauzzury/corrad-laravel) 
How to use this document 
 
This SRS is written so that a developer using AI-assisted ("vibe") coding can read it top-to-bottom 
and build the complete web application without further clarification. It is organised as: 
1.Context and goals (Sections 1–3) 
2.The two product segments — Public and Admin (Sections 4–5) 
3.Cross-cutting capabilities — AI/RAG, knowledge base, crawler, notifications (Sections 6–9) 
4.Non-functional requirements, data model, APIs, and acceptance criteria (Sections 10–15) 
Every functional requirement is tagged (e.g. FR-PUB-03) so it can be referenced in tickets, prompts, and 
tests. Where a requirement maps to a feature already present in the Corrad-Laravel base repo, it is noted 
as [Corrad: reuse]. 
Page 3

### Page 4

SRS — Kesuma Dewi (KD) Chatbot · MOHR
1. Introduction 
1.1 Purpose 
The purpose of this system is to provide a multilingual, AI-powered (not rule-based) 
conversational assistant — named Kesuma Dewi, or KD — that serves the Malaysian public on 
behalf of Kementerian Sumber Manusia (KESUMA / MOHR) and its agencies. KD answers 
questions, guides users to the right service, and helps with enquiries focused (initially) on three 
agency systems, while giving MOHR and agency administrators a back office to manage 
knowledge, conversations, and users. 
1.2 The name "Kesuma Dewi (KD)"
- Kesuma — derived from KESUMA, the Malay short-form of the Ministry (KEmenterian SUmber 
MAnusia).
- Dewi — used as a friendly persona name and as a backronym expressing the AI nature of the 
assistant. Recommended expansion: Digital Enquiry & Web Intelligence (alternatives the team may 
pick from: "Digital Engagement & Workforce Intelligence", "Data-driven Enquiry & Web 
Intelligence"). The chosen expansion must be configurable as a setting (see FR-SET-02), not hard-
coded.
- Persona avatar: A friendly young Malay woman wearing a *tudung* (headscarf) and traditional 
*kebaya*, presented as a small floating chat icon on the public website. The avatar asset is a 
configurable image so MOHR can replace it without code changes. 
1.3 Scope 
In scope
- A public-facing replica of the MOHR front page (https://www.mohr.gov.my/) for prototype purposes, 
with the KD chat widget embedded.
- A conversational onboarding and Q&A flow for the public (language selection, introduction, identity 
capture with verification, agency-focused assistance).
- An admin back office with role-based access control (RBAC), knowledge-base management, 
conversation/chat management, agency administration, dashboards, settings, and an automated 
web crawler that feeds the knowledge base.
- AI answering grounded in the knowledge base (Retrieval-Augmented Generation), with conversation 
transcripts fed back into the knowledge base. 
Out of scope (for this phase)
- Native mobile apps (the web app must be responsive instead).
- Direct write-transactions into agency core systems (KD reads/looks up and guides; it does not file 
official claims/complaints on the agency's behalf unless a future integration is approved).
- Migrating MOHR's existing Joomla portal; only a front-page replica is produced. 
Page 4

### Page 5

SRS — Kesuma Dewi (KD) Chatbot · MOHR
1.4 Focus agencies (initial three) 
KD initially focuses on three agencies/systems. The platform must allow adding more agencies 
later — knowledge and administration are organised per agency. 
1.5 Definitions, acronyms, abbreviations
- MOHR / KESUMA — Ministry of Human Resources / Kementerian Sumber Manusia.
- KD — Kesuma Dewi, the chatbot persona.
- RBAC — Role-Based Access Control.
- KB — Knowledge Base.
- RAG — Retrieval-Augmented Generation: AI answers grounded in retrieved KB content.
- LLM — Large Language Model (the AI engine answering questions).
- Embedding — a numeric vector representation of text used for semantic search.
- SPA — Single Page Application (the Vue 3 front end).
- OTP — One-Time Password (used for email/phone verification).
- BM / EN / ZH / TA — Bahasa Melayu / English / Chinese (Mandarin) / Tamil. 
1.6 References
- MOHR portal: https://www.mohr.gov.my/
- Base repository / starter stack: https://github.com/mfauzzury/corrad-laravel (Laravel API + Vue 3 
admin + Eloquent ORM + Tailwind CSS, with built-in content editing, media management, RBAC, 
menu management, dynamic site settings). 
# Agency System / Service Typical user intent
1 HRDCorp MyFutureJob (Portal 
Pekerjaan Negara)
Job search queries, job 
availability data
2 JTK (Jabatan Tenaga 
Kerja)
Sistem Aduan PekerjaLabour complaints & 
issues, complaint reference 
number lookups
3 PERKESO Claim System Claim applications, claim 
reference number lookups
Page 5

### Page 6

SRS — Kesuma Dewi (KD) Chatbot · MOHR
2. Overall description 
2.1 Product perspective 
KD is a new, cloud-hosted web application. It is not a rule-based decision tree; answering is 
driven by an LLM grounded in a curated, per-agency knowledge base (RAG). The system reuses 
the Corrad-Laravel base for authentication, RBAC, media management, settings, and the Vue 3 
admin shell, and extends it with chatbot-specific modules. 
High-level architecture (logical): 
┌────────────────────────────────────────────────────────────────────┐ 
│ USER INTERACTION LAYER │ 
│ Public website replica (Vue 3) + KD floating chat widget │ 
└───────────────┬──────────────────────────────────────┬─────────────┘ 
 │ user queries │ bot responses 
 ▼ ▲ 
┌────────────────────────────────────────────────────────────────────┐ 
│ AI AGENT (Laravel) │ 
│ Intent classification → RAG retrieval → LLM answer → follow-up │ 
│ Guardrails · language handling · conversation state · logging │ 
└───┬───────────────┬───────────────┬───────────────┬────────────────┘ 
 │ │ │ │ 
 ▼ ▼ ▼ ▼ 
┌────────┐ ┌──────────────┐ ┌────────────┐ ┌──────────────────────┐ 
│ KB / │ │ HRDCorp / │ │ JTK / │ │ PERKESO / │ 
│ Vector │ │ MyFutureJob │ │ Sistem │ │ Claim System │ 
│ Store │ │ (job data) │ │ Aduan │ │ (claim ref/appl.) │ 
└────────┘ └──────────────┘ └────────────┘ └──────────────────────┘ 
 (agency lookups via API or guided links) 
2.2 User classes (RBAC) — three categories 
5.Public user — anonymous/lightly-identified end users chatting with KD on the public site. May 
provide name/email/phone (verified) but do not log in to an admin panel. 
6.Admin — MOHR staff and agency staff who log in to the back office. Agency admins are scoped to 
their own agency's knowledge and conversations. Includes the ability for an agency admin to add 
additional admins for their own agency. 
7.Super Admin — full platform control: manages all users, all agencies, global settings, crawler 
configuration, and system-wide knowledge base. 
2.3 Operating environment
- Cloud-hosted (e.g. a Malaysian-region cloud or government cloud / MyGovCloud-compatible). 
Server-side Laravel app + MySQL database + a vector store + object storage for uploaded 
documents.
- Client: modern browsers (Chrome, Firefox, Edge, Safari), responsive for mobile and desktop. 
Page 6

### Page 7

SRS — Kesuma Dewi (KD) Chatbot · MOHR
2.4 Design & implementation constraints
- Stack is fixed: Laravel (PHP) for the API/back end, Vue 3 + Tailwind for the front end, MySQL as 
the primary relational database, building on the Corrad-Laravel base repo.
- AI-based, not rule-based. Answers come from an LLM grounded in the KB. Hard-coded decision 
trees are only acceptable for the deterministic onboarding steps (language pick, identity capture).
- Bahasa Melayu first. All public-facing copy must be available in BM, EN, ZH, TA.
- Government data protection. Personal data (PDPA Malaysia) must be handled per Section 10.4. 
2.5 Assumptions & dependencies
- An LLM provider/API is available (cloud-hosted commercial model or a self-hosted open model). 
The provider is configurable (Section 9).
- Email and SMS/WhatsApp gateways are available for verification and notifications.
- Where agency live-lookups (e.g. claim/complaint reference status) require official APIs, those APIs 
are provided by HRDCorp/JTK/PERKESO; until then KD guides users to the correct agency portal 
and explains the process from the KB. 
Page 7

### Page 8

SRS — Kesuma Dewi (KD) Chatbot · MOHR
3. System goals & success criteria
- G1 — A member of the public can get accurate, source-grounded answers about MOHR and the 
three focus agencies in their preferred language (BM/EN/ZH/TA).
- G2 — KD greets users, introduces itself, captures and verifies identity politely, and routes enquiries 
to the right agency.
- G3 — MOHR and agency admins can manage knowledge per agency, monitor and respond to 
conversations, and view dashboards.
- G4 — The KB stays current automatically via scheduled crawling of MOHR/agency public content 
and by ingesting past conversations.
- G5 — The platform is extensible to more than three agencies without code changes to the data 
model. 
Page 8

### Page 9

SRS — Kesuma Dewi (KD) Chatbot · MOHR
4. Public segment — functional requirements 
4.1 Public website replica
- FR-PUB-01 — The system shall present a replica of the MOHR front page (https://
www.mohr.gov.my/) for prototype purposes, reproducing the front-page content and layout: top utility 
bar (Soalan Lazim, Hubungi Kami, Maklum Balas, Peta Laman), the MOHR logo/header, the main 
navigation (LAMAN UTAMA, INFO KORPORAT, SUMBER, MEDIA, LAMAN MIKRO, 
PERTANYAAN), the hero/banner carousel, "Perkhidmatan Dalam Talian" quick-link tiles (MyKKP, 
MyFutureJobs, ILJTM, ePPAx, TiPS, e-Industrial Court, eTraining HRDCorp, PTPK, MySPIKE), the 
"Info Lanjut" tabs (Kenyataan Media, Aktiviti Terkini, Tender), the "Pautan Pantas" panels, the 
"Jabatan & Agensi" logo grid, and the footer (address: Aras 6–12, Menara PERKESO Putrajaya, 
Presint 2, 62100 Putrajaya; Tel 03-8880 6200; e-mel aduan.ukk@mohr.gov.my; privacy/security/
copyright/disclaimer links).
- FR-PUB-02 — The replica shall be built in Vue 3 + Tailwind, be responsive, and store its front-page 
content as editable records (so admins can update banners, tiles, and links via the back office — 
[Corrad: reuse content editing & media management]). External quick-links shall point to the real 
agency URLs.
- FR-PUB-03 — The replica is a *prototype shell*; it must not attempt to proxy or scrape live MOHR 
pages at render time. Front-page content is seeded once and thereafter editable in the admin. 
4.2 The KD chat widget
- FR-PUB-04 — A small floating chat icon (the Kesuma Dewi avatar — young Malay woman in 
tudung and traditional kebaya) shall appear on every public page, anchored bottom-right, with an 
unobtrusive "Tanya KD / Ask KD" label and a subtle attention animation on first visit.
- FR-PUB-05 — Clicking the icon opens a chat panel with KD's avatar, name, a short tagline, the 
conversation thread, a text input, a send button, a language switcher, and a "restart conversation" 
control. The panel must be keyboard-accessible and screen-reader friendly (Section 10.5).
- FR-PUB-06 — The avatar image, name, tagline, accent colour, and welcome copy shall be 
configurable via Settings (Section 8), not hard-coded. 
4.3 Conversation onboarding flow 
The opening flow is deterministic (scripted) before handing over to AI answering:
- FR-PUB-07 — Language selection. On first open, KD shall ask the user to choose a language: 
Bahasa Melayu, English, 中文 (Chinese), தமிழ் (Tamil). The whole conversation (KD's messages, 
buttons, prompts) then continues in the selected language. The user may switch language at any 
time.
- FR-PUB-08 — Self-introduction. After language selection, KD shall introduce itself: who KD is (the 
official AI assistant of Kementerian Sumber Manusia), what it can help with, and a privacy note that 
the chat may be recorded and used to improve service (with a link to the privacy notice). Intro copy 
is per-language and editable in Settings.
- FR-PUB-09 — Mention the three focus agencies. During or right after the introduction, KD shall 
state that it can specifically help with the three focus services: HRDCorp / MyFutureJob (jobs), 
JTK / Sistem Aduan Pekerja (labour complaints), and PERKESO / Claim System (claims) — 
Page 9

### Page 10

SRS — Kesuma Dewi (KD) Chatbot · MOHR
and invite the user to pick one or type their question freely. Presented as quick-reply chips plus free 
text.
- FR-PUB-10 — Capture name. KD shall politely ask for the user's name so it can address them 
properly, and thereafter use the name naturally (e.g. "Baik, Encik/Puan {name}…"). Name capture is 
requested but skippable; if skipped, KD uses a neutral, polite address.
- FR-PUB-11 — Capture & verify email. KD shall ask for an email address and verify it by sending a 
6-digit OTP (or a verification link) to that address; the user enters the code in chat to confirm. 
Unverified emails are flagged as such. Validation of format precedes sending.
- FR-PUB-12 — Capture & verify phone. KD shall ask for a mobile number and verify it via OTP 
sent by SMS or WhatsApp; the user enters the code to confirm. Phone capture/verification is 
requested; the user may decline and still continue with limited follow-up options.
- FR-PUB-13 — Consent. Before storing personal data, KD shall obtain explicit consent (a clear yes/
no with a privacy-notice link). Without consent, the chat continues anonymously and no PII is stored.
- FR-PUB-14 — Graceful skipping. Every identity step (name, email, phone) must be skippable; KD 
must never block answering a general question because identity is incomplete, but may require a 
verified contact before promising an email/WhatsApp follow-up from a human agent. 
4.4 The conversation itself
- FR-PUB-15 — AI answering (RAG). After onboarding, KD shall answer questions conversationally 
using the LLM grounded in the per-agency knowledge base (Section 6). Answers must be in the 
user's selected language regardless of the KB source language.
- FR-PUB-16 — Intent classification. Each incoming message shall be classified (e.g. job-search, 
labour-complaint, claim, general-MOHR, complaint-reference-lookup, claim-reference-lookup, out-
of-scope) to select the right KB scope/agency and the right follow-up actions. Classification labels 
are stored on the message for analytics.
- FR-PUB-17 — Agency routing & lookups. Based on intent, KD shall (a) answer from the agency 
KB, (b) deep-link the user to the correct agency portal/form, and (c) where an official agency lookup 
API is configured, accept a reference number (e.g. complaint or claim reference) and return status. 
Until lookup APIs exist, KD explains the process and links the portal.
- FR-PUB-18 — Grounding & citations. KD's answers shall be grounded in retrieved KB passages; 
when confidence is low or no relevant KB content is found, KD must say so honestly, avoid 
fabricating, and offer to connect the user to a human (email/WhatsApp) or to file feedback. 
Optionally show a "source" reference for transparency.
- FR-PUB-19 — Follow-up & escalation. KD shall offer follow-up actions: continue chatting, get a 
transcript by email, or request a human agent. If a human is requested and a verified contact exists, 
the conversation is queued for admin response via email or WhatsApp (Section 7).
- FR-PUB-20 — Conversation memory. Within a session, KD shall retain context (name, language, 
prior turns) to answer coherently. A session can be resumed via a returning link if a verified email is 
on file (optional, configurable).
- FR-PUB-21 — Tone & safety. KD shall be warm, respectful, and formal-friendly in Malay 
government style; refuse abusive, illegal, or out-of-scope requests politely; and never give legal/
financial determinations — only official information and guidance.
- FR-PUB-22 — Feedback. After an answer, the user may rate it (helpful / not helpful) and optionally 
leave a comment; ratings are stored for quality analytics.
- FR-PUB-23 — Transcript storage. Every public conversation shall be stored (Section 6.5) and, 
subject to consent and PII-handling rules, fed back into the knowledge base for future answering 
(FR-KB-09). 
Page 10

### Page 11

SRS — Kesuma Dewi (KD) Chatbot · MOHR
5. Admin segment — functional requirements 
5.1 Authentication & RBAC
- FR-ADM-01 — Login. Admin and Super Admin users shall log in via secure authentication (email + 
password, with optional 2FA) [Corrad: reuse auth].
- FR-ADM-02 — RBAC. The system shall enforce role-based access control with the three categories 
Public, Admin (MOHR & agencies), Super Admin, plus fine-grained permissions [Corrad: reuse 
RBAC]. Permissions are grouped by module (users, KB, chat, crawler, settings, dashboard) and by 
agency scope.
- FR-ADM-03 — Agency scoping. An Admin tied to an agency shall only see and manage data (KB, 
conversations, sub-admins) belonging to that agency. MOHR-level Admins may be granted cross-
agency visibility. Super Admin sees everything.
- FR-ADM-04 — Agency admin self-service. An agency Admin shall be able to add additional 
admins for their own agency (invite by email, assign agency-scoped role), subject to a per-agency 
seat/permission policy set by Super Admin. 
5.2 User management
- FR-ADM-05 — User management with RBAC. Super Admin (and permitted MOHR Admins) shall 
create, view, edit, deactivate, and delete users; assign roles and agency scope; reset passwords; 
and view audit history [Corrad: reuse user management].
- FR-ADM-06 — Three user categories. The user model shall support the categories Public, Admin 
(MOHR/agency), and Super Admin, with agency association for agency admins. (Public chat users 
are stored separately from admin accounts — see data model 11.)
- FR-ADM-07 — Audit log. All privileged actions (user changes, KB edits, crawler config, settings 
changes, chat responses sent) shall be recorded in an immutable audit log with actor, timestamp, 
and before/after where relevant. 
5.3 Knowledge base management
- FR-ADM-08 — KB per agency. The knowledge base shall be organised by agency. The system 
ships with the three focus agencies and allows Super Admin to add more agencies; each agency 
has its own KB collection and access scope.
- FR-ADM-09 — Upload all knowledge types. Admins shall upload knowledge of any common type 
— user manuals, website content, PDFs, Word/Excel/PowerPoint, images with text, plain text, 
FAQs, and URLs — tagged to an agency and topic [Corrad: reuse media management].
- FR-ADM-10 — Ingestion pipeline. On upload/import, the system shall extract text, chunk it, 
generate embeddings, and store vectors with metadata (agency, source, title, language, version, 
timestamp) so the content becomes retrievable by KD (Section 6).
- FR-ADM-11 — KB lifecycle. Admins shall edit metadata, re-index, version, archive, and delete KB 
items; deletions remove the corresponding vectors. Agency admins act only within their agency's 
KB.
- FR-ADM-12 — Review of conversation-derived knowledge. Knowledge generated from past 
conversations (FR-KB-09) shall enter a review queue; an admin approves, edits, or rejects before it 
becomes authoritative KB content. 
5.4 Chat management
- FR-ADM-13 — Conversation inbox. Admins shall see a list/inbox of conversations they are 
permitted to view (agency-scoped), with filters (date, language, agency, intent, rating, status: open/
awaiting-human/closed) and full-text search.
- FR-ADM-14 — View logs. Admins shall open any permitted conversation and view the complete 
transcript, captured identity (name, verified email/phone), language, intent labels, KB sources used, 
and metadata/timestamps. 
Page 11

### Page 12

SRS — Kesuma Dewi (KD) Chatbot · MOHR
- FR-ADM-15 — Respond via email or WhatsApp. From a conversation, an admin shall be able to 
respond to the user by email or WhatsApp (where a verified contact exists), with the outbound 
message recorded back into the transcript and audit log (Section 7).
- FR-ADM-16 — Assignment & status. Conversations needing human attention shall be assignable 
to an admin, with status transitions and SLA timestamps; agency admins handle their own agency's 
queue.
- FR-ADM-17 — Export. Admins shall export transcripts (PDF/CSV) subject to permission and PII 
rules. 
5.5 Agency administration
- FR-ADM-18 — Agency records. Super Admin shall create/edit agencies (name, code, logo, 
contact, focus systems, KB collection, deep-link URLs, lookup-API config). The three focus agencies 
(HRDCorp/MyFutureJob, JTK/Sistem Aduan Pekerja, PERKESO/Claim System) are seeded.
- FR-ADM-19 — Agency login & visibility. Agency admins shall log in and see (only) their agency's 
chats and KB, and may add their own sub-admins (FR-ADM-04). 
5.6 Dashboards
- FR-ADM-20 — Role-aware dashboard. On login, both MOHR and agency admins shall land on a 
dashboard scoped to their permissions, showing at minimum: total conversations (today/7d/30d), 
conversations by language, by agency, by intent, average rating/helpfulness, % answered by AI vs 
escalated to human, open/awaiting-human counts, top unanswered questions (gaps in KB), and 
crawler health/last-run status.
- FR-ADM-21 — Drill-down. Dashboard cards shall link to filtered views (e.g. click "awaiting human" 
→ the relevant inbox filter).
- FR-ADM-22 — Live artifact option. Dashboards should support a shareable, auto-refreshing view 
for monitoring. 
5.7 Crawler module
- FR-ADM-23 — Crawl public content into KB. The system shall crawl the public MOHR website 
and configured agency sites and store the extracted content in the knowledge base, tagged to the 
relevant agency.
- FR-ADM-24 — Configure the crawl. Admins shall configure crawl jobs: seed URLs, include/
exclude URL patterns, crawl depth, max pages, file types to ingest (HTML/PDF/DOCX), agency tag, 
and language handling.
- FR-ADM-25 — Schedule & interval. Admins shall set the schedule/time interval for each crawl 
job (e.g. daily at 02:00, weekly, monthly, or a custom cron), enable/disable jobs, and trigger an on-
demand run.
- FR-ADM-26 — Incremental & dedup. Crawls shall detect changed pages (via content hash/last-
modified), update only changed content, avoid duplicates, and respect robots.txt and a politeness 
delay.
- FR-ADM-27 — Crawl review & logs. Each run shall produce a log (pages fetched, added, updated, 
skipped, errors). New crawled content may go to the KB directly or to a review queue per a per-job 
setting. 
Page 12

### Page 13

SRS — Kesuma Dewi (KD) Chatbot · MOHR
5.8 Settings module
- FR-SET-01 — Central settings. A settings module shall let Super Admin (and permitted Admins) 
configure the platform without code changes [Corrad: reuse dynamic site settings]. Proposed 
settings groups: 
◦Branding & persona (FR-SET-02): KD avatar image, name, "Dewi" backronym expansion, 
tagline, accent colour, welcome/intro copy per language. 
◦Languages: enabled languages (BM/EN/ZH/TA), default language, per-language UI strings. 
◦Onboarding: which identity steps are required vs optional (name/email/phone), consent text, 
privacy-notice link. 
◦AI engine: LLM provider/model, API keys (secret), temperature, max tokens, system prompt/
persona instructions, retrieval top-k, confidence threshold for "I don't know / escalate", and 
guardrail rules. 
◦Knowledge base: chunk size/overlap, embedding model, re-index controls, default review-
queue on/off. 
◦Crawler: global politeness delay, default schedule, user-agent string. 
◦Notifications: email (SMTP/API) and WhatsApp/SMS gateway credentials, OTP length & 
expiry, message templates per language. 
◦Escalation/SLA: response-time targets, routing rules, business hours, auto-reply when offline. 
◦Security: password policy, 2FA toggle, session timeout, data-retention period for transcripts/
PII. 
◦Agencies: manage agency list and per-agency deep-links and lookup-API endpoints.
- FR-SET-03 — Audit of setting changes. All settings changes shall be audited (FR-ADM-07). 
Page 13

### Page 14

SRS — Kesuma Dewi (KD) Chatbot · MOHR
6. Knowledge base & AI answering (RAG)
- FR-KB-01 — The KB shall store source documents, extracted text chunks, embeddings (vectors), 
and metadata (agency, title, source URL/file, language, version, created/updated, status).
- FR-KB-02 — Supported ingestion sources: manual uploads (FR-ADM-09), crawler output (FR-
ADM-23), and approved conversation-derived knowledge (FR-KB-09).
- FR-KB-03 — Text extraction shall handle HTML, PDF, DOCX, XLSX, PPTX, TXT, and images via 
OCR where needed.
- FR-KB-04 — Chunking shall split text into retrieval-sized passages with configurable size/overlap, 
preserving source metadata on each chunk.
- FR-KB-05 — Embeddings shall be generated by a configurable embedding model and stored in a 
vector index. The vector store may be a MySQL-compatible vector solution or an external vector 
database; retrieval is by semantic similarity filtered by agency scope.
- FR-KB-06 — Retrieval. At query time the system shall retrieve the top-k most relevant chunks 
(optionally hybrid keyword + semantic), filtered to the relevant agency/scope, and pass them as 
grounding context to the LLM.
- FR-KB-07 — Generation. The LLM shall produce an answer using only the retrieved context plus 
its instructions/persona, in the user's language, citing or referencing sources where configured, and 
explicitly deferring when context is insufficient.
- FR-KB-08 — Multilingual. The KB may hold content in BM/EN; KD must answer in the user's 
chosen language (BM/EN/ZH/TA), translating as needed while preserving official terminology.
- FR-KB-09 — Conversations back into the KB. All conversations shall be captured and, after PII 
redaction and admin review (FR-ADM-12), eligible to become KB content (e.g. as approved Q&A 
pairs) so KD improves over time.
- FR-KB-10 — Freshness. Crawled content shall carry a "last-verified" timestamp; admins can 
prioritise official/verified sources over conversation-derived content during retrieval. 
Page 14

### Page 15

SRS — Kesuma Dewi (KD) Chatbot · MOHR
7. Notifications, email & WhatsApp
- FR-NOT-01 — The system shall send transactional messages: email/SMS/WhatsApp OTPs for 
verification (FR-PUB-11/12), optional transcript-by-email, and human-agent replies (FR-ADM-15).
- FR-NOT-02 — Email shall be sent via configurable SMTP or an email API; WhatsApp/SMS via a 
configurable gateway (e.g. WhatsApp Business API provider). Credentials live in Settings (FR-
SET-01).
- FR-NOT-03 — All templates shall be editable per language with variables (name, agency, reference 
number, link).
- FR-NOT-04 — Outbound human replies shall thread back into the conversation record and the audit 
log.
- FR-NOT-05 — OTPs shall have configurable length and expiry, with rate-limiting and lockout after 
repeated failures. 
Page 15

### Page 16

SRS — Kesuma Dewi (KD) Chatbot · MOHR
8. Branding, persona & localisation
- FR-BRD-01 — KD's persona (avatar, name, tagline, voice/tone) shall be centrally configurable 
(Section 5.8).
- FR-BRD-02 — Default persona: Kesuma Dewi — friendly, respectful young Malay woman in tudung 
and traditional kebaya; warm, formal-friendly Malaysian government tone.
- FR-BRD-03 — All public strings shall be localisable to BM, EN, ZH, TA via a translation table; BM is 
the default.
- FR-BRD-04 — The system prompt/persona instruction given to the LLM shall enforce identity ("You 
are Kesuma Dewi, the official AI assistant of Kementerian Sumber Manusia…"), scope, tone, 
honesty/no-fabrication, and safety rules; it is editable in Settings. 
Page 16

### Page 17

SRS — Kesuma Dewi (KD) Chatbot · MOHR
9. AI engine requirements
- FR-AI-01 — Answering shall be AI/LLM-based, not rule-based; the onboarding steps may be 
scripted.
- FR-AI-02 — The LLM provider and model shall be configurable (commercial API or self-hosted open 
model) with secret key storage.
- FR-AI-03 — The engine shall support: system/persona prompt, retrieved-context injection (RAG), 
conversation history, language control, temperature/token settings, and a confidence/uncertainty 
threshold that triggers honest deferral or human escalation.
- FR-AI-04 — Guardrails shall block out-of-scope, abusive, or unsafe content and prevent the model 
from inventing official facts, figures, legal advice, or claim/complaint outcomes.
- FR-AI-05 — All AI calls shall be logged (prompt, retrieved sources, response, latency, token usage) 
for quality and cost monitoring, with PII handled per Section 10.4. 
Page 17

### Page 18

SRS — Kesuma Dewi (KD) Chatbot · MOHR
10. Non-functional requirements 
10.1 Performance
- NFR-01 — Median chatbot response latency ≤ 3 s and 95th-percentile ≤ 8 s under normal load 
(excluding third-party LLM outages).
- NFR-02 — The system shall support at least 500 concurrent public chat sessions in the initial 
deployment, horizontally scalable thereafter. 
10.2 Availability & reliability
- NFR-03 — Target availability 99.5% for the public chat. Graceful degradation: if the LLM is 
unavailable, KD apologises, offers FAQ links and human escalation.
- NFR-04 — Long-running work (crawling, ingestion, embeddings, notifications) shall run on 
asynchronous queues/workers, retried on failure. 
10.3 Scalability & extensibility
- NFR-05 — Adding a new agency shall require only configuration/data (new agency record + KB 
collection + admins), not schema or code changes.
- NFR-06 — The crawler, KB, and notification subsystems shall be modular and independently 
scalable. 
10.4 Security, privacy & compliance
- NFR-07 — Comply with Malaysian PDPA and government data-protection expectations for handling 
personal data (name, email, phone, transcripts).
- NFR-08 — Encrypt data in transit (TLS) and at rest (PII fields and stored documents).
- NFR-09 — Explicit consent before storing PII; configurable data-retention and a deletion/erasure 
path on request.
- NFR-10 — Secrets (LLM/email/WhatsApp keys) stored securely (env/secret manager), never 
exposed to the client.
- NFR-11 — Enforce RBAC and agency scoping on every API endpoint server-side (never trust the 
client).
- NFR-12 — Rate-limit public chat and OTP endpoints; protect against prompt-injection, spam, and 
abuse; sanitise crawled/ingested content.
- NFR-13 — Maintain audit logs (FR-ADM-07) and redact PII before conversation content enters the 
KB. 
10.5 Accessibility & UX
- NFR-14 — Public site and chat widget shall meet WCAG 2.1 AA: keyboard navigation, screen-
reader labels, sufficient contrast, scalable text.
- NFR-15 — Responsive on mobile and desktop; the chat widget must be usable one-handed on a 
phone. 
Page 18

### Page 19

SRS — Kesuma Dewi (KD) Chatbot · MOHR
10.6 Maintainability & deployability
- NFR-16 — Code shall follow the Corrad-Laravel conventions (Laravel API + Vue 3 SPA + Tailwind), 
with environment-based config, migrations, and seeders.
- NFR-17 — Provide automated tests for critical paths (onboarding, OTP, RAG answering, RBAC 
enforcement, crawler scheduling) and a CI pipeline.
- NFR-18 — Provide seed data for the three focus agencies and a demo super-admin. 
Page 19

### Page 20

SRS — Kesuma Dewi (KD) Chatbot · MOHR
11. Data model (logical) 
 
Primary entities (MySQL via Eloquent; vectors in the configured 
vector store). Names are indicative.
- users — id, name, email, password_hash, phone, role_id, agency_id (nullable), is_active, 2fa, 
timestamps. Roles: super_admin, admin, (public users tracked separately).
- roles / permissions / role_permission — RBAC [Corrad: reuse].
- agencies — id, name, code, logo, contact, focus_system, portal_url, deep_links (json), 
lookup_api_config (json), is_active, timestamps.
- public_users (chat contacts) — id, display_name, email, email_verified_at, phone, 
phone_verified_at, preferred_language, consent_at, created_at. (Lightweight, separate from admin 
users.)
- conversations — id, public_user_id (nullable), agency_id (nullable), language, status (open/
awaiting_human/closed), assigned_admin_id (nullable), rating, started_at, last_activity_at.
- messages — id, conversation_id, sender (user/kd/admin), channel (web/email/whatsapp), content, 
intent_label, kb_sources (json), tokens, created_at.
- kb_documents — id, agency_id, title, source_type (upload/crawl/conversation), source_url/
file_path, language, version, status (draft/approved/archived), last_verified_at, timestamps.
- kb_chunks — id, kb_document_id, agency_id, chunk_text, embedding_ref (vector id), metadata 
(json).
- crawl_jobs — id, agency_id, name, seed_urls (json), include/exclude patterns (json), depth, 
max_pages, file_types (json), schedule_cron, is_enabled, review_required, last_run_at, last_status.
- crawl_runs — id, crawl_job_id, started_at, finished_at, pages_fetched, added, updated, skipped, 
errors (json), log_ref.
- otp_verifications — id, target (email/phone), code_hash, channel, expires_at, attempts, verified_at.
- settings — key, value (json), group, updated_by, updated_at [Corrad: reuse].
- audit_logs — id, actor_id, action, entity, entity_id, before (json), after (json), ip, created_at.
- notifications — id, type, channel, to, template, payload (json), status, sent_at. 
Key relationships: an agency has many KB documents, conversations, crawl jobs, and agency-scoped 
admins; a conversation has many messages; a KB document has many chunks. 
Page 20

### Page 21

SRS — Kesuma Dewi (KD) Chatbot · MOHR
12. API surface (indicative) 
RESTful Laravel API consumed by the Vue 3 front end. All admin endpoints require auth + 
RBAC + agency scoping. 
 
Public / chat
- POST /api/chat/session — start a session (language).
- POST /api/chat/message — send a user message, returns KD's grounded reply + intent + 
suggested actions.
- POST /api/chat/identity — submit name/email/phone + consent.
- POST /api/chat/verify/request — request email/phone OTP.
- POST /api/chat/verify/confirm — confirm OTP.
- POST /api/chat/feedback — rate an answer.
- POST /api/chat/escalate — request a human; queues conversation. 
Admin
- …/auth/* — login, logout, 2FA, password reset [Corrad].
- …/users, …/roles — user & RBAC management [Corrad].
- …/agencies — agency CRUD; …/agencies/{id}/admins — agency sub-admins.
- …/kb/documents, …/kb/documents/{id}/reindex, …/kb/review-queue — KB management.
- …/conversations, …/conversations/{id}, …/conversations/{id}/reply (email/whatsapp), …/
conversations/{id}/assign.
- …/crawl/jobs, …/crawl/jobs/{id}/run, …/crawl/runs — crawler config, manual run, logs.
- …/dashboard/metrics — role-scoped metrics.
- …/settings — read/update settings groups [Corrad].
- …/audit-logs — read audit trail. 
Async workers / scheduled
- Crawl scheduler (per crawl_jobs.schedule_cron).
- Ingestion + embedding workers.
- Notification (email/SMS/WhatsApp) workers.
- Conversation-to-KB redaction & review worker. 
Page 21

### Page 22

SRS — Kesuma Dewi (KD) Chatbot · MOHR
13. Suggested build phases (for the developer) 
1.Foundation — clone/adopt Corrad-Laravel; confirm auth, RBAC, settings, media, Vue 3 shell; seed 
roles (super_admin/admin), the three agencies, and a demo super-admin. 
2.Public shell — build the MOHR front-page replica (FR-PUB-01/02) and the KD floating widget (FR-
PUB-04/05). 
3.Onboarding flow — language pick, intro, three-agency mention, name/email/phone capture + OTP 
verification + consent (FR-PUB-07…14). 
4.KB + RAG core — ingestion pipeline, embeddings, retrieval, LLM answering with persona/
guardrails (Sections 6 & 9); wire KD answering to it (FR-PUB-15…21). 
5.Admin modules — KB management, conversation inbox + email/WhatsApp reply, agency admin, 
dashboards (Section 5). 
6.Crawler — configurable, scheduled crawling into the KB with review/logs (Section 5.7). 
7.Conversation-to-KB loop — redaction, review queue, approval (FR-KB-09, FR-ADM-12). 
8.Hardening — security, PDPA, accessibility, performance, tests, CI, seed/demo data. 
Page 22

### Page 23

SRS — Kesuma Dewi (KD) Chatbot · MOHR
14. Acceptance criteria (sampling)
- AC-1 — Opening KD prompts for BM/EN/ZH/TA; selecting Tamil makes all subsequent KD copy 
Tamil. *(FR-PUB-07)*
- AC-2 — KD introduces itself and names the three focus agencies as quick-reply options. *(FR-
PUB-08/09)*
- AC-3 — Providing an email triggers an OTP; entering the correct code marks the email verified; the 
same for phone via SMS/WhatsApp. *(FR-PUB-11/12)*
- AC-4 — Declining to give a name still lets the user ask and receive a grounded answer. *(FR-
PUB-14/15)*
- AC-5 — A job-search question is classified and answered from the HRDCorp/MyFutureJob KB with 
a deep link to the portal. *(FR-PUB-16/17)*
- AC-6 — Asking something absent from the KB makes KD say it doesn't have that information and 
offer human escalation rather than inventing an answer. *(FR-PUB-18, FR-AI-04)*
- AC-7 — An agency admin sees only their agency's conversations and KB, and can add a sub-admin 
for that agency. *(FR-ADM-03/04/19)*
- AC-8 — An admin opens a conversation, reads the full log, and replies by email or WhatsApp; the 
reply appears in the transcript. *(FR-ADM-14/15)*
- AC-9 — Super Admin adds a fourth agency with its own KB and admins without any code change. 
*(FR-ADM-18, NFR-05)*
- AC-10 — A crawl job set to "daily 02:00" runs on schedule, ingests changed MOHR pages into the 
correct agency KB, and logs the run. *(FR-ADM-23…27)*
- AC-11 — On login, an agency admin lands on a dashboard scoped to their agency's metrics. *(FR-
ADM-20)*
- AC-12 — A reviewed past conversation is approved and becomes retrievable KB content; PII is 
redacted. *(FR-KB-09, FR-ADM-12)*
- AC-13 — Changing the KD avatar/name/welcome copy in Settings updates the public widget 
without code changes. *(FR-SET-02, FR-BRD-01)* 
Page 23

### Page 24

SRS — Kesuma Dewi (KD) Chatbot · MOHR
15. Open items to confirm with MOHR
- Official "Dewi" backronym wording and the final approved KD avatar artwork.
- Availability and specs of agency lookup APIs (claim/complaint/job status) vs guided-link-only for 
phase 1.
- Chosen LLM provider/model and embedding model, and whether hosting must remain in-country.
- WhatsApp Business provider and sender number; SMS fallback.
- Data-retention period for transcripts and PII, and the erasure-request process.
- Hosting target (government cloud vs commercial cloud, region). 
End of SRS v1.0.
Page 24
