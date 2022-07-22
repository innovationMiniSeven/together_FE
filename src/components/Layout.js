import React from 'react';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <main>
      <header>헤더</header>
      <Outlet />
    </main>
  );
};

export default Layout;
