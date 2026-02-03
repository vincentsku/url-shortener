# URL Shortener

A full-stack URL shortening service built with React, NestJS, and PostgreSQL.

## Features

- Shorten long URLs to compact, shareable links
- Click tracking for each shortened URL
- Clean, responsive UI
- URL validation
- Duplicate URL detection (returns existing short URL)

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- CSS Modules

**Backend:**
- Node.js + TypeScript
- NestJS framework
- TypeORM
- PostgreSQL

## Prerequisites

- Node.js 18+
- Docker & Docker Compose (for PostgreSQL)

## Quick Start

### 1. Start the database

```bash
docker-compose up -d
```

### 2. Install dependencies

```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 3. Run the application

Open two terminals:

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev
```
Backend runs on http://localhost:3001

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on http://localhost:5174

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/shorten` | Create a short URL |
| GET | `/api/stats/:code` | Get URL statistics |
| GET | `/:code` | Redirect to original URL |

### Example Request

```bash
curl -X POST http://localhost:3001/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com/very-long-url"}'
```

### Example Response

```json
{
  "id": "uuid",
  "originalUrl": "https://example.com/very-long-url",
  "shortCode": "ABC123",
  "shortUrl": "http://localhost:3001/ABC123",
  "clickCount": 0,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

## Technical Decisions

### Architecture

Standard NestJS modular architecture with clear separation:
- **Controller**: HTTP layer, request/response handling
- **Service**: Business logic, URL generation, database operations
- **Entity**: TypeORM entity mapping to PostgreSQL

### Short Code Generation

- 6-character alphanumeric codes (62^6 = 56+ billion combinations)
- Collision detection with retry mechanism (max 10 attempts)
- Index on `shortCode` column for fast lookups

### URL Handling

- Automatic HTTPS prefix if no protocol provided
- Validation using `class-validator`
- Duplicate detection: same original URL returns existing short URL

### Click Tracking

- Asynchronous increment (fire-and-forget) to avoid blocking redirects
- Stats endpoint to retrieve click counts

### Frontend

- Single-page app with form + result states
- Optimistic UI with loading states
- Copy-to-clipboard functionality
- Responsive design (mobile-friendly)

## Assumptions & Shortcuts

1. **No authentication** - URLs are publicly accessible
2. **No rate limiting** - Would add for production
3. **No URL expiration** - URLs persist indefinitely
4. **Single-node** - No distributed ID generation
5. **TypeORM synchronize** - Auto-creates tables (disable in production)

## Future Improvements

- User accounts and URL management
- Custom short codes
- URL expiration policies
- Analytics dashboard
- Rate limiting
- Redis caching for hot URLs

## Running Tests

```bash
cd backend
npm test
```

## Project Structure

```
url-shortener/
├── docker-compose.yml
├── README.md
├── backend/
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   ├── database/
│   │   │   └── database.module.ts
│   │   └── url/
│   │       ├── url.module.ts
│   │       ├── url.controller.ts
│   │       ├── url.service.ts
│   │       ├── url.entity.ts
│   │       └── dto/
│   └── package.json
└── frontend/
    ├── src/
    │   ├── main.tsx
    │   ├── App.tsx
    │   ├── api/
    │   ├── components/
    │   └── types/
    └── package.json
```
