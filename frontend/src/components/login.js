import React, { Component } from "react";
import { Link } from "react-router-dom";
import request from "./axios-request";
import "../css/all.css";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      error: "",
      login: false,
    };
  }

  onLogin = (e) => {
    e.preventDefault();
    const username = this.state.username;
    const password = this.state.password;

    request
      .get(`/users/signin/${username}/${password}`)
      .then((res) => {
        if ("error" in res.data) {
          this.setState({ error: res.data.error });
        } else {
          // console.log(res.data);
          this.props.login(res.data);
          this.props.history.push({
            pathname: "/main",
            search: `?u=${res.data._id}`,
          });
        }
      })
      .catch((err) => console.log(err));
  };

  onChangeUsername = (e) => {
    this.setState({ username: e.target.value });
  };

  onChangePassword = (e) => {
    this.setState({ password: e.target.value });
  };

  render() {
    return (
      <div className="form">
        <div className="form-center">
          <form onSubmit={this.onLogin}>
            <div className="form-title">PointShare Login </div>

            <label className="mt-15">username:</label>
            <input type="text" onChange={this.onChangeUsername} required></input>

            <label className="mt-10">password:</label>
            <input type="password" onChange={this.onChangePassword} required></input>

            <button type="submit" className="form-btn mt-15">
              Login
            </button>
            <div className="mt-10 form-error">{this.state.error}</div>

            <div className="mt-4">
              <Link to="/signup">create a new account</Link>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Login;
