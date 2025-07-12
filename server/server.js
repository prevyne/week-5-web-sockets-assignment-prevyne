const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const configureSocket = require('./socket/socketHandler');

dotenv.config();

const app = express();
const server = http.createServer(app);

// --- HARDCODED URL FOR TESTING ---
const allowedOrigin = 'https://week-5-web-sockets-assignment-prevy.vercel.app';

const corsOptions = {
  origin: allowedOrigin,
  methods: ['GET', 'POST'],
};

app.use(cors(corsOptions));

const io = new Server(server, {
  cors: corsOptions,
});

app.use(express.json());
app.use('/api/auth', authRoutes);

configureSocket(io);

app.get('/', (req, res) => {
  res.send('Chat Server is running.');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});