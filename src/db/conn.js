const mongoose = require("mongoose");

// const DB = 'mongodb://localhost/localdb';
const DB = 'mongodb+srv://zafar-123:zafar-123@cluster0.mcmvcmw.mongodb.net/thoughtmuseum_db?retryWrites=true&w=majority';

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
