import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Form = ({ id, theme, onSubmit, children }) => {
  return (
    <FormContainer id={id} theme={theme} onSubmit={onSubmit}>
      {children}
    </FormContainer>
  );
};

export default Form;

Form.propTypes = {
  id: PropTypes.string,
  theme: PropTypes.string,
  onSubmit: PropTypes.any,
  children: PropTypes.array,
};

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 24px;
  width: 300px;
  margin: 8vh auto 0;
  padding: 65px 83px 60px;
  border: 2px solid #f1f1f1;
  border-radius: 30px;
  background: ${({ theme }) => (theme === 'login' ? '#f1f1f1' : '#fff')};
  box-shadow: 0px 4px 8px 0px #0000001a;
  h2 {
    font-family: 'LeferiPoint-BlackObliqueA' !important;
  }
  label {
    font-size: 14px;
    font-weight: 700;
  }
  input {
    padding: 15px 25px;
    width: 250px;
    border-radius: 5px;
    background: ${({ theme }) => (theme === 'login' ? '#fff' : '#f1f1f1')};
    transition: background 0.2s ease-in-out;
    font-size: 14px;
    &:hover,
    &:focus {
      background: #e5e5e5;
    }
  }
  button {
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
  }
  a {
    margin-left: 8px;
    color: #f2a30f;
    font-weight: 700;
    &:hover {
      text-decoration: underline;
    }
  }
`;
