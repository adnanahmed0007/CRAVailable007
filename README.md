
#  CRAvailable — Blood Donation & Hospital Finder Platform

CRAvailable is a full-stack blood donation and hospital discovery platform designed to connect blood donors with people searching for specific blood groups while also helping users find nearby hospitals based on their current location.

The platform provides donor registration, blood donation records, blood requirement requests, hospital discovery, user profiles, donation history, admin management, authentication, and location-based services through a React frontend and Node.js/Express backend.

---

##  Features

###  Blood Donation Management

CRAvailable allows registered users to participate in the blood donation system.

Users can:

* Register as blood donors
* Select their blood group
* Provide donor information
* Register a blood donation
* Select the hospital where they donated
* Provide donation address
* View their previous donation records
* Track their total number of donations

Each donation record is associated with the authenticated user.

---

## 🔎 Blood Search

Users can search for available donors based on blood group and hospital.

The search system supports:

* Blood group selection
* Hospital-based searching
* Phone/contact information
* Blood requirement queries
* Matching available donor records

The system checks donor records stored in MongoDB and returns matching donation information.

Supported blood groups:

```text
A+
A-
B+
B-
O+
O-
AB+
AB-
```

---

## 🆘 Blood Requirement Requests

Users can submit a blood requirement when they need a particular blood group.

A blood requirement contains:

* Blood group
* Nearest hospital
* Contact phone number
* Request/query information
* Creation timestamp

These requests can be viewed by authorized users and managed through the admin panel.

---

# 🏥 Nearby Hospital Finder

One of the main features of CRAvailable is the location-based hospital finder.

Users can:

1. Open the Nearby Hospitals page
2. Allow browser location access
3. Detect their current latitude and longitude
4. Search for hospitals near their location
5. View hospitals on an interactive map
6. Change the search radius
7. View hospital information
8. Select a hospital for the donation process

The application supports different search ranges such as:

```text
5 KM
10 KM
20 KM
```

The backend validates the latitude, longitude, and search radius before requesting nearby hospital information.

---

## 🗺️ Interactive Map

The frontend uses **Leaflet** to display location information and nearby hospitals on an interactive map.

The map allows users to visually understand where nearby hospitals are located.

The hospital information can include:

* Hospital name
* Address
* Latitude
* Longitude
* Phone number
* Website
* Emergency availability
* Hospital category

---

## 📍 Location-Based Donation Workflow

CRAvailable connects hospital discovery with the donation workflow.

Users can:

```text
Get Current Location
        ↓
Find Nearby Hospitals
        ↓
Select Hospital
        ↓
Open Donation Form
        ↓
Hospital Information Pre-Filled
        ↓
Register Donation
```

This reduces the need for users to manually search and enter hospital information.

---

# 👤 User Authentication

The application provides secure authentication using JWT.

Users can:

* Sign up
* Log in
* Log out
* Check their current login session
* Access their profile
* Access protected donation features

Authentication is implemented using:

* JSON Web Tokens
* HTTP cookies
* bcrypt password hashing
* Protected Express routes

---

## 🔐 JWT Authentication Flow

```text
User
 ↓
Login
 ↓
Email + Password
 ↓
MongoDB User Lookup
 ↓
bcrypt Password Verification
 ↓
JWT Generated
 ↓
JWT Stored in Cookie
 ↓
Protected API Requests
 ↓
JWT Verification Middleware
 ↓
Authenticated User
```

The backend uses middleware to verify the JWT token before allowing access to protected resources.

---

# 👤 User Profile

Authenticated users have access to their profile information.

The profile system can display:

* Name
* Email
* Phone number
* Blood group
* Age
* User role
* Donation statistics
* Donation history
* Location information

---

# 📊 Donation History & Statistics

The profile section provides information about the user's donation activity.

Users can view:

* Total donations
* Previous donation records
* Hospital information
* Donation address
* Donation date
* Estimated lives saved

The application also provides donation eligibility information based on the user's previous donation activity.

---

# 🌙 Dark & Light Mode

CRAvailable supports both:

* 🌞 Light Mode
* 🌙 Dark Mode

The selected theme is stored in the browser so the user's preference can be remembered between visits.

If the user has not selected a theme, the application can follow the operating system's preferred theme.

Dark/light mode is applied across major pages including:

* Home
* Login
* Signup
* Donate
* Search
* Blood Requests
* Profile
* Admin Dashboard
* Nearby Hospitals

---

# 👨‍💼 Admin Dashboard

CRAvailable includes an admin panel for managing the platform.

Admin users can manage:

### 👥 Users

Admins can:

* View registered users
* Add new users
* Create donor accounts
* Create admin accounts
* Delete users
* Promote users to admin

### 🩸 Blood Requirements

Admins can:

* View blood requirement requests
* Delete blood requirement records

### 💉 Donation Records

Admins can:

* View donation records
* Delete donation records

---

# 🔒 Role-Based Authorization

The application supports two main roles:

```text
Donor
Admin
```

Admin routes are protected using two middleware layers:

```text
JWT Authentication
        ↓
Verify JWT
        ↓
Load User
        ↓
Check Role
        ↓
Admin Access
```

Normal users cannot access admin-only APIs.

If a user without admin privileges attempts to access an admin endpoint, the backend returns an authorization error.

---

# 🛡️ Admin Security

The admin panel is protected using role-based authorization.

The backend checks:

```text
req.user.role === "admin"
```

before allowing administrative operations.

Admins also cannot delete their own account through the user deletion endpoint, helping prevent accidental lockout.

---

# 👨‍💻 Admin User Creation

Admins can create users directly from the admin dashboard.

The admin can provide:

* Name
* Email
* Phone
* Blood group
* Age
* Password
* Role

The system checks whether the email or phone number already exists before creating the account.

Passwords are hashed using bcrypt before being stored.

---

# ⚙️ Admin Bootstrap

A new database does not initially contain an admin account.

CRAvailable provides a one-time admin promotion mechanism using an environment secret.

An existing registered user can be promoted to admin using:

```text
ADMIN_SETUP_KEY
```

After the first administrator has been created, additional users/admins can be managed from the admin panel.

For security, the setup key should be removed or rotated after initial configuration.

---

# 📍 Saving User Location

Authenticated users can save their location.

The backend stores:

```text
Latitude
Longitude
Address
```

The location is associated with the user's account and can be updated through the protected location API.

---

# 🗄️ Database Models

CRAvailable uses MongoDB with Mongoose.

## 👤 Donor User

The donor/user model stores:

```text
name
age
email
phone
bloodGroup
password
role
location
createdAt
updatedAt
```

User roles include:

```text
donor
admin
```

---

## 🩸 Blood Requirement

Blood requirement records contain:

```text
bloodGroup
nearestHospital
phone
query
createdAt
updatedAt
```

---

## 💉 Donation Record

Donation records contain:

```text
bloodGroup
registerDay
address
nearestHospital
phoneNumber
userId
createdAt
updatedAt
```

The donation record maintains a relationship with the authenticated donor.

---

# 🔗 API Structure

The backend follows a REST API architecture.

### Authentication

```text
POST /auth/api/signup
POST /auth/api/login
GET  /auth/api/me
GET  /auth/api/profile
GET  /auth/api/logout
```

### Donation Services

```text
POST /auth/dontaion/api/donation/api/register
POST /auth/dontaion/api/donation/api/get
GET  /auth/dontaion/api/donation/api/getall
GET  /auth/dontaion/api/donation/api/getallbloodrequired
GET  /auth/dontaion/api/donation/api/getallusers
GET  /auth/dontaion/api/donation/api/mydonations
POST /auth/dontaion/api/donation/api/location
```

### Admin

```text
DELETE /auth/dontaion/api/donation/api/admin/user/:id

POST /auth/dontaion/api/donation/api/admin/user

DELETE /auth/dontaion/api/donation/api/admin/bloodrequired/:id

DELETE /auth/dontaion/api/donation/api/admin/donation/:id
```

### Hospital Search

```text
POST /api/overpass
```

---

# 🏗️ Project Architecture

The application follows a client-server architecture.

```text
                    CRAvailable
                        │
          ┌─────────────┴─────────────┐
          │                           │
       Frontend                    Backend
          │                           │
      React.js                  Node.js
          │                           │
      React Router              Express.js
          │                           │
      Axios API Calls               │
          │                           │
          └──────────────┬────────────┘
                         │
                     REST APIs
                         │
                ┌────────┴────────┐
                │                 │
             MongoDB         Hospital API
                │                 │
             Mongoose        Geoapify
                                  │
                              Location Data
```

---

# 📂 Project Structure

```text
CRAvailable/
│
├── Client/
│   └── vite-project/
│       │
│       ├── src/
│       │   ├── Admin.jsx
│       │   ├── AdminRoute.jsx
│       │   ├── App.jsx
│       │   ├── Context1.js
│       │   ├── Donate.jsx
│       │   ├── Header.jsx
│       │   ├── Home.jsx
│       │   ├── Login.jsx
│       │   ├── Logout.jsx
│       │   ├── NearbyHospitals.jsx
│       │   ├── Profile.jsx
│       │   ├── SearchbLood.jsx
│       │   ├── Searchvalue.jsx
│       │   ├── Signup.jsx
│       │   ├── ThemeContext.jsx
│       │   └── ViewAllBloodRequired.jsx
│       │
│       ├── package.json
│       ├── vite.config.js
│       └── tailwind.config.js
│
└── Server/
    │
    ├── controllers/
    │   ├── Admin/
    │   ├── Check.js
    │   ├── Donation.js
    │   ├── FIndAllblood.js
    │   ├── FindallUser.js
    │   ├── Login.js
    │   ├── Logout.js
    │   ├── MyDonations.js
    │   ├── Profile.js
    │   ├── Search.js
    │   ├── Signup.js
    │   ├── UpdateLocation.js
    │   └── overpassController.js
    │
    ├── middleware/
    │   ├── VerifyAdmin.js
    │   └── VerifyJwt.js
    │
    ├── models/
    │   ├── BloodRequired.js
    │   ├── DonerRegistration.js
    │   └── DonorBlooddonation.js
    │
    ├── routes/
    │   ├── Authentication/
    │   ├── Service/
    │   └── overpassRoutes.js
    │
    ├── utils/
    │   └── Generatetoken.js
    │
    ├── index.js
    └── package.json
```

---

# 🛠️ Tech Stack

## Frontend

* React.js
* Vite
* React Router
* Axios
* Tailwind CSS
* Leaflet
* Lucide React
* React Toastify

## Backend

* Node.js
* Express.js
* REST APIs

## Database

* MongoDB
* Mongoose

## Authentication & Security

* JWT
* bcrypt
* HTTP cookies
* Role-based authorization
* Protected routes

## Location & Maps

* Leaflet
* Geoapify
* Browser Geolocation API

## Development Tools

* Git
* GitHub
* Postman / API testing tools
* Vercel
* Render

---

# 🔄 Complete User Flow

## Donor Registration

```text
Open Website
     ↓
Signup
     ↓
Enter Personal Information
     ↓
Select Blood Group
     ↓
Create Account
     ↓
Password Hashed
     ↓
User Saved in MongoDB
     ↓
JWT Authentication
```

---

## Donating Blood

```text
Login
  ↓
Donate
  ↓
Enter Blood Group
  ↓
Select Hospital
  ↓
Enter Address
  ↓
Select Donation Date
  ↓
Submit
  ↓
Donation Record Saved
  ↓
Appears in Profile History
```

---

## Finding a Hospital

```text
Nearby Hospitals
       ↓
Allow Location
       ↓
Get Latitude / Longitude
       ↓
Select Search Radius
       ↓
Backend Hospital API
       ↓
Nearby Hospitals
       ↓
Display on Map
       ↓
Select Hospital
       ↓
Continue to Donation
```

---

## Finding Blood

```text
Select Blood Group
        ↓
Enter Hospital
        ↓
Submit Search
        ↓
Backend Searches MongoDB
        ↓
Matching Donors / Records
        ↓
Display Results
```

---

# 🔐 Environment Variables

Create a `.env` file inside the server directory.

```env
PORT=9090

DB_URL=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

ADMIN_SETUP_KEY=your_admin_setup_key

GEOAPIFY_API_KEY=your_geoapify_api_key
```

Never commit your `.env` file to GitHub.

---

# ⚙️ Installation

## 1. Clone the Repository

```bash
git clone YOUR_REPOSITORY_URL
cd CRAvailable
```

---

## 2. Install Backend Dependencies

```bash
cd Server
npm install
```

Create your `.env` file:

```env
PORT=9090
DB_URL=your_mongodb_url
JWT_SECRET=your_jwt_secret
ADMIN_SETUP_KEY=your_admin_setup_key
GEOAPIFY_API_KEY=your_geoapify_api_key
```

Start the backend:

```bash
node index.js
```

---

## 3. Install Frontend Dependencies

Open another terminal:

```bash
cd Client/vite-project
npm install
```

Start the frontend:

```bash
npm run dev
```

The frontend will normally run on:

```text
http://localhost:5173
```

---

# 🌐 Deployment

The application can be deployed using separate frontend and backend services.

### Frontend

The React/Vite frontend can be deployed using platforms such as:

```text
Vercel
```

### Backend

The Node.js/Express backend can be deployed using:

```text
Render
```

### Database

MongoDB Atlas can be used for the production database.

---

# 🔒 Security Considerations

CRAvailable implements several security mechanisms:

* Password hashing with bcrypt
* JWT authentication
* Protected API routes
* Role-based admin authorization
* HTTP cookie-based authentication
* Input validation
* Email uniqueness
* Phone uniqueness
* Blood group validation
* Admin-only operations
* CORS configuration
* Environment-based secrets

---

# ⚠️ Current Limitations

The current implementation has some areas that can be improved for larger-scale production use.

### Hospital API Dependency

Nearby hospital search depends on an external hospital/location provider.

The application requires a valid:

```text
GEOAPIFY_API_KEY
```

Hospital data quality also depends on the provider's geographic coverage.

### Scalability

The current API retrieves some datasets directly from MongoDB without pagination.

For a large production deployment, these endpoints should use:

* Pagination
* Database indexes
* Filtering
* Sorting
* Aggregation

### Blood Matching

The current blood search is primarily based on:

```text
Blood Group
+
Hospital
```

A future version could introduce more advanced donor matching based on:

* Distance
* Donor availability
* Last donation date
* Donation eligibility
* Blood compatibility
* Response status

---

# 🚀 Future Improvements

Planned improvements could include:

### 📍 Advanced Donor Matching

```text
Blood Group
     ↓
Location
     ↓
Distance
     ↓
Eligibility
     ↓
Available Donors
```

### 🔔 Notifications

Notify donors when a matching blood request is created.

Possible notification channels:

* In-app notifications
* Email
* SMS
* Push notifications

### 🩸 Blood Request Status

Add request states:

```text
OPEN
 ↓
DONOR FOUND
 ↓
CONTACTED
 ↓
FULFILLED
```

### 📊 Analytics Dashboard

Add statistics such as:

* Total registered donors
* Total donations
* Active blood requests
* Blood group distribution
* Most requested blood groups
* Donations by location
* Hospital statistics

### 🔎 Better Search

Add filters for:

* Blood group
* Distance
* Hospital
* Location
* Donor availability

### 📱 Mobile Application

A future mobile version could provide:

* Push notifications
* Faster location access
* Donor availability status
* Emergency blood requests

---

# 💡 What I Learned

Through CRAvailable, I worked with:

* Full-stack application architecture
* React frontend development
* REST API development
* MongoDB data modeling
* JWT authentication
* Role-based authorization
* Password hashing
* Protected routes
* Browser geolocation
* Interactive maps
* External API integration
* Admin dashboard development
* Donation history management
* Location-based search
* Dark/light theme implementation
* Deployment of frontend and backend applications

---

# 🎯 Project Goal

The goal of CRAvailable is to make it easier for users to:

**Find blood → Find donors → Find nearby hospitals → Register donations**

while providing administrators with tools to manage users, blood requirements, and donation records.

---

## 👨‍💻 Author

**Adnan Ahmed**

Computer Science & Engineering

 

---

## ⭐ If You Find This Project Useful

Consider giving the repository a ⭐ on GitHub.
