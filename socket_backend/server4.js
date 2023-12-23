const http = require('http');
const express = require('express');
const app = express();
// 소켓이 http모듈로 생성된 서버에서만 동작
const server = http.createServer(app);
const PORT = 8000;

// cors 이슈 : 다른 서버에서 보내는 요청을 제한함
const cors = require('cors');
app.use(cors());

const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

const userIdArr = {};
// { "socket.id": "userId", "socket.id": "userId" ,"socket.id": "userId"  }

io.on('connection', (socket) => {
  console.log('socket id', socket.id);
  // abcdjfkladjflaksjrlew
  // [실습 3번] socket id를 이용해 입장 공지
  // io.emit("notice", { msg: `${socket.id}님이 입장하셨습니다.` });

  // [실습 3-1번] 입장 시에 받은 user id로 입장 공지
  socket.on('entry', (res) => {
    // [실습 3-2] 고민해보기
    // 상황(닉네임이 중복되는지)에 따라 정상적으로 notice를 하던지
    // 중복된다는 오류 메세지를 보내주던지
    io.emit('notice', { msg: `${res.userId}님이 입장하셨습니다.` });
    userIdArr[socket.id] = res.userId;
  });

  // [실습 3-3] 퇴장시키기
  socket.on('disconnect', () => {
    io.emit('notice', { msg: `${userIdArr[socket.id]}님이 퇴장하셨습니다.` });
    delete userIdArr[socket.id];
  });
});

server.listen(PORT, function () {
  console.log(`Sever Open: ${PORT}`);
});
