const router = require("express").Router();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/* user schema */
const taskSchema = new Schema({
  username: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },

  detail: {
    type: String,
    require: true,
  },
  date: {
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
  decline: {
    type: Boolean,
    default: false,
  },
  finished: {
    type: Boolean,
    default: false,
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
  accepted: {
    type: Boolean,
    default: false,
  },
  redeem: {
    type: Boolean,
    default: false,
  },
  decline_reason: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    default: "",
  },
});

const Task = mongoose.model("Tasks", taskSchema);

/* add a new task */
router.route("/new_task").post((req, res) => {
  const info = req.body;

  const new_task = new Task({
    name: info.name,
    detail: info.detail,
    date: info.date,
    username: info.username,
    share_id: info.share_id,
    reward: info.reward,
  });

  new_task
    .save()
    .then(() => res.json(new_task))
    .catch((err) => res.status(400).json("Error " + err));
});

/* get tasks related to share_id */
router.route("/:share_id").get((req, res) => {
  Task.find({ share_id: req.params.share_id })
    .then((tasks) => {
      res.json(tasks);
    })
    .catch((err) => res.status(400).json("Error " + err));
});

/* update a task */

router.route("/update/:id").put((req, res) => {
  const task = req.body;

  Task.findByIdAndUpdate(req.params.id, task)
    .then((task) => {
      res.json(task);
    })
    .catch((err) => res.status(400).json("Error " + err));
});

/* delete a task */
router.route("/delete/:id").delete((req, res) => {
  Task.findByIdAndDelete(req.params.id)
    .then(() => res.json("Delete note successully"))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
