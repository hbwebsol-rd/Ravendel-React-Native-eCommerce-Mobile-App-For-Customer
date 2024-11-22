import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  AButton,
  AText,
  BackHeader,
  MainLayout,
} from '../../theme-components';
import { isEmpty } from '../../utils/helper';
import { editCustomerAction } from '../../store/action';
import { useFormik } from 'formik';
import { editProfileValidationSchema } from '../checkout/validationSchema';

const fieldArray = [
  { id: 1, name: 'First Name', key: 'first_name', keyboardType: 'default' },
  { id: 1, name: 'Last Name', key: 'last_name', keyboardType: 'default' },
  { id: 1, name: 'Email', key: 'email', keyboardType: 'email-address' },
  { id: 1, name: 'Phone no.', key: 'phone', keyboardType: 'numeric' }
];
const EditProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.customer.userDetails);
  const [userDetails, setUserDetails] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    gender: '',
  });

  useEffect(() => {
    if (!isEmpty(userData)) {
      setUserDetails((prevDetails) => ({
        ...prevDetails,
        gender: userData.gender || '',
      }));
    }
  }, [userData]);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      first_name: userData.firstName || '',
      last_name: userData.lastName || '',
      email: userData.email || '',
      phone: userData.phone || '',
    },
    validationSchema: editProfileValidationSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      setSubmitting(false);
      profileUpdate(values);
    },
  });

  const profileUpdate = (values) => {
    var profileUpdateObject = {
      id: userData._id,
      ...values,
      gender: userDetails.gender,
    };
    dispatch(editCustomerAction(profileUpdateObject, navigation));
  };

  return (
    <MainLayout>
      <BackHeader name="My Account" navigation={navigation} />
      <View style={styles.imageContainer}>

        <Image
          style={styles.profileImage}
          source={
            isEmpty(userData.gender) || userData.gender === 'Male'
              ? require('../../assets/images/man.png')
              : require('../../assets/images/woman.png')
          }
        />
      </View>
      <View style={styles.container}>
        {fieldArray.map(({ id, name, key, keyboardType }) =>
          <View key={id}>
            <TextInputArea
              placeholder={name}
              value={formik.values[key]}
              keyboardType={keyboardType}
              onChangeText={(val) => formik.setFieldValue(key, val)}

            />
            {formik.touched[key] && formik.errors[key] && (
              <AText textStyle={styles.errorText} color="red" xtrasmall>
                {formik.errors[key]}
              </AText>
            )}
          </View>
        )}
        <AButton
          buttonStyle={styles.saveButton}
          onPress={formik.handleSubmit}
          title="Save Changes"
        />
      </View>
    </MainLayout>
  );
};
const TextInputArea = styled.TextInput`
  font-size: 12px;
  border-color: gray;
  border-bottom-width: 1px;
  width: 100%;
  margin-bottom: 10px;
  border-radius: 5px;
  align-self: center;
  padding: 9px;
`;

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  profileImage: {
    height: 70,
    width: 70,
  },
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
    justifyContent: 'center',
    width: '90%',
    alignSelf: 'center',
    backgroundColor: 'white',
  },
  errorText: {
    marginBottom: 5,
  },
  saveButton: {
    marginTop: 30,
    borderRadius: 50,
  },
});
export default EditProfileScreen;
