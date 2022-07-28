import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { storage } from '../shared/firebase';
import { uploadBytes, ref, getDownloadURL } from 'firebase/storage';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import Button from '../components/Button';
import { MdAddPhotoAlternate } from 'react-icons/md';
import instance from '../shared/Request';

const Post = () => {
  const nickname = useSelector((state) => state.user.nickname);
  const postId = useParams()?.postId;
  const navigate = useNavigate();
  const [imgSrc, setImgSrc] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    setFocus,
    formState: { isValid },
  } = useForm({
    mode: 'all',
  });

  useEffect(() => {
    if (postId) {
      const setPost = async () => {
        const postInfo = await instance.get(`/api/post/${postId}`);

        if (postInfo.data.nickname !== nickname) {
          alert('수정 권한이 없습니다.');
          navigate(-1);
          return;
        }

        const data = postInfo.data;
        console.log(data);
        setValue('title', data.title);
        setValue('content', data.content);
        setValue('category', data.category);
        setValue('deadline', data.deadline.slice(0, 10));
        setValue('currentNumberPeople', data.currentNumberPeople);
        setValue('numberPeople', data.numberPeople);
        setValue('contactMethod', data.contactMethod);
        setImgSrc(data.imageUrl);
      };
      setPost();
      setFocus('title');
    }
  }, []);

  const previewImage = async (e) => {
    const image = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(image);

    return new Promise((resolve) => {
      reader.onload = () => {
        setImgSrc(reader.result);
        resolve();
      };
    });
  };

  const onSubmitPost = async (formData) => {
    if (
      parseInt(formData.currentNumberPeople) > parseInt(formData.numberPeople)
    ) {
      alert('현재인원이 모집인원보다 많을 수 없습니다.');
      setFocus('currentNumberPeople');
      return;
    }

    let imageUrl;
    if (formData.postImg.length > 0) {
      const uploadedFile = await uploadBytes(
        ref(storage, `images/${formData.postImg[0].name}`),
        formData.postImg[0],
      );
      imageUrl = await getDownloadURL(uploadedFile.ref);
    } else if (postId) {
      imageUrl = imgSrc;
    } else {
      imageUrl = '';
    }

    const newPost = {
      title: formData.title,
      content: formData.content,
      category: formData.category,
      deadline: formData.deadline,
      numberPeople: parseInt(formData.numberPeople),
      currentNumberPeople: parseInt(formData.currentNumberPeople),
      contactMethod: formData.contactMethod,
      imageUrl,
    };
    console.log('새 게시글', newPost);

    if (!postId) {
      try {
        const res = await instance.post('/api/post', newPost);
        console.log(res);
        alert('게시글이 등록되었습니다!');
        navigate('/');
      } catch (e) {
        console.log(e);
      }
    } else {
      try {
        const res = await instance.put(`/api/post/${postId}`, newPost);
        console.log(res);
        alert('게시글이 수정되었습니다!');
        navigate(`/post/${postId}`);
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <article>
      <PostForm onSubmit={handleSubmit(onSubmitPost)}>
        <h2>게시글 {postId ? '수정' : '작성'}</h2>

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
            {postId ? (
              <select
                name="category"
                id="category"
                disabled
                {...register('category', {
                  required: true,
                })}
              >
                <option value="PURCHASE">공동구매</option>
                <option value="DELIVERY">배달</option>
                <option value="EXHIBITION">공연/전시회</option>
                <option value="ETC">기타</option>
              </select>
            ) : (
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
            )}
          </Col>
          <Col className="post-people">
            <label>모집 인원*</label>
            <div>
              <input
                type="number"
                placeholder="현재 인원"
                {...register('currentNumberPeople', {
                  required: true,
                })}
              />
              <span>/</span>
              <input
                type="number"
                placeholder="전체 인원"
                {...register('numberPeople', {
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
              min={new Date().toISOString().split('T')[0]}
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
            spellCheck="false"
            wrap="hard"
            {...register('content', {
              required: true,
            })}
          />
        </Row>

        <Row>
          <label>사진 첨부(선택)</label>
          <input
            id="postImg"
            type="file"
            accept="image/*"
            hidden
            {...register('postImg', {
              onChange: (e) => previewImage(e),
            })}
          />
        </Row>
        <Preview>
          <ImageLabel htmlFor="postImg">
            {imgSrc ? <img src={imgSrc} alt="" /> : <MdAddPhotoAlternate />}
          </ImageLabel>
        </Preview>

        <Button type="submit" disabled={!isValid}>
          게시글 {postId ? '수정' : '등록'} HeyYo :)
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
    margin: 60px auto 40px;
  }
  input {
    width: 80px;
  }
  button {
    margin: 60px 0 20px;
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
  select:disabled {
    cursor: default;
  }
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

const Preview = styled.div`
  display: flex;
  justify-content: center;
  width: 80%;
  max-width: 400px;
`;

const ImageLabel = styled.label`
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  aspect-ratio: 4 / 3;
  border-radius: 20px;
  background: #f1f1f1;
  cursor: pointer;
  svg {
    margin: 50px 100px;
    font-size: 90px;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
