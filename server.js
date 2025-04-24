const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(express.json());

let messages = [];

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

 
  socket.emit('messageList', messages);

  socket.on('sendMessage', (data) => {
    const userMessage = {
      id: Date.now().toString(),
      text: data.text,
      sender: data.sender,
    };

    messages.push(userMessage);
    io.emit('newMessage', userMessage);

    if (data.sender === 'user') {
      setTimeout(() => {
        const botMessage = {
          id: Date.now().toString() + '_bot',
          text: 'Echo: ' + data.text,
          sender: 'bot',
        };
        messages.push(botMessage);
        io.emit('newMessage', botMessage);
      }, 600);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(3000, () => {
  console.log('WebSocket server running at http://localhost:3000');
});
