import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { TbFaceId } from 'react-icons/tb';

import axios from 'axios';

const Header = () => {
  // TODO: 최초 1번 닉네임 받아와서 state 저장하기
  const [nickname, setNickname] = useState('');

  useEffect(() => {
    const getNickname = async () => {
      const res = await axios.get('http://13.125.250.104/api/auth');
      console.log(res);
      setNickname(res.data.nickname);
    };
    getNickname();
  }, []);

  const handleLogout = async () => {
    const res = await axios.post('http://13.125.250.104/api/logout');
    console.log('로그아웃', res);
    // TODO: 성공 시 redux nickname state 비우기 '' -> Falsy
  };
  return (
    <HeaderComponent>
      <Link to="/">
        <TbFaceId />
        <h1>
          <img src="/image/titlelogo.png" alt="헤이요 로고" />
        </h1>
      </Link>
      <Navbar>
        <UserInfo>{nickname}님 환영합니다</UserInfo>
        <Link to="/post">게시글작성</Link>
        <Link to="/mypage">마이페이지</Link>
        <button onClick={handleLogout}>로그아웃</button>
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
  z-index: 100;
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
  align-items: center;
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

const UserInfo = styled.span`
  font-weight: 500;
`;
