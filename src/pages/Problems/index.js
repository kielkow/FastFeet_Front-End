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

export default function Problems() {
  const [problems, setProblems] = useState([]);
  let [page, setPage] = useState(1);
  const [loadingNext, setLoadingNext] = useState(false);
  const [finalPage, setFinalPage] = useState(false);
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

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
                  {/*
                <Link
                  id="edit"
                  to="/editproblem"
                  // onClick={() => editRequest(problem)}
                >
                  edit
                </Link>
                <button
                  id="delete"
                  type="button"
                  onClick={() => deleteproblem(problem.id)}
                  value={problem.id}
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
    </Container>
  );
}
