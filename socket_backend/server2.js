const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);
const PORT = 8000;

app.set('view engine', 'ejs');
app.get('/', function (req, res) {
  res.render('client2');
});

io.on('connection', (socket) => {
  socket.on('hello', (res) => {
    console.log('resSer:', res);
    io.emit('helloCli', { msg: 'Hello' });
  });

  socket.on('study', (res) => {
    console.log('resSer:', res);

    io.emit('studyCli', { msg: 'Study' });
  });
  socket.on('bye', (res) => {
    console.log('resSer:', res);

    io.emit('byeCli', { msg: 'Bye' });
  });
});

server.listen(PORT, function () {
  console.log(`SeverOpen ${PORT}`);
});
