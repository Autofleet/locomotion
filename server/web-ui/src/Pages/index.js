import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import Home from './Home';
import Settings from './Settings';
import Login from './Login';
import ServiceHours from './ServiceHours';
import InviteCallback from './Invite';

export default () => (
  <Router>
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/settings">
        <Settings />
      </Route>
      <Route exact path="/service-hours">
        <ServiceHours />
      </Route>
      <Route exact path="/login">
        <Login />
      </Route>
      <Route exact path="/invite/:inviteId">
        <InviteCallback />
      </Route>
    </Switch>
  </Router>
);
