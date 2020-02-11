import React from 'react';
import Home from './Home';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

export default () => (
  <Router>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        {/*<Route path="/stats">*/}
        {/*  <Permission />*/}
        {/*</Route>*/}
        {/*<Route path="/webhooks">*/}
        {/*  <Webhook />*/}
        {/*</Route>*/}
      </Switch>
  </Router>
)
