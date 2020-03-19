import React from 'react';
import { Link } from 'react-router-dom';

import logo from '~/assets/logo.png';

import { Container, Content, Profile } from './styles';

export default function Header() {
  return (
    <Container>
      <Content>
        <nav>
          <img src={logo} alt="FastFeet" />
          <Link to="/orders">ORDERS</Link>
          <Link to="/couriers">COURIERS</Link>
          <Link to="/recipients">RECIPIENTS</Link>
          <Link to="/problems">PROBLEMS</Link>
        </nav>

        <aside>
          <Profile>
            <div>
              <strong>Matheus Kielkowski</strong>
              <Link to="/profile">My Profile</Link>
            </div>
            <img
              src="https://api.adorable.io/avatars/50/abott@adorable.png"
              alt="Matheus Kielkowski"
            />
          </Profile>
        </aside>
      </Content>
    </Container>
  );
}
