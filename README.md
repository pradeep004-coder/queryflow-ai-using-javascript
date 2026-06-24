
# **QueryFlow – AI Chat Assistant**

QueryFlow is an AI-powered chat application built with **Next.js** and **Express.js**, designed for fast, intelligent, and seamless query handling.
It provides real-time conversational responses, secure user accounts, rich UI/UX features, and persistent chat storage.

🔗 **Live Demo:** [https://query-flow-ai-red.vercel.app/](https://query-flow-ai-red.vercel.app/)

---

## 🚀 **Tech Stack**

### **Frontend**

* Next.js (App Router)
* React
* Tailwind CSS
* HTML, CSS, JavaScript
* Syntax Highlighting + Markdown Rendering

### **Backend**

* Node.js
* Express.js
* MongoDB
* Mongoose

### **Deployment**

* Vercel (Frontend)
* Render (Backend)

---

## ⭐ **Features**

### 🔥 **Major Features**

* **Real-Time AI Responses**
  Instant, accurate answers powered by the Gemini AI API.

* **User Authentication System**
  Secure login/sign-up with token-based authentication.

* **Automatic Login Persistence (3 Days)**
  No need to re-login if the user revisits within 3 Days on the same device.

* **Chat Storage**
  All chats are stored and loaded from MongoDB so users never lose progress.

* **Navigate to Any Query/Response Instantly**
  Jump to any part of the conversation with smooth scroll anchoring.

* **Edit Query**
  Edit any query as many times as needed. Changes affect only the targeted query and its regenerated response; all subsequent chats remain intact.

---

### 💻 **Developer-Friendly Features**

* **Collapsible Responses** (Ideal for long answers)
* **Syntax Highlighting for Code Blocks**
* **Copy to Clipboard** for code and AI responses
* **Multi-Line Query Support**
* **Markdown Rendering for AI Answers**

---

### 📱 **User-Friendly Design**

* **Responsive UI** optimized for mobile, tablet & desktop
* **Clean & minimal interface**
* **Date & Time Badging** for each message
* **Smooth animations** and interaction feedback

---

## 📁 **Folder Structure**

### **Backend**

Backend/
│── auth/
│   ├── auth.controller.js
│   ├── auth.middleware.js
│   ├── auth.route.js
│   ├── auth.schema.js
│
│── chat/
│   ├── chat.controller.js
│   ├── chat.middleware.js
│   ├── chat.model.js
│   ├── chat.route.js
│   ├── chat.schema.js
│   ├── chat.service.js
│
│── Models/
│   ├── db.js
│
│── user/
│   ├── user.model.js
|
│── utils/
│   ├── aiService.js
│
│── index.js
│── package.json
│── vercel.json
│── .env


### **Frontend**

Frontend/
│── public/
│   ├── icons & images
│
│── src/
│   ├── app/
│   │   ├── login/page.js
│   │   ├── signup/page.js
│   │   ├── context/context.js
│   │   ├── page.js (main chat UI)
│   │
│   ├── components/
│   │   ├── Answers.jsx
│   │   ├── AnswerLine.jsx
│   │   ├── ChatSection.jsx
│   │   ├── ConfirmLogout.jsx
│   │   ├── DateBadge.jsx
│   │   ├── InputSection.jsx
│   │   ├── Navbar.jsx
│   │   ├── Question.jsx
│   │   ├── QuestionEditor.jsx
│   │   ├── Sidebar.jsx
│   │   └── WelcomeContent.jsx
│   │
│   ├── constants/
│   │   └── env.js
│   │
│   ├── utils/
│   │   └── helper.js
│
│── globals.css
│── package.json


---

## ⚙️ **How It Works**

1. User logs in (or stays logged-in via 24hr token).
2. User enters a query.
3. Query is sent Gemini AI API.
4. Response returns in real-time and gets rendered with Markdown & syntax highlighting.
5. Chat is stored in MongoDB for future sessions.
6. User can edit, copy, navigate, collapse and manage responses easily.

---

## 🛠️ **Installation & Setup**

### **1. Clone the repository**

git clone https://github.com/pradeep004-coder/QueryFlow.ai.git
cd QueryFlow.ai



### **2. Backend Setup**

cd Backend
npm install


Create a **.env** file with:

MONGO_URI=your_mongo_url
JWT_SECRET=your_secret
GEMINI_API_KEY=your_key


Start backend:
node index.js

### **3. Frontend Setup**

cd Frontend
npm install
npm run dev

---

## 📌 **Future Improvements**

* Dark/Light theme toggle
* Export chat as PDF
* Voice input & response
* Multi-model AI selection

---