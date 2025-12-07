# HeartOut - Personal Storytelling Platform

<div align="center">

![HeartOut Logo](frontend/public/heart.svg)

**Where every story matters.**

A modern, premium storytelling platform for authentic personal expression.

[![GitHub](https://img.shields.io/badge/GitHub-vutikurishanmukha9%2FHeartOut-blue)](https://github.com/vutikurishanmukha9/HeartOut)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://python.org)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://react.dev)

</div>

---

## ✨ Features

### 📖 Story Categories
| Category | Description |
|----------|-------------|
| 🏆 **Achievements** | Celebrate victories and milestones |
| 💜 **Regrets** | Share lessons from difficult experiences |
| 💌 **Unsent Letters** | Express words never said |
| 🤝 **Sacrifices** | Document what you gave up |
| 📚 **Life Stories** | Share your personal journey |
| ✨ **Other** | Uncategorized narratives |

### 🎨 Premium UI
- **Glass Morphism Design** - Modern, translucent components
- **Warm Sunset Palette** - Coral, amber, and rose tones
- **Micro-animations** - Smooth transitions and hover effects
- **Dark Mode** - Eye-friendly reading experience
- **Responsive** - Works on desktop, tablet, and mobile

### 💡 Key Features
- ✅ Anonymous posting option
- ✅ 5 reaction types (❤️ Love, 🏆 Inspiring, 🔖 Save, 🤗 Hug, ✨ Mind-blown)
- ✅ Draft management
- ✅ Story search
- ✅ User statistics
- ✅ Reading time estimates
- ✅ Comment system

---

## 🛠 Tech Stack

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

---

## 🚀 Quick Start

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

## 📁 Project Structure

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

## 🔌 API Endpoints

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

## 🔒 Security Features

- ✅ JWT-based authentication
- ✅ Persistent token blocklist
- ✅ Password strength validation
- ✅ Rate limiting
- ✅ Input validation with Marshmallow
- ✅ Centralized error handling

---

## 📈 Recent Updates

### v2.0 - Premium Upgrade
- 🎨 Complete UI redesign with glass morphism
- ❤️ 5 premium reaction types
- 🔍 Story search endpoint
- 📊 User statistics endpoint
- 🔐 18 backend security improvements
- 📝 Enhanced schema validations
- 🏗️ Service layer architecture

---

## 🗺 Roadmap

| Phase | Features | Status |
|-------|----------|--------|
| Phase 1 | Core features, story CRUD | ✅ Complete |
| Phase 2 | Premium UI upgrade | ✅ Complete |
| Phase 3 | Search, reactions, stats | ✅ Complete |
| Phase 4 | Email notifications | 🔄 Planned |
| Phase 5 | Mobile app | 🔄 Planned |

---

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**HeartOut** - Where every story matters.

Built with ❤️ for authentic storytelling.

</div>
