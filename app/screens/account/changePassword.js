import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { AButton, AHeader, BackHeader } from '../../theme-components';
import { isEmpty } from '../../utils/helper';
import { changePasswordAction } from '../../store/action';
import { ALERT_ERROR } from '../../store/reducers/alert';
import { View } from 'react-native';
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
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <BackHeader navigation={navigation} name="Change Password" back />
      <ItemWrapper>
        <ItemDescription>
          <TextInputArea
            placeholder="Old Password"
            value={userDetails.old_password}
            secureTextEntry={true}
            onChangeText={(text) =>
              setuserDetails({
                ...userDetails,
                old_password: text,
              })
            }
          />
          <TextInputArea
            placeholder="New Password"
            maxLength={10}
            value={userDetails.new_password}
            secureTextEntry={true}
            onChangeText={(text) =>
              setuserDetails({
                ...userDetails,
                new_password: text,
              })
            }
          />
          <TextInputArea
            placeholder="Confirm Password"
            value={userDetails.confirm_password}
            secureTextEntry={true}
            maxLength={10}
            onChangeText={(text) =>
              setuserDetails({
                ...userDetails,
                confirm_password: text,
              })
            }
          />
          <AButton
            onPress={() => {
              profileUpdate();
            }}
            title="Submit"
          />
        </ItemDescription>
      </ItemWrapper>
    </View>
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

export default ChangePasswordScreen;
