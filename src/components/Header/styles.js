import styled from 'styled-components';
import { darken } from 'polished';

export const Container = styled.div`
  background: #fff;
  padding: 0 15px;
`;

export const Content = styled.div`
  height: 64px;
  max-width: 1350px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  nav {
    display: flex;
    align-items: center;
    img {
      width: 170px;
      height: 30px;
      margin-right: 20px;
      padding-right: 20px;
      border-right: 1px solid #eee;
    }
    a {
      font-weight: bold;
      color: #999;
      &:hover {
        color: ${darken(0.3, '#999')};
      }
      & + a {
        margin-left: 20px;
      }
    }
  }
  aside {
    display: flex;
    align-items: center;
  }
`;

export const Profile = styled.div`
  display: flex;
  margin-left: 20px;
  padding-left: 20px;
  border-left: 1px solid #eee;
  div {
    text-align: right;
    margin-right: 10px;
    strong {
      display: block;
      color: #333;
    }
    a {
      display: block;
      margin-top: 2px;
      font-size: 12px;
      color: #999;
    }
  }
  img {
    height: 32px;
    border-radius: 50%;
  }
`;
