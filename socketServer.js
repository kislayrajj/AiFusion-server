const { Server } = require("socket.io");

const setupSocket = (server, allowedOrigins) => {
  const io = new Server(server, {
    cors: { origin: allowedOrigins, methods: ["GET", "POST"] },
  });

  io.on("connection", (socket) => {
    console.log("A user Connected");

    socket.on("chat message", (msg) => {
      console.log("Server received message:", msg);
      const botEvent = `chat message ${msg.bot}`;
      socket.broadcast.emit(botEvent, msg);
    });

    socket.on("disconnect", () => {
      console.log("User Disconnected");
    });
  });

  return io;
};

module.exports = setupSocket;
