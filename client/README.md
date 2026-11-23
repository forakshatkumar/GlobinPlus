# GlobinPlus — Premium Landing Page

Responsive React + Vite + Tailwind CSS landing page for the GlobinPlus blood donation platform.

## Get started

```bash
cd client
npm install
npm run dev
```

Open the local URL printed by Vite.

## Included

- Responsive landing page inspired by the provided design reference
- Supplied GlobinPlus logo (in `public/globinplus-logo.png`)
- Custom SVG blood droplet, red blood cells, ECG, and blood-bag illustrations
- Navbar, hero, about, resources, donation guide, impact, community CTA and footer
- Smooth CSS motion and scroll-triggered reveal effects with reduced-motion support
- React Router routes for resource exploration, camps, donor info, login and sign up

## Important

This is a **frontend prototype**. The feature destinations and authentication pages currently show clear "coming soon" informational screens rather than pretending to provide verified real-time blood inventory or live authentication.

Framer Motion was not installed because the package registry was unavailable in the editing environment; lightweight CSS animations and IntersectionObserver are used instead. The original Vite/Tailwind/Lucide/Router dependencies are preserved. Install Framer Motion separately if you want it for future development.
