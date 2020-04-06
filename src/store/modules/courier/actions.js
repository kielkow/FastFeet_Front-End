export function updateCourierRequest(courier) {
  return {
    type: '@courier/UPDATE_COURIER_REQUEST',
    payload: { courier },
  };
}
