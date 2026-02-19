# LearnHub – Your Center for Skill Enhancement

An **Online Learning Platform (OLP)** built with the **MERN stack** (MongoDB, Express.js, React, Node.js). It supports user registration, course browsing and enrollment, progress tracking, certificates, payments for paid courses, teacher course management, and admin oversight.

## Features

- **User roles**: Student, Teacher, Admin
- **Auth**: Register, login, JWT-based sessions
- **Courses**: Catalog with filters (category, difficulty, search), course detail, free/paid
- **Enrollment**: Enroll in courses, continue learning, progress saved
- **Learning**: Section/lesson navigation, mark lessons complete, progress bar
- **Certificates**: Issue and view certificates after course completion; verify by ID
- **Payments**: Simulated payment flow for paid courses (integrate Stripe/Razorpay in production)
- **Teacher**: Create courses, publish/unpublish, view enrollments
- **Admin**: User list, change roles, platform stats, publish courses
- **Discussion**: Course discussions and replies (API ready)

## Tech Stack

| Layer    | Technology        |
|----------|-------------------|
| Frontend | React 18, Vite, React Router, Bootstrap 5, Material UI, Axios |
| Backend  | Node.js, Express.js |
| Database | MongoDB (Mongoose) |

## Prerequisites

- **Node.js** 18+
- **MongoDB** (local or Atlas)
- **npm** or **yarn**

## Setup

### 1. Clone and install

```bash
cd finalyearproject
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edit .env: set MONGODB_URI and JWT_SECRET
npm install
```

Create `.env` (or copy from `.env.example`):

- `PORT=5000`
- `MONGODB_URI=mongodb://localhost:27017/learnhub`
- `JWT_SECRET=your-secret-key`

### 3. Seed database (optional)

```bash
node scripts/seed.js
```

This creates:

- **Admin**: admin@learnhub.com / admin123  
- **Teacher**: john@learnhub.com / teacher123  
- **Student**: sarah@learnhub.com / student123  

And two sample courses: “Web Development Fundamentals” (free) and “Advanced Web Development” (paid).

### 4. Start backend

```bash
npm run dev
# or: npm start
```

API runs at **http://localhost:5000**.

### 5. Frontend

```bash
cd ../frontend
npm install
npm run dev
```

App runs at **http://localhost:3000** and proxies `/api` to the backend.

## Usage (Scenario: Learning a New Skill)

1. **Register**: Sign up as a student (e.g. Sarah).
2. **Browse**: Open **Courses**, filter by category/difficulty, search.
3. **Enroll**: Open “Web Development Fundamentals” → **Enroll Now**.
4. **Learn**: Go to **My Learning** → **Continue** → go through sections/lessons, mark complete.
5. **Certificate**: When progress is 100%, click **Get certificate**, then open **My Certificates**.
6. **Paid course**: For “Advanced Web Development”, click Enroll → redirect to Payment → complete simulated payment → enroll and learn.
7. **Teacher**: Log in as john@learnhub.com → **Teach** → create courses, publish, see enrollments.
8. **Admin**: Log in as admin@learnhub.com → **Admin** → manage users (roles), view stats.

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /api/auth/register | Register |
| POST   | /api/auth/login    | Login |
| GET    | /api/auth/me       | Current user (protected) |
| GET    | /api/courses       | List courses (query: category, difficulty, search, sort) |
| GET    | /api/courses/categories | Categories list |
| GET    | /api/courses/:id   | Course detail |
| POST   | /api/courses       | Create course (teacher/admin) |
| PUT    | /api/courses/:id   | Update course (teacher/admin) |
| GET    | /api/enrollments/me | My enrollments |
| POST   | /api/enrollments   | Enroll in course |
| GET    | /api/progress/:enrollmentId | Get progress |
| PUT    | /api/progress/:enrollmentId | Update progress / mark lesson complete |
| POST   | /api/payments      | Create payment (simulated) |
| POST   | /api/certificates  | Issue certificate |
| GET    | /api/certificates/me | My certificates |
| GET    | /api/certificates/verify/:id | Verify certificate (public) |
| GET    | /api/admin/stats   | Admin stats |
| GET    | /api/admin/users   | Admin user list |
| PUT    | /api/admin/users/:id/role | Admin change user role |

## Project Structure

```
finalyearproject/
├── backend/
│   ├── config/db.js
│   ├── middleware/auth.js
│   ├── models/          (User, Course, Enrollment, Progress, Payment, Certificate, Discussion)
│   ├── routes/          (auth, courses, enrollments, progress, payments, certificates, discussions, admin)
│   ├── scripts/seed.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/axios.js
│   │   ├── components/  (Navbar, Footer)
│   │   ├── context/AuthContext.jsx
│   │   └── pages/       (Home, Login, Register, CourseCatalog, CourseDetail, Learning, Dashboard, Certificates, Payment, TeacherDashboard, AdminDashboard, VerifyCertificate)
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## License

MIT.
