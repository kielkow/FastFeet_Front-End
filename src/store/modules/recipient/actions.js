export function getRecipientData(recipient) {
  return {
    type: '@recipient/GET_RECIPIENT_DATA',
    payload: { recipient },
  };
}

export function updateRecipientRequest(data) {
  return {
    type: '@recipient/UPDATE_RECIPIENT_REQUEST',
    payload: { data },
  };
}

export function updateRecipientSuccess(recipient) {
  return {
    type: '@recipient/UPDATE_RECIPIENT_SUCCESS',
    payload: { recipient },
  };
}

export function updateRecipientFailure() {
  return {
    type: '@recipient/UPDATE_RECIPIENT_REQUEST',
  };
}
