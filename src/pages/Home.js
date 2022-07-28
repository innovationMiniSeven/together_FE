import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import Loading from '../components/Loading';
import PostItem from '../components/PostItem';
import { useSelector } from 'react-redux';
import instance from '../shared/Request';

const Home = () => {
  const [selectedCategory, setSelectedCatregory] = useState('ALL');
  const [selectedSort, setSelectedSort] = useState('default');
  const queryClient = useQueryClient();
  const { ref, inView } = useInView();

  const getPostList = async (pageParam = 0) => {
    const posts = await instance.get(
      `http://13.125.250.104/api/posts?sort=${selectedSort}&category=${selectedCategory}&page=${pageParam}&size=6`,
    );
    const data = posts.data.content;
    const last = posts.data.last;
    return { data, last, nextPage: pageParam + 1 };
  };

  const { data, fetchNextPage, isFetchingNextPage, refetch } = useInfiniteQuery(
    ['postList'],
    ({ pageParam = 0 }) => getPostList(pageParam),
    {
      getNextPageParam: (lastPage) =>
        !lastPage.last ? lastPage.nextPage : undefined,
    },
  );

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  useEffect(() => {
    refetch();
    queryClient.invalidateQueries('postList');
  }, [selectedCategory, selectedSort]);

  const viewOptions = useSelector((state) => state.viewOption);

  const onClickCategory = async (name) => {
    setSelectedCatregory(name);
    queryClient.invalidateQueries('postList');
  };

  const onClickSort = async (name) => {
    setSelectedSort(name);
    queryClient.invalidateQueries('postList');
  };

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
        <CategoryBox>
          {viewOptions.category.map((c) => {
            return (
              <CategoryItem
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
        </SortBox>
      </CategoryAndSort>

      <PostsSection>
        <PostList>
          {data?.pages.map((page, index) => (
            <React.Fragment key={index}>
              {page.data.map((post) => (
                <PostItem key={post.id} postInfo={post} />
              ))}
            </React.Fragment>
          ))}
        </PostList>
      </PostsSection>
      {isFetchingNextPage ? <Loading /> : <div ref={ref} />}
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
