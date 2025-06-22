# 🧾 Item Add/View App

A full-stack application where users can add, view, and delete items along with image uploads.

---

## 🚀 Features

- 📤 Add new items with images
- 🖼️ Image carousel (via `react-slick`)
- 🗑️ Delete items (also removes uploaded image)
- 📦 Backend API with Express and MongoDB

---

## 🛠 Tech Stack

- **Frontend**: React, JavaScript, react-slick, CSS
- **Backend**: Node.js, Express, Mongoose
- **Database**: MongoDB
- **File Uploads**: Multer (to store images on server)

---

## 🧑‍💻 How to Run Locally

```bash
# 1. Clone the repo
git clone https://github.com/shobhitt7/ItemManager-add-view-Full-stack
cd itemManager

# 2. Backend setup
cd backend
npm install
# Create a .env file with:
# MONGO_URI=your_mongodb_connection_string
npm run dev

# 3. Frontend setup (in a separate terminal)
cd ../frontend
npm install
npm run dev


Folder Structure
pgsql
Copy code
item-app/
├── backend/         → Node.js + Express backend
│   ├── uploads/     → Image storage (ignored in Git)
│   ├── routes/      → API routes
│   ├── models/      → Mongoose models
│   └── server.js    → Entry point
├── frontend/        → React frontend
│   ├── src/         → Components & pages
│   └── App.jsx      → Main component
├── README.md        → You’re reading it 😎