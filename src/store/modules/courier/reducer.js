/* eslint-disable no-param-reassign */
import produce from 'immer';

const INITIAL_STATE = {
  courier: null,
};

export default function courier(state = INITIAL_STATE, action) {
  return produce(state, draft => {
    switch (action.type) {
      case '@courier/UPDATE_COURIER_REQUEST': {
        draft.courier = action.payload.courier;
        break;
      }
      default:
    }
  });
}
