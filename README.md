# CourtBooker 🏸

A premium, full-stack sports facility booking platform built with Next.js 14, MongoDB, and Clerk Authentication.

## 🚀 Features

- **Dynamic Booking Engine**: Calculates pricing in real-time based on day (weekend/weekday) and time (peak/non-peak).
- **Resource Management**: Book courts, rent equipment, and hire coaches in a single atomic transaction.
- **Role-Based Access**:
  - **Player Portal**: Browse availability, manage cart, and view booking history.
  - **Admin Dashboard**: Analytics on revenue, active users, and facility usage.
- **Concurrency Control**: Prevents double-booking using MongoDB ACID transactions.
- **Modern UI**: Fully responsive, glassmorphic design with Dark Mode support (Tailwind CSS v4).

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router, Server Actions)
- **Database**: MongoDB (Mongoose ORM)
- **Auth**: Clerk (Middleware protected routes)
- **Styling**: Tailwind CSS v4 + Lucide React Icons
- **Validation**: Zod & TypeScript

## ⚙️ Setup Instructions

1. **Clone the repo**
   ```bash
   git clone [https://github.com/LakshyaVerma123kl/Badminton-book](https://github.com/LakshyaVerma123kl/Badminton-book)
   cd court-booker
   ```
