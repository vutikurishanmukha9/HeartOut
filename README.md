# HeartOut - Personal Storytelling Platform

<div align="center">

**Where every story matters.**

A modern, premium storytelling platform for authentic personal expression.

[![GitHub](https://img.shields.io/badge/GitHub-vutikurishanmukha9%2FHeartOut-blue)](https://github.com/vutikurishanmukha9/HeartOut)
[![CI](https://github.com/vutikurishanmukha9/HeartOut/actions/workflows/ci.yml/badge.svg)](https://github.com/vutikurishanmukha9/HeartOut/actions/workflows/ci.yml)
[![Tests](https://img.shields.io/badge/Tests-144+-brightgreen)](https://github.com/vutikurishanmukha9/HeartOut/actions)
[![Coverage](https://img.shields.io/badge/Coverage-70%25-yellow)](https://github.com/vutikurishanmukha9/HeartOut)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://python.org)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://react.dev)

</div>

---

## Features

### Story Categories
| Category | Description |
|----------|-------------|
| **Achievements** | Celebrate victories and milestones |
| **Regrets** | Share lessons from difficult experiences |
| **Unsent Letters** | Express words never said |
| **Sacrifices** | Document what you gave up |
| **Life Stories** | Share your personal journey |
| **Other** | Uncategorized narratives |

### Premium UI
- **Glass Morphism Design** - Modern, translucent components
- **Warm Sunset Palette** - Coral, amber, and rose tones
- **Micro-animations** - Smooth transitions and hover effects
- **Dark Mode** - Persistent eye-friendly reading experience
- **Responsive** - Works on desktop, tablet, and mobile

### Key Features
- Anonymous posting option
- 5 reaction types (Love, Inspiring, Save, Hug, Mind-blown)
- **Smart Category-Based Ranking** - Unique algorithm per story type (Learning-to-Rank, Emotion-Similarity, etc.)
- **Bookmark/Save Stories** - Save stories for later with engagement tracking
- **Read Progress Tracking** - Scroll depth and time spent analytics
- **Story Analytics Dashboard** - Interactive pie chart with category breakdown
- Draft management
- Story search
- User statistics
- Reading time estimates
- Comment system
- **Post deletion** - Authors can delete their own stories
- **Profile page** - User profiles with story filtering by category
- **Settings page** - Theme toggle, password change, account deletion
- **Mental Health Support** - Integrated helplines (Tele MANAS, iCall) with floating button
- **Cold Start UX** - Friendly notification when server wakes from sleep
- **Dynamic SEO** - Open Graph/Twitter Cards for story sharing previews
- **Accessibility (A11y)** - Skip-to-content, ARIA labels, keyboard navigation, 95+ Lighthouse target
- **CI/CD Pipeline** - GitHub Actions for automated testing on every push

---

## Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| **FastAPI** | Modern async Python web framework |
| **SQLAlchemy 2.0** | Async database ORM |
| **Pydantic v2** | Data validation |
| **Uvicorn** | ASGI server |
| **SlowAPI** | Rate limiting |
| JWT (PyJWT) | Authentication |

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| Vite | Build tool |
| Tailwind CSS | Styling |
| Lucide React | Icons |
| React Router | Navigation |
| **Recharts** | Data visualization |
| **react-helmet-async** | Dynamic SEO meta tags |

---

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/vutikurishanmukha9/HeartOut.git
cd HeartOut

# Backend setup
cd backend
python -m venv venv
.\venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
cp .env.example .env

# Frontend setup
cd ../frontend
npm install
```

### Running

```bash
# Terminal 1 - Backend (http://localhost:8000)
cd backend
.\venv\Scripts\activate
python -m uvicorn app.main:app --reload --port 8000

# Terminal 2 - Frontend (http://localhost:5173)
cd frontend
npm run dev
```

> **Note:** API docs are available at http://localhost:8000/api/docs (Swagger UI)

---

## Project Structure

```
HeartOut/
├── backend/
│   ├── app/                    # FastAPI application
│   │   ├── api/v1/             # API routes (auth, posts, admin)
│   │   ├── core/               # Config, database, security
│   │   ├── models/             # SQLAlchemy models
│   │   ├── schemas/            # Pydantic schemas
│   │   ├── services/           # Business logic layer
│   │   ├── tests/              # 141 pytest tests
│   │   ├── utils/              # Validators, helpers
│   │   └── main.py             # FastAPI app entry
│   ├── flask_app_legacy/       # Archived Flask app (not in use)
│   └── requirements.txt        # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Page components
│   │   ├── context/            # Auth & Theme providers
│   │   └── routes/             # Route configurations
│   └── public/                 # Static assets
└── README.md
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/profile` | Get profile |
| PUT | `/api/auth/profile` | Update profile |
| PUT | `/api/auth/change-password` | Change password |
| DELETE | `/api/auth/me` | Delete account |
| GET | `/api/auth/stats` | User statistics |

### Stories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts` | List stories (smart ranking default) |
| POST | `/api/posts` | Create story |
| GET | `/api/posts/:id` | Get story |
| PUT | `/api/posts/:id` | Update story |
| DELETE | `/api/posts/:id` | Delete story |
| GET | `/api/posts/drafts` | User drafts |
| GET | `/api/posts/search` | Search stories |
| POST | `/api/posts/:id/toggle-react` | Toggle reaction |
| POST | `/api/posts/:id/bookmark` | Toggle bookmark |
| GET | `/api/posts/:id/bookmark` | Get bookmark status |
| POST | `/api/posts/:id/read-progress` | Track reading progress |
| GET | `/api/posts/bookmarks` | Get user's bookmarks |

---

## Security Features

### Authentication & Authorization
- **JWT-based authentication** with access and refresh tokens
- **Persistent token blocklist** for secure logout
- **Strong password validation** (8+ chars, upper/lower/number/special)
- **Email domain restriction** - Only Gmail, Outlook, Yahoo, iCloud allowed
- **Environment variable validation** on startup

### Input Protection
- **XSS Prevention** with DOMPurify sanitization
- **Input validation** with Marshmallow schemas
- **SQL injection protection** via SQLAlchemy ORM

### Rate Limiting
- **Redis-backed rate limiting** for production (distributed)
- **Memory fallback** for development
- Default: 200/day, 50/hour per IP

### Error Handling
- **Centralized error handlers** with consistent responses
- **React Error Boundaries** for graceful UI failures
- **Detailed logging** with rotating file handler

### Production Configuration
Set these environment variables for production:
```bash
SECRET_KEY=<32+ char secret>
JWT_SECRET_KEY=<32+ char secret>
REDIS_URL=redis://localhost:6379/0
DATABASE_URL=postgresql://...
FLASK_ENV=production
```

---

## Performance Optimizations

### Database Indexing
| Index | Columns | Purpose |
|-------|---------|---------|
| `idx_post_status_story_type` | status, story_type | Filter by category |
| `idx_post_status_published` | status, published_at | Sort by date |
| `idx_post_user_status` | user_id, status | User's stories |

### N+1 Query Prevention
- **Denormalized counts** - `support_count`, `comment_count` cached on Post model
- **Eager loading** - `joinedload(Post.author)` in all story queries
- **Selectinload** - Optimized relationship loading for supports/comments

### SEO & Social Sharing
- **Dynamic Open Graph tags** - Category-specific previews
- **Twitter Cards** - Rich story previews on X/Twitter
- **react-helmet-async** - Server-side meta tag management

---

## CI/CD Pipeline

### GitHub Actions (`.github/workflows/ci.yml`)

| Job | Description |
|-----|-------------|
| `backend-tests` | Runs 110+ pytest tests with coverage |
| `frontend-build` | Builds React production bundle |
| `code-quality` | Flake8 linting for critical errors |
| `security-scan` | Trivy vulnerability scanner |
| `ci-success` | Final gate (all must pass) |

### Triggers
- Push to `main`, `master`, `develop`
- Pull Requests to these branches

### Badges
```markdown
[![CI](https://github.com/vutikurishanmukha9/HeartOut/actions/workflows/ci.yml/badge.svg)]
[![Tests](https://img.shields.io/badge/Tests-144+-brightgreen)]
```

---

## Testing

### Unit Tests

#### Backend (pytest - 141 tests)
```bash
cd backend
.\venv\Scripts\activate
pytest app/tests -v
```

| Test Suite | Tests | Description |
|------------|-------|-------------|
| Authentication | 9 | Login, Register, Profile, Logout |
| Stories | 14 | CRUD, Drafts, Filtering |
| Reactions | 6 | Add, Toggle, Types |
| **Ranking** | 62 | Smart ranking, Bookmarks, Progress |
| **Strict** | 30 | Input validation, Authorization, Edge cases |

#### Frontend (Vitest)
```bash
cd frontend
npm test
```

| Test Suite | Tests | Description |
|------------|-------|-------------|
| Utils | 17 | Validation, Dates, Errors |
| HelplineCard | 13 | Rendering, Links, Data |
| StoryTypeSelector | 10 | Selection, Rendering |
| SupportButton | 9 | Reactions, Dropdown |
| AuthContext | 7 | Provider, State |

### Test Coverage

```bash
# Backend coverage
cd backend && pytest --cov=app --cov-report=term

# Frontend coverage  
cd frontend && npm run test:coverage
```

| Module | Coverage | Notes |
|--------|----------|-------|
| **Backend Total** | **70%** | Core business logic |
| models.py | 98% | Database models |
| ranking_service.py | 99% | Smart ranking algorithm |
| password_validator.py | 97% | Authentication |
| auth routes | 68% | Login, register, profile |
| **Frontend Total** | **15%** | Utility functions tested |
| SupportButton | 95% | Reactions |
| HelplineCard | 97% | Cards |
| StoryTypeSelector | 85% | Type picker |

### Integration Tests
Complete user flow tests covering end-to-end journeys.
```bash
cd backend
pytest tests/test_integration.py -v
```

| Flow | Description |
|------|-------------|
| Registration to First Story | Register, login, create story, view |
| Story Interactions | Create, react, comment workflow |
| Draft to Publish | Draft creation, editing, publishing |
| Search and Filter | Category filtering, search |

### E2E Tests (Playwright)
Browser-based end-to-end tests.
```bash
cd frontend
npm run test:e2e           # Headless
npm run test:e2e:headed    # With browser
npm run test:e2e:ui        # Interactive UI
```

| Spec | Tests |
|------|-------|
| auth.spec.js | Registration, Login, Logout, Validation |
| stories.spec.js | Create, View, React, Comment |

### Load Tests (Locust)
Performance and load testing.
```bash
cd backend
pip install locust
locust -f tests/test_load.py --host=http://localhost:8000
# Open http://localhost:8089 for web UI
```

| User Type | Behavior |
|-----------|----------|
| ReadOnlyUser | Browsing, viewing stories (3x weight) |
| ActiveUser | Creating content, reactions, comments |
| HeavyUser | Pagination stress, category filtering |

**Performance Benchmarks (Target):**
| Endpoint | Target Avg | Target 95th %ile | Concurrent Users |
|----------|-----------|-----------------|------------------|
| GET /api/posts | <150ms | <400ms | 50+ |
| GET /api/posts/:id | <100ms | <300ms | 50+ |
| POST /api/auth/login | <200ms | <500ms | 25+ |
| POST /api/posts | <300ms | <800ms | 25+ |

### Visual Regression Tests (Playwright)
Screenshot-based visual testing for UI consistency.
```bash
cd frontend
npx playwright test e2e/visual.spec.js
npx playwright test e2e/visual.spec.js --update-snapshots  # Update baselines
```

| Page | Tests | Viewport |
|------|-------|----------|
| Login/Register | 3 | Desktop, Dark mode |
| Feed | 1 | Desktop |
| Profile | 1 | Desktop |
| Create Story | 1 | Desktop |
| Mobile Responsive | 2 | iPhone X (375x812) |
| Components | 2 | Bottom nav, Support button |

### Security Tests
Penetration testing for common vulnerabilities.
```bash
cd backend
pytest tests/test_security.py -v
```

| Category | Tests | Coverage |
|----------|-------|----------|
| XSS Prevention | 3 | Script injection, event handlers, iframes |
| SQL Injection | 3 | Login, search, path parameters |
| Authentication | 3 | JWT validation, password strength, token expiry |
| Authorization | 2 | Cross-user edit/delete prevention |
| Input Validation | 3 | Oversized content, invalid types, special chars |
| **Total** | **14** | Common OWASP vulnerabilities |


---

## Recent Updates

### v3.1 - Settings Page
- **Settings Page** - Dedicated account management page at `/profile/settings`:
  - Theme toggle (Light/Dark/System)
  - Change password with validation
  - Account deletion with confirmation modal
- **New API Endpoints**:
  - `PUT /api/auth/change-password` - Secure password change
  - `DELETE /api/auth/me` - Account deletion
- **Route Fix** - Added explicit `/settings` route before dynamic `/:userId`

### v3.0 - FastAPI Migration
- **Backend Migration** - Complete migration from Flask to FastAPI:
  - Async/await throughout with SQLAlchemy 2.0
  - Pydantic v2 for request/response validation
  - Auto-generated OpenAPI docs at `/api/docs`
  - Improved performance with Uvicorn ASGI server
  - 141 backend tests (all passing)
- **Code Reorganization**:
  - Flask app archived to `flask_app_legacy/`
  - Clean `app/` structure with FastAPI
  - Updated deployment configs (Dockerfile, Procfile, render.yaml)
- **Port Change**: Backend now runs on port 8000 (was 5000)

### v2.8 - Backend Performance & UI Enhancements
- **Connection Pooling** - SQLAlchemy pool of 5-15 connections with auto-recycle
- **Cache Utility** - Redis support with graceful memory fallback
- **Query Optimization** - Eager loading for bookmarks, fewer N+1 queries
- **Dynamic Avatar Colors** - Profile avatars now use username-based colors
- **Auto-Growing Textarea** - Mobile-first editor that expands with content
- **Autofill Login Fix** - Browser autofill now works correctly with React state

### v2.7 - Strict Testing & Mobile UI Fixes
- **Strict Test Suite** (30 new tests):
  - Input validation boundaries (username, password, email formats)
  - Authorization checks (prevent cross-user modifications)
  - Token security (malformed JWT handling)
  - Data integrity (author consistency, anonymous hiding)
  - Edge cases (Unicode, long content, XSS prevention)
- **Mobile UI Fixes**:
  - Reaction picker positioning (no longer cut off on left)
  - Removed duplicate navbar spacer (eliminated gradient gap)
  - Support floating button repositioned above bottom nav
  - Bottom padding for mobile content areas
- **Drafts Page Enhancement**:
  - Premium Edit/Delete buttons with gradient styling
  - Pill-style buttons with labels and hover effects

### v2.6 - Premium UI/UX Overhaul & Ranking Consolidation
- **Gravity Sort Ranking** - Consolidated from 6 category-specific algorithms to single SQL-optimized query:
  - Formula: `score = points / (age_hours + 2) ^ 1.8` (Hacker News style)
  - Balances Recency vs Engagement in one query
  - Removed Multi-Armed Bandit, Emotion-Similarity (CPU-heavy for small datasets)
  - Kept random ranking for Unsent Letters (privacy)
  - Reduced `ranking_service.py` from 373 to 223 lines
- **Premium Typography System** - Poppins (headings) + Inter (body) fonts
  - Font weight hierarchy: extrabold, bold, semibold, light
  - Letter spacing: `tracking-tight`, `tracking-wide`, `tracking-wider`
  - Drop shadows for improved color contrast
- **Story Type Showcase** (Feed Page) - Premium category cards replacing fake stats:
  - 3D perspective tilt on hover
  - Glassmorphism with backdrop blur
  - Animated gradient borders
  - Floating orb backgrounds
  - Floating particles on hover
  - Shine effect animations
- **Feature Highlights** (Auth Pages) - Premium pill-style feature buttons:
  - Gradient icon backgrounds with glow
  - Hover sparkle animations
  - Rotating testimonial carousel
  - Touch-friendly mobile states
- **Premium Form Inputs** (Login/Register):
  - Gradient glow on focus
  - Icon color transitions (gray → primary)
  - Border-2 with shadow depth (sm → md → lg)
  - Larger padding for touch targets
- **Mobile Responsiveness**:
  - Responsive font sizes and spacing
  - Touch events for mobile hover states
  - Mobile logo with glow effect
  - Smaller scale animations on mobile

### v2.5 - Smart Category-Based Ranking
- **Smart Ranking Algorithms** - 6 unique algorithms per story category:
  - *Achievements*: Learning-to-Rank (saves + completion rate)
  - *Regrets*: Emotion-Similarity (rereads + deep engagement)
  - *Unsent Letters*: Random/Chronological (zero virality, max privacy)
  - *Sacrifices*: Hybrid Ranker (saves + rereads + time decay)
  - *Life Stories*: Completion-Optimized (scroll depth + session time)
  - *Other*: Exploration-Based (multi-armed bandit for discovery)
- **Bookmark System** - Save stories distinct from reactions
- **Read Progress Tracking** - Scroll depth, time spent, completion rate
- **Engagement Analytics** - Unique readers, reread counts, save counts
- **"For You" Feed** - Smart ranking as default sort option
- **110 Backend Tests** - Comprehensive test coverage including 62 new ranking tests

### v2.4 - Security & Performance
- **XSS Protection** - DOMPurify sanitization for all user content
- **Redis Rate Limiting** - Production-ready distributed rate limiting
- **Environment Validation** - Startup validation with secure fallbacks
- **React Error Boundaries** - Graceful error handling in UI
- **Lazy Route Loading** - Improved initial load performance
- **N+1 Query Fixes** - SQLAlchemy eager loading for stories
- **Complete Pagination Metadata** - Added has_next, has_prev, next/prev_page

### v2.3 - Testing & UI Improvements
- **Comprehensive Test Suite** - 85 tests covering backend and frontend
- **Navbar Support Button** - Quick access to mental health resources
- **Profile Dropdown Fix** - Click outside to close
- **Navbar Active State Fix** - Correct highlighting for Drafts page
- Backend tests with pytest (29 tests)
- Frontend tests with Vitest (56 tests)


### v2.2 - Mental Health Support Integration
- **Tele MANAS Helpline** - Government of India 24/7 free helpline (14416 / 1800-891-4416)
- **iCall Helpline** - TISS mental health support (9152987821)
- Floating "Need Support?" button with quick access panel
- Dedicated `/support` page with helplines and resources
- Click-to-call functionality for mobile users
- Copy number buttons for desktop users
- Emergency information and additional resources

### v2.1 - Story Analytics & Improvements
- **Story Analytics Dashboard** - Interactive donut pie chart on Profile page
- Category filtering with clickable slices and legend
- Gradient fills with 3D reflection effects
- Dark mode persistence fix (no flash on page load)
- Post deletion by authors
- Reaction toggle fix (changing reactions now works correctly)
- New color scheme: Green (Achievements), Blue (Regrets), Gray (Unsent Letters), Red (Sacrifices), Yellow (Life Stories)


### v2.0 - Premium Upgrade
- Complete UI redesign with glass morphism
- 5 premium reaction types
- Story search endpoint
- User statistics endpoint
- 18 backend security improvements
- Enhanced schema validations
- Service layer architecture

---

## Deployment

### Quick Deploy to Render
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

1. Fork this repository
2. Connect your GitHub to Render
3. Create a new **Blueprint** and select this repo
4. Render will auto-detect `render.yaml` and create:
   - PostgreSQL database
   - Backend API service
   - Frontend static site

### Quick Deploy to Railway
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template)

1. Fork this repository
2. Create new project on Railway
3. Add PostgreSQL database
4. Deploy from GitHub repo
5. Set environment variables:
   - `SECRET_KEY`
   - `JWT_SECRET_KEY`
   - `DATABASE_URL` (auto-set by Railway)

### Manual Deployment

#### Backend (Render/Railway/Heroku)
```bash
# Start command:
uvicorn app.main:app --host 0.0.0.0 --port $PORT --workers 2

# Environment variables required:
SECRET_KEY=<32+ char secret>
JWT_SECRET_KEY=<32+ char secret>
DATABASE_URL=postgresql://...
CORS_ORIGINS=https://your-frontend-domain.com

# Optional:
REDIS_URL=redis://...  # For distributed rate limiting
```

#### Frontend (Vercel/Netlify/Render)
```bash
# Build command:
npm run build

# Publish directory:
dist

# Environment variable:
VITE_API_URL=https://your-backend-api.com
```

### Deployment Files
| File | Purpose |
|------|---------|
| `render.yaml` | Render Blueprint (auto-deploy) |
| `railway.toml` | Railway configuration |
| `Procfile` | Heroku/Railway process file |
| `runtime.txt` | Python version specification |

---

## Roadmap

| Phase | Features | Status |
|-------|----------|--------|
| Phase 1 | Core features, story CRUD | Complete |
| Phase 2 | Premium UI upgrade | Complete |
| Phase 3 | Search, reactions, stats | Complete |
| Phase 4 | Cloud deployment | Complete |
| Phase 5 | Email notifications | Planned |
| Phase 6 | Mobile app | Planned |

---

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**HeartOut** - Where every story matters.

Built with care for authentic storytelling.

</div>
