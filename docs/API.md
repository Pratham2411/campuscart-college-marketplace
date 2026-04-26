# CampusCart API Documentation

Base URL: `http://localhost:5000/api`

Authenticated endpoints require:

```http
Authorization: Bearer <jwt_token>
```

## Health

### `GET /health`

Returns a simple API readiness payload.

## Auth

### `POST /auth/signup`

Request body:

```json
{
  "name": "Aarav Mehta",
  "email": "aarav@campus.edu",
  "password": "secret123"
}
```

### `POST /auth/login`

Request body:

```json
{
  "email": "aarav@campus.edu",
  "password": "secret123"
}
```

### `GET /auth/me`

Returns the authenticated user profile.

## Users

### `GET /users/profile`

Returns the profile plus lightweight stats.

### `PATCH /users/profile`

Multipart form-data fields:

- `name`
- `email`
- `college`
- `phone`
- `bio`
- `avatar` file

### `GET /users/listings`

Returns listings created by the authenticated user.

## Products

### `GET /products`

Query params:

- `search`
- `category`
- `minPrice`
- `maxPrice`
- `sortBy`
- `page`
- `limit`

### `GET /products/:productId`

Returns the product plus related listings.

### `POST /products`

Multipart form-data fields:

- `title`
- `description`
- `price`
- `category`
- `condition`
- `campusLocation`
- `tags`
- `imageUrls` as JSON array or comma/newline-separated string
- `images` file array

### `PATCH /products/:productId`

Same payload shape as create, plus:

- `existingImages` as JSON array of retained image objects

### `DELETE /products/:productId`

Deletes a listing owned by the authenticated user.

## Wishlist

### `GET /wishlist`

Returns the current user's wishlist document and populated items.

### `POST /wishlist/:productId/toggle`

Adds or removes a product from the wishlist.

## Reviews

### `GET /reviews/product/:productId`

Returns all reviews for a listing.

### `POST /reviews/product/:productId`

Request body:

```json
{
  "rating": 5,
  "comment": "Exactly as described and easy pickup."
}
```

### `DELETE /reviews/:reviewId`

Deletes the current user's review or an admin-owned moderation target.

## Messages

### `GET /messages/conversations`

Returns grouped conversation summaries for the authenticated user.

### `GET /messages/thread/:productId/:participantId`

Returns the message thread for a product-specific conversation.

### `POST /messages/thread/:productId/:participantId`

Request body:

```json
{
  "body": "Is this still available for pickup near the library?"
}
```

### `PATCH /messages/thread/:productId/:participantId/read`

Marks the thread as read for the authenticated user.

## Reports

### `POST /reports/product/:productId`

Request body:

```json
{
  "reason": "Misleading description",
  "details": "The listing price changes in chat and the photos do not match."
}
```

## Admin

Admin routes require a user whose email is listed in `ADMIN_EMAILS` at signup.

### `GET /admin/dashboard`

Returns high-level platform metrics plus recent users and listings.

### `GET /admin/users`

Returns all users with listing counts.

### `GET /admin/products`

Returns all products for moderation.

### `GET /admin/reports`

Returns all reports with populated reporter and product details.

### `DELETE /admin/products/:productId`

Removes a listing through admin moderation.

### `PATCH /admin/reports/:reportId`

Request body:

```json
{
  "status": "resolved"
}
```

Allowed statuses:

- `pending`
- `resolved`
- `rejected`
