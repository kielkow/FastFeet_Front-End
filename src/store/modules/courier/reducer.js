/* eslint-disable no-param-reassign */
import produce from 'immer';

const INITIAL_STATE = {
  courier: null,
};

export default function courier(state = INITIAL_STATE, action) {
  return produce(state, draft => {
    switch (action.type) {
      case '@courier/GET_COURIER_DATA': {
        draft.courier = action.payload.courier;
        break;
      }
      case '@courier/UPDATE_COURIER_SUCCESS': {
        draft.courier = action.payload.courier;
        break;
      }
      default:
    }
  });
}
