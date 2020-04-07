import React from 'react';

import { Switch } from 'react-router-dom';
import Route from './Route';

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';

import Profile from '../pages/Profile';

import Orders from '../pages/Orders';
import RegisterOrder from '../pages/Orders/Register';

import Couriers from '../pages/Couriers';
import EditCourier from '../pages/Couriers/Edit';
import RegisterCourier from '../pages/Couriers/Register';

import Recipients from '../pages/Recipients';
import RegisterRecipient from '../pages/Recipients/Register';

import Problems from '../pages/Problems';

export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={SignIn} />
      <Route path="/register" component={SignUp} />

      <Route path="/profile" component={Profile} isPrivate />

      <Route path="/orders" component={Orders} isPrivate />
      <Route path="/registerorder" component={RegisterOrder} isPrivate />

      <Route path="/couriers" component={Couriers} isPrivate />
      <Route path="/registercourier" component={RegisterCourier} isPrivate />
      <Route path="/editcourier" component={EditCourier} isPrivate />

      <Route path="/recipients" component={Recipients} isPrivate />
      <Route
        path="/registerrecipient"
        component={RegisterRecipient}
        isPrivate
      />

      <Route path="/problems" component={Problems} isPrivate />
    </Switch>
  );
}
