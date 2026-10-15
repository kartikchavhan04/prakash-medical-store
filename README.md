# Prakash Medical and General Store

A responsive product-catalogue website and store-admin dashboard built to match the supplied requirements document.

## Technology

- **Frontend:** React, Vite, Tailwind CSS, custom responsive CSS, React Router
- **Backend:** Python Flask REST API, JWT access tokens, bcrypt password hashing
- **Database:** MongoDB / MongoDB Atlas
- **Images:** Cloudinary in production; backend `app/uploads/` for existing local images
- **Hosting:** Render Static Site (frontend) + Render Web Service (API) + MongoDB Atlas

## Included features

### Public website
- Home page with categories, featured products, store contact details and contact CTA
- Product catalogue with search and category filtering
- Product details, multiple-image gallery, price/MRP/discount, stock and Rx badge
- About page with store story, services and medical-information guidance
- Contact page with store information, Google Maps embed, dynamic staff cards and contact form
- Customer registration and login (no OTP), customer profile dashboard and logout
- Mobile-first responsive layout

### Administrator area
- Separate administrator sign-in
- Dashboard counts for products, staff cards, customer accounts and unread messages
- Product CRUD: add, edit and delete; selling price, MRP, category, stock, images and prescription-required flag
- Staff-card CRUD: name, role/title, description, photo, phone and email
- Contact-message inbox: view, mark read and delete
- API endpoints that require an administrator JWT for management operations

### Not included (as specified in the requirements)
- Cart, checkout, order placement, online payment, home-delivery tracking, prescription upload/verification, OTP login or a mobile app

> This release is a **catalogue and store-information website**, not an online pharmacy checkout. Product availability/prices may change. Rx-labelled products must only be dispensed in accordance with applicable law and qualified professional guidance.

---

## 1. Prerequisites

Install:
- Python 3.10 or newer
- Node.js 20 or newer and npm
- A MongoDB instance (local MongoDB or MongoDB Atlas)

## 2. Configure MongoDB and the backend

Open a terminal in the `backend` folder:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
```

Edit `backend/.env` and set the MongoDB URI and unique secret values:

```dotenv
FLASK_ENV=development
SECRET_KEY=replace-with-a-long-random-secret
JWT_SECRET_KEY=replace-with-another-long-random-secret
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/?retryWrites=true&w=majority
MONGO_DB_NAME=prakash_medical_store
FRONTEND_URL=http://localhost:5173,http://127.0.0.1:5173,http://192.168.21.5:5173
PUBLIC_API_URL=http://localhost:5000
UPLOAD_FOLDER=app/uploads
MAX_CONTENT_LENGTH_MB=8
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
ADMIN_NAME=Prakash Medical Admin
ADMIN_EMAIL=your-admin-email@example.com
ADMIN_PASSWORD=choose-a-long-unique-password
```

Use the actual connection string from your MongoDB Atlas project (or a local MongoDB URI). URL-encode any special characters in an Atlas database password. Never commit `.env` or share the admin password.

Create a Cloudinary account and copy its cloud name, API key and API secret into these three backend-only variables in `backend/.env`. Never add Cloudinary credentials to the frontend or commit the populated `.env`. New product and staff images are uploaded to the separate Cloudinary folders `prakash-medical-store/products` and `prakash-medical-store/staff`. The Flask API stores and returns Cloudinary HTTPS URLs in the existing `images` and `image` fields.

Create the single administrator account:

```powershell
python seed_admin.py
```

Use an administrator password between 10 and 72 UTF-8 bytes. This command creates or updates the administrator in the `admins` collection using `ADMIN_EMAIL` and `ADMIN_PASSWORD`. There is no public admin registration page. Customer self-registration never grants admin privileges.

Start the Flask API:

```powershell
python run.py
```

The API runs at `http://localhost:5000`. Check `http://localhost:5000/api/health` for API/database status.

## 3. Start the React frontend

Open a second terminal from the project root:

```powershell
cd frontend
Copy-Item .env.example .env
npm install
npm run dev
```

Open the Vite URL shown in the terminal, normally `http://localhost:5173`.

- Public website: `http://localhost:5173/`
- Customer login/register: `http://localhost:5173/login` and `/register`
- Administrator login: `http://localhost:5173/admin/login`

For local development, leave `VITE_API_URL` empty: the frontend uses the current hostname with port `5000`, which supports both localhost and LAN access. Set `VITE_API_URL` to the backend origin (without `/api`) for production builds. The backend `FRONTEND_URL` accepts comma-separated origins; update the LAN entry to the frontend's current IP and port if the machine's IP changes. The backend must be reachable at that same host on port `5000`, and MongoDB must be reachable for registration, login, product saving and contact submissions. Add products in the admin panel before expecting them to appear in the catalogue.

## 4. API route overview

| Method | Path | Access | Purpose |
|---|---|---|---|
| GET | `/api/health` | Public | API and MongoDB status |
| POST | `/api/auth/register` | Public | Customer registration |
| POST | `/api/auth/login` | Public | Customer login |
| GET | `/api/auth/me` | Customer JWT | Current customer profile |
| GET | `/api/products` | Public | Search/filter product catalogue |
| GET | `/api/products/<id>` | Public | Product details |
| POST | `/api/products` | Admin JWT | Create product + image upload |
| PUT | `/api/products/<id>` | Admin JWT | Update product |
| DELETE | `/api/products/<id>` | Admin JWT | Delete product |
| GET | `/api/staff` | Public | Public staff cards |
| POST/PUT/DELETE | `/api/staff[/<id>]` | Admin JWT | Staff-card management |
| POST | `/api/contact` | Public | Save a contact message |
| GET | `/api/contact/messages` | Admin JWT | List contact messages |
| PATCH | `/api/contact/messages/<id>/read` | Admin JWT | Mark a message read |
| DELETE | `/api/contact/messages/<id>` | Admin JWT | Delete a message |
| POST | `/api/admin/auth/login` | Public credentials | Administrator login |
| GET | `/api/admin/stats` | Admin JWT | Admin dashboard counters |

## 5. Deploying with the free hosting setup

### MongoDB Atlas
1. Create a cluster and database user.
2. Allow network access from the backend host. For a quick test, Atlas allows `0.0.0.0/0`; for a production deployment, restrict access where possible.
3. Copy the connection URI to the Render environment variable `MONGO_URI`.

### Render (backend)
1. Create a Web Service connected to this repository.
2. Set **Root Directory** to `backend`.
3. Build command: `pip install -r requirements.txt`
4. Start command: `gunicorn run:app`
5. Add environment variables from `backend/.env.example`, including `MONGO_URI`, `MONGO_DB_NAME`, `SECRET_KEY`, `JWT_SECRET_KEY`, `FRONTEND_URL` and `PUBLIC_API_URL`.
6. Set `PUBLIC_API_URL` to the public Render API URL and `FRONTEND_URL` to the public Render Static Site URL (for this deployment: `https://prakash-medical-store.onrender.com`).
7. Run `python seed_admin.py` once using the same environment to create the admin account. Do not put credentials in frontend environment variables.

### Render Static Site (frontend)
1. Create a Static Site connected to this repository.
2. Set **Root Directory** to `frontend`, build command to `npm install && npm run build`, and publish directory to `dist`.
3. Set `VITE_API_URL` to the public Render API origin without `/api` (for this deployment: `https://prakash-medical-api.onrender.com`).
4. Deploy the static site. Configure an SPA rewrite to serve `index.html` for frontend routes.

### Cloudinary (persistent product and staff images)
1. In the Render backend Web Service, open **Environment** and set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` from the Cloudinary dashboard. Keep these values only in the backend service; do not use `VITE_` variables for credentials.
2. Redeploy/restart the backend after adding the variables. If any are absent, image uploads fail with a clear service error rather than silently saving a local-only URL.

### Migrate existing local uploads (optional)
Older MongoDB records may still refer to `/uploads/<filename>`. The source images that exist in this checkout are under `backend/app/uploads/` (the configured local upload directory). Preview which records point to available or missing files with a dry run from `backend`:

```powershell
python scripts\migrate_uploads_to_cloudinary.py
```

After confirming the dry-run report and configuring the backend `.env` with MongoDB and Cloudinary credentials, explicitly upload and update only the matching image URL fields with:

```powershell
python scripts\migrate_uploads_to_cloudinary.py --apply
```

The script preserves all other product/staff fields and never deletes local or Cloudinary files. It reports database references whose source file is unavailable; those images must be uploaded again by an administrator. Run it against the intended Atlas database only.

The legacy `/uploads/<filename>` route remains available for local files, but new production uploads use Cloudinary so they persist across Render restarts and redeploys.

## 6. Security and operations notes

- Set long, unique `SECRET_KEY` and `JWT_SECRET_KEY` values before hosting.
- Keep `.env` out of source control; only `.env.example` belongs in Git.
- Keep admin credentials private. Use a unique strong password and rotate it if exposed.
- The current app implements password authentication, role claims in JWTs, MongoDB uniqueness on customer/admin email, input validation and extension allow-listing for uploaded images. For a public production deployment, additionally configure rate limiting, HTTPS, backups, monitoring, image size/content inspection and a formal pharmacy/regulatory review.
- Do not upload sensitive patient data or prescription records: prescription upload/verification is outside this release's scope.

## Project structure

```text
prakash-medical-store/
├── backend/
│   ├── app/
│   │   ├── routes/          # Auth, catalogue, staff, contact, admin API
│   │   └── uploads/         # Locally stored uploaded images
│   ├── .env.example
│   ├── requirements.txt
│   ├── run.py
│   └── seed_admin.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/           # Public pages + user/admin dashboard pages
│   │   ├── api.js
│   │   └── index.css
│   ├── .env.example
│   └── package.json
├── README.md
└── .gitignore
```
