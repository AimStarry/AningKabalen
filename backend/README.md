# 🌾 AningKabalen — Backend API

Farm-to-Buyer Marketplace REST API built with **Node.js**, **Express**, **TypeScript**, and **MongoDB/Mongoose**.

---

## 📁 Project Structure

```
aningkabalen-backend/
├── src/
│   ├── server.ts               ← App entry point
│   ├── controllers/            ← Route handlers (business logic)
│   │   ├── authController.ts
│   │   ├── userController.ts
│   │   ├── listingController.ts
│   │   ├── categoryController.ts
│   │   ├── reservationController.ts
│   │   ├── transactionController.ts
│   │   ├── reviewController.ts
│   │   ├── notificationController.ts
│   │   └── addressController.ts
│   ├── models/                 ← Mongoose schemas
│   │   ├── User.ts
│   │   ├── Address.ts
│   │   ├── Category.ts
│   │   ├── Listing.ts
│   │   ├── Reservation.ts
│   │   ├── Transaction.ts
│   │   ├── Review.ts
│   │   ├── Notification.ts
│   │   └── AuditLog.ts
│   ├── routes/                 ← Express routers
│   ├── middleware/             ← auth, error, upload
│   ├── utils/                  ← jwt helpers, APIFeatures
│   ├── database/               ← connection + seed
│   └── types/                  ← Express type augmentation
├── uploads/                    ← Uploaded images (gitignored)
├── .env.example
├── package.json
└── tsconfig.json
```

---

## ⚡ Quick Start

### 1. Prerequisites
- Node.js 18+
- MongoDB running locally **or** a MongoDB Atlas connection string

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment
```bash
cp .env.example .env
# Edit .env — set MONGO_URI and JWT_SECRET
```

### 4. Seed the database
```bash
npm run seed
```
This creates sample farmers, buyers, categories, listings, reservations, transactions, and reviews.

**Seeded accounts:**
| Role   | Email                        | Password      |
|--------|------------------------------|---------------|
| Admin  | admin@aningkabalen.ph        | Admin123!     |
| Farmer | aimee@farm.ph                | Password123!  |
| Farmer | pangan@farm.ph               | Password123!  |
| Farmer | juan@farm.ph                 | Password123!  |
| Buyer  | carlos@buyer.ph              | Password123!  |
| Buyer  | ana@buyer.ph                 | Password123!  |

### 5. Start development server
```bash
npm run dev
```
API runs at `http://localhost:5000`

### 6. Build for production
```bash
npm run build
npm start
```

---

## 🔗 API Endpoints

All endpoints are prefixed with `/api`.

### Auth  `/api/auth`
| Method | Path              | Auth     | Description              |
|--------|-------------------|----------|--------------------------|
| POST   | `/register`       | Public   | Register new user        |
| POST   | `/login`          | Public   | Login, returns JWT token |
| GET    | `/me`             | 🔒 Any   | Get current user profile |
| PATCH  | `/me`             | 🔒 Any   | Update profile + avatar  |
| PATCH  | `/me/password`    | 🔒 Any   | Change password          |

### Users  `/api/users`
| Method | Path                   | Auth      | Description                    |
|--------|------------------------|-----------|--------------------------------|
| GET    | `/`                    | 🔒 Admin  | List all users (paginated)     |
| GET    | `/farmers`             | Public    | List verified farmers          |
| GET    | `/:id`                 | 🔒 Any    | Get user by ID                 |
| PATCH  | `/:id/verify`          | 🔒 Admin  | Update verification status     |
| PATCH  | `/:id/deactivate`      | 🔒 Admin  | Deactivate user account        |

### Categories  `/api/categories`
| Method | Path     | Auth      | Description             |
|--------|----------|-----------|-------------------------|
| GET    | `/`      | Public    | List all categories     |
| GET    | `/:id`   | Public    | Get single category     |
| POST   | `/`      | 🔒 Admin  | Create category         |
| PATCH  | `/:id`   | 🔒 Admin  | Update category         |
| DELETE | `/:id`   | 🔒 Admin  | Delete category         |

### Listings  `/api/listings`
| Method | Path                    | Auth        | Description                        |
|--------|-------------------------|-------------|------------------------------------|
| GET    | `/`                     | Public      | List all listings (search/filter)  |
| GET    | `/:id`                  | Public      | Get listing detail                 |
| GET    | `/farmer/:farmerId`     | Public      | Listings by farmer                 |
| GET    | `/my/listings`          | 🔒 Farmer   | My own listings                    |
| POST   | `/`                     | 🔒 Farmer   | Create listing (+ image upload)    |
| PATCH  | `/:id`                  | 🔒 Farmer   | Update my listing                  |
| PATCH  | `/:id/status`           | 🔒 Farmer/Admin | Update listing status          |
| DELETE | `/:id`                  | 🔒 Farmer/Admin | Delete listing                 |

**Query params for GET `/`:** `search`, `status`, `category_id`, `sort`, `page`, `limit`

### Reservations  `/api/reservations`
| Method | Path              | Auth        | Description                     |
|--------|-------------------|-------------|---------------------------------|
| GET    | `/`               | 🔒 Admin    | All reservations                |
| GET    | `/my`             | 🔒 Any      | My reservations (buyer/farmer)  |
| POST   | `/`               | 🔒 Buyer    | Create reservation              |
| GET    | `/:id`            | 🔒 Any      | Get reservation by ID           |
| PATCH  | `/:id/status`     | 🔒 Farmer/Admin | Confirm / cancel             |

**Create reservation body:**
```json
{
  "listing_id":      "...",
  "quantity_kg":     20,
  "payment_method":  "gcash",
  "pickup_schedule": "2026-04-01T09:00:00Z",
  "notes":           "Please pack separately"
}
```

### Transactions  `/api/transactions`
| Method | Path              | Auth        | Description                      |
|--------|-------------------|-------------|----------------------------------|
| GET    | `/`               | 🔒 Admin    | All transactions (paginated)     |
| GET    | `/stats`          | 🔒 Admin    | Platform revenue stats           |
| GET    | `/my`             | 🔒 Any      | My transactions                  |
| GET    | `/:id`            | 🔒 Any      | Transaction detail               |
| PATCH  | `/:id/status`     | 🔒 Admin/Farmer | Update status                |

**Status values:** `pending` → `confirmed` → `processed` → `completed` / `cancelled`

### Reviews  `/api/reviews`
| Method | Path                      | Auth      | Description              |
|--------|---------------------------|-----------|--------------------------|
| GET    | `/target/:targetId`       | Public    | Reviews for a target     |
| POST   | `/`                       | 🔒 Any    | Submit review            |
| DELETE | `/:id`                    | 🔒 Admin  | Delete review            |

### Notifications  `/api/notifications`
| Method | Path            | Auth    | Description               |
|--------|-----------------|---------|---------------------------|
| GET    | `/`             | 🔒 Any  | My notifications          |
| PATCH  | `/:id/read`     | 🔒 Any  | Mark one as read          |
| PATCH  | `/read-all`     | 🔒 Any  | Mark all as read          |

### Addresses  `/api/addresses`
| Method | Path     | Auth    | Description           |
|--------|----------|---------|-----------------------|
| GET    | `/`      | 🔒 Any  | My addresses          |
| POST   | `/`      | 🔒 Any  | Add address           |
| PATCH  | `/:id`   | 🔒 Any  | Update address        |
| DELETE | `/:id`   | 🔒 Any  | Delete address        |

---

## 🔑 Authentication

All protected routes require a **Bearer token** in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

Tokens are returned from `/api/auth/register` and `/api/auth/login`.

---

## 📦 Connecting to Angular Frontend

In your Angular service files, replace hardcoded data with API calls:

```typescript
// environment.ts
export const environment = {
  apiUrl: 'http://localhost:5000/api'
};

// listings.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ListingService {
  private base = `${environment.apiUrl}/listings`;

  constructor(private http: HttpClient) {}

  getAll(params?: any) {
    return this.http.get<any>(`${this.base}`, { params });
  }

  getById(id: string) {
    return this.http.get<any>(`${this.base}/${id}`);
  }

  create(data: FormData, token: string) {
    return this.http.post<any>(this.base, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}
```

---

## 🗄️ Database Collections

| Collection    | Description                                  |
|---------------|----------------------------------------------|
| `users`       | Farmers, buyers, and admins                  |
| `addresses`   | User delivery/farm addresses                 |
| `categories`  | Product categories (Vegetables, Fruits, etc.)|
| `listings`    | Farmer crop listings                         |
| `reservations`| Buyer reservations (pre-transactions)        |
| `transactions`| Completed/in-progress payments               |
| `reviews`     | Farmer/listing ratings and comments          |
| `notifications`| In-app notifications                        |
| `auditlogs`   | Admin action audit trail                     |

---

## 🛡️ Security Features
- **bcryptjs** password hashing (salt rounds: 10)
- **JWT** authentication with configurable expiry
- **helmet** HTTP security headers
- **cors** origin restriction to Angular client URL
- **express-rate-limit** — 200 req/15min general, 20 req/15min for auth
- **Role-based access control** — `buyer`, `farmer`, `admin` guards on every protected route
- Passwords never returned in any API response (`toJSON` transform)

---

## 🌱 Environment Variables

| Variable          | Default                              | Description                  |
|-------------------|--------------------------------------|------------------------------|
| `PORT`            | `5000`                               | Server port                  |
| `MONGO_URI`       | `mongodb://localhost:27017/aningkabalen` | MongoDB connection string |
| `JWT_SECRET`      | *(required)*                         | JWT signing secret           |
| `JWT_EXPIRES_IN`  | `7d`                                 | Token expiry                 |
| `CLIENT_URL`      | `http://localhost:4200`              | Angular app URL (CORS)       |
| `UPLOAD_DIR`      | `uploads`                            | Image upload directory       |
| `MAX_FILE_SIZE_MB`| `10`                                 | Max image upload size in MB  |
