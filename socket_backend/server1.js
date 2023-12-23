const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);
const PORT = 8000;
const SocketIO = require('socket.io');

app.set('view engine', 'ejs');
app.get('/', function (req, res) {
  res.render('client1');
});

io.on('connection', (socket) => {
  console.log('socket id:', socket.id);

  //   on을 이용해 client에서 보낸 데이터를 받을 이벤트를 등록.
  socket.on('hello', (res) => {
    console.log('res:', res);
    socket.emit('bye', { msg: '잘가' });
  });

  socket.on('entry', (res) => {
    io.emit('notice', { msg: `${socket.id}님이 입장` });
  });
});

server.listen(PORT, function () {
  console.log(`SeverOpen ${PORT}`);
});
