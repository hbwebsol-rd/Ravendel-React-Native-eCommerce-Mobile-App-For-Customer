import React from 'react';
import {
  AText,
  AContainer,
  AHeader,
  AButton,
  BackHeader,
} from '../../theme-components';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import { LogOut } from '../../store/reducers/loginReducer';
import {
  APP_PRIMARY_COLOR,
  APP_SECONDARY_COLOR,
  FontStyle,
} from '../../utils/config';
import AIcon from 'react-native-vector-icons/AntDesign';
import FIcon from 'react-native-vector-icons/Feather';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { GREYTEXT } from '../../utils/config';
import Colors from '../../constants/Colors';
import Header from '../components/Header';
import Styles from '../../Theme';
import NavigationConstants from '../../navigation/NavigationConstants';
import editIcon from '../../assets/images/editIcon.png';
import changePasswordIcon from '../../assets/images/changePasswordIcon.png';
import locationIcon from '../../assets/images/locationIcon.png';
import orderIcon from '../../assets/images/orderIcon.png';

const AccountScreen = ({ navigation }) => {
  const { isLoggin, userDetails } = useSelector((state) => state.customer);
  const dispatch = useDispatch();
  const headerFieldArray = [
    {
      id: 1,
      name: 'Edit Information',
      iconName: editIcon,
      navigationScreen: NavigationConstants.EDIT_PROFILE_SCREEN,
    },
    {
      id: 2,
      name: 'My Addresses',
      iconName: locationIcon,
      navigationScreen: NavigationConstants.SAVED_ADDRESS_SCREEN,
    },
    {
      id: 3,
      name: 'My Orders',
      iconName: orderIcon,
      navigationScreen: NavigationConstants.ORDERS_SCREEN,
    },
    {
      id: 3,
      name: 'Change Password',
      iconName: changePasswordIcon,
      navigationScreen: NavigationConstants.CHANGE_PASSWORD_SCREEN,
    },
  ];
  const impInfoFieldArray = [
    {
      id: 1,
      name: 'Return and Refund Policy',
      navigationScreen: '',
    },
    {
      id: 2,
      name: 'Terms and Condition',
      navigationScreen: '',
    },
    {
      id: 3,
      name: 'Privacy Policy',
      navigationScreen: '',
    },
    {
      id: 3,
      name: 'Contact US',
      navigationScreen: '',
    },
  ];
  const Logout = () => {
    dispatch(LogOut(navigation));
  };
  return (
    <>
      <View style={Styles.mainContainer}>
        <Header navigation={navigation} title={'My Account'} />
        {isLoggin ? (
          <>
            <View
              style={{ alignItems: 'center', marginTop: 60, marginBottom: 10 }}>
              <Image source={require('../../assets/images/man.png')} />
              <AText
                mb="5px"
                big
                center
                fonts={FontStyle.semiBold}
                color="black">
                {userDetails.firstName} {userDetails.lastName}
              </AText>
              <AText
                mb="5px"
                center
                fonts={FontStyle.semiBold}
                color={APP_PRIMARY_COLOR}>
                {userDetails.email}
              </AText>
              <AText
                center
                fonts={FontStyle.semiBold}
                color={APP_PRIMARY_COLOR}>
                {userDetails.phone}
              </AText>
            </View>
            <View style={styles.headerContainer}>
              {headerFieldArray.map((item) => (
                <TouchableOpacity
                  style={styles.boxContainerBtnStyle}
                  onPress={() =>
                    navigation.navigate(item.navigationScreen, {
                      initial: false,
                    })
                  }>
                  <Image
                    source={item.iconName}
                    style={[
                      styles.iconStyles,
                      { tintColor: APP_PRIMARY_COLOR },
                    ]}
                  />
                  <AText small ml={15} fonts={FontStyle.semiBold}>
                    {item.name}
                  </AText>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.container}>
              <AText medium ml={'15px'} fonts={FontStyle.semiBold}>
                Important Information
              </AText>
              {impInfoFieldArray.map((item) => (
                <TouchableOpacity
                  style={{
                    width: '95%',
                    paddingVertical: 5,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <AText
                    color={'#8A8A8A'}
                    mediu
                    ml={15}
                    fonts={FontStyle.semiBold}>
                    {item.name}
                  </AText>
                  <FIcon color={'#8A8A8A'} name="chevron-right" size={15} />
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : (
          <AText mt="60px" large center bold>
            Please sign in
          </AText>
        )}
        <UserSection>
          {!isLoggin ? (
            <>
              <AButton
                title="Sign In"
                block
                round
                onPress={() =>
                  navigation.navigate(NavigationConstants.LOGIN_SIGNUP_SCREEN, {
                    initial: false,
                  })
                }
              />
            </>
          ) : (
            <AButton
              round
              title="Sign Out"
              onPress={() => {
                Logout();
              }}
            />
          )}
          <AppFooter>
            <AppInfo>
              <AText large heavy color={GREYTEXT} mr="5px">
                Ravendel
              </AText>
              <AText small color={GREYTEXT} ml="5px">
                App Version: 1.0
              </AText>
            </AppInfo>
          </AppFooter>
        </UserSection>
      </View>
    </>
  );
};

const InnerContainer = styled.View`
  padding: 10px;
  margin-horizontal: 30px;
  // flex: 1;
  background-color: white;
`;
const ListView = styled.TouchableOpacity`
  // flex: 1;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;
  padding: 10px 15px;
  background-color: pink;
  // background: #f7f7f7;
  border-width: 0px;
  border-bottom-width: 0.3px;
  border-radius: 10px;
  margin-bottom: 10px;
  border-color: grey;
`;
const ListIcon = styled.View`
  width: 40px;
`;
const ListTitleWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 80%;
  align-items: center;
`;
const UserSection = styled.View`
  position: absolute;
  bottom: 0;
  background: transparent;
  padding: 10px;
  justify-content: center;
  width: 100%;
`;
const AppFooter = styled.View`
  margin-top: 10px;
`;
const Diviver = styled.View`
  padding: 0.5px;
  background: #fff;
  margin-top: 10px;
  margin-bottom: 10px;
`;
const AppInfo = styled.View`
  justify-content: center;
  flex-direction: row;
  align-items: center;
`;
const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxContainerBtnStyle: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    width: '45%',
    margin: 3,
    borderColor: '#D4D4D4',
    paddingHorizontal: 12,
    paddingVertical: 15,
    borderRadius: 5,
    borderWidth: 0.9,
  },
  iconStyles: {
    resizeMode: 'contain',
    width: 20,
    height: 20,
  },
  container: {
    // borderRadius: 10,
    // elevation: 1,
    // padding: 10,
    paddingVertical: 16,
    marginHorizontal: 5,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    position: 'absolute',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    left: 0,
    right: 0,
    marginTop: 10,
    paddingHorizontal: 30,
    zIndex: 10,
  },
  optionstyle: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderWidth: 0,
    borderBottomWidth: 0.3,
    borderRadius: 10,
    marginBottom: 10,
    borderColor: 'grey',
  },
});
export default AccountScreen;
