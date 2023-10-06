const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;
const host = process.env.HOST;

const corsOptions = {
  // origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));

mongoose.connect(process.env.URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

mongoose.connection.once("open", () => {
  console.log("Connect to mongoose");
});

const usersRouter = require("./routes/users");
app.use("/server/users", usersRouter);

const tasksRouter = require("./routes/tasks");
app.use("/server/tasks", tasksRouter);

const dailyTasksRouter = require("./routes/daily_tasks");
app.use("/server/daily_tasks", dailyTasksRouter);

const shoppingsRouter = require("./routes/shopping");
app.use("/server/shopping", shoppingsRouter);

app.listen(port, host, (err) => {
  if (err) console.log(err);
  else console.log(`Server is running on port ${port}`);
});
