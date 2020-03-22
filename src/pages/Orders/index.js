/* eslint-disable array-callback-return */
/* eslint-disable prefer-const */
/* eslint-disable no-alert */
/* eslint-disable no-restricted-globals */
import React, { useState, useEffect } from 'react';
// import { useDispatch } from 'react-redux';
import { Input } from '@rocketseat/unform';
import { MdAdd, MdVisibility, MdEdit, MdDelete } from 'react-icons/md';
import { FaCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
// import Options from '../../components/Options';

// import { toast } from 'react-toastify';
// import history from '~/services/history';
import { Container, Content, Pagination, Previous, Next } from './styles';

import api from '~/services/api';

// import * as StudentActions from '../../store/modules/student/actions';

const useStyles = makeStyles(() => ({
  root: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#989898',
    padding: '0',
    width: '20px',
  },
}));

export default function Orders() {
  const [orders, setOrders] = useState([]);
  let [page, setPage] = useState(1);
  const [loadingNext, setLoadingNext] = useState(false);
  const [finalPage, setFinalPage] = useState(false);
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

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

  /*
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
  */

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

  function checkColorStatus(status) {
    if (status === 'withdrawn') return '#4d85ee';
    if (status === 'canceled') return '#de3b3b';
    return '#45a045';
  }

  function backroundColorStatus(status) {
    if (status === 'withdrawn') return '#c8d7f3';
    if (status === 'canceled') return '#f5bfbf';
    return '#c1ecc1';
  }

  function splitCourierName(name) {
    const splitName = name.split(' ');
    return `${splitName[0].charAt(0)}${splitName[1].charAt(0)}`;
  }

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
          <span>Recipient</span>
          <span>Courier</span>
          <span>City</span>
          <span>State</span>
          <span>Status</span>
          <span>Actions</span>
          <span />
        </header>
        <ul>
          {orders.map(order => (
            <li key={order.id}>
              <span>#{order.id}</span>
              <span>{order.recipient.name}</span>
              <span>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div
                    style={{
                      border: '0.5px solid #eee',
                      marginRight: '5px',
                      padding: '7px',
                      borderRadius: '50%',
                      fontSize: '16px',
                      backgroundColor: `${backroundColorStatus(order.status)}`,
                      color: `${checkColorStatus(order.status)}`,
                    }}
                  >
                    {splitCourierName(order.courier.name)}
                  </div>
                  {order.courier.name}
                </div>
              </span>
              <span>{order.recipient.city}</span>
              <span>{order.recipient.state}</span>
              <span>
                <div
                  style={{
                    maxWidth: '95px',
                    // border: '0.5px solid #000',
                    borderRadius: '10px',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    paddingTop: '3px',
                    paddingBottom: '3px',
                    paddingRight: '4px',
                    paddingLeft: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    backgroundColor: `${backroundColorStatus(order.status)}`,
                    color: `${checkColorStatus(order.status)}`,
                  }}
                >
                  <FaCircle
                    size={10}
                    style={{ marginRight: '2px' }}
                    color={checkColorStatus(order.status)}
                  />
                  {order.status.toUpperCase() || 'undefined'}
                </div>
              </span>
              <div style={{ marginRight: '50px', boxShadow: 'none' }}>
                {/*
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
                </button> */}
                <Button
                  aria-controls="simple-menu"
                  aria-haspopup="true"
                  onClick={handleClick}
                  className={classes.root}
                >
                  ...
                </Button>
                <Menu
                  id="simple-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleClose}>
                    <MdVisibility
                      color="#7d40e7"
                      size={18}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginRight: '10px',
                      }}
                    />
                    <span>See</span>
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <MdEdit
                      color="#7d40e7"
                      size={18}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginRight: '10px',
                      }}
                    />
                    <span>Edit</span>
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <MdDelete
                      color="#de3b3b"
                      size={18}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginRight: '10px',
                      }}
                    />
                    <span>Delete</span>
                  </MenuItem>
                </Menu>
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
        <span>{page}</span>
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
