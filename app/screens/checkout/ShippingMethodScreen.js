import React from 'react';
import { AText, AButton, BackHeader } from '../../theme-components';
import styled from 'styled-components/native';
import { isEmpty } from '../../utils/helper';
import { useDispatch, useSelector } from 'react-redux';
import { ScrollView, StyleSheet, View } from 'react-native';
import AIcon from 'react-native-vector-icons/AntDesign';
import { APP_PRIMARY_COLOR, FontStyle, GREYTEXT } from '../../utils/config';
import { addAddressAction } from '../../store/action';
import { AdressForm } from '../components';
import Colors from '../../constants/Colors';
import NavigationConstants from '../../navigation/NavigationConstants';
import PropTypes from 'prop-types';

const ShippingMethodScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const [addressForm, setAddressForm] = React.useState(false);
  const [scrollenable, setScrollEnable] = React.useState(true);
  const [initialFormValues, setInitialFormValues] = React.useState({
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
  });
  const shippingValue = route.params.shippingValue;
  var cartAmount = route.params.cartAmount;
  var cartProducts = route.params.cartProducts;
  var couponCode = route.params.couponCode;
  var defaultaddress = route.params.shippingValue[0];
  const [paymentMethod, setPaymentMethod] = React.useState('cash');
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
        default_address: true,
      };

      setAddressForm(false);
      dispatch(addAddressAction(payload));
    } else {
      const payload = {
        id: userDetails._id,
        _id: initialFormValues._id,
        first_name: values.firstname,
        last_name: values.lastname,
        phone: values.phone,
        addressLine1: values.address,
        addressLine2: values.landmark,
        city: values.city,
        country: values.country,
        state: values.state,
        pincode: values.pincode,
        defaultAddress: true,
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

  const changeValue = (val) => {
    setPaymentMethod(val);
  };
  return (
    <>
      {addressForm ? (
        <>
          <AdressForm
            navigation={navigation}
            addForm={onSubmit}
            onStopScroll={() => {
              setScrollEnable(!scrollenable);
            }}
            cancelAddForm={() => {
              setAddressForm(false);
            }}
            initialFormValues={initialFormValues}
          />
        </>
      ) : (
        <View style={styles.container}>
          <BackHeader navigation={navigation} name="Checkout" />
          <View style={styles.container2}>
            <View style={styles.step}>
              <View style={styles.circle} />

              <View style={styles.line} />
              <View
                style={{
                  ...styles.label,
                  alignItems: 'flex-start',
                  marginLeft: -15,
                }}>
                <AText fonts={FontStyle.semiBold} color="black">
                  Address
                </AText>
              </View>
            </View>
            <View style={styles.step}>
              <View style={styles.line} />
              <View style={styles.circle} />
              <View style={styles.activedot} />
              <View style={styles.line} />
              <View style={styles.label}>
                <AText fonts={FontStyle.semiBold} color="black">
                  Shipping
                </AText>
              </View>
            </View>
            <View style={styles.step}>
              <View style={styles.line} />

              <View style={styles.circle} />
              <View
                style={{
                  ...styles.label,
                  alignItems: 'flex-end',
                  marginLeft: 24,
                }}>
                <AText fonts={FontStyle.semiBold} color="black">
                  Order Detail
                </AText>
              </View>
            </View>
          </View>
          <View style={{ marginHorizontal: 30, flex: 1 }}>
            <AddressWrapper>
              <AText color="black" fonts={FontStyle.semiBold} large>
                Billing Details
              </AText>
              <View style={styles.addresscard}>
                <RadioButtonWrapper>
                  <AText
                    mr="8px"
                    color="black"
                    fonts={FontStyle.semiBold}
                    large>
                    {defaultaddress.firstName}
                  </AText>
                </RadioButtonWrapper>
                <AText color={GREYTEXT} fonts={FontStyle.semiBold}>
                  {defaultaddress.phone}
                </AText>
                <AText color={GREYTEXT}>
                  {defaultaddress.addressLine1}, {defaultaddress.addressLine2},{' '}
                  {defaultaddress.city}
                </AText>
                <AText mb="10px" color={GREYTEXT}>
                  {defaultaddress.state}, {defaultaddress.pincode}
                </AText>
                <AIcon
                  onPress={() => {
                    editFormValues(defaultaddress);
                  }}
                  style={{ alignSelf: 'flex-end' }}
                  name="edit"
                  size={15}
                  color={'grey'}
                />
              </View>
              <AText color="black" fonts={FontStyle.semiBold} large>
                Shipping Method
              </AText>
              <View style={styles.addresscard}>
                <RadioButtonWrapper>
                  <AText
                    mr="8px"
                    color="black"
                    fonts={FontStyle.semiBold}
                    large>
                    Free Shipping
                  </AText>
                </RadioButtonWrapper>
                <AText color={GREYTEXT} fonts={FontStyle.semiBold}>
                  $0.00 (3-10 Business Days)
                </AText>
              </View>
            </AddressWrapper>

            <View style={{ position: 'absolute', bottom: 0, width: '100%' }}>
              <AButton
                disabled={paymentMethod === '' ? true : false}
                title="Next"
                round
                onPress={() =>
                  navigation.navigate(NavigationConstants.CHECKOUT_SCREEN, {
                    paymentMethod: paymentMethod,
                    cartAmount: cartAmount,
                    shippingValue: shippingValue,
                    cartProducts: cartProducts,
                    couponCode: couponCode,
                  })
                }
              />
            </View>
          </View>
        </View>
      )}
    </>
  );
};

ShippingMethodScreen.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

const AddressWrapper = styled.View`
  margin-bottom: 10px;
`;

const RadioButtonWrapper = styled.TouchableOpacity`
  // justify-content: space-between;
  margin-bottom: 10px;
  align-items: center;
  align-self: flex-end;
  flex-direction: row;
  width: 98%;
`;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
    backgroundColor: Colors.whiteColor,
  },
  activedot: {
    top: 5,
    left: '45%',
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: APP_PRIMARY_COLOR,
  },
  container2: {
    marginHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 30,
    marginTop: 30,
  },
  step: {
    position: 'relative',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    width: '33%',
  },

  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: APP_PRIMARY_COLOR,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: GREYTEXT,
    marginHorizontal: 5,
  },
  label: {
    fontFamily: 'SegoeUI-SemiBold',
    width: '100%',
    alignItems: 'center',
  },
  addresscard: {
    paddingHorizontal: 20,
    paddingVertical: 9,
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 3,
  },
});
export default ShippingMethodScreen;
