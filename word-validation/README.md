# Word Validation Service

This is an Express.js microservice responsible for validating if a given word exists in a dictionary. It is part of the **WordDance** project.

The service uses a [Trie](https://en.wikipedia.org/wiki/Trie) data structure (`seshat-trie`) for fast, prefix-based word lookups, making it highly efficient. On startup, it loads a dictionary from `data/words.txt` into memory.

## API Endpoint

### Check if a word is valid

Checks for the existence of a word in the dictionary.

- **Endpoint:** `POST /api/v1/words/:word`
- **Method:** `POST`
- **URL Params:**
  - `word` (string, required): The word to validate.
- **Request Body:** None
- **Success Response (200 OK):**
  ```json
  {
    "isValid": true
  }
  ```
  or
  ```json
  {
    "isValid": false
  }
  ```
- **Error Response (400 Bad Request):** If the word parameter is invalid.

**Example using cURL:**
```bash
curl -X POST http://localhost:3000/api/v1/words/hello
```

## Quick Start

### Prerequisites

You must have a `words.txt` file inside the `data/` directory. This file should contain a newline-separated list of words. It is ignored by git and not included in the Docker image.

### Installation & Running

```bash
# Install dependencies
npm install

# Run in development mode (with hot reload)
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Run production build
npm start
```

## Docker

You can build and run this service using Docker.

**Important:** The `data/words.txt` file is not included in the Docker image and must be mounted as a volume at runtime.

```bash
# 1. Build the Docker image
docker build -t word-validation-service .

# 2. Run the container with the words.txt volume
docker run -p 3000:3000 \
  -v ./data/words.txt:/app/data/words.txt \
  word-validation-service
```

## Project Structure

```
.
├── Dockerfile
├── jest.config.ts
├── package.json
├── README.md
├── data
│   └── words.txt  (NOTE: Must be provided locally)
└── src
    ├── app.ts              # Express app setup
    ├── main.ts             # Server startup and trie initialization
    ├── config/             # Configuration (env, swagger)
    ├── controllers/        # Route handlers (business logic)
    ├── middleware/         # Express middleware
    ├── routes/             # API route definitions
    ├── service/            # Core services (Trie service)
    ├── test/               # Test setup and utilities
    ├── types/              # Global type definitions
    └── utils/              # Utility functions (logger, etc.)
```

## Environment Variables

| Variable | Default | Description |
|------------------------------------------|-----------------------------------|--------------------------------------------------|
| `NODE_ENV` | `development` | Environment mode (`development`, `production`, `test`) |
| `PORT` | `3000` | Server port |
| `LOG_LEVEL` | `info` | Winston log level |
| `SERVICE_NAME` | `base-backend` | Service name for logs |
| `MAX_LOG_SIZE` | `20m` | Maximum size of a log file before rotation |
| `MAX_LOG_FILES` | `14d` | Number of days to keep log files |
| `COMPRESS_LOGS` | `true` | Whether to compress rotated log files |
| `CORS_ORIGIN` | `*` | Allowed origins (comma-separated or `*`) |
| `CORS_METHODS` | `GET,POST,PUT,PATCH,DELETE,OPTIONS` | Allowed HTTP methods (comma-separated) |
| `CORS_CREDENTIALS` | `false` | Allow credentials with CORS requests |
| `RATE_LIMIT_WINDOW_MS` | `900000` (15 mins) | Time window for rate limiting |
| `RATE_LIMIT_MAX` | `100` | Max requests per window per IP |

## Key Patterns

### Error Handling

Throw `AppError` for operational errors (e.g., resource not found, invalid input). This ensures a consistent error response format.

```typescript
import { AppError } from "../middleware/errorHandler";

throw new AppError(404, "Resource not found");
```

### Validation

Use Zod schemas with the `validate` middleware to automatically validate request `body`, `query`, or `params`.

```typescript
import { validate } from "../middleware/validate";

const wordParamSchema = {
  params: z.object({
    word: z.string().min(1)
  })
};

router.post("/:word", validate(wordParamSchema), handler);
```

### Async Handlers

Wrap asynchronous route controllers with `asyncHandler` to automatically catch promise rejections and pass them to the global error handler.

```typescript
import asyncHandler from "../utils/asyncHandler";

router.get("/", asyncHandler(async (req, res) => {
  const data = await someAsyncOperation();
  res.json(data);
}));
```

### Logging

A pre-configured Winston logger is available for structured, leveled logging with file rotation.

```typescript
import logger from "../utils/logger";

logger.info("Trie service initialized successfully.");
logger.error("Failed to load words.txt file.", { error: "File not found at specified path" });
```