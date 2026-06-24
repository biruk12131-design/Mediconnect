# MediConnect Telemedicine Platform

[![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

A modern, highly-polished simulated telemedicine and outpatient patient portal dashboard system titled **MediConnect**. The application uses **React 19 + TypeScript** on a fast-loading **Vite** pipeline with complete light/dark display modes, interactive multi-step scheduling adapters, micro-status renewals, and an integrated audio/video peer-to-peer virtual consultation simulation suite.

## 🎯 Target Lighthouse Indicators
- ⚡ **Performance**: `95+` (Zero heavy bundle size, assets cached via LocalStorage state triggers)
- ♿ **Accessibility**: `100` (ARIA tags, keyboard tab index navigation support, semantic skip-links)
- 🛡️ **Best Practices**: `100` (Strict typing, security sandbox protocols)

---

## 💎 Features & Pages

### 1. Unified Dashboard (`/`)
* **Patient Greeting**: Welcomes the current authenticated patient (*Elias Abdulhamid*) with localized medical status.
* **Clinic Action Board**: One-click quick actions to schedule check-ups, review pharmacy details, or enter consultation chambers.
* **Mini Calendar Checkups**: Daily dates grid showing scheduled consultation tags. Highlights detailed medical boards on date clicks.
* **Telemetry Data Trends**: Beautiful Pure SVG responsive Bar Charts illustrating historical checkup counts dynamically.

### 2. Live Scheduling Ledger (`/appointments`)
* Filter consultations by categories (`Confirmed`, `Completed`, `Cancelled`).
* Complete **4-step Interactive scheduling wizard**:
  1. Department Category choice (Cardiology, Pediatrics, Family Care).
  2. Available Doctor grid (shows education, languages, consultation fee rate).
  3. Digital Date selection and daily morning/afternoon time-slot bookings.
  4. Symptoms statement text-areas and checkout receipt confirming the slot!
* Instantly syncs across database states and appends activity feeds on submittals.

### 3. Verified Outpatient Practitioners (`/doctors`)
* Real-time search indexing doctor specialties, certificates, languages.
* Interactive sidebar selectors.
* Side-sliding **Inspections Drawer**: displays degrees, medical personal logs, and starts instant appointments shortcuts.

### 4. Tele-Consultation Chamber (`/consultations`)
* Implements mock A/V video consult feeds.
* Integrates browser **MediaDevices API** requesting webcam permissions to showcase real-time picture-in-picture video inside iframe restrictions!
* Audio mute controls, webcam toggles, and shared desktop flags.
* Interactive text-messenger append threads.
* Doctor treatment note-pads.

### 5. Prescriptions Registry (`/prescriptions`)
* Formatted RX medication registry tables.
* Interactive **Traditional RX Seal document slip receipt** modal.
* "Request Renewal" button: triggers instant physician approvals and transitions active status indicators.

### 6. Control Panel Preferences (`/settings`)
* Demographics forms updating Patient profiles.
* Notification broadcast matrices.
* persistent screen display calibrator (clinical light mode vs calming night dark mode).

---

## 🛠️ Senior Architectural Decisions
* ✨ **Zero Monolithic Bloat**: Fully decomposed layout folders separating mock models, types, and tab grids.
* ✨ **Offline-First Synchronization**: Automatically syncs appointments and patient identifiers across user sessions using standard LocalStorage engines.
* ✨ **Lighthouse Perfect**: Pre-compiled scalable vector graphics (SVGs), strict contrast ratios, responsive mobile drawer, and "Skip to Main Content" indices.
