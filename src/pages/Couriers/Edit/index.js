/* eslint-disable consistent-return */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Input } from '@rocketseat/unform';
import { IoIosArrowBack, IoMdCheckmark } from 'react-icons/io';

import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import api from '~/services/api';
import history from '~/services/history';

import AvatarInput from './AvatarInput';

import { Container, Content } from './styles';

export default function EditCourier() {
  const courier = useSelector(state => state.courier.courier);

  const [courierEdit, setCourierEdit] = useState(courier);

  function handleChangeName(e) {
    setCourierEdit({
      id: courierEdit.id,
      name: e.target.value,
      avatar_id: courierEdit.avatar_id,
      email: courierEdit.email,
    });
  }

  function handleChangeEmail(e) {
    setCourierEdit({
      id: courierEdit.id,
      name: courierEdit.name,
      avatar_id: courierEdit.avatar_id,
      email: e.target.value,
    });
  }

  async function updateCourier() {
    const updatedCourier = {
      name: courierEdit.name,
      avatar_id: courierEdit.avatar_id,
      email: courierEdit.email,
    };
    const arrayCourier = Object.values(updatedCourier);
    let isNull = false;
    arrayCourier.forEach(propCourier => {
      if (propCourier === null || propCourier === '' || propCourier === 0)
        isNull = true;
    });

    if (isNull) return toast.error('Please check courier´s information');

    try {
      await api.put(`/couriers/${courierEdit.id}`, updatedCourier);
      toast.success('Courier updated with success!');
      history.push('/couriers');
    } catch (err) {
      toast.error('Not possible update this courier');
    }
  }

  return (
    <Container>
      <header>
        <strong>Edit Courier</strong>
        <div>
          <Link type="button" to="/couriers">
            <IoIosArrowBack color="#fff" size={18} />
            <span>Back</span>
          </Link>
          <button type="button" onClick={updateCourier}>
            <IoMdCheckmark color="#fff" size={18} />
            <span>Save</span>
          </button>
        </div>
      </header>
      <Content>
        <AvatarInput name="avatar_id" />

        <div>
          <span>Name</span>
          <Input
            name="name"
            placeholder="Courier name..."
            value={courierEdit.name}
            onChange={handleChangeName}
          />
        </div>
        <div>
          <span>E-mail</span>
          <Input
            name="email"
            type="email"
            placeholder="Courier e-mail..."
            value={courierEdit.email}
            onChange={handleChangeEmail}
          />
        </div>
      </Content>
    </Container>
  );
}
