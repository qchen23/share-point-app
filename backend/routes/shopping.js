const router = require("express").Router();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const shoppingSchema = new Schema({
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

  username: {
    type: String,
    require: true,
  },

  priority: {
    type: Number,
    require: true,
  },

  redeem: {
    type: Boolean,
    default: false,
  },

  date: {
    type: String,
    default: "",
  },

  url: {
    type: String,
    default: "",
  },

  confirm: {
    type: Boolean,
    default: false,
  },
  nickname: {
    type: String,
    require: true,
  },
});

const ShoppingItem = mongoose.model("Shopping", shoppingSchema);

/* add a new task */
router.route("/new_item").post((req, res) => {
  const info = req.body;

  const new_item = new ShoppingItem({
    name: info.name,
    share_id: info.share_id,
    reward: info.reward,
    username: info.username,
    priority: info.priority,
    nickname: info.nickname,
    url: info.url,
  });

  new_item
    .save()
    .then(() => res.json(new_item))
    .catch((err) => res.status(400).json("Error " + err));
});

/* get tasks related to share_id */
router.route("/:share_id").get((req, res) => {
  ShoppingItem.find({ share_id: req.params.share_id })
    .then((tasks) => {
      res.json(tasks);
    })
    .catch((err) => res.status(400).json("Error " + err));
});

/* update a task */
router.route("/update/:id").put((req, res) => {
  const item = req.body;

  ShoppingItem.findByIdAndUpdate(req.params.id, item)
    .then((item) => {
      res.json(item);
    })
    .catch((err) => res.status(400).json("Error " + err));
});

router.route("/delete/:id").delete((req, res) => {
  ShoppingItem.findByIdAndDelete(req.params.id)
    .then(() => res.json("Delete shopping item successully"))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
