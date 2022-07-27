import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { TbFaceId } from 'react-icons/tb';
import instance from '../shared/Request';

const Header = () => {
  const navigate = useNavigate();
  // TODO: 최초 1번 닉네임 받아와서 state 저장하기 or react-query
  const [nickname, setNickname] = useState('');

  useEffect(() => {
    const getNickname = async () => {
      const res = await instance.get('http://13.125.250.104/api/auth');
      console.log(res);
      setNickname(res.data.nickname);
    };
    getNickname();
  }, []);

  const handleLogout = async () => {
    const res = await instance.post('http://13.125.250.104/api/logout');
    console.log('로그아웃', res);
    setNickname('');
    // TODO: 성공 시 redux nickname state 비우기 '' -> Falsy
    localStorage.removeItem('TOKEN');
    alert('로그아웃되었습니다');
    navigate('/login');
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
        {!nickname ? (
          <>
            <UserInfo>{nickname}님 환영해요 :)</UserInfo>
            <Link to="/post">게시글작성</Link>
            <Link to="/mypage">내작성글</Link>
            <button onClick={handleLogout}>로그아웃</button>
          </>
        ) : (
          <>
            <Link to="/join">회원가입</Link>
            <Link to="/login">로그인</Link>
          </>
        )}
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
  a,
  button {
    padding: 5px 10px;
    border-radius: 5px;
    background: #222;
    color: #fff;
    font-size: 16px;
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
