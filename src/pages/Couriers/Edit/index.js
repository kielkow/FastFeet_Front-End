import React from 'react';
import { useSelector } from 'react-redux';

export default function EditCourier() {
  const courierEdit = useSelector(state => state.courier.courier);

  console.log('COURIER', courierEdit);

  return <div>Edit Courier</div>;
}
