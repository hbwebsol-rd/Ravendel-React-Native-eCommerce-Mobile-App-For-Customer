import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import styled from 'styled-components/native';
import { APP_PRIMARY_COLOR, FontStyle } from '../utils/config';
import AText from './text';

const AButton = styled.TouchableOpacity`
  letter-spacing: 0.5px;
  color: ${(props) => props.color ?? '#fff'};
  background-color: ${(props) => props.bgColor ?? APP_PRIMARY_COLOR};
  border: 1px solid ${(props) => props.borderColor ?? APP_PRIMARY_COLOR};
  border-radius: ${(props) => (props.round ? '25px' : '3px')};
  min-width: ${(props) => (props.width ? props.width : '50px')};
  text-align: center;
  margin-bottom: ${(props) => props.mb ?? '0px'};
  margin-top: ${(props) => props.mt ?? '0px'};
  margin-left: ${(props) => props.ml ?? '0px'};
  margin-right: ${(props) => props.mr ?? '0px'};
  ${({ large, medium, small, extrasmall, extramedium, minor }) => {
    switch (true) {
      case large:
        return `font-size: 18px; padding: 18px 24px`;
      case medium:
        return `font-size: 16px; padding: 14px 18px`;
      case extramedium:
        return `font-size: 16px; padding: 8px 20px`;
      case small:
        return `font-size: 10px; padding: 5px 10px`;
      case extrasmall:
        return `font-size: 7px; padding: 3px 7px`;
      case minor:
        return `padding: 2px 5px`;
      default:
        return `font-size: 14px; padding: 10px 15px`;
    }
  }};
`;
const ButtonStyle = ({ ...props }) => {
  const fontprops = {};
  fontprops.uppercase = props.uppercase;
  fontprops.center = props.center;
  fontprops.xtrasmall = props.xtrasmall;
  fontprops.minor = props.minor;
  return (
    <AButton activeOpacity={props.activeopac ?? 0.7} {...props}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {props.icon ? (
          <Icon
            style={{ marginRight: props.marginRight ?? 0 }}
            name={props.icon}
            size={props.iconSize ?? 12}
            color={props.iconColor ?? 'black'}
          />
        ) : null}
        <AText
          color={props.color ?? '#fff'}
          fonts={props.semi ? FontStyle.semiBold : FontStyle.fontBold}
          {...fontprops}>
          {props.title}
        </AText>
      </View>
    </AButton>
  );
};

export default ButtonStyle;
