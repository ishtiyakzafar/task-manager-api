const mongoose = require("mongoose");

// const DB = 'mongodb://localhost/localdb';
const DB = 'mongodb+srv://ishtiyaquejaffer:VQk5aZrvYCqIzcZE@cluster0.dmytrfs.mongodb.net/?retryWrites=true&w=majority';

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => console.log("Database not connected"));
