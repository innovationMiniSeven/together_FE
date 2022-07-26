import React from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

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
    <>
      <BannerSection>
        <Content>
          <em>
            <span>공동구매</span>?
          </em>
          <em>
            <span>배달</span>?
          </em>
          <em>
            <span>공연</span>이나 <span>전시회</span>에
          </em>
          <em>같이 갈 사람을 찾는다면? 🔎</em>
        </Content>
        <Content className="banner-title">
          <strong>함께 HeyYo!</strong>
        </Content>
      </BannerSection>

      <PostsSection>
        <PostList>
          {postList.data.map((d) => {
            return (
              <PostItem key={d.id}>
                <Link to={`/post/${d.id}`}>
                  <p>마감예정일 : {d.deadline}</p>
                  <p>카테고리 : {category[d.category]}</p>
                  <p>제목 : {d.title}</p>
                  <Image src={d.imageUrl} alt="" />
                  <p>
                    모집인원: {d.currentNumberPeople}/{d.numberPeople}
                  </p>
                  <p>연락방법 : {d.contactMethod}</p>
                  <p>글쓴이 : {d.nickname}</p>
                  <p>조회수 : {d.viewCount}</p>
                  <p>댓글수 : {d.commentCount}</p>
                </Link>
              </PostItem>
            );
          })}
        </PostList>
      </PostsSection>
    </>
  );
};

export default Home;

const BannerSection = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5vw;
  flex-wrap: wrap;
  padding: 50px 30px;
  background: rgba(242, 185, 12, 0.3);
`;

const Content = styled.div`
  max-width: 1440px;
  color: #402401;
  font-size: 37px;
  font-weight: 600;
  em {
    display: block;
    span {
      font-size: 50px;
    }
  }
  &.banner-title {
    font-family: 'LeferiPoint-BlackObliqueA' !important;
    color: #222;
    text-align: center;
    text-decoration: underline;
    font-size: 50px;
    min-width: 310px;
  }
  @media only screen and (max-width: 855px) {
    em {
      font-size: 24px;
      span {
        font-size: 40px;
      }
    }
  }
`;

const PostsSection = styled.section`
  display: flex;
  justify-content: center;
  max-width: 1440px;
  padding: 30px;
`;

const PostList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
`;

const PostItem = styled.li`
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 10px;
  border: 1px solid #f1f1f1;
  border-radius: 10px;
  transition: background 0.2s ease-in-out;
  &:hover {
    background: #f1f1f1;
  }
`;

const Image = styled.img`
  width: 300px;
`;
