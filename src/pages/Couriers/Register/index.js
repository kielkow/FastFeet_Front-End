/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
import React from 'react';
import { Input, Form } from '@rocketseat/unform';
import { IoIosArrowBack, IoMdCheckmark } from 'react-icons/io';

import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

import AvatarInput from './AvatarInput';

import history from '~/services/history';
import api from '~/services/api';

import { Container } from './styles';

export default function RegisterCourier() {
  async function handleSubmit(data) {
    const arrayCourier = Object.values(data);
    let isNull = false;
    arrayCourier.forEach(propCourier => {
      if (propCourier === null || propCourier === '' || propCourier === 0)
        isNull = true;
    });

    if (isNull) return toast.info('Please check courier´s information');

    try {
      await api.post('/couriers', data);
      toast.success('Courier created with success!');
      history.push('/couriers');
    } catch (error) {
      toast.error('Not possible create this courier');
    }
  }

  return (
    <Container>
      <Form initialData={{}} onSubmit={handleSubmit}>
        <header>
          <strong>Register Courier</strong>
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
