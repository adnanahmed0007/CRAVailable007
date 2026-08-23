# BloodConnect — What's New

Everything below was added on top of your existing app. Nothing about your
existing signup/login/donate/search flow was removed — only extended.

## 1. Dark / Light Mode
- Toggle button (sun/moon icon) in the header, on desktop and mobile.
- Saves your choice in the browser and remembers it next visit; if you've
  never chosen, it follows your OS's light/dark setting.
- Applied across every page: Home, Donate, Signup, Login, Search, Results,
  All Blood, Admin, Profile, and the new Nearby Hospitals page.

## 2. Find Nearby Hospitals (new page: `/nearby-hospitals`, also in the nav)
- Tap **"Use My Location"** → the browser asks permission → your position
  shows on an interactive map (OpenStreetMap, no API key required).
- Nearby hospitals are pulled live from OpenStreetMap's free Overpass API
  and listed sorted by distance, with a 5/10/20 km radius switch.
- Tap **"Use"** on any hospital and it takes you straight to the Donate
  form with that hospital (and its address) already filled in. There's also
  a **"Find on map"** shortcut right on the Donate form.

## 3. Admin Panel — Delete & Add Users
- The existing Admin dashboard's delete buttons (for users, blood requests,
  and donation records) now actually call working backend routes — they
  were pointed at endpoints that didn't exist before.
- New **"Add User"** button on the Users tab opens a form so an admin can
  create a donor (or another admin) account directly, without that person
  signing up themselves.
- `/admin` is now guarded: only accounts with `role: "admin"` can view it;
  everyone else is redirected home.

### Creating your first admin
Because a brand-new database has no admin account yet, there's a one-time
bootstrap route. After you sign up normally as yourself:

1. Add a secret to `Server/.env`:
   ```
   ADMIN_SETUP_KEY=some-long-random-string-you-pick
   ```
2. Restart the server, then send one request (replace the values):
   ```bash
   curl -X POST https://your-server-url/auth/dontaion/api/donation/api/admin/promote \
     -H "Content-Type: application/json" \
     -d '{"email":"you@example.com","setupKey":"some-long-random-string-you-pick"}'
   ```
3. Log out and back in — your account is now an admin, and `/admin` will
   let you in. You can remove `ADMIN_SETUP_KEY` from `.env` afterward, or
   rotate it, since the route is otherwise locked behind that secret.

Once you have one admin, you can promote/create further admins from inside
the Admin panel's "Add User" form (set Role → Admin).

## 4. Donation History & Stats (on your Profile page)
- Total donations and estimated "lives saved" (×3 per donation).
- A status chip showing **Eligible** to donate now, or a **countdown** if
  you're within the standard 90-day gap since your last donation.
- A full history list: hospital, address, and date for every donation
  you've registered.

## Setup (unchanged, just a reminder)
**Server** (`/Server`):
```bash
npm install
# .env needs: PORT, DB_URL (MongoDB), JWT_SECRET, ADMIN_SETUP_KEY (see above)
npm run dev   # or: node index.js
```

**Client** (`/Client/vite-project`):
```bash
npm install
npm run dev
```

Note: the client currently talks to a hardcoded URL
(`https://blooddonatio2-9.onrender.com`) in several files — if you deploy
your own backend, update that base URL (search for it across `src/`).

## Files added
```
Server/middleware/VerifyAdmin.js
Server/controllers/MyDonations.js
Server/controllers/UpdateLocation.js
Server/controllers/Admin/DeleteUser.js
Server/controllers/Admin/DeleteBloodRequired.js
Server/controllers/Admin/DeleteDonation.js
Server/controllers/Admin/AdminAddUser.js
Server/controllers/Admin/PromoteAdmin.js
Client/vite-project/src/ThemeContext.jsx
Client/vite-project/src/NearbyHospitals.jsx
Client/vite-project/src/AdminRoute.jsx
```

## Files significantly changed
```
Server/models/DonerRegistration.js   (role + location fields)
Server/controllers/Profile.js         (returns donationCount)
Server/routes/Service/DonationRoutes.js
Client/vite-project/src/App.jsx
Client/vite-project/src/Header.jsx    (theme toggle, nav item)
Client/vite-project/src/Admin.jsx     (working deletes, add-user modal, dark mode)
Client/vite-project/src/Profile.jsx   (donation history/stats, dark mode)
Client/vite-project/src/Donate.jsx    (map hand-off, dark mode)
Client/vite-project/tailwind.config.js (darkMode: "class")
Client/vite-project/src/main.jsx      (ThemeProvider)
+ dark mode classes applied to Home, Signup, Login, SearchbLood,
  Searchvalue, ViewAllBloodRequired, Logout
```

## Known limitations / next steps
- The duplicate top-level `vite-project/` folder from your original zip
  (a stray copy outside `Client/`) was removed as unused — `Client/vite-project`
  is the real app.
- Hospital search depends on OpenStreetMap's data coverage for your area;
  it's excellent in most cities but can be sparse in rural areas.
- The Overpass API is a shared public service — for very high traffic
  you may eventually want your own Overpass instance or a paid provider.
