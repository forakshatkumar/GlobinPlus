# GlobinPlus authentication and profile setup

1. In Firebase Authentication, enable Email/Password and Google sign-in and authorize your local and production domains.
2. In Firestore Rules, publish the contents of `firestore.rules`.
3. In Firebase Storage, create a bucket (billing may be required), then publish `storage.rules`.
4. Run `npm install` and `npm run dev` from `client`.
5. Register or sign in; click the avatar in the navbar to edit your profile.

**Privacy note:** The Firestore user document is owner-readable only. Photo download URLs are bearer URLs and can be accessed by anyone with the URL; do not treat profile photos as confidential. External photo URLs are only checked for HTTPS; they are not independently verified or proxied. Do not use this prototype for actual sensitive health records without additional security review.

**Hospital accounts:** Registration does not grant verified hospital status. Approval and privileged hospital inventory functionality require a trusted administrator/backend implementation.

**Google:** The signup screen offers a role selector. Google sign-in from the login screen defaults new accounts to patient. If Firestore profile creation fails, check your rules and retry.
