const express = require("express");
const app = express();
const env = require("dotenv");
const cors = require("cors");
const http = require("http");
const port = process.env.PORT || 2000;

//ENVIRONMENT VARIABLE/CONSTANTS
env.config();

async function onServerStart() {
  console.log(`Server listening on port ${port}`);

  // Test DB
  require("./db/conn");
}

function main() {
  const server = http.createServer(app);
  server.listen(port, onServerStart);
  const socketio = require("socket.io");
  const io = socketio(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  const socketEvents = require("./socket");
  socketEvents(io);

  const userRoutes = require("./routes/user");
  const workspaceRoutes = require("./routes/workspace");
  const postRoutes = require("./routes/post");
  const classroomRoutes = require("./routes/classroom");
  const taskRoutes = require("./routes/task");


  app.use(cors());
  app.use(express.json());

  app.get("/", (req, res) => {
    res.send("ThoughtMuseum Server is up and running");
  });

  app.use("/api", userRoutes);
  app.use("/api", workspaceRoutes);
  app.use("/api", postRoutes);
  app.use("/api", classroomRoutes);
  app.use("/api", taskRoutes);

}

main();

