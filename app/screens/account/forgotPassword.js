import React, { useState } from 'react';
import { AText, AButton, ARow, TextInput } from '../../theme-components';
import { useDispatch } from 'react-redux';
import { Keyboard, TouchableOpacity, View } from 'react-native';
import { StyleSheet } from 'react-native';
import { isEmpty } from '../../utils/helper';
import { ForgotPasswordAction } from '../../store/action/loginAction';

const ForgotPasswordScreen = ({ navigation, showForgotPassword }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')

  const handleSubmit = (values) => {
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    console.log('dasdads', regex.test(email))

    if (isEmpty(email)) {
      setEmailError('Please enter email')
      return
    } else if (!regex.test(email)) {
      console.log('dasdad2s')
      setEmailError('Please enter valid email')
      return
    }
    Keyboard.dismiss();
    dispatch(ForgotPasswordAction(email));
  };

  return (
    <>
      <ARow rowStyle={styles.rowStyle}>
        <TextInput
          onchange={(val) => setEmail(val)}
          onerror={false}
          placeholder={'Enter Email'}
          value={email}
          placeholdercolor={'#ABA7A7'}
          StylesTextInput={styles.textInputStyle}
          inputBgColor="transparent"
        />
        {emailError ? (
          <AText textStyle={styles.errorTextStyle} xtrasmall >
            {emailError}
          </AText>
        ) : null}
      </ARow>
      <View
        style={styles.forgotPassContainer}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={{ marginTop: 5 }}
          onPress={() => showForgotPassword(false)}>
          <AText bold xtrasmall color={'#ABA7A7'}>
            Back to Login
          </AText>
        </TouchableOpacity>
      </View>
      <AButton
        title={'Sumbit'}
        buttonStyle={styles.loginBtnStyle}
        onPress={() => handleSubmit()}
      />
    </>
  );
};
const styles = StyleSheet.create({
  textInputViewStyle: { flexDirection: 'row', marginTop: 10, alignItems: 'center', justifyContent: 'center', },
  textInputStyle: { borderWidth: 0, padding: 0, paddingBottom: 10, color: '#000', },
  forgotPassContainer: { flexDirection: 'row', justifyContent: 'flex-end', },
  loginBtnStyle: { marginTop: 24, borderRadius: 30 },
  errorTextStyle: { marginLeft: 10, color: 'red' },
  rowStyle: { marginBottom: 10, marginTop: 30 }
})
export default ForgotPasswordScreen;
