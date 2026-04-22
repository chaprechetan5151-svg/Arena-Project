# ⚔️ Time-Dilation Arena

**A Real-Time, Event-Driven Competitive Coding Platform.**

![Live Demo](https://img.shields.io/badge/Status-Live_on_Render-success?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-Node.js_|_Express_|_Socket.io_|_PostgreSQL-blue?style=for-the-badge)

## 📖 The Vision
The Time-Dilation Arena is a high-performance web application built to facilitate live coding battles. Moving away from the standard HTTP request-response cycle, this platform utilizes **Bi-directional WebSockets** to synchronize state across multiple clients instantly. Spectators can watch competitors type code in real-time with near-zero latency.

## 🚀 Live Access
- **Application URL:** [Insert Your Render Link Here]

## 🏗️ Architecture & Tech Stack
This project was intentionally built without heavy frontend frameworks (like React) to demonstrate mastery over the core web mechanics and DOM manipulation.

* **Frontend:** Vanilla HTML5, CSS3, JavaScript
* **Backend:** Node.js, Express.js
* **Real-Time Engine:** Socket.io (WebSocket Protocol)
* **Database:** PostgreSQL (Hosted on Neon.tech)
* **Security:** JSON Web Tokens (JWT) for session state, Bcrypt for password hashing.
* **Hosting:** Render

## ⚙️ Core Features
1. **Live Spectator Broadcast:** Socket.io captures keystroke events and broadcasts them to the spectator view instantly.
2. **Secure Authentication:** Complete registration and login system with encrypted credentials.
3. **Global Leaderboard:** Relational database integration to track competitor rankings and match history.
4. **RESTful API Architecture:** Clean separation of concerns between API routes and static file serving.

## 🧠 Engineering Challenges Solved
* **State Synchronization:** Managing volatile live-typing data alongside persistent database storage.
* **Cloud Deployment:** Configuring explicit routing for Express.js in a production environment to serve static HTML without view engines.
* **CORS & Security:** Handling Cross-Origin Resource Sharing for the WebSockets and securing API endpoints.

---
*Developed by Chetan Prabhakar Chapre - 1st Year B.Tech CSE.*