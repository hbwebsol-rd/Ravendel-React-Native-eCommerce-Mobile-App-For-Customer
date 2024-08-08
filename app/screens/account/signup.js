import React, { useRef, useState } from 'react';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { Linking, TouchableOpacity, View, Platform } from 'react-native';
import PropTypes from 'prop-types';
import { Checkbox } from 'react-native-paper';
import { CountryPicker } from 'react-native-country-codes-picker';
import Styles from '../../Theme';
import { AText, AButton, TextInput } from '../../theme-components';
import { signupValidationSchema } from '../checkout/validationSchema';
import { registerAction } from '../../store/action';
import { BASEURL } from '../../utils/config';
import { create } from 'lodash';
import { StyleSheet } from 'react-native';

const SignupScreen = ({ navigation, handleActiveTab }) => {
  const dispatch = useDispatch();
  const textInputRef = useRef(null);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const fieldArray = [
    { id: 1, name: 'First Name', value: 'firstName', secureTextEntry: false },
    { id: 1, name: 'Last name', value: 'lastName', secureTextEntry: false },
    { id: 1, name: 'Email', value: 'email', secureTextEntry: false },
    { id: 1, name: 'Phone No.', value: 'mobile', secureTextEntry: false },
    { id: 1, name: 'Password', value: 'password', secureTextEntry: true },
    { id: 1, name: 'Confirm password', value: 'confirmPassword', secureTextEntry: true },
  ]
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      mobile: '',
      password: '',
      company: '',
      confirmPassword: '',
      policy: false,
    },
    validationSchema: signupValidationSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      setSubmitting(false);
      sendValues(values);
      resetForm();
    },
  });

  const openLink = () => {
    const url = `${BASEURL}/abouts/terms&condition`;
    Linking.openURL(url).catch(() => { });
  };

  const sendValues = (values) => {
    const registerValue = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
      phone: values.mobile,
    };
    dispatch(registerAction(registerValue, navigation, handleActiveTab));
  };
  return (
    <>
      {fieldArray.map(({ name, value, secureTextEntry }) =>
        <>
          <View style={styles.textInputViewStyle}>
            {value == 'mobile' ?
              <>
                <CountryPicker
                  show={showCountryPicker}
                  style={{
                    modal: {
                      height: 500,
                    },
                  }}
                  // when picker button press you will get the country object with dial code
                  pickerButtonOnPress={(item) => {
                    formik.setFieldValue('mobile', item.dial_code);
                    setShowCountryPicker(false);
                    if (textInputRef.current) {
                      // Focus on the input field if editable state changes to true
                      // setTimeout(() => {
                      textInputRef.current.focus();
                      // }, 100);
                    }
                  }}
                // showOnly={['UA', 'EN', 'IN', 'US', 'UA']}
                />

                <TextInput
                  textInputRef={textInputRef}
                  onfocus={() => {
                    setShowCountryPicker(true);
                  }}
                  keyboardtype={'numeric'}
                  onchange={formik.handleChange('mobile')}
                  onerror={false}
                  StylesTextInput={styles.textInputStyle}
                  placeholder={'Phone No.'}
                  value={formik.values.mobile}
                  placeholdercolor={'#ABA7A7'}
                  inputBgColor="transparent"
                />
              </>
              :
              <TextInput
                StylesTextInput={styles.textInputStyle}
                secureTextEntry={secureTextEntry}
                placeholder={`${name}`}
                onchange={(val) => formik.setFieldValue(value, val)}
                value={formik.values[value]}
                placeholdercolor="#ABA7A7"
              />
            }
          </View>
          {
            formik.touched[value] && formik.errors[value] && (
              <AText color="red" xtrasmall>
                {formik.errors[value]}
              </AText>
            )
          }
        </>

      )}
      <View style={styles.agreementContainer}>
        {Platform.OS === 'ios' && <View style={Styles.iosBox} />}
        <Checkbox
          status={formik.values.policy ? 'checked' : 'unchecked'}
          onPress={() => formik.setFieldValue('policy', !formik.values.policy)}
        />
        <TouchableOpacity activeOpacity={0.5} onPress={openLink}>
          <AText underLine small color="#9F9F9F">
            I agree to terms and policy
          </AText>
        </TouchableOpacity>
      </View>
      {formik.touched.policy && formik.errors.policy && (
        <AText color="red" xtrasmall>
          {formik.errors.policy}
        </AText>
      )}

      <AButton
        buttonStyle={styles.singupBtnStyle}
        onPress={formik.handleSubmit}
        title="Sign up"
      />
    </>
  );
};

SignupScreen.propTypes = {
  handleActiveTab: PropTypes.func,
};
const styles = StyleSheet.create({
  textInputViewStyle: { flexDirection: 'row', marginTop: 10, alignItems: 'center', justifyContent: 'center', },
  textInputStyle: { borderWidth: 0, padding: 0, paddingBottom: 10, color: '#000', },
  agreementContainer: { flexDirection: 'row', alignItems: 'center' },
  singupBtnStyle: { marginTop: 60, borderRadius: 30 }

})
export default SignupScreen;
