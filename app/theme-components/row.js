import React from 'react';
import styled from 'styled-components/native';

const ARow = styled.View`
  position: ${(props) => props.position ?? 'static'};
  display: flex;
  width: ${(props) => props.width ?? 'auto'};
  background-color: ${(props) => props.bgColor ?? 'none'};
  flex-direction: ${(props) => (props.row ? 'row' : 'column')};
  flex-wrap: ${(props) => (props.wrap ? 'wrap' : 'nowrap')};
  height: ${(props) => props.height ?? 'auto'};

  border-top-right-radius: ${(props) => props.btrr ?? '0px'};
  border-top-left-radius: ${(props) => props.btlr ?? '0px'};
  border-bottom-left-radius: ${(props) => props.bblr ?? '0px'};
  border-bottom-right-radius: ${(props) => props.bbrr ?? '0px'};
  top: ${(props) => props.top ?? 0};
  right: ${(props) => props.right ?? 0};
  bottom: ${(props) => props.bottom ?? 0};
  left: ${(props) => props.left ?? 0};
  z-index: ${(props) => props.zindex ?? 1};
${({ justifyContent }) => {
    switch (justifyContent) {
      case 'space-between':
        return `justify-content: space-between`;
      case 'space-evenly':
        return `justify-content: space-evenly`;
      case 'space-around':
        return `justify-content: space-around`;
      case 'center':
        return `justify-content: center`;
      case 'flex-end':
        return `justify-content: flex-end`;
      default:
        return `justify-content: flex-start`;
    }
  }};
${({ alignItems }) => {
    switch (alignItems) {
      case 'center':
        return `align-items: center`;
      case 'flex-end':
        return `align-items: flex-end`;
      default:
        return `align-items: flex-start`;
    }
  }};
  ${(props) => props.rowStyle}
`;

const ContainerStyle = ({ ...props }) => {
  return <ARow {...props}>{props.children}</ARow>;
};

export default ContainerStyle;
