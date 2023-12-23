const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const PORT = 8000;

const cors = require('cors');
app.use(cors());

const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

const userIdArr = {};

const updateUserList = () => {
  io.emit('userList', userIdArr);
};

io.on('connection', (socket) => {
  console.log('socket id', socket.id);
  socket.on('entry', (res) => {
    if (Object.values(userIdArr).includes(res.userId)) {
      socket.emit('error', {
        msg: '중복된 아이디가 존재하여 입장이 불가합니다.',
      });
    } else {
      io.emit('notice', { msg: `${res.userId}님이 입장하셨습니다.` });
      socket.emit('entrySuccess', { userId: res.userId });
      userIdArr[socket.id] = res.userId;
      updateUserList();
    }
    console.log(userIdArr);
  });
  socket.on('disconnect', () => {
    io.emit('notice', { msg: `${userIdArr[socket.id]}님이 퇴장하셨습니다.` });
    delete userIdArr[socket.id];
    console.log(userIdArr);
    updateUserList();
  });

  socket.on('sendMsg', (res) => {
    if (res.dm === 'all') io.emit('chat', { userId: res.userId, msg: res.msg });
    else {
      // io.to(소켓아이디).emit()
      io.to(res.dm).emit('chat', {
        userId: res.userId,
        msg: res.msg,
        dm: true,
      });
      socket.emit('chat', { userId: res.userId, msg: res.msg, dm: true });
    }
  });
});

server.listen(PORT, function () {
  console.log(`Sever Open: ${PORT}`);
});
