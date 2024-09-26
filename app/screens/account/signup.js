import React from 'react';
import { AText, AButton, TextInput } from '../../theme-components';
import { useFormik } from 'formik';
import { signupValidationSchema } from '../checkout/validationSchema';
import { useDispatch } from 'react-redux';
import { registerAction } from '../../store/action';
import { Checkbox } from 'react-native-paper';
import { Linking, TouchableOpacity, View } from 'react-native';
import Styles from '../../Theme';
import PropTypes from 'prop-types';
const SignupScreen = ({ navigation, handleActiveTab }) => {
  // States and Variables
  const dispatch = useDispatch();
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
      policy: '',
    },
    validationSchema: signupValidationSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      setSubmitting(false);
      sendValues(values);
      resetForm({ values: '' });
    },
  });

  // Custom Function
  const openLink = () => {
    const url = 'https://demo1-ravendel.hbwebsol.com/abouts/terms&condition';

    // Use Linking to open the URL
    Linking.openURL(url).catch((err) =>
      console.error('An error occurred', err),
    );
  };

  const sendValues = (values) => {
    const registerValue = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
      phone: values.mobile,
      company: values.company,
    };
    dispatch(registerAction(registerValue, navigation, handleActiveTab));
  };

  return (
    <>
      <TextInput
        color={'#000'}
        mt={30}
        padding={0}
        onchange={formik.handleChange('firstName')}
        bw={0}
        pb={10}
        onerror={false}
        placeholder={'Enter First name'}
        value={formik.values.firstName}
        placeholdercolor={'#ABA7A7'}
        inputBgColor="transparent"
      />
      {formik.touched.firstName && formik.errors.firstName && (
        <AText color="red" xtrasmall>
          {formik.errors.firstName}
        </AText>
      )}

      <TextInput
        color={'#000'}
        mt={10}
        padding={0}
        onchange={formik.handleChange('lastName')}
        bw={0}
        pb={10}
        onerror={false}
        placeholder={'Enter Last name'}
        value={formik.values.lastName}
        placeholdercolor={'#ABA7A7'}
        inputBgColor="transparent"
      />
      {formik.touched.lastName && formik.errors.lastName && (
        <AText color="red" xtrasmall>
          {formik.errors.lastName}{' '}
        </AText>
      )}

      <TextInput
        color={'#000'}
        mt={10}
        padding={0}
        onchange={formik.handleChange('email')}
        bw={0}
        pb={10}
        onerror={false}
        placeholder={'Enter Email'}
        value={formik.values.email}
        placeholdercolor={'#ABA7A7'}
        inputBgColor="transparent"
      />
      {formik.touched.email && formik.errors.email && (
        <AText color="red" xtrasmall>
          {formik.errors.email}
        </AText>
      )}

      <TextInput
        color={'#000'}
        mt={10}
        padding={0}
        keyboardtype={'numeric'}
        onchange={formik.handleChange('mobile')}
        bw={0}
        pb={10}
        onerror={false}
        placeholder={'Enter Phone No.'}
        value={formik.values.mobile}
        placeholdercolor={'#ABA7A7'}
        inputBgColor="transparent"
      />
      {formik.touched.mobile && formik.errors.mobile && (
        <AText color="red" xtrasmall>
          {formik.errors.mobile}
        </AText>
      )}

      <TextInput
        color={'#000'}
        mt={10}
        padding={0}
        onchange={formik.handleChange('company')}
        bw={0}
        pb={10}
        onerror={false}
        placeholder={'Enter Company'}
        value={formik.values.company}
        placeholdercolor={'#ABA7A7'}
        inputBgColor="transparent"
      />
      {formik.touched.company && formik.errors.company && (
        <AText color="red" xtrasmall>
          {formik.errors.company}
        </AText>
      )}

      <TextInput
        color={'#000'}
        mt={10}
        padding={0}
        onchange={formik.handleChange('password')}
        bw={0}
        pb={10}
        onerror={false}
        placeholder={'Enter Password'}
        value={formik.values.password}
        placeholdercolor={'#ABA7A7'}
        inputBgColor="transparent"
      />
      {formik.touched.password && formik.errors.password && (
        <AText color="red" xtrasmall>
          {formik.errors.password}
        </AText>
      )}

      <TextInput
        color={'#000'}
        mt={10}
        padding={0}
        onchange={formik.handleChange('confirmPassword')}
        bw={0}
        pb={10}
        onerror={false}
        placeholder={'Confirm Password'}
        value={formik.values.confirmPassword}
        placeholdercolor={'#ABA7A7'}
        inputBgColor="transparent"
      />
      {formik.touched.confirmPassword && formik.errors.confirmPassword && (
        <AText color="red" xtrasmall>
          {formik.errors.confirmPassword}
        </AText>
      )}

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {Platform.OS === 'ios' ? <View style={Styles.iosBox} /> : null}

        <Checkbox
          status={formik.values.policy ? 'checked' : 'unchecked'}
          onPress={() => formik.setFieldValue('policy', !formik.values.policy)}
        />
        <TouchableOpacity activeOpacity={0.5} onPress={() => openLink()}>
          <AText lineThrough small color="#9F9F9F">
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
        mt={'60px'}
        round
        onPress={formik.handleSubmit}
        title="Sign up"
        block
      />
    </>
  );
};

SignupScreen.propTypes = {
  handleActiveTab: PropTypes.func,
};

export default SignupScreen;
