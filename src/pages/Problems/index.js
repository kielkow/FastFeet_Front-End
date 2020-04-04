/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-alert */
/* eslint-disable prefer-const */
import React, { useState, useEffect } from 'react';
import { Input } from '@rocketseat/unform';
import { MdAdd, MdDelete, MdVisibility } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import ModalDescription from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import 'antd/dist/antd.css';
import { Button, Menu, Dropdown, Modal } from 'antd';
import { ExclamationCircleOutlined, DownOutlined } from '@ant-design/icons';

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

export default function Problems() {
  const [problems, setProblems] = useState([]);
  const [problemSelected, setProblemSelected] = useState({});
  let [page, setPage] = useState(1);
  const [loadingNext, setLoadingNext] = useState(false);
  const [finalPage, setFinalPage] = useState(false);
  const classes = useStyles();
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    async function loadProblems() {
      const response = await api.get('/ordersproblems', {
        params: {
          page,
        },
      });

      const { data } = response;

      setProblems(data);

      const checkFinalPage = await api.get('/ordersproblems', {
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

    loadProblems();
  }, [page]);

  async function reloadProblems() {
    const response = await api.get('/ordersproblems', {
      params: {
        page,
      },
    });

    const { data } = response;

    setProblems(data);

    const checkFinalPage = await api.get('/ordersproblems', {
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

  async function next() {
    setLoadingNext(true);

    setPage((page += 1));

    const pageProblems = await api.get('/ordersproblems', {
      params: {
        page,
      },
    });

    const checkFinalPage = await api.get('/ordersproblems', {
      params: {
        page: page + 1,
      },
    });

    if (checkFinalPage.data.length === 0) {
      setProblems(pageProblems.data);
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

    const pageProblems = await api.get('/ordersproblems', {
      params: {
        page,
      },
    });

    setProblems(pageProblems.data);
    setLoadingNext(false);
  }

  async function searchproblem(e) {
    if (e.target.value === '' || e.target.value === null) {
      const originalProblems = await api.get('/ordersproblems');
      setProblems(originalProblems.data);
      return;
    }
    const similarProblems = await api.get('/ordersproblems', {
      params: {
        name: e.target.value,
      },
    });
    setProblems(similarProblems.data);
  }

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const { confirm } = Modal;

  const cancelOrder = () => {
    confirm({
      title: 'Do you want to delete this order?',
      icon: <ExclamationCircleOutlined />,
      content:
        'When clicked the OK button, the order will be deleted from current orders',
      async onOk() {
        try {
          await api.delete(`/orders/${problemSelected.order_id}`);
          setTimeout(Math.random() > 0.5, 1000);
          toast.info('Order canceled with success');
          reloadProblems();
        } catch (err) {
          toast.error('Not possible cancel this order');
        }
      },
      onCancel() {},
    });
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
        onClick={() => cancelOrder()}
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
      <strong>Management Problems</strong>
      <header>
        <Input
          name="name"
          type="text"
          placeholder="&#xf002; Search for problems..."
          style={{ fontFamily: 'Arial, FontAwesome' }}
          onChange={searchproblem}
        />
        <div>
          <Link to="/registerproblem">
            <MdAdd color="#fff" size={18} />
            <span>Register</span>
          </Link>
        </div>
      </header>
      <Content>
        <header>
          <span>Order</span>
          <span>Problem</span>
          <span />
        </header>
        <ul>
          {problems.length === 0 ? (
            <span style={{ color: '#444444' }}> Any problem found...</span>
          ) : (
            problems.map(problem => (
              <li key={problem.id}>
                <span>#{problem.order_id}</span>
                <span>{problem.description}</span>
                <div style={{ marginRight: '50px' }}>
                  <Dropdown overlay={menu}>
                    <Button
                      onClick={() => setProblemSelected(problem)}
                      onMouseOver={() => setProblemSelected(problem)}
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
                paddingBottom: '15px',
              }}
            >
              <span style={{ fontWeight: 'bold' }}>PROBLEM DESCRIPTION</span>
              <p
                style={{
                  marginTop: '10px',
                  color: '#444',
                  lineHeight: '20px',
                }}
              >
                {problemSelected.description}
              </p>
            </div>
          </div>
        </Fade>
      </ModalDescription>
    </Container>
  );
}
