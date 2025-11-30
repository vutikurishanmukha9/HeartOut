# HeartOut - Personal Storytelling Platform

A modern web platform designed for authentic storytelling and personal expression. HeartOut provides a safe, supportive space where people can share their life experiences, achievements, regrets, and untold stories with a community that values genuine human connection.

## About the Project

HeartOut was created to address the need for a dedicated platform where individuals can express themselves freely without the noise and superficiality often found on traditional social media. Whether you want to celebrate an achievement, share a lesson learned from regret, write an unsent letter, or document your life journey, HeartOut provides the tools and community to support your storytelling.

This platform is currently in active development and will be launching to the public in the coming weeks.

## Core Features

### Story Categories

The platform supports multiple story types to accommodate different forms of personal expression:

- **Achievements**: Celebrate your victories, milestones, and accomplishments
- **Regrets**: Share lessons learned from difficult experiences
- **Unsent Letters**: Express words that were never said
- **Sacrifices**: Document what you gave up and why it mattered
- **Life Stories**: Share your complete journey or significant chapters
- **Other**: Uncategorized personal narratives

### User Experience

- **Clean, Modern Interface**: Intuitive design built with React and Tailwind CSS
- **Anonymous Posting**: Option to share stories without revealing your identity
- **Rich Text Editor**: Comprehensive writing tools with word count and formatting
- **Reading Time Estimates**: Automatically calculated for each story
- **Engagement Features**: Reactions, comments, and bookmarking
- **Draft Management**: Save and continue working on unfinished stories
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices

### Community Features

- **Story Discovery**: Browse stories by category, trending topics, or latest posts
- **User Profiles**: Customizable profiles with author bios and story collections
- **Search Functionality**: Find stories by keywords, tags, or authors
- **Content Moderation**: Admin tools to maintain a safe, respectful community

## Technology Stack

### Backend

- **Framework**: Flask (Python)
- **Database**: SQLite for development, PostgreSQL-ready for production
- **Authentication**: JWT-based secure authentication
- **API**: RESTful API architecture
- **Migrations**: Flask-Migrate for database version control

### Frontend

- **Framework**: React 18 with Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Context API
- **Notifications**: React Hot Toast
- **Icons**: Lucide React

### Development Tools

- **Version Control**: Git
- **Package Management**: npm (frontend), pip (backend)
- **Code Quality**: ESLint, Prettier
- **Containerization**: Docker and Docker Compose ready

## Getting Started

### Prerequisites

- Python 3.11 or higher
- Node.js 18 or higher
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/HeartOut.git
cd HeartOut
```

2. Set up the backend:
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate  # On Windows
source venv/bin/activate  # On macOS/Linux
pip install -r requirements.txt
```

3. Configure environment variables:
```bash
# Create backend/.env file
cp backend/.env.example backend/.env
# Edit the .env file with your configuration
```

4. Initialize the database:
```bash
flask db upgrade
```

5. Set up the frontend:
```bash
cd ../frontend
npm install
```

6. Configure frontend environment:
```bash
# Create frontend/.env file
cp frontend/.env.example frontend/.env
```

### Running the Application

1. Start the backend server:
```bash
cd backend
.\venv\Scripts\activate
python run.py
```
The backend will run on `http://localhost:5000`

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```
The frontend will run on `http://localhost:5173`

3. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
HeartOut/
├── backend/
│   ├── app/
│   │   ├── blueprints/      # API route modules
│   │   ├── models.py         # Database models
│   │   ├── schemas.py        # Data validation schemas
│   │   └── config.py         # Application configuration
│   ├── migrations/           # Database migrations
│   ├── requirements.txt      # Python dependencies
│   └── run.py               # Application entry point
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Page components
│   │   ├── context/         # React Context providers
│   │   ├── routes/          # Route configurations
│   │   └── App.jsx          # Main application component
│   ├── package.json         # Node dependencies
│   └── vite.config.js       # Vite configuration
├── docs/                    # Documentation
├── docker-compose.yml       # Docker orchestration
└── README.md               # This file
```

## API Documentation

The platform provides a RESTful API with the following main endpoints:

### Authentication
- `POST /api/auth/register` - Create a new user account
- `POST /api/auth/login` - Authenticate and receive JWT token
- `GET /api/auth/profile` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Posts
- `GET /api/posts` - Retrieve all published stories
- `GET /api/posts/:id` - Get a specific story
- `POST /api/posts` - Create a new story
- `PUT /api/posts/:id` - Update a story
- `DELETE /api/posts/:id` - Delete a story
- `GET /api/posts/drafts` - Get user's draft stories

### Admin
- `GET /api/admin/stats` - Platform statistics
- `GET /api/admin/users` - User management
- `POST /api/admin/moderate` - Content moderation actions

## Future Enhancements

HeartOut is actively being developed with several exciting features planned for future releases:

### Phase 1: Enhanced User Experience (Weeks 1-4)
- Advanced text editor with markdown support
- Story versioning and edit history
- Enhanced search with filters and sorting
- User following and personalized feeds
- Email notifications for interactions

### Phase 2: Community Features (Weeks 5-8)
- Story collections and playlists
- Collaborative storytelling features
- Story challenges and prompts
- Featured stories and editor's picks
- Community guidelines and reporting system

### Phase 3: Multimedia Support (Weeks 9-12)
- Image uploads for stories
- Audio story narration
- Video story integration
- Story cover images
- Media gallery management

### Phase 4: Advanced Features (Weeks 13-16)
- AI-powered writing suggestions
- Story analytics and insights
- Export stories to PDF/ePub
- Multi-language support
- Mobile applications (iOS and Android)

### Phase 5: Monetization and Sustainability (Weeks 17-20)
- Premium membership tiers
- Creator monetization options
- Sponsored story opportunities
- Donation and tipping system
- Ad-free experience for supporters

### Long-term Vision
- Integration with publishing platforms
- Story contests and awards
- Virtual storytelling events
- Podcast integration
- Book compilation services
- Therapeutic writing programs partnership

## Contributing

We welcome contributions from the community. Please read our contributing guidelines before submitting pull requests.

## Security

If you discover any security vulnerabilities, please email security@heartout.com instead of using the issue tracker.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

HeartOut was built with the vision of creating a meaningful space for authentic human stories. Special thanks to all early testers and contributors who helped shape this platform.

## Roadmap to Launch

The platform is currently in beta testing with a planned public launch in the coming weeks. I am actively working on:

- Final security audits and penetration testing
- Performance optimization and load testing
- User experience refinement based on beta feedback
- Content moderation system implementation
- Legal compliance and privacy policy finalization
- Marketing and community building initiatives

Stay tuned for our official launch announcement!

---

Built with care for authentic storytelling. HeartOut - Where every story matters.
