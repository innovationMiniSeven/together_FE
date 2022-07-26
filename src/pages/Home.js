import React from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Home = () => {
  const getPostList = async () => {
    const posts = await axios.get('http://localhost:5001/posts');
    return posts.data;
  };

  const postList = useQuery(['postList'], getPostList);
  const category = useSelector((state) => state.category);

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
                  <p>카테고리 : {category[d.category][0]}</p>
                  <p>제목 : {d.title}</p>
                  {d.imageUrl ? (
                    <Image src={d.imageUrl} alt="" />
                  ) : (
                    <Image src={category[d.category][1]} alt="" />
                  )}
                  <p>
                    모집인원: {d.currentNumberPeople}/{d.numberPeople}
                  </p>
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
  gap: 10px;
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
      font-size: 45px;
    }
  }
  &.banner-title {
    font-family: 'LeferiPoint-BlackObliqueA' !important;
    color: #222;
    text-align: center;
    text-decoration: underline;
    font-size: 56.5px;
    min-width: 310px;
  }
  @media only screen and (max-width: 1024px) {
    em {
      font-size: 24px;
      span {
        font-size: 40px;
      }
    }
  }
  @media only screen and (max-width: 425px) {
    &.banner-title {
      font-size: 35px;
    }
    em {
      font-size: 18px;
      span {
        font-size: 30px;
      }
    }
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

const PostItem = styled.li`
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 10px;
  border: 2px solid #f2f2f2;
  border-radius: 20px;
  transition: all 0.2s ease-in-out;
  &:hover {
    transform: scale(102%);
    background: #f1f1f1;
  }
  @media only screen and (max-width: 735px) {
    width: 100%;
  }
`;

const Image = styled.img`
  width: 300px;
`;
