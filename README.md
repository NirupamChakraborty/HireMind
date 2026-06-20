# HireMind

AI-powered interview preparation. Paste a job description, upload your resume,
and get tailored technical/behavioral questions, a skill-gap analysis, and a
day-by-day prep plan.

## Stack

- **Client**: React 19, Vite, React Router, Material UI (MUI v6), Axios
- **Server**: Node + Express 5, MongoDB (Mongoose), JWT auth, Google Gemini
  (`@google/genai`), Puppeteer (PDF generation), pdfjs-dist (resume parsing)

## Project structure

```
client/   React app (landing page, auth, dashboard, interview report)
server/   Express API (auth, interview report generation, resume PDF export)
```

## Setup

### 1. Server

```bash
cd server
npm install
```

Create/verify `server/.env`:

```
MONGO_URI=<your MongoDB connection string>
JWT_SECRET=<a long random string>
GEMINI_API_KEY=<your Gemini API key>
```

Run:

```bash
npm run dev    # or: node index.js
```

The API runs on `http://localhost:8005`.

### 2. Client

```bash
cd client
npm install
npm run dev
```

The app runs on `http://localhost:5173` and talks to the API at
`http://localhost:8005` (configured in `src/features/*/services/*.api.js`).

## Routes

| Path                     | Access    | Description                          |
| ------------------------ | --------- | ------------------------------------- |
| `/`                      | Public    | Marketing landing page                |
| `/login`                 | Public    | Log in                                |
| `/register`              | Public    | Create an account                     |
| `/app`                   | Protected | Generate a new interview report       |
| `/interview/:interviewId`| Protected | View a generated interview report     |

## Design system

All UI is built on a single MUI theme (`client/src/theme/theme.js`) — colors,
typography, radii, and component overrides live there so the landing page,
auth pages, and dashboard share one consistent look.
