import "../../css/all.css";
import { reward, heart_lock, heart } from "../../imgs";
import getDate from "./getDate";

import React, { Component } from "react";

const days_diff = (month, day, curyear = false) => {
  let now = new Date();
  let to = new Date(now.getFullYear(), month - 1, day, now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());

  if (!curyear && to.getTime() < now.getTime()) to = new Date(now.getFullYear() + 1, month - 1, day);
  let difference = to.getTime() - now.getTime();

  return Math.ceil(difference / (1000 * 3600 * 24));
};

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_me_detail: false,
      show_partner_detail: false,
    };
  }

  onShowHideDetail = (e) => {
    e.preventDefault();
    let state = this.state;

    state[e.target.id] = !state[e.target.id];
    this.setState({ state });
  };

  render() {
    let { me, partner, onUploadImage, nav_index, image } = this.props;
    let level = 0;
    let plevel = 0;
    let pbase_reward = 1024;
    let pacc_reward = partner.acc_reward;
    let base_reward = 1024;
    let acc_reward = me.acc_reward;

    let days_till_reunion = -1;

    if (me.reunion) {
      days_till_reunion = days_diff(parseInt(me.reunion.substring(5, 7)), parseInt(me.reunion.substring(8, 10)), true);
    }

    while (acc_reward >= base_reward) {
      level++;
      base_reward *= 2;
    }

    while (pacc_reward >= pbase_reward) {
      plevel++;
      pbase_reward *= 2;
    }
    return (
      <section className="main_body pb-20">
        <label>
          <img src={image} className="babe_img" alt="header_img" />
          <input type="file" id={nav_index} accept="image/jpeg, image/png" className="d-n" onChange={onUploadImage} />
        </label>
        <div className="welcome mt-10 fs-30">Welcome back, {me.nickname}</div>
        <div className="mt-10 ml-20 mr-20">
          <img src={reward} className="icon va-middle" alt="reward" />
          <span className="va-middle ml-10">Reward Points</span>
          <div className="card mt-10">
            <div className="item">Your reward points: {parseFloat(me.reward).toFixed(2)}</div>
            <hr />

            <div className="item">Your partner's reward points: {parseFloat(partner.reward).toFixed(2)}</div>
            <hr />
            <div className="item">
              Your level: <span className="c-red mr-10">{level}</span>
              {this.state.show_me_detail ? <span>accumulated reward = {acc_reward.toFixed(2)} </span> : ""}
              <div className="level-border">
                <div className="level-bar" style={{ width: (acc_reward / base_reward) * 100 + "%" }}></div>
              </div>
              <div className="level-reward">{base_reward}</div>
              <button id="show_me_detail" className="status-btn c-w" onClick={this.onShowHideDetail}>
                {this.state.show_me_detail ? "Hide" : "Show"} detail
              </button>
            </div>
            <hr />
            <div className="item">
              Your partner's level: <span className="c-red mr-10">{plevel}</span>
              {this.state.show_partner_detail ? <span>(accumulated reward = {pacc_reward.toFixed(2)}) </span> : ""}
              <div className="level-border">
                <div className="level-bar" style={{ width: (pacc_reward / pbase_reward) * 100 + "%" }}></div>
              </div>
              <div className="level-reward">{pbase_reward}</div>
              <button id="show_partner_detail" className="status-btn c-w" onClick={this.onShowHideDetail}>
                {this.state.show_partner_detail ? "Hide" : "Show"} detail
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 ml-20 mr-20">
          <img src={heart_lock} className="icon va-middle" alt="head_lock" />
          <span className="va-middle ml-10">Big Dates</span>
          <div className="card mt-10">
            <div className="item">
              Days till {me.nickname}'s birthday:{" "}
              <span className="c-red">{days_diff(parseInt(me.dob.substring(5, 7)), parseInt(me.dob.substring(8, 10)))}</span>
            </div>
            <hr />
            <div className="item">
              Days till {partner.nickname}'s birthday:{" "}
              <span className="c-red">{days_diff(parseInt(partner.dob.substring(5, 7)), parseInt(partner.dob.substring(8, 10)))}</span>
            </div>

            <hr />
            <div className="item">
              Days till aniversary: <span className="c-red">{days_diff(parseInt(me.ani.substring(5, 7)), parseInt(me.ani.substring(8, 10)))}</span>
            </div>

            <hr />
            <div className="item">
              Days till Valentine's Day: <span className="c-red">{days_diff(2, 14)}</span>
            </div>

            <hr />
            <div className="item">
              Days till Christmas: <span className="c-red">{days_diff(12, 25)}</span>
            </div>

            {days_till_reunion >= 0 && (
              <>
                <hr />
                <div className="item">
                  Days till reunion: <span className="c-red">{days_till_reunion}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    );
  }
}

export default Home;
