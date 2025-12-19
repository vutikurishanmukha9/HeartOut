# HeartOut - Personal Storytelling Platform

<div align="center">

**Where every story matters.**

A modern, premium storytelling platform for authentic personal expression.

[![GitHub](https://img.shields.io/badge/GitHub-vutikurishanmukha9%2FHeartOut-blue)](https://github.com/vutikurishanmukha9/HeartOut)
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
- **Mental Health Support** - Integrated helplines (Tele MANAS, iCall) with floating button

---

## Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| Flask | Python web framework |
| SQLAlchemy | Database ORM |
| JWT | Authentication |
| Marshmallow | Validation |
| Flask-Limiter | Rate limiting |

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| Vite | Build tool |
| Tailwind CSS | Styling |
| Lucide React | Icons |
| React Router | Navigation |
| **Recharts** | Data visualization |

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
flask db upgrade

# Frontend setup
cd ../frontend
npm install
```

### Running

```bash
# Terminal 1 - Backend (http://localhost:5000)
cd backend
.\venv\Scripts\activate
python run.py

# Terminal 2 - Frontend (http://localhost:5173)
cd frontend
npm run dev
```

---

## Project Structure

```
HeartOut/
├── backend/
│   ├── app/
│   │   ├── blueprints/     # API routes (auth, posts, admin)
│   │   ├── services/       # Business logic layer
│   │   ├── utils/          # Decorators, errors, validators
│   │   ├── models.py       # Database models
│   │   └── schemas.py      # Request validation
│   └── migrations/
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── context/        # Auth & Theme providers
│   │   └── routes/         # Route configurations
│   └── public/             # Static assets
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

## Testing

### Unit Tests

#### Backend (pytest)
```bash
cd backend
.\venv\Scripts\activate
pytest -v
```

| Test Suite | Tests | Description |
|------------|-------|-------------|
| Authentication | 9 | Login, Register, Profile, Logout |
| Stories | 14 | CRUD, Drafts, Filtering |
| Reactions | 6 | Add, Toggle, Types |
| **Ranking** | 62 | Smart ranking, Bookmarks, Progress |

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
locust -f tests/test_load.py --host=http://localhost:5000
# Open http://localhost:8089 for web UI
```

| User Type | Behavior |
|-----------|----------|
| ReadOnlyUser | Browsing, viewing stories (3x weight) |
| ActiveUser | Creating content, reactions, comments |
| HeavyUser | Pagination stress, category filtering |

### Security Tests
Penetration testing for common vulnerabilities.
```bash
cd backend
pytest tests/test_security.py -v
```

| Category | Tests |
|----------|-------|
| XSS Prevention | Script injection, event handlers |
| SQL Injection | Login, search, path injection |
| Authentication | JWT validation, password strength |
| Authorization | Cross-user edit/delete prevention |
| Input Validation | Oversized content, invalid types |


---

## Recent Updates

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
# Environment variables required:
SECRET_KEY=<32+ char secret>
JWT_SECRET_KEY=<32+ char secret>
DATABASE_URL=postgresql://...
FLASK_ENV=production
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
