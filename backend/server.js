const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.send("SkillSwap Backend Running 🚀");
});

const PORT = process.env.PORT || 5000;

// MongoDB connect with validation and better error messages
const mongoUri = process.env.MONGO_URI;
function isPlaceholder(uri) {
  return !uri || /REPLACE_WITH|<.*>|REPLACE|password|<password>/i.test(uri);
}

if (isPlaceholder(mongoUri)) {
  console.error("Invalid MONGO_URI in .env — contains placeholders or is empty. Update backend/.env with a real connection string.");
  process.exit(1);
}

// Connect with retry/backoff to make local startups more resilient
const MAX_RETRIES = 5;
const RETRY_BASE_MS = 1000;
let attempt = 0;

async function connectWithRetry() {
  attempt += 1;
  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB Connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    const msg = err && err.message ? err.message : String(err);
    console.error(`Failed to connect to MongoDB: ${msg}`);
    if (/auth|authentication/i.test(msg)) {
      console.error("Authentication failed — check username/password, database name, and Atlas user permissions. Also ensure your IP is whitelisted in Atlas.");
      // do not retry on auth errors
      process.exit(1);
    }
    if (attempt >= MAX_RETRIES) {
      console.error(`Exceeded ${MAX_RETRIES} connection attempts. Giving up.`);
      process.exit(1);
    }
    const delay = RETRY_BASE_MS * Math.pow(2, attempt - 1);
    console.log(`Retrying connection in ${delay}ms (attempt ${attempt}/${MAX_RETRIES})`);
    setTimeout(connectWithRetry, delay);
  }
}

connectWithRetry();

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
const messagesRoutes = require('./routes/messages');
app.use('/api/messages', messagesRoutes);

// Simple endpoint to check auth middleware via token
app.get('/protected', (req, res) => {
  res.json({ ok: true });
});
