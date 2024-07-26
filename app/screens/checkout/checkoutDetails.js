import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
} from 'react-native';
import {
  AText,
  AButton,
  BackHeader,
  AppLoader,
  MainLayout,
} from '../../theme-components';
import { isEmpty } from '../../utils/helper';
import { useDispatch, useSelector } from 'react-redux';
import { FontStyle } from '../../utils/config';
import { applyCouponAction, checkStorageAction, } from '../../store/action';
import Colors from '../../constants/Colors';
import PropTypes from 'prop-types';
import { checkoutDetailsAction, getShippingMethods } from '../../store/action/checkoutAction';
import { COUPON_REMOVED } from '../../store/action/cartAction';
import CartProductDisplayCard from '../../theme-components/cartProductDisplayCard';
import CartPriceTags from '../components/cartPriceTags';
import CouponSection from './component/couponSection';
import ShippingOrPaymentSection from './component/ShippingOrPaymentSection';

const CheckoutDetails = ({ navigation }) => {

  const dispatch = useDispatch();

  const { userDetails } = useSelector((state) => state.customer);
  const cartItems = useSelector((state) => state.cart.products);
  const { shippingMethodList, loading } = useSelector((state) => state.checkoutDetail);
  const { paymentSetting } = useSelector((state) => state.settings);
  const [paymentMethod, setPaymentMethod] = useState('CASH_ON_DELIVERY');
  const [couponCode, setCouponCode] = useState('');

  const [couponApplied, setCouponApplied] = useState(false);
  const [shippingMethod, setShippingMethod] = useState('');
  const {
    cartSummary,
    couponDiscount,
    cartId,
    shippingAddress,
    billingAddress,
  } = useSelector((state) => state.cart);

  const {
    pincode: shipping_pincode,
    state: shipping_state,
    city: shipping_city,
    addressLine1: shipping_addressLine1,
    phone: shipping_phone,
    lastName: shipping_lastName,
    firstName: shipping_firstName,
    country: shipping_country,
  } = shippingAddress;

  const {
    pincode: biller_pincode,
    state: biller_state,
    city: biller_city,
    addressLine1: biller_addressLine1,
    phone: biller_phone,
    lastName: biller_lastName,
    firstName: biller_firstName,
    country: biller_country,
  } = billingAddress;

  const { email: userEmail, _id } = userDetails;

  const mrpArray = [
    { id: 1, name: 'Total MRP', value: 'mrpTotal' },
    { id: 2, name: 'Discount On MRP', value: 'discountTotal' },
    { id: 3, name: 'Discount By Coupon', value: 'couponDiscount' },
    { id: 4, name: 'Shipping Fee', value: 'totalShipping' },
    { id: 5, name: 'Total Amount', value: 'grandTotal' },
  ]
  useEffect(() => {
    dispatch(getShippingMethods());
  }, []);

  const removeCoupon = () => {
    dispatch({
      type: COUPON_REMOVED,
    });
    setCouponApplied(false);
    setCouponCode('');
    dispatch(checkStorageAction(userDetails._id));
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

  const checkoutDetails = () => {
    if (isEmpty(shippingMethod)) {
      alert('Please select shipping Method');
      return;
    }
    // if (checked === 'cod') {
    const payload = {
      userId: _id,
      billing: {
        lastname: biller_lastName,
        firstname: biller_firstName,
        address: biller_addressLine1,
        city: biller_city,
        zip: biller_pincode,
        country: biller_country,
        state: biller_state,
        email: userEmail,
        phone: biller_phone || '1234',
        paymentMethod: paymentMethod
          .replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '')
          .toLowerCase(),
      },
      shipping: {
        firstname: shipping_firstName,
        lastname: shipping_lastName,
        address: shipping_addressLine1,
        city: shipping_city,
        zip: shipping_pincode,
        country: shipping_country,
        state: shipping_state,
        email: userEmail,
        phone: shipping_phone || '1234',
        notes: '',
      },
    };
    const navParams = {
      cartProducts: cartItems,
      shippingMethod: shippingMethod,
      paymentMethod: paymentMethod,
    };
    // return;
    if (paymentMethod.toLowerCase() !== 'paypal') {
      dispatch(
        checkoutDetailsAction(
          payload,
          cartId,
          navigation,
          navParams,
          paymentSetting,
          cartSummary?.grandTotal,
        ),
      );
    } else {
      navigation.navigate('PaypalPayment', { orderData: payload });
    }
    // } else {
    //   navigation.navigate('StripePayment');
    // }
  };

  if (loading) {
    return <AppLoader />;
  }

  return (
    <MainLayout hideScroll={true} style={styles.container}>
      <BackHeader navigation={navigation} name="Checkout" />

      <ScrollView
        contentContainerStyle={styles.scrollContentContainerStyle}
        style={styles.scrollStyle}>
        <CouponSection
          couponCode={couponCode}
          setCouponCode={setCouponCode}
          couponApplied={couponApplied}
          removeCoupon={removeCoupon}
          ApplyCoupon={ApplyCoupon}
        />
        <ShippingOrPaymentSection
          title={'Shipping Method'}
          data={shippingMethodList}
          selected={shippingMethod}
          setSelected={setShippingMethod}
        />
        <ShippingOrPaymentSection
          title={'Payment Mode'}
          data={Object.values(paymentSetting).filter((item => item.enable))}
          selected={paymentMethod}
          setSelected={(item) => { setPaymentMethod(item.__typename) }}
        />
        <View style={styles.containerStyles}>
          <AText style={styles.orderTextStyle} large>
            Order Summary
          </AText>
          <CartProductDisplayCard
            navigation={navigation}
            cartProducts={cartItems}
            ShowIncrementDecreement={false} />
        </View>
        <View style={{ width: '100%', marginBottom: 25, marginTop: 25 }}>
          {mrpArray.map((item) => <CartPriceTags item={item} cartSummary={cartSummary} couponDiscount={couponDiscount} />)}
        </View>
      </ScrollView>


      <AButton
        disabled={paymentMethod === '' ? true : false}
        title="PLACE ORDER"
        style={styles.placeOrderBtn}
        onPress={() => checkoutDetails()}
      />
    </MainLayout>
  );
};

CheckoutDetails.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
    backgroundColor: Colors.whiteColor,
  },
  containerStyles: { marginTop: 25 },
  scrollContentContainerStyle: {
    paddingBottom: 45,
  },
  orderTextStyle: {
    color: '#000',
    marginBottom: 5,
    fontFamily: FontStyle.fontBold
  },
  scrollStyle: {
    marginHorizontal: 15,
    flex: 1,
    marginTop: 45,
  },
  placeOrderBtn: {
    borderRadius: 25,
    position: 'absolute',
    bottom: 0,
    width: '50%',
    alignSelf: 'center',
  },
});
export default CheckoutDetails;
