# CampusCart College Marketplace

CampusCart is a full-stack marketplace built for college communities. Students can create listings, browse items, save wishlists, chat with sellers, leave reviews, report abuse, and moderate content through an admin dashboard.

## Tech Stack

- Frontend: React, React Router, Tailwind CSS, Axios
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose
- Authentication: JWT with bcrypt hashing
- Media: Cloudinary uploads with hosted URL fallback for quick demos
- Local DX: Optional in-memory MongoDB fallback when `MONGO_URI` is blank

## Project Structure

```text
college-marketplace/
├── client/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── utils/
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── validators/
│   ├── .env.example
│   └── package.json
├── docs/
│   ├── API.md
│   └── screenshots/
├── package.json
└── README.md
```

## Features

### Authentication

- Student signup and login
- JWT-based protected routes
- Bcrypt password hashing
- Persistent auth session on the frontend
- Role-based admin access

### Marketplace

- Create, edit, delete, and browse listings
- Category, keyword, and price filtering
- Product detail pages with seller context
- Hosted image URLs or Cloudinary file uploads

### User Experience

- Editable seller profile with avatar upload
- My listings dashboard
- Wishlist management
- Loading, error, and empty states

### Trust & Engagement

- Ratings and reviews
- Buyer-seller chat threads
- Report listing workflow
- Admin moderation dashboard

## Environment Variables

### Server

Copy [server/.env.example](/C:/Users/prath/OneDrive/Desktop/Marketplace/server/.env.example) to `server/.env`.

```env
PORT=5000
NODE_ENV=development
MONGO_URI=
JWT_SECRET=replace_this_with_a_secure_secret
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=college-marketplace
ADMIN_EMAILS=admin@campuscart.edu
```

Notes:

- Leave `MONGO_URI` blank for a quick local demo. The server will boot with an in-memory MongoDB instance.
- Set `MONGO_URI` to MongoDB Atlas or a local Mongo instance for persistent data.
- Cloudinary credentials are required for direct file uploads. Hosted image URLs still work without Cloudinary, which is handy for demos.

### Client

Copy [client/.env.example](/C:/Users/prath/OneDrive/Desktop/Marketplace/client/.env.example) to `client/.env`.

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Installation

Run these commands from the project root:

```powershell
npm install
npm install --prefix server
npm install --prefix client
```

## Local Development

Start both apps together:

```powershell
npm run dev
```

Or run them separately:

```powershell
npm run dev --prefix server
npm run dev --prefix client
```

Default local URLs:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api`
- Health check: `http://localhost:5000/api/health`

## Production Build

Build the frontend bundle:

```powershell
npm run build --prefix client
```

Backend verification:

```powershell
Get-ChildItem .\server\src -Recurse -Filter *.js | ForEach-Object { node --check $_.FullName }
```

## How To Test Key Flows

1. Sign up two users: one seller and one buyer.
2. If you want admin access, sign up with the email listed in `ADMIN_EMAILS`.
3. Create listings from the seller account.
4. Browse and filter listings from the marketplace page.
5. Save items to the wishlist.
6. Open a product detail page and send a message to the seller.
7. Submit a review from a second account.
8. Report a listing from a second account.
9. Log in as admin and moderate the report or remove a listing.

## Deployment Notes

### Frontend on Vercel

- Set `VITE_API_BASE_URL` to your deployed backend URL plus `/api`
- Build command: `npm run build`
- Output directory: `dist`

### Backend on Render

- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`
- Set `MONGO_URI`, `JWT_SECRET`, `FRONTEND_URL`, and Cloudinary variables in Render

### Database on MongoDB Atlas

- Create a cluster
- Add your Render IP or `0.0.0.0/0` during testing
- Copy the connection string into `MONGO_URI`

## API Documentation

See [docs/API.md](/C:/Users/prath/OneDrive/Desktop/Marketplace/docs/API.md) for endpoint-level documentation and payload guidance.

## Screenshots

Screenshots are stored in `docs/screenshots/`:

- [Home](/C:/Users/prath/OneDrive/Desktop/Marketplace/docs/screenshots/home.png)
- [Marketplace](/C:/Users/prath/OneDrive/Desktop/Marketplace/docs/screenshots/marketplace.png)
- [Product Detail](/C:/Users/prath/OneDrive/Desktop/Marketplace/docs/screenshots/product-detail.png)
- [Login](/C:/Users/prath/OneDrive/Desktop/Marketplace/docs/screenshots/login.png)
