# Nandha Engineering College (NEC) — Faculty Timetable & Workload System

[![CI Status](https://github.com/rohith-kanna-jr-2006/nec-faculty-timetable/actions/workflows/ci.yml/badge.svg)](https://github.com/rohith-kanna-jr-2006/nec-faculty-timetable/actions/workflows/ci.yml)
[![Expo SDK](https://img.shields.io/badge/Expo-SDK%2057-black.svg?logo=expo)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.86.3-blue.svg?logo=react)](https://reactnative.dev)
[![Node](https://img.shields.io/badge/Node.js-%3E%3D20.0-green.svg?logo=nodedotjs)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%207.0-brightgreen.svg?logo=mongodb)](https://mongodb.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A high-fidelity academic timetable and faculty workload management ecosystem developed for the **Department of Computer Science & Engineering** at **Nandha Engineering College (Autonomous), Erode**.

This repository consists of:
1. **Mobile Application**: A cross-platform React Native mobile app (Android, iOS, and Web) built with **Expo Router** and pure **StyleSheet** tokens derived from authoritative Stitch design prototypes.
2. **Backend API**: A production-structured RESTful API built with **Express.js**, **Mongoose (MongoDB)**, JWT authentication, and strict Role-Based Access Control (**HOD**, **Academic Coordinator**, **Faculty**).

---

## Key Features

### 📱 Faculty Mobile Application
- **Faculty Dashboard**: Live institutional header, "Next Upcoming Class" hero banner with countdown, quick period timeline, and quick actions.
- **My Schedule (Personal View)**: Day-by-day timetable for faculty members (e.g. Ms. C. Navamani) with room codes, periods, and subject metadata.
- **Weekly Matrix Grid**: Full 5-day departmental class grid (Monday–Friday, Periods P1–P7) with interactive day chips and lab span cards.
- **Teaching Workload Validation**: Dynamic gauge metrics comparing allocated periods (Theory & Lab) against departmental norms (16-period threshold).
- **Institutional Alerts**: Real-time broadcast and personal timetable notifications with read/unread status badges.
- **Faculty Profile & Settings**: Institutional credentials, designation, contact info, and preferences.

### 🛡️ Enterprise Backend & Database API
- **Strict RBAC Security**: Granular authorization protecting HOD, Academic Coordinator (AC), and Faculty workflows.
- **Exact Source Data Preservation**: Ingestion and preservation of all 28 faculty workload records, preserving row-by-row data without loss.
- **Dynamic Aggregation**: Computes faculty teaching hours, responsibility hours, and total workload dynamically without pre-baked static overrides.
- **Timetable Version State Machine**: Lifecycle state engine (`DRAFT` → `GENERATED` → `PENDING_HOD_APPROVAL` → `APPROVED` → `PUBLISHED`).
- **Absence & Substitute Management**: Automated proxy allocation without altering original master workload hours.

---

## Architecture & Directory Structure

```
nec-faculty-timetable/
├── .github/                       # GitHub Actions CI & Community Templates
│   ├── workflows/ci.yml           # Automated CI workflow
│   ├── ISSUE_TEMPLATE/            # Bug report & feature request templates
│   ├── PULL_REQUEST_TEMPLATE.md   # Pull request guidelines
│   └── CODEOWNERS                 # Repository ownership definitions
├── app/                           # Expo Router file-based navigation
│   ├── _layout.js                 # Root layout & providers
│   ├── index.js                   # Splash & entry routing
│   ├── (auth)/login.js            # Faculty login screen
│   └── (faculty)/                 # Faculty authenticated portal
│       ├── dashboard.js           # Faculty overview
│       ├── timetable.js           # Personal daily schedule
│       ├── weekly-timetable.js    # Class-wide weekly matrix
│       ├── workload.js            # Departmental workload validation
│       ├── notifications.js       # Alerts feed
│       └── profile.js             # Faculty profile
├── components/                    # Reusable UI primitives (StyleSheet-driven)
├── constants/                     # Theme tokens & single source of truth models
├── docs/                          # Comprehensive technical documentation
│   ├── architecture.md            # System architecture details
│   ├── development.md             # Local environment & runtime guide
│   ├── faculty-workload.md        # Workload data extraction & audit
│   ├── hod-implementation.md      # HOD workflow & governance
│   └── timetable-workflow.md      # Timetable state machine & rules
├── backend/                       # Express.js + MongoDB API
│   ├── src/
│   │   ├── controllers/           # Route logic handlers
│   │   ├── models/                # Mongoose schemas
│   │   ├── routes/                # REST endpoints
│   │   ├── middlewares/           # JWT auth & RBAC
│   │   └── seeds/                 # Comprehensive seed datasets
│   └── tests/                     # 20 Automated Test Suites (72 Tests)
├── services/                      # Frontend API integration layer
├── app.json                       # Expo app configuration
└── package.json                   # Mobile workspace dependencies
```

---

## Quick Start

### Prerequisites
- **Node.js**: `v20.x` or `v22.x`
- **npm**: `v10.x` or later
- **MongoDB**: Local instance running on `mongodb://127.0.0.1:27017` or MongoDB Atlas URI
- **Expo Go App**: Optional for testing on physical devices (available on Google Play Store & iOS App Store)

---

### 1. Mobile App Setup

```bash
# Navigate to the workspace root
cd "NEC Faculty App"

# Install mobile dependencies
npm install

# Start the Expo development server
npx expo start
```

#### Running Modes:
- Press `a` in the terminal to open the **Android Emulator**.
- Press `i` to open the **iOS Simulator**.
- Press `w` to open in your **Web Browser**.
- Scan the displayed terminal QR code using **Expo Go** on a mobile device.

---

### 2. Backend API Setup

```bash
# Navigate into the backend directory
cd backend

# Create environment configuration from template
copy .env.example .env

# Install backend dependencies
npm install

# Seed the database with 28 faculty workload records and accounts
npm run seed

# Start the development server (with live reload)
npm run dev
```

The backend will start at `http://localhost:5000` with the health check available at `http://localhost:5000/api/health`.

---

## Testing

The backend includes 20 comprehensive test suites with 72 automated assertions covering database connectivity, JWT security, RBAC enforcement, exact workload calculations, and timetable state transitions:

```bash
cd backend
npm test
```

To run mobile diagnostic verification:

```bash
npx expo-doctor
```

---

## Environment Variables (Backend)

| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | API server port | `5000` |
| `NODE_ENV` | Runtime environment | `development` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/nec_faculty_db` |
| `JWT_SECRET` | Secret key for JWT signing | `nec_faculty_secret_jwt_key_2026_production_grade` |
| `JWT_EXPIRES_IN` | JWT session lifetime | `7d` |
| `CLIENT_ORIGIN` | Allowed CORS origin | `*` |
| `DEV_SEED_PASSWORD`| Default password for seeded accounts | `Password123!` |

---

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before submitting pull requests.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
