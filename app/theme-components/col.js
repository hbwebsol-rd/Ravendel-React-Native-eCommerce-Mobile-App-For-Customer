import React from 'react';
import styled from 'styled-components/native';

var margin = 2;
//margin: ${margin / 2}%;
const ACol = styled.View`
  background-color: ${props => props.bgColor ?? 'transparent'};
  margin: ${props => props.margin ?? margin / 2 + '%'};
${({ col }) => {
    switch (col) {
      case 12:
        return `width: ${100 / 12 - margin}%;`;
      case 11:
        return `width: ${100 / 11 - margin}%;`;
      case 10:
        return `width: ${100 / 10 - margin}%;`;
      case 9:
        return `width: ${100 / 9 - margin}%;`;
      case 8:
        return `width: ${100 / 8 - margin}%;`;
      case 7:
        return `width: ${100 / 7 - margin}%;`;
      case 6:
        return `width: ${100 / 6 - margin}%;`;
      case 5:
        return `width: ${100 / 5 - margin}%;`;
      case 4:
        return `width: ${100 / 4 - margin}%;`;
      case 3:
        return `width: ${100 / 3 - margin}%;`;
      case 2:
        return `width: ${100 / 2 - margin}%;`;
      case 1:
        return `width: ${100 / 1 - margin}%;`;
      default:
        return `width: 100%`;
    }
  }}
`;

const ColStyle = ({ ...props }) => {
  return <ACol {...props}>{props.children}</ACol>;
};

export default ColStyle;
