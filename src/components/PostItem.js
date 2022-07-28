import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { TbFaceId } from 'react-icons/tb';
import { AiOutlineEye } from 'react-icons/ai';
import { FaRegComment } from 'react-icons/fa';

const PostItem = ({ postInfo, now }) => {
  const regex = /(http(s))?:\/\/([a-z0-9-]+\.)+[a-z0-9]{2,4}.*$/;
  const postCategory = useSelector((state) => state.category);

  const getIsExpired = () => {
    let postDeadline = new Date(postInfo.deadline);
    postDeadline.setHours(0);
    postDeadline.setMinutes(0);
    postDeadline.setSeconds(0);
    postDeadline = postDeadline.setHours(postDeadline.getHours() + 24);
    return postDeadline < now;
  };

  return (
    <PostItemContainer key={postInfo.id} expired={getIsExpired()}>
      <Link to={`/post/${postInfo.id}`}>
        <PostTitle>
          <em>
            {postCategory[postInfo.category][0]}&nbsp;
            <span>
              ( {postInfo.currentNumberPeople} / {postInfo.numberPeople} )
            </span>
          </em>
          <strong>{postInfo.title}</strong>
          <p className="deadline">
            ~ {new Date(postInfo.deadline).toLocaleDateString()}
          </p>
        </PostTitle>
        {postInfo.imageUrl && regex.test(postInfo.imageUrl) ? (
          <Image src={postInfo.imageUrl} alt="" />
        ) : (
          <Image src={postCategory[postInfo.category][1]} alt="" />
        )}
        <PostItemFooter>
          <em>
            <TbFaceId /> {postInfo.nickname}
          </em>
          <ViewAndCommentCount>
            <span>
              <AiOutlineEye /> {postInfo.viewCount}
            </span>
            <span>
              <FaRegComment /> {postInfo.commentCount}
            </span>
          </ViewAndCommentCount>
        </PostItemFooter>
      </Link>
    </PostItemContainer>
  );
};

export default PostItem;

PostItem.propTypes = {
  postInfo: PropTypes.object.isRequired,
  now: PropTypes.number,
};

const PostItemContainer = styled.li`
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 20px 15px;
  border: 3px solid #f2f2f2;
  border-radius: 20px;
  transition: all 0.2s ease-in-out;
  background: ${({ expired }) => (expired ? '#f1f1f1' : '#fff')};
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
    text-decoration: ${({ expired }) => (expired ? 'line-through' : 'none')};
  }
  p.deadline {
    margin-top: -5px;
    color: ${({ expired }) => (expired ? '#e5990d' : '#555')};
    font-size: 14px;
    font-weight: 600;
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
