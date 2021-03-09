import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import "./App.css";

import NavigationBar from "./widgets/navigation-bar/navigation-bar";
import DatabasesView from "./routes/databases/view/databases-view";
import DatabasesEdit from "./routes/databases/edit/databases-edit";
import TableView from "./routes/table/view/table-view";
import TableEdit from "./routes/table/edit/table-edit";
import Home from "./routes/home/home";
import Footer from "./widgets/footer/footer";
import Data from "./routes/data/data";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPath: window.location.pathname,
    }
  }

  changeLocation() {
    this.setState((state, props) => {
      window.scrollTo(0,0);
      return { currentPath: window.location.pathname };
    });
  }

  componentDidMount() {
    this.changeLocation();
  }

  render() {
    return (
      <Router>
        <NavigationBar currentPath={this.state.currentPath}></NavigationBar>
        <Switch>
          <Route path="/data">
            <Data/>
          </Route>
          <Route exact path="/table/view">
            <TableView />
          </Route>
          <Route exact path="/table/edit">
            <TableEdit />
          </Route>
          <Route exact path="/databases/view">
            <DatabasesView />
          </Route>
          <Route exact path="/databases/edit">
            <DatabasesEdit />
          </Route>
          <Route path="/home">
            <Home />
          </Route>
          <Route path="/table">
            <Redirect to="/table/view" />
          </Route>
          <Route path="/databases">
            <Redirect to="/databases/view" />
          </Route>
          <Route path="/">
              <Redirect to="/home" />
          </Route>
        </Switch>
        <Footer currentPath={this.state.currentPath} changeLocation={this.state.changeLocation}></Footer>
      </Router>
    );
  }
}

export default App;
