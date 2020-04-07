import styled from 'styled-components';

export const Container = styled.div`
  align-self: center;
  margin-bottom: 30px;
  label {
    cursor: pointer;
    &:hover {
      opacity: 0.7;
    }
    img {
      height: 220px;
      width: 220px;
      border-radius: 50%;
      border: 2px dashed #a28fd0;
      background: #eee;
    }
    input {
      display: none;
    }
  }
`;
