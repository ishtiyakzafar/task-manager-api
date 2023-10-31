const express = require("express");
const app = express();
const env = require("dotenv");
const cors = require("cors");
const http = require("http");
const port = process.env.PORT || 2000;
const cron = require('node-cron');

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


cron.schedule('*/1 * * * *', () => {
  // Send an HTTP request to your server
  const options = {
    hostname: 'task-manager-api-t9h4.onrender.com',  // Change to your server's hostname or IP address
    port: port,             // Change to your server's port
    path: '/',              // Change to the path you want to ping
    method: 'GET',
  };

  const pingReq = http.request(options, (pingRes) => {
    console.log(`Ping request response: ${pingRes.statusCode}`);
  });

  pingReq.on('error', (error) => {
    console.error(`Error in ping request: ${error.message}`);
  });

  pingReq.end();
});