import React from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';

import Button from '../components/Button';

const Post = () => {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    mode: 'all',
  });

  const onSubmitPost = async (formData) => {
    console.log(formData);
    // TODO: 날짜 "yyyy-mm-dd" 형태로 수정
    // TODO: numberPeople, currentNumberPeople 타입 number로 수정
  };

  return (
    <article>
      <PostForm onSubmit={handleSubmit(onSubmitPost)}>
        <h2>게시글 작성</h2>

        <Row>
          <label>
            <h3>제목*</h3>
          </label>
          <input
            type="text"
            placeholder="글 제목을 입력해주세요"
            autoComplete="off"
            {...register('title', {
              required: true,
            })}
          />
        </Row>

        <Row>
          <Col>
            <label htmlFor="category">모집 분야*</label>
            <select
              name="category"
              id="category"
              {...register('category', {
                required: true,
              })}
            >
              <option value="PURCHASE">공동구매</option>
              <option value="DELIVERY">배달</option>
              <option value="EXHIBITION">공연/전시회</option>
              <option value="ETC">기타</option>
            </select>
          </Col>
          <Col className="post-people">
            <label>모집 인원*</label>
            <div>
              <input
                type="number"
                placeholder="현재 인원"
                {...register('numberPeople', {
                  required: true,
                })}
              />
              <span>/</span>
              <input
                type="number"
                placeholder="전체 인원"
                {...register('currentNumberPeople', {
                  required: true,
                })}
              />
            </div>
          </Col>
        </Row>

        <Row>
          <Col>
            <label>마감 기한*</label>
            <input
              type="date"
              {...register('deadline', {
                required: true,
              })}
            />
          </Col>
          <Col>
            <label>연락 방법*</label>
            <input
              type="text"
              placeholder="예: 연락처, URL(오픈카톡방, 구글폼), ..."
              autoComplete="off"
              {...register('contactMethod', {
                required: true,
              })}
            />
          </Col>
        </Row>

        <Row>
          <label>
            <h3>내용*</h3>
          </label>
          <ContentArea
            placeholder="내용을 입력해 주세요"
            {...register('content', {
              required: true,
            })}
          />
        </Row>

        <Row>
          <label>사진 첨부(선택)</label>
        </Row>

        <Button type="submit" disabled={!isValid}>
          게시글 등록 HeyYo :)
        </Button>
      </PostForm>
    </article>
  );
};

export default Post;

const PostForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1024px;
  margin: 0 auto;
  color: #222;
  h2 {
    display: inline-block;
    border-bottom: 3px solid #f2a30f;
    font-family: 'LeferiPoint-BlackObliqueA' !important;
    margin: 30px auto 40px;
  }
  input {
    width: 80px;
  }
  button {
    width: 80%;
  }
`;

const Row = styled.ul`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0 40px;
  width: 80%;
  margin: 0 auto 30px;
  select,
  input,
  textarea {
    width: 100%;
    margin: 5px 0;
    padding: 15px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
    transition: all 0.2s ease-in-out;
    &:focus {
      border: 1px solid #222;
      background: #fafafa;
    }
  }
  select {
    cursor: pointer;
    option {
      padding: 10px;
      font-size: 18px;
    }
  }
`;

const Col = styled.li`
  flex: 1;
  min-width: 250px;
  &.post-people {
    display: flex;
    flex-direction: column;
    div {
      display: flex;
      align-items: center;
      padding: 0 20px;
      gap: 0 20px;
      input {
        text-align: center;
      }
    }
  }
`;

const ContentArea = styled.textarea`
  height: 100px;
  resize: none;
`;
