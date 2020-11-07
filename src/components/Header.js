import React from 'react';
import logo from '../images/logo_white.svg';

export default function Header() {
  return (
    <>
      <header className='header'>
        <img src={logo} alt='Логотип' className='logo' />
      </header>
    </>
  );
}
