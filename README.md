# GFG Community Platform

Production-ready full-stack web app for managing a GeeksforGeeks community: public site, dashboards, and API.

## Tech Stack
- Frontend: Next.js + Tailwind CSS
- Backend: Node.js + Express
- Database: PostgreSQL (Neon serverless)
- Auth: Custom ID + Password, JWT sessions

## Project Structure
- `frontend` – Next.js app (public site + dashboards)
- `backend` – Express API + Postgres access

Within the Next.js app:
- Public site: `frontend/app/(public)`
- Admin dashboard: `frontend/app/admin`
- Leader dashboard: `frontend/app/leader`
- Member dashboard: `frontend/app/member`

## Database Setup (Neon + Prisma)
1. Create a Neon Postgres database.
2. Copy the connection string and set `DATABASE_URL` in `backend/.env`.
3. Generate Prisma client and run migrations:

```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
```

If you already have an existing schema, you can skip migrations and just point `DATABASE_URL` to it.

## Seed Default Accounts
```bash
cd backend
npm install
npm run seed
```

Default credentials:
- Admin: `gfg_admin` / `secure_password`
- Leader: `leader01` / `leader_password`
- Member: `member01` / `member_password`

## Create Your Own Login (ID + Password)
Use this helper script to create a custom login (admin/leader/member):

```bash
cd backend
npm run user:create -- admin your_admin_id your_password "Admin Name"
```

Examples:
```bash
npm run user:create -- leader leader02 mypass "Team Leader"
npm run user:create -- member member05 mypass "GFG Member"
```

## Run Backend
```bash
cd backend
cp .env.example .env
# Fill DATABASE_URL + JWT_SECRET
npm install
npm run dev
```

Backend runs at `http://localhost:4000`.

## Run Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend runs at `http://localhost:3000`.

## API Routes
Authentication
- `POST /api/admin/login`
- `POST /api/leader/login`
- `POST /api/member/login`
- `GET /api/me`

Events
- `GET /api/events`
- `POST /api/events`
- `PUT /api/events/:id`
- `DELETE /api/events/:id`

Workshops
- `GET /api/workshops`
- `POST /api/workshops`
- `PUT /api/workshops/:id`
- `DELETE /api/workshops/:id`

Team Members
- `GET /api/team-members`
- `POST /api/team-members`
- `PUT /api/team-members/:id`
- `DELETE /api/team-members/:id`

Announcements
- `GET /api/announcements`
- `POST /api/announcements`
- `PUT /api/announcements/:id`
- `DELETE /api/announcements/:id`

Resources
- `GET /api/resources`
- `POST /api/resources`
- `PUT /api/resources/:id`
- `DELETE /api/resources/:id`

Gallery
- `GET /api/gallery`
- `POST /api/gallery`
- `DELETE /api/gallery/:id`

Stats
- `GET /api/stats`

Registrations
- `POST /api/events/register`
- `POST /api/workshops/register`

Admin-only user management
- `GET /api/members`
- `POST /api/members`
- `DELETE /api/members/:id`
- `GET /api/leaders`
- `POST /api/leaders`
- `DELETE /api/leaders/:id`

## Notes
- Protected dashboard routes are guarded by Next.js middleware and JWT cookies.
- Gallery uploads are stored in `backend/uploads` for local dev.

## Pagination & Filters
The following endpoints support server-side pagination and filters:
- `GET /api/events?page=1&limit=10&search=graph&status=upcoming`
- `GET /api/workshops?page=1&limit=10&search=postgres&level=Beginner`
- `GET /api/resources?page=1&limit=10&search=roadmap&category=Web`

Paginated responses are returned as:
```json
{
  "data": [],
  "meta": { "total": 0, "page": 1, "limit": 10 }
}
```

## Deployment Prep
### Neon (Database)
1. Create a Neon Postgres database.
2. Copy the connection string into `DATABASE_URL`.

### Render (Backend)
1. Create a new Web Service from the `backend` folder.
2. Set build command to `npm install`.
3. Set start command to `npm run start`.
4. Add environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `CORS_ORIGIN` (your Vercel app URL)
   - `NODE_ENV=production`

### Fly.io (Backend alternative)
1. Initialize Fly in the `backend` folder (`fly launch`).
2. Set secrets:
   - `fly secrets set DATABASE_URL=... JWT_SECRET=... CORS_ORIGIN=...`
3. Deploy with `fly deploy`.

### Vercel (Frontend)
1. Import the `frontend` folder as a project.
2. Set `NEXT_PUBLIC_API_URL` to your backend URL.
3. Deploy.

## Environment Hardening
- `JWT_SECRET` is required and must be strong in production.
- `CORS_ORIGIN` is restricted to trusted origins (comma-separated for multiple).
- Rate limiting and security headers are enabled via `express-rate-limit` and `helmet`.

## Cloudinary (Gallery Uploads)
Set these in `backend/.env`:
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Gallery uploads now use Cloudinary. You can still provide a direct image URL if needed.
# GFG-Community
