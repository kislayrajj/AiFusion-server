require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const chatRoutes = require("./routes/chatRoutes");
const botRoutes = require("./routes/botRoutes");
const http = require("http");  
const setupSocket = require("./socketServer"); 
const expertRoutes = require("./routes/expertRoutes")

const app = express();
const server = http.createServer(app);  

let allowedOrigins;

if (process.env.NODE_ENV === "production") {
  allowedOrigins = ["https://ai-fusion-client.vercel.app"];
} else {
  allowedOrigins =  ["http://localhost:5173", "http://localhost:5174"];
}
// let allowedOrigins=["http://localhost:5173"]


// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true 
}));
app.use(express.json());

// Connect MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/chatDB", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};
connectDB();

// Routes
app.use("/api/chat", chatRoutes);
app.use("/api/bot", botRoutes);
app.use("/api/experts", expertRoutes)

//  Setup Socket.IO
const io = setupSocket(server);

// Start Server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
