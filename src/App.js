import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { GlobalStyle } from './styles/GlobalStyle';

import Layout from './components/Layout';
import Home from './pages/Home';
import Join from './pages/Join';
import Login from './pages/Login';
import Mypage from './pages/Mypage';
import Post from './pages/Post';
import Detail from './pages/Detail';

const App = () => {
  return (
    <>
      <GlobalStyle />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/join" element={<Join />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mypage" element={<Mypage />} />
          <Route path="/post" element={<Post />} />
          <Route path="/detail" element={<Detail />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
