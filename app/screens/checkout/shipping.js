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
import { isEmpty } from '../../utils/helper';
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
import AddressCard from '../../theme-components/addressCard';

const ShippingScreen = ({ navigation }) => {
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
      screen: 'CheckoutDetails',
      shippingAddress:
        !sameShipingAdress && shipAddresspayload
          ? shipAddresspayload
          : !sameShipingAdress && shippingAddress
            ? shippingAddress
            : billAddress,
      billingAddress: billAddress,
    };
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
          onStopScroll={() => setScrollEnable(!scrollenable)}
          showBottomPanel={true}
          showHeader={true}
          cancelAddForm={() => setAddressForm(false)}
          initialFormValues={initialFormValues}
        />
      ) : (
        <>
          <BackHeader navigation={navigation} name="Checkout" />
          <ScrollView
            style={styles.scrollStyle}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
            scrollEnabled={scrollenable}>
            <AText medium fonts={FontStyle.semiBold} color="black">
              Billing Address
            </AText>
            <AddressWrapper>
              {userDetails.addressBook.map((item) => (
                <AddressCard
                  addressDefault={addressDefault}
                  item={item}
                  editDefaultAdress={true}
                  setaddressDefault={() => { setaddressDefault(item._id) }}
                  editForm={() => { editFormValues(item) }} />
              ))}
            </AddressWrapper>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setAddressForm(true)}
              style={styles.addaddresscard}>
              <AIcon style={styles.iconStyle} name="pluscircleo" size={25} color={'black'} />
              <AText style={styles.textStyle} >
                Add a new address
              </AText>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.billingAddressBtnStyle}
              onPress={() => setSameShippingAdress(!sameShipingAdress)}>
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
                  onStopScroll={() => setScrollEnable(!scrollenable)}
                  cancelAddForm={() => setAddressForm(false)}
                  initialFormValues={initialFormValues}
                />
              )}
            </AddressWrapper>
            <AButton
              style={styles.nextBtnStyle}
              onPress={() => {
                sameShipingAdress ? handleShipping() : setFormSubmit(true);
                setTimeout(() => {
                  setFormSubmit(false);
                }, 700);
              }}
              title="Next"
            />
          </ScrollView>
        </>
      )}
    </MainLayout>
  );
};

ShippingScreen.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
    backgroundColor: Colors.whiteColor,
  },
  textStyle: {
    marginLeft: 20, color: "black", fontFamily: FontStyle.semiBold
  },
  scrollStyle: { marginHorizontal: 20, marginTop: 10, flex: 1 },
  billingAddressBtnStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginStart: 5,
  },
  iconStyle: {
    height: 26,
    width: 26,
    borderRadius: 30,
    backgroundColor: '#DCF0EF',
  },
  nextBtnStyle: { width: '80%', alignItems: 'center', alignSelf: 'center', borderRadius: 25 },
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
});

const AddressWrapper = styled.View`
  margin-bottom: 10px;
  margin-horizontal: 2px;
`;

export default ShippingScreen;
