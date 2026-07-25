# CampusRAG

![GitHub last commit](https://img.shields.io/github/last-commit/MasterIfeanyi/campusRAG)
![GitHub issues](https://img.shields.io/github/issues/MasterIfeanyi/campusRAG)
![GitHub license](https://img.shields.io/github/license/MasterIfeanyi/campusRAG)

**CampusRAG** is an AI‑powered, Retrieval‑Augmented Generation (RAG) knowledge base that surfaces real stories and resources. It provides a clean, modern UI for searching, browsing, and interacting with university‑related information using natural language.

---

## Why CampusRAG?
- **AI‑enhanced** – Leverages large language models to understand plain‑language queries and return concise answers.
- **Secure & Scalable** – Built with Next.js 16, MongoDB, and Next‑Auth for authentication.

---

## Features
- **Responsive modern UI** – TailwindCSS gives a fluid experience on desktop, tablet, and mobile.
- **User authentication** – Sign‑in with Next‑Auth (OAuth/Email) and role‑based access.
- **Search & filtering** – Full‑text search powered by a RAG pipeline.
- **Profile management** – Personalised profile page with back navigation and responsive typography.

---

## Tech Stack
| Layer | Technology |
|-------|------------|
| Front‑end | **Next.js 16** (App Router), **TailwindCSS**, **React Icons** |
| Back‑end | **Node.js**, **MongoDB**, **Mongoose** |
| Authentication | **next‑auth** (session handling) |
| AI/ML | **Google Gemini** embeddings, custom RAG pipeline |

---

## Project Structure
```
src/
├── app/               # Next.js App Router pages
├── components/        # Re‑usable UI components (Navbar, ActionMenu, etc.)
├── context/           # React context providers
├── data/              # Seed data / fixture files
├── hooks/             # Custom React hooks (useSession, useReviewQueries)
├── pages/             # Legacy pages (if any)
├── routes/            # API route handlers
├── services/          # Business logic (AI, Mongo queries)
├── icons/registry.js  # Central icon registry
└── ...                # Other top‑level files (App.jsx, main.jsx)
```

---

## Getting Started
### Prerequisites
- **Node.js** ≥ 18 (recommended)
- **npm** (or **yarn**/ **pnpm**) 
- Access to a MongoDB instance (local or Atlas)
- **Google Gemini API key** for embeddings (set in `.env.local`)

### Installation
```bash
# Clone the repo
git clone https://github.com/MasterIfeanyi/campusRAG.git
cd campusRAG

# Install dependencies
npm install
```

### Environment variables
Create a `.env.local` file at the project root:
```dotenv
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your‑nextauth‑secret
GOOGLE_GENERATIVE_AI_API_KEY=your‑gemini‑api‑key
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/campusRAG?retryWrites=true&w=majority
```
> **Tip:** Use `openssl rand -base64 32` to generate a strong `NEXTAUTH_SECRET`.

### Run the development server
```bash
npm run dev
```
Open <http://localhost:3000> in your browser.

---

## Testing & Linting
```bash
# Run unit & integration tests (if configured)
npm test

# Run ESLint + Prettier checks
npm run lint
```

---

## Scripts
| Script | Description |
|--------|-------------|
| `dev` | Starts the Next.js dev server |
| `build` | Generates an optimized production build |
| `start` | Runs the production build locally |
| `lint` | Runs ESLint and Prettier |
| `test` | Executes Jest test suite |

---

## Contributing
1. **Fork** the repository.
2. **Create a branch** for your feature or bugfix:
   ```bash
   git checkout -b <your‑username>/<feature‑name>
   ```
3. **Commit** your changes with a clear message.
4. **Push** to your fork and open a Pull Request.
5. Ensure all CI checks pass before merging.

### Code style
- Use **Prettier** formatting (`npm run lint`).
- Follow the existing component naming conventions (PascalCase for components, camelCase for hooks).
- Write descriptive commit messages (e.g., `feat(ui): add responsive back button`).

---

## License
Distributed under the **MIT License**. See `LICENSE` for more information.

---

*Happy coding!*