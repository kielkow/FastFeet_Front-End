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

export default function Recipients() {
  const [recipients, setRecipients] = useState([]);
  let [page, setPage] = useState(1);
  const [loadingNext, setLoadingNext] = useState(false);
  const [finalPage, setFinalPage] = useState(false);
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  // const dispatch = useDispatch();

  useEffect(() => {
    async function loadRecipients() {
      const response = await api.get('/recipients', {
        params: {
          page,
        },
      });

      const { data } = response;

      setRecipients(data);

      const checkFinalPage = await api.get('/recipients', {
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

    loadRecipients();
  }, [page]);

  /*
  async function reloadRecipients() {
    const response = await api.get('/recipients', {
      params: {
        page,
      },
    });

    const { data } = response;

    setRecipients(data);

    const checkFinalPage = await api.get('/recipients', {
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

  async function deleterecipient(e) {
    const confirm = window.confirm('Do you really wish delete this recipient?');

    if (confirm) {
      try {
        await api.delete(`/recipients/${e}`);
        toast.info(
          'Not possible delete a recipient, please check the info about it'
        );
        history.push('/recipients');
        reloadRecipients();
      } catch (err) {
        toast.error(
          'Not possible delete a recipient, please check the info about it'
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

    const pageRecipients = await api.get('/recipients', {
      params: {
        page,
      },
    });

    const checkFinalPage = await api.get('/recipients', {
      params: {
        page: page + 1,
      },
    });

    if (checkFinalPage.data.length === 0) {
      setRecipients(pageRecipients.data);
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

    const pageRecipients = await api.get('/recipients', {
      params: {
        page,
      },
    });

    setRecipients(pageRecipients.data);
    setLoadingNext(false);
  }

  async function searchrecipient(e) {
    if (e.target.value === '' || e.target.value === null) {
      const originalRecipients = await api.get('/recipients');
      setRecipients(originalRecipients.data);
      return;
    }
    const similarRecipients = await api.get('/recipients', {
      params: {
        name: e.target.value,
      },
    });
    setRecipients(similarRecipients.data);
  }

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function formAddress(street, number, city, state) {
    let address = `${street}, `;
    address += `${number}, `;
    address += `${city} - `;
    address += `${state}`;
    return address;
  }

  return (
    <Container>
      <strong>Management Recipients</strong>
      <header>
        <Input
          name="name"
          type="text"
          placeholder="&#xf002; Search for recipients..."
          style={{ fontFamily: 'Arial, FontAwesome' }}
          onChange={searchrecipient}
        />
        <div>
          <Link to="/registerrecipient">
            <MdAdd color="#fff" size={18} />
            <span>Register</span>
          </Link>
        </div>
      </header>
      <Content>
        <header>
          <span>ID</span>
          <span>Name</span>
          <span>Address</span>
          <span>Actions</span>
          <span />
        </header>
        <ul>
          {recipients.length === 0 ? (
            <span style={{ color: '#444444' }}> Any recipient found...</span>
          ) : (
            recipients.map(recipient => (
              <li key={recipient.id}>
                <span>#{recipient.id}</span>
                <span>{recipient.name}</span>
                <span>
                  {formAddress(
                    recipient.street,
                    recipient.number,
                    recipient.city,
                    recipient.state
                  )}
                </span>
                <div style={{ marginRight: '50px', boxShadow: 'none' }}>
                  {/*
                <Link
                  id="edit"
                  to="/editrecipient"
                  // onClick={() => editRequest(recipient)}
                >
                  edit
                </Link>
                <button
                  id="delete"
                  type="button"
                  onClick={() => deleterecipient(recipient.id)}
                  value={recipient.id}
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
