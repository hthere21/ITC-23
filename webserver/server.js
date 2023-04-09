//Using mogodB
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://localhost:27017/ITC-data', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.on('connected', () => {
  console.log('Connected to MongoDB!');
});

//Using express
const express = require('express');
const app = express();
const routes = require('./routes/routes');
const cors = require('cors');


//Using socketio
const http = require('http');
const server = http.createServer(app);
const socketio = require('socket.io');
const io = socketio(server);

const port = process.env.PORT || 3000;


app.use(express.json());
app.use(cors());
app.use(routes);

io.on('connection', (socket) => {
  socket.on('join', (data) => {
      console.log(data);
      socket.join(data.room);
      socket.broadcast.to(data.room).emit('user joined');
  });

  socket.on('message', (data) => {
      console.log(data);
      io.in(data.room).emit('new message', {user: data.user, message: data.message});
  });
});

server.listen(port, () => {
  console.log(`started on port: ${port}`);
});