require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
const db = require('./db'); // Connects to your PostgreSQL database

// 1. INITIALIZE APP FIRST
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// 2. MIDDLEWARE (The Gatekeepers)
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// 3. API ROUTES (The Database Logic)
const JWT_SECRET = 'arena_super_secret_key_2026';

app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await db.query(
            "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *",
            [username, email, hashedPassword]
        );
        res.status(201).json({ message: "Registered!", user: newUser.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Registration Error");
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        if (user.rows.length === 0) return res.status(404).send("User not found");

        const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
        if (!validPassword) return res.status(401).send("Invalid credentials");

        // Create the digital key (Token)
        const token = jwt.sign({ id: user.rows[0].id, username: user.rows[0].username }, JWT_SECRET);
        res.json({ token, username: user.rows[0].username });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Login error");
    }
});

app.get('/api/leaderboard', async (req, res) => {
    try {
        const topPlayers = await db.query(
            "SELECT username, global_rating, matches_played FROM users ORDER BY global_rating DESC LIMIT 10"
        );
        res.json(topPlayers.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

app.get('/api/status', (req, res) => {
    res.json({ system: 'Time-Dilation Arena', status: 'Online' });
});

// 4. THE EXPLICIT HTML ROUTES (The Web Pages)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});
app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});
app.get('/arena.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'arena.html'));
});
app.get('/spectate.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'spectate.html'));
});
app.get('/leaderboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'leaderboard.html'));
});

// 5. SOCKET.IO (Real-time Broadcast)
io.on('connection', (socket) => {
    console.log('📡 [SOCKET] A spectator or competitor has joined.');
    socket.on('coding', (data) => {
        socket.broadcast.emit('live-code-update', data);
    });
});

// 6. BOOT UP (Only ONE server.listen at the very bottom)
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 [SYSTEM] Arena Engine is running live on port ${PORT}`);
});