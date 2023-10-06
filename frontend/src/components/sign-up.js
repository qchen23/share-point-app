import React, { Component } from "react";
import { Link } from "react-router-dom";
import bg from "../imgs/bg.jpg";
import request from "./axios-request";
import "../css/all.css";

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username1: "",
      nickname1: "",
      password1: "",
      dob1: "",
      username2: "",
      password2: "",
      nickname2: "",
      dob2: "",
      error: "",
      ani: "",
    };
  }

  onSignUp = (e) => {
    e.preventDefault();

    const info = this.state;

    request
      .post("/users/signup", info)
      .then((res) => {
        console.log(res.data);
        if ("error" in res.data) {
          this.setState({ error: res.data.error });
        } else {
          window.location = "/";
        }
      })
      .catch((err) => console.log(err));
  };

  onChange = (e) => {
    let key = e.target.id;
    let info = this.state;
    this.state[key] = e.target.value;
    this.setState(this.state);
  };

  render() {
    return (
      <div className="form-bg">
        <div className="form">
          <div className="form-center">
            <form onSubmit={this.onSignUp}>
              <div className="form-title">Create a new account</div>
              <div>
                <div className="form-inline">
                  <label className="mt-20">Your username:</label>
                  <input type="text" className="form-control" id="username1" onChange={this.onChange} value={this.state.username1} required></input>
                </div>
                <div className="form-inline ml-30">
                  <label className="mt-20">Partner's username:</label>
                  <input type="text" className="form-control" id="username2" value={this.state.username2} onChange={this.onChange} required></input>
                </div>
              </div>
              <div className="mt-20">
                <div className="form-inline">
                  <label>Your password:</label>
                  <input type="password" id="password1" onChange={this.onChange} value={this.state.password1} required></input>
                </div>
                <div className="form-inline ml-30">
                  <label>Partner's password:</label>
                  <input type="password" id="password2" value={this.state.password2} onChange={this.onChange} required></input>
                </div>
              </div>

              <div className="mt-20">
                <div className="form-inline">
                  <label className="mt-10">Your nickname:</label>
                  <input className="mt-10" id="nickname1" onChange={this.onChange} value={this.state.nickname1} required></input>
                </div>
                <div className="form-inline ml-30">
                  <label className="mt-10">Partner's nickname:</label>
                  <input className="mt-10" id="nickname2" onChange={this.onChange} value={this.state.nickname2} required></input>
                </div>
              </div>

              <div className="mt-20">
                <div className="form-inline">
                  <label className="mt-10">Your DOB:</label>
                  <input type="date" className="mt-10" id="dob1" onChange={this.onChange} value={this.state.dob1} required></input>
                </div>
                <div className="form-inline ml-30">
                  <label className="mt-10">Partner's DOB:</label>
                  <input type="date" className="mt-10" id="dob2" onChange={this.onChange} value={this.state.dob2} required></input>
                </div>
              </div>

              <div className="mt-20">
                <div className="form-inline">
                  <label className="mt-10">Aniversary:</label>
                  <input type="date" className="mt-10" id="ani" onChange={this.onChange} value={this.state.ani} required></input>
                </div>
              </div>

              <button className="form-btn mt-15">Create</button>
              <div className="mt-10 form-error">{this.state.error}</div>

              <div className="mt-10">
                <Link to="/">already have an account?</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default SignUp;
