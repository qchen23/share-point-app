const router = require("express").Router();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { createHash } = require("crypto");

/* user schema */
const userSchema = new Schema({
  username: {
    type: String,
    require: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    trim: true,
    require: true,
  },
  salt: {
    type: Number,
    require: true,
  },
  nickname: {
    type: String,
    require: true,
  },
  acc_reward: {
    type: Number,
    default: 100,
  },
  reward: {
    type: Number,
    default: 100,
  },
  balance: {
    type: Number,
    default: 100,
  },
  partner: {
    type: String,
    require: true,
  },
  share_id: {
    type: String,
    require: true,
  },
  images: {
    type: [String],
    default: ["", "", "", "", "", ""],
  },

  review_date: {
    type: String,
    default: "",
  },

  review_rewards: {
    type: Number,
    default: 0,
  },
  dob: {
    type: String,
    require: true,
  },
  ani: {
    type: String,
    require: true,
  },
  require_confirm: {
    type: Boolean,
    default: false,
  },
});
const User = mongoose.model("User", userSchema);

function create_new_user(username, password, nickname, partner, share_id, dob, ani) {
  /* store users infomation when signning up */
  const salt = Math.floor(Math.random() * 1000000);
  const hash = createHash("sha256");

  /* store the hash of salt + password for security reason */
  hash.update(salt + password);
  const hashed_password = hash.digest("hex");
  const new_user = new User({
    username: username,
    password: hashed_password,
    nickname: nickname,
    salt: salt,
    partner: partner,
    share_id: share_id,
    dob: dob,
    ani: ani,
  });
  return new_user;
}

router.route("/signup").post((req, res) => {
  const info = req.body;

  User.find({ username: { $in: [info.username1, info.username2] } })
    .then((users) => {
      if (users[0] != null) {
        return res.json({ error: `User ${users[0].username} already exists` });
      } else if (users[1] != null) {
        return res.json({ error: `User ${users[1].username} already exists` });
      } else {
        const share_id = `${info.username1}-${info.username2}`;
        const new_user1 = create_new_user(info.username1, info.password1, info.nickname1, info.username2, share_id, info.dob1, info.ani);
        const new_user2 = create_new_user(info.username2, info.password2, info.nickname2, info.username1, share_id, info.dob2, info.ani);

        User.insertMany([new_user1, new_user2])
          .then(() => {
            res.json([new_user1, new_user2]);
          })
          .catch((err) => res.status(400).json("Error " + err));
      }
    })
    .catch((err) => res.status(400).json("Error " + err));
});

router.route("/hash/:salt/:username/:password").get((req, res) => {
  const hash = createHash("sha256");
  hash.update(req.params.salt + req.params.password);
  const hash_value = hash.digest("hex");
  res.json(hash_value);
});

router.route("/signin/:username/:password").get((req, res) => {
  User.findOne({ username: req.params.username })
    .then((user) => {
      if (user == null) return res.json({ error: "username and password does not match" });

      const hash = createHash("sha256");
      hash.update(user.salt + req.params.password);
      const hash_value = hash.digest("hex");
      if (hash_value == user.password) {
        res.json(user);
      } else {
        res.json({ error: "username and password does not match" });
      }
    })
    .catch((err) => res.status(400).json("Error " + err));
});

router.route("/id/:id").get((req, res) => {
  User.findOne({ _id: req.params.id })
    .then((user) => {
      if (user == null) return res.json({ error: "id is not valid" });
      else res.json(user);
    })
    .catch((err) => res.status(400).json("Error " + err));
});

router.route("/update/:id").put((req, res) => {
  const user = req.body;
  User.findByIdAndUpdate(req.params.id, user)
    .then((user) => {
      res.json(user);
    })
    .catch((err) => res.status(400).json("Error " + err));
});

router.route("/name/:username").get((req, res) => {
  User.findOne({ username: req.params.username })
    .then((user) => {
      if (user == null) return res.json({ error: "id is not valid" });
      else res.json(user);
    })
    .catch((err) => res.status(400).json("Error " + err));
});

router.route("/").get((req, res) => {
  User.find()
    .then((user) => {
      res.json(user);
    })
    .catch((err) => res.status(400).json("Error " + err));
});

module.exports = router;
