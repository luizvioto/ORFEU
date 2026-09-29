# ORFEU

A full-stack web app for music students to organize their practice: a chord-sheet library, in-browser audio recording, a practice room with a metronome and timer, and a personal profile.

Final project for Introduction to Web Development at ICMC-USP.

## Tech stack

| Layer    | Technologies |
|----------|--------------|
| Frontend | React 19, Vite 8, React Router 7, Tailwind CSS 4, Axios, lucide-react, react-timer-hook |
| Backend  | Node.js, Express 5 (ES modules), Sequelize 6 ORM, Multer |
| Database | PostgreSQL |
| Auth     | JWT (`jsonwebtoken`), password hashing with `bcryptjs` |
| Browser APIs | MediaRecorder / `getUserMedia` for audio capture |

## Running locally

**Prerequisites:** Node.js 20+ and a running PostgreSQL instance.

### 1. Backend

Create `backend/.env`:

```env
DB_NAME=orfeu
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
AUTH_SECRET=a_long_random_secret
```

Install the dependencies, create the tables from the Sequelize models (one time only), then start the server on port 3000:

```bash
cd backend
npm install
node -e "import('./models/associations.js').then(({ User }) => User.sequelize.sync())"
node app.js
```

Run the server from inside `backend/`, because uploads are written to the relative `uploads/` directory.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open the URL Vite prints (default `http://localhost:5173`). The API base URL is set in `frontend/src/services/api.js`.

## Roadmap

- Teacher view: teachers follow their students' progress and recordings.
- Persist practice minutes on the server. They currently live in client state only.
- Apply owner checks to `GET/PUT/DELETE /cifras/:id`, as the audio routes already do.
- Move the API base URL to a Vite environment variable, and add request validation and automated tests.
