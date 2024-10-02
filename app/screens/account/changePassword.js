import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  AButton,
  BackHeader,
  TextInput,
  MainLayout,
  AText,
} from '../../theme-components';
import { isEmpty } from '../../utils/helper';
import { changePasswordAction } from '../../store/action';
import { ALERT_ERROR } from '../../store/reducers/alert';
import { Keyboard, StyleSheet, View } from 'react-native';
import { useFormik } from 'formik';
import { changePasswordValidationSchema } from '../checkout/validationSchema';

const ChangePasswordScreen = ({ navigation }) => {

  const dispatch = useDispatch();
  const userData = useSelector((state) => state.customer.userDetails);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      old_password: '',
      new_password: '',
      confirm_password: '',
    },
    validationSchema: changePasswordValidationSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      setSubmitting(false);
      sendValues(values);
    },
  });

  const sendValues = (values) => {
    Keyboard.dismiss();
    const profileUpdateObject={
      id: userData._id,
      oldPassword: values.old_password,
      newPassword: values.new_password,
    }
    dispatch(changePasswordAction(profileUpdateObject, navigation));
  };

  const [userDetails, setuserDetails] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });
  const fieldArray = [
    { id: 1, name: 'Old Password', key: 'old_password' },
    { id: 1, name: 'New Password', key: 'new_password' },
    { id: 1, name: 'Confirm Password', key: 'confirm_password' }
  ];

  
  return (
    <MainLayout>
      <BackHeader navigation={navigation} name="Change Password" back />
      <View
        style={styles.container}>
        <View style={styles.contentContainer}>
          {fieldArray.map(({ name, key }) =>
          <>
            <TextInput
              placeholder={name}
              value={formik.values[key]}
              secureTextEntry={true}
              onchange={(val) => formik.setFieldValue(key, val)}
              hookuse
              iconColor={'#9F9F9F'}
              icon={'eye-off'}
              StylesTextInput={styles.textInputStyle}
              onerror={false}
              placeholdercolor={'#ABA7A7'}
              inputBgColor="transparent"
            />
            {
            formik.touched[key] && formik.errors[key] && (
              <AText color="red" style={{marginLeft:5}} xtrasmall>
                {formik.errors[key]}
              </AText>
            )
          }
            </>
          )}
          <AButton
            style={{borderRadius: 25}}
            onPress={formik.handleSubmit}
            buttonStyle={{ marginTop: 20 }}
            title="Submit"
          />
        </View>
      </View>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  contentContainer: {
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
    justifyContent: 'center',
    width: '90%',
    alignSelf: 'center',
    backgroundColor: 'white',
  },
  textInputStyle: {
    padding: 0,
    borderWidth: 0,
    paddingBottom: 10,
    color: '#000',
    marginTop: 10,
  },
});
export default ChangePasswordScreen;
