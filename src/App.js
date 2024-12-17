import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PersonList from "./components/PersonList.js";
import PersonForm from "./components/PersonForm.js";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path='/' exact component={PersonList} />
        <Route path='/add' exact component={PersonForm} />
        <Route path='/edit/:jmbg' exact component={PersonForm} />
      </Switch>
    </Router>
  );
};

export default App;
