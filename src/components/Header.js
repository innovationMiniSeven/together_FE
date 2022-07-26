import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { TbFaceId } from 'react-icons/tb';

const Header = () => {
  return (
    <HeaderComponent>
      <Link to="/">
        <TbFaceId />
        <h1>
          <img src="/image/titlelogo.png" alt="헤이요 로고" />
        </h1>
      </Link>
      <Navbar>
        <Link to="/post">게시글작성</Link>
        <Link to="/mypage">마이페이지</Link>
        <Link to="/login">로그인</Link>
      </Navbar>
    </HeaderComponent>
  );
};

export default Header;

const HeaderComponent = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
  padding: 0 25px;
  background: #f1f1f1;
  a {
    display: flex;
    align-items: center;
    svg {
      font-size: 40px;
    }
    h1 {
      padding-top: 15px;
      font-size: 2.2em;
      color: #222;
      img {
        height: 28px;
      }
    }
  }
`;

const Navbar = styled.nav`
  display: flex;
  gap: 15px;
  a {
    padding: 5px 10px;
    border-radius: 5px;
    background: #222;
    color: #fff;
    &:last-child {
      background: #f2b90c;
      color: #222;
      font-weight: 700;
    }
  }
`;
