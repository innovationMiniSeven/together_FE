import React from 'react';
import axios from 'axios';
import propTypes from 'prop-types';
import styled from 'styled-components';
import { Link, useParams } from 'react-router-dom';

import { useForm } from 'react-hook-form';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';

import { FiArrowLeft } from 'react-icons/fi';
import { TbFaceId } from 'react-icons/tb';
import { RiDeleteBin5Line, RiEdit2Line } from 'react-icons/ri';
import {
  MdDeliveryDining,
  MdLibraryMusic,
  MdEmojiPeople,
} from 'react-icons/md';
import { FaPeopleCarry } from 'react-icons/fa';

const CategoryIcon = ({ category }) => {
  CategoryIcon.propTypes = {
    category: propTypes.string,
  };

  switch (category) {
    case 'PURCHASE':
      return <FaPeopleCarry />;
    case 'DELIVERY':
      return <MdDeliveryDining />;
    case 'EXHIBITION':
      return <MdLibraryMusic />;
    default:
      return <MdEmojiPeople />;
  }
};

const Detail = () => {
  const params = useParams();
  const queryClient = useQueryClient();
  const category = useSelector((state) => state.category);
  console.log(category);

  const { register, handleSubmit } = useForm({ mode: 'onChange' });

  // params.postId 파라미터로 가져온 작성글의 id값으로 해당하는 id 값의 글 가져오기
  const getPost = async () => {
    const res = await axios.get('http://localhost:5001/posts/' + params.postId);
    return res.data;
  };

  // 댓글의 작성글의 postId값과 댓글의 postId값을 비교해서 일치하는 값만 com_list에 담기
  const getComment = async () => {
    const res = await axios.get('http://localhost:5001/comment');
    let com_list = [];
    res.data.forEach((d) => {
      if (params.postId == d.postId) {
        com_list.push(d);
      }
    });
    return com_list;
  };

  const submitComment = async (CommentData) => {
    let today = new Date();
    let year = today.getFullYear(); // 년도
    let month = today.getMonth() + 1; // 월
    let date = today.getDate(); // 날짜
    let now = year + '.' + month + '.' + date;

    // 유저 토큰으로 닉네임
    // let writer =
    const data = {
      content: CommentData.content,
      createdAt: now,
      postId: params.postId,
      nickname: '테스트닉네임',
    };

    try {
      await axios.post('http://localhost:5001/comment', data);
      queryClient.invalidateQueries('comment');
      CommentData.content = '';
    } catch (err) {
      console.log(err);
      alert('댓글 추가하기 실패했습니다.');
    }
  };
  const postInfo = useQuery(['post'], getPost).data;
  const comments = useQuery(['comment'], getComment).data;
  // console.log(category[postInfo.category][3]);
  // FIXME: 깜빡이는 문제 해결법 (useQuery가 원인. option 객체로 전달 but 캐시 못쓴다.)
  // 방법 1) cacheTime 설정하고 사용
  // 방법 2) staleTime 0으로 하면 같은 쿼리키로 받아온 이전 데이터를 사용하지 X (다음 fetching 전까지)
  // isPreviousData가 아닌 경우만 렌더링되도록 분기하기 등등...

  return (
    <MainContainer>
      <section>
        <Link to="/">
          <FiArrowLeft />
        </Link>
        <TitleBox color={category[postInfo.category][2]}>
          <CategoryIcon category={postInfo.category} />
          <p>{postInfo.title}</p>
        </TitleBox>
        <UserAndDate>
          <User>
            <TbFaceId />
            <div>{postInfo.nickname}</div>
            <div style={{ fontWeight: '600', color: '#717171' }}>
              {new Date(postInfo.createdAt).toLocaleString()}
            </div>
            <div style={{ fontWeight: '600', color: '#717171' }}>
              {postInfo.viewCount}
            </div>
          </User>
          <EditAndDelete>
            <Link to="/">
              <RiEdit2Line />
            </Link>
            <Link to="/">
              <RiDeleteBin5Line />
            </Link>
          </EditAndDelete>
        </UserAndDate>
        <PostInfo style={{ marginTop: '60px' }}>
          <li>
            <span>모집 구분</span>
            <span>{category[postInfo.category][0]}</span>
          </li>
          <li>
            <span>모집 인원</span>
            <span>
              {postInfo.currentNumberPeople} / {postInfo.numberPeople}
            </span>
          </li>
          <li>
            <span>마감 일자</span>
            <span>{postInfo.deadline}</span>
          </li>
          <li>
            <span>연락 방법</span>
            <span>{postInfo.contactMethod}</span>
          </li>
        </PostInfo>
      </section>

      <ContentAndComment>
        <PostContent>
          <h2>소개</h2>
          <div>{postInfo.content}</div>
        </PostContent>
        <Comment>
          <CommentForm>
            <div>
              <h1>{comments.length}개의 댓글이 있습니다.</h1>
              <textarea
                placeholder="댓글을 입력하세요."
                {...register('content', { required: 'true', minLength: 1 })}
              />
              <button onClick={handleSubmit(submitComment)}>댓글 등록</button>
            </div>
          </CommentForm>
          <CommentSection>
            {comments.length > 0 ? (
              <CommentItem>
                <div>
                  <div>
                    <TbFaceId />
                  </div>
                  <div>
                    <div>{comments[0].nickname}</div>
                    <div>{comments[0].createdAt}</div>
                  </div>
                </div>
                <div>{comments[0].content}</div>
              </CommentItem>
            ) : (
              <CommentItem>
                <div>
                  <div>
                    <TbFaceId />
                  </div>
                  <div>
                    <div>닉네임자리</div>
                    <div>댓글작성시간</div>
                  </div>
                </div>
                <div>내용</div>
              </CommentItem>
            )}
          </CommentSection>
        </Comment>

        {/* {comment_query.data.map((d) => {
              return (
                <div key={d.id}>
                </div>
              )
            })} */}
        {/* <div>{d.nickname}</div>
      <div>{d.createdAt}</div> */}
        {/* <p>{d.content}</p> */}
        {/* <InputComment type="text" {...register('content', { required: 'true', minLength: 1})} />
      <InputCommentBtn onClick={handleSubmit(submitComment)}>댓글달기</InputCommentBtn> */}
      </ContentAndComment>
    </MainContainer>
  );
};

const MainContainer = styled.div`
  max-width: 900px;
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  padding: 1.5rem 1.5rem 5rem;
`;

const TitleBox = styled.div`
  display: flex;
  align-items: center;
  margin-top: 2.5rem;
  font-size: 1.5rem;
  font-weight: 800;
  line-height: 126.5%;
  letter-spacing: -0.005em;
  color: #000;
  svg {
    margin-right: 10px;
    font-size: 40px;
    padding: 5px;
    background: ${({ color }) => color};
    border-radius: 50%;
    color: #222;
  }
`;

const UserAndDate = styled.div`
  margin-top: 32px;
  padding-bottom: 32px;
  border-bottom: 3px solid #f2f2f2;
  display: flex;
  grid-gap: 15px;
  gap: 15px;
  align-items: center;
  justify-content: space-between;
`;

const User = styled.div`
  display: flex;
  align-items: conter;
  position: relative;
  justify-content: space-between;
  svg {
    width: 2rem;
    height: 2rem;
    display: block;
    border-radius: 50%;
  }
  div {
    font-size: 1rem;
    color: #333;
    font-weight: 700;
    padding: 5px 15px;
    border-right: 2px solid #e1e1e1;
    font-weight: 800;
    align-items: center;
  }
`;

const EditAndDelete = styled.div`
  font-size: 1.5rem;
  a {
    margin: 5px;
  }
`;

const PostInfo = styled.ul`
  list-style: none;
  padding: 0px;
  display: grid;
  grid-template-columns: repeat(2, 6fr);
  grid-row-gap: 16px;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  padding-inline-start: 40px;
  li {
    font-size: 20px;
    display: flex;
    position: relative;
    align-items: center;
    font-weight: 700;
  }
  li span:first-child {
    color: #717171;
    margin-right: 40px;
  }
`;

const ContentAndComment = styled.div`
  display: flex;
`;

const PostContent = styled.div`
  margin-top: 132px;
  font-size: 1.125rem;
  word-break: break-all;
  line-height: 1.7;
  letter-spacing: -0.004em;
  display: block;
  width: 60%;
  h2 {
    margin-right: 10px;
    font-size: 24px;
    font-weight: 700;
    padding-bottom: 24px;
    border-bottom: 3px solid #f2f2f2;
  }
  div {
    width: 100%;
    margin: 40px auto 0;
  }
`;

const Comment = styled.section`
  display: flex;
  flex-direction: column;
  background: #fff;
  width: 40%;
  margin-top: 100px;
`;

const CommentForm = styled.form`
  border: 3px solid red;
  width: 100%;
  margin: 0 auto;
  div {
    display: flex;
    flex-direction: column;
    /* justify-content: space-between; */
    h1 {
      font-size: 1.25rem;
      margin: 0 0 20px;
    }
    textarea {
      padding: 1rem 1rem 1.5rem;
      outline: none;
      border: 2px solid #e1e1e1;
      border-radius: 16px;
      width: 100%;
      min-height: 100px;
      margin-bottom: 10px;
      resize: none;
      font-size: 1rem;
    }
    button {
      margin: 0px auto;
      padding: 7px 10px;
      width: 90px;
      height: 30px;
      background: #333;
      border-radius: 40px;
      font-weight: 700;
      color: #fff;
      font-size: 12px;
    }
  }
`;

const CommentSection = styled.div`
  border: 3px solid black;
`;

const CommentItem = styled.div`
  display: flex;
  flex-direction: column;
  div {
    display: flex;
  }
`;

const BodyBox = styled.div`
  margin-top: 100px;
  border: 2px solid red;
  display: flex;
`;

const ContentBox = styled.div`
  width: 50%;
  border: 2px solid green;
`;

const ContentInfo = styled.div`
  display: flex;
  justify-content: space-between;
  border: 2px solid blue;
`;

const Content = styled.div`
  border: 2px solid yellow;
`;

const CommentBox = styled.div`
  width: 50%;
  border: 2px solid green;
`;

const InputCommentBox = styled.div`
  display: inline-block;
  padding: 5px;
  border: solid 1px #ccc;
  background: #f4f4f4;
  font-size: 9pt;
`;

const InputComment = styled.input`
  width: 100px;
  padding: 3px;
  border: 0;
  font-size: 9pt;
`;

const InputCommentBtn = styled.button`
  width: 50px;
  padding: 3px;
  border: solid 1px #6699ff;
  font-size: 9pt;
`;

const Comments = styled.div``;

export default Detail;
