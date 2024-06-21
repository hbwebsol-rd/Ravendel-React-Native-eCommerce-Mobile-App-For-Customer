import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  AButton,
  AContainer,
  AHeader,
  AText,
  BackHeader,
  MainLayout,
} from '../../theme-components';
import { isEmpty } from '../../utils/helper';
import male from '../../assets/images/man.png';
import female from '../../assets/images/woman.png';
import Icon from 'react-native-vector-icons/FontAwesome';
import { editCustomerAction } from '../../store/action';
import { Formik, useFormik } from 'formik';
import { editProfileValidationSchema } from '../checkout/validationSchema';
import { APP_SECONDARY_COLOR, FontStyle, GREYTEXT } from '../../utils/config';
import AIcon from 'react-native-vector-icons/AntDesign';
import Colors from '../../constants/Colors';

const EditProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.customer.userDetails);
  const [genderArr, setGenderArr] = useState([
    { id: 1, type: 'male' },
    { id: 2, type: 'female' },
  ]);
  const [userDetails, setuserDetails] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    gender: '',
  });
  useEffect(() => {
    if (!isEmpty(userData)) {
      var userDetailObject = {
        gender: userData.gender ? userData.gender : '',
      };
      setuserDetails(userDetailObject);
    }
  }, [userData]);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      first_name: userData.firstName,
      last_name: userData.lastName,
      email: userData.email,
      phone: userData.phone,
      address: userData.address,
    },
    validationSchema: editProfileValidationSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      setSubmitting(false);
      profileUpdate(values);
      // resetForm({ values: '' });
    },
  });

  const profileUpdate = (val) => {
    var profileUpdateObject = {
      id: userData._id,
      first_name: val.first_name,
      last_name: val.last_name,
      email: val.email,
      phone: val.phone,
      gender: userDetails.gender,
    };
    dispatch(editCustomerAction(profileUpdateObject, navigation));
  };

  return (
    <>
      <MainLayout style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
        <BackHeader name="My Account" navigation={navigation} />
        {/* <UpperCurve /> */}

        <View
          style={{
            alignItems: 'center',
            marginTop: 60,
          }}>
          {isEmpty(userData.gender) || userData.gender === 'Male' ? (
            <Image
              style={{ height: 70, width: 70 }}
              source={require('../../assets/images/man.png')}
            />
          ) : (
            <Image
              style={{ height: 70, width: 70 }}
              source={require('../../assets/images/woman.png')}
            />
          )}
        </View>
        <View style={styles.container}>
          <TextInputArea
            placeholder="First Name"
            value={formik.values.first_name}
            onChangeText={formik.handleChange('first_name')}
          />
          {formik.touched.first_name && formik.errors.first_name && (
            <AText color="red" mb={'5px'} xtrasmall>
              {formik.errors.first_name}
            </AText>
          )}

          <TextInputArea
            placeholder="Last Name"
            value={formik.values.last_name}
            onChangeText={formik.handleChange('last_name')}
          />
          {formik.touched.last_name && formik.errors.last_name && (
            <AText color="red" mb={'5px'} xtrasmall>
              {' '}
              {formik.errors.last_name}{' '}
            </AText>
          )}

          <TextInputArea
            placeholder="Email"
            value={formik.values.email}
            keyboardType={'email-address'}
            onChangeText={formik.handleChange('email')}
          />
          {formik.touched.email && formik.errors.email && (
            <AText color="red" mb={'5px'} xtrasmall>
              {' '}
              {formik.errors.email}
            </AText>
          )}

          <TextInputArea
            placeholder="Phone no."
            value={formik.values.phone}
            keyboardType={'numeric'}
            onChangeText={formik.handleChange('phone')}
          />
          {formik.touched.phone && formik.errors.phone && (
            <AText color="red" mb={'5px'} xtrasmall>
              {' '}
              {formik.errors.phone}{' '}
            </AText>
          )}

          <AButton
            mt="60px"
            round
            onPress={formik.handleSubmit}
            title="Save Changes"
          />
        </View>
      </MainLayout>
    </>
  );
};
const TextInputArea = styled.TextInput`
  font-size:12;
  border-color: gray;
  border-bottom-width: 1px;
  border-bottom-color: ${APP_SECONDARY_COLOR};
  //   background: #e7e7e7;
  color:${GREYTEXT}
  width: 100%;
  margin-bottom: 10px;
  border-radius: 5px;
  align-self: center;
  padding: 9px;
`;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    position: 'absolute',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    left: 0,
    right: 0,
    marginTop: 10,
    paddingHorizontal: 20,
    zIndex: 10,
  },
  editIcon: {
    marginTop: 3,
    marginHorizontal: 9,
    alignSelf: 'center',
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
    //   height: 50%,
    justifyContent: 'center',
    width: '90%',
    alignSelf: 'center',
    backgroundColor: 'white',
  },
});
export default EditProfileScreen;
