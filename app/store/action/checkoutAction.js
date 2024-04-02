import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import {
  ADD_CHECKOUT,
  ADD_ORDER,
  ADD_TOCART,
  CHECK_ZIPCODE,
  UPDATE_PAYMENT_STATUS,
} from '../../queries/orderQuery';
import { getValue, isEmpty } from '../../utils/helper';
import { mutation, query } from '../../utils/service';
import { ALERT_ERROR } from '../reducers/alert';
import { updateCartAction } from './cartAction';
import NavigationConstants from '../../navigation/NavigationConstants';
import _ from 'lodash';

export const checkoutDetailsAction =
  (checkoutDetailsData, cartId, navigation) => async (dispatch) => {
    dispatch({ type: CHECKOUT_LOADING });

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
        dispatch({ type: CHEKOUT_DETAILS, payload: checkoutDetailsData });

        const cartData = { id: cartId, products: [] };
        dispatch(updateCartAction(cartData, checkoutDetailsData.customer_id));
        checkoutDetailsData.billing.paymentMethod === 'Cash On Delivery'
          ? navigation.navigate(NavigationConstants.THANK_YOU_SCREEN)
          : navigation.navigate(NavigationConstants.STRIPE_PAYMENT, {
              url: response.data.addOrder.redirectUrl,
            });
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

export const checkPincodeValid =
  (payload, navigation, navParams) => async (dispatch) => {
    dispatch({ type: CHECKOUT_LOADING });

    try {
      const response = await query(CHECK_ZIPCODE, payload);

      if (!isEmpty(response) && _.get(response, 'data.checkZipcode.success')) {
        navigation.navigate('ShippingMethod', navParams);
      } else {
        dispatch({
          type: ALERT_ERROR,
          payload: _.get(
            response,
            'data.checkZipcode.message',
            'Invalid zipcode.',
          ),
        });
      }
    } catch (error) {
      console.log('error', error);
      dispatch({ type: CART_FAIL });
    }
  };

export const paymentStatus =
  (paymentStatusData, navigation) => async (dispatch) => {
    dispatch({ type: CHECKOUT_LOADING });

    try {
      const response = await mutation(UPDATE_PAYMENT_STATUS, paymentStatusData);
      console.log(response, ' Cart payment Status');
      if (!isEmpty(response)) {
        navigation.navigate(NavigationConstants.THANK_YOU_SCREEN);
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
