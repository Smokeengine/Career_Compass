# Career Compass 

Career Compass is a full stack job portal web application that connects job seekers with companies.

It includes a React + Vite frontend for job discovery and profile management, and a Node.js + Express + MongoDB backend that supports authentication, company profiles, and job posting APIs.

---
## Live Demo

- **Deployed App:** [https://career-compasss.netlify.app/user-auth]
- You can Login using the user account where email id: test@12example.com and password: password123
---

## Features

### Job Seeker
- Register and sign in
- Browse jobs with filters
- Search jobs by title/type
- Filter by location, job type, and experience
- View job details and similar jobs
- Edit user profile (basic info, job title, about, profile image)

### Company
- Register and sign in as a company
- Update company profile (name, contact, location, about, logo/profile image)
- Create job posts
- View company profile and company job listings
- Update and delete job posts

### Platform / Backend
- JWT based authentication (Bearer token)
- MongoDB models for users, companies, jobs, and email verification tokens
- Rate limiting on auth and company auth routes
- Security middleware (`xss-clean`, `express-mongo-sanitize`)
- Request logging with `morgan`

---

## Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- Redux Toolkit + React Redux
- React Router DOM
- Axios
- React Hook Form
- Headless UI
- React Icons

### Backend
- Node.js
- Express
- MongoDB + Mongoose
- JWT (`jsonwebtoken`)
- bcryptjs
- dotenv
- cors
- express-rate-limit
- morgan

---

## Project Structure

```text
Career_Compass-master/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   └── utils/
│   └── package.json
└── server/                 # Express + MongoDB backend
    ├── controllers/
    ├── dbConfig/
    ├── middlewares/
    ├── models/
    ├── routes/
    ├── utils/
    ├── server.js
    └── package.json
```

---

## API Base URL

Backend server runs on:

```bash
http://localhost:8800
```

API prefix used by the app:

```bash
http://localhost:8800/api-v1
```

The frontend currently hardcodes this base URL in:

- `client/src/utils/index.js`

---

## Getting Started

### Prerequisites
- Node.js 18+ recommended
- npm
- MongoDB Atlas or local MongoDB instance

---

## 1) Clone the Repository

```bash
git clone <your-repo-url>
cd Career_Compass-master
```

---

## 2) Setup the Backend (server)

```bash
cd server
npm install
```

### Create a `.env` file in `server/`

Use this format:

```env
MONGODB_URL=mongodb+srv://<username>:<password>@<cluster>/<database>
JWT_SECRET_KEY=your_strong_secret_key
PORT=8800
```

### Start the backend

```bash
npm start
```

This project uses `nodemon` through the `start` script.

---

## 3) Setup the Frontend (client)

Open a new terminal:

```bash
cd client
npm install
npm run dev
```

Frontend will usually run at:

```bash
http://localhost:5173
```

---

## How to Use

### For Job Seekers
1. Open the frontend
2. Register as **User Account**
3. Sign in
4. Search and filter jobs
5. Open a job to view details
6. Update your profile from the user profile page

### For Companies
1. Open the frontend
2. Register as **Company Account**
3. Sign in
4. Complete company profile (name, contact, location, about, logo)
5. Go to **Upload Job** and publish job posts
6. Manage company profile and listed jobs

---

## Main API Routes

### Auth (Job Seeker)
- `POST /api-v1/auth/register`
- `POST /api-v1/auth/login`

### Users
- `GET /api-v1/users/verify/:userId/:token` (email verification endpoint exists)
- `POST /api-v1/users/get-user` (protected)
- `PUT /api-v1/users/update-user` (protected)

### Companies
- `POST /api-v1/companies/register`
- `POST /api-v1/companies/login`
- `GET /api-v1/companies`
- `GET /api-v1/companies/get-company/:id`
- `POST /api-v1/companies/get-company-profile` (protected)
- `POST /api-v1/companies/get-company-joblisting` (protected)
- `PUT /api-v1/companies/update-company` (protected)

### Jobs
- `POST /api-v1/jobs/upload-job` (protected)
- `PUT /api-v1/jobs/update-job/:jobId` (protected)
- `GET /api-v1/jobs/find-jobs`
- `GET /api-v1/jobs/get-job-detail/:id`
- `DELETE /api-v1/jobs/delete-job/:id` (protected)

> Protected routes require `Authorization: Bearer <token>`

---

## Query Parameters Supported (Jobs)

`GET /api-v1/jobs/find-jobs`

Supports filters like:
- `search`
- `sort` (`Newest`, `Oldest`, `A-Z`, `Z-A`)
- `location`
- `jtype` (comma separated values, for example `Full-Time,Part-Time`)
- `exp` (range string, for example `2-6`)
- `page`
- `limit`

---

## Notes and Important Cleanup (Recommended Before Publishing)

This repo works as a learning/demo full stack project, but there are a few things you should clean up before making it public or production ready.

- **Do not commit `.env` files** with real secrets
- **Rotate the MongoDB credentials and JWT secret immediately** if they were pushed to GitHub
- Backend code expects `JWT_SECRET_KEY`, so make sure the env key name matches exactly
- `server/node_modules/` is included in this copy and should be removed from the repo
- Move hardcoded frontend config values (API URL and Cloudinary settings) into environment variables
- Replace placeholder content in the About page and demo data with real content

---

## Troubleshooting

### Backend starts but auth fails with JWT error
Check your env key name. The code reads:

```env
JWT_SECRET_KEY
```

If the key name is different, token generation and verification will fail.

### Frontend cannot connect to backend
- Confirm backend is running on port `8800`
- Confirm frontend `API_URL` points to `http://localhost:8800/api-v1`
- Check browser console and server terminal logs
- Make sure MongoDB connection is valid and backend booted successfully

### Images are not uploading
The frontend uses Cloudinary upload settings in `client/src/utils/index.js`. Update cloud name and upload preset if you are using your own Cloudinary account.

---

## Future Improvements

- Add role based route protection on frontend and backend
- Add job application flow for seekers
- Add resume upload storage and download support
- Add pagination with proper skip/limit on all list endpoints
- Add validation schemas (Joi/Zod/express-validator)
- Add tests (unit + integration)
- Add Docker support and deployment configs
- Add `.env.example` files for client and server

---

## License

No license is currently specified in the project.

If you plan to publish this repo, add a license (for example MIT) to clarify reuse terms.
