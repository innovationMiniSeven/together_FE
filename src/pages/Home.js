import React from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { SERVER_BASE_URL } from '../constants';

const Home = () => {
  const getPostList = async () => {
    const posts = await axios.get('http://localhost:5001/posts');
    return posts.data;
    // FIXME:
    // const posts = await axios.get(
    //   `${SERVER_BASE_URL}/posts?sort=almost&category=ALL&page=0&size=12`,
    // );
    // return posts.data.content;
    // TODO: 무한 스크롤 구현
  };

  const postList = useQuery(['postList'], getPostList);
  // console.log(postList.data);
  const category = useSelector((state) => state.category);
  const regex = /(http(s))?:\/\/([a-z0-9-]+\.)+[a-z0-9]{2,4}.*$/;

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
          {postList.data.map((d, idx) => {
            return (
              <PostItem key={idx}>
                {/* FIXME: key 값 postId로 추후 수정 */}
                <Link to={`/post/${d.id}`}>
                  <PostTitle>
                    <em>
                      {category[d.category][0]}
                      <span>
                        ({d.currentNumberPeople}/{d.numberPeople})
                      </span>
                    </em>
                    <strong>{d.title}</strong>
                  </PostTitle>
                  {d.imageUrl && regex.test(d.imageUrl) ? (
                    <Image src={d.imageUrl} alt="" />
                  ) : (
                    <Image src={category[d.category][1]} alt="" />
                  )}
                  <p>작성자: {d.nickname}</p>
                  <p>
                    마감예정일 : {new Date(d.deadline).toLocaleDateString()}
                  </p>
                  <p>
                    <span>조회수 : {d.viewCount} </span>
                    <span> 댓글수 : {d.commentCount}</span>
                  </p>
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
  padding: 20px 15px;
  border: 3px solid #f2f2f2;
  border-radius: 20px;
  transition: all 0.2s ease-in-out;
  em {
    display: block;
    padding: 3px 7px;
    border-radius: 5px;
    background: #f1f1f1;
    text-align: center;
    letter-spacing: -0.1em;
    font-style: normal;
    font-weight: 600;
    transition: all 0.4s ease-in-out;
  }
  &:hover {
    transform: scale(102%);
    background: #f1f1f1;
    em {
      background: #ddd;
    }
  }
  strong {
    overflow: hidden;
    display: block;
    width: 300px;
    margin-top: 15px;
    font-size: 1.2em;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  @media only screen and (max-width: 763px) {
    width: 100%;
    align-items: center;
  }
`;

const PostTitle = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
`;

const Image = styled.img`
  width: 300px;
  margin: 10px 0;
  border-radius: 10px;
  aspect-ratio: 4 / 3;
  object-fit: cover;
`;
