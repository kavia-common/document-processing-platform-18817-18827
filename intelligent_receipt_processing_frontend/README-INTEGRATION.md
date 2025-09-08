# Intelligent Receipt Processing Frontend

This React app provides a responsive UI for:
- User authentication
- Uploading receipts/documents
- Viewing processed data and OCR output
- Searching documents
- Managing versions
- Monitoring processing jobs
- Admin dashboard for monitoring

## Environment variables
Create a .env file at the project root with:
- REACT_APP_API_BASE_URL: Base URL of the backend API (e.g., http://localhost:5000)

See .env.example for reference.

## Backend API endpoints expected (aligned with provided OpenAPI)
These pages call these endpoints (adjust in src/services/api.js if your backend differs):
- POST /auth/login (returns { access_token })
- POST /documents (multipart/form-data: file + title [required], optional: description, tags)
- GET /documents?q=&page=
- GET /documents/:id
- GET /documents/:id/versions
- GET /documents/:id/versions/:versionId
- GET /search?q=&category=&tag=&limit=&offset=
- GET /jobs?status=&page=
- GET /jobs/:id
- GET /admin/documents (admin token)
- GET /admin/jobs (admin token)

If endpoints change, update src/services/api.js accordingly.

## Development
- npm install
- Create .env with REACT_APP_API_BASE_URL
- npm start

The app will start on port 3000. Ensure backend CORS allows requests from http://localhost:3000.
