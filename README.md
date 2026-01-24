# FileDrop - Mobile-First File Sharing PWA

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/ranguyafks-projects/v0-file-upload-website)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/k25Otlj0xjZ)

## Overview

FileDrop is a modern, mobile-first Progressive Web App (PWA) for secure file sharing. Upload files up to 1GB with custom URLs, password protection, and auto-expiration features. The app is designed to compete with services like iCloud while emphasizing simplicity, ease of navigation, and performance for mobile users.

## 🚀 Key Features

### Mobile-First Design
- **Responsive Layout**: Optimized for all screen sizes with a mobile-first approach
- **Bottom Navigation**: Easy-to-reach navigation bar on mobile devices
- **Touch-Friendly**: 44px minimum touch targets for better mobile UX
- **Smooth Animations**: CSS transitions and active states for native app feel

### Progressive Web App (PWA)
- **Installable**: Add to home screen on mobile and desktop
- **Offline Support**: Service worker with caching for offline functionality
- **App-like Experience**: Runs in standalone mode without browser UI
- **Fast Loading**: Optimized performance with asset caching

### User Experience
- **Onboarding Flow**: Elegant first-time user experience with feature highlights
- **Install Prompts**: Smart prompts to install the app
- **Animated UI**: Smooth transitions and animations throughout
- **Minimizing Header**: Auto-hiding header on scroll for more screen space

### Core Features
- **File Upload**: Drag-and-drop or tap to upload files up to 1GB
- **Custom URLs**: Create memorable share links
- **Password Protection**: Secure files with password protection
- **Auto-Expiration**: Set files to expire after a specific time
- **Analytics**: Track views and downloads
- **Dashboard**: Manage all your uploaded files in one place

## 🎨 Design Philosophy

The design follows these principles:
1. **Mobile-First**: Every component is designed for mobile and enhanced for desktop
2. **Touch-Optimized**: All interactive elements meet the 44px touch target standard
3. **Performance**: Fast loading with lazy loading and code splitting
4. **Accessibility**: Semantic HTML and proper ARIA labels
5. **Modern Aesthetics**: Clean, flat design with smooth animations

## 📱 PWA Features

### Manifest Configuration
- App name, description, and icons configured
- Standalone display mode for app-like experience
- Theme color matches the app's primary color
- Shortcuts for quick actions

### Service Worker
- Offline page fallback
- Network-first caching strategy
- Background sync capability
- Push notification support (future enhancement)

### Installation
Users can install FileDrop on:
- iOS (Safari - Add to Home Screen)
- Android (Chrome - Install App)
- Desktop (Chrome, Edge - Install App)

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (React 19)
- **Styling**: Tailwind CSS 4 with custom animations
- **UI Components**: Radix UI primitives
- **Authentication**: Supabase Auth
- **Storage**: Vercel Blob
- **Deployment**: Vercel
- **Icons**: Lucide React

## 🏗️ Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with PWA meta tags
│   ├── page.tsx            # Homepage with mobile-optimized hero
│   ├── dashboard/          # User dashboard
│   ├── offline/            # Offline fallback page
│   └── globals.css         # Global styles with mobile utilities
├── components/
│   ├── bottom-nav.tsx      # Mobile bottom navigation
│   ├── header.tsx          # Responsive header with scroll behavior
│   ├── install-prompt.tsx  # PWA install prompt
│   ├── onboarding-flow.tsx # First-time user onboarding
│   ├── service-worker-register.tsx
│   ├── upload-form.tsx     # Mobile-optimized upload interface
│   └── loading-skeleton.tsx
├── public/
│   ├── manifest.json       # PWA manifest
│   ├── sw.js               # Service worker
│   └── icons/              # App icons (192x192, 512x512)
└── lib/                    # Utilities and helpers
```

## 🚀 Getting Started

### Database Setup

**Important:** Before running the application, ensure all database migrations are applied.

1. Check migration status:
   ```bash
   node scripts/run-migrations.js
   ```
   or visit `/api/health/migrations` after starting the app

2. If migrations are missing, follow the instructions in `/scripts/README.md` or `MIGRATION_RESOLUTION.md`

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ranguyafk/v0-file-upload-website.git
cd v0-file-upload-website
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Add your Supabase and Vercel Blob credentials
```

4. Apply database migrations (see Database Setup section above or `/scripts/README.md`)

5. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Troubleshooting

If you encounter errors related to database schema:
- Check `/api/health/migrations` for migration status
- See `MIGRATION_RESOLUTION.md` for detailed resolution steps
- See `TROUBLESHOOTING.md` for common issues

## 📦 Build for Production

```bash
npm run build
npm start
```

## 🎯 Mobile-First Improvements

### Phase 1: PWA Foundation ✅
- [x] PWA manifest with app metadata
- [x] Service worker for offline support
- [x] Install prompt component
- [x] Offline fallback page

### Phase 2: Mobile Navigation ✅
- [x] Bottom navigation bar
- [x] Responsive header with scroll behavior
- [x] Touch-friendly UI elements

### Phase 3: Visual Enhancements ✅
- [x] Smooth transitions and animations
- [x] 44px minimum touch targets
- [x] Active state feedback
- [x] Responsive typography

### Phase 4: Onboarding ✅
- [x] Feature highlight carousel
- [x] Skip/complete logic
- [x] First-time user experience

### Phase 5: Performance 🔄
- [ ] Image optimization
- [ ] Loading skeletons
- [ ] Lazy loading
- [ ] Performance testing

### Phase 6: Testing 🔄
- [ ] PWA audit
- [ ] Mobile browser testing
- [ ] Accessibility testing
- [ ] Performance benchmarks

## 📊 Performance Metrics

Target metrics:
- First Contentful Paint: < 1.8s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.8s
- Cumulative Layout Shift: < 0.1
- PWA Score: > 90

## 🤝 Contributing

This repository is automatically synced with v0.app deployments. To contribute:

1. Make changes using [v0.app](https://v0.app/chat/k25Otlj0xjZ)
2. Deploy from the v0 interface
3. Changes will be automatically pushed to this repository

## 📄 License

This project is part of the v0.app ecosystem.

## 🔗 Links

- **Live App**: [Vercel Deployment](https://vercel.com/ranguyafks-projects/v0-file-upload-website)
- **v0 Chat**: [Continue Building](https://v0.app/chat/k25Otlj0xjZ)
- **Repository**: [GitHub](https://github.com/ranguyafk/v0-file-upload-website)

---

Built with ❤️ using [v0.app](https://v0.app) and Next.js