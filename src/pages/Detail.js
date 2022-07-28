import React from 'react';
import propTypes from 'prop-types';
import styled from 'styled-components';
import { Link, useParams, useNavigate } from 'react-router-dom';
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
import instance from '../shared/Request';

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
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const category = useSelector((state) => state.category);
  const { nickname, isLoggedIn } = useSelector((state) => state.user);

  const { register, handleSubmit, setValue } = useForm({
    mode: 'onChange',
  });

  const getPost = async () => {
    const res = await instance.get(
      `/api/post/${params.postId}`,
    );
    return res.data;
  };

  const getComment = async () => {
    const res = await instance.get(
      `/api/comment/${params.postId}`,
    );
    return res.data;
  };

  const submitComment = async (CommentData) => {
    const data = {
      content: CommentData.commentContent,
    };

    try {
      const res = await instance.post(
        `/api/comment/${params.postId}`,
        data,
      );
      queryClient.invalidateQueries('comment');
      setValue('commentContent', '');
    } catch (err) {
      console.log(err);
      alert('댓글 추가하기 실패했습니다.');
    }
  };

  const removePost = async () => {
    const result = confirm('게시글을 삭제 HeyYo?');
    if (result) {
      try {
        await instance.delete(
          `/api/post/${params.postId}`,
        );
        alert('게시글을 삭제했습니다.');
        navigate('/');
      } catch (err) {
        console.log(err);
        alert('게시글을 삭제하지 못했습니다. ' + err.response.data.message);
      }
    } else {
      return;
    }
  };

  const removeComment = async (CommentId) => {
    const result = confirm('댓글을 삭제 HeyYo?');
    if (result) {
      try {
        await instance.delete(`/api/comment/${CommentId}`);
        queryClient.invalidateQueries('comment');
        alert('댓글을 삭제했습니다.');
      } catch (err) {
        console.log(err);
        alert('댓글을 삭제하지 못했습니다. ' + err.response.data.message);
      }
    } else {
      return;
    }
  };

  const postInfo = useQuery(['post'], getPost, {
    refetchOnWindowFocus: false,
  }).data;

  const comments = useQuery(['comment'], getComment, {
    refetchOnWindowFocus: false,
  }).data;

  return (
    <MainContainer>
      <section>
        <BtnBack>
          <FiArrowLeft onClick={() => navigate(-1)} />
        </BtnBack>

        <TitleBox color={category[postInfo.category][2]}>
          <CategoryIcon category={postInfo.category} />
          <h2>{postInfo.title}</h2>
        </TitleBox>

        <UserAndDate>
          <User>
            <TbFaceId />
            <div>{postInfo.nickname}</div>
            <div style={{ fontWeight: '600', color: '#717171' }}>
              {postInfo.createdAt}
            </div>
            <div style={{ fontWeight: '600', color: '#717171' }}>
              {postInfo.viewCount}
            </div>
          </User>
          {postInfo.nickname === nickname && (
            <EditAndDelete>
              <Link to={`/post/${params.postId}/edit`}>
                <RiEdit2Line />
              </Link>
              <RiDeleteBin5Line onClick={removePost} />
            </EditAndDelete>
          )}
        </UserAndDate>

        <PostInfo>
          <li>
            <span className="subcategory">모집 구분</span>
            <span>{category[postInfo.category][0]}</span>
          </li>
          <li>
            <span className="subcategory">모집 인원</span>
            <span>
              {postInfo.currentNumberPeople} / {postInfo.numberPeople}
            </span>
          </li>
          <li>
            <span className="subcategory">마감 일자</span>
            <span>{postInfo.deadline.slice(0, 10)}</span>
          </li>
          <li>
            <span className="subcategory">연락 방법</span>
            <span>{postInfo.contactMethod}</span>
          </li>
        </PostInfo>
      </section>

      <ContentAndComment>
        <PostContent>
          <h2>소개</h2>
          <div>
            {postInfo.content.split('\n').map((line, idx) => {
              return <p key={idx}>{line}</p>;
            })}
          </div>
          <img src={postInfo.imageUrl} alt="" />
        </PostContent>

        <Comment>
          <h2>댓글</h2>
          <CommentForm>
            <div>
              <h3>{comments.length}개의 댓글이 있습니다.</h3>
              <textarea
                placeholder="댓글을 입력하세요."
                {...register('commentContent', {
                  required: 'true',
                  minLength: 1,
                })}
              />
              <button onClick={handleSubmit(submitComment)}>댓글 등록</button>
            </div>
          </CommentForm>
          <CommentSection>
            {comments &&
              comments.map((d) => (
                <CommentItem key={d.id}>
                  <CommentUser>
                    <div>
                      <TbFaceId />
                    </div>
                    <div>
                      <div>
                        <div>{d.nickname}</div>
                        <div>{d.createdAt.slice(0, 10)}</div>
                      </div>
                      <div>
                        {isLoggedIn && nickname === d.nickname && (
                          <CommentDelBtn onClick={() => removeComment(d.id)}>
                            삭제
                          </CommentDelBtn>
                        )}
                      </div>
                    </div>
                  </CommentUser>
                  <div>{d.content}</div>
                </CommentItem>
              ))}
          </CommentSection>
        </Comment>
      </ContentAndComment>
    </MainContainer>
  );
};

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 1.5rem 1.5rem;
`;

const BtnBack = styled.button`
  font-size: 25px;
`;

const TitleBox = styled.div`
  display: flex;
  align-items: center;
  margin-top: 2.5rem;
  font-weight: 800;
  letter-spacing: -0.1em;
  color: #222;
  svg {
    min-width: 50px;
    margin-right: 12px;
    padding: 5px;
    border-radius: 50%;
    background: ${({ color }) => color};
    font-size: 50px;
    color: #222;
  }
  h2 {
    margin-top: 12px;
    font-size: 2.2em;
  }
`;

const UserAndDate = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  margin-top: 20px;
  padding-bottom: 10px;
  border-bottom: 3px solid #f2f2f2;
`;

const User = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  svg {
    display: block;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
  }
  div {
    padding: 5px 15px;
    border-right: 2px solid #e1e1e1;
    color: #333;
    font-size: 1rem;
    font-weight: 700;
  }
`;

const EditAndDelete = styled.div`
  font-size: 1.5rem;
  svg {
    margin: 5px;
    cursor: pointer;
  }
`;

const PostInfo = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(410px, 1fr));
  grid-row-gap: 16px;
  margin: 40px 10px 60px;
  li {
    position: relative;
    display: flex;
    /* align-items: center; */
    font-size: 20px;
    font-weight: 700;
    span.subcategory {
      min-width: 73.75px;
      margin-right: 40px;
      color: #717171;
    }
  }
`;

const ContentAndComment = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  h2 {
    line-height: 1.7;
  }
`;

const PostContent = styled.div`
  display: block;
  width: 60%;
  max-width: 500px;
  word-break: break-all;
  font-size: 1.125rem;
  h2 {
    margin-right: 10px;
    border-bottom: 3px solid #f2f2f2;
    font-size: 24px;
    font-weight: 700;
  }
  div {
    width: 100%;
    margin: 20px auto 0;
    line-height: 1.4;
  }
  img {
    display: block;
    margin: 20px auto 0;
    width: 100%;
    max-width: 500px;
    border-radius: 5px;
  }
  @media only screen and (max-width: 916px) {
    width: 100%;
    max-width: 100%;
  }
`;

const Comment = styled.section`
  display: flex;
  flex-direction: column;
  width: 40%;
  max-width: 322px;
  background: #fff;
  h2 {
    border-bottom: 3px solid #f2f2f2;
  }
  @media only screen and (max-width: 916px) {
    width: 100%;
    max-width: 100%;
  }
`;

const CommentForm = styled.form`
  width: 100%;
  margin: 0 auto;
  div {
    display: flex;
    flex-direction: column;
    h3 {
      font-size: 1.25rem;
      margin: 20px 0;
    }
    textarea {
      resize: none;
      width: 100%;
      min-height: 100px;
      margin-bottom: 10px;
      padding: 1rem 1rem 1.5rem;
      border: 2px solid #e1e1e1;
      border-radius: 16px;
      font-size: 1rem;
    }
    button {
      width: 120px;
      height: 40px;
      margin: 0px auto;
      padding: 7px 10px;
      border-radius: 40px;
      background: #333;
      color: #fff;
      font-weight: 700;
      font-size: 18px;
    }
  }
`;

const CommentSection = styled.div`
  margin-top: 20px;
`;

const CommentItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem 1rem 1.5rem;
  margin-bottom: 5px;
  border: 2px solid #e1e1e1;
  border-radius: 16px;
  div {
    display: flex;
    margin: 3px;
  }
`;

const CommentUser = styled.div`
  align-items: center;
  div {
    font-size: 16px;
    font-weight: 700;
  }
`;

const CommentDelBtn = styled.button`
  padding: 2px;
  border: 2px solid #e1e1e1;
  border-radius: 5px;
  background: #e1e1e1;
  font-weight: 700;
`;

export default Detail;
