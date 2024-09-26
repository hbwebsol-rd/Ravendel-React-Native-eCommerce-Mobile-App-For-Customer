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
  console.log(userData, 'udata');
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
      resetForm({ values: '' });
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
      <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
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
      </View>
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
const ProfileImage = styled.Image`
  width: 80px;
  height: 60px;
  resize-mode: contain;
`;
const ImageWrapper = styled.View`
    flex-direction:row
    align-self:center;
    justify-content: space-evenly;
    align-items: center;
    margin-bottom:25px;
`;
const ImageButton = styled.TouchableOpacity`
  align-self: center;
  justify-content: center;
  align-items: center;
`;
const EditButton = styled.TouchableOpacity`
  position: absolute;
  top: 30px;
  right: -7px;
`;

const ItemWrapper = styled.View`
  border-radius: 10;
  padding-horizontal: 40px;
  padding-bottom: 30px;
  margin-horizontal: 30px;
  margin-top: 120px;
  //   height: 50%;
  justify-content: center;
  width: 90%;
  align-self: center;
  background-color: white;
`;

const UpperCurve = styled.View`
  height: 180px;
  width: 100%;
  background: #312f2d;
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
  align-self: center;
`;
const ProfileView = styled.View`
    height:180px;
    flex-direction:row;
    width:85%;
    align-items: center;
    justify-content:center;
    background:#f7f7f7;
    border-radius:10px;
    position:absolute;
    top:100px;
    z-index:1;
    align-self:center;
    shadow-color: #000;
    shadow-offset: {
        width: 0;
        height: 2;
    },
    shadow-opacity: 0.25px;
    shadow-radius: 3.84px;
    elevation: 5;
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
    elevation: 8,
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
