# 📝 Blogging Website

A full-stack dynamic blogging platform where users can register, create, edit, delete, view and comment on blogs. It includes secure authentication, image uploads using Multer, and a beautiful responsive UI with EJS templating.

---

## 🚀 Features

- ✅ User Authentication (Register / Login / Logout)
- 📝 Create, Read, Update, Delete (CRUD) for Blogs
- 🖼️ Upload blog cover images using **Multer**
- 🔐 Passwords hashed using **crypto.createHmac**
- 📄 Clean UI built using **EJS** templating
- 📦 MongoDB for scalable and fast data storage
- 🌐 RESTful routing with **Express.js**
- 📆 Timestamp for blog posts
- 💬 Add and view comments on individual blog posts

---

## 📂 Technologies Used

- **Frontend**: HTML, CSS, Bootstrap, EJS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose)
- **Authentication**: Custom login with hashed passwords
- **Image Uploads**: Multer
- **View Engine**: EJS

npm install
3. Create .env file
env
Copy
Edit
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret