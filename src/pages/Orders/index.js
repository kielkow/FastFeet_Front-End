import React from 'react';

// import { Container } from './styles';

import api from '~/services/api';

export default function Orders() {
  api.get('orders');
  return <div>Orders</div>;
}
