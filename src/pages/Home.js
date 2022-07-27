import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled, { css } from 'styled-components';
import { useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { TbFaceId } from 'react-icons/tb';
import { AiOutlineEye } from 'react-icons/ai';
import { FaRegComment } from 'react-icons/fa';
import Loading from '../components/Loading';

const Home = () => {
  const [selectedCategory, setSelectedCatregory] = useState('ALL');
  const [selectedSort, setSelectedSort] = useState('default');
  const queryClient = useQueryClient();
  const { ref, inView } = useInView();

  const getPostList = async (pageParam) => {
    const posts = await axios.get('http://localhost:5001/posts?_limit=10&_page=1');
    return posts.data;
    // process.env.REACT_APP_DB_HOST +
    // const posts = await axios.get(`http://13.125.250.104/api/posts?sort=${selectedSort}&category=${selectedCategory}&page=${pageParam}&size=12`);
    // TODO: 무한 스크롤 구현 (useInfiniteQuery)
    // return posts.data.content;
    // FIXME: return 값에 객체 안에 data랑 last랑 nextPage: pageParam + 1 담아 보내기 => getNextPageParam에서 매개변수로 받아서 사용
  };

  const { data: posts, refetch } = useQuery(['postList'], getPostList, {
    refetchOnWindowFocus: false,
  });
  // console.log(data);

  // const { data, status, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
  //   "posts",
  //   ({ pageParam = 0 }) => getPostList(pageParam),
  //   {
  //     getNextPageParam: (lastPage) =>
  //       !lastPage.isLast ? lastPage.nextPage : undefined,
  //   }
  // );

  useEffect(() => {
    refetch();
  }, [selectedCategory, selectedSort]);

  useEffect(() => {
    if (inView) {
      console.log('마지막!');
      // fetchNextPage();
    }
  }, [inView]);

  // TODO: 리덕스 스토어에 넣기
  const viewOptions = {
    category: [
      {
        name: 'ALL',
        text: '전체보기',
      },
      {
        name: 'PURCHASE',
        text: '공동구매',
      },
      {
        name: 'DELIVERY',
        text: '배달',
      },
      {
        name: 'EXHIBITION',
        text: '공연/전시회',
      },
      {
        name: 'ETC',
        text: '기타',
      },
    ],
    sort: [
      {
        name: 'default',
        text: '최신순',
      },
      {
        name: 'popular',
        text: '인기',
      },
      {
        name: 'almost',
        text: '모집중',
      },
    ],
  };

  const onClickCategory = async (name) => {
    setSelectedCatregory(name);
    queryClient.invalidateQueries('postList');
    // await getPostList();
  };

  const onClickSort = async (name) => {
    setSelectedSort(name);
    queryClient.invalidateQueries('postList');
    // await getPostList();
  };

  const regex = /(http(s))?:\/\/([a-z0-9-]+\.)+[a-z0-9]{2,4}.*$/;
  const postCategory = useSelector((state) => state.category);

  return (
    <>
      <BannerSection>
        <BannerContent>
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
        </BannerContent>
        <BannerContent className="banner-title">
          <strong>함께 HeyYo!</strong>
        </BannerContent>
      </BannerSection>

      <CategoryAndSort>
        {/* TODO: 정렬 및 카테고리 섹션 만들기 */}
        <CategoryBox>
          {viewOptions.category.map((c) => {
            return (
              <CategoryItem
                // category={c.name}
                key={c.name}
                active={c.name === selectedCategory}
                onClick={() => {
                  onClickCategory(c.name);
                }}
              >
                {c.text}
              </CategoryItem>
            );
          })}
        </CategoryBox>
        <SortBox>
          {viewOptions.sort.map((s) => {
            return (
              <SortItem
                key={s.name}
                active={s.name === selectedSort}
                onClick={() => {
                  onClickSort(s.name);
                }}
              >
                {s.text}
              </SortItem>
            );
          })}
          {/* <div>최신순</div>
          <div>인기</div>
          <div>모집중</div> */}
        </SortBox>
      </CategoryAndSort>

      <PostsSection>
        <PostList>
          {/* FIXME: .data 빼기 */}
          {posts.data.map((d) => {
            return (
              // TODO: PostItem 컴포넌트 분리해서 MyPage에서 재사용
              <PostItem key={d.id}>
                <Link to={`/post/${d.id}`}>
                  <PostTitle>
                    <em>
                      {postCategory[d.category][0]}&nbsp;
                      <span>
                        ( {d.currentNumberPeople} / {d.numberPeople} )
                      </span>
                    </em>
                    <strong>{d.title}</strong>
                    <Deadline>
                      ~ {new Date(d.deadline).toLocaleDateString()}
                    </Deadline>
                  </PostTitle>
                  {d.imageUrl && regex.test(d.imageUrl) ? (
                    <Image src={d.imageUrl} alt="" />
                  ) : (
                    <Image src={postCategory[d.category][1]} alt="" />
                  )}
                  <PostItemFooter>
                    <em>
                      <TbFaceId /> {d.nickname}
                    </em>
                    <ViewAndCommentCount>
                      <span>
                        <AiOutlineEye /> {d.viewCount}
                      </span>
                      <span>
                        <FaRegComment /> {d.commentCount}
                      </span>
                    </ViewAndCommentCount>
                  </PostItemFooter>
                </Link>
              </PostItem>
            );
          })}
        </PostList>
      </PostsSection>
      {/* {isFetchingNextPage? <Loading /> : <div ref={ref} />} */}
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

const BannerContent = styled.div`
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

const CategoryAndSort = styled.section`
  max-width: 1000px;
  margin: 30px auto 0px;
  justify-content: space-between;
  display: flex;
  align-items: center;
`;

const CategoryBox = styled.div`
  display: flex;
  gap: 30px;
  background: #f6f6f6;
  padding: 15px 40px;
  border-radius: 5px;
`;

const CategoryItem = styled.div`
  ${({ active }) =>
    active &&
    css`
      font-weight: 600;
      border-bottom: 3px solid #f2b90c;
    `};
  cursor: pointer;
`;

const SortBox = styled.div`
  display: flex;
  gap: 20px;
  border-bottom: 3px solid #f2f2f2;
  padding: 15px 40px;
  border-radius: 5px;
`;

const SortItem = styled.div`
  cursor: pointer;
  ${({ active }) =>
    active &&
    css`
      font-weight: 600;
    `};
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

const Deadline = styled.p`
  margin-top: -5px;
  color: #222;
  font-size: 14px;
`;

const PostItemFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 300px;
  em {
    display: flex;
    gap: 3px;
    align-items: center;
  }
`;

const ViewAndCommentCount = styled.div`
  display: flex;
  gap: 10px;
  color: #a0a0a0;
  margin-top: 5px;
  span {
    display: flex;
    align-items: center;
    gap: 3px;
  }
`;

const Image = styled.img`
  width: 300px;
  margin: 10px 0;
  border-radius: 10px;
  aspect-ratio: 4 / 3;
  object-fit: cover;
`;
