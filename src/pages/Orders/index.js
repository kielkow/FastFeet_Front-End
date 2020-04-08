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
                paddingBottom: '15px',
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
                <img
                  src="data:image/png;base64,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"
                  alt="signature"
                  style={{
                    maxWidth: '300px',
                    maxHeight: '120px',
                  }}
                />
              </div>
            </div>
          </div>
        </Fade>
      </ModalDescription>
    </Container>
  );
}
