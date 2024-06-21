import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  AButton,
  AHeader,
  BackHeader,
  TextInput,
  MainLayout,
} from '../../theme-components';
import { isEmpty } from '../../utils/helper';
import { changePasswordAction } from '../../store/action';
import { ALERT_ERROR } from '../../store/reducers/alert';
import { StyleSheet, View } from 'react-native';
import Colors from '../../constants/Colors';

const ChangePasswordScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.customer.userDetails);
  const [userDetails, setuserDetails] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });
  useEffect(() => {
    if (!isEmpty(userData)) {
      var userDetailObject = {
        old_password: '',
        new_password: '',
        confirm_password: '',
      };
      setuserDetails(userDetailObject);
    }
  }, [userData]);

  const profileUpdate = () => {
    var Error_msg = '';
    if (isEmpty(userDetails.old_password)) {
      Error_msg = "Old password can't be empty";
    }
    if (isEmpty(userDetails.new_password) && isEmpty(Error_msg)) {
      Error_msg = "New password can't be empty";
    }
    if (
      userDetails.new_password !== userDetails.confirm_password &&
      isEmpty(Error_msg)
    ) {
      Error_msg = "Password doesn't match";
    }
    if (!isEmpty(Error_msg)) {
      dispatch({
        type: ALERT_ERROR,
        payload: Error_msg,
      });
      return;
    }
    var profileUpdateObject = {
      id: userData._id,
      oldPassword: userDetails.old_password,
      newPassword: userDetails.new_password,
    };
    dispatch(changePasswordAction(profileUpdateObject, navigation));
  };
  return (
    <MainLayout style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <BackHeader navigation={navigation} name="Change Password" back />
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
        }}>
        <View style={styles.container}>
          <TextInput
            placeholder="Old Password"
            value={userDetails.old_password}
            secureTextEntry={true}
            onchange={(text) =>
              setuserDetails({
                ...userDetails,
                old_password: text,
              })
            }
            hookuse
            iconColor={'#9F9F9F'}
            icon={'eye-off'}
            color={'#000'}
            mt={10}
            padding={0}
            bw={0}
            pb={10}
            onerror={false}
            placeholdercolor={'#ABA7A7'}
            inputBgColor="transparent"
          />
          <TextInput
            placeholder="New Password"
            maxLength={10}
            value={userDetails.new_password}
            secureTextEntry={true}
            onchange={(text) =>
              setuserDetails({
                ...userDetails,
                new_password: text,
              })
            }
            hookuse
            iconColor={'#9F9F9F'}
            icon={'eye-off'}
            color={'#000'}
            mt={10}
            padding={0}
            bw={0}
            pb={10}
            onerror={false}
            placeholdercolor={'#ABA7A7'}
            inputBgColor="transparent"
          />
          <TextInput
            placeholder="Confirm Password"
            value={userDetails.confirm_password}
            secureTextEntry={true}
            maxLength={10}
            onchange={(text) =>
              setuserDetails({
                ...userDetails,
                confirm_password: text,
              })
            }
            hookuse
            iconColor={'#9F9F9F'}
            icon={'eye-off'}
            color={'#000'}
            mt={10}
            padding={0}
            bw={0}
            pb={10}
            onerror={false}
            placeholdercolor={'#ABA7A7'}
            inputBgColor="transparent"
          />
          <AButton
            onPress={() => {
              profileUpdate();
            }}
            mt={'20px'}
            title="Submit"
          />
        </View>
      </View>
    </MainLayout>
  );
};

const TextInputArea = styled.TextInput`
  margin: 5px;
  border-color: gray;
  background: #e7e7e7;
  width: 90%;
  margin-bottom: 10px;
  border-radius: 5px;
  align-self: center;
  padding: 9px;
`;
const ItemWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 100px;
  margin-bottom: 10px;
  border-radius: 10px;
  //   background: #f7f7f7;
  overflow: hidden;
  position: relative;
  //   border: 1px solid #f7f7f7;
  box-shadow: 0 0 5px #eee;
  elevation: 1;
`;

const ItemDescription = styled.View`
  flex: 1;
  padding: 10px;
  background: #fff;
`;
const styles = StyleSheet.create({
  container: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    borderRadius: 10,
    paddingHorizontal: 40,
    paddingBottom: 30,
    marginHorizontal: 30,
    marginTop: 25,
    paddingTop: 30,
    //   height: 50%,
    justifyContent: 'center',
    width: '90%',
    alignSelf: 'center',
    backgroundColor: 'white',
  },
});
export default ChangePasswordScreen;
