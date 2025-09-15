## GL PeerBajaj — Connect. Learn. Level Up.

Welcome to GL PeerBajaj, a full‑stack MERN platform where GL Bajaj students discover peers, share resources, exchange feedback, and grow together. Think of it as your study hub + social graph + real‑time collaboration, in one modern app.

### Highlights
- 🚀 Modern React (Vite) front‑end with TailwindCSS
- 🔐 JWT auth with refresh flow, cookies, and secure CORS
- 🧠 Feed, posts, comments, and rich profile sections
- 👥 Followers/Following graph with suggestions
- 🔔 Real‑time notifications via WebSocket
- 💬 Chat and collaborative editor
- ☁️ Cloudinary uploads and production‑ready deployment presets

---

## Tech Stack
- **Client**: React (Vite), React Router, TailwindCSS, Axios, Socket.io client
- **Server**: Node.js, Express, Mongoose (MongoDB), JWT, Socket.io
- **Infra/Services**: Cloudinary, Vercel (client), Render (server)

---

## Quickstart

1) Server
```bash
cd server
npm install
# Create server/.env (see Environment)
npm run seed   # optional: seed demo users/content
npm run dev    # or: npm start
```

2) Client
```bash
cd client
npm install
# Create client/.env (see Environment)
npm run dev
```

Open the client at `http://localhost:5173` and the API at `http://localhost:5000`.

---

## Environment

Create `.env` files with your own secrets. Do not commit them.

### client/.env
```env
VITE_API_BASE=http://localhost:5000/api
VITE_CLIENT_URL=http://localhost:5173
```

### server/.env
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/gl_peer_platform
CLIENT_ORIGIN=http://localhost:5173
JWT_SECRET=replace_me_with_a_long_random_secret
NODE_ENV=development
```

Production deployments can set:
- Client: `VITE_API_BASE=https://<your-server-domain>/api`
- Server: `CLIENT_ORIGIN=https://<your-client-domain>`

See `ENVIRONMENT_SETUP.md` for ready‑to‑use production values and tips.

---

## Scripts

### server
```bash
npm run dev       # start with nodemon
npm start         # start production server
npm run seed      # seed demo data
```

### client
```bash
npm run dev       # start Vite dev server
npm run build     # production build
npm run preview   # preview production build
```

---

## Core Features

- **Auth & Profiles**: Signup/login, JWT cookies, profile sections, avatar uploads
- **Posts & Feed**: Global and following feeds, filters, infinite scroll
- **Follow Graph**: Follow/unfollow, followers/following tabs, suggestions
- **Notifications**: Real‑time bell with unread count, mark read/all read
- **Chat & Editor**: Peer chat and collaborative editor page
- **Uploads**: Cloudinary-backed media uploads
- **Accessibility**: Keyboard navigation, ARIA labels, high contrast modes

Detailed enhancement notes live in `ENHANCEMENT_SUMMARY.md`.

---

## Project Structure
```text
client/
  src/
    components/      # UI building blocks (cards, modals, lists)
    context/         # Auth, Theme, Socket, UnreadCount providers
    pages/           # App pages (Feed, Profile, Editor, Chat, etc.)
    lib/api.js       # Axios instance + API helpers
    utils/           # utilities & validators
server/
  src/
    controllers/     # route handlers (auth, feed, follow, notifications, ...)
    lib/             # db, cloudinary, socket, email
    middleware/      # auth, error
    models/          # Mongoose schemas (User, Post, Notification, ...)
    routes/          # Express routers per domain
    seed/            # seed script
```

---

## API Overview

Base URL: `/api`

- **Auth**: `POST /auth/register`, `POST /auth/login`, `GET /auth/me`, `POST /auth/refresh`, `POST /auth/logout`
- **Users**: `GET /users/:id`, `GET /users/search?username=`, `GET /users/suggest`
- **Follow**: `POST /follow/:id` (follow), `DELETE /follow/:id` (unfollow), lists for followers/following
- **Feed**: `GET /feed/global`, `GET /feed/following`
- **Notifications**: `GET /notifications`, `GET /notifications/unread-count`, `PATCH /notifications/:id/read`, `PATCH /notifications/mark-all-read`
- **Posts/Upload**: endpoints for posts and media upload

Authentication uses cookies; ensure your client includes credentials.

---

## Development Notes

- CORS is restricted to `CLIENT_ORIGIN`
- WebSocket events power real‑time notifications
- Use `npm run seed` to explore the app with demo users

---

## Contributing

1. Fork and create a feature branch
2. Keep edits focused and well‑scoped
3. Run client and server locally; add screenshots/GIFs for UI changes
4. Open a PR with a clear description and testing notes

---

## FAQ

- **Why cookies, not localStorage?**
  Cookies allow httpOnly tokens and better refresh flows.

- **Getting CORS errors?**
  Ensure `CLIENT_ORIGIN` and `VITE_API_BASE` match your actual origins.

- **DB not connecting?**
  Verify `MONGODB_URI` is reachable from your environment and IP allow‑listed.

---

## License

MIT — feel free to use, learn, and build on it.

