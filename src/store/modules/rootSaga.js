import { all } from 'redux-saga/effects';

import auth from './auth/sagas';
import user from './user/sagas';
import courier from './courier/sagas';
import recipient from './recipient/sagas';

export default function* rootSaga() {
  return yield all([auth, user, courier, recipient]);
}
