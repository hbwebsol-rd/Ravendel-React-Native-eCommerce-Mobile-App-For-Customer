import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, BackHandler } from 'react-native';
import { AButton, AText, AppLoader, BackHeader, MainLayout } from '../../theme-components';
import NavigationConstants from '../../navigation/NavigationConstants';
import Icon from 'react-native-vector-icons/Ionicons';
import { APP_PRIMARY_COLOR, FontStyle, GREYTEXT } from '../../utils/config';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { getOrder } from '../../store/action/checkoutAction';
import CartProductDisplayCard from '../../theme-components/cartProductDisplayCard';
import CartPriceTags from '../components/cartPriceTags';
import { AppSettingAction } from '../../store/action';
import AIcon from 'react-native-vector-icons/AntDesign';
import Colors from '../../constants/Colors';

const OrderDetailScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const [orderDetails, setOrderDetails] = useState({});
  // var cartProducts = route?.params?.cartProducts;
  var orderId = route?.params?.orderId;
  console.log(orderId, ' ooid');
  const mrpArray = [
    { id: 1, name: 'Total MRP', value: 'mrpTotal' },
    { id: 2, name: 'Discount On MRP', value: 'discountTotal' },
    { id: 3, name: 'Discount By Coupon', value: 'couponDiscountTotal' },
    { id: 4, name: 'Shipping Fee', value: 'totalShipping' },
    { id: 5, name: 'Total Amount', value: 'grandTotal' },
  ];
  const { loading } = useSelector((state) => state.cart);


  useEffect(() => {
    getOrderDetail();
    dispatch(AppSettingAction());
  }, []);

  const getOrderDetail = async () => {
    let payload = { id: orderId };
    const orderDetail = await dispatch(getOrder(payload));
    setOrderDetails(orderDetail);
  };

  return (
    <MainLayout hideScroll>
      {loading ? (
        <AppLoader />
      ) : orderDetails ? (
        <ScrollView
          contentContainerStyle={styles.scollContentContainerStyle}
          style={styles.scrollContainer}>
          <View style={{ alignItems: 'center',flexDirection:'row',marginHorizontal:15 }}>
            <AIcon name="arrowleft" onPress={() => navigation.goBack()} size={22} color={Colors.blackColor} />
            <AText style={styles.headerTextStyle} large>
              Order Summary
            </AText>
          </View>
          {/* <BackHeader navigation={navigation} name="Ordered Summary" /> */}

          <View>
            <View style={styles.contentContainerStyle}>
              <AText style={{...styles.textContentStyle,marginBottom:5}} medium>
                Order Information
              </AText>
              <View style={{...styles.container,marginBottom:0}}>
                <AText style={styles.textContentStyle} small>
                  Order Number
                </AText>
                <AText style={styles.textContentStyle} small>
                  {orderDetails?.orderNumber}
                </AText>
              </View>
              <View style={styles.container}>
                <AText style={styles.textContentStyle} small>
                  Date
                </AText>
                <AText style={styles.textContentStyle} small>
                  {moment(new Date()).format('ll')}
                </AText>
              </View>
            </View>
            <View style={styles.contentContainerStyle}>
              <AText style={styles.textContentStyle} medium>
                Billing Address
              </AText>
              <View>
                <AText style={{textTransform:'capitalize'}} color={GREYTEXT} fonts={FontStyle.semiBold}>
                  {orderDetails?.billing?.firstname}{' '}
                  {orderDetails?.billing?.lastname}
                </AText>
                <AText color={GREYTEXT}>
                  {orderDetails?.billing?.address}, {orderDetails?.billing?.city}{' '}
                  {orderDetails?.billing?.state}, {orderDetails?.billing?.zip}
                </AText>
              </View>
            </View>
            <View style={styles.contentContainerStyle}>
              <AText style={styles.textContentStyle} medium>
                Shipping Address
              </AText>
              <View>
                <AText style={{textTransform:'capitalize'}} color={GREYTEXT} fonts={FontStyle.semiBold}>
                  {orderDetails?.shipping?.firstname}{' '}
                  {orderDetails?.shipping?.lastname}
                </AText>
                <AText color={GREYTEXT}>
                  {orderDetails?.shipping?.address},{' '}
                  {orderDetails?.shipping?.city} {orderDetails?.shipping?.state}
                  , {orderDetails?.shipping?.zip}
                </AText>
              </View>
            </View>
            <View style={styles.contentContainerStyle}>
              <AText color={GREYTEXT} style={styles.textContentStyle} medium>
                Payment Mode:{' '}
                {orderDetails?.billing?.paymentMethod === 'cashondelivery'
                  ? 'Cash On Delivery'
                  : orderDetails?.billing?.paymentMethod === 'razorpay'
                  ? 'Razorpay'
                  : orderDetails?.billing?.paymentMethod === 'stripe'
                  ? 'Stripe'
                  : ''}
              </AText>
            </View>

            <View style={styles.priceTagStyle}>
              {orderDetails?.products ? (
                <CartProductDisplayCard
                  navigation={navigation}
                  cartProducts={orderDetails.products}
                  ShowIncrementDecreement={false}
                  navigateProduct={true}
                />
              ) : null}
            </View>
            {orderDetails?.totalSummary && (
              <View style={styles.priceTagStyle}>
                {mrpArray.map((item) => (
                  <CartPriceTags
                    item={item}
                    cartSummary={orderDetails?.totalSummary}
                    couponDiscount={orderDetails?.totalSummary?.couponDiscountTotal>0?true:false}
                  />
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      ) : null}
      {/* <AButton style={styles.homeBtnStyle} onPress={() => navigation.navigate(NavigationConstants.HOME_SCREEN)} title="BACK" /> */}
    </MainLayout>
  );
};
const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  textContentStyle: {
    color: '#000',
    fontFamily: FontStyle.fontBold,
  },
  headerTextStyle: {
    color: '#000',
    // marginBottom: 5,
    marginLeft:15,
    fontFamily: FontStyle.fontBold,
  },
  scollContentContainerStyle: {
    flexGrow: 1,
    paddingTop: 15,
    paddingBottom: 75,
  },
  contentContainerStyle: {
    marginHorizontal: 15,
    marginTop: 15,
    marginBottom: 10,
  },
  homeBtnStyle: {
    borderRadius: 25,
    marginHorizontal: 10,
    width: '60%',
    paddingVertical: 10,
    alignSelf: 'center',
    position: 'absolute',
    bottom: 15,
  },
  priceTagStyle: {
    width: '92%',
    marginHorizontal: 17,
    marginBottom: 5,
    marginTop: 25,
  },
});

export default OrderDetailScreen;
