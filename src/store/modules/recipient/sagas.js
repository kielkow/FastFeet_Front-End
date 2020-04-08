/* eslint-disable camelcase */
import { takeLatest, call, put, all } from 'redux-saga/effects';
import { toast } from 'react-toastify';

import api from '~/services/api';
import history from '~/services/history';

import { updateRecipientSuccess, updateRecipientFailure } from './actions';

export function* updateRecipient({ payload }) {
  try {
    const {
      id,
      name,
      signature_id,
      street,
      number,
      details,
      state,
      city,
      cep,
    } = payload.data;

    const recipient = {
      name,
      signature_id,
      street,
      number,
      details,
      state,
      city,
      cep,
    };

    try {
      const response = yield call(api.put, `recipients/${id}`, recipient);
      toast.success('Recipient updated with success!');
      yield put(updateRecipientSuccess(response.data));
      history.push('/recipients');
    } catch (error) {
      toast.error('Failure while update recipient, please check your internet');
    }
  } catch (err) {
    toast.error('Not possible update this recipient');
    yield put(updateRecipientFailure());
  }
}

export default all([
  takeLatest('@recipient/UPDATE_RECIPIENT_REQUEST', updateRecipient),
]);
