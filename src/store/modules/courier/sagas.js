/* eslint-disable camelcase */
import { takeLatest, call, put, all } from 'redux-saga/effects';
import { toast } from 'react-toastify';

import api from '~/services/api';
import history from '~/services/history';

import { updateCourierSuccess, updateCourierFailure } from './actions';

export function* updateProfile({ payload }) {
  try {
    const { id, name, email, avatar_id } = payload.data;

    const courier = {
      name,
      email,
      avatar_id,
    };

    try {
      const response = yield call(api.put, `couriers/${id}`, courier);
      toast.success('Profile updated with success!');
      yield put(updateCourierSuccess(response.data));
      history.push('/couriers');
    } catch (error) {
      toast.error('Failure while update courier, please check your internet');
    }
  } catch (err) {
    toast.error('Not possible update this courier');
    yield put(updateCourierFailure());
  }
}

export default all([
  takeLatest('@courier/UPDATE_COURIER_REQUEST', updateProfile),
]);
