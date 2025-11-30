# Testing Guide for HeartOut

## Overview

This guide covers testing all major features of the HeartOut storytelling platform.

---

## Prerequisites

- Backend running on `http://localhost:5000`
- Frontend running on `http://localhost:3000` or `http://localhost:5173`
- Database migrations applied
- Test user accounts created

---

## 1. User Authentication Flow

### Registration
1. Navigate to `/register`
2. Fill in:
   - Username (3-80 chars)
   - Email (valid format)
   - Password (min 8 chars)
   - Display name (optional)
   - Age range (optional)
3. Click "Register"
4. ✅ Should receive JWT tokens
5. ✅ Should redirect to feed
6. ✅ Should see user info in navbar

### Login
1. Navigate to `/login`
2. Enter email and password
3. Click "Login"
4. ✅ Should receive tokens
5. ✅ Should redirect to feed
6. ✅ Last login timestamp updated

### Logout
1. Click logout button in navbar
2. ✅ Should clear tokens
3. ✅ Should redirect to login
4. ✅ Protected routes should be inaccessible

---

## 2. Story Creation Flow

### Two-Step Story Creation

**Step 1: Category Selection**
1. Navigate to `/feed/create`
2. ✅ Should see 6 category cards:
   - Achievement (amber/trophy)
   - Regret (indigo/heart)
   - Unsent Letter (rose/mail)
   - Sacrifice (emerald/hand-heart)
   - Life Story (blue/book)
   - Other (gray/sparkles)
3. Click a category
4. ✅ Should advance to Step 2

**Step 2: Story Writing**
1. ✅ Should show selected category
2. Enter title (max 200 chars)
   - ✅ Character counter updates
3. Write story content
   - ✅ Word count updates in real-time
   - ✅ Reading time calculates automatically
4. Add tags:
   - Type tag name
   - Press Enter or click "Add"
   - ✅ Tag appears as chip
   - Click × to remove
   - ✅ Tag removed
5. Toggle anonymous option
   - ✅ Checkbox works
6. Save as draft:
   - Click "Save as Draft"
   - ✅ Story saved with status=draft
   - ✅ Redirect to drafts
7. Publish story:
   - Click "Publish Story"
   - ✅ Story saved with status=published
   - ✅ Redirect to story detail

---

## 3. Story Discovery Flow

### Feed Page

**Sorting Options**
1. Navigate to `/feed`
2. Click "Latest"
   - ✅ Stories sorted by publish date (newest first)
3. Click "Trending"
   - ✅ Stories sorted by recent reactions
4. Click "Most Viewed"
   - ✅ Stories sorted by view count

**Category Filtering**
1. Click "All Stories"
   - ✅ Shows all published stories
2. Click a category tab (e.g., "Achievement")
   - ✅ Shows only stories of that type
   - ✅ URL updates with category
3. Try each category
   - ✅ Filtering works for all 6 types

**Story Cards**
Each card should display:
- ✅ Story type badge (icon + color)
- ✅ Title (max 2 lines)
- ✅ Excerpt (max 3 lines)
- ✅ Tags (max 3 shown)
- ✅ Author avatar and name
- ✅ Publish date
- ✅ Reading time
- ✅ View count
- ✅ Reaction count
- ✅ Comment count
- ✅ Featured badge (if applicable)

**Pagination**
1. Scroll to bottom
2. ✅ Should see page controls
3. Click "Next"
   - ✅ Loads next 20 stories
   - ✅ Page number updates
4. Click "Previous"
   - ✅ Returns to previous page

---

## 4. Story Reading Flow

### PostDetail Page

1. Click any story card
2. ✅ Should navigate to `/feed/story/{id}`
3. ✅ View count increments

**Story Display**
- ✅ Story type badge visible
- ✅ Full title displayed
- ✅ Author info (avatar, name, date)
- ✅ Reading time shown
- ✅ View count shown
- ✅ Tags displayed
- ✅ Full content readable (prose styling)

**Reactions**
1. Click "React" button
2. ✅ Reaction picker appears (Heart, Applause, Bookmark)
3. Click a reaction
   - ✅ Reaction saved
   - ✅ Button shows "Reacted"
   - ✅ Reaction count updates
4. Try to react again with same type
   - ✅ Should show error (already reacted)

**Sharing**
1. Click "Share" button
2. If native share available:
   - ✅ Native share dialog opens
3. If not available:
   - ✅ Link copied to clipboard
   - ✅ Alert shown

**Comments**
1. Type comment in textarea
2. Toggle "Comment anonymously"
   - ✅ Checkbox works
3. Click "Post Comment"
   - ✅ Comment appears in list
   - ✅ Comment count updates
4. ✅ Comment shows correct author (or "Anonymous")
5. ✅ Comment shows timestamp

---

## 5. Profile Flow

### Viewing Own Profile

1. Navigate to `/profile`
2. ✅ Should show:
   - Large gradient avatar
   - Display name and username
   - Bio (if set)
   - Author bio (if set)
   - Website link (if set)
   - Total stories count
   - Story statistics by category
   - Published stories grid

**Edit Profile**
1. Click "Edit Profile"
2. ✅ Form appears with current values
3. Update fields:
   - Display name
   - Short bio
   - Author bio
   - Website URL
4. Click "Save Changes"
   - ✅ Profile updated
   - ✅ Form closes
   - ✅ New values displayed
5. Click "Cancel"
   - ✅ Form closes without saving

**Story Statistics**
- ✅ Shows count for each category
- ✅ Color-coded cards match category colors
- ✅ Icons match category icons

### Viewing Other User's Profile

1. Navigate to `/profile/{userId}`
2. ✅ Should show public profile info
3. ✅ Should NOT show "Edit Profile" button
4. ✅ Should show only non-anonymous published stories

---

## 6. Responsive Design Testing

### Desktop (1920x1080)
- ✅ Feed: 3-column grid
- ✅ Navigation: Full menu
- ✅ Story reader: Optimal line length
- ✅ Profile: Full layout

### Tablet (768x1024)
- ✅ Feed: 2-column grid
- ✅ Navigation: Responsive menu
- ✅ Story reader: Readable
- ✅ Profile: Stacked layout

### Mobile (375x667)
- ✅ Feed: 1-column grid
- ✅ Navigation: Hamburger menu
- ✅ Story reader: Full width
- ✅ Profile: Mobile-optimized
- ✅ Category selector: Scrollable tabs

---

## 7. Dark Mode Testing

1. Toggle dark mode (if implemented)
2. ✅ All pages render correctly
3. ✅ Text remains readable
4. ✅ Colors maintain contrast
5. ✅ Images/icons visible

---

## 8. Error Handling

### Network Errors
1. Stop backend server
2. Try to load feed
   - ✅ Should show error message
3. Try to create story
   - ✅ Should show error message

### Validation Errors
1. Try to create story without title
   - ✅ Should show validation error
2. Try to register with invalid email
   - ✅ Should show validation error
3. Try to login with wrong password
   - ✅ Should show error message

### Rate Limiting
1. Make 11 story creation requests rapidly
   - ✅ Should be rate limited after 10
   - ✅ Should show appropriate error

---

## 9. Performance Testing

### Page Load Times
- ✅ Feed loads in < 2 seconds
- ✅ Story detail loads in < 1 second
- ✅ Profile loads in < 2 seconds

### Interaction Response
- ✅ Reactions respond instantly
- ✅ Comments post in < 1 second
- ✅ Category filtering is instant

---

## 10. Browser Compatibility

Test on:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile Safari (iOS)
- ✅ Chrome Mobile (Android)

---

## Automated Testing (Future)

### Backend Tests
```bash
cd backend
pytest tests/
```

### Frontend Tests
```bash
cd frontend
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

---

## Bug Reporting

When reporting bugs, include:
1. Steps to reproduce
2. Expected behavior
3. Actual behavior
4. Browser and version
5. Screenshots/console errors
6. Network tab (if API issue)

---

## Test Checklist Summary

- [ ] User authentication (register, login, logout)
- [ ] Story creation (2-step flow, drafts, publish)
- [ ] Story discovery (sorting, filtering, pagination)
- [ ] Story reading (view, react, share, comment)
- [ ] Profile viewing and editing
- [ ] Responsive design (desktop, tablet, mobile)
- [ ] Dark mode (if implemented)
- [ ] Error handling
- [ ] Performance
- [ ] Browser compatibility

---

**All tests passing? HeartOut is ready to launch! 🚀**
