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

function App() {
  return (
    <Router>
      <NavigationBar></NavigationBar>
      <Switch>
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
      <Footer></Footer>
    </Router>
  );
}

export default App;
