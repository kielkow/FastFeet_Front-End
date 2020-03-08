import React from 'react';

import { Switch, Route } from 'react-router-dom';

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';

import Profile from '../pages/Profile';
import Orders from '../pages/Orders';
import Couriers from '../pages/Couriers';
import Recipients from '../pages/Recipients';
import Problems from '../pages/Problems';

export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={SignIn} />
      <Route path="/register" component={SignUp} />

      <Route path="/dashboard" component={Profile} />
      <Route path="/orders" component={Orders} />
      <Route path="/couriers" component={Couriers} />
      <Route path="/recipients" component={Recipients} />
      <Route path="/problems" component={Problems} />
    </Switch>
  );
}
