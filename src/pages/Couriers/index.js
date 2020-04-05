/* eslint-disable no-alert */
/* eslint-disable prefer-const */
import React, { useState, useEffect } from 'react';
// import { useDispatch } from 'react-redux';
import { Input } from '@rocketseat/unform';
import { MdAdd, MdEdit, MdDelete } from 'react-icons/md';
import { Link } from 'react-router-dom';
import 'antd/dist/antd.css';
import { Button, Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';

import { toast } from 'react-toastify';
// import history from '~/services/history';
import { Container, Content, Pagination, Previous, Next } from './styles';

import api from '~/services/api';

// import * as StudentActions from '../../store/modules/student/actions';

export default function Couriers() {
  const [couriers, setCouriers] = useState([]);
  const [courierSelected, setCourierSelected] = useState({});
  let [page, setPage] = useState(1);
  const [loadingNext, setLoadingNext] = useState(false);
  const [finalPage, setFinalPage] = useState(false);

  // const dispatch = useDispatch();

  useEffect(() => {
    async function loadCouriers() {
      const response = await api.get('/couriers', {
        params: {
          page,
        },
      });

      const { data } = response;

      setCouriers(data);

      const checkFinalPage = await api.get('/couriers', {
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

    loadCouriers();
  }, [page]);

  async function reloadCouriers() {
    const response = await api.get('/couriers', {
      params: {
        page,
      },
    });

    const { data } = response;

    setCouriers(data);

    const checkFinalPage = await api.get('/couriers', {
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

  async function deleteCourier() {
    const confirm = window.confirm('Do you really wish delete this courier?');

    if (confirm) {
      try {
        await api.delete(`/couriers/${courierSelected.id}`);
        toast.info(
          'Not possible delete a courier, please check the info about it'
        );
        reloadCouriers();
      } catch (err) {
        toast.error(
          'Not possible delete a courier, please check the info about it'
        );
      }
    }
  }

  const menu = (
    <Menu>
      <Menu.Item
        key="1"
        style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
      >
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
      </Menu.Item>
      <Menu.Item
        key="2"
        style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
        onClick={() => deleteCourier()}
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
        <span>Delete Courier</span>
      </Menu.Item>
    </Menu>
  );

  /*
  function editRequest(student) {
    dispatch(StudentActions.updateStudentRequest(student));
  }
  */

  async function next() {
    setLoadingNext(true);

    setPage((page += 1));

    const pageCouriers = await api.get('/couriers', {
      params: {
        page,
      },
    });

    const checkFinalPage = await api.get('/couriers', {
      params: {
        page: page + 1,
      },
    });

    if (checkFinalPage.data.length === 0) {
      setCouriers(pageCouriers.data);
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

    const pageCouriers = await api.get('/couriers', {
      params: {
        page,
      },
    });

    setCouriers(pageCouriers.data);
    setLoadingNext(false);
  }

  async function searchcourier(e) {
    if (e.target.value === '' || e.target.value === null) {
      const originalCouriers = await api.get('/couriers');
      setCouriers(originalCouriers.data);
      return;
    }
    const similarCouriers = await api.get('/couriers', {
      params: {
        name: e.target.value,
      },
    });
    setCouriers(similarCouriers.data);
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

  return (
    <Container>
      <strong>Management Couriers</strong>
      <header>
        <Input
          name="name"
          type="text"
          placeholder="&#xf002; Search for couriers..."
          style={{ fontFamily: 'Arial, FontAwesome' }}
          onChange={searchcourier}
        />
        <div>
          <Link to="/registercourier">
            <MdAdd color="#fff" size={18} />
            <span>Register</span>
          </Link>
        </div>
      </header>
      <Content>
        <header>
          <span>ID</span>
          <span>Photo</span>
          <span>Name</span>
          <span>E-mail</span>
          <span />
        </header>
        <ul>
          {couriers.length === 0 ? (
            <span style={{ color: '#444444' }}> Any courier found...</span>
          ) : (
            couriers.map(courier => (
              <li key={courier.id}>
                <span>#{courier.id}</span>
                <span>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {courier.avatar !== null ? (
                      <img
                        src={courier.avatar.url}
                        alt={courier.name}
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
                            'withdrawn'
                          )}`,
                          color: `${checkColorStatus('withdrawn')}`,
                        }}
                      >
                        {splitCourierName(courier.name)}
                      </div>
                    )}
                  </div>
                </span>
                <span>{courier.name}</span>
                <span>{courier.email}</span>
                <div style={{ marginRight: '50px' }}>
                  <Dropdown overlay={menu}>
                    <Button onClick={() => setCourierSelected(courier)}>
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
    </Container>
  );
}
