require('dotenv').config();
const express = require('express');
const path = require('path');

// 1. Tell Express to serve any HTML/CSS/JS files in this folder to the public
app.use(express.static(__dirname));

// 2. Set the "Front Door" - if they hit the main link, send them to login!
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const bcrypt = require('bcrypt');
const db = require('./db');

// 1. Initialize the Express App
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

// 2. Middleware
app.use(cors());
app.use(express.json());

// 3. Socket.io Logic (Real-time)
io.on('connection', (socket) => {
    console.log('📡 [SOCKET] A spectator or competitor has joined.');
    socket.on('coding', (data) => {
        socket.broadcast.emit('live-code-update', data);
    });
});

// 4. API Routes
app.get('/api/status', (req, res) => {
    res.json({ system: 'Time-Dilation Arena', status: 'Online' });
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

// 5. Boot Up (Only one server.listen at the very bottom)
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 [SYSTEM] Arena Engine is running live on http://localhost:${PORT}`);
});
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'arena_super_secret_key_2026';

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
        res.status(500).send("Login error");
    }
});