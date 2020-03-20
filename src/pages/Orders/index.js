/* eslint-disable array-callback-return */
/* eslint-disable prefer-const */
/* eslint-disable no-alert */
/* eslint-disable no-restricted-globals */
import React, { useState, useEffect } from 'react';
// import { useDispatch } from 'react-redux';
import { Input } from '@rocketseat/unform';
import { MdAdd } from 'react-icons/md';

import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import history from '~/services/history';
import { Container, Content, Pagination, Previous, Next } from './styles';

import api from '~/services/api';

// import * as StudentActions from '../../store/modules/student/actions';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  let [page, setPage] = useState(1);
  const [loadingNext, setLoadingNext] = useState(false);
  const [finalPage, setFinalPage] = useState(false);

  // const dispatch = useDispatch();

  useEffect(() => {
    async function loadOrders() {
      const response = await api.get('/orders', {
        params: {
          page,
        },
      });

      const { data } = response;

      setOrders(data);

      const checkFinalPage = await api.get('/orders', {
        params: {
          page: page + 1,
        },
      });

      if (checkFinalPage.data.length === 0) {
        setLoadingNext(false);
        setFinalPage(true);
      } else {
        setLoadingNext(false);
        setFinalPage(false);
      }
    }

    loadOrders();
  }, [page]);

  async function reloadOrders() {
    const response = await api.get('/orders', {
      params: {
        page,
      },
    });

    const { data } = response;

    setOrders(data);

    const checkFinalPage = await api.get('/orders', {
      params: {
        page: page + 1,
      },
    });

    if (checkFinalPage.data.length === 0) {
      setLoadingNext(false);
      setFinalPage(true);
    } else {
      setLoadingNext(false);
      setFinalPage(false);
    }
  }

  async function deleteOrder(e) {
    const confirm = window.confirm('Do you really wish delete this order?');

    if (confirm) {
      try {
        await api.delete(`/orders/${e}`);
        toast.info(
          'Not possible delete a order, please check the info about it'
        );
        history.push('/orders');
        reloadOrders();
      } catch (err) {
        toast.error(
          'Not possible delete a order, please check the info about it'
        );
      }
    }
  }

  /*
  function editRequest(student) {
    dispatch(StudentActions.updateStudentRequest(student));
  }
  */

  async function next() {
    setLoadingNext(true);

    setPage((page += 1));

    const pageOrders = await api.get('/orders', {
      params: {
        page,
      },
    });

    const checkFinalPage = await api.get('/orders', {
      params: {
        page: page + 1,
      },
    });

    if (checkFinalPage.data.length === 0) {
      setOrders(pageOrders.data);
      setLoadingNext(false);
      setFinalPage(true);
    } else {
      setLoadingNext(false);
      setFinalPage(false);
    }
  }

  async function previous() {
    setLoadingNext(true);
    setFinalPage(false);

    if (page !== 1) {
      setPage((page -= 1));
    }

    const pageOrders = await api.get('/orders', {
      params: {
        page,
      },
    });

    setOrders(pageOrders.data);
    setLoadingNext(false);
  }

  async function searchOrder(e) {
    if (e.target.value === '' || e.target.value === null) {
      const originalOrders = await api.get('/orders');
      setOrders(originalOrders.data);
      return;
    }
    const similarOrders = await api.get('/orders', {
      params: {
        name: e.target.value,
      },
    });
    setOrders(similarOrders.data);
  }

  return (
    <Container>
      <strong>Management Orders</strong>
      <header>
        <Input
          name="name"
          type="text"
          placeholder="&#xf002; Search for orders..."
          style={{ fontFamily: 'Arial, FontAwesome' }}
          onChange={searchOrder}
        />
        <div>
          <Link to="/registerorder">
            <MdAdd color="#fff" size={18} />
            <span>Register</span>
          </Link>
        </div>
      </header>
      <Content>
        <header>
          <span>ID</span>
          <span>RECIPIENT</span>
          <span>COURIER</span>
          <span>CITY</span>
          <span>STATE</span>
          <span>STATUS</span>
          <span>ACTIONS</span>
          <span />
        </header>
        <ul>
          {orders.map(order => (
            <li key={order.id}>
              <span>{order.id}</span>
              <span>{order.recipient}</span>
              <span>{order.courier}</span>
              <span>{order.city}</span>
              <span>{order.state}</span>
              <span>{order.status}</span>
              <span>{order.actions}</span>
              <div>
                <Link
                  id="edit"
                  to="/editorder"
                  // onClick={() => editRequest(order)}
                >
                  edit
                </Link>
                <button
                  id="delete"
                  type="button"
                  onClick={() => deleteOrder(order.id)}
                  value={order.id}
                >
                  delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </Content>
      <Pagination>
        <Previous
          type="button"
          onClick={() => previous()}
          page={page}
          loadingNext={loadingNext}
        >
          Previous
        </Previous>
        <Next
          type="button"
          onClick={() => next()}
          loadingNext={loadingNext}
          finalPage={finalPage}
        >
          Next
        </Next>
      </Pagination>
    </Container>
  );
}
