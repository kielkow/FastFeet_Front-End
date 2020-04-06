/* eslint-disable consistent-return */
import React, { useState, useEffect } from 'react';
import { Input, Select } from '@rocketseat/unform';
import { IoIosArrowBack, IoMdCheckmark } from 'react-icons/io';

import { parseISO } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';

import { Link } from 'react-router-dom';

import { toast } from 'react-toastify';
import history from '~/services/history';
import { Container, Content } from './styles';

import api from '~/services/api';

export default function RegisterOrder() {
  const [couriersOptions, setCouriersOptions] = useState([]);
  const [recipientsOptions, setRecipientsOptions] = useState([]);
  const [order, setOrder] = useState({
    recipient_id: null,
    courier_id: null,
    signature_id: null,
    product: '',
    start_date: zonedTimeToUtc(
      parseISO(new Date().toISOString()),
      'America/Sao_Paulo'
    ),
  });

  useEffect(() => {
    async function loadCouriers() {
      const response = await api.get('/couriers');

      const { data } = response;

      const couriers = data.map(element => {
        return { id: element.id, title: element.name };
      });

      setCouriersOptions(couriers);
    }
    async function loadRecipients() {
      const response = await api.get('/recipients');

      const { data } = response;

      const recipients = data.map(element => {
        return {
          id: element.id,
          title: element.name,
          signature_id: element.signature_id,
        };
      });

      setRecipientsOptions(recipients);
    }

    loadCouriers();
    loadRecipients();
  }, []);

  async function saveOrder() {
    const newOrder = {
      recipient_id: order.recipient_id,
      courier_id: order.courier_id,
      signature_id: order.signature_id,
      product: order.product,
      start_date: zonedTimeToUtc(
        parseISO(new Date().toISOString()),
        'America/Sao_Paulo'
      ),
    };
    setOrder(newOrder);

    const arrayOrder = Object.values(order);
    let isNull = false;
    arrayOrder.forEach(propOrder => {
      if (propOrder === null || propOrder === '') isNull = true;
    });

    if (isNull) return toast.error('Please check order´s information');

    try {
      await api.post('/orders', order);
      toast.success('Order created with success!');
      history.push('/orders');
    } catch (err) {
      toast.error('This order already exists!');
    }
  }

  function handleChangeName(e) {
    const newOrder = {
      recipient_id: order.recipient_id,
      courier_id: order.courier_id,
      signature_id: order.signature_id,
      product: e.target.value,
      start_date: order.start_date,
    };
    setOrder(newOrder);
  }

  function handleChangeRecipietSelected(e) {
    const recipientId = Number(e.target.value);

    const recipientCompare = recipientsOptions.filter(element => {
      return element.id === recipientId;
    });

    setOrder({
      recipient_id: recipientCompare[0].id,
      courier_id: order.courier_id,
      signature_id: recipientCompare[0].signature_id,
      product: order.product,
      start_date: order.start_date,
    });
  }

  function handleChangeCourierSelected(e) {
    const courierId = Number(e.target.value);

    const courierCompare = couriersOptions.filter(element => {
      return element.id === courierId;
    });

    setOrder({
      recipient_id: order.recipient_id,
      courier_id: courierCompare[0].id,
      signature_id: order.signature_id,
      product: order.product,
      start_date: order.start_date,
    });
  }

  return (
    <Container>
      <header>
        <strong>Register Order</strong>
        <div>
          <Link type="button" to="/orders">
            <IoIosArrowBack color="#fff" size={18} />
            <span>Back</span>
          </Link>
          <button type="button" onClick={saveOrder}>
            <IoMdCheckmark color="#fff" size={18} />
            <span>Save</span>
          </button>
        </div>
      </header>
      <Content type="submit">
        <div className="paternDiv">
          <div className="childDiv">
            <span>RECIPIENT</span>
            <Select
              name="recipient"
              options={recipientsOptions}
              placeholder="Search by recipient..."
              onChange={handleChangeRecipietSelected}
            />
          </div>
          <div className="childDiv">
            <span>COURIER</span>
            <Select
              name="courier"
              options={couriersOptions}
              placeholder="Search by courier..."
              onChange={handleChangeCourierSelected}
            />
          </div>
        </div>
        <div>
          <span>PRODUCT NAME</span>
          <Input
            name="product"
            placeholder="Product name..."
            onChange={handleChangeName}
          />
        </div>
      </Content>
    </Container>
  );
}
