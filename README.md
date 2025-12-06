![AuditX Logo](https://i.ibb.co/W4Gfc2p8/auditx1.jpg)

🛡️ AuditX: AI-Powered Fraud Detection & Prevention Platform
============================================================

![](https://img.shields.io/badge/Status-Active-success)

![](https://img.shields.io/badge/License-MIT-blue)

![](https://img.shields.io/badge/Stack-Next.js | Supabase | Gemini AI-orange)

_"Transparency is the currency of trust."_

AuditX is a comprehensive, AI-powered platform designed to detect and prevent **fraud, waste, and abuse** in government and enterprise financial operations.

By leveraging **Google Gemini AI**, advanced analytics, and anomaly detection, AuditX ensures **financial integrity, accountability, and transparency**.

---

## 📑 Table of Contents

- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [How It Works (Workflow)](#-how-it-works-workflow)
- [How AuditX Helps the Government of India](#-how-auditx-helps-the-government-of-india)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Future Developments](#-future-developments)
- [The Team](#-the-team)
- [Acknowledgements](#-acknowledgements)

---

## 📖 About the Project

AuditX serves as a powerful tool to combat corruption, improve accountability, and promote transparent financial governance.

### **Why AuditX?**

- 🤖 **Automated Anomaly Detection** — eliminates bias and human error
- 📊 **Data-Driven Insights** — deep visibility into spending
- ⚖️ **Accountability** — immutable audit trails
- 👁️ **Transparency** — clear financial monitoring

---

## 🚀 Key Features

### 📄 Document Upload & AI Analysis

- Drag-and-drop invoices, PDFs, images, spreadsheets
- Google Gemini AI extracts:
  - Vendor Name
  - Dates
  - Amounts
  - Line Items
- Automatic **Fraud Risk Scoring (0–100)**
- Secure storage in Supabase

### 🤖 AI Copilot

Ask natural-language questions:

- “Which vendors have the highest risk?”
- “Show transactions above ₹10 lakhs last month.”

### 🚨 Fraud Detection & Alerts

- Real-time 24/7 AI monitoring
- Non-linear fraud pattern detection
- Instant notifications for high-risk events

### 📰 Real-Time News Intelligence

- Global fraud & corruption news (50+ sources)
- India-specific updates from CAG, CBI, regulators

### 📈 Analytics Dashboard

- Real-time KPIs
- Cross-ministry comparisons
- Vendor performance & risk profiling

### ⚖️ Compliance & Case Management

- Track violations
- Full case history
- AI-generated audit reports

---

## 🔄 How It Works (Workflow)

1. **Login & Access Dashboard**
2. **Upload Financial Documents**
3. **AI Extracts & Scores Risk Automatically**
4. **Review Alerts & Insights**
5. **Analyze Vendor Profiles**
6. **Monitor Compliance**
7. **Ask the AI Copilot Anything**
8. **Generate Audit Reports**
9. **Stay Updated via Global & National News**

---

## 🇮🇳 How AuditX Helps the Government of India

AuditX aligns with India's vision of **Digital India**, **Good Governance**, and **Atmanirbhar Bharat** by ensuring every taxpayer Rupee reaches its rightful destination.

### 🏛 Strategic Government Use Cases

#### **1. Strengthening CAG & CBI**

- AI pre-screens thousands of invoices instantly
- Flags ghost vendors, duplicate payments, inflated bills

#### **2. DBT (Direct Benefit Transfer) Security**

- Detects:
  - Ghost beneficiaries
  - Identity fraud
  - Duplicate/fake payouts

#### **3. Public Procurement Integrity**

- Analyzes tender patterns to detect:
  - Bid-rigging
  - Cartelization
  - Circular payments

#### **4. GST Fraud Detection**

- Cross-matches invoices
- Identifies fake input tax credit claims
- Detects circular trading networks

#### **5. Department-Level Financial Oversight**

- Automated risk scores
- Spending heatmaps
- Real-time anomaly dashboards

#### **6. Future: Multilingual Support**

- Hindi, Telugu, Tamil, and more for state-level auditors

---

## 💻 Tech Stack

| Component | Technology |
|--------------|------------|
| Frontend | Next.js 14, React, Tailwind CSS, Radix UI, Shadcn UI |
| Backend | Node.js, Next.js Server Actions |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| AI / ML | Google Gemini AI, Python (planned) |
| Hosting | Vercel |
| External APIs| NewsAPI, Google OCR |

---

## 🏁 Getting Started

### **Prerequisites**

- Node.js 18+
- npm / yarn
- Supabase account
- Google Cloud Gemini API access

### **Installation**

```bash
git clone https://github.com/your-repo/auditx.git
cd auditx
npm install
npm run dev
```

Access the app at: 👉 http://localhost:3000

### 🔐 Environment Variables

Create a `.env.local` file and add the following variables:

```dotenv
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Gemini
GOOGLE_API_KEY=your_gemini_api_key

# NewsAPI
NEWS_API_KEY=your_news_api_key
```

---

## 🔮 Future Developments

- ⛓️ Blockchain-based audit trails
- 📱 Mobile App for auditors
- 🧠 Custom LLMs for financial regulations
- 🌐 Regional language support

---

## 👥 Meet the Team

- **V C Premchand Yadav** — VP, Team Leader & Chief Developer
- **P R Kiran Kumar Reddy** — AI Generalist & Product Strategist
- **Edupulapati Sai Praneeth** — AI/ML & Deep Learning Engineer
- **C R Mohith Reddy** — Backend Developer
- **K Sri Harsha Vardhan** — Testing & Model Optimization
- **Liel Stephen** — Data Analyst & Visualization Specialist

---

## 🙏 Acknowledgements

Special thanks to the platforms that made AuditX possible:

- Vercel — Hosting
- Google Gemini AI — Core intelligence
- Supabase — Backend + Auth
- Google Antigravity — Agentic AI based code editor
- ChatGPT — Debugging, architecture refinement, and development support

---

Made with ❤️ and 🤖 in India