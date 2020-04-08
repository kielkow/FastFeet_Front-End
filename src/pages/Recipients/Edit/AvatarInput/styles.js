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
      max-height: 160px;
      max-width: 400px;
      border-radius: 4px;
      border: 2px dashed #a28fd0;
      background: #eee;
      margin-top: 20px;
    }
    input {
      display: none;
    }
  }
`;
