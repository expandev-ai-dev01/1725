# NoteBox - Backend API

Backend API for NoteBox, a lightweight application for creating quick notes with search and tag categorization.

## Technology Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MS SQL Server
- **Architecture**: REST API

## Project Structure

```
src/
├── api/                    # API controllers
│   └── v1/                 # API Version 1
│       ├── external/       # Public endpoints
│       └── internal/       # Authenticated endpoints
├── routes/                 # Route definitions
│   └── v1/                 # Version 1 routes
├── middleware/             # Express middleware
├── services/               # Business logic
├── utils/                  # Utility functions
├── config/                 # Configuration
└── server.ts               # Application entry point
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MS SQL Server instance
- npm or yarn package manager

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration

4. Start development server:
   ```bash
   npm run dev
   ```

### Build for Production

```bash
npm run build
npm start
```

## API Endpoints

### Health Check
- `GET /health` - API health status

### API Versioning

All API endpoints are versioned:
- External (public): `/api/v1/external/...`
- Internal (authenticated): `/api/v1/internal/...`

## Development Guidelines

- Follow TypeScript strict mode
- Use 2-space indentation
- Maximum 120 characters per line
- Always use semicolons
- Document all functions with TSDoc comments

## Environment Variables

See `.env.example` for all available configuration options.

## License

ISC
