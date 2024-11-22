import React from 'react';
import styled from 'styled-components/native';
import { APP_PRIMARY_COLOR, windowWidth } from '../utils/config';
const AText = styled.Text`
  letter-spacing: 0.5px;
  color: ${(props) => props.color ?? '#3a3a3a'};
  text-decoration-line: ${(props) =>
    props.underLine
      ? 'underline'
      : props.lineThrough
        ? 'line-through'
        : 'none'};
  font-family: ${(props) => props.fonts ?? 'SegoeUI'};
  ${({ center, right }) => {
    switch (true) {
      case center:
        return `text-align: center`;
      case right:
        return `text-align: right`;
      default:
        `text-align: left`;
    }
  }};
  ${({ uppercase, capitalize }) => {
    switch (true) {
      case uppercase:
        return `text-transform: uppercase`;
      case capitalize:
        return `text-transform: capitalize`;
      default:
        `text-transform: inherit`;
    }
  }};
  ${({
    jumbo,
    title,
    large,
    medium,
    small,
    xtrasmall,
    minor,
    semiminor,
    big,
    big1,
  }) => {
    switch (true) {
      case jumbo:
        if (windowWidth > 400) {
          return `font-size: 46px`;
        } else if (windowWidth > 300) {
          return `font-size: 38px`;
        } else if (windowWidth > 200) {
          return `font-size: 32px`;
        }
      case title:
        return `font-size: 27px`;
      case big:
        return `font-size: 24px`;
      case big1:
        return `font-size: 22px`;
      case large:
        return `font-size: 18px`;
      case medium:
        return `font-size: 16px`;
      case small:
        return `font-size: 12px`;
      case xtrasmall:
        return `font-size: 10px`;
      case semiminor:
        return `font-size: 9px`;
      case minor:
        return `font-size: 8px`;
      default:
        return `font-size: 14px`;
    }
  }};
  ${(props) => props.textStyle}
`;




const TextStyle = ({ ...props }) => {
  return (
    <AText numberOfLines={props.nol ?? null} {...props}>
      {props.children}
    </AText>
  );
};

export default TextStyle;
