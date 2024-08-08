import React from 'react';
import { AText, AButton, ARow, TextInput } from '../../theme-components';
import { useFormik } from 'formik';
import { loginValidationSchema } from '../checkout/validationSchema';
import { useDispatch } from 'react-redux';
import { LoginAction } from '../../store/action';
import { Keyboard, TouchableOpacity, View } from 'react-native';
import { StyleSheet } from 'react-native';
import NavigationConstants from '../../navigation/NavigationConstants';

const LoginScreen = ({ navigation, showForgotPassword }) => {
  const dispatch = useDispatch();
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginValidationSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      setSubmitting(false);
      sendValues(values);
    },
  });

  const sendValues = (values) => {
    Keyboard.dismiss();
    dispatch(LoginAction(values.email, values.password, navigation));
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
          <AText textStyle={styles.errorTextStyle} xtrasmall >
            {formik.errors.email}
          </AText>
        ) : null}
      </ARow>
      <ARow>
        <TextInput
          iconColor={'#9F9F9F'}
          placeholder={'Password'}
          onerror={false}
          secureTextEntry={true}
          icon={'eye-off'}
          value={formik.values.password}
          onchange={formik.handleChange('password')}
          hookuse
          StylesTextInput={styles.textInputStyle}
          placeholdercolor={'#ABA7A7'}
          inputBgColor="transparent"
        />
        {formik.errors.password && formik.touched.password ? (
          <AText textStyle={styles.errorTextStyle} xtrasmall>
            {formik.errors.password}
          </AText>
        ) : null}
      </ARow>
      <View
        style={styles.forgotPassContainer}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={{ marginTop: 5 }}
          onPress={() => showForgotPassword(true)}>
          <AText bold xtrasmall color={'#ABA7A7'}>
            Forgot password?
          </AText>
        </TouchableOpacity>
      </View>
      <AButton
        title={'Log in'}
        buttonStyle={styles.loginBtnStyle}
        onPress={formik.handleSubmit}
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
export default LoginScreen;
