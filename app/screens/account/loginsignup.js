import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { AText, AppLoader, MainLayout } from '../../theme-components';
import LoginScreen from './login';
import SignupScreen from './signup';
import {
  APP_NAME,
  APP_PRIMARY_COLOR,
  APP_SECONDARY_COLOR,
  FontStyle,
} from '../../utils/config';
import ForgotPasswordScreen from './forgotPassword';

const UserEntry = ({ navigation }) => {
  const loading = useSelector((state) => state.login.loading);
  const [activetab, setActivetab] = useState('Signin');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleActiveTab = (tabname) => {
    setActivetab(tabname);
  };

  return (
    <>
      {loading && <AppLoader />}
      <MainLayout>
        <ImageBackground
          style={styles.backimage}
          resizeMode="stretch"
          source={require('../../assets/images/loginscreen.png')}>
          <AText textStyle={styles.appNameTextStyle} title>
            {APP_NAME}
          </AText>
          <View style={[styles.logincard, { shadowColor: APP_PRIMARY_COLOR }]}>
            {showForgotPassword ? (
              <>
                <AText
                  textStyle={[
                    styles.forgotTextStyle,
                    { color: APP_PRIMARY_COLOR },
                  ]}
                  big1>
                  Forgot Password
                </AText>
                <AText
                  textStyle={[styles.forgotTextStyle, { color: '#c8c8c8 ' }]}
                  small>
                  Enter your email and we'll share a link to get back to your
                  account.
                </AText>
                <View>
                  <ForgotPasswordScreen
                    showForgotPassword={() => {
                      setShowForgotPassword(false);
                    }}
                    navigation={navigation}
                  />
                </View>
              </>
            ) : (
              <>
                <View
                  style={[
                    styles.singupheader,
                    {
                      borderColor: APP_SECONDARY_COLOR,
                    },
                  ]}>
                  {['Signin', 'Signup'].map((tab) => (
                    <TouchableOpacity
                      key={tab}
                      onPress={() => handleActiveTab(tab)}
                      style={[
                        styles.tab,
                        {
                          backgroundColor:
                            activetab === tab ? APP_PRIMARY_COLOR : 'white',
                        },
                      ]}>
                      <AText
                        color={activetab === tab ? 'white' : APP_PRIMARY_COLOR}
                        center
                        fonts={FontStyle.fontBold}>
                        {tab}
                      </AText>
                    </TouchableOpacity>
                  ))}
                </View>
                {activetab === 'Signin' ? (
                  <LoginScreen
                    showForgotPassword={() => {
                      setShowForgotPassword(true);
                    }}
                    navigation={navigation}
                  />
                ) : (
                  <SignupScreen
                    handleActiveTab={handleActiveTab}
                    navigation={navigation}
                  />
                )}
              </>
            )}
          </View>
          <View style={styles.marginBottom} />
        </ImageBackground>
      </MainLayout>
    </>
  );
};

const styles = StyleSheet.create({
  backimage: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
  },
  appNameTextStyle: {
    textAlign: 'center',
    color: '#fff',
    marginBottom: 50,
    fontFamily: FontStyle.fontBold,
  },
  logincard: {
    backgroundColor: 'white',
    paddingTop: 60,
    paddingHorizontal: 20,
    marginHorizontal: 30,
    paddingBottom: 30,
    borderRadius: 15,
    elevation: 3,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.5,
    shadowRadius: 1.41,
  },
  forgotTextStyle: {
    padding: 5,
    fontFamily: FontStyle.fontBold,
  },
  singupheader: {
    flexDirection: 'row',
    marginHorizontal: 50,
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 18,
  },
  tab: {
    width: '50%',
    height: '100%',
    padding: 10,
    borderRadius: 20,
  },
  marginBottom: {
    marginBottom: 70,
  },
});

export default UserEntry;
