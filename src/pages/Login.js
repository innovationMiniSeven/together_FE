import React, { useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toggleLoggedIn, setNickname } from '../redux/modules/userSlice';

import Form from '../components/Form';
import Button from '../components/Button';
import { AiOutlineArrowRight } from 'react-icons/ai';
import instance from '../shared/Request';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm({ mode: 'onChange' });

  useEffect(() => {
    const hasToken = localStorage.getItem('TOKEN');
    if (hasToken) {
      alert('이미 로그인 중입니다.');
      navigate('/');
      return;
    }
  }, []);

  const onSubmitLogin = async (formData) => {
    const data = {
      username: formData.username,
      password: formData.password,
    };

    try {
      const res = await instance.post('/api/login', data, {
        withCredentials: true,
      });
      localStorage.setItem('TOKEN', res.data);
      dispatch(toggleLoggedIn(true));
      const auth = await axios.get('http://13.125.250.104/api/auth', {
        headers: {
          Authorization: res.data,
        },
      });
      dispatch(setNickname(auth.data.nickname));
      alert('환영HeyYo :)');
      navigate('/');
    } catch (err) {
      console.log(err);
      alert('로그인에 문제가 발생했습니다');
    }
  };

  return (
    <Form id="login-form" theme="login" onSubmit={handleSubmit(onSubmitLogin)}>
      <h2>로그인</h2>

      <InputBox>
        <label>ID</label>
        <input
          type="text"
          placeholder="아이디를 입력해 주세요"
          autoComplete="off"
          {...register('username', {
            required: true,
            minLength: 4,
          })}
        />
      </InputBox>

      <InputBox>
        <label>PASSWORD</label>
        <input
          type="password"
          placeholder="비밀번호를 입력해 주세요"
          autoComplete="off"
          {...register('password', {
            required: true,
            minLength: 6,
          })}
        />
      </InputBox>

      <Button type="submit" form="login-form" disabled={!isValid}>
        로그인 HeyYo :)
      </Button>

      <p>
        아직 계정이 없다면?
        <Link to="/join">
          회원가입하러 가기
          <AiOutlineArrowRight />
        </Link>
      </p>
    </Form>
  );
};

export default Login;

const InputBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
