# AI-Powered Personal Finance Dashboard

A full-stack web application to manage personal finances with transaction tracking, category-wise spending insights, and AI-driven recommendations.

## Features
- User authentication (login/register) with JWT and secure cookie storage.
- Create, view, delete, and filter transactions by category/date.
- Visualize spending patterns with Chart.js bar charts.
- AI-generated spending insights and recommendations.

## Tech Stack
- **Front-End**: React, Vite, Redux Toolkit, Tailwind CSS, Chart.js
- **Back-End**: Node.js, Express, MongoDB, Mongoose
- **Security**: JWT, AES-encrypted cookies, CORS

## Setup
1. Clone the repo: `git clone https://github.com/your-username/personal-finance-dashboard.git`
2. Install dependencies:
   - Backend: `cd server && npm install`
   - Frontend: `cd client-vite && npm install`
3. Set up `.env` in `server` with `MONGO_URI` and `JWT_SECRET`.
4. Run backend: `cd server && node index.js`
5. Run frontend: `cd client-vite && npm run dev`
6. Open `http://localhost:5173`.

## License
MIT