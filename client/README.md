#  AI-Powered E-Commerce Platform

A full-stack e-commerce web application with an intelligent AI chatbot for product discovery, cart management, and order handling.

---

## Features

### Core E-commerce
- Product listing with search, category, and price filters
- Product detail view
- Add to cart functionality
- Quantity management (increase/decrease)
- Remove items from cart
- Persistent cart using localStorage

---

###  Wishlist
- Add/remove products to wishlist
- Save favorite items for later

---

###  Orders System
- Place orders from cart
- Orders stored in backend database
- View order history

---

### Authentication & Roles
- User authentication using Clerk
- Role-based access (Admin / User)
- Protected routes

---

###  Admin Dashboard
- Add new products
- Edit existing products
- Delete products
- Manage product catalog

---

###  AI Chatbot (Highlight Feature)
- Conversational product search
- Add to cart via chat
- Intent-based system (AI + rule-based hybrid)
- Smart filtering using:
  - Title
  - Category
  - Description
- Supports queries like:
  - "cheap phones"
  - "laptop under 50000"
  - "add shoes to cart"

---

## Tech Stack

### Frontend
- React.js
- Bootstrap
- Context API (State Management)

### Backend
- Node.js
- Express.js

### Database
- MongoDB (Mongoose)

### AI Integration
- Google Gemini API (intent-based chatbot)

### Authentication
- Clerk

---
