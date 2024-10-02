import React, {useState} from 'react';
import {AText, AButton, ARow, TextInput} from '../../theme-components';
import {useDispatch} from 'react-redux';
import {Keyboard, TouchableOpacity, View} from 'react-native';
import {StyleSheet} from 'react-native';
import {isEmpty} from '../../utils/helper';
import {ForgotPasswordAction} from '../../store/action/loginAction';
import {FontStyle} from '../../utils/config';
import {forgotPasswordValidationSchema} from '../checkout/validationSchema';
import {useFormik} from 'formik';

const ForgotPasswordScreen = ({navigation, showForgotPassword}) => {
  const dispatch = useDispatch();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: '',
    },
    validationSchema: forgotPasswordValidationSchema,
    onSubmit: (values, {setSubmitting, resetForm}) => {
      setSubmitting(false);
      sendValues(values);
    },
  });

  const sendValues = values => {
    Keyboard.dismiss();
    dispatch(ForgotPasswordAction(values.email,showForgotPassword));
  };

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleSubmit = values => {
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    if (isEmpty(email)) {
      setEmailError('Please enter email');
      return;
    } else if (!regex.test(email)) {
      setEmailError('Please enter valid email');
      return;
    }
    Keyboard.dismiss();
    dispatch(ForgotPasswordAction(email,navigation));
  };

  return (
    <>
      <ARow rowStyle={styles.rowStyle}>
        <TextInput
          onchange={formik.handleChange('email')}
          onerror={false}
          placeholder={'Email'}
          value={formik.values.email}
          placeholdercolor={'#ABA7A7'}
          StylesTextInput={styles.textInputStyle}
          inputBgColor="transparent"
        />
        {formik.errors.email && formik.touched.email ? (
          <AText textStyle={styles.errorTextStyle} xtrasmall>
            {formik.errors.email}
          </AText>
        ) : null}
      </ARow>
      <View style={styles.forgotPassContainer}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={{marginTop: 5}}
          onPress={() => showForgotPassword(false)}>
          <AText
            style={{fontFamily: FontStyle.fontBold}}
            xtrasmall
            color={'#ABA7A7'}>
            Back to Signin
          </AText>
        </TouchableOpacity>
      </View>
      <AButton
        title={'Submit'}
        buttonStyle={styles.loginBtnStyle}
        onPress={formik.handleSubmit}
      />
    </>
  );
};
const styles = StyleSheet.create({
  textInputViewStyle: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInputStyle: {
    borderWidth: 0,
    padding: 0,
    paddingBottom: 10,
    color: '#000',
  },
  forgotPassContainer: {flexDirection: 'row', justifyContent: 'flex-end'},
  loginBtnStyle: {marginTop: 24, borderRadius: 30},
  errorTextStyle: {marginLeft: 10, color: 'red'},
  rowStyle: {marginBottom: 10, marginTop: 30},
});
export default ForgotPasswordScreen;
