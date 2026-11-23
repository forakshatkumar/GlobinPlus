# GlobinPlus Redesign – Setup & Firebase Notes

## Run locally

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173`.

## Features

- Public landing page with no navbar; sign-in and sign-up only in hero
- Blur-overlay authentication modal with email/password, Google and password reset
- Authenticated `/home` dashboard and floating centered navigation
- `/profile` three-column profile page with inline edit entry points, photo upload/crop/URL
- `/settings` with private profile preference, `/faq` accordion, footer/legal/contact pages
- Firestore-backed inventory and donation camp listings (empty states when no records exist)
- Donor interest stored in the current user's Firestore document

## Firebase console checklist

1. **Authentication** → Sign-in method: enable Email/Password and Google.
2. **Authentication** → Settings → Authorized domains: add `localhost` and your deployed domain.
3. **Firestore Database**: create a database in the same project as `src/firebase.js`.
4. **Firestore Rules**: publish the included `firestore.rules` (also includes read-only `bloodInventory` and `donationCamps`).
5. **Cloud Storage**: if enabled, publish `storage.rules` for image uploads. Cloud Storage may require Blaze billing.
6. If the previous app showed `Failed to get document because the client is offline`, check DevTools network requests to `firestore.googleapis.com`, VPN/firewall/ad blockers and project configuration. This build uses automatic long-polling detection but cannot guarantee that blocked networks will work.

## Firestore structure

- `users/{uid}`: private account details. Role is selected at signup; hospital verification is **not** self-granted.
- `bloodInventory/{id}`: `{ bloodGroup, hospitalName, location, units }` (read-only for authenticated users; admin-side creation is not implemented).
- `donationCamps/{id}`: `{ name, location, date }` (read-only for authenticated users; admin-side creation is not implemented).

The UI never invents real hospital inventory or camp data. Blood group, age, weight and height are self-reported, not medically verified. Profile privacy settings do not imply public sharing. No hospital verification or admin approval backend is included.

## Authentication / profile behavior

- Firebase Authentication is independent from Firestore availability. A user can sign in even if their Firestore profile is temporarily unavailable.
- New Google users select a role after sign-in. If Firestore is offline, they can continue and retry profile creation later.
- A missing Firestore profile can be created from `/profile` (default role: patient); this is intended for legacy or interrupted signups.
- Image URL input accepts HTTPS, but browser-only validation cannot guarantee remote content safety. Avoid private/sensitive URLs.
- Cropped images are uploaded to Firebase Storage and the download URL is stored in Firestore.
- Firestore and Storage rules must be deployed to the **correct Firebase project**; these files are not automatically applied by `npm run dev`.

## Build

```bash
npm run build
```

Install dependencies first. The project includes `framer-motion` in `package.json` for the modal transitions.
