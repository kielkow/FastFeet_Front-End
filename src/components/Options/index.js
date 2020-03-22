import React, { useState } from 'react';

import { MdVisibility, MdEdit, MdDelete } from 'react-icons/md';
import { Container, List, Item, Badge } from './styles';

export default function Options() {
  const [visible, setVisible] = useState(false);

  function handleToggleVisible() {
    setVisible(!visible);
  }

  return (
    <Container>
      <Badge onClick={handleToggleVisible}>...</Badge>
      <List visible={visible}>
        <Item>
          <MdVisibility color="#7d40e7" size={18} />
          <span>See</span>
        </Item>
        <Item>
          <MdEdit color="#7d40e7" size={18} />
          <span>Edit</span>
        </Item>
        <Item>
          <MdDelete color="#de3b3b" size={18} />
          <span>Delete</span>
        </Item>
      </List>
    </Container>
  );
}
