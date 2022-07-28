import React from 'react';
import styled from 'styled-components';
import SyncLoader from 'react-spinners/SyncLoader';

const Loading = () => {
  return (
    <>
      <LoadingSpinner>
        <SyncLoader color="#f2a30f" />
      </LoadingSpinner>
    </>
  );
};

const LoadingSpinner = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default Loading;
