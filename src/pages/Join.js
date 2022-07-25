import React from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineArrowRight } from 'react-icons/ai';

const Join = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { isValid, errors },
  } = useForm({ mode: 'onChange' });

  const submitJoin = async (formData) => {
    const data = {
      username: formData.username,
      nickname: formData.nickname,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    };
    console.log(data);

    await axios.post('http://localhost:5001/user', data);
    alert('HeyYo 회원가입 완료! 로그인 페이지로 이동합니다 :)');
    navigate('/login');
  };

  return (
    <JoinComponent onSubmit={handleSubmit(submitJoin)}>
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
        ></input>
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
        ></input>
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
        ></input>
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
        ></input>
        {errors.confirmPassword && (
          <Error>{errors.confirmPassword.message}</Error>
        )}
      </InputBox>

      <JoinBtn type="submit" disabled={!isValid}>
        HeyYo 가입하기 :)
      </JoinBtn>

      <p>
        이미 계정이 있다면?
        <LoginLink to="/login">
          로그인하러 가기
          <AiOutlineArrowRight />
        </LoginLink>
      </p>
    </JoinComponent>
  );
};

const JoinComponent = styled.form`
  width: 300px;
  background-color: #fff;
  margin: 8vh auto 0;
  padding: 65px 83px 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 24px;
  border: 2px solid #f1f1f1;
  border-radius: 30px;
  box-shadow: 0px 4px 8px 0px #0000001a;
  h2 {
    font-family: 'LeferiPoint-BlackObliqueA' !important;
  }
`;

const InputBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  label {
    font-size: 14px;
    font-weight: 700;
  }
  input {
    padding: 15px 25px;
    width: 250px;
    border-radius: 5px;
    transition: background 0.2s ease-in-out;
    font-size: 14px;
    &:hover,
    &:focus {
      background: #e5e5e5;
    }
  }
`;

const JoinBtn = styled.button`
  margin: 5px 0 -15px;
  width: 100%;
  padding: 18px 0;
  border-radius: 5px;
  background: #f2b90c;
  font-size: 18px;
  font-weight: 700;
  &:disabled {
    background: #e5e5e5;
    cursor: default;
  }
`;

const LoginLink = styled(Link)`
  margin-left: 8px;
  color: #f2a30f;
  font-weight: 700;
  &:hover {
    text-decoration: underline;
  }
`;

const Error = styled.p`
  margin-top: 2px;
  font-size: 14px;
  color: #ed4848;
`;

export default Join;
