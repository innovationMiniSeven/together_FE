import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AiOutlineArrowRight } from 'react-icons/ai';
import Form from '../components/Form';

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm({ mode: 'onChange' });

  const submitLogin = async (formData) => {
    console.log(formData);
  };

  return (
    <Form id="login-form" theme="login" onSubmit={handleSubmit(submitLogin)}>
      <h2>로그인</h2>

      <div>
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
      </div>

      <div>
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
      </div>

      <button type="submit" form="login-form" disabled={!isValid}>
        로그인 HeyYo :)
      </button>

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
