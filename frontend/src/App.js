import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import Login from "./components/login";

import SignUp from "./components/sign-up";
import Main from "./components/main";
import { Component } from "react";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userid: "",
      login: true,
    };
  }

  login = (user) => {
    this.setState({ login: true, userid: user._id });
  };

  render() {
    return (
      <Router>
        <div>
          <Switch>
            <Route path="/" exact render={(props) => <Login {...props} login={this.login} />} />
            <Route
              path="/main*"
              render={(props) => {
                return <Main {...props} user={this.state} />;
              }}
            />
            <Route path="/signup" exact component={SignUp} />
            <Route path="*">
              <div className="ml-2 mt-2">Can't find the page</div>
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
