# SA IS A MOVIE - Codebase Index

## 📋 Project Overview

**SA IS A MOVIE** is a modern, interactive landing page for a South African entertainment and culture website. It's built as a single-page application showcasing trending topics, celebrity drama, political scandals, and Amapiano events with a vibrant, movie-themed design.

**Project Type:** React Single Page Application (SPA)  
**Purpose:** Entertainment news and culture landing page  
**Target Audience:** South African entertainment enthusiasts  

## 🛠️ Technical Stack

### Frontend Framework
- **React 19.1.0** - Latest React with JSX
- **Vite 6.3.5** - Modern build tool and dev server
- **Framer Motion 12.15.0** - Animation library

### Styling & UI
- **Tailwind CSS 4.1.7** - Utility-first CSS framework
- **shadcn/ui** - Component library (New York style)
- **Radix UI** - Accessible component primitives
- **Lucide React 0.510.0** - Icon library

### Development Tools
- **ESLint 9.25.0** - Code linting with React plugins
- **pnpm 10.4.1** - Package manager
- **TypeScript types** - Type definitions for React

## 📁 Project Structure

```
saisa-movie-landing/
├── src/
│   ├── components/
│   │   ├── ui/                    # 40+ shadcn/ui components
│   │   │   ├── button.jsx         # Button component with variants
│   │   │   ├── card.jsx           # Card components (Card, CardContent, etc.)
│   │   │   ├── input.jsx          # Form input components
│   │   │   ├── dialog.jsx         # Modal dialog components
│   │   │   └── ... (37 more UI components)
│   │   └── ParticleBackground.jsx # Interactive canvas animation
│   ├── assets/
│   │   ├── saisa_movie_icon_logo.png      # Brand icon
│   │   └── saisa_movie_typography_logo.png # Brand typography
│   ├── hooks/
│   │   └── use-mobile.js          # Mobile detection hook
│   ├── lib/
│   │   └── utils.js               # Utility functions (cn helper)
│   ├── App.jsx                    # Main application component
│   ├── App.css                    # Custom SA IS A MOVIE styles
│   ├── index.css                  # Tailwind + shadcn/ui theme
│   └── main.jsx                   # React entry point
├── public/
│   └── favicon.ico                # Site favicon
├── dist/                          # Built application output
│   ├── assets/                    # Optimized assets with hashes
│   ├── index.html                 # Built HTML
│   └── favicon.ico
├── package.json                   # Dependencies and scripts
├── vite.config.js                 # Vite configuration
├── components.json                # shadcn/ui configuration
├── jsconfig.json                  # JavaScript path mapping
├── eslint.config.js               # ESLint configuration
└── pnpm-lock.yaml                 # Package lock file
```

## 🎨 Design System

### Brand Colors
- **Yellow (#FFD700)** - Primary accent color
- **Red (#FF0000)** - Secondary accent color
- **Pink (#FF007F)** - Tertiary accent color
- **Blue (#007BFF)** - Info accent color
- **Dark Backgrounds** - #0D0D0D (main), #1A1A1A (secondary)

### Visual Effects
- **Neon Glow Effects** - Box shadows on buttons and elements
- **Gradient Text** - Animated gradient text effects
- **Interactive Particles** - Canvas-based particle system
- **Smooth Transitions** - Hover and focus animations
- **Responsive Design** - Mobile-first approach

### Custom CSS Classes
```css
.saisa-bg          /* Main dark background */
.saisa-bg-dark     /* Secondary dark background */
.saisa-bg-yellow   /* Yellow background */
.saisa-bg-red      /* Red background */
.saisa-text-yellow /* Yellow text */
.saisa-text-red    /* Red text */
.saisa-text-blue   /* Blue text */
.saisa-text-pink   /* Pink text */
.neon-glow         /* Yellow neon glow effect */
.red-glow          /* Red glow effect */
.text-shadow-neon  /* Neon text shadow */
.gradient-text     /* Gradient text effect */
```

## 🧩 Key Components

### 1. App.jsx (Main Application)
**Location:** `src/App.jsx`  
**Purpose:** Main application component containing all sections

**Sections:**
- **Navigation Bar** - Fixed header with logo and menu
- **Hero Section** - Animated logo, tagline, and CTA buttons
- **Trending Topics** - Grid of 6 sample entertainment stories
- **About Section** - Brand explanation and mission
- **Call-to-Action** - Social media links and email signup
- **Footer** - Copyright and legal links

**Key Features:**
- Framer Motion animations throughout
- Responsive design with mobile considerations
- Interactive particle background
- Sample content for trending stories

### 2. ParticleBackground.jsx
**Location:** `src/components/ParticleBackground.jsx`  
**Purpose:** Interactive canvas-based particle animation

**Features:**
- **80 particles** with dynamic count based on screen size
- **Mouse interaction** - particles react to cursor movement
- **Two particle types:**
  - Film strip particles (30% chance)
  - Circular particles with glow effects
- **Connection lines** between nearby particles
- **Mouse trail effect** with red glow
- **Boundary wrapping** for seamless animation
- **Life cycle management** for particle regeneration

**Technical Details:**
- Uses HTML5 Canvas API
- RequestAnimationFrame for smooth 60fps animation
- Responsive canvas sizing
- Memory-efficient particle management

### 3. UI Components (shadcn/ui)
**Location:** `src/components/ui/`  
**Purpose:** Reusable component library

**Available Components (40+):**
- `button.jsx` - Button with multiple variants
- `card.jsx` - Card components (Card, CardContent, CardHeader, etc.)
- `input.jsx` - Form input components
- `dialog.jsx` - Modal dialog components
- `accordion.jsx` - Collapsible content
- `alert.jsx` - Alert notifications
- `badge.jsx` - Status badges
- `carousel.jsx` - Image/content carousel
- `chart.jsx` - Data visualization
- `form.jsx` - Form handling
- `navigation-menu.jsx` - Navigation components
- `tabs.jsx` - Tabbed content
- And 30+ more components...

**Features:**
- Consistent styling with Tailwind CSS
- Accessibility features via Radix UI
- TypeScript support
- Customizable variants and sizes

## 📊 Content Structure

### Sample Trending Stories
1. **Amapiano Festival Rocks Johannesburg** (music category)
2. **Political Drama Unfolds in Parliament** (scandal category)
3. **Celebrity Couple's Public Breakup** (celebrity category)
4. **Viral TikTok Dance Takes Over Mzansi** (culture category)
5. **Government Scandal Rocks Social Media** (scandal category)
6. **Music Awards Night Drama** (music category)

### Content Categories
- **Music** - Amapiano events, music awards
- **Scandal** - Political drama, government controversies
- **Celebrity** - Celebrity news, relationship drama
- **Culture** - Viral trends, social media phenomena

### Statistics Display
- **500K+ Followers** - Social media following
- **1M+ Monthly Views** - Website traffic
- **Daily Fresh Content** - Content update frequency

## ⚙️ Configuration Files

### Vite Configuration (`vite.config.js`)
```javascript
- React plugin for JSX support
- Tailwind CSS integration
- Path aliases (@/ → src/)
- Development server configuration
```

### ESLint Configuration (`eslint.config.js`)
```javascript
- React hooks rules
- React refresh plugin
- Modern JavaScript standards (ES2020+)
- Custom rules for unused variables
```

### shadcn/ui Configuration (`components.json`)
```json
- New York style variant
- Tailwind CSS integration
- Path aliases for components
- Lucide React icon library
```

### JavaScript Configuration (`jsconfig.json`)
```json
- Path mapping for @/ imports
- Base URL configuration
```

## 🚀 Build & Development

### Available Scripts
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview built application
- `pnpm lint` - Run ESLint

### Build Output
- **Location:** `dist/` directory
- **Assets:** Optimized with content hashing
- **HTML:** Static HTML with React hydration
- **CSS:** Minified Tailwind CSS
- **JS:** Bundled and minified React application

### Development Server
- **Port:** Default Vite port (usually 5173)
- **Hot Reload:** Enabled for instant updates
- **Path Aliases:** @/ resolves to src/

## 🎭 Brand Identity

### Tone & Voice
- **Witty** - Humorous and engaging content
- **Street-smart** - Authentic South African perspective
- **Entertaining** - Focus on drama and excitement

### Target Audience
- South African entertainment enthusiasts
- Social media users interested in local culture
- Fans of Amapiano music and celebrity news

### Content Focus
- **Scandals** - Political and celebrity controversies
- **Entertainment** - Music events, awards shows
- **Culture** - Viral trends, social media phenomena
- **Drama** - Relationship drama, public feuds

### Visual Style
- **Movie-themed** - Cinematic design elements
- **Neon aesthetics** - Glowing effects and bright colors
- **Dynamic animations** - Smooth transitions and interactions
- **Mobile-responsive** - Optimized for all devices

## 📱 Responsive Design

### Breakpoints
- **Mobile** - Default (320px+)
- **Tablet** - md: (768px+)
- **Desktop** - lg: (1024px+)

### Mobile Optimizations
- Touch-friendly button sizes
- Responsive navigation
- Optimized particle count
- Mobile-first CSS approach

## 🔧 Dependencies

### Production Dependencies (Key)
- `react` & `react-dom` - Core React framework
- `framer-motion` - Animation library
- `@radix-ui/*` - Accessible UI primitives
- `tailwindcss` - CSS framework
- `lucide-react` - Icon library
- `class-variance-authority` - Component variants
- `clsx` & `tailwind-merge` - CSS class utilities

### Development Dependencies
- `vite` - Build tool
- `@vitejs/plugin-react` - React plugin for Vite
- `eslint` - Code linting
- `@eslint/js` - ESLint JavaScript rules
- `eslint-plugin-react-hooks` - React hooks linting
- `eslint-plugin-react-refresh` - React refresh linting

## 🎯 Future Enhancements

### Potential Improvements
- **Content Management** - CMS integration for dynamic content
- **User Authentication** - User accounts and preferences
- **Social Features** - Comments, sharing, user interactions
- **Performance** - Image optimization, lazy loading
- **SEO** - Meta tags, structured data, sitemap
- **Analytics** - User tracking and engagement metrics

### Technical Debt
- Consider migrating to TypeScript for better type safety
- Implement proper error boundaries
- Add unit tests for components
- Set up CI/CD pipeline
- Add performance monitoring

---

**Last Updated:** December 2024  
**Version:** 0.0.0  
**Maintainer:** Development Team

