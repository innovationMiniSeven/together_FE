import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Button = ({ children, type, form, disabled }) => {
  return (
    <Btn type={type} form={form} disabled={disabled}>
      {children}
    </Btn>
  );
};

export default Button;

Button.propTypes = {
  children: PropTypes.any,
  type: PropTypes.string,
  form: PropTypes.string,
  disabled: PropTypes.bool,
};

const Btn = styled.button`
  margin: 5px 0 -15px;
  width: 100%;
  padding: 18px 0;
  border-radius: 5px;
  background: #f2b90c;
  font-size: 18px;
  font-weight: 700;
  transition: background 0.2s ease-in-out;
  &:disabled {
    background: #e5e5e5;
    cursor: default;
  }
`;
