import React from 'react';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import instance from '../shared/Request';
import PostItem from '../components/PostItem';

const Mypage = () => {
  const getMyPostList = async () => {
    const posts = await instance.get('/api/mypost');
    return posts.data;
  };

  const posts = useQuery(['myPostList'], getMyPostList, {
    refetchOnWindowFocus: false,
  });

  return (
    <MyPageContainer>
      <h2>내 작성글</h2>
      <PostsSection>
        <PostList>
          {posts.data.map((postInfo) => {
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
