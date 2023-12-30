const express = require("express");
const app = express();
const env = require("dotenv");
const cors = require("cors");
const port = process.env.PORT || 2000;

//ENVIRONMENT VARIABLE/CONSTANTS
env.config();

//MONGODB CONNECTION
require("./db/conn");

const userRoutes = require("./routes/user");
const taskRoutes = require("./routes/task");
const attendanceRoutes = require("./routes/attendance");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Task Manager Server is up and running");
});

app.use("/api", userRoutes);
app.use("/api", taskRoutes);
app.use("/api", attendanceRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


