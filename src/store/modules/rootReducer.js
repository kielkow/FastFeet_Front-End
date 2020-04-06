import { combineReducers } from 'redux';

import auth from './auth/reducer';
import user from './user/reducer';
import courier from './courier/reducer';

export default combineReducers({
  auth,
  user,
  courier,
});
