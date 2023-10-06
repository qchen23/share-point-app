import React, { Component } from "react";
import "../../css/all.css";
import { category, uncheck, check, password, reward, task_name } from "../../imgs";
import request from "../axios-request";
import updateUser from "./updateUser";
import getDate from "./getDate";
import Collapse from "./collapse";

const TaskCard = ({ task, is_redeem, nickname, index, onRedeem }) => {
  return (
    <div className={"card ml-20 mr-20 mt-10"}>
      <div className="redeem-check">
        <img src={is_redeem ? check : uncheck} className="icon-small" alt="check" />
      </div>
      <img src={task_name} className="icon-small va-middle" alt="task_name" />
      <span id="name" className="item va-middle">
        {task.name}
      </span>
      <hr />
      <div className="p-r">
        <img src={reward} className="icon-small va-middle" alt="reward" />
        <span id="reward" className="item va-middle">
          {task.reward}
        </span>

        <button id={index} type="button" className="redeem-btn" onClick={onRedeem} disabled={task.redeem.includes(nickname)}>
          Help {nickname} redeem
        </button>
      </div>
    </div>
  );
};

class Reward extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      task_info: {
        category: "daily",
        password: "",
        name: "",
        reward: 1,
        share_id: this.props.me.share_id,
        date: getDate(),
      },

      total_points: 0,
      earned_points: 0,
      message: "",

      review: {
        review_rewards: this.props.partner.review_rewards,
        review_confirmed: 0,
        error: "",
      },
    };

    this.interval = null;
  }

  onChange = (e) => {
    e.preventDefault();

    if (e.target.id.includes("review")) {
      let review = this.state.review;
      review[e.target.id] = e.target.value;
      this.setState({ review: review });
    } else {
      let info = this.state.task_info;
      // console.log(e.target.id, e.target.value);
      info[e.target.id] = e.target.value;
      this.setState({ task_info: info });
    }
  };

  onAdd = (e) => {
    e.preventDefault();

    let info = this.state.task_info;
    let password = info.password;

    request
      .get(`/users/hash/${this.props.partner.salt}/${this.props.partner.username}/${password}`)
      .then((res) => {
        if (res.data === this.props.partner.password) {
          request
            .post("/daily_tasks/new_task", info)
            .then((res) => {
              let tasks = this.state.tasks;
              tasks.push(res.data);
              this.setState({ tasks: tasks, message: "Task is successfully added" });
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          this.setState({ message: "Password is wrong" });
        }
      })
      .catch((err) => console.log(err));
  };
  updateTask(task) {
    request
      .put(`/daily_tasks/update/${task._id}`, task)
      .then((res) => {})
      .catch((err) => {
        console.log("Error when updating task: " + err);
      });
  }

  getData() {
    let total_points = 0;
    let earned_points = 0;
    request
      .get(`/daily_tasks/${this.props.me.share_id}`)
      .then((res) => {
        // if (this.interval === null) return;
        let tasks = res.data;
        let date = getDate();
        tasks.forEach((task) => {
          if (task.date !== date) {
            task.redeem = [];
            task.date = date;
            this.updateTask(task);
          }
          total_points += task.reward;
          if (task.redeem.includes(this.props.me.nickname)) earned_points += task.reward;
        });

        this.setState({ total_points: total_points, earned_points: earned_points, tasks: tasks });
      })
      .catch((err) => console.log(err));
  }

  componentDidMount() {
    this.getData();
    // this.interval = setInterval(() => {
    //   this.getData();
    // }, 5000);
  }

  componentWillUnmount() {
    if (this.interval !== null) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  onRedeem = (e) => {
    let user = this.props.partner;
    let tasks = this.state.tasks;
    let t = tasks[e.target.id];

    t.redeem.push(this.props.partner.nickname);
    this.updateTask(t);

    user.reward += t.reward;
    user.acc_reward += t.reward;

    updateUser(user);

    this.setState({ tasks: tasks });
  };

  onReview = (e) => {
    e.preventDefault();
    let user = this.props.partner;
    let review = this.state.review;

    if (parseFloat(review.review_rewards) !== parseFloat(review.review_confirmed)) {
      review.error = "Rewards don't match";
      this.setState({ review: review });
    } else {
      user.review_date = getDate();
      user.acc_reward += parseFloat(review.review_rewards);
      user.reward += parseFloat(review.review_rewards);
      user.review_rewards = parseFloat(review.review_rewards);
      review.error = "";
      updateUser(user);
      this.setState({ review: review });
    }
  };

  render() {
    let me = this.props.me;
    let info = this.state.task_info;
    let review = this.state.review;
    let date = getDate();
    let is_review = date === this.props.partner.review_date;
    let is_review_by_partner = date === this.props.me.review_date;

    return (
      <section className="main_body pb-20">
        <div>
          <label>
            <img src={this.props.image} className="babe_img" alt="header_img" />
            <input type="file" id={this.props.nav_index} accept="image/jpeg, image/png" className="d-n" onChange={this.props.onUploadImage} />
          </label>
        </div>
        <div className="welcome mt-10 fs-30">Welcome back, {me.nickname}</div>
        <div className="fs-30 ml-10">
          Your have earned <span className="c-red">{this.state.earned_points} </span>
          {is_review_by_partner ? <span className="c-red">+{this.props.me.review_rewards} </span> : ""}
          rewards today
        </div>

        <Collapse title={<div className="fs-30 mt-10 ml-10 c-blue pointer">Daily tasks</div>}>
          {this.state.tasks.map((task, index) => {
            let is_redeem = task.redeem.includes(this.props.me.nickname);
            if (task.category === null || task.category !== "daily") return null;
            return (
              <TaskCard
                key={task._id}
                is_redeem={is_redeem}
                task={task}
                index={index}
                nickname={this.props.partner.nickname}
                onRedeem={this.onRedeem}
              />
            );
          })}
        </Collapse>

        <Collapse title={<div className="fs-30 mt-10 ml-10 c-blue pointer">Weekly tasks</div>}>
          {this.state.tasks.map((task, index) => {
            let is_redeem = task.redeem.includes(this.props.me.nickname);
            if (task.category !== "weekly") return null;
            return (
              <TaskCard
                key={task._id}
                is_redeem={is_redeem}
                task={task}
                index={index}
                nickname={this.props.partner.nickname}
                onRedeem={this.onRedeem}
              />
            );
          })}
        </Collapse>

        <Collapse title={<div className="fs-30 ml-10 mt-20 pointer c-blue">Give {this.props.partner.nickname} a performance review today</div>}>
          <div className="reward-task-form">
            <form onSubmit={this.onReview}>
              <img src={reward} className="icon va-middle" alt="reward" />
              <label className="va-middle">Rewards</label>
              <input type="number" min="-100" max="100" id="review_rewards" value={review.review_rewards} onChange={this.onChange} required></input>

              <img src={reward} className="icon va-middle" alt="reward" />
              <label className="va-middle">Conform the rewards</label>
              <input
                type="number"
                min="-100"
                max="100"
                id="review_confirmed"
                value={review.review_confirmed}
                onChange={this.onChange}
                required
              ></input>
              {is_review ? (
                <div className="c-red">
                  You have given {this.props.partner.nickname} {this.props.partner.review_rewards} rewards today
                </div>
              ) : (
                <button type="submit" className="form-btn mt-10 c-w">
                  Submit
                </button>
              )}

              {review.error !== "" && <div className="c-red mt-10">{review.error}</div>}
            </form>
          </div>
        </Collapse>

        <Collapse
          title={<div className="fs-30 ml-10 mt-20 pointer">Don't see one? You can add more with {this.props.partner.nickname}'s password</div>}
        >
          <div className="reward-task-form">
            <form onSubmit={this.onAdd}>
              <img src={task_name} className="icon va-middle" alt="task_name" />
              <label className="va-middle">Task Name</label>
              <input type="text" id="name" value={info.name} onChange={this.onChange} required></input>

              <img src={reward} className="icon va-middle" alt="reward" />
              <label className="va-middle">Rewards</label>
              <input type="number" min="1" id="reward" value={info.reward} onChange={this.onChange} required></input>

              <img src={category} className="icon va-middle" alt="category" />
              <label className="va-middle">Category</label>
              <select name="category" id="category" value={info.category} onChange={this.onChange}>
                <option value="daily">daily</option>
                <option value="weekly">weekly</option>
              </select>

              <img src={password} className="icon va-middle" alt="password" />
              <label className="va-middle">Your partner {this.props.partner.nickname}'s password</label>
              <input autoComplete="on" type="password" id="password" value={info.password} onChange={this.onChange} required></input>

              <button type="submit" className="form-btn mt-10 c-w">
                Add
              </button>
              <div className="mt-10 form-error">{this.state.message}</div>
            </form>
          </div>
        </Collapse>
      </section>
    );
  }
}

export default Reward;
