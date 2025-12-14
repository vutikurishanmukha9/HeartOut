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
| GET | `/api/posts` | List stories |
| POST | `/api/posts` | Create story |
| GET | `/api/posts/:id` | Get story |
| PUT | `/api/posts/:id` | Update story |
| DELETE | `/api/posts/:id` | Delete story |
| GET | `/api/posts/drafts` | User drafts |
| GET | `/api/posts/search` | Search stories |
| POST | `/api/posts/:id/toggle-react` | Toggle reaction |

---

## Security Features

### Authentication & Authorization
- **JWT-based authentication** with access and refresh tokens
- **Persistent token blocklist** for secure logout
- **Strong password validation** (8+ chars, upper/lower/number/special)
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

### Backend Tests (pytest)
```bash
cd backend
.\venv\Scripts\activate
pytest -v
```

| Test Suite | Tests | Coverage |
|------------|-------|----------|
| Authentication | 9 | Login, Register, Profile, Logout |
| Stories | 14 | CRUD, Drafts, Filtering |
| Reactions | 6 | Add, Toggle, Types |

### Frontend Tests (Vitest)
```bash
cd frontend
npm test
```

| Test Suite | Tests | Coverage |
|------------|-------|----------|
| Utils | 17 | Validation, Dates, Errors |
| HelplineCard | 13 | Rendering, Links, Data |
| StoryTypeSelector | 10 | Selection, Rendering |
| SupportButton | 9 | Reactions, Dropdown |
| AuthContext | 7 | Provider, State |

**Total: 85 tests with 100% pass rate**

---

## Recent Updates

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

## Roadmap

| Phase | Features | Status |
|-------|----------|--------|
| Phase 1 | Core features, story CRUD | Complete |
| Phase 2 | Premium UI upgrade | Complete |
| Phase 3 | Search, reactions, stats | Complete |
| Phase 4 | Email notifications | Planned |
| Phase 5 | Mobile app | Planned |

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
