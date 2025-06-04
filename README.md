# Window Explorer Project

A file explorer application with folder management capabilities.

## Features
- Create and manage folders
- Navigate folder hierarchy  
- Search folder contents
- Secure against XSS attacks
- Comprehensive testing

## Getting Started

### Prerequisites
- Node.js v18+
- Bun v1.0+
- PostgreSQL (for database)
- Redis (for caching)

### Installation Steps

1. **Clone the repository**
```bash
git clone https://github.com/your-repo/window-explorer.git
cd window-explorer
```

2. **Install dependencies**
```bash
bun install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```
Edit `.env` with your database credentials.

4. **Database setup**
```bash
bun prisma migrate dev --name init
```

5. **Run the application**
```bash
bun run dev
```

6. **Run tests**
```bash
bun test
```

7. **Run Cypress tests**
```bash
bun run cypress:open
```

## Development Workflow

1. **Branch naming**
```
feature/your-feature
fix/your-fix
```

2. **Commit messages**
Use conventional commits format:
```
feat: add folder creation
fix: resolve xss vulnerability
```

3. **Testing**
- Unit tests: `bun test`
- E2E tests: `bun run cypress:open`

## Security Features

The application includes:
- XSS protection
- Input validation
- Secure database queries
- Error handling

## API Documentation

See `API.md` for detailed endpoint documentation.

## Deployment

1. Build production version:
```bash
bun run build
```

2. Start production server:
```bash
bun start


