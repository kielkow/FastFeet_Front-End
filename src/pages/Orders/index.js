/* eslint-disable consistent-return */
/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* eslint-disable array-callback-return */
/* eslint-disable prefer-const */
/* eslint-disable no-alert */
/* eslint-disable no-restricted-globals */
import React, { useState, useEffect } from 'react';
import { Input } from '@rocketseat/unform';
import { MdAdd, MdVisibility, MdDoneAll, MdDelete } from 'react-icons/md';
import { FaCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import ModalDescription from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import 'antd/dist/antd.css';
import { Button, Menu, Dropdown, Modal } from 'antd';
import { ExclamationCircleOutlined, DownOutlined } from '@ant-design/icons';

import { parseISO, format } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';

import { toast } from 'react-toastify';
import { Container, Content, Pagination, Previous, Next } from './styles';

import api from '~/services/api';

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    width: '500px',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.background.paper,
    border: '0',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(3, 3, 3),
    borderRadius: '4px',
  },
}));

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [orderSelected, setOrderSelected] = useState({});
  let [page, setPage] = useState(1);
  const [loadingNext, setLoadingNext] = useState(false);
  const [finalPage, setFinalPage] = useState(false);
  const classes = useStyles();
  const [openModal, setOpenModal] = useState(false);

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

  const { confirm } = Modal;

  async function deleteOrder() {
    confirm({
      title: 'Do you want to delete this order?',
      icon: <ExclamationCircleOutlined />,
      content:
        'When clicked the OK button, the order will be deleted from current orders',
      async onOk() {
        try {
          await api.delete(`/orders/${orderSelected.id}`);
          setTimeout(Math.random() > 0.5, 1000);
          toast.info('Order canceled with success');
          reloadOrders();
        } catch (err) {
          toast.error('Not possible cancel this order');
        }
      },
      onCancel() {},
    });
  }

  async function updateOrder() {
    if (orderSelected.status !== 'withdrawn')
      return toast.info('Not possible finish this order');

    confirm({
      title: 'Do you want to finish this order?',
      icon: <ExclamationCircleOutlined />,
      content:
        'When clicked the OK button, the order will be finished from current orders',
      async onOk() {
        try {
          await api.put(`/orders/${orderSelected.id}`);
          setTimeout(Math.random() > 0.5, 1000);
          toast.success('Order finish with success!');
          reloadOrders();
        } catch (err) {
          toast.error('Not possible update this order');
        }
      },
      onCancel() {},
    });
  }

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
      const originalOrders = await api.get('/orders', {
        params: {
          page,
        },
      });
      setOrders(originalOrders.data);
      return;
    }
    const similarOrders = await api.get('/orders', {
      params: {
        product: e.target.value,
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

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const menu = (
    <Menu>
      <Menu.Item
        key="1"
        style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
        onClick={() => handleOpenModal()}
      >
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
      </Menu.Item>
      <Menu.Item
        key="2"
        style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
        onClick={() => updateOrder()}
      >
        <MdDoneAll
          color="#7d40e7"
          size={18}
          style={{
            display: 'flex',
            alignItems: 'center',
            marginRight: '10px',
          }}
        />
        <span>Done</span>
      </Menu.Item>
      <Menu.Item
        key="3"
        style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
        onClick={() => deleteOrder()}
      >
        <MdDelete
          color="#de3b3b"
          size={18}
          style={{
            display: 'flex',
            alignItems: 'center',
            marginRight: '10px',
          }}
        />
        <span>Cancel Order</span>
      </Menu.Item>
    </Menu>
  );

  return (
    <Container>
      <strong>Management Orders</strong>
      <header>
        <Input
          name="name"
          type="text"
          placeholder="&#xf002; Search by product..."
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
          <span />
        </header>
        <ul>
          {orders.length === 0 ? (
            <span style={{ color: '#444444' }}> Any order found...</span>
          ) : (
            orders.map(order => (
              <li key={order.id}>
                <span>#{order.id}</span>
                <span>{order.recipient.name}</span>
                <span>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {order.courier.avatar !== null ? (
                      <img
                        src={order.courier.avatar.url}
                        alt={order.courier.name}
                        style={{
                          height: '50px',
                          width: '50px',
                          borderRadius: '50%',
                          marginRight: '10px',
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          border: '0.5px solid #eee',
                          marginRight: '10px',
                          padding: '12px',
                          borderRadius: '50%',
                          fontSize: '16px',
                          backgroundColor: `${backroundColorStatus(
                            order.status
                          )}`,
                          color: `${checkColorStatus(order.status)}`,
                        }}
                      >
                        {splitCourierName(order.courier.name)}
                      </div>
                    )}
                    {order.courier.name}
                  </div>
                </span>
                <span>{order.recipient.city}</span>
                <span>{order.recipient.state}</span>
                <span>
                  <div
                    style={{
                      maxWidth: '100px',
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
                <div style={{ marginRight: '50px' }}>
                  <Dropdown overlay={menu}>
                    <Button
                      onClick={() => setOrderSelected(order)}
                      onMouseOver={() => setOrderSelected(order)}
                    >
                      Actions <DownOutlined />
                    </Button>
                  </Dropdown>
                </div>
              </li>
            ))
          )}
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

      <ModalDescription
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={openModal}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openModal}>
          <div className={classes.paper}>
            <div
              style={{
                borderBottom: '0.5px solid #796b6bee',
                paddingBottom: '15px',
              }}
            >
              <span style={{ fontWeight: 'bold' }}>Informations</span>
              <p
                style={{
                  marginTop: '10px',
                  color: '#444',
                  lineHeight: '20px',
                }}
              >
                {orderSelected.product}
              </p>
              <p
                style={{
                  marginTop: '10px',
                  color: '#444',
                  lineHeight: '20px',
                }}
              >
                {`${
                  orderSelected.recipient ? orderSelected.recipient.street : ''
                }, ${
                  orderSelected.recipient ? orderSelected.recipient.number : ''
                }`}
              </p>
              <p
                style={{
                  marginTop: '10px',
                  color: '#444',
                  lineHeight: '20px',
                }}
              >
                {`${
                  orderSelected.recipient ? orderSelected.recipient.city : ''
                } - ${
                  orderSelected.recipient ? orderSelected.recipient.state : ''
                }`}
              </p>
              <p
                style={{
                  marginTop: '10px',
                  color: '#444',
                  lineHeight: '20px',
                  marginBottom: '0px',
                }}
              >
                {`${
                  orderSelected.recipient ? orderSelected.recipient.cep : ''
                }`}
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                borderBottom: '0.5px solid #796b6bee',
                marginTop: '15px',
                flexDirection: 'column',
              }}
            >
              <span style={{ fontWeight: 'bold' }}>Dates</span>
              <span
                style={{
                  fontWeight: 'bold',
                  marginTop: '15px',
                  display: 'flex',
                  flexDirection: 'row',
                }}
              >
                Start Date:
                <p
                  style={{
                    fontWeight: 'normal',
                    color: '#444',
                    marginLeft: '5px',
                  }}
                >
                  {orderSelected.start_date
                    ? `${format(
                        zonedTimeToUtc(
                          parseISO(orderSelected.start_date),
                          'America/Sao_Paulo'
                        ),
                        'dd-MM-yyyy hh:mm'
                      ).replace(/-/g, '/')}h` || 'Uninformed'
                    : ''}
                </p>
              </span>
              <span
                style={{
                  fontWeight: 'bold',
                  display: 'flex',
                  flexDirection: 'row',
                }}
              >
                End Date:
                <p
                  style={{
                    fontWeight: 'normal',
                    color: '#444',
                    marginLeft: '5px',
                  }}
                >
                  {orderSelected.end_date
                    ? `${format(
                        zonedTimeToUtc(
                          parseISO(orderSelected.end_date),
                          'America/Sao_Paulo'
                        ),
                        'dd-MM-yyyy hh:mm'
                      ).replace(/-/g, '/')}h` || 'Uninformed'
                    : ''}
                </p>
              </span>
              <span
                style={{
                  fontWeight: 'bold',
                  marginTop: '15px',
                  display: 'flex',
                  flexDirection: 'row',
                  marginBottom: `${orderSelected.canceled_at ? '0px' : '15px'}`,
                }}
              >
                Canceled at:
                <p
                  style={{
                    fontWeight: 'normal',
                    color: '#444',
                    marginLeft: '5px',
                  }}
                >
                  {orderSelected.canceled_at
                    ? `${format(
                        zonedTimeToUtc(
                          parseISO(orderSelected.canceled_at),
                          'America/Sao_Paulo'
                        ),
                        'dd-MM-yyyy hh:mm'
                      ).replace(/-/g, '/')}h` || 'Uninformed'
                    : ''}
                </p>
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginTop: '15px',
              }}
            >
              <span style={{ fontWeight: 'bold' }}>Recipient´s Signature</span>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: '15px',
                }}
              >
                {orderSelected.signature_id ? (
                  <img
                    src={orderSelected.recipient.signature.url}
                    alt="signature"
                    style={{
                      maxWidth: '300px',
                      maxHeight: '120px',
                    }}
                  />
                ) : (
                  <p>Without signature</p>
                )}
              </div>
            </div>
          </div>
        </Fade>
      </ModalDescription>
    </Container>
  );
}
