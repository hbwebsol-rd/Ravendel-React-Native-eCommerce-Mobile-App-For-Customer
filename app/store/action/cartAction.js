// import AsyncStorage from '@react-native-community/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ADD_CART,
  ADD_TOCART,
  APPLY_COUPAN,
  APPLY_COUPON,
  APPLY_COUPON_CODE,
  CALCULATE_CART,
  CALCULATE_CART_WITHOUT_LOGIN,
  CART,
  CHANGE_QTY,
  DELETE_CART,
  DELETE_CART_PRODUCT,
  ORDER_HISTORY,
  UPDATE_CART,
} from '../../queries/orderQuery';
import { getToken, getValue, isEmpty } from '../../utils/helper';
import { mutation, query } from '../../utils/service';
import { ALERT_ERROR, ALERT_SUCCESS } from '../reducers/alert';
import _ from 'lodash';

export const checkStorageAction = (userID, load) => async (dispatch) => {
  if (!isEmpty(userID)) {
    if (!load) {
      dispatch({
        type: CART_LOADING,
      });
    }
    try {
      const response = await query(CALCULATE_CART, { id: userID });

      const cartProducts = _.get(response, 'data.calculateCart.cartItems', []);
      const cartSummary = _.get(
        response,
        'data.calculateCart.totalSummary',
        {},
      );
      const cartID = _.get(response, 'data.calculateCart.id', '');
      dispatch({
        type: CHECK_STORAGE,
        payload: { cartProducts, cartSummary, cartID },
      });
    } catch (error) {
      console.log('error in check storage', error);
      if (_.get(error, 'message') === 'Cart not found') {
        const cartProduct = await AsyncStorage.getItem('cartproducts');
        if (!isEmpty(cartProduct)) {
          const filteredProducts = [];
          const mergedArr = JSON.parse(cartProduct);
          mergedArr.forEach((val) => {
            filteredProducts.push({
              productId: _.get(val, 'product_id', ''),
              productTitle: _.get(val, 'product_title', ''),
              qty: _.get(val, 'qty', 0),
              productImage: '',
              attributes: _.get(val, 'attributes', []),
            });
          });
          const cartData = { userId: userID, products: filteredProducts };
          dispatch(addCartAction(cartData));
        }
      }
      dispatch({ type: CART_EMPTY });
      dispatch({
        type: CHECK_STORAGE,
        payload: { cartProducts: [], cartID: '' },
      });
    }
  } else {
    dispatch({ type: CART_LOADING });
    try {
      const cartProduct = await AsyncStorage.getItem('cartproducts');
      const cartPayload = cartProduct
        ? JSON.parse(cartProduct).map((item) => ({
            productId: _.get(item, 'productId', ''),
            variantId: '',
            productTitle: _.get(item, 'productTitle', ''),
            attributes: _.get(item, 'attributes', []),
            qty: _.get(item, 'qty', 0),
          }))
        : [];

      const response = await query(CALCULATE_CART_WITHOUT_LOGIN, {
        cartItems: cartPayload,
      });

      dispatch({
        type: CHECK_LOCAL_STORAGE,
        payload: {
          cartProducts: _.get(response, 'data.calculateCart.cartItems', []),
          cartSummary: _.get(response, 'data.calculateCart.totalSummary', {}),
          cartID: '',
        },
      });
    } catch (error) {
      console.log('Cart Reducers', error);
    }
  }
};
export const removeCartItemAction = (cartProduct) => (dispatch) => {
  dispatch({
    type: REMOVE_ITEM_IN_CART,
    payload: cartProduct,
  });
};

export const addToCartAction = (payload) => async (dispatch) => {
  dispatch({ type: CART_LOADING });
  try {
    const response = await mutation(ADD_TOCART, payload);
    console.log(response, 'cart add response');

    const addToCartSuccess = _.get(response, 'data.addToCart.success', false);
    if (addToCartSuccess) {
      dispatch({ type: RESPONSE_HANDLE, payload: addToCartSuccess });
      dispatch(checkStorageAction(payload.userId));
    }
  } catch (error) {
    console.log('error', error);
    dispatch({ type: CART_FAIL });
  }
};

export const CartQtyAction = (payload) => async (dispatch) => {
  try {
    const response = await mutation(CHANGE_QTY, payload);
    const changeQtySuccess = _.get(response, 'data.changeQty.success', false);
    if (changeQtySuccess) {
      dispatch(checkStorageAction(payload.userId, true));
    }
  } catch (error) {
    console.log('error', error);
    dispatch({ type: CART_FAIL });
  }
};

export const addCartAction = (payload, isLoggin) => async (dispatch) => {
  dispatch({ type: CART_LOADING });
  console.log('payload', payload);
  try {
    const response = await mutation(ADD_CART, payload);
    if (
      !isEmpty(response.data.addCart) &&
      _.get(response, 'data.addCart.success', false)
    ) {
      dispatch({
        type: RESPONSE_HANDLE,
        payload: response.data.addCart.success,
      });
      dispatch(checkStorageAction(payload.user_id));
      await AsyncStorage.removeItem('cartproducts');
    }
  } catch (error) {
    console.log('error', error);
    dispatch({ type: CART_FAIL });
  }
};

export const updateCartAction = (payload, userID) => async (dispatch) => {
  dispatch({ type: CART_LOADING });
  try {
    const response = await mutation(UPDATE_CART, payload);
    if (!isEmpty(response.data.updateCart)) {
      dispatch({
        type: RESPONSE_HANDLE,
        payload: _.get(response, 'data.updateCart.success', false),
      });
      dispatch(checkStorageAction(userID));
      await AsyncStorage.removeItem('cartproducts');
    }
  } catch (error) {
    console.log('error', error);
    dispatch({ type: CART_FAIL });
  }
};

export const removeFromCartAction = (payload, userID) => async (dispatch) => {
  dispatch({ type: CART_LOADING });
  try {
    const response = await mutation(DELETE_CART_PRODUCT, payload);
    if (response) {
      const deleteCartProductSuccess = _.get(
        response,
        'data.deleteCartProduct.success',
        false,
      );
      if (deleteCartProductSuccess) {
        dispatch({ type: CART_FAIL });
        dispatch(checkStorageAction(userID));
      }
    }
  } catch (error) {
    console.log('error cartupdate', error);
    dispatch({ type: CART_FAIL });
    dispatch({
      type: ALERT_ERROR,
      payload: _.get(
        response,
        'data.calculateCoupon.message',
        'Something went wrong. Please try again later.',
      ),
    });
  }
};

export const removeCartAction = (userID) => async (dispatch) => {
  dispatch({ type: CART_LOADING });

  try {
    const response = await mutation(DELETE_CART, { userId: userID });
    console.log(response, 'delete cart response');

    // Check if response is not empty and has expected properties
    if (
      !isEmpty(response) &&
      !isEmpty(response.data.deleteCart) &&
      response.data.deleteCart.success
    ) {
      dispatch({ type: CART_FAIL });
      dispatch(checkStorageAction(userID));
    }
  } catch (error) {
    console.log('error cart update', error);
    dispatch({ type: CART_FAIL });
    dispatch({
      type: ALERT_ERROR,
      payload: _.get(
        error,
        'response.data.calculateCoupon.message',
        'Something went wrong. Please try again later.',
      ),
    });
  }
};

export const applyCouponAction =
  (payload, setCouponApplied) => async (dispatch) => {
    dispatch({ type: CART_LOADING });

    try {
      const response = await query(APPLY_COUPON_CODE, payload);
      console.log(JSON.stringify(response), 'coupon response');

      // Check if response is not empty and has expected properties
      if (
        !isEmpty(response) &&
        !isEmpty(response.data.calculateCoupon) &&
        response.data.calculateCoupon.message ===
          'Coupon code applied successfully'
      ) {
        dispatch({
          type: COUPON_APPLIED,
          payload: {
            couponDiscount: _.get(
              response,
              'data.calculateCoupon.couponCard.appliedCouponDiscount',
              '',
            ),
            cartProducts: _.get(response, 'data.calculateCoupon.cartItems', []),
            cartSummary: _.get(
              response,
              'data.calculateCoupon.totalSummary',
              {},
            ),
          },
        });
        dispatch({
          type: ALERT_SUCCESS,
          payload: _.get(
            response,
            'data.calculateCoupon.message',
            'Something went wrong. Please try again later.',
          ),
        });
        setCouponApplied(true);
      } else {
        dispatch({ type: CART_FAIL });
        dispatch({
          type: ALERT_ERROR,
          payload: _.get(
            response,
            'data.calculateCoupon.message',
            'Something went wrong. Please try again later.',
          ),
        });
      }
    } catch (error) {
      console.log('error', error);
      dispatch({ type: CART_FAIL });
      dispatch({
        type: ALERT_ERROR,
        payload: 'Something went wrong. Please try again later.',
      });
    }
  };

export const orderHistoryAction = (payload) => async (dispatch) => {
  dispatch({ type: ORDER_LOADING });

  try {
    const response = await query(ORDER_HISTORY, payload);
    console.log(response, 'order response');

    // Check if response is not empty and has expected properties
    if (
      !isEmpty(response) &&
      !isEmpty(response.data.orderbyUser) &&
      response.data.orderbyUser.message.success
    ) {
      dispatch({
        type: ORDER_SUCCESS,
        payload: _.get(response, 'data.orderbyUser.data', []),
      });
    } else {
      dispatch({ type: ORDER_LOAD_STOP });
      dispatch({
        type: ALERT_ERROR,
        payload: _.get(
          response,
          'data.calculateCoupon.message',
          'Something went wrong. Please try again later.',
        ),
      });
    }
  } catch (error) {
    console.log('error', error);
    dispatch({ type: ORDER_LOAD_STOP });
    dispatch({
      type: ALERT_ERROR,
      payload: 'Something went wrong. Please try again later.',
    });
  }
};
export const REMOVE_ITEM_IN_CART = 'REMOVE_ITEM_IN_CART';
export const CHECK_STORAGE = 'CHECK_STORAGE';
export const CART_LOADING = 'CART_LOADING';
export const ORDER_LOADING = 'ORDER_LOADING';
export const CART_FAIL = 'CART_FAIL';
export const ORDER_LOAD_STOP = 'ORDER_LOAD_STOP';
export const COUPON_APPLIED = 'COUPON_APPLIED';
export const COUPON_REMOVED = 'COUPON_REMOVED';
export const RESPONSE_HANDLE = 'RESPONSE_HANDLE';
export const ORDER_SUCCESS = 'ORDER_SUCCESS';
export const CART_EMPTY = 'CART_EMPTY';
export const CHECK_LOCAL_STORAGE = 'CHECK_LOCAL_STORAGE';
export const CHECK_CART = 'CHECK_CART';
