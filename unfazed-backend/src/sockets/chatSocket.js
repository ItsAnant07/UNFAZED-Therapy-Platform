const { Server } = require("socket.io");

function initSocket(server) {
  const io = new Server(server, {
    cors: { origin: process.env.CLIENT_URL || "http://localhost:5173" }
  });

  io.on("connection", socket => {
    socket.on("join_room", room => socket.join(room));
    socket.on("send_message", ({ room, message, sender }) => {
      io.to(room).emit("receive_message", { message, sender, at: new Date().toISOString() });
    });
  });

  return io;
}

module.exports = { initSocket };
