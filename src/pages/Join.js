import React from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import Form from '../components/Form';
import Button from '../components/Button';
import { AiOutlineArrowRight } from 'react-icons/ai';
import instance from '../shared/Request';

const Join = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { isValid, errors },
  } = useForm({ mode: 'onChange' });

  const onSubmitJoin = async (formData) => {
    const data = {
      username: formData.username,
      nickname: formData.nickname,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    };
    console.log(data);

    try {
      const res = await instance.post('http://13.125.250.104/api/signup', data);
      console.log(res);
      alert('HeyYo 회원가입 완료! 로그인 페이지로 이동합니다 :)');
      navigate('/login');
    } catch (err) {
      console.log(err);
      alert('회원가입에 문제가 발생했습니다');
    }
  };

  return (
    <Form id="signup-form" onSubmit={handleSubmit(onSubmitJoin)}>
      <h2>회원가입</h2>

      <InputBox>
        <label>ID</label>
        <input
          type="text"
          placeholder="아이디를 입력해 주세요 (4자 이상)"
          autoComplete="off"
          {...register('username', {
            required: '* 필수 입력 값입니다',
            minLength: 4,
          })}
        />
        {errors.username && <Error>{errors.username.message}</Error>}
        {errors.username && errors.username.type === 'minLength' && (
          <Error>* 아이디는 4자 이상입니다</Error>
        )}
      </InputBox>

      <InputBox>
        <label>NICKNAME</label>
        <input
          type="text"
          placeholder="닉네임을 입력해 주세요 (10자 이하)"
          autoComplete="off"
          {...register('nickname', {
            required: '* 필수 입력 값입니다',
            maxLength: 10,
          })}
        />
        {errors.nickname && <Error>{errors.nickname.message}</Error>}
        {errors.nickname && errors.nickname.type === 'maxLength' && (
          <Error>* 닉네임은 10자 이하입니다</Error>
        )}
      </InputBox>

      <InputBox>
        <label>PASSWORD</label>
        <input
          type="password"
          placeholder="비밀번호를 입력해 주세요 (6자 이상)"
          autoComplete="off"
          {...register('password', {
            required: '* 필수 입력 값입니다',
            minLength: 6,
          })}
        />
        {errors.password && <Error>{errors.password.message}</Error>}
        {errors.password && errors.password.type === 'minLength' && (
          <Error>* 비밀번호는 6자 이상입니다</Error>
        )}
      </InputBox>

      <InputBox>
        <label>PASSWORD CONFIRMATION</label>
        <input
          type="password"
          placeholder="비밀번호를 한 번 더 입력해 주세요"
          autoComplete="off"
          {...register('confirmPassword', {
            required: true,
            validate: {
              matchesPreviousPassword: (value) =>
                getValues('password') === value ||
                '* 비밀번호가 일치하지 않습니다',
            },
          })}
        />
        {errors.confirmPassword && (
          <Error>{errors.confirmPassword.message}</Error>
        )}
      </InputBox>

      <Button type="submit" form="signup-form" disabled={!isValid}>
        가입 HeyYo :)
      </Button>

      <p>
        이미 계정이 있다면?
        <Link to="/login">
          로그인하러 가기
          <AiOutlineArrowRight />
        </Link>
      </p>
    </Form>
  );
};

const InputBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Error = styled.p`
  margin-top: 2px;
  font-size: 14px;
  color: #ed4848;
`;

export default Join;
