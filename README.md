# 🛍️ KeosStall — E-commerce Platform

An end-to-end e-commerce web application where users can browse products, manage carts, place orders, and admins can manage inventory. Built with **React, Redux, Node.js, Express, MongoDB, and Firebase** for auth.

---

## 🚀 Demo Video

🎥 Click below to watch a full walkthrough of the project:

[![Watch Demo](https://img.youtube.com/vi/JZg64Wgq-54/0.jpg)](https://youtu.be/JZg64Wgq-54)

> Replace `YOUR_VIDEO_ID_HERE` with the actual YouTube or Loom video ID or full video URL if needed.

---

## ⚙️ Features

- 🔐 Firebase Email Authentication
- 🛒 Shopping Cart + Product Variants
- 💳 Checkout with Stripe & COD
- 🧾 Admin Dashboard (Create/Edit/Delete Products)
- 🗃️ Category & Sub-category Management
- 📦 Real-time Inventory Updates

---

## 🧰 Tech Stack

- **Frontend**: React, Redux, Ant Design, Toastify
- **Backend**: Node.js, Express
- **Database**: MongoDB Atlas
- **Auth**: Firebase Email Link Auth
- **Deployment**: Vercel (frontend) & Render/AWS (backend)

---

## 🛠️ How to Run Locally

```bash
# Clone repo
git clone https://github.com/yourusername/keosstall.git
cd keosstall

# Install dependencies
npm install

# Add your environment variables
touch .env
# Add MongoDB URI, Firebase config, and Stripe keys in the .env file

# Start frontend
npm start