import React, { Component } from "react";
import request from "./axios-request";
import "../css/all.css";
import { shopping, reward_bag, bg1, bg2, bg3, heart, home, task } from "../imgs";
import Home from "./sharepoint/home";
import Task from "./sharepoint/task";
import Loading from "./sharepoint/loading";
import Reward from "./sharepoint/reward";
import Resizer from "react-image-file-resizer";
import Shopping from "./sharepoint/shopping";
import updateUser from "./sharepoint/updateUser";

const Footer = ({ location, onChangePage, require_confirm }) => {
  return (
    <section className="footer">
      <div className="item" id="home" onClick={onChangePage}>
        <img src={home} className="icon" alt="home" />
        <div className={location === "home" ? "c-darkpink" : ""}>Home</div>
      </div>

      <div className="item" id="task" onClick={onChangePage}>
        <img src={task} className="icon" alt="task" />
        {require_confirm && <span className="footer-requre-confirm">?</span>}
        <div className={location === "task" ? "c-darkpink" : ""}>Task</div>
      </div>

      <div className="item" id="shopping" onClick={onChangePage}>
        <img src={shopping} className="icon" alt="shopping" />
        <div className={location === "shopping" ? "c-darkpink" : ""}>Shopping</div>
      </div>

      <div className="item" id="reward" onClick={onChangePage}>
        <img src={reward_bag} className="icon" alt="reward_bag" />
        <div className={location === "reward" ? "c-darkpink" : ""}>Earn Rewards</div>
      </div>
    </section>
  );
};

const Header = ({ name1, name2 }) => {
  return (
    <section className="header">
      <img src={heart} className="icon va-middle m-0-20" alt="heart" />
      <span className="va-middle">
        {name1}
        <span className="va-middle c-red fs-30"> &#8734; </span>
        {name2}
      </span>
      <img src={heart} className="icon va-middle m-0-20" alt="heart" />
    </section>
  );
};

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: true, me: { images: ["", "", ""] }, partner: {}, page_type: "home", require_confirm: false };
  }

  getData() {
    const user_id = new URLSearchParams(this.props.location.search).get("u");
    /* check is user id is valid */
    request
      .get(`/users/id/${user_id}`)
      .then((res) => {
        if ("error" in res.data) {
          this.props.history.push("/");
        } else {
          request.get(`/users/name/${res.data.partner}`).then((res2) => {
            this.setState({ loading: false, me: res.data, partner: res2.data, require_confirm: res.data.require_confirm });
          });
        }
      })
      .catch((err) => this.props.history.push("/"));
  }

  componentDidMount() {
    this.getData();
    this.setState({ page_type: "reward" });
  }

  onChangePage = (e) => {
    if (e.currentTarget.id === "home") {
      this.getData();
      this.setState({ loading: true });
    }
    this.setState({ page_type: e.currentTarget.id });
  };

  onUpdateTaskIcon = (b) => {
    let me = this.state.me;
    me.require_confirm = b;
    updateUser(me);
    this.setState({ require_confirm: b });
  };

  onUploadImage = (e) => {
    e.preventDefault();

    let files = e.target.files;
    let user = this.state.me;

    let file = files[0];
    let reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => {
      Resizer.imageFileResizer(
        file,
        1000,
        1000,
        file.name.includes(".png") ? "PNG" : "JPEG",
        100,
        0,
        (result) => {
          user.images[parseInt(e.target.id)] = result;
          request
            .put(`/users/update/${user._id}`, user)
            .then((res) => {})
            .catch((err) => {
              console.log("Error when updating user: " + err);
            });

          this.setState({ me: user });
        },
        "base64"
      );
    };
  };

  render() {
    return (
      <div>
        <Header name1={this.state.me.nickname} name2={this.state.partner.nickname} />
        {this.state.loading ? (
          <Loading />
        ) : (
          <>
            {this.state.page_type === "home" && (
              <Home
                me={this.state.me}
                partner={this.state.partner}
                nav_index={0}
                onUploadImage={this.onUploadImage}
                image={this.state.me.images[0] === "" ? bg1 : this.state.me.images[0]}
              />
            )}
            {this.state.page_type === "task" && (
              <Task
                onUpdateTaskIcon={this.onUpdateTaskIcon}
                me={this.state.me}
                partner={this.state.partner}
                nav_index={1}
                onUploadImage={this.onUploadImage}
                image={this.state.me.images[1] === "" ? bg2 : this.state.me.images[1]}
              />
            )}

            {this.state.page_type === "shopping" && (
              <Shopping
                me={this.state.me}
                partner={this.state.partner}
                nav_index={2}
                onUploadImage={this.onUploadImage}
                image={this.state.me.images[2] === "" ? bg3 : this.state.me.images[2]}
              />
            )}

            {this.state.page_type === "reward" && (
              <Reward
                me={this.state.me}
                partner={this.state.partner}
                nav_index={3}
                onUploadImage={this.onUploadImage}
                image={this.state.me.images[3] === "" ? bg3 : this.state.me.images[3]}
              />
            )}
          </>
        )}
        <Footer require_confirm={this.state.require_confirm} location={this.state.page_type} onChangePage={this.onChangePage} />
      </div>
    );
  }
}

export default Main;
