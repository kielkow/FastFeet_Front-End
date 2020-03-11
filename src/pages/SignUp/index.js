import React from 'react';
import { Link } from 'react-router-dom';

import logo from '~/assets/logo.png';

// import { Container } from './styles';

export default function SignUp() {
  return (
    <>
      <img src={logo} alt="FastFeet" />

      <form>
        <span>NAME</span>
        <input placeholder="Your full name..." />

        <span>E-MAIL</span>
        <input type="email" placeholder="Your e-mail..." />

        <span>PASSWORD</span>
        <input type="password" placeholder="Your password..." />

        <button type="submit">Create account</button>
        <Link to="/">I already have an account</Link>
      </form>
    </>
  );
}
