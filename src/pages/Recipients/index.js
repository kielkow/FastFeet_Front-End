/* eslint-disable no-alert */
/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* eslint-disable prefer-const */
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Input } from '@rocketseat/unform';
import { MdAdd, MdEdit, MdDelete } from 'react-icons/md';
import { Link } from 'react-router-dom';
import 'antd/dist/antd.css';
import { Button, Menu, Dropdown, Modal } from 'antd';
import { ExclamationCircleOutlined, DownOutlined } from '@ant-design/icons';

import { toast } from 'react-toastify';
import history from '~/services/history';
import { Container, Content, Pagination, Previous, Next } from './styles';

import api from '~/services/api';

import * as RecipientActions from '../../store/modules/recipient/actions';

export default function Recipients() {
  const [recipients, setRecipients] = useState([]);
  const [recipientSelected, setRecipientSelected] = useState({});
  let [page, setPage] = useState(1);
  const [loadingNext, setLoadingNext] = useState(false);
  const [finalPage, setFinalPage] = useState(false);

  const dispatch = useDispatch();

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

  const { confirm } = Modal;

  async function deleteRecipient() {
    confirm({
      title: 'Do you want to delete this recipient?',
      icon: <ExclamationCircleOutlined />,
      content:
        'When clicked the OK button, the recipient will be deleted from current recipients',
      async onOk() {
        try {
          await api.delete(`/recipients/${recipientSelected.id}`);
          setTimeout(Math.random() > 0.5, 1000);
          toast.info('Recipient deleted with success');
          reloadRecipients();
        } catch (err) {
          toast.error('Not possible delete this recipient');
        }
      },
      onCancel() {},
    });
  }

  function editRecipient() {
    dispatch(RecipientActions.getRecipientData(recipientSelected));
    history.push('/editrecipient');
  }

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

  function formAddress(street, number, city, state) {
    let address = `${street}, `;
    address += `${number}, `;
    address += `${city} - `;
    address += `${state}`;
    return address;
  }

  const menu = (
    <Menu>
      <Menu.Item
        key="1"
        style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
        onClick={() => editRecipient()}
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
        onClick={() => deleteRecipient()}
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
        <span>Delete Recipient</span>
      </Menu.Item>
    </Menu>
  );

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
                <div style={{ marginRight: '50px' }}>
                  <Dropdown overlay={menu}>
                    <Button
                      onClick={() => setRecipientSelected(recipient)}
                      onMouseOver={() => setRecipientSelected(recipient)}
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
    </Container>
  );
}
