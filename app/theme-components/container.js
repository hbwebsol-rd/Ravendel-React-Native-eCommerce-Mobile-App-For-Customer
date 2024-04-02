import React from 'react';
import styled from 'styled-components/native';
import { APP_SECONDARY_COLOR } from '../utils/config';
import Colors from '../constants/Colors';
import { RefreshControl } from 'react-native';

const AContainer = styled.ScrollView`
  flex: 1;
  background-color: ${Colors.whiteColor};
  padding: ${(props) => (props.withoutPadding ? '0' : '10px')};
`;

const ContainerStyle = (props) => {
  return (
    <AContainer
      refreshControl={
        props.onRefresh && (
          <RefreshControl
            refreshing={props.refreshing}
            onRefresh={props.onRefresh}
          />
        )
      }
      {...props}>
      {props.children}
    </AContainer>
  );
};

export default ContainerStyle;
