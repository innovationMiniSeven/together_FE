import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import styled from 'styled-components';

const Layout = () => {
  return (
    <Main>
      <Header />
      <Outlet />
    </Main>
  );
};

export default Layout;

const Main = styled.main`
  padding: 70px 0 40px;
`;
