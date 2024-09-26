import React, { useState } from 'react';
import { AText, AppLoader, MainLayout } from '../../theme-components';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import LoginScreen from './login';
import SignupScreen from './signup';
import {
  APP_PRIMARY_COLOR,
  APP_SECONDARY_COLOR,
  FontStyle,
  windowHeight,
} from '../../utils/config';
import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import { Splash } from '..';
const Tab = createMaterialTopTabNavigator();

const UserEntry = ({ navigation }) => {
  // States and Variables
  const loading = useSelector((state) => state.login.loading);
  const [activetab, setActivetab] = useState('Login');

  // Custom Function
  const handleActiveTab = (tabname) => {
    tabname === 'Login' ? setActivetab('Login') : setActivetab('Signup');
  };

  if (loading) {
    return <Splash />;
  }
  return (
    <MainLayout>
      <ImageBackground
        style={styles.backimage}
        resizeMode="stretch"
        source={require('../../assets/images/loginscreen.png')}>
        <AText center color="white" mb="50px" title fonts={FontStyle.fontBold}>
          Ravendel
        </AText>
        <View style={styles.logincard}>
          <View style={styles.singupheader}>
            <TouchableOpacity
              onPress={() => handleActiveTab('Login')}
              style={{
                ...styles.login,
                backgroundColor:
                  activetab === 'Login' ? APP_PRIMARY_COLOR : 'white',
              }}>
              <AText
                color={activetab === 'Login' ? 'white' : APP_PRIMARY_COLOR}
                center
                fonts={FontStyle.fontBold}>
                Log in
              </AText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleActiveTab('Signup')}
              style={{
                ...styles.signup,
                backgroundColor:
                  activetab === 'Signup' ? APP_PRIMARY_COLOR : 'white',
              }}>
              <AText
                color={activetab === 'Signup' ? 'white' : APP_PRIMARY_COLOR}
                center
                fonts={FontStyle.fontBold}>
                Sign up
              </AText>
            </TouchableOpacity>
          </View>
          {activetab === 'Login' ? (
            <LoginScreen navigation={navigation} />
          ) : (
            <SignupScreen
              handleActiveTab={handleActiveTab}
              navigation={navigation}
            />
          )}
        </View>
        <View style={{ marginBottom: 20 }}></View>
      </ImageBackground>
    </MainLayout>
  );
};
const styles = StyleSheet.create({
  backimage: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
  },
  logincard: {
    backgroundColor: 'white',
    // marginTop: windowHeight > 750 ? 70 : 70,
    paddingTop: windowHeight > 850 ? 119 : windowHeight > 750 ? 80 : 60,
    paddingHorizontal: 40,
    marginHorizontal: 30,
    paddingBottom: windowHeight > 850 ? 120 : 30,
    borderRadius: 15,
    elevation: 3,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.5,
    shadowRadius: 1.41,
    shadowColor: APP_PRIMARY_COLOR,
  },
  singupheader: {
    flexDirection: 'row',
    marginHorizontal: 30,
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 18,
    borderColor: APP_SECONDARY_COLOR,
  },
  login: {
    width: '50%',
    height: '100%',
    padding: 10,
    borderRadius: 20,
  },
  signup: {
    width: '50%',
    height: '100%',
    padding: 10,
    borderRadius: 20,
  },
});

export default UserEntry;
