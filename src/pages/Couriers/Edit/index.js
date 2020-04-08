/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input, Form } from '@rocketseat/unform';
import { IoIosArrowBack, IoMdCheckmark } from 'react-icons/io';

import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { updateCourierRequest } from '~/store/modules/courier/actions';

import AvatarInput from './AvatarInput';

import { Container } from './styles';

export default function EditCourier() {
  const dispatch = useDispatch();

  const courier = useSelector(state => state.courier.courier);

  function handleSubmit(data) {
    const arrayCourier = Object.values(data);
    let isNull = false;
    arrayCourier.forEach(propCourier => {
      if (
        propCourier === null ||
        propCourier === '' ||
        propCourier === 0 ||
        propCourier === undefined
      )
        isNull = true;
    });

    if (isNull) return toast.info('Please check courier´s information');

    data = { id: courier.id, ...data };

    dispatch(updateCourierRequest(data));
  }

  return (
    <Container>
      <Form initialData={courier} onSubmit={handleSubmit}>
        <header>
          <strong>Edit Courier</strong>
          <div>
            <Link type="button" to="/couriers">
              <IoIosArrowBack color="#fff" size={18} />
              <span>Back</span>
            </Link>
            <button type="submit">
              <IoMdCheckmark color="#fff" size={18} />
              <span>Save</span>
            </button>
          </div>
        </header>

        <div id="content">
          <AvatarInput name="avatar_id" />

          <div>
            <span>Name</span>
            <Input name="name" placeholder="Courier name..." />
          </div>
          <div>
            <span>E-mail</span>
            <Input name="email" type="email" placeholder="Courier e-mail..." />
          </div>
        </div>
      </Form>
    </Container>
  );
}
