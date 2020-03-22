import styled from 'styled-components';

export const Container = styled.div`
  position: relative !important;
`;

export const Badge = styled.button`
  font-size: 20px !important;
  font-weight: 'bold' !important;
  color: '#989898' !important;
  background: none !important;
  border: 0 !important;
  position: relative !important;
`;

export const List = styled.div`
  position: absolute !important;
  display: flex !important;
  flex-direction: column !important;
  width: 100px !important;
  left: calc(50% - 50px) !important;
  top: calc(100% + 10px) !important;
  background: #f7f4f4 !important;
  border: 0.5px solid #eee !important;
  border-radius: 4px !important;
  padding: 15px 5px !important;
  display: ${props => (props.visible ? 'block' : 'none')} !important;

  &::before {
    content: '' !important;
    position: absolute !important;
    left: calc(50% - 20px) !important;
    top: -10px !important;
    width: 0 !important;
    height: 0px !important;
    border-left: 20px solid transparent !important;
    border-right: 20px solid transparent !important;
    border-bottom: 20px solid #f7f4f4 !important;
  }
`;

export const Item = styled.div`
  display: flex !important;
  align-items: center !important;
  justify-content: left !important;
  color: #464545 !important;
  border-bottom: 0.5px solid #e2e2e2 !important;
  padding-bottom: 5px !important;
  svg {
    margin-right: 5px !important;
  }
  & + div {
    margin-top: 10px !important;
  }
  & + div + div {
    margin-top: 10px !important;
    border-bottom: 0 !important;
    padding: 0 !important;
  }
`;
