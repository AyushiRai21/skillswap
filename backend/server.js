const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const statusMap = { 0: "disconnected", 1: "connected", 2: "connecting", 3: "disconnecting" };
  res.json({
    server: "ok",
    db: statusMap[dbStatus] || "unknown",
    dbState: dbStatus,
  });
});

// Test Route
app.get("/", (req, res) => {
  res.send("SkillSwap Backend Running 🚀");
});

const PORT = process.env.PORT || 5000;

// Start server
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: { origin: "*" }
});

// Middleware to inject io into routes
app.set('io', io);
app.use((req, res, next) => {
  req.io = io;
  next();
});

const onlineUsers = new Map(); // socket.id -> userId

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join_user', (userId) => {
    socket.join(`user_${userId}`);
    onlineUsers.set(socket.id, userId);
    io.emit('online_users', Array.from(new Set(onlineUsers.values())));
    console.log(`User ${userId} is online.`);
  });
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room: ${roomId}`);
  });

  socket.on('send_message', (data) => {
    // data: { roomId, sender, text }
    io.to(data.roomId).emit('receive_message', data);
  });

  socket.on('update_scratchpad', (data) => {
    // data: { roomId, content }
    socket.to(data.roomId).emit('receive_scratchpad', data.content);
  });

  socket.on('disconnect', () => {
    onlineUsers.delete(socket.id);
    io.emit('online_users', Array.from(new Set(onlineUsers.values())));
    console.log('User disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// MongoDB URI validation
const mongoUri = process.env.MONGO_URI;
function isPlaceholder(uri) {
  return !uri || /REPLACE_WITH|<.*>|REPLACE_ME/i.test(uri);
}

if (isPlaceholder(mongoUri)) {
  console.error("⚠️  Invalid MONGO_URI in .env — update backend/.env with your real MongoDB connection string.");
  console.error("    The server is running but all database operations will fail.");
} else {
  // Connect with exponential backoff, retry indefinitely
  let attempt = 0;
  async function connectWithRetry() {
    attempt += 1;
    try {
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 8000 });
      console.log("✅ MongoDB Connected");
      attempt = 0;
    } catch (err) {
      const msg = err && err.message ? err.message : String(err);
      console.error(`❌ MongoDB connection failed (attempt ${attempt}): ${msg}`);

      if (/auth|authentication/i.test(msg)) {
        console.error("   → Authentication error: check Atlas username/password and user permissions.");
      } else if (/ENOTFOUND|querySrv/i.test(msg)) {
        console.error("   → DNS lookup failed. Possible causes:");
        console.error("       1. MongoDB Atlas cluster is PAUSED — go to cloud.mongodb.com and click Resume");
        console.error("       2. Your IP is not whitelisted — add 0.0.0.0/0 in Atlas → Security → Network Access");
        console.error("       3. No internet connection");
      }

      const delay = Math.min(5000 * attempt, 30000); // cap at 30s
      console.log(`   → Retrying in ${delay / 1000}s...`);
      setTimeout(connectWithRetry, delay);
    }
  }
  connectWithRetry();
}

// Mount auth routes
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// Mount requests routes
// Mount requests routes
const requestsRoutes = require('./routes/requests');
app.use('/api/requests', requestsRoutes);

// Mount skills routes
const skillsRoutes = require('./routes/skills');
app.use('/api/skills', skillsRoutes);

// Mount messages routes
// Mount messages routes
const messagesRoutes = require('./routes/messages');
app.use('/api/messages', messagesRoutes);

// Mount reviews routes
const reviewsRoutes = require('./routes/reviews');
app.use('/api/reviews', reviewsRoutes);

// Mount notifications routes
const notificationsRoutes = require('./routes/notifications');
app.use('/api/notifications', notificationsRoutes);

// Mount users routes (Leaderboard, etc.)
const usersRoutes = require('./routes/users');
app.use('/api/users', usersRoutes);

// Mount match routes (NEW)
const matchRoutes = require('./routes/match');
app.use('/api/match', matchRoutes);

// Simple endpoint to check auth middleware via token
app.get('/protected', (req, res) => {
  res.json({ ok: true });
});
