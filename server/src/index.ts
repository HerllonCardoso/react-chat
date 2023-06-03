import express, { Request, Response } from 'express';
import { Socket } from 'socket.io';
import * as path from 'path';

const app = express();

app.set('port', process.env.PORT || 3000);

const http = require('http').Server(app);

const io = require('socket.io')(http);

app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.resolve('./client/index.html'));
});

io.on('connection', (socket: Socket) => {
  console.log('a user connected', socket.id);

  socket.on('disconnect', (reason: string) => {
    console.log('user disconnected', socket.id);
  });

  socket.on('set_username', (username: string) => {
    socket.data.username = username;
  });

  socket.on('message', (text: string) => {
    io.emit('receive_message', {
      text,
      authorId: socket.id,
      author: socket.data.username,
    });
  });
});

http.listen(3000, function () {
  console.log('listening on *:3000');
});
