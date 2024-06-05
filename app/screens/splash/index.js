import { StatusBar, StyleSheet, Image, ImageBackground } from 'react-native';
import React from 'react';
import splash from '../../assets/images/welcomescreen.png';
import logo from '../../assets/images/ravendel.png';
import Colors from '../../constants/Colors';

const SplashScreen = () => {
  return (
    <>
      <StatusBar hidden={false} backgroundColor={Colors.darkPrimaryColor} />
      <ImageBackground source={splash} style={styles.container}>
        <Image source={logo} style={styles.imageStyle} />
      </ImageBackground>
    </>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  imageStyle: {
    width: '100%',
    width: 252,
    height: 42,
    alignSelf: 'center',
    resizeMode: 'contain',
  },

  logo: {
    position: 'absolute',
    // width: 118,
    // height: 96,
    bottom: 0,
    resizeMode: 'contain',
  },
});
