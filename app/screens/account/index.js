import React from 'react';
import {
  AText,
  AContainer,
  AHeader,
  AButton,
  BackHeader,
  MainLayout,
} from '../../theme-components';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import { LogOut } from '../../store/reducers/loginReducer';
import {
  APP_NAME,
  APP_PRIMARY_COLOR,
  APP_SECONDARY_COLOR,
  BASEURL,
  FontStyle,
  VERSION,
} from '../../utils/config';
import AIcon from 'react-native-vector-icons/AntDesign';
import FIcon from 'react-native-vector-icons/Feather';
import {
  Alert,
  Image,
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { GREYTEXT } from '../../utils/config';
import Colors from '../../constants/Colors';
import Header from '../components/Header';
import Styles from '../../Theme';
import NavigationConstants from '../../navigation/NavigationConstants';
import editIcon from '../../assets/images/editIcon.png';
import changePasswordIcon from '../../assets/images/changePasswordIcon.png';
import locationIcon from '../../assets/images/locationIcon.png';
import orderIcon from '../../assets/images/orderIcon.png';
import { useMutation } from '@apollo/client';
import { DELETE_CUSTOMER } from '../../queries/customerQuery';

const AccountScreen = ({ navigation }) => {
  const { isLoggin, userDetails } = useSelector((state) => state.customer);
  console.log(userDetails, 'udd');
  const dispatch = useDispatch();
  const [deleteCustomer, { loadings, errors }] = useMutation(DELETE_CUSTOMER, {
    onError: (error) => {
      // Handle error as needed
      console.error('Error deleting attribute:', error);
    },
    onCompleted: (data) => {
      // Handle completion as needed.
      // GraphqlSuccess('Deleted successfully');
      console.log('Customer deleted successfully:', data);
      dispatch(LogOut(navigation));
    },
  });

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
      navigationScreen: `${BASEURL}/abouts/privacypolicy`,
      openLink: true,
    },
    {
      id: 2,
      name: 'Terms and Condition',
      navigationScreen: `${BASEURL}/abouts/terms&condition`,
      openLink: true,
    },
    {
      id: 3,
      name: 'Privacy Policy',
      navigationScreen: `${BASEURL}/abouts/privacypolicy`,
      openLink: true,
    },
    {
      id: 3,
      name: 'Contact US',
      navigationScreen: NavigationConstants.ContactUs,
      openLink: false,
    },
  ];

  const deleteUser = () => {
    Alert.alert('Logout', 'Are you sure you want to Delete this account?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () =>
          deleteCustomer({
            variables: { deleteCustomerId: userDetails._id },
          }),
      },
    ]);
  };

  const Logout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      { text: 'OK', onPress: () => dispatch(LogOut(navigation)) },
    ]);
  };
  return (
    <MainLayout style={Styles.mainContainer}>
      <Header navigation={navigation} title={'My Account'} />
      {isLoggin ? (
        <>
          <View style={styles.headerInfoContainer}>
            <Image source={require('../../assets/images/man.png')} />
            <AText textStyle={styles.headerFontStyle} big>
              {userDetails.firstName} {userDetails.lastName}
            </AText>
            <AText
              textStyle={[
                styles.subHeadingTextStyle,
                { color: APP_PRIMARY_COLOR },
              ]}>
              {userDetails.email}
            </AText>
            <AText
              textStyle={[
                styles.subHeadingTextStyle,
                { color: APP_PRIMARY_COLOR },
              ]}>
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
                  style={[styles.iconStyles, { tintColor: APP_PRIMARY_COLOR }]}
                />
                <AText textStyle={styles.containerTextStyle}>{item.name}</AText>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.container}>
            <AText
              medium
              textStyle={[styles.containerTextStyle, { color: '#000' }]}>
              Important Information
            </AText>
            {impInfoFieldArray.map((item) => (
              <TouchableOpacity
                onPress={() => {
                  item.navigationScreen && !item.openLink
                    ? navigation.navigate(item.navigationScreen, {
                        initial: false,
                      })
                    : Linking.openURL(item.navigationScreen);
                }}
                style={styles.infoBtnStyle}>
                <AText textStyle={styles.containerTextStyle}>{item.name}</AText>
                <FIcon color={'#8A8A8A'} name="chevron-right" size={15} />
              </TouchableOpacity>
            ))}
          </View>
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <AText large>Please sign in</AText>
        </View>
      )}
      <UserSection>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <AButton
            width={!isLoggin ? '100%' : '45%'}
            title={!isLoggin ? 'Sign In' : 'Sign Out'}
            style={styles.signOutStyle}
            onPress={() =>
              !isLoggin
                ? navigation.navigate(NavigationConstants.LOGIN_SIGNUP_SCREEN, {
                    initial: false,
                  })
                : Logout()
            }
          />
          {isLoggin ? (
            <AButton
              width={'45%'}
              bgColor={'#ff3b3b'}
              borderColor={'#ff3b3b'}
              title={'Delete Account'}
              style={styles.signOutStyle}
              onPress={() => deleteUser()}
            />
          ) : null}
        </View>
        <AppFooter>
          <AppInfo>
            <AText medium color={GREYTEXT}>
              {APP_NAME}{' '}
              <AText small color={GREYTEXT}>
                App Version: {VERSION}
              </AText>
            </AText>
          </AppInfo>
        </AppFooter>
      </UserSection>
    </MainLayout>
  );
};

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
const AppInfo = styled.View`
  justify-content: center;
  flex-direction: row;
  align-items: center;
`;
const styles = StyleSheet.create({
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerInfoContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 10,
  },
  headerFontStyle: {
    marginBottom: 5,
    color: '#000',
    textAlign: 'center',
    fontFamily: FontStyle.semiBold,
  },
  subHeadingTextStyle: {
    textAlign: 'center',
    marginBottom: 5,
    fontFamily: FontStyle.semiBold,
  },
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
  containerTextStyle: {
    marginLeft: 15,
    fontFamily: FontStyle.semiBold,
    color: '#8A8A8A',
  },
  iconStyles: {
    resizeMode: 'contain',
    width: 20,
    height: 20,
  },
  container: {
    paddingVertical: 16,
    marginHorizontal: 5,
    backgroundColor: 'white',
  },
  signOutStyle: { borderRadius: 25 },
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
  infoBtnStyle: {
    width: '95%',
    paddingVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
export default AccountScreen;
