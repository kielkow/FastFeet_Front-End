import React from 'react';
import { Link } from 'react-router-dom';

import logo from '~/assets/logo.png';

// import { Container } from './styles';

export default function SignIn() {
  return (
    <>
      <img src={logo} alt="FastFeet" />

      <form>
        <span>E-MAIL</span>
        <input type="email" placeholder="Your e-mail..." />

        <span>PASSWORD</span>
        <input type="password" placeholder="Your password..." />

        <button type="submit">Enter</button>
        <Link to="/register">Create free account</Link>
      </form>
    </>
  );
}
