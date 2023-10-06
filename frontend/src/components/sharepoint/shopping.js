import React, { Component } from "react";
import "../../css/all.css";
import { url, shopping_bag, reward, task_date } from "../../imgs";
import request from "../axios-request";
import updateUser from "./updateUser";
import Collapse from "./collapse";

const ShoppingCard = ({ item, onClick, index, confirm_button = false }) => {
  return (
    <div className="card ml-20 mr-20 mt-10" style={{ cursor: "default" }}>
      <img src={shopping_bag} className="icon-small va-middle" alt="task_name" />
      <span id="name" className="item va-middle">
        {item.name}
      </span>
      <hr />
      <div>
        <img src={url} className="icon-small va-middle" alt="reward" />
        <span id="url" className="item va-middle">
          <a rel="noreferrer" href={item.url} target="_blank">
            {item.url}
          </a>
        </span>
      </div>
      <hr />

      <div>
        <img src={reward} className="icon-small va-middle" alt="reward" />
        <span id="reward" className="item va-middle">
          {item.reward}
        </span>

        {confirm_button && !item.confirm && (
          <span id={index} className="p-r ml-20">
            <button id="confirm" type="button" className="status-btn c-w ml-20" onClick={onClick}>
              Confirm
            </button>
          </span>
        )}

        {!confirm_button && !item.redeem && (
          <span id={index} className="p-r ml-20">
            {!item.confirm && (
              <button id="delete" type="button" className="status-btn c-w" onClick={onClick}>
                Delete
              </button>
            )}
            <button id="pinned" type="button" className="ml-20 status-btn c-w bg-green" onClick={onClick}>
              Pinned
            </button>
            {item.confirm && (
              <button id="redeem" type="button" className="ml-20 status-btn c-w bg-red" onClick={onClick}>
                Redeem?
              </button>
            )}
          </span>
        )}
      </div>

      {item.redeem && (
        <>
          <hr />
          <div>
            <img src={task_date} className="icon-small va-middle" alt="reward" />
            <span id="date" className="item va-middle">
              {item.date}, requested by {item.nickname}
            </span>
          </div>
        </>
      )}
    </div>
  );
};
class Shopping extends Component {
  constructor(props) {
    super(props);
    this.state = {
      carts: [],
      history: [],
      item_info: {
        priority: 1,
        name: "",
        url: "",
        reward: 1,
        share_id: this.props.me.share_id,
        username: this.props.me.username,
        nickname: this.props.me.nickname,
      },
    };
    this.interval = null;
    this.max_priority = 2;
  }

  onChange = (e) => {
    e.preventDefault();
    let info = this.state.item_info;
    info[e.target.id] = e.target.value;
    this.setState({ item_info: info });
  };

  onAdd = (e) => {
    e.preventDefault();
    let item_info = this.state.item_info;
    request
      .post("/shopping/new_item", item_info)
      .then((res) => {
        let carts = this.state.carts;
        carts.push(res.data);
        carts.sort((a, b) => {
          return b.priority - a.priority;
        });
        this.max_priority = carts[0].priority;
        this.setState({ carts: carts, message: "Item is successfully added" });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getData() {
    request
      .get(`/shopping/${this.props.me.share_id}`)
      .then((res) => {
        let carts = [];
        let history = [];

        res.data.forEach((item) => {
          if (item.redeem === false) carts.push(item);
          else history.push(item);
        });

        carts.sort((a, b) => {
          return b.priority - a.priority;
        });

        history.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

        if (carts.length > 0) this.max_priority = carts[0].priority;
        this.setState({ history: history, carts: carts });
      })
      .catch((err) => console.log(err));
  }

  componentDidMount() {
    this.getData();
    // this.interval = setInterval(() => {
    //   this.getData();
    // }, 2000);
  }

  componentWillUnmount() {
    if (this.interval !== null) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  updateItem(item) {
    request
      .put(`/shopping/update/${item._id}`, item)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.log("Error when updating user: " + err);
      });
  }

  onClickCart = (e) => {
    e.preventDefault();
    let id = e.target.id;
    let index = e.target.parentNode.id;
    let item = this.state.carts[index];

    if (id === "delete") {
      request
        .delete(`/shopping/delete/${item._id}`, item)
        .then((res) => {
          let carts = this.state.carts;
          carts.splice(index, 1);
          this.setState({ carts: this.state.carts });
        })
        .catch((err) => {
          console.log("Error when deleting user: " + err);
        });
    } else if (id === "redeem") {
      item.redeem = true;
      item.date = new Date().toLocaleString();
      this.updateItem(item);
      let user = this.props.me;
      user.reward -= parseFloat(item.reward);
      updateUser(user);

      let carts = this.state.carts;
      carts.splice(index, 1);
      this.setState({ carts: this.state.carts });
    } else if (id === "pinned") {
      item.priority = this.max_priority + 1;
      this.max_priority++;
      this.state.carts.sort((a, b) => {
        return b.priority - a.priority;
      });
      this.setState({ carts: this.state.carts });
      this.updateItem(item);
    } else if (id === "confirm") {
      item.confirm = true;
      this.updateItem(item);
      this.setState({ carts: this.state.carts });
    }
  };

  render() {
    let me = this.props.me;
    let partner = this.props.partner;
    let info = this.state.item_info;

    return (
      <section className="main_body pb-20">
        <div>
          <label>
            <img src={this.props.image} className="babe_img" alt="header_img" />
            <input type="file" id={this.props.nav_index} accept="image/jpeg, image/png" className="d-n" onChange={this.props.onUploadImage} />
          </label>
        </div>
        <div className="welcome mt-10 fs-30">Welcome back, {me.nickname}</div>

        <Collapse title={<div className="pointer fs-30 mt-10 ml-10 c-blue">Your carts</div>}>
          {this.state.carts.map((item, index) => {
            if (item.redeem === false && item.username === this.props.me.username) {
              return <ShoppingCard index={index} key={item._id} item={item} onClick={this.onClickCart} />;
            } else {
              return null;
            }
          })}
        </Collapse>

        <Collapse title={<div className="pointer fs-30 mt-10 ml-10 c-blue">{partner.nickname}'s carts</div>}>
          {this.state.carts.map((item, index) => {
            if (item.redeem === false && item.username === this.props.partner.username) {
              return <ShoppingCard confirm_button={true} index={index} key={item._id} item={item} onClick={this.onClickCart} />;
            } else {
              return null;
            }
          })}
        </Collapse>

        <Collapse title={<div className="pointer fs-30 mt-10 ml-10 c-blue">History</div>}>
          {this.state.history.map((item, index) => {
            return <ShoppingCard index={index} key={item._id} item={item} onClick={this.onClickCart} />;
          })}
        </Collapse>

        <Collapse title={<div className="pointer fs-30 ml-10 mt-20">Add a new item</div>}>
          <div className="reward-task-form">
            <form onSubmit={this.onAdd}>
              <img src={shopping_bag} className="icon va-middle" alt="task_name" />
              <label className="va-middle">Item Name</label>
              <input type="text" id="name" value={info.name} onChange={this.onChange} required></input>

              <img src={url} className="icon va-middle" alt="url" />
              <label className="va-middle">Link to buy it</label>
              <input type="text" id="url" value={info.url} onChange={this.onChange}></input>

              <img src={reward} className="icon va-middle" alt="reward" />
              <label className="va-middle">Rewards</label>
              <input type="number" min="1" id="reward" value={info.reward} onChange={this.onChange} required></input>

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

export default Shopping;
