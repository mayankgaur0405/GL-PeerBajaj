# GL Peer-to-Peer Resource & Referral Platform

Full-stack MERN app for GL Bajaj students to discover peers, share resources, and build mentorship connections.

## Tech Stack
- Client: React (Vite), TailwindCSS, React Router, Axios
- Server: Node.js, Express, MongoDB (Mongoose), JWT

## Quickstart

1) Server
```
cd server
# create .env with values below
npm install
npm run seed  # optional demo users
npm start
```

2) Client
```
cd client
# create .env with VITE_API_BASE=http://localhost:5000/api (optional)
npm install
npm run dev
```

Open client at http://localhost:5173

## Environment Variables

Server `.env`:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/gl_peer_platform
CLIENT_ORIGIN=http://localhost:5173
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

Client `.env`:
```
VITE_API_BASE=http://localhost:5000/api
```

## Available API Routes
- Auth: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/refresh`, `POST /api/auth/logout`
- Users: `GET /api/users/:id`, `GET /api/users/search?username=`, `POST /api/users/filter`, `GET /api/users/suggest`
- Follow: `POST /api/users/:id/follow`, `POST /api/users/:id/unfollow`
- Sections: `PUT /api/users/:id/sections` (upsert all), `POST /api/users/:id/sections`, `PUT /api/users/:id/sections/:sectionId`, `DELETE /api/users/:id/sections/:sectionId`, `POST /api/users/:id/sections/:sectionId/resources`, `PUT /api/users/:id/sections/:sectionId/resources/:resourceIndex`, `DELETE /api/users/:id/sections/:sectionId/resources/:resourceIndex`

## Notes
- Cookies are used for access/refresh tokens; CORS is configured for `CLIENT_ORIGIN`.
- Seed script creates demo users: `aarav`, `priya`, `rahul` (password: `password123`).
- Dashboard lets you manage sections/resources for your own profile.


