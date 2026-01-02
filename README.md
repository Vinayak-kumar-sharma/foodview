# 🍔 Food View

**Food View** is a full-stack application that reimagines food ordering as a **reel-based discovery experience**.  
Users scroll short food videos, discover dishes visually, and place mock orders directly from the content.

This project focuses on **system design, backend architecture, and UX flow**, rather than real-world payments or delivery.

---

## 🚀 Key Features

- 📱 Reel-style food discovery (short videos)
- 🔐 User authentication using JWT
- 🛒 Mock order creation and tracking
- 📦 Order status flow: `pending → confirmed → delivered`
- 🔔 Mock notifications (external-service ready)

---

## 🛠 Tech Stack

### Frontend
- Embedded JavaScript templating : EJS
- CSS
- JavaScript

### Backend
- Node.js
- PostgreSQL
- REST APIs
- JWT Authentication
- Supabase
- Imagekit.io
- Render

---

## 🧠 Design Highlights

- Content-first ordering experience
- Clean relational database design (orders & order items)
- Mocked payments and notifications for simplicity
- Scalable and service-ready backend architecture

---

## ⚙️ Setup

### Backend
```bash
cd backend
npm install
npm start
```
## .env 
```
JWT_KEY= secret_key
JWT_KEY_PARTNER = secret_key
DATABASE_URL= postgres_connection_string
IMAGEKIT_PUBLIC_KEY = secret_key
IMAGEKIT_PRIVATE_KEY = secret_key
IMAGEKIT_URL = secret_key
```

## 📌 Project Scope

❌ No real payments

❌ No real SMS or delivery integration

***✅ Built for learning, architecture demonstration, and portfolio use***
