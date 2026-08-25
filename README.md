# THE LUXBASKET

> **Premium Luxury Gifting E-Commerce Platform**

A full-featured luxury gifting e-commerce platform built with **Next.js 15**, **React 19**, **MongoDB**, **Tailwind CSS**, and more — featuring a complete storefront, user authentication, payment integration, and a powerful admin dashboard.

---

## Features

### Storefront
- Home page with dynamic hero section, featured collections, and banners
- Product catalogue with category filtering, search, and sorting
- Detailed product pages with image galleries and related products
- Shopping cart with persistent state (Zustand)
- Wishlist management
- Checkout flow with **Razorpay** payment gateway integration
- Coupon/discount code support

### User
- Authentication via **NextAuth v5** (email/password + Google OAuth)
- User dashboard for order history and profile management
- Address book management

### Admin Dashboard
- Overview analytics and stats
- Product management (CRUD + Cloudinary image uploads)
- Category & banner management
- Order management and status updates
- User management
- Inquiry management
- Newsletter subscriber management

### Other Pages
- About, Contact, Corporate Gifting, FAQ
- Shipping policy, Returns policy, Privacy policy, Terms & Conditions

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15.1.0 |
| UI Library | React 19.0.0 |
| Styling | Tailwind CSS 3.4.17 |
| Database | MongoDB + Mongoose 8.9.0 |
| Auth | NextAuth 5.0.0-beta.25 |
| State | Zustand 5.0.3 |
| Payments | Razorpay 2.9.6 |
| Media | Cloudinary + next-cloudinary |
| Email | Nodemailer 7.0.7 |
| Animations | Framer Motion 11.15.0 |
| Carousels | Swiper 11.1.15 |
| Charts | Recharts 2.15.0 |
| Forms | React Hook Form + Zod |
| Icons | Lucide React + React Icons |
| Image Processing | Sharp 0.33.5 |

---

## Getting Started

### Prerequisites
- Node.js 20+
- npm (included with Node.js)
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account
- Razorpay account

### Installation

```bash
git clone <repo-url>
cd THE_LUXBASKET
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:

```env
# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/luxbasket

# NextAuth
NEXTAUTH_SECRET=your-super-secret-key-min-32-chars
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@theluxbasket.com

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER=+91XXXXXXXXXX

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=The LuxBasket

# Admin
ADMIN_EMAIL=admin@theluxbasket.com
JWT_SECRET=your-jwt-secret-key
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint checks |

---

## Project Structure

```
src/
├── app/                  # Next.js App Router pages & API routes
│   ├── admin/            # Admin dashboard (products, orders, users, etc.)
│   ├── api/              # API routes (auth, products, orders, razorpay, etc.)
│   ├── cart/             # Cart page
│   ├── checkout/         # Checkout flow
│   ├── collections/      # Product catalogue
│   ├── dashboard/        # User dashboard
│   ├── product/          # Product detail pages
│   └── ...               # Other pages (about, contact, corporate, faq, etc.)
├── components/           # Reusable UI components
├── lib/                  # Utility functions and DB connection
├── models/               # Mongoose models (User, Product, Order, etc.)
├── store/                # Zustand state stores
└── middleware.js         # Route protection middleware
```

---

## Data Models

- **User** – authentication, roles (user/admin)
- **Product** – name, description, images, pricing, category, stock
- **Category** – product categories
- **Order** – items, payment status, shipping info
- **Cart** – persistent cart per user
- **Wishlist** – saved products
- **Address** – user delivery addresses
- **Coupon** – discount codes
- **Banner** – homepage/promotional banners
- **Inquiry** – contact & corporate inquiries
- **Subscriber** – newsletter subscribers

---

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

Follow the existing code style enforced by ESLint.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
