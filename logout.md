# Logout Redirect Debugging and Roadmap

This document summarizes the efforts to fix the logout functionality, ensuring it reliably redirects users to the landing page (`/`) instead of the login page (`/login`).

## 1. Problem Solved

The logout process now reliably redirects the user to the landing page (`/`) without incorrect intermediate redirects to `/login` or hydration errors on the landing page.

**Root Cause of Original Issue:** A race condition where `ConditionalLayout.tsx` would re-render multiple times during the logout process. Initially, it prematurely removed a `sessionStorage` flag (`isLoggingOut`) intended to signal an active logout. This caused subsequent re-renders (before the `window.location.assign('/')` to the landing page completed) to incorrectly interpret the user as simply unauthenticated on an app page, leading to a redirect to `/login`. Further, once the premature flag removal was fixed, a hydration error occurred on the landing page because `ConditionalLayout` would still see the flag (now correctly persistent) and try to render a "logout in progress" UI instead of the expected server-rendered landing page content.

**Final Solution:**
1.  **`handleLogout` functions** (in `UserSidebar.tsx` and `ConditionalLayout.tsx` for the mobile menu) set `sessionStorage.setItem('isLoggingOut', 'true')` and then call `window.location.assign('/')` without `await`.
2.  **`ConditionalLayout.tsx`** has a top-level check at the very beginning of its render logic:
    *   It reads `sessionStorage.getItem('isLoggingOut')`.
    *   If the flag is `true`:
        *   It checks the current `pathname`.
        *   If `pathname === '/'` (i.e., the browser has successfully navigated to the landing page), it removes the `isLoggingOut` flag from `sessionStorage` and allows `ConditionalLayout` to proceed with rendering the normal landing page content. This prevents hydration errors.
        *   If `pathname !== '/'` (i.e., logout is still in progress from an app page), it returns a minimal "Logout in progress..." UI and halts further rendering of `ConditionalLayout` for that pass. This prevents app page content from flashing or incorrect redirects.
    *   The `isLoggingOut` flag is *not* removed by `ConditionalLayout` when on an app page, allowing it to persist across rapid re-renders during the logout navigation.
3.  Other auth listeners (e.g., in `useProfileData.ts`, `app/(minimal)/skills/page.tsx`) were also modified to respect the `isLoggingOut` flag during their initial data fetching/auth checks to prevent them from interfering.

## 2. Efforts (Summary)

*   **Initial Attempts:** Focused on ensuring `window.location.assign('/')` was used, removing conflicting redirects in other auth listeners, and making `signOut()` non-blocking.
*   **`sessionStorage` Flag Introduction:** Implemented `isLoggingOut` to signal an active logout.
*   **Debugging `ConditionalLayout`:** Iteratively refined `ConditionalLayout`'s logic to handle the `isLoggingOut` flag correctly across re-renders, addressing:
    *   Premature removal of the flag.
    *   Ensuring the flag was checked at the right time (top-level early exit).
    *   Handling the flag correctly upon arrival at the landing page to prevent hydration errors.

## 3. Key Learnings

*   Client-side navigation and state updates, especially around authentication, can lead to complex race conditions with multiple components re-rendering.
*   Using a `sessionStorage` flag is a viable way to signal transient states across navigations, but its lifecycle (when it's set, read, and removed) needs careful management.
*   React hydration errors occur when client-rendered UI doesn't match server-rendered HTML. This was a secondary issue triggered by `ConditionalLayout` rendering an unexpected UI on the landing page due to the persistent logout flag.

This robust solution ensures a smooth and reliable logout experience. 