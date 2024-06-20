import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  BackHandler,
} from 'react-native';
import { AButton, AText, AppLoader } from '../../theme-components';
import Colors from '../../constants/Colors';
import NavigationConstants from '../../navigation/NavigationConstants';
import Icon from 'react-native-vector-icons/Ionicons';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { APP_PRIMARY_COLOR, FontStyle, GREYTEXT } from '../../utils/config';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/native';
import { formatCurrency, isEmpty } from '../../utils/helper';
import { ProductPriceText } from '../components';
import moment from 'moment';
import { getOrder } from '../../store/action/checkoutAction';

const MyComponent = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const [orderDetails, setOrderDetails] = useState({});
  var paymentMethod = route?.params?.paymentMethod;
  var shippingMethod = route?.params?.shippingMethod;
  var cartProducts = route?.params?.cartProducts;
  var orderId = route?.params?.orderId;

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );
    return () => backHandler.remove();
  }, []);
  const { shippingAddress, billingAddress, loading } = useSelector(
    (state) => state.cart,
  );
  const { currencySymbol, currencyOptions } = useSelector(
    (state) => state.settings,
  );

  useEffect(() => {
    getOrderDetail();
  }, []);

  const getOrderDetail = async () => {
    let payload = { id: orderId };
    const orderDetail = await dispatch(getOrder(payload));
    console.log(orderDetail, 'orderDetail');
    setOrderDetails(orderDetail);
  };
  console.log(orderDetails, 'orderDetails?.totalSummary');
  return (
    <>
      {loading ? <AppLoader /> : null}
      {orderDetails ? (
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: 35,
            paddingBottom: 5,
          }}
          style={styles.container}>
          <View style={{ alignItems: 'center' }}>
            <Icon
              name={'checkmark-circle'}
              size={30}
              color={APP_PRIMARY_COLOR}
            />
            <AText color="black" mb={'5px'} fonts={FontStyle.fontBold} large>
              Ordered Placed Successfully
            </AText>
          </View>
          <View>
            <View style={styles.contentContainerStyle}>
              <AText color="black" mb={'5px'} fonts={FontStyle.semiBold} medium>
                Order Information
              </AText>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <AText
                  color="black"
                  mb={'5px'}
                  fonts={FontStyle.fontBold}
                  small>
                  Order Number
                </AText>
                <AText color="black" mb={'5px'} fonts={FontStyle.fv} small>
                  {orderDetails?.orderNumber}
                </AText>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <AText
                  color="black"
                  mb={'5px'}
                  fonts={FontStyle.fontBold}
                  small>
                  Date
                </AText>
                <AText
                  color="black"
                  mb={'5px'}
                  fonts={FontStyle.fontRegular}
                  small>
                  {moment(new Date()).format('ll')}
                </AText>
              </View>
            </View>
            <View style={styles.contentContainerStyle}>
              <AText
                color="black"
                mb={'10 px'}
                fonts={FontStyle.semiBold}
                medium>
                Billing Address
              </AText>
              <View>
                {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MIcon
                  name={
                    billingAddress.addressType == 'Home'
                      ? 'home-outline'
                      : 'briefcase-outline'
                  }
                  size={17}
                  color={APP_PRIMARY_COLOR}
                />
                <AText
                  ml="5px"
                  color={APP_PRIMARY_COLOR}
                  fonts={FontStyle.semiBold}>
                  {billingAddress.addressType}
                </AText>
              </View> */}
                <AText color={GREYTEXT} fonts={FontStyle.semiBold}>
                  {orderDetails?.billing?.firstname}{' '}
                  {orderDetails?.billing?.lastname}
                </AText>
                <AText mt={'10px'} color={GREYTEXT}>
                  {orderDetails?.billing?.address},{orderDetails?.billing?.city}{' '}
                  {orderDetails?.billing?.state}, {orderDetails?.billing?.zip}
                </AText>
              </View>
            </View>
            <View style={styles.contentContainerStyle}>
              <AText
                color="black"
                mb={'10px'}
                fonts={FontStyle.semiBold}
                medium>
                Shipping Address
              </AText>
              <View>
                <AText color={GREYTEXT} fonts={FontStyle.semiBold}>
                  {orderDetails?.shipping?.firstname}{' '}
                  {orderDetails?.shipping?.lastname}
                </AText>
                <AText mt={'10px'} color={GREYTEXT}>
                  {orderDetails?.shipping?.address}, ,{' '}
                  {orderDetails?.shipping?.city} {orderDetails?.shipping?.state}
                  ,{orderDetails?.shipping?.zip}
                </AText>
              </View>
            </View>
            {/* <View style={styles.contentContainerStyle}>
              <AText color="black" mb={'5px'} fonts={FontStyle.semiBold} medium>
                Shipping Method
              </AText>
              <AText
                color="black"
                mb={'10px'}
                fonts={FontStyle.fontRegular}
                small>
                {shippingMethod.name}
              </AText>
            </View> */}
            <View style={styles.contentContainerStyle}>
              <AText
                color="black"
                mb={'10px'}
                fonts={FontStyle.semiBold}
                medium>
                Payment Mode
              </AText>
              <AText
                color="black"
                mb={'10px'}
                fonts={FontStyle.fontRegular}
                small>
                Payment Mode: {orderDetails?.billing?.paymentMethod}
              </AText>
            </View>

            <View
              style={{
                width: '92%',
                marginHorizontal: 17,
                marginBottom: 5,
                marginTop: 25,
              }}>
              {cartProducts.map((product, index) => (
                <View style={styles.productitem} key={index}>
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
                            price: product.mrp,
                          }}
                        />

                        <View style={styles.qtyContainerStyle}>
                          <AText ml={'5px'} center small bold>
                            Qty: {product.qty}
                          </AText>
                        </View>
                      </View>
                    </View>
                  </ItemDescription>
                </View>
              ))}
            </View>
            <View
              style={{
                width: '92%',
                marginHorizontal: 17,
                marginBottom: 5,
                marginTop: 25,
              }}>
              <View style={styles.summary}>
                <AText fonts={FontStyle.semiBold}>Total MRP</AText>
                <AText color={Colors.grayColor}>
                  {formatCurrency(
                    orderDetails?.totalSummary?.mrpTotal,
                    currencyOptions,
                    currencySymbol,
                  )}
                </AText>
              </View>
              <View style={styles.summary}>
                <AText fonts={FontStyle.semiBold}>Discount On MRP</AText>
                <AText color={Colors.green}>
                  -{' '}
                  {formatCurrency(
                    orderDetails?.totalSummary?.discountTotal,
                    currencyOptions,
                    currencySymbol,
                  )}
                </AText>
              </View>
              {/* {couponDiscount && (
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
          )} */}
              <View
                style={{
                  ...styles.summary,
                  borderBottomWidth: 0.5,
                  paddingBottom: 15,
                }}>
                <AText fonts={FontStyle.semiBold}>Shipping Fee</AText>
                <AText
                  fonts={
                    orderDetails?.totalSummary?.totalShipping === 0
                      ? FontStyle.semiBold
                      : FontStyle.fontRegular
                  }
                  color={Colors.grayColor}>
                  {orderDetails?.totalSummary?.totalShipping === 0
                    ? 'FREE SHIPPING'
                    : formatCurrency(
                        orderDetails?.totalSummary?.totalShipping,
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
                    <AText color="gray">{orderDetails?.totalSummary?.totalTax}</AText>
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
                    orderDetails?.totalSummary?.grandTotal,
                    currencyOptions,
                    currencySymbol,
                  )}
                </AText>
              </View>
            </View>
          </View>

          {/* <Text style={styles.text}>Thank you for Shopping from Raavendal</Text> */}
          <AButton
            ml="50px"
            mr="50px"
            onPress={() => navigation.navigate(NavigationConstants.HOME_SCREEN)}
            round
            title="Home"
          />
        </ScrollView>
      ) : null}
    </>
  );
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

    backgroundColor: '#fff',
  },
  contentContainerStyle: { marginHorizontal: 15, marginTop: 15 },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
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
});

export default MyComponent;
