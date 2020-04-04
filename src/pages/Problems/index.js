/* eslint-disable array-callback-return */
/* eslint-disable prefer-const */
/* eslint-disable no-alert */
/* eslint-disable no-restricted-globals */
import React, { useState, useEffect } from 'react';
// import { useDispatch } from 'react-redux';
import { Input } from '@rocketseat/unform';
import { MdAdd, MdDelete, MdVisibility } from 'react-icons/md';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
// import Options from '../../components/Options';

// import { toast } from 'react-toastify';
// import history from '~/services/history';
import { Container, Content, Pagination, Previous, Next } from './styles';

import api from '~/services/api';

// import * as StudentActions from '../../store/modules/student/actions';

const useStyles = makeStyles(theme => ({
  root: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#989898',
    padding: '0',
    width: '20px',
  },
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
  let [page, setPage] = useState(1);
  const [loadingNext, setLoadingNext] = useState(false);
  const [finalPage, setFinalPage] = useState(false);
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openModal, setOpenModal] = useState(false);

  // const dispatch = useDispatch();

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

  /*
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

  async function deleteproblem(e) {
    const confirm = window.confirm('Do you really wish delete this problem?');

    if (confirm) {
      try {
        await api.delete(`/ordersproblems/${e}`);
        toast.info(
          'Not possible delete a problem, please check the info about it'
        );
        history.push('/ordersproblems');
        reloadProblems();
      } catch (err) {
        toast.error(
          'Not possible delete a problem, please check the info about it'
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

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

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
          <span>Actions</span>
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
                <div style={{ marginRight: '50px', boxShadow: 'none' }}>
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
                    <MenuItem onClick={handleOpenModal}>
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
                      <MdDelete
                        color="#de3b3b"
                        size={18}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          marginRight: '10px',
                        }}
                      />
                      <span>Cancel order</span>
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

      <Modal
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
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industrs standard dummy text
                ever since the 1500s, when an unknown printer took a galley of
                type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum
              </p>
            </div>
          </div>
        </Fade>
      </Modal>
    </Container>
  );
}
