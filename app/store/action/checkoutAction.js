import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import {
  ADD_ORDER,
  ADD_TOCART,
  CHECK_ZIPCODE,
  SHIPPING_METHODS,
  UPDATE_PAYMENT_STATUS,
} from '../../queries/orderQuery';
import { getValue, isEmpty } from '../../utils/helper';
import { mutation, query } from '../../utils/service';
import { ALERT_ERROR } from '../reducers/alert';
import { CART_FAIL, updateCartAction } from './cartAction';
import NavigationConstants from '../../navigation/NavigationConstants';
import _ from 'lodash';
import RazorpayCheckout from 'react-native-razorpay';
import { APP_PRIMARY_COLOR } from '../../utils/config';

export const checkoutDetailsAction =
  (
    checkoutDetailsData,
    cartId,
    navigation,
    navParams,
    paymentSetting,
    totalAmt,
  ) =>
  async (dispatch) => {
    dispatch({ type: CHECKOUT_LOADING });
    console.log(checkoutDetailsData, 'chkdetil');
    try {
      const response = await mutation(ADD_ORDER, checkoutDetailsData);
      console.log(response, ' resssponse cart checkout');
      if (
        !isEmpty(response) &&
        !isEmpty(response.data.addOrder) &&
        response.data.addOrder.success
      ) {
        dispatch({ type: REMOVE_ALL_CART_PRODUCT });
        await AsyncStorage.removeItem('cartproducts');
        // dispatch({ type: CHEKOUT_DETAILS, payload: checkoutDetailsData });

        // const cartData = { id: cartId, products: [] };
        // dispatch(updateCartAction(cartData, checkoutDetailsData.customer_id));
        const cartData = { id: cartId, products: [] };
        dispatch(updateCartAction(cartData, checkoutDetailsData.customer_id));
        checkoutDetailsData.billing.paymentMethod === 'stripe'
          ? navigation.navigate(NavigationConstants.STRIPE_PAYMENT, {
              url: response.data.addOrder.redirectUrl,
              navParams: navParams,
            })
          : checkoutDetailsData.billing.paymentMethod === 'cashondelivery' ||
            checkoutDetailsData.billing.paymentMethod === 'banktransfer'
          ? navigation.navigate(NavigationConstants.THANK_YOU_SCREEN, {
              ...navParams,
              orderId: response.data.addOrder.id,
            })
          : '';
        if (checkoutDetailsData.billing.paymentMethod === 'razorpay') {
          console.log('opening rzor');
          var options = {
            description: 'Credits towards Ravendal',
            image: 'https://i.imgur.com/3g7nmJC.png',
            currency: 'INR',
            key: paymentSetting.razorpay.live_client_id, // Your api key
            amount: totalAmt * 100, //cartSummary?.grandTotal * 100,
            name: 'Ravendal',
            prefill: {
              email: 'void@razorpay.com',
              contact: '9191919191',
              name: 'Razorpay Software',
            },
            theme: { color: APP_PRIMARY_COLOR },
          };
          RazorpayCheckout.open(options)
            .then((data) => {
              // handle success
              const payload = {
                id: response.data.addOrder.id,
                paymentStatus: 'success',
              };
              console.log(`Success:`, data, payload);

              dispatch(paymentStatus(payload, navigation, navParams));
            })
            .catch((error) => {
              // handle failure
              dispatch({ type: CHECKOUT_LOADING_STOP });

              console.log(`Error: ${error.code} | ${error.description}`);
            });
        }
      } else {
        console.log(' some err occured');
        dispatch({ type: CHECKOUT_LOADING_STOP });
        dispatch({
          type: ALERT_ERROR,
          payload: 'Something went wrong. Please try again later. in order',
        });
      }
    } catch (error) {
      console.log(error, 'ppplll');
      dispatch({ type: CHECKOUT_LOADING_STOP });
      dispatch({
        type: ALERT_ERROR,
        payload: 'Something went wrong. Please try again later. in add order',
      });
    }
  };

export const checkPincodeValid =
  (payload, navigation, navParams) => async (dispatch) => {
    dispatch({ type: CHECKOUT_LOADING });

    try {
      const response = await query(CHECK_ZIPCODE, payload);
      if (!isEmpty(response) && _.get(response, 'data.checkZipcode.success')) {
        if (!isEmpty(navParams)) {
          dispatch({
            type: 'ADD_ADDRESS',
            payload: {
              shippingAddress: navParams.shippingAddress,
              billingAddress: navParams.billingAddress,
            },
          });
          navigation.navigate('ShippingMethod');
        } else {
          return true;
        }
      } else {
        dispatch({
          type: ALERT_ERROR,
          payload: _.get(
            response,
            'data.checkZipcode.message',
            'Invalid zipcode.',
          ),
        });
        return false;
      }
    } catch (error) {
      console.log('error', error);
      dispatch({ type: CART_FAIL });
    }
  };
export const getShippingMethods = () => async (dispatch) => {
  dispatch({ type: CHECKOUT_LOADING });
  try {
    const response = await query(SHIPPING_METHODS);
    if (
      !isEmpty(response) &&
      _.get(response, 'data.shipping.message.success')
    ) {
      dispatch({
        type: 'SHIPPING_LIST',
        payload: _.get(response, 'data.shipping.data.shippingClass', []),
      });
    } else {
      dispatch({ type: CHECKOUT_LOADING_STOP });
    }
  } catch (error) {
    console.log('error', error);
    dispatch({ type: CART_FAIL });
  }
};

export const paymentStatus =
  (paymentStatusData, navigation, navParams) => async (dispatch) => {
    dispatch({ type: CHECKOUT_LOADING });

    try {
      const response = await mutation(UPDATE_PAYMENT_STATUS, paymentStatusData);
      console.log(response, ' Cart payment Status');
      if (!isEmpty(response)) {
        navigation.navigate(NavigationConstants.THANK_YOU_SCREEN, navParams);
      } else {
        dispatch({ type: CHECKOUT_LOADING_STOP });
        dispatch({
          type: ALERT_ERROR,
          payload: 'Something went wrong. Please try again later.',
        });
      }
    } catch (error) {
      dispatch({ type: CHECKOUT_LOADING_STOP });
      dispatch({
        type: ALERT_ERROR,
        payload: 'Something went wrong. Please try again later.',
      });
    }
  };

export const CHEKOUT_DETAILS = 'CHEKOUT_DETAILS';
export const REMOVE_ALL_CART_PRODUCT = 'REMOVE_ALL_CART_PRODUCT';
export const UPDATE_CART_PRODUCT = 'UPDATE_CART_PRODUCT';
export const CHECKOUT_LOADING = 'CHECKOUT_LOADING';
export const CHECKOUT_LOADING_STOP = 'CHECKOUT_LOADING_STOP';
export const CHECKOUT_SUCCESS_STOP = 'CHECKOUT_SUCCESS_STOP';
