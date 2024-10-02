import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Alert,
  Image,
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
import AIcon from 'react-native-vector-icons/AntDesign';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { registerAction } from '../../store/action';
import { LoginByGoogleAction } from '../../store/action/loginAction';

const UserEntry = ({ navigation }) => {
  const dispatch = useDispatch()
  const loading = useSelector((state) => state.login.loading);
  const [activetab, setActivetab] = useState('Signin');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleActiveTab = (tabname) => {
    setActivetab(tabname);
  };

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const userInfo = await GoogleSignin.signIn();
      if (userInfo) {
        console.log(userInfo,'iuiuiu')
        // const payload = {
        //   FirstName: userInfo.user.givenName,
        //   LastName: userInfo.user.familyName,
        //   EmailId: userInfo.user.email,
        //   MobNum: '',
        //   Password: 'na',
        //   UserType: 1,
        // };
      
        const registerValue = {
          idToken: userInfo.idToken
        };
        dispatch(LoginByGoogleAction(registerValue, navigation, handleActiveTab));
        // console.log(payload, 'pylload');
        // dispatch(SignupAction(payload, navigation));
      }
      // console.log(userInfo);
      // setUser(userInfo);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // User canceled the sign-in
        // Alert.alert('Google Sign-In Cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // Sign-in is in progress already
        Alert.alert('Google Sign-In In Progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // Play Services not available or outdated
        Alert.alert('Play Services Not Available');
      } else {
        // Other error
        console.log(error);
        Alert.alert('Error', error.message);
      }
    }
  };


  return (
    <>
      {loading && <AppLoader />}
      <MainLayout>
        <View
          style={styles.backimage}
          resizeMode="stretch"
          source={require('../../assets/images/loginscreen.png')}>
            {/* <View style={styles.circle}></View> */}
          <AText textStyle={styles.appNameTextStyle} title>
            {APP_NAME}
          </AText>
          <AIcon name="arrowleft" style={{position:'absolute',top:10,left:23,}} onPress={() => navigation.goBack()} size={22} />
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
                      borderColor: APP_PRIMARY_COLOR+'20',
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
            {
              !showForgotPassword?
            <TouchableOpacity style={styles.google} onPress={signIn}>
             <Image
              source={require('../../assets/images/google.png')}
              style={{width: 20, height: 20}}
            /> 
            <AText
              medium
              style={{color: 'black', marginLeft: 5}}
              fonts={FontStyle.fontRegular}>
              Continue with Google
            </AText>
          </TouchableOpacity>:null}
          </View>
          <View style={styles.marginBottom} />
        </View>
      </MainLayout>
    </>
  );
};

const styles = StyleSheet.create({
  google: {
    flexDirection: 'row',
    // paddingVertical: 10,
    height: 40,
    borderWidth: 0.5,
    borderColor: '#707070',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  circle: {
    position:'absolute',
    width: '100%',  // Set the width of the circle
    height: 400, // Set the height of the circle (equal to width to make it a circle)
    borderRadius: 180, // Half of width/height to make it a perfect circle
    backgroundColor: '#000', // Set your desired color
    top: -170, // Adjust this to make the circle hang off the top
  },
  backimage: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
  },
  appNameTextStyle: {
    textAlign: 'center',
    color: '#000',
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
