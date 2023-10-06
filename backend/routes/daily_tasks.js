const router = require("express").Router();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dailyTaskSchema = new Schema({
  name: {
    type: String,
    require: true,
  },

  reward: {
    type: Number,
    require: true,
  },
  share_id: {
    type: String,
    require: true,
  },

  redeem: {
    type: [String],
    default: [],
  },

  date: {
    type: String,
    default: "",
  },

  category: {
    type: String,
    default: "daily",
  },
});

const DailyTask = mongoose.model("DailyTasks", dailyTaskSchema);

/* add a new task */
router.route("/new_task").post((req, res) => {
  const info = req.body;

  const new_task = new DailyTask({
    name: info.name,
    date: info.date,
    share_id: info.share_id,
    reward: info.reward,
    category: info.category,
  });

  new_task
    .save()
    .then(() => res.json(new_task))
    .catch((err) => res.status(400).json("Error " + err));
});

/* get tasks related to share_id */
router.route("/:share_id").get((req, res) => {
  DailyTask.find({ share_id: req.params.share_id })
    .then((tasks) => {
      res.json(tasks);
    })
    .catch((err) => res.status(400).json("Error " + err));
});

/* update a task */
router.route("/update/:id").put((req, res) => {
  const task = req.body;

  DailyTask.findByIdAndUpdate(req.params.id, task)
    .then((task) => {
      res.json(task);
    })
    .catch((err) => res.status(400).json("Error " + err));
});

module.exports = router;
