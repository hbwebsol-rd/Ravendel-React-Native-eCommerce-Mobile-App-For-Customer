import React, { useState } from 'react';
import {
  AText,
  AContainer,
  AButton,
  BackHeader,
  TextInput,
} from '../../theme-components';
import styled from 'styled-components/native';
import URL from '../../utils/baseurl';
import { DataTable, Divider, RadioButton } from 'react-native-paper';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { checkoutDetailsAction } from '../../store/action';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { formatCurrency, isEmpty } from '../../utils/helper';
import { APP_PRIMARY_COLOR, FontStyle, GREYTEXT } from '../../utils/config';
import Colors from '../../constants/Colors';
import PropTypes from 'prop-types';

const CheckoutScreen = ({ navigation, route }) => {
  var shippingValue = route.params.shippingValue;
  var cartAmount = route.params.cartAmount;
  var cartProducts = route.params.cartProducts;
  var couponCode = route.params.couponCode;
  var paymentMethod = route.params.paymentMethod;
  var defaultaddress = route.params.shippingValue[0];
  const {
    pincode,
    state,
    city,
    addressLine1,
    addressLine2,
    phone,
    email,
    lastName,
    firstName,
    country,
  } = route.params.shippingValue[0];
  const dispatch = useDispatch();
  const { cartId } = useSelector((state) => state.cart);
  const userDetails = useSelector((state) => state.customer.userDetails);
  const cartSummary = useSelector((state) => state.cart.cartSummary);

  const {
    phone: userPhone,
    email: userEmail,
    lastName: userLastName,
    firstName: userFirstName,
    _id,
  } = userDetails;
  const { checkoutSuccess } = useSelector((state) => state.checkoutDetail);
  const [deliveryCharges, setDeliveryCharges] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [productArr, setProductArr] = useState([]);
  const [checked, setChecked] = React.useState('Cash On Delivery');
  const { couponDiscount } = useSelector((state) => state.cart);
  const { currencyOptions, currencySymbol } = useSelector(
    (state) => state.settings,
  );

  const isFocused = useIsFocused();
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Order Summary',
      headerTransparent: false,
      headerTintColor: '#000',
      headerRight: () => (
        <AText bold pr="10px">
          {formatCurrency(cartAmount, currencyOptions, currencySymbol)}
        </AText>
      ),
    });
  }, [navigation]);

  // let totalcost = 0;
  // cartProducts.map((val) => {
  //   totalcost = totalcost + val.productPrice;
  // });

  // const setproducts = () => {
  //   var products = [];
  //   cartProducts.map((val) => {
  //     console.log(val, 'product val');
  //     products.push({
  //       productId: val._id,
  //       productTitle: val.name,
  //       productPrice: val.productPrice,
  //       qty: val.cartQty,
  //       taxClass: val.taxClass,
  //       shippingClass: val.shippingClass,
  //     });
  //     totalcost = totalcost + val.productPrice;
  //   });
  //   setProductArr(products);
  // };
  const checkoutDetails = () => {
    // if (checked === 'cod') {
    const payload = {
      userId: _id,
      billing: {
        // order_notes: '',
        lastname: lastName,
        firstname: firstName,
        address: addressLine1,
        city: city,
        zip: pincode,
        country: country,
        state: state,
        email: userEmail,
        phone: phone || '1234',
        paymentMethod: checked,
        // company: '',
        // transaction_id: '',
      },
      shipping: {
        firstname: userFirstName,
        lastname: userLastName,
        address: addressLine1,
        city: city,
        zip: pincode,
        country: country,
        state: state,
        email: userEmail,
        phone: userPhone || '1234',
        notes: '',
        // company: '',
        // paymentMethod: 'Cash On Delivery',
        // transaction_id: '',
      },
      // products: productArr,
      // cartTotal: cartAmount.toString(),
      // shippingAmount: !isEmpty(deliveryCharges)
      //   ? deliveryCharges.toString()
      //   : '',
      // taxAmount: !isEmpty(taxAmount) ? taxAmount.toString() : '',
      // discountAmount: !isEmpty(couponDiscount) ? couponDiscount.toString() : '',
      // couponCode: !isEmpty(couponCode) ? couponCode : '',
      // grandTotal: !isEmpty(cartAmount) ? cartAmount.toString() : '',
    };
    console.log(JSON.stringify(payload), 'payyyyl check');
    // return;
    if (checked !== 'Paypal') {
      dispatch(checkoutDetailsAction(payload, cartId, navigation));
    } else {
      navigation.navigate('PaypalPayment', { orderData: payload });
    }
    // } else {
    //   navigation.navigate('StripePayment');
    // }
  };
  return (
    <>
      <View style={styles.container}>
        <BackHeader navigation={navigation} name="Checkout" />
        <ScrollView>
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
              <View style={styles.line} />
              <View style={styles.label}>
                <AText fonts={FontStyle.semiBold} color="black">
                  Shipping
                </AText>
              </View>
            </View>
            <View style={styles.step}>
              <View style={styles.line} />
              <View style={styles.activedot} />
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
          <AddressWrapper>
            <AText color="black" fonts={FontStyle.semiBold} large>
              Billing Details
            </AText>
            <View style={styles.addresscard}>
              <RadioButtonWrapper>
                <AText mr="8px" color="black" fonts={FontStyle.semiBold} large>
                  {firstName}
                </AText>
              </RadioButtonWrapper>
              <AText color={GREYTEXT} fonts={FontStyle.semiBold}>
                {phone}
              </AText>
              <AText color={GREYTEXT}>
                {addressLine1}, {addressLine2}, {city}
              </AText>
              <AText mb="10px" color={GREYTEXT}>
                {state}, {pincode}
              </AText>
            </View>
            <AText color="black" fonts={FontStyle.semiBold} large>
              Shipping Method
            </AText>
            <View style={styles.addresscard}>
              <RadioButtonWrapper>
                <AText mr="8px" color="black" fonts={FontStyle.semiBold} large>
                  {cartSummary?.totalShipping === 0
                    ? 'FREE SHIPPING'
                    : 'SHIPPING'}
                </AText>
              </RadioButtonWrapper>
              <AText color={GREYTEXT} fonts={FontStyle.semiBold}>
                {cartSummary?.totalShipping === 0
                  ? formatCurrency(0, currencyOptions, currencySymbol)
                  : formatCurrency(
                      cartSummary?.totalShipping,
                      currencyOptions,
                      currencySymbol,
                    )}
                (3-10 Business Days)
              </AText>
            </View>
          </AddressWrapper>
          <AText ml="30px" color="black" fonts={FontStyle.semiBold} large>
            Order Summary
          </AText>
          {cartProducts.map((product) => (
            <ItemWrapper key={product.id}>
              <ItemImage
                source={{
                  uri: !isEmpty(product.productImage)
                    ? URL + product.productImage
                    : 'https://www.hbwebsol.com/wp-content/uploads/2020/07/category_dummy.png',
                }}
              />
              <ItemDescription>
                <AText medium heavy>
                  {product.productTitle.length > 20
                    ? product.productTitle.substring(0, 20) + '...'
                    : product.productTitle}
                </AText>
                <AttributedWrapper>
                  <AText small light>
                    Qty:{' '}
                    <AText small heavy>
                      {product.qty}
                    </AText>
                  </AText>
                </AttributedWrapper>
              </ItemDescription>
              <ItemDescription2>
                <PriceQtyWrapper>
                  <AText>
                    {formatCurrency(
                      product.productPrice,
                      currencyOptions,
                      currencySymbol,
                    )}
                  </AText>
                </PriceQtyWrapper>
              </ItemDescription2>
            </ItemWrapper>
          ))}
          <AText ml="30px" color="black" fonts={FontStyle.semiBold} large>
            Payment Mode
          </AText>
          <View style={styles.addresscard2}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <RadioButton
                color={APP_PRIMARY_COLOR}
                value="Cash On Delivery"
                status={
                  checked === 'Cash On Delivery' ? 'checked' : 'unchecked'
                }
                onPress={() => setChecked('Cash On Delivery')}
              />
              <AText style={{ color: 'black' }}>Cash On Delivery</AText>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <RadioButton
                color={APP_PRIMARY_COLOR}
                value="Stripe"
                status={checked === 'Stripe' ? 'checked' : 'unchecked'}
                onPress={() => setChecked('Stripe')}
              />
              <AText style={{ color: 'black' }}>Stripe</AText>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <RadioButton
                color={APP_PRIMARY_COLOR}
                value="Paypal"
                status={checked === 'Paypal' ? 'checked' : 'unchecked'}
                onPress={() => setChecked('Paypal')}
              />
              <AText style={{ color: 'black' }}>Paypal</AText>
            </View>

            {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <RadioButton
                color={APP_PRIMARY_COLOR}
                value="Paypal"
                status={checked === 'Paypal' ? 'checked' : 'unchecked'}
                onPress={() => setChecked('Paypal')}
              />
              <AText style={{ color: 'black' }}>Paypal</AText>
            </View> */}
          </View>
          {/* <AText ml="30px" color="black" fonts={FontStyle.semiBold} large>
            Coupon Code
          </AText>
          <View style={styles.addresscard2}>
            <TextInput bw={0} pb={15} placeholder={'Enter Coupon Code'} />
            <View style={{ width: '60%', alignSelf: 'center', marginTop: 10 }}>
              <AButton
                small
                title="Apply Coupon"
                round
                onPress={() => {
                  alert('YOYO');
                }}
              />
            </View>
          </View> */}
          <AText ml="30px" color="black" fonts={FontStyle.semiBold} large>
            Cart Total
          </AText>
          <Shippingwrapper>
            <DataTable>
              <DataTable.Row>
                <DataTable.Cell>Cart Total</DataTable.Cell>
                <DataTable.Cell numeric>
                  <AText capitalize>
                    {formatCurrency(
                      cartSummary?.mrpTotal,
                      currencyOptions,
                      currencySymbol,
                    )}
                  </AText>
                </DataTable.Cell>
              </DataTable.Row>
              <DataTable.Row>
                <DataTable.Cell>Taxes</DataTable.Cell>
                <DataTable.Cell numeric>
                  {cartSummary.totalTax === 0 ? 'Free' : cartSummary.totalTax}
                </DataTable.Cell>
              </DataTable.Row>

              <DataTable.Row>
                <DataTable.Cell>Shipping</DataTable.Cell>
                <DataTable.Cell numeric>
                  {cartSummary?.totalShipping === 0
                    ? 'FREE SHIPPING'
                    : formatCurrency(
                        cartSummary?.totalShipping,
                        currencyOptions,
                        currencySymbol,
                      )}
                </DataTable.Cell>
              </DataTable.Row>

              {cartSummary?.discountTotal > 0 && (
                <DataTable.Row>
                  <DataTable.Cell>
                    Coupon code
                    <AText bold>
                      {!isEmpty(couponCode) && ' (' + couponCode + ')'}
                    </AText>{' '}
                  </DataTable.Cell>
                  <DataTable.Cell numeric>
                    <AText color={'green'}>
                      -{' '}
                      {formatCurrency(
                        cartSummary?.discountTotal,
                        currencyOptions,
                        currencySymbol,
                      )}
                    </AText>
                  </DataTable.Cell>
                </DataTable.Row>
              )}
              <Divider style={{ backgroundColor: 'black' }} />
              <DataTable.Row>
                <DataTable.Cell>Total</DataTable.Cell>
                <DataTable.Cell numeric>
                  {formatCurrency(
                    cartSummary?.grandTotal,
                    currencyOptions,
                    currencySymbol,
                  )}
                </DataTable.Cell>
              </DataTable.Row>
            </DataTable>
          </Shippingwrapper>
          <BottomSpacer />
          <View style={{ width: '60%', alignSelf: 'center' }}>
            <AButton
              title="Place Order"
              round
              onPress={() => {
                checkoutDetails();
              }}
            />
          </View>
        </ScrollView>
      </View>
    </>
  );
};

CheckoutScreen.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

const Shippingwrapper = styled.View`
  padding: 10px;
  background: white;
  margin-top: 10px;
  margin-bottom: 20px;
  margin-horizontal: 30px;
`;
const PriceWrapper = styled.View``;

const AddressWrapper = styled.View`
  margin-bottom: 10px;
  margin-horizontal: 30px;
`;

const RadioButtonWrapper = styled.TouchableOpacity`
  // justify-content: space-between;
  margin-bottom: 10px;
  align-items: center;
  align-self: flex-end;
  flex-direction: row;
  width: 98%;
`;
const BottomSpacer = styled.View`
  margin-bottom: 25px;
`;
const ItemWrapper = styled.TouchableOpacity`
  flex: 1;
  margin-horizontal: 30px;
  padding-horizontal: 5px;
  padding-vertical: 5px;
  flex-direction: row;
  justify-content: space-between;
  height: 75px;
  // margin-top: 10px;
  // margin-bottom: 10px;
  border-radius: 10px;
  background: white;
  overflow: hidden;
  position: relative;
  border: 1px solid #f7f7f7;
  box-shadow: 0 0 5px #eee;
  elevation: 1;
`;
const ItemImage = styled.ImageBackground`
  width: 60px;
  height: 60px;
  resize-mode: cover;
`;
const ItemDescription = styled.View`
  flex: 1;
  padding: 10px;
`;
const ItemDescription2 = styled.View`
  flex: 1;
  padding: 10px;
  align-items: flex-end;
  justify-content: center;
`;
const AttributedWrapper = styled.View`
  margin-bottom: 5px;
  margin-top: 5px;
  flex-direction: row;
`;
const PriceQtyWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 5px;
`;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: Colors.whiteColor,
    // paddingHorizontal: 30,
  },
  activedot: {
    top: 5,
    right: 5,
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
    // borderWidth: 1,
    // borderColor: '#f7f7f7',
    // boxShadow: 0 0 5px #eee,
    borderRadius: 8,
    elevation: 3,
  },
  addresscard2: {
    marginHorizontal: 30,
    paddingHorizontal: 20,
    paddingVertical: 9,
    marginVertical: 10,
    backgroundColor: '#fff',
    // borderWidth: 1,
    // borderColor: '#f7f7f7',
    // boxShadow: 0 0 5px #eee,
    borderRadius: 8,
    elevation: 3,
  },
});
export default CheckoutScreen;
