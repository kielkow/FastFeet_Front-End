import styled from 'styled-components';
import { lighten, darken } from 'polished';

export const Container = styled.div`
  max-width: 800px;
  margin: 10px auto;
  display: flex;
  flex-direction: column;

  form {
    display: flex;
    flex-direction: column;
    padding: 20px;

    #content {
      display: flex;
      flex-direction: column;
      background: #fff;
      border-radius: 4px;
      padding: 20px;
      margin-top: 20px;
      div {
        display: flex;
        flex-direction: column;
        flex: 1;
        span {
          font-weight: bold;
          margin-bottom: 5px;
        }
        input {
          padding: 10px 10px;
          border-radius: 4px;
          border: 0.5px solid #eee;
        }
        & + div {
          margin-top: 20px;
        }
      }
    }

    header {
      display: flex;
      justify-content: space-between;
      strong {
        font-size: 24px;
        color: ${lighten(0.03, '#444444')};
      }
      div {
        display: flex;
        flex-direction: row;
        button {
          background: #50d250;
          color: #fff;
          padding: 7px 15px;
          border: 0;
          font-weight: bold;
          border-radius: 3px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          &:hover {
            background: ${darken(0.05, '#50d250')};
          }
          span {
            margin-top: 3px;
          }
        }
        a {
          background: #7d40e7;
          color: #fff;
          margin-right: 20px;
          padding: 5px 10px;
          border: 0;
          font-weight: bold;
          border-radius: 3px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          &:hover {
            background: ${darken(0.05, '#7d40e7')};
          }
        }
      }
    }
  }
`;
