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

const AccountScreen = ({ navigation }) => {
  const { isLoggin, userDetails } = useSelector((state) => state.customer);
  const dispatch = useDispatch();

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
              style={{ alignItems: 'center', marginTop: 60, marginBottom: 25 }}>
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
            <View style={styles.container}>
              <TouchableOpacity
                style={styles.optionstyle}
                onPress={() =>
                  navigation.navigate(NavigationConstants.EDIT_PROFILE_SCREEN, {
                    initial: false,
                  })
                }>
                <ListIcon>
                  <Icon name="pencil" color={GREYTEXT} size={18} />
                </ListIcon>
                <ListTitleWrapper>
                  <AText
                    medium
                    fonts={FontStyle.semiBold}
                    color={GREYTEXT}
                    mb="5px">
                    Edit Information
                  </AText>
                  <FIcon name="chevron-right" size={15} />
                  {/* <AText small>Track, Cancel and return orders</AText> */}
                </ListTitleWrapper>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.optionstyle}
                onPress={() =>
                  navigation.navigate(
                    NavigationConstants.SAVED_ADDRESS_SCREEN,
                    {
                      initial: false,
                    },
                  )
                }>
                <ListIcon>
                  <Icon name="map-marker" color={GREYTEXT} size={18} />
                </ListIcon>
                <ListTitleWrapper>
                  <AText
                    medium
                    fonts={FontStyle.semiBold}
                    color={GREYTEXT}
                    mb="5px">
                    Shopping Address
                  </AText>
                  <FIcon name="chevron-right" size={15} />
                  {/* <AText small>Update your personal information</AText> */}
                </ListTitleWrapper>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.optionstyle}
                onPress={() =>
                  navigation.navigate(
                    NavigationConstants.CHANGE_PASSWORD_SCREEN,
                    {
                      initial: false,
                    },
                  )
                }>
                <ListIcon>
                  <Icon name="heart-o" color={GREYTEXT} size={18} />
                </ListIcon>
                <ListTitleWrapper>
                  <AText
                    medium
                    fonts={FontStyle.semiBold}
                    color={GREYTEXT}
                    mb="5px">
                    My Wishlist
                  </AText>
                  <FIcon name="chevron-right" size={15} />
                </ListTitleWrapper>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionstyle}
                onPress={() =>
                  navigation.navigate(NavigationConstants.ORDERS_SCREEN, {
                    initial: false,
                  })
                }>
                <ListIcon>
                  <FIcon name="trello" color={GREYTEXT} size={18} />
                </ListIcon>
                <ListTitleWrapper>
                  <AText
                    medium
                    fonts={FontStyle.semiBold}
                    color={GREYTEXT}
                    mb="5px">
                    My Orders
                  </AText>
                  <FIcon name="chevron-right" size={15} />
                </ListTitleWrapper>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.optionstyle}
                onPress={() =>
                  navigation.navigate(
                    NavigationConstants.SAVED_ADDRESS_SCREEN,
                    {
                      initial: false,
                    },
                  )
                }>
                <ListIcon>
                  <Icon name="bell-o" color={GREYTEXT} size={18} />
                </ListIcon>
                <ListTitleWrapper>
                  <AText
                    medium
                    fonts={FontStyle.semiBold}
                    color={GREYTEXT}
                    mb="5px">
                    Notification
                  </AText>
                  <FIcon name="chevron-right" size={15} />
                </ListTitleWrapper>
              </TouchableOpacity>
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
  container: {
    borderRadius: 10,
    elevation: 3,
    padding: 10,
    marginHorizontal: 30,
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
    paddingVertical: 15,
    borderWidth: 0,
    borderBottomWidth: 0.3,
    borderRadius: 10,
    marginBottom: 10,
    borderColor: 'grey',
  },
});
export default AccountScreen;
