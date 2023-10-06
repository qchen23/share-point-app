import React, { Component } from "react";

class Collapse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hide: false,
      collapse_transition: false,
    };
  }

  onCollapse = (e) => {
    e.preventDefault();

    let hide = this.state.hide;
    let collapse_transition = this.state.collapse_transition;

    if (hide === false) {
      collapse_transition = !collapse_transition;
      this.setState({ collapse_transition: collapse_transition });
      setTimeout(() => {
        hide = !hide;
        this.setState({ hide: hide });
      }, 200);
    } else {
      hide = !hide;
      this.setState({ hide: hide });
      setTimeout(() => {
        collapse_transition = !collapse_transition;
        this.setState({ collapse_transition: collapse_transition });
      }, 1);
    }
  };
  render() {
    return (
      <div>
        <div onClick={this.onCollapse}>{this.props.title}</div>
        {!this.state.hide && <div className={"pointer transition " + (this.state.collapse_transition ? "tf-0" : "tf-1")}>{this.props.children}</div>}
      </div>
    );
  }
}

export default Collapse;
