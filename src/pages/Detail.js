import React, { useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const Detail = () => {
  const params = useParams();
  const queryClient = useQueryClient();
  
  const { 
    register,
    handleSubmit,
  } = useForm({ mode: 'onChange' });
  

  // params.postId 파라미터로 가져온 작성글의 id값으로 해당하는 id 값의 글 가져오기
  const getPost = async () => {
    const res = await axios.get('http://localhost:5001/posts/'+ params.postId);
    return res.data;
  }

  // 댓글의 작성글의 postId값과 댓글의 postId값을 비교해서 일치하는 값만 com_list에 담기
  const getComment = async () => {
    const res = await axios.get('http://localhost:5001/comment');
    let com_list = [];
    res.data.forEach((d) => {
      if (params.postId == d.postId) {
        com_list.push(d);
      }
    })
    return com_list;
  }

  const submitComment = async (CommentData) => {
    let today = new Date();
    let year = today.getFullYear(); // 년도
    let month = today.getMonth() + 1;  // 월
    let date = today.getDate();  // 날짜
    let now = year + '.' + month + '.' + date

    // 유저 토큰으로 닉네임
    // let writer = 

    const data = {
      content: CommentData.content,
      createdAt: now,
      postId: params.postId,
      nickname: "테스트닉네임",
    }

    try {
      await axios.post("http://localhost:5001/comment", data);
      queryClient.invalidateQueries('comment');
      CommentData.content = "";
    } catch (err) {
      console.log(err);
      alert('댓글 추가하기 실패했습니다.');
    }
  }
  const post_query = useQuery(['post'], getPost);
  const comment_query = useQuery(['comment'], getComment);
  
  console.log(post_query.data);
  console.log(comment_query.data);

  return (
  <MainContainer>
    <TitleBox>
      <img alt={post_query.data.category}/>
      <h1>{post_query.data.title}</h1>
    </TitleBox>
    <WriteInfoBox>
      <div>
        <p>{post_query.data.nickname}</p>
        <p>{post_query.data.createdAt}</p>
        <p>{post_query.data.viewCount}</p>
      </div>
      <div>
        <Link to="/">Edit</Link>
        <Link to="/">Delete</Link>
      </div>
    </WriteInfoBox>
    <BodyBox>
      <ContentBox>
        <ContentInfo>
          <p>{post_query.data.category}</p>
          <p>{post_query.data.deadline}</p>
          <div>
            <p>{post_query.data.currentNumberPeople} / {post_query.data.numberPeople}</p>
          </div>
          <div>
            <p>{post_query.data.contactMethod}</p>
          </div>
        </ContentInfo>
        <Content>
          {post_query.data.content}
        </Content>
      </ContentBox>
      <CommentBox>
        <InputCommentBox>
          <InputComment type="text" {...register('content', { required: 'true', minLength: 1})} />
          <InputCommentBtn onClick={handleSubmit(submitComment)}>댓글달기</InputCommentBtn>
        </InputCommentBox>
        <Comments>
          {comment_query.data.map((d) => {
            return (
              <div key={d.id}>
                <p>{d.content}</p>
                <p>{d.nickname}</p>
                <p>{d.createdAt}</p>
              </div>
            )
          })}
        </Comments>
      </CommentBox>
    </BodyBox>
  </MainContainer>
  );
};

const MainContainer = styled.div`
  width: 1000px;
  height: 100%;
  margin: 0px auto;
  background: #aaa;
  border: 2px solid red;
`;

const TitleBox = styled.div`
  display: flex;
  gap: 30px;
  align-items: center;
  border: 2px solid green;
`;

const WriteInfoBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  div {
    display: flex;
    gap: 20px;
  }
  border: 2px solid green;
`;

const BodyBox = styled.div`
  border: 2px solid red;
`;

const ContentBox = styled.div`
  border: 2px solid green;
`;

const CommentBox = styled.div`
  border: 2px solid green;
`;

const InputCommentBox = styled.div`
  display: inline-block;
  padding: 5px;
  border:solid 1px #ccc;
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

const Comments = styled.div`

`;

const ContentInfo = styled.div`
  border: 2px solid blue;

`;

const Content = styled.div`
  border: 2px solid yellow;

`;

export default Detail;

