import React from 'react';
import styled from 'styled-components/native';
import { Dimensions, Modal, View } from 'react-native';
import { AText } from '.';
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const AView = styled.View`
  flex: 1;
  height: ${windowHeight}px;
  width: ${windowWidth}px;
  background-color: 'rgba(0,0,0,0.6)';
  justify-content: center;
  align-items: center;
`;
const ALoader = styled.ActivityIndicator``;

const AppLoader = () => {
  return (
    <View
      style={{
        backgroundColor: 'white',
        flex: 1,
        position: 'absolute',
        top: 0,
        bottom: 0,
        zIndex: 11,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <AView>
        <ALoader size="large" color="#fff" />
        {/* <AText>Success is loading. Keep patience!!!</AText> */}
      </AView>
    </View>
  );
};

export default AppLoader;
