# Meatify

<p align="center">
	<img src="public/logo/meatify-logo.svg" alt="Meatify logo" width="240" />
</p>

<p align="center">
	A modern music discovery and personal station experience built for exploration, listening, and sharing.
</p>

<p align="center">
	<a href="#getting-started">Get started</a> ·
	<a href="#available-scripts">Scripts</a> ·
	<a href="#project-structure">Project structure</a>
</p>

## Overview

Meatify is a responsive music platform for discovering songs, browsing by genre and mood, and building a personal collection of stations. It combines a focused desktop layout with a mobile-friendly listening experience, keeping the library, queue, and playback controls close at hand.

The frontend can run against a remote API or in a self-contained local demo mode, which makes it useful for both full-stack development and product demonstrations.

## Features

- **Explore:** personalized recommendations, popular stations, and newly created stations.
- **Browse and search:** discover stations by tags, artists, songs, or free-text search.
- **Personal library:** save stations, manage liked songs, create stations, and filter your collection.
- **Full playback controls:** play, pause, seek, volume, mute, shuffle, repeat, previous/next track, and queue management.
- **Station management:** edit station details, reorder tracks, add songs, and remove stations you own.
- **Profiles and social signals:** view user profiles and see live station and user updates.
- **Responsive interface:** desktop navigation and library panels adapt to a dedicated mobile dock.
- **Real-time updates:** Socket.IO keeps watched stations and users synchronized when the remote service is enabled.
- **Local demo data:** local mode seeds users, stations, and songs without requiring a backend connection.

## Tech Stack

| Area | Technology |
| --- | --- |
| UI | React 19, React Router |
| State | Redux, React Redux |
| Build tooling | Vite |
| Playback | React Player |
| Real-time communication | Socket.IO Client |
| Interaction | dnd-kit |
| Styling and assets | CSS, Montserrat, Lottie |
| HTTP and utilities | Axios, fetch-jsonp, OverlayScrollbars |

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm
- A running Meatify backend for remote mode

### Installation

```bash
git clone <your-repository-url>
cd Meatify-Frontend
npm install
```

### Run in remote mode

Remote mode uses the backend at `http://localhost:3030` during development. Start the backend first, then run:

```bash
npm run dev
```

Open the local Vite URL shown in the terminal, usually `http://localhost:5173`.

### Run in local demo mode

Local mode uses browser storage and generated demo data, so no Meatify backend is required:

```bash
npm run dev:local
```

On macOS or Linux, use:

```bash
npm run dev:local:mac
```

Local mode persists demo users, stations, and songs in browser storage. The first data generation may use public music and image services, so an internet connection is recommended for the initial launch. Clear the site data to reset the demo state.

## Environment Variables

Create a `.env` file when you need to point the production build at a deployed backend:

```env
VITE_API_URL=https://your-api.example.com
```

The application uses `VITE_API_URL` in production for REST requests and Socket.IO connections. In development, requests default to `http://localhost:3030`.

`VITE_LOCAL=true` enables the local demo services. The `dev:local` script sets this flag automatically.

## Backend Integration

Remote mode expects a Meatify backend with:

- REST endpoints under `/api/` for users, songs, and stations.
- Authentication endpoints at `/api/auth/login`, `/api/auth/signup`, and `/api/auth/logout`.
- A Socket.IO server available from the same base URL for live station and user updates.
- Credentialed requests enabled for the frontend origin, including the appropriate CORS configuration.

The development default is `http://localhost:3030`. In production, both REST and Socket.IO use the value supplied through `VITE_API_URL`.

## Authentication

Remote authentication is handled by the backend. Local mode automatically prepares a demo user and stores the active session in `sessionStorage`, which lets the application be explored without creating an account.

The current frontend router exposes the product views listed below. Authentication UI components are included in the codebase, but the login and signup routes should be wired in `src/App.jsx` before publishing them as public routes.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run dev:local` | Start development with local demo services on Windows. |
| `npm run dev:local:mac` | Start development with local demo services on macOS/Linux. |
| `npm run build` | Create an optimized production build. |
| `npm run preview` | Preview the production build locally. |
| `npm run start` | Serve the production build using the deployment port. |
| `npm run lint` | Run ESLint across the project. |

## Application Routes

| Route | View |
| --- | --- |
| `/` | Explore and recommendations |
| `/browse` | Browse station categories |
| `/browse/:tag` | Stations filtered by tag |
| `/library` | Personal library |
| `/station/:id` | Station details and track list |
| `/song/:id` | Song details |
| `/user/:id` | User profile |

## Project Structure

```text
src/
├── cmps/       Reusable UI components and global player components
├── pages/      Route-level views
├── services/   HTTP, socket, upload, storage, and domain services
├── store/      Redux store, actions, and reducers
└── assets/     Styles, icons, animations, and other frontend assets
```

Domain services expose the same interface in both modes. The service index files select either local browser-storage implementations or remote API implementations based on `VITE_LOCAL`, allowing the UI and Redux layer to stay mode-agnostic.

## Production Build

Build and preview the application locally:

```bash
npm run build
npm run preview
```

For a production deployment, configure `VITE_API_URL` at build time and serve the generated `dist/` directory with a host that supports SPA fallback routing.

## Development Notes

- The remote frontend expects the backend API and Socket.IO server to be available on port `3030` during development.
- API requests are sent with credentials enabled, so the backend should be configured for the frontend origin.
- The local service layer is intended for demos and development, not as a replacement for production persistence or authentication.

## Before Publishing

- Replace `<your-repository-url>` in the installation example with the real repository URL.
- Add a deployed demo link and screenshots when they are available.
- Add a project license if this repository is intended for public reuse.

