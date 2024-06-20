import React, { Fragment, useEffect, useState } from 'react';
import {
  AText,
  AButton,
  AppLoader,
  AHeader,
  BackHeader,
} from '../../theme-components';
import { Formik } from 'formik';
import { validationSchema } from '../checkout/validationSchema';
import styled from 'styled-components/native';
import { RadioButton, TextInput } from 'react-native-paper';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from '../../utils/helper';
import { useIsFocused } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  addAddressAction,
  removeAddressAction,
  updateAddressAction,
  userDetailsfetch,
} from '../../store/action';
import { AdressForm } from '../components';
import {
  APP_PRIMARY_COLOR,
  APP_SECONDARY_COLOR,
  FontStyle,
  GREYTEXT,
} from '../../utils/config';
import AIcon from 'react-native-vector-icons/AntDesign';
import Header from '../../theme-components/SimpleHeader';
import Colors from '../../constants/Colors';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const SavedAddressScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const { userDetails, loading } = useSelector((state) => state.customer);
  const [addressBook, setAddressBook] = useState();
  const [addressForm, setAddressForm] = useState(false);
  const [addressDefault, setaddressDefault] = useState(0);
  const [scrollenable, setScrollEnable] = useState(true);
  const [initialFormValues, setInitialFormValues] = useState({
    firstname: '',
    lastname: '',
    phone: '',
    address: '',
    landmark: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
    _id: '',
    defaultAddress: true,
    addressType: '',
  });

  useEffect(() => {
    if (!isEmpty(userDetails.addressBook)) {
      let address = userDetails.addressBook;
      setAddressBook(address);
      setAddressForm(false);
      var found = address.find((item) => {
        return item.default_address == true;
      });
      if (!isEmpty(found)) {
        setaddressDefault(found._id);
      } else {
        setaddressDefault(address[0]._id);
      }
    } else {
      setAddressForm(true);
    }
  }, [isFocused, userDetails]);

  useEffect(() => {
    if (!isEmpty(userDetails)) {
      dispatch(userDetailsfetch(userDetails._id));
    }
  }, [isFocused]);

  const onSubmit = (values) => {
    if (isEmpty(initialFormValues._id)) {
      const payload = {
        id: userDetails._id,
        firstName: values.firstname,
        lastName: values.lastname,
        phone: values.phone,
        addressLine1: values.address,
        addressLine2: values.landmark,
        city: values.city,
        country: values.country,
        state: values.state,
        pincode: values.pincode,
        defaultAddress: values.defaultAddress,
        addressType: values.addressType,
      };
      setAddressForm(false);
      dispatch(addAddressAction(payload));
    } else {
      const payload = {
        id: userDetails._id,
        _id: initialFormValues._id,
        firstName: values.firstname,
        lastName: values.lastname,
        phone: values.phone,
        addressLine1: values.address,
        addressLine2: values.landmark,
        city: values.city,
        country: values.country,
        state: values.state,
        pincode: values.pincode,
        defaultAddress: values.defaultAddress,
        addressType: values.addressType,
      };
      setInitialFormValues({
        firstname: '',
        lastname: '',
        phone: '',
        address: '',
        landmark: '',
        city: '',
        state: '',
        country: '',
        pincode: '',
      });
      setAddressForm(false);
      dispatch(updateAddressAction(payload));
    }
  };
  const editFormValues = (values) => {
    setInitialFormValues({
      firstname: values.firstName,
      lastname: values.lastName,
      phone: values.phone,
      address: values.addressLine1,
      landmark: values.addressLine2,
      city: values.city,
      state: values.state,
      country: values.country,
      pincode: values.pincode,
      _id: values._id,
    });
    setAddressForm(true);
  };
  const updatedefaultaddress = (values) => {
    const payload = {
      id: userDetails._id,
      _id: values._id,
      first_name: values.first_name,
      last_name: values.last_name,
      phone: values.phone,
      address_line1: values.address_line1,
      address_line2: values.address_line2,
      city: values.city,
      country: values.country,
      state: values.state,
      pincode: values.pincode,
      default_address: true,
    };
    dispatch(updateAddressAction(payload));
  };
  const deleteAddress = (id) => {
    const data = {
      id: userDetails._id,
      _id: id,
    };
    dispatch(removeAddressAction(data));
  };

  return (
    <>
      {loading ? <AppLoader /> : null}
      {(isEmpty(userDetails) && isEmpty(userDetails.addressBook)) ||
      addressForm ? (
        <AdressForm
          navigation={navigation}
          addForm={onSubmit}
          onStopScroll={() => {
            setScrollEnable(!scrollenable);
          }}
          cancelAddForm={() => {
            setAddressForm(false);
          }}
          showBottomPanel={true}
          showHeader={true}
          initialFormValues={initialFormValues}
        />
      ) : (
        <>
          {/* <AHeader navigation={navigation} title="Saved Addresses" back /> */}
          <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <BackHeader navigation={navigation} name={'My Account'} />

            <ScrollView
              contentContainerStyle={{
                marginHorizontal: 12,
              }}>
              <AddressWrapper>
                {userDetails.addressBook.map((item, index) => (
                  <View style={styles.AddressContentWrapper}>
                    <RadioButtonWrapper
                      onPress={() => {
                        editFormValues(item);
                      }}>
                      <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <MIcon
                          name={
                            item.addressType == 'Home'
                              ? 'home-outline'
                              : 'briefcase-outline'
                          }
                          size={22}
                          color={APP_PRIMARY_COLOR}
                        />
                        <AText heavy large>
                          {item.addressType}
                        </AText>
                      </View>
                      <MIcon
                        name={'pencil-outline'}
                        size={15}
                        color={APP_PRIMARY_COLOR}
                      />
                    </RadioButtonWrapper>
                    <View>
                      <View
                        style={{
                          flexDirection: 'row',
                          width: '80%',
                          justifyContent: 'space-between',
                        }}>
                        <AText bold medium>
                          {item.firstName}
                        </AText>
                        <AText bold medium>
                          {item.phone}
                        </AText>
                      </View>
                      <AText mt={'10px'} color={'#8A8A8A'}>
                        {item.addressLine1}, {item.addressLine2}, {item.city}
                      </AText>
                      <AText mt={'2px'} color={'#8A8A8A'}>
                        {item.state}, {item.pincode}
                      </AText>
                    </View>
                  </View>
                ))}
              </AddressWrapper>
              <View style={{ marginTop: 15 }}>
                <TouchableOpacity
                  style={styles.addAddressBtnStyle}
                  onPress={() => {
                    setAddressForm(true);
                  }}>
                  <View style={styles.plusStyle}>
                    <MIcon name={'plus-thick'} size={18} color={'#000'} />
                  </View>
                  <AText medium>Add new address</AText>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </>
      )}
      {/* </CheckouWrapper> */}
    </>
  );
};

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
  textinputstyle: {
    marginTop: 5,
    marginBottom: 5,
  },
  AddressContentWrapper: {
    flex: 1,
    // marginHorizontal: 5,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#D4D4D4',
    padding: 10,
    paddingHorizontal: 16,
    marginVertical: 7,
    justifyContent: 'space-evenly',
  },
  addAddressBtnStyle: {
    borderWidth: 1,
    borderColor: '#D4D4D4',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '95%',
    alignSelf: 'center',
  },
  plusStyle: {
    backgroundColor: APP_SECONDARY_COLOR,
    borderRadius: 60,
    padding: 5,
    marginEnd: 8,
  },
});

const CheckouWrapper = styled.ScrollView`
  padding: 10px;
  background: #fff;
`;
const BottomSpacer = styled.View`
  height: 25px;
`;
const AddressWrapper = styled.View`
  margin-top: 20px;
`;
const AddressContentWrapper = styled.View`
  flex: 1;
  margin-top: 10px;
  margin-bottom: 10px;
  border-radius: 10px;
  background: white;
  overflow: hidden;
  position: relative;
  border: 1px solid #f8f8f8;
  box-shadow: 0 0 5px #eee;
  elevation: 1;
  padding: 10px 12px;
`;
const EditRemoveButton = styled.TouchableOpacity`
  padding: 5px;
  border-radius: 5px;
  justify-content: center;
  align-items: center;
  margin-left: 5px;
  margin-top: 10px;
`;
const ButtonWrapper = styled.TouchableOpacity`
  align-items: center;
  align-self: flex-start;
  marginstart: 10px;
  flex-direction: row;
`;
const RadioButtonWrapper = styled.TouchableOpacity`
  justify-content: space-between;
  align-items: center;
  align-self: flex-end;
  flex-direction: row;
  width: 100%;
  margin: 5px;
`;
export default SavedAddressScreen;
