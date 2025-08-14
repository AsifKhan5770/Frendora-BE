# Node.js Express MongoDB API

A simple REST API built using **Node.js**, **Express**, and **MongoDB** with **Mongoose**.  
The project follows a modular folder structure (MVC pattern) for scalability and maintainability.

---

## 📂 Folder Structure

```
project-root/
│
├── node_modules/              # Installed dependencies (ignored in Git)
├── src/                       # Source code
│   ├── config/                 # Database config files
│   ├── models/                 # Mongoose models
│   ├── controllers/            # Request handling logic
│   ├── routes/                 # API routes
│   └── server.js               # Application entry point
│
├── .env                        # Environment variables (ignored in Git)
├── .env.example                # Example env file
├── .gitignore                  # Ignored files/folders
├── package.json                # Dependencies & scripts
├── package-lock.json           # Locked dependency versions
└── README.md                   # Project documentation
```

---

## ⚙️ Setup Instructions

### 1️⃣ Install Dependencies
```bash
npm install
```

### 2️⃣ Environment Variables
Create a `.env` file in the root directory and add:
```env
PORT=3000
MONGO_URI=your-mongodb-connection-string
```
You can make a copy of `.env` as `.env.example` without values for reference.

### 3️⃣ Run the Application

**Development Mode** (auto-reload with nodemon):
```bash
npx nodemon src/server.js
```

**Production Mode**:
```bash
node src/server.js
```

---

## 📡 API Endpoints

| Method | Endpoint     | Description         |
|--------|-------------|---------------------|
| GET    | `/`         | Home route          |
| GET    | `/users`    | Get all users       |
| GET    | `/products` | Get all products    |
| GET    | `/posts`    | Get all posts       |

---

## 🛠 Technologies Used
- Node.js
- Express.js
- MongoDB (Mongoose)
- dotenv
- nodemon

---

## 📜 License
This project is licensed under the **MIT License**.
