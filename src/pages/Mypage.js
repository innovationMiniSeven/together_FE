import React from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import PostItem from '../components/PostItem';
import instance from '../shared/Request';

const Mypage = () => {
  const getMyPostList = async () => {
    // const posts = await instance.get(
    //   'http://localhost:5001/posts?_limit=10&_page=1',
    // );
    // return posts.data;
    // process.env.REACT_APP_DB_HOST +
    const posts = await instance.get(`http://13.125.250.104/api/mypost`);
    console.log(posts);
    return posts.data;
  };

  const { data: posts } = useQuery(['postList'], getMyPostList, {
    refetchOnWindowFocus: false,
  });

  return (
    <MyPageContainer>
      <h2>내 작성글</h2>
      <PostsSection>
        <PostList>
          {posts.map((postInfo) => {
            return <PostItem key={postInfo.id} postInfo={postInfo} />;
          })}
        </PostList>
      </PostsSection>
    </MyPageContainer>
  );
};

export default Mypage;

const MyPageContainer = styled.div`
  text-align: center;
  h2 {
    display: inline-block;
    border-bottom: 3px solid #f2a30f;
    margin: 60px auto 40px;
  }
`;

const PostsSection = styled.section`
  display: flex;
  justify-content: center;
  max-width: 1440px;
  margin: 0 auto;
  padding: 30px;
`;

const PostList = styled.ul`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 15px;
`;
