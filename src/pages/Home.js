import React from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';

const Home = () => {
  const getPostList = async () => {
    const posts = await axios.get('http://localhost:5001/posts');
    return posts.data;
  };

  const postList = useQuery(['postList'], getPostList);
  const category = {
    PURCHASE: '공동구매',
    DELIVERY: '배달',
    EXHIBITION: '공연/전시회',
    ETC: '기타',
  };

  return (
    <div>
      {postList.data.map((d) => {
        return (
          <div key={d.id}>
            <p>마감예정일 : {d.deadline}</p>
            <p>카테고리 : {category[d.category]}</p>
            <p>제목 : {d.title}</p>
            <Image src={d.imageUrl} alt=""/>
            <p>모집인원: {d.currentNumberPeople}/{d.numberPeople}</p>
            <p>연락방법 : {d.contactMethod}</p>
            <p>글쓴이 : {d.nickname}</p>
            <p>조회수 : {d.viewCount}</p>
            <p>댓글수 : {d.commentCount}</p>
            <hr />
          </div>
        );
      })}
    </div>
  );
};

export default Home;

const Image = styled.img`
  width: 300px;
`;