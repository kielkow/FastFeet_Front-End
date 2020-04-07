export function getCourierData(courier) {
  return {
    type: '@courier/GET_COURIER_DATA',
    payload: { courier },
  };
}

export function updateCourierRequest(data) {
  return {
    type: '@courier/UPDATE_COURIER_REQUEST',
    payload: { data },
  };
}

export function updateCourierSuccess(courier) {
  return {
    type: '@courier/UPDATE_COURIER_SUCCESS',
    payload: { courier },
  };
}

export function updateCourierFailure() {
  return {
    type: '@courier/UPDATE_COURIER_REQUEST',
  };
}
