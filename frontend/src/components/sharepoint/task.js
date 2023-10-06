import "../../css/all.css";
import React, { Component } from "react";
import { dog, plus, cat, status, reward, task_name, task_detail, task_date } from "../../imgs";
import request from "../axios-request";
import Loading from "./loading";
import updateUser from "./updateUser";
import getDate from "./getDate";
import Collapse from "./collapse";

/* Show a speicic task */
const TaskPanel = ({ onSubmit, onChange, task_info, action, disabled = false }) => {
  return (
    <div className="task-form">
      <div className="task-form-center">
        <form id={action} onSubmit={onSubmit}>
          <img src={task_name} className="icon va-middle" alt="task_name" />
          <label className="va-middle">Task Name</label>
          <input type="text" id="name" value={task_info.name} onChange={onChange} required disabled={disabled}></input>

          <img src={task_detail} className="icon va-middle" alt="task_detail" />
          <label className="va-middle">Task Detail</label>
          <input type="text" id="detail" value={task_info.detail} onChange={onChange} required disabled={disabled}></input>

          <img src={reward} className="icon va-middle" alt="reward" />
          <label className="va-middle">Rewards</label>
          <input type="number" min="1" id="reward" value={task_info.reward} onChange={onChange} required disabled={disabled}></input>

          <img src={task_date} className="icon va-middle" alt="task_date" />
          <label className="va-middle">Date</label>
          <input type="text" value={task_info.date} disabled id="date"></input>

          {action !== "none" && (
            <button id={action} type="submit" className="form-btn mt-15 c-w" onClick={onSubmit}>
              {action}
            </button>
          )}
          {action === "Update" && (
            <button id="Delete" type="button" className="form-btn mt-15 c-w bg-green" onClick={onSubmit}>
              Delete
            </button>
          )}

          <button type="button" id="cancel" className="bg-red form-btn mt-15 c-w" onClick={onSubmit}>
            Cancel
          </button>

          <br />
          <br />
          <br />
        </form>
      </div>
    </div>
  );
};

/* show each task briefly in a card */
const TaskInfo = ({ img, task_info, onClick, type = "", onConfirmDeclineDoneAccept }) => {
  return (
    <div id={task_info.index} className={"pointer card ml-20 mr-20 mb-10"} onClick={onClick}>
      <img src={img} className="task-img" alt="cat_or_dog" />

      <div id="name" className="item va-middle fs-30">
        {task_info.name}
      </div>
      <hr />
      <div>
        <img src={reward} className="icon-small va-middle" alt="reward" />
        <span id="reward" className="item va-middle">
          {task_info.reward}
        </span>
      </div>
      <hr />
      <div>
        <img src={task_date} className="icon-small va-middle" alt="task_date" />
        <span id="date" className="item va-middle">
          {task_info.date}
        </span>
      </div>
      <hr />
      <div>
        <img src={status} className="icon-small va-middle" alt="status" />
        <span id="status" className="item va-middle">
          {task_info.status !== "" && (
            <span
              className={"va-middle " + (task_info.status.includes("Please resubmit it") || task_info.status.includes("notify me") ? "c-red fb" : "")}
            >
              {task_info.status}
            </span>
          )}

          {task_info.status.includes("notify me that it's done") && (
            <span>
              <button id="accept" type="button" className="ml-20 va-middle status-btn c-w" onClick={onConfirmDeclineDoneAccept}>
                Accept
              </button>
            </span>
          )}

          {task_info.status === "Working hard on it" && (
            <span>
              <button id="done" type="button" className="ml-20 va-middle status-btn c-w" onClick={onConfirmDeclineDoneAccept}>
                Done
              </button>
            </span>
          )}

          {/* confirm by partner */}
          {type === "confirm" && !task_info.decline && (
            <span>
              <button id="confirm" type="button" className="status-btn c-w" onClick={onConfirmDeclineDoneAccept}>
                Confirm
              </button>
              <button id="decline" type="button" className="ml-10 status-btn bg-red c-w" onClick={onConfirmDeclineDoneAccept}>
                Decline
              </button>
            </span>
          )}
        </span>
      </div>
    </div>
  );
};

const TaskTitle = ({ title, num_tasks }) => {
  return (
    <div id={title} className="pointer mt-10 ml-10 mb-10">
      <span className="fs-30 ml-10 va-middle">{title}</span>
      <div className="task-num">{num_tasks}</div>
    </div>
  );
};

const SearchBar = ({ search_info, onChangeSearchInfo, onSearch }) => {
  return (
    <div>
      <div className="search-block ml-20 mt-10">
        <div>Keyword</div>
        <input id="keyword" type="text" className="search-input search-text" value={search_info.keyword} onChange={onChangeSearchInfo} />
      </div>
      <div className="search-block ml-20 mt-10">
        <div>From date</div>
        <input id="from_date" type="date" className="search-input" value={search_info.from_date} onChange={onChangeSearchInfo} />
      </div>
      <div className="search-block ml-20 mt-10">
        <div>To date</div>
        <input id="to_date" type="date" className="search-input" value={search_info.to_date} onChange={onChangeSearchInfo} />
      </div>
      <button className="ml-20 search-btn mt-10 c-w" onClick={onSearch}>
        Search
      </button>
    </div>
  );
};

class Task extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      tasks: [],
      submitted: [],
      to_be_confirmed: [],
      finished: [],
      ongoing: [],

      show_tasks: true,

      action: "",

      task_info: {
        username: props.me.username,
        reward: 1,
        name: "",
        detail: "",
        date: new Date().toLocaleString(),
        share_id: this.props.me.share_id,
      },

      search_info: {
        from_date: getDate(-7 * 24 * 60 * 60 * 1000),
        to_date: getDate(),
        keyword: "",
      },
    };

    this.interval = null;
  }

  onAddTask = (e) => {
    e.preventDefault();
    let task_info = {
      username: this.props.me.username,
      reward: 1,
      name: "",
      detail: "",
      date: new Date().toLocaleString(),
      share_id: this.props.me.share_id,
    };

    this.setState({ task_info: task_info, show_tasks: false, action: "Create" });
  };

  getTaskType(task) {
    if (task.username === this.props.me.username) {
      if (task.decline === true) {
        task.status = `You task is declined - ${task.decline_reason}. Please resubmit it.`;
        return "submitted";
      }

      if (task.confirmed === false) task.status = `To be confirmed by ${this.props.partner.nickname}`;
      if (task.confirmed === true && task.finished === false) task.status = `${this.props.partner.nickname} is working on it`;
      if (task.confirmed === true && task.finished === true && task.accepted === false) {
        task.status = `${this.props.partner.nickname} notify me that it's done`;
      }
      if (task.confirmed === true && task.finished === true && task.accepted === true) {
        task.status = "The task is completed";
      }
      return "submitted";
    }

    if (task.decline) {
      task.status = `You have declined the task - ${task.decline_reason}`;
      return "to be confirmed";
    }

    if (task.confirmed === false && task.username === this.props.partner.username) return "to be confirmed";
    if (task.confirmed === true && task.finished === false) {
      task.status = "Working hard on it";
      return "ongoing";
    }
    if (task.confirmed === true && task.finished === true && task.accepted === false) {
      task.status = `To be accepted by ${this.props.partner.nickname}`;
      return "ongoing";
    }
    if (task.confirmed === true && task.finished === true && task.accepted === true) {
      task.status = "The task is completed";
      return "finished";
    }
  }

  componentWillUnmount() {
    if (this.interval !== null) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  getData() {
    request
      .get(`/tasks/${this.props.me.share_id}`)
      .then((res) => {
        let tasks = res.data;
        tasks.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        // for (let i = res.data.length - 1; i >= 0; i--) tasks.push(res.data[i]);
        this.refreshTaskType(tasks);
      })
      .catch((err) => console.log(err));
  }

  componentDidMount() {
    this.getData();
    this.setState({ loading: false });
    // this.interval = setInterval(() => {
    //   this.getData();
    // }, 5000);
  }

  refreshTaskType(tasks) {
    /* get all tasks - it has four categories 
      1. submmited - the task is submitted by yourself 
      2. to be confirmed - when you submit a task, it needs to be confirmed/accepted by the other party
      3. ongoing - the task you are working on 
      4. finished - the task you finished */
    let submitted = [];
    let to_be_confirmed = [];
    let ongoing = [];
    let finished = [];
    let search_info = this.state.search_info;
    let keyword = search_info.keyword.trim().toLowerCase();
    let from_time = new Date(`${search_info.from_date}T23:59:59`).getTime();
    let to_time = new Date(`${search_info.to_date}T23:59:59`).getTime();

    tasks.forEach((task, index) => {
      task.index = index;
      let type = this.getTaskType(task);
      let time = new Date(task.date).getTime();

      if (
        !(task.confirmed === true && task.finished === true && task.accepted === true) ||
        (time >= from_time &&
          time <= to_time &&
          (keyword === "" || task.name.toLowerCase().includes(keyword) || task.detail.toLowerCase().includes(keyword)))
      ) {
        if (type === "decline") {
          submitted.push(task);
        } else if (type === "submitted") {
          submitted.push(task);
          if (task.confirmed === true && task.finished === true && task.accepted === true && task.redeem === false) {
            task.redeem = true;
            let me = this.props.me;
            let partner = this.props.partner;

            tasks.reward = parseFloat(task.reward);
            me.reward -= task.reward;
            partner.reward += task.reward * 0.2;
            partner.acc_reward += task.reward * 0.2;

            updateUser(me);
            updateUser(partner);
            this.updateTask(tasks, index);
          }
        } else if (type === "to be confirmed") {
          to_be_confirmed.push(task);
        } else if (type === "ongoing") {
          ongoing.push(task);
        } else if (type === "finished") {
          finished.push(task);
        }
      }
    });

    this.setState({ tasks: tasks, submitted: submitted, to_be_confirmed: to_be_confirmed, ongoing: ongoing, finished: finished });

    if (to_be_confirmed.length === 0) {
      this.props.onUpdateTaskIcon(false);
    } else {
      this.props.onUpdateTaskIcon(true);
    }
  }

  updateTask(tasks, index) {
    const task = tasks[index];
    request
      .put(`/tasks/update/${task._id}`, task)
      .then((res) => {
        this.refreshTaskType(tasks);
      })
      .catch((err) => {
        console.log("Error when updating task: " + err);
      });
  }

  onConfirmDeclineDoneAcceptTask = (e) => {
    e.preventDefault();
    e.stopPropagation();

    let id = e.currentTarget.id;
    let task_index = e.currentTarget.parentNode.parentNode.parentNode.parentNode.id; // this is where it holds task index
    let tasks = this.state.tasks;

    if (id === "confirm") {
      tasks[task_index].confirmed = true;
      this.updateTask(tasks, task_index);
    } else if (id === "decline") {
      let message = window.prompt("Why do you decline?");

      while (message !== null && message.trim() === "") {
        message = window.prompt("Your message is empty. Why do you decline?");
      }
      if (message === null) return;
      tasks[task_index].decline = true;
      tasks[task_index].decline_reason = message;
      this.updateTask(tasks, task_index);
    } else if (id === "accept") {
      tasks[task_index].accepted = true;
      this.updateTask(tasks, task_index);
    } else if (id === "done") {
      tasks[task_index].finished = true;
      this.updateTask(tasks, task_index);
    }

    this.refreshTaskType(tasks);
  };

  onClickTask = (e) => {
    e.preventDefault();
    let id = e.currentTarget.id;
    let type = this.getTaskType(this.state.tasks[id]);
    let action = "";

    if (type === "submitted") {
      if (this.state.tasks[id].decline) action = "Resubmit";
      else if (this.state.tasks[id].confirmed) action = "none";
      else action = "Update";
    } else if (type === "to be confirmed") {
      if (this.state.tasks[id].decline) action = "none";
      else action = "Confirm";
    } else if (type === "finished") {
      action = "none";
    } else if (type === "ongoing") {
      action = "none";
    }

    // console.log(this.state.tasks[id]);

    this.setState({ task_info: this.state.tasks[id], show_tasks: false, action: action });
  };

  onClickTaskPanel = (e) => {
    e.preventDefault();

    if (e.target.id === "Create") {
      request
        .post("/tasks/new_task", this.state.task_info)
        .then((res) => {
          let tasks = this.state.tasks;
          tasks.unshift(res.data);
          this.refreshTaskType(tasks);
          this.setState({ show_tasks: true, action: "" });

          let partner = this.props.partner;
          if (partner.require_confirm === false) {
            partner.require_confirm = true;
            updateUser(partner);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (e.target.id === "Update" || e.target.id === "Resubmit") {
      let task_info = this.state.task_info;
      task_info.decline = false;
      task_info.decline_reason = "";
      task_info.status = "";

      this.state.tasks[this.state.task_info.index] = task_info;
      this.updateTask(this.state.tasks, this.state.task_info.index);

      let tasks = this.state.tasks;
      this.setState({ tasks: tasks, show_tasks: true, action: "" });
    } else if (e.target.id === "Delete") {
      request
        .delete(`/tasks/delete/${this.state.task_info._id}`)
        .then((res) => {
          let tasks = this.state.tasks;
          tasks.splice(this.state.task_info.index, 1);
          this.refreshTaskType(tasks);
          this.setState({ tasks: tasks, show_tasks: true, action: "" });
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (e.target.id === "Confirm") {
      let task_info = this.state.task_info;
      task_info.confirmed = true;
      this.updateTask(this.state.tasks, this.state.task_info.index);
      this.setState({ show_tasks: true, action: "" });
    } else {
      this.setState({ show_tasks: true, action: "" });
    }
  };

  onChangeTaskInput = (e) => {
    let info = this.state.task_info;
    info[e.target.id] = e.target.value;
    this.setState({ task_info: info });
  };

  onChangeSearchInfo = (e) => {
    let search_info = this.state.search_info;
    search_info[e.target.id] = e.target.value;
    this.setState({ search_info: search_info });
  };

  onSearch = () => {
    this.refreshTaskType(this.state.tasks);
  };

  render() {
    return (
      <section className="main_body pb-20">
        {this.state.loading ? (
          <Loading />
        ) : (
          <>
            {this.state.action !== "" && (
              <TaskPanel
                onSubmit={this.onClickTaskPanel}
                onChange={this.onChangeTaskInput}
                task_info={this.state.task_info}
                action={this.state.action}
                disabled={
                  !((this.getTaskType(this.state.task_info) === "submitted" && !this.state.task_info.confirmed) || this.state.action === "Create")
                }
              />
            )}

            {this.state.show_tasks && (
              <div>
                <label>
                  <img src={this.props.image} className="babe_img" alt="header_img" />
                  <input type="file" id={this.props.nav_index} accept="image/jpeg, image/png" className="d-n" onChange={this.props.onUploadImage} />
                </label>
                <SearchBar search_info={this.state.search_info} onChangeSearchInfo={this.onChangeSearchInfo} onSearch={this.onSearch} />
              </div>
            )}

            {this.state.show_tasks && (
              <Collapse title={<TaskTitle title={"To be confirmed by you"} num_tasks={this.state.to_be_confirmed.length} />}>
                {this.state.to_be_confirmed.map((task_info, index) => {
                  return (
                    <TaskInfo
                      img={index % 2 === 0 ? cat : dog}
                      task_info={task_info}
                      key={task_info._id}
                      onClick={this.onClickTask}
                      type="confirm"
                      onConfirmDeclineDoneAccept={this.onConfirmDeclineDoneAcceptTask}
                    />
                  );
                })}
              </Collapse>
            )}

            {this.state.show_tasks && (
              <Collapse title={<TaskTitle title={"Ongoing"} num_tasks={this.state.ongoing.length} />}>
                {this.state.ongoing.map((task_info, index) => {
                  return (
                    <TaskInfo
                      img={index % 2 === 0 ? cat : dog}
                      task_info={task_info}
                      key={task_info._id}
                      onClick={this.onClickTask}
                      onConfirmDeclineDoneAccept={this.onConfirmDeclineDoneAcceptTask}
                    />
                  );
                })}
              </Collapse>
            )}

            {this.state.show_tasks && (
              <Collapse title={<TaskTitle title={"Submitted"} num_tasks={this.state.submitted.length} />}>
                {this.state.submitted.map((task_info, index) => {
                  return (
                    <TaskInfo
                      img={index % 2 === 0 ? cat : dog}
                      task_info={task_info}
                      key={task_info._id}
                      onClick={this.onClickTask}
                      type="submitted"
                      onConfirmDeclineDoneAccept={this.onConfirmDeclineDoneAcceptTask}
                    />
                  );
                })}
              </Collapse>
            )}

            {this.state.show_tasks && (
              <Collapse title={<TaskTitle title={"Finished"} num_tasks={this.state.finished.length} />}>
                {this.state.finished.map((task_info, index) => {
                  return (
                    <TaskInfo
                      img={index % 2 === 0 ? cat : dog}
                      task_info={task_info}
                      key={task_info._id}
                      onClick={this.onClickTask}
                      onConfirmDeclineDoneAccept={this.onConfirmDeclineDoneAcceptTask}
                    />
                  );
                })}
              </Collapse>
            )}

            <div className="add-task" onClick={this.onAddTask}>
              <img src={plus} className="icon" alt="plus" />
              <div>Add Task</div>
            </div>
          </>
        )}
      </section>
    );
  }
}

export default Task;
