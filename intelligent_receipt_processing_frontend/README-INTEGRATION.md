# Intelligent Receipt Processing Frontend

This React app provides a responsive UI for:
- User authentication
- Uploading receipts/documents
- Viewing processed data and OCR output
- Searching documents
- Managing versions
- Monitoring processing jobs
- Admin dashboard for stats and users

## Environment variables
Create a .env file at the project root with:
- REACT_APP_API_BASE_URL: Base URL of the backend API (e.g., http://localhost:5000)

See .env.example for reference.

## Backend API endpoints expected
These pages call these endpoints (adjust in src/services/api.js if your backend differs):
- POST /auth/login
- GET /auth/me
- POST /documents/upload (multipart/form-data: file + metadata)
- GET /documents?page=&q=
- GET /documents/:id
- GET /documents/:id/versions
- GET /documents/:id/versions/:versionId
- GET /search?query...
- GET /jobs?status=&page=
- GET /jobs/:id
- GET /admin/stats
- GET /admin/users

If endpoints change, update src/services/api.js accordingly.

## Development
- npm install
- Create .env with REACT_APP_API_BASE_URL
- npm start

The app will start on port 3000. Ensure backend CORS allows requests from http://localhost:3000.
