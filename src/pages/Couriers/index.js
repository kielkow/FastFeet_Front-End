/* eslint-disable array-callback-return */
/* eslint-disable prefer-const */
/* eslint-disable no-alert */
/* eslint-disable no-restricted-globals */
import React, { useState, useEffect } from 'react';
// import { useDispatch } from 'react-redux';
import { Input } from '@rocketseat/unform';
import { MdAdd, MdEdit, MdDelete } from 'react-icons/md';
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

export default function Couriers() {
  const [couriers, setCouriers] = useState([]);
  let [page, setPage] = useState(1);
  const [loadingNext, setLoadingNext] = useState(false);
  const [finalPage, setFinalPage] = useState(false);
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

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

  /*
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

  async function deletecourier(e) {
    const confirm = window.confirm('Do you really wish delete this courier?');

    if (confirm) {
      try {
        await api.delete(`/couriers/${e}`);
        toast.info(
          'Not possible delete a courier, please check the info about it'
        );
        history.push('/couriers');
        reloadCouriers();
      } catch (err) {
        toast.error(
          'Not possible delete a courier, please check the info about it'
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

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
          <span>Actions</span>
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
                    <div
                      style={{
                        border: '0.5px solid #eee',
                        marginRight: '10px',
                        padding: '12px',
                        borderRadius: '50%',
                        fontSize: '16px',
                        backgroundColor: `${backroundColorStatus('withdrawn')}`,
                        color: `${checkColorStatus('withdrawn')}`,
                      }}
                    >
                      {splitCourierName(courier.name)}
                    </div>
                  </div>
                </span>
                <span>{courier.name}</span>
                <span>{courier.email}</span>
                <div style={{ marginRight: '50px', boxShadow: 'none' }}>
                  {/*
                <Link
                  id="edit"
                  to="/editcourier"
                  // onClick={() => editRequest(courier)}
                >
                  edit
                </Link>
                <button
                  id="delete"
                  type="button"
                  onClick={() => deletecourier(courier.id)}
                  value={courier.id}
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
