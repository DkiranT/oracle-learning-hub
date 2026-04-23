# Oracle Learning Hub

A full-stack web application to discover curated Oracle learning resources across docs, videos, and labs.

## Tech Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Data: In-memory mock JSON/JS dataset (26 resources + 3 learning paths)
- Optional AI recommendations via OpenAI Responses API

## Features

- Homepage with:
  - Smart search bar ("What do you want to learn?")
  - Category chips (`OCI`, `Autonomous DB`, `DevOps`, `Streaming`, `Kubernetes`, and more)
  - Sections for Trending Topics, Beginner Paths, Hands-on Labs
  - Bonus section: Recommended for you
- Search Results:
  - Grouped content sections: Docs, Videos, Labs
  - Filters by level and content type
  - Sort options (relevance, title, difficulty, source)
  - Pagination controls
- Resource Detail:
  - Full content metadata
  - Embedded YouTube preview (when available)
  - Source link, tags, suggested learning paths, related resources
- Learning Paths:
  - Predefined paths such as:
    - OCI Beginner to Architect
    - Streaming Deep Dive
  - Structured step-by-step progression
- Bookmarking:
  - Save/unsave resources using browser local storage

## Project Structure

```text
Oracle-Learning-Hub/
  backend/
    package.json
    src/
      server.js
      data/
        resources.js
        learningPaths.js
  frontend/
    package.json
    index.html
    tailwind.config.js
    postcss.config.js
    vite.config.js
    src/
      App.jsx
      main.jsx
      index.css
      api/client.js
      hooks/useBookmarks.js
      components/
      pages/
  README.md
```

## Getting Started

### 1. Start Backend API

```bash
cd backend
npm install
npm run dev
```

Backend runs at `http://localhost:5000`.

### 2. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

## Environment Notes

- Frontend API base URL defaults to `http://localhost:5000`.
- To override:
  - create `frontend/.env`
  - add:

```bash
VITE_API_BASE_URL=http://localhost:5000
```

## API Endpoints

- `GET /health`
- `GET /resources`
- `GET /resources/:id`
- `GET /search?q=keyword`
- `GET /learning-paths`
- `GET /recommendations`
- `POST /ai/recommend` (OpenAI-backed with fallback recommendations)

### Query Parameters

`GET /resources` and `GET /search` support:

- `type=docs|videos|labs`
- `level=Beginner|Intermediate|Advanced`
- `sort=relevance|title_asc|title_desc|difficulty_asc|difficulty_desc|source_asc|source_desc`
- `page=1`
- `limit=9`
- `category=OCI` (supported by `/resources`)
- `featured=trending|beginner|labs` (supported by `/resources`)

## OpenAI Recommendation Setup (Optional)

1. Create `backend/.env` from `backend/.env.example`.
2. Add your `OPENAI_API_KEY`.
3. Optionally set:
   - `OPENAI_MODEL` (default: `gpt-4.1-mini`)
   - `OPENAI_BASE_URL` (default: `https://api.openai.com/v1`)

Example API call:

```bash
curl -X POST http://localhost:5000/ai/recommend \
  -H "Content-Type: application/json" \
  -d "{\"prompt\":\"I want to learn OCI DevOps for Kubernetes\",\"level\":\"Intermediate\",\"type\":\"videos\"}"
```

If OpenAI is unavailable or not configured, the endpoint automatically returns curated fallback recommendations.

## Sample Data

Mock data is stored in:

- `backend/src/data/resources.js` (26 realistic Oracle resources)
- `backend/src/data/learningPaths.js` (3 predefined guided paths)

## Future Enhancements

- Add authentication for user-specific bookmark sync.
- Add server-side caching for repeated recommendation prompts.
