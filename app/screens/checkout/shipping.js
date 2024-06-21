import React, { Fragment, useEffect, useState } from 'react';
import {
  AText,
  AButton,
  AppLoader,
  BackHeader,
  MainLayout,
} from '../../theme-components';
import styled from 'styled-components/native';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { formatCurrency, isEmpty } from '../../utils/helper';
import { useIsFocused } from '@react-navigation/native';
import {
  addAddressAction,
  updateAddressAction,
  userDetailsfetch,
} from '../../store/action';
import { AdressForm } from '../components';
import AIcon from 'react-native-vector-icons/AntDesign';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  APP_PRIMARY_COLOR,
  APP_SECONDARY_COLOR,
  FontStyle,
  GREYTEXT,
} from '../../utils/config';
import Colors from '../../constants/Colors';
import PropTypes from 'prop-types';
import { checkPincodeValid } from '../../store/action/checkoutAction';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { Checkbox } from 'react-native-paper';

const CheckoutScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [scrollenable, setScrollEnable] = useState(true);
  const { userDetails, loading } = useSelector((state) => state.customer);
  const [addressForm, setAddressForm] = useState(false);
  const [sameShipingAdress, setSameShippingAdress] = useState(true);
  const [formSubmit, setFormSubmit] = useState(false);
  const [addressDefault, setaddressDefault] = useState(0);
  const [shippingAddress, setShippingAddress] = useState({});
  const [initialFormValues, setInitialFormValues] = useState({
    firstname: userDetails.firstName,
    lastname: userDetails.lastName,
    phone: userDetails.phone,
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
  const defaddress = !isEmpty(userDetails)
    ? userDetails.addressBook.filter(({ defaultAddress }) => defaultAddress)
    : [];
  const onSubmit = (values) => {
    if (isEmpty(initialFormValues._id)) {
      const payload = {
        id: userDetails._id,
        firstName: values.firstname,
        lastName: values.lastname,
        phone: values.phone,
        company: '',
        addressLine1: values.address,
        addressLine2: values.landmark,
        city: values.city,
        country: values.country,
        state: values.state,
        pincode: values.pincode,
        defaultAddress: values.defaultAddress,
        addressType: values.addressType,
      };
      console.log(payload, '!sameShipingAdress && !addressForm');
      if (!sameShipingAdress && !addressForm) {
        setShippingAddress(payload);
        handleShipping(payload);
      } else {
        setAddressForm(false);
        dispatch(addAddressAction(payload));
      }
    } else {
      const payload = {
        id: userDetails._id,
        _id: initialFormValues._id,
        firstName: values.firstname,
        lastName: values.lastname,
        phone: values.phone,
        company: '',
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
        defaultAddress: true,
        addressType: '',
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
      defaultAddress: values.defaultAddress ?? false,
      addressType: values.addressType ?? '',
    });
    setAddressForm(true);
  };

  const handleShipping = (shipAddresspayload) => {
    const billAddress =
      userDetails.addressBook &&
      userDetails.addressBook.find((item) => item._id == addressDefault);
    const payload = {
      zipcode:
        !sameShipingAdress && shipAddresspayload
          ? shipAddresspayload.pincode
          : !sameShipingAdress && shippingAddress
          ? shippingAddress.pincode
          : billAddress.pincode,
    };
    const navigationParams = {
      screen: 'ShippingMethod',
      shippingAddress:
        !sameShipingAdress && shipAddresspayload
          ? shipAddresspayload
          : !sameShipingAdress && shippingAddress
          ? shippingAddress
          : billAddress,
      billingAddress: billAddress,
    };
    console.log(navigationParams, 'navigationParams');
    dispatch(checkPincodeValid(payload, navigation, navigationParams));
  };

  return (
    <MainLayout hideScroll style={styles.container}>
      {loading ? <AppLoader /> : null}
      {(isEmpty(userDetails) && isEmpty(userDetails.addressBook)) ||
      addressForm ? (
        <AdressForm
          navigation={navigation}
          addForm={onSubmit}
          onStopScroll={() => {
            setScrollEnable(!scrollenable);
          }}
          showBottomPanel={true}
          showHeader={true}
          cancelAddForm={() => {
            setAddressForm(false);
          }}
          initialFormValues={initialFormValues}
        />
      ) : (
        <>
          <BackHeader navigation={navigation} name="Checkout" />

          <ScrollView
            style={{ marginHorizontal: 20, marginTop: 10, flex: 1 }}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
            scrollEnabled={scrollenable}>
            <AText medium fonts={FontStyle.semiBold} color="black">
              Billing Address
            </AText>
            <AddressWrapper>
              {userDetails.addressBook.map((item, index) => (
                <View
                  style={[
                    styles.addresscard,
                    addressDefault === item._id,
                    {
                      backgroundColor:
                        addressDefault === item._id
                          ? APP_SECONDARY_COLOR
                          : '#fff',
                      borderColor:
                        addressDefault === item._id
                          ? APP_PRIMARY_COLOR
                          : '#c8c8c8',
                    },
                  ]}>
                  <TouchableOpacity
                    onPress={() => {
                      setaddressDefault(item._id);
                    }}>
                    <MIcon
                      name={
                        addressDefault === item._id
                          ? 'radiobox-marked'
                          : 'radiobox-blank'
                      }
                      size={18}
                      color={APP_PRIMARY_COLOR}
                    />
                  </TouchableOpacity>
                  <View style={{ marginStart: 15, width: '85%' }}>
                    <View style={{ flexDirection: 'row' }}>
                      <MIcon
                        name={
                          item.addressType == 'Home'
                            ? 'home-outline'
                            : 'briefcase-outline'
                        }
                        size={22}
                        color={APP_PRIMARY_COLOR}
                      />
                      <AText
                        ml="5px"
                        color={Colors.blackColor}
                        fonts={FontStyle.semiBold}
                        medium>
                        {item.addressType}
                      </AText>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        width: '80%',
                        justifyContent: 'space-between',
                      }}>
                      <AText color={GREYTEXT} fonts={FontStyle.semiBold}>
                        {item.firstName}
                      </AText>
                      <AText color={GREYTEXT} fonts={FontStyle.semiBold}>
                        {item.phone}
                      </AText>
                    </View>
                    <AText mt={'10px'} color={GREYTEXT}>
                      {item.addressLine1}, {item.addressLine2}, {item.city}{' '}
                      {item.state}, {item.pincode}
                    </AText>
                  </View>
                  <TouchableOpacity
                    style={styles.editBtnStyle}
                    onPress={() => {
                      editFormValues(item);
                    }}>
                    <MIcon
                      name={'pencil-outline'}
                      size={15}
                      color={APP_PRIMARY_COLOR}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </AddressWrapper>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setAddressForm(true);
              }}
              style={styles.addaddresscard}>
              <AIcon
                style={{
                  height: 26,
                  width: 26,
                  borderRadius: 30,
                  backgroundColor: '#DCF0EF',
                }}
                name="pluscircleo"
                size={25}
                color={'black'}
              />
              <AText ml="20px" color="black" fonts={FontStyle.semiBold}>
                Add a new address
              </AText>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.5}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginStart: 5,
              }}
              onPress={() => {
                setSameShippingAdress(!sameShipingAdress);
              }}>
              <IonIcon
                color={APP_PRIMARY_COLOR}
                name={sameShipingAdress ? 'checkbox-outline' : 'square-outline'}
                style={{ marginHorizontal: 5 }}
                size={20}
              />
              <Text>Same as Billing address</Text>
            </TouchableOpacity>

            <AddressWrapper>
              {!sameShipingAdress && (
                <AdressForm
                  navigation={navigation}
                  handleSubmit={formSubmit}
                  addForm={onSubmit}
                  onStopScroll={() => {
                    setScrollEnable(!scrollenable);
                  }}
                  cancelAddForm={() => {
                    setAddressForm(false);
                  }}
                  initialFormValues={initialFormValues}
                />
              )}
            </AddressWrapper>
            <AButton
              ml="50px"
              mr="50px"
              onPress={() => {
                sameShipingAdress ? handleShipping() : setFormSubmit(true);
                setTimeout(() => {
                  setFormSubmit(false);
                }, 700);
              }}
              round
              title="Next"
            />
          </ScrollView>
        </>
      )}
    </MainLayout>
  );
};

CheckoutScreen.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: Colors.whiteColor,
    // paddingHorizontal: 30,
  },

  addresscard: {
    paddingHorizontal: 20,
    paddingVertical: 9,
    marginVertical: 10,
    backgroundColor: Colors.whiteColor,
    borderRadius: 8,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    borderWidth: 1,
  },
  addaddresscard: {
    marginHorizontal: 2,
    marginBottom: 30,
    paddingHorizontal: 20,
    paddingVertical: 9,
    marginVertical: 10,
    backgroundColor: Colors.whiteColor,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#c8c8c8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBtnStyle: {
    flexWrap: 'wrap',
    width: 25,
    height: 25,
  },
});

const AddressWrapper = styled.View`
  margin-bottom: 10px;
  margin-horizontal: 2px;
`;

const RadioButtonWrapper = styled.TouchableOpacity`
  // justify-content: space-between;
  margin-bottom: 10px;
  align-items: center;
  align-self: flex-end;
  flex-direction: row;
  width: 98%;
`;

export default CheckoutScreen;
