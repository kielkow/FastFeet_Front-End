/* eslint-disable no-param-reassign */
import produce from 'immer';

const INITIAL_STATE = {
  recipient: null,
};

export default function recipient(state = INITIAL_STATE, action) {
  return produce(state, draft => {
    switch (action.type) {
      case '@recipient/GET_RECIPIENT_DATA': {
        draft.recipient = action.payload.recipient;
        break;
      }
      case '@recipient/UPDATE_RECIPIENT_SUCCESS': {
        draft.recipient = action.payload.recipient;
        break;
      }
      default:
    }
  });
}
