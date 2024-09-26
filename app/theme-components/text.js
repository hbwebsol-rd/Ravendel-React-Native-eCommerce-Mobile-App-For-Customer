import React from 'react';
import styled from 'styled-components/native';
import { APP_PRIMARY_COLOR, windowWidth } from '../utils/config';
const AText = styled.Text`
  letter-spacing: 0.5px;
  color: ${(props) => props.color ?? '#3a3a3a'};
  margin-bottom: ${(props) => props.mb ?? '0px'};
  margin-top: ${(props) => props.mt ?? '0px'};
  margin-left: ${(props) => props.ml ?? '0px'};
  margin-right: ${(props) => props.mr ?? '0px'};
  padding-bottom: ${(props) => props.pb ?? '0px'};
  padding-top: ${(props) => props.pt ?? '0px'};
  padding-left: ${(props) => props.pl ?? '0px'};
  padding-right: ${(props) => props.pr ?? '0px'};
  border-bottom-width: ${(props) => props.bbw ?? '0px'};
  border-bottom-color: ${(props) => props.bbc ?? APP_PRIMARY_COLOR};
  text-decoration-line: ${(props) =>
    props.lineThrough ? 'underline' : 'none'};
  font-family: ${(props) => props.fonts ?? 'SegoeUI'};
  z-index: ${(props) => props.zindex ?? '1'};
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
  }}
  ${({ center, right }) => {
    switch (true) {
      case center:
        return `text-align: center`;
      case right:
        return `text-align: right`;
      default:
        `text-align: left`;
    }
  }}
    ${({ uppercase }) => {
    switch (true) {
      case uppercase:
        return `text-transform: uppercase`;
      default:
        `text-transform: inherit`;
    }
  }};
`;

const TextStyle = ({ ...props }) => {
  return (
    <AText numberOfLines={props.nol ?? null} {...props}>
      {props.children}
    </AText>
  );
};

export default TextStyle;
