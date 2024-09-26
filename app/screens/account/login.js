import React from 'react';
import { AText, AButton, ARow, TextInput } from '../../theme-components';
import { useFormik } from 'formik';
import { loginValidationSchema } from '../checkout/validationSchema';
import { useDispatch, useSelector } from 'react-redux';
import { LoginAction } from '../../store/action';
import { TouchableOpacity, View } from 'react-native';
const LoginScreen = ({ navigation }) => {
  // States and Variables
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
      // resetForm({ values: '' });
    },
  });

  // Custom Function
  const sendValues = (values) => {
    dispatch(LoginAction(values.email, values.password, navigation));
  };

  return (
    <>
      <ARow mb="10px" mt="30px">
        <TextInput
          color={'#000'}
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
        {formik.errors.email && formik.touched.email ? (
          <AText xtrasmall ml={'10px'} color={'red'} pb={5}>
            {formik.errors.email}
          </AText>
        ) : null}
      </ARow>
      <ARow>
        <TextInput
          color={'#000'}
          iconColor={'#9F9F9F'}
          bw={0}
          placeholder={'Enter Password'}
          padding={0}
          pb={10}
          onerror={false}
          secureTextEntry={true}
          icon={'eye-off'}
          value={formik.values.password}
          onchange={formik.handleChange('password')}
          hookuse
          placeholdercolor={'#ABA7A7'}
          inputBgColor="transparent"
        />
        {formik.errors.password && formik.touched.password ? (
          <AText xtrasmall ml={'10px'} color={'red'} pb={5}>
            {formik.errors.password}
          </AText>
        ) : null}
      </ARow>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
        }}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={{ marginTop: 5 }}
          onPress={() => navigation.navigate('ResetPassword')}>
          <AText pl="12px" bold xtrasmall color={'#ABA7A7'}>
            Forgot password?
          </AText>
        </TouchableOpacity>
      </View>
      <AButton
        mt={'74px'}
        title={'Log in'}
        round
        heavy
        onPress={formik.handleSubmit}
      />
    </>
  );
};

export default LoginScreen;
