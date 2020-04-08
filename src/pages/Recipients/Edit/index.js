/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input, Form } from '@rocketseat/unform';
import { IoIosArrowBack, IoMdCheckmark } from 'react-icons/io';

import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { updateRecipientRequest } from '~/store/modules/recipient/actions';

import { Container } from './styles';

export default function EditRecipient() {
  const recipient = useSelector(state => state.recipient.recipient);

  const dispatch = useDispatch();

  async function handleSubmit(data) {
    const arrayRecipient = Object.values(data);
    let isNull = false;
    arrayRecipient.forEach(propRecipient => {
      if (propRecipient === null || propRecipient === '' || propRecipient === 0)
        isNull = true;
    });

    if (isNull) return toast.info('Please check recipient´s information');

    data = { id: recipient.id, ...data };

    dispatch(updateRecipientRequest(data));
  }

  return (
    <Container>
      <Form initialData={recipient} onSubmit={handleSubmit}>
        <header>
          <strong>Edit Recipient</strong>
          <div>
            <Link type="button" to="/recipients">
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
          <div id="child-content">
            <div>
              <span>Name</span>
              <Input name="name" placeholder="Recipient name..." />
            </div>
          </div>

          <div id="child-content-street">
            <div id="street">
              <span>Street</span>
              <Input name="street" placeholder="Recipient street..." />
            </div>
            <div id="number">
              <span>Number</span>
              <Input name="number" placeholder="Recipient number..." />
            </div>
            <div id="details">
              <span>Details</span>
              <Input name="details" placeholder="Recipient details..." />
            </div>
          </div>

          <div id="child-content">
            <div id="city">
              <span>City</span>
              <Input name="city" placeholder="Recipient city..." />
            </div>
            <div id="state">
              <span>State</span>
              <Input name="state" placeholder="Recipient state..." />
            </div>
            <div id="cep">
              <span>CEP</span>
              <Input name="cep" placeholder="Recipient CEP..." />
            </div>
          </div>
        </div>
      </Form>
    </Container>
  );
}
