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
  - Scope toggle: Web Search (Oracle ecosystem) vs Curated Library
  - Grouped content sections: Docs, Videos, Blogs, Labs
  - Filters by level and content type
  - Sort options (relevance, title, difficulty, source)
  - Pagination controls
- Resource Detail:
  - Full content metadata
  - Embedded YouTube preview (when available)
  - On-demand grounded technical summary (quick steps + technical coverage + source snippets)
  - Source link, tags, suggested learning paths, related resources
- Learning Paths:
  - Predefined paths such as:
    - OCI Beginner to Architect
    - Streaming Deep Dive
  - Structured step-by-step progression
- Knowledge Hub:
  - Backend-curated topic bundles for OIC Gen3, REST Adapter, Agentic AI, and Fusion/EPM REST
  - AI-assisted URL curator that drafts Knowledge Base records from docs, blogs, videos, and labs
  - Dropdown-based Oracle SaaS API payload explorer (suite/module/operation)
  - Ready sample request/response payloads for ERP, Procurement, HCM, SCM, CX, Projects, and EPM APIs
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
        knowledgeHub.js
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
        KnowledgeHubPage.jsx
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
- `POST /resources/:id/summary`
- `GET /search?q=keyword`
- `GET /search/web?q=keyword`
- `GET /learning-paths`
- `GET /recommendations`
- `GET /knowledge/topics`
- `GET /knowledge/base`
- `GET /knowledge/apis`
- `POST /knowledge/curate/analyze`
- `POST /knowledge/curate/approve`
- `GET /resolve/topic?q=`
- `POST /ai/recommend` (OpenAI-backed with fallback recommendations)

### Query Parameters

`GET /resources` and `GET /search` support:

- `type=docs|videos|blogs|labs`
- `level=Beginner|Intermediate|Advanced`
- `sort=relevance|title_asc|title_desc|difficulty_asc|difficulty_desc|source_asc|source_desc`
- `page=1`
- `limit=9`
- `category=OCI` (supported by `/resources`)
- `featured=trending|beginner|labs` (supported by `/resources`)

`GET /search/web` additionally searches across live Oracle ecosystem sources:

- `docs.oracle.com`
- `blogs.oracle.com`
- `youtube.com`
- `github.com/oracle`

Knowledge endpoints:

- `GET /knowledge/topics?q=&type=docs|videos|blogs|labs`
- `GET /knowledge/base?q=&sourceType=docs&topic=REST%20Adapter`
- `GET /knowledge/apis?suite=ERP&module=AP&operation=Create%20AP%20Invoice&q=payload`
- `POST /knowledge/curate/analyze` with `{ "url": "https://docs.oracle.com/..." }`
- `POST /knowledge/curate/approve` with `{ "draft": { ... } }`
- `GET /resolve/topic?q=oic+gen3&type=docs` (backend-curated URL redirect)

## OpenAI AI Features Setup (Optional)

1. Create `backend/.env` from `backend/.env.example`.
2. Add your `OPENAI_API_KEY`.
3. Optionally set:
   - `OPENAI_MODEL` (default: `gpt-4.1-mini`)
   - `OPENAI_BASE_URL` (default: `https://api.openai.com/v1`)
   - `ADMIN_ACCESS_KEY` (required to unlock the AI Knowledge Curator on public deployments)
   - `WEB_SEARCH_ENGINE_URL` (default: `https://duckduckgo.com/html/`)
   - `WEB_SEARCH_PER_SOURCE` (default: `5`)

Example API call:

```bash
curl -X POST http://localhost:5000/ai/recommend \
  -H "Content-Type: application/json" \
  -d "{\"prompt\":\"I want to learn OCI DevOps for Kubernetes\",\"level\":\"Intermediate\",\"type\":\"videos\"}"
```

If OpenAI is unavailable or not configured, recommendation, summary, and URL-curation features automatically use local fallback logic.
The AI Knowledge Curator still requires `ADMIN_ACCESS_KEY`; public users can search/read the hub but cannot import or approve URLs without that key.

Resource summary API example:

```bash
curl -X POST http://localhost:5000/resources/res-001/summary \
  -H "Content-Type: application/json" \
  -d "{}"
```

If OpenAI is unavailable, summary still works using grounded extractive fallback from fetched source text and resource metadata.

## Sample Data

Mock data is stored in:

- `backend/src/data/resources.js` (26 realistic Oracle resources)
- `backend/src/data/learningPaths.js` (3 predefined guided paths)
- `backend/src/data/knowledgeBase.js` (RAG-ready local knowledge index)
- `backend/src/data/approvedKnowledgeItems.json` (AI-curated approved Knowledge Base items)
- `backend/src/data/knowledgeHub.js` (manual topic resources)
- `backend/src/data/fusionApiPlaybooks.js` (Oracle SaaS REST API payload playbooks)

## Manual URL Curation (Backend-Controlled)

To add your own topic-specific links without changing frontend code:

1. Edit `backend/src/data/knowledgeHub.js`
2. Add/update entries under:
   - `manualTopicCollections` for topic docs/videos/blogs/labs
3. Edit `backend/src/data/fusionApiPlaybooks.js` for API endpoints and payload samples
4. Or use the Knowledge Hub AI-assisted curator to paste a URL, review the draft, and approve it.
5. Restart backend (`npm run dev`) if you edited backend files manually.

## Future Enhancements

- Add authentication for user-specific bookmark sync.
- Add server-side caching for repeated recommendation prompts.
