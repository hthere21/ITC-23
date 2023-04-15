//Using mogodB
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
mongoose.connect('mongodb+srv://hai215:12345@cluster0.rplyggb.mongodb.net/ITC-data?retryWrites=true&w=majority', {
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
let http = require('http');
let server = http.Server(app);

let socketIO = require('socket.io');
let io = socketIO(server);

const port = process.env.PORT || 3000;


app.use(express.json());
app.use(cors());
app.use(routes);

//Using socket.io in backend
// io.on('connection', (socket) => {
//   socket.on('join', (data) => {
//       socket.join(data.room);
//       socket.broadcast.to(data.room).emit('user joined');
//   });

//   socket.on('message', (data) => {
//       io.in(data.room).emit('new message', data);
//   });
// });

io.on('connection', (socket) => {
  socket.on('join', (data) => {
      socket.join(data.room);
      socket.broadcast.to(data.room).emit('user joined');
  });

  socket.on('message', (data) => {
      io.emit('new message', data);
  });
});


server.listen(port, () => {
  console.log(`started on port: ${port}`);
});


