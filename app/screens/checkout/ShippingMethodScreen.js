import React, { useEffect, useState } from 'react';
import {
  TextInput,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { AText, AButton, BackHeader } from '../../theme-components';
import styled from 'styled-components/native';
import { formatCurrency, isEmpty } from '../../utils/helper';
import { useDispatch, useSelector } from 'react-redux';
import AIcon from 'react-native-vector-icons/AntDesign';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  APP_PRIMARY_COLOR,
  APP_SECONDARY_COLOR,
  FontStyle,
  GREYTEXT,
} from '../../utils/config';
import { addAddressAction, applyCouponAction } from '../../store/action';
import { AdressForm, ProductPriceText } from '../components';
import Colors from '../../constants/Colors';
import NavigationConstants from '../../navigation/NavigationConstants';
import PropTypes from 'prop-types';
import { getShippingMethods } from '../../store/action/checkoutAction';
import paypal from '../../assets/images/paypal.png';
import razorpay from '../../assets/images/razorpay.png';
import strpie from '../../assets/images/stripe.png';
import cash_on_delivery from '../../assets/images/cash_on_delivery.png';
import bank_transfer from '../../assets/images/bank_transfer.png';

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
  const { userDetails, isLoggin } = useSelector((state) => state.customer);
  const cartItems = useSelector((state) => state.cart.products);
  const { shippingMethodList } = useSelector((state) => state.checkoutDetail);
  const { paymentSetting } = useSelector((state) => state.settings);
  var cartProducts = route.params.cartProducts;
  // var couponCode = route.params.couponCode;
  var defaultaddress = route.params.shippingValue[0];
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [shippingMethod, setShippingMethod] = useState('');
  const { cartSummary, couponDiscount } = useSelector((state) => state.cart);
  const { currencySymbol, currencyOptions } = useSelector(
    (state) => state.settings,
  );
  useEffect(() => {
    dispatch(getShippingMethods());
  }, []);
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

  const ApplyCoupon = () => {
    if (isEmpty(couponCode)) {
      alert('Coupon code is required');
      return;
    }
    let cartpro = [];
    cartItems.map((cart) => {
      cartpro.push({
        productId: cart.productId,
        // total: cart.total,
        qty: cart.qty,
      });
    });
    const payload = {
      couponCode: couponCode,
      cartItems: cartpro,
      userId: userDetails._id,
    };
    dispatch(applyCouponAction(payload, setCouponApplied));
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

          <ScrollView
            contentContainerStyle={{
              paddingBottom: 45,
            }}
            style={{
              marginHorizontal: 15,
              flex: 1,
              marginTop: 45,
            }}>
            <View style={styles.couponConatinerStyle}>
              <TextInput
                type="text"
                style={styles.coupanTextInputstyle}
                value={couponCode}
                onChangeText={(text) => setCouponCode(text)}
                placeholder="Enter coupon code"
              />
              <View style={styles.couponBtn}>
                <AButton
                  onPress={() =>
                    couponApplied ? removeCoupon() : ApplyCoupon()
                  }
                  round
                  block
                  title={couponApplied ? 'Applied' : 'Apply'}
                  small
                  semi
                />
              </View>
            </View>
            {couponApplied && (
              <AText ml={'15px'}>Coupon Applied successfully</AText>
            )}
            <View
              style={{
                marginTop: 25,
              }}>
              <AText color="black" mb={'5px'} fonts={FontStyle.semiBold} large>
                Shipping Method
              </AText>
              {!isEmpty(shippingMethodList) &&
                shippingMethodList.map((item) => (
                  <TouchableOpacity
                    onPress={() => {
                      setShippingMethod(item);
                    }}
                    style={[
                      styles.addresscard,
                      {
                        backgroundColor:
                          shippingMethod._id == item._id
                            ? APP_SECONDARY_COLOR
                            : '#fff',
                      },
                    ]}>
                    <View style={{ flexDirection: 'row' }}>
                      <MIcon
                        name={
                          shippingMethod.name === item.name
                            ? 'radiobox-marked'
                            : 'radiobox-blank'
                        }
                        size={18}
                        color={APP_PRIMARY_COLOR}
                      />
                      <AText
                        ml="8px"
                        color="black"
                        fonts={FontStyle.semiBold}
                        small>
                        {item.name}
                      </AText>
                    </View>
                    <AText
                      mr="8px"
                      color="black"
                      fonts={FontStyle.semiBold}
                      medium>
                      {item.amount}
                    </AText>
                  </TouchableOpacity>
                ))}
            </View>
            <View
              style={{
                marginTop: 25,
              }}>
              <AText color="black" mb={'5px'} fonts={FontStyle.semiBold} large>
                Payment Mode
              </AText>
              {!isEmpty(Object.keys(paymentSetting)) &&
                Object.values(paymentSetting)
                  // .filter((item) => item.enable)
                  .map((item) =>
                    item.enable ? (
                      <TouchableOpacity
                        onPress={() => setPaymentMethod(item.title)}
                        style={[
                          styles.addresscard,
                          {
                            backgroundColor:
                              paymentMethod == item.title
                                ? APP_SECONDARY_COLOR
                                : '#fff',
                          },
                        ]}>
                        <View style={{ flexDirection: 'row' }}>
                          <MIcon
                            name={
                              paymentMethod == item.title
                                ? 'radiobox-marked'
                                : 'radiobox-blank'
                            }
                            size={18}
                            color={APP_PRIMARY_COLOR}
                          />
                          <View style={{ width: '85%' }}>
                            <AText
                              ml="8px"
                              color="black"
                              fonts={FontStyle.semiBold}
                              medium>
                              {item.title}
                            </AText>
                            {item.description && (
                              <AText ml="8px" small>
                                {item.description}
                              </AText>
                            )}
                          </View>
                        </View>
                        <Image
                          style={[
                            styles.imagePaymentStyle,
                            item.__typename.toLowerCase() == 'bank_transfer'
                              ? { width: 65, height: 55 }
                              : {},
                          ]}
                          source={
                            item.__typename.toLowerCase() == 'paypal'
                              ? paypal
                              : item.__typename.toLowerCase() == 'razorpay'
                              ? razorpay
                              : item.__typename.toLowerCase() == 'stripe'
                              ? strpie
                              : item.__typename.toLowerCase() == 'bank_transfer'
                              ? bank_transfer
                              : cash_on_delivery
                          }
                        />
                      </TouchableOpacity>
                    ) : null,
                  )}
            </View>

            <View
              style={{
                marginTop: 25,
              }}>
              <AText color="black" mb={'5px'} fonts={FontStyle.semiBold} large>
                Order Summary
              </AText>
              {cartProducts.map((product, index) => (
                <TouchableOpacity
                  style={styles.productitem}
                  key={index}
                  onPress={() => {
                    navigation.navigate(
                      NavigationConstants.SINGLE_PRODUCT_SCREEN,
                      {
                        productID: product.productId,
                        productUrl: product.url,
                      },
                    );
                  }}>
                  <ItemImage
                    style={{ width: 90, height: 90 }}
                    source={{
                      uri: !isEmpty(product.productImage)
                        ? URL + product.productImage
                        : 'https://www.hbwebsol.com/wp-content/uploads/2020/07/category_dummy.png',
                    }}
                  />
                  <ItemDescription>
                    <View style={{ width: '97%', alignSelf: 'flex-start' }}>
                      <AText nol={2} fonts={FontStyle.semiBold} medium heavy>
                        {product.productTitle}
                      </AText>
                      <View style={styles.contentCardStyle}>
                        <ProductPriceText
                          fontsizesmall={true}
                          fontColor={Colors.blackColor}
                          Pricing={{
                            sellprice: product.productPrice,
                            price: product.mrpAmount,
                          }}
                        />

                        <View style={styles.qtyContainerStyle}>
                          <AText ml={'5px'} center small bold>
                            Qty: {product.qty}
                          </AText>
                        </View>
                        {product.productQuantity <= 5 ? (
                          <Text
                            style={{
                              color: '#ff0000',
                              fontSize: 12,
                              fontFamily: FontStyle.semiBold,
                            }}>
                            {'Only ' + product.productQuantity + ' Left'}
                          </Text>
                        ) : null}
                      </View>
                    </View>
                  </ItemDescription>
                </TouchableOpacity>
              ))}
            </View>
            <View style={{ width: '100%', marginBottom: 25, marginTop: 25 }}>
              <View style={styles.summary}>
                <AText fonts={FontStyle.semiBold}>Total MRP</AText>
                <AText color={Colors.grayColor}>
                  {formatCurrency(
                    cartSummary?.mrpTotal,
                    currencyOptions,
                    currencySymbol,
                  )}
                </AText>
              </View>
              <View style={styles.summary}>
                <AText fonts={FontStyle.semiBold}>Discount On MRP</AText>
                <AText color={Colors.green}>
                  {formatCurrency(
                    cartSummary?.discountTotal,
                    currencyOptions,
                    currencySymbol,
                  )}
                </AText>
              </View>
              {couponApplied && (
                <View style={styles.summary}>
                  <AText fonts={FontStyle.semiBold}>Discount By Coupon</AText>
                  <AText color={Colors.green}>
                    {formatCurrency(
                      couponDiscount,
                      currencyOptions,
                      currencySymbol,
                    )}
                  </AText>
                </View>
              )}
              <View
                style={{
                  ...styles.summary,
                  borderBottomWidth: 0.5,
                  paddingBottom: 15,
                }}>
                <AText fonts={FontStyle.semiBold}>Shipping Fee</AText>
                <AText
                  fonts={
                    cartSummary?.totalShipping === 0
                      ? FontStyle.semiBold
                      : FontStyle.fontRegular
                  }
                  color={Colors.grayColor}>
                  {cartSummary?.totalShipping === 0
                    ? 'FREE SHIPPING'
                    : formatCurrency(
                        cartSummary?.totalShipping,
                        currencyOptions,
                        currencySymbol,
                      )}
                </AText>
              </View>
              {/* <View
                    style={{
                      ...styles.summary,
                      borderBottomWidth: 0.5,
                      paddingBottom: 15,
                    }}>
                    <AText fonts={FontStyle.semiBold}>Tax</AText>
                    <AText color="gray">{cartSummary?.totalTax}</AText>
                  </View> */}
              <View
                style={{
                  ...styles.summary,
                  marginTop: 5,
                  marginBottom: 25,
                }}>
                <AText fonts={FontStyle.semiBold}>Total Amount</AText>
                <AText color="gray">
                  {formatCurrency(
                    cartSummary?.grandTotal,
                    currencyOptions,
                    currencySymbol,
                  )}
                </AText>
              </View>
            </View>
          </ScrollView>

          <View
            style={{
              position: 'absolute',
              bottom: 0,
              width: '50%',
              alignSelf: 'center',
            }}>
            <AButton
              disabled={paymentMethod === '' ? true : false}
              title="PLACE ORDER"
              round
              onPress={() =>
                navigation.navigate(NavigationConstants.THANK_YOU_SCREEN, {
                  // navigation.navigate(NavigationConstants.CHECKOUT_SCREEN, {
                  paymentMethod: paymentMethod,
                  shippingMethod: shippingMethod,
                  cartAmount: cartAmount,
                  shippingValue: shippingValue,
                  cartProducts: cartProducts,
                  couponCode: couponCode,
                })
              }
            />
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

const ItemImage = styled.ImageBackground`
  width: 90px;
  height: 105px;
  resize-mode: cover;
`;
const ItemDescription = styled.View`
  flex: 1;
  padding: 10px;
  flex-direction: row;
  justify-content: space-between;
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
    backgroundColor: Colors.whiteColor,
  },
  productitem: {
    // elevation: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 105,
    marginTop: 20,
    // marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#D4D4D4',
    marginHorizontal: 2,
    paddingHorizontal: 7,
    paddingVertical: 5,
  },
  contentCardStyle: {
    width: '95%',
    marginTop: 7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  qtyContainerStyle: {
    overflow: 'hidden',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E9E9E9',
    borderRadius: 7,
    padding: 5,
  },
  couponConatinerStyle: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    paddingHorizontal: 15,
    borderColor: 'gray',
  },
  coupanTextInputstyle: {
    flex: 1,
    textAlignVertical: 'center',
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
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
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
    paddingVertical: 15,
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    // elevation: 3,
    borderWidth: 1,
    borderColor: '#D4D4D4',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imagePaymentStyle: {
    resizeMode: 'contain',
    width: 75,
    height: 45,
    position: 'absolute',
    right: 5,
  },
});
export default ShippingMethodScreen;
