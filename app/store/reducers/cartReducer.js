import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  CART_EMPTY,
  CART_FAIL,
  CART_LOADING,
  CHECK_CART,
  CHECK_LOCAL_STORAGE,
  COUPON_APPLIED,
  COUPON_REMOVED,
  REMOVE_ITEM_IN_CART,
  RESPONSE_HANDLE,
} from '../action/cartAction';
import {
  REMOVE_ALL_CART_PRODUCT,
  UPDATE_CART_PRODUCT,
} from '../action/checkoutAction';

const initialState = {
  loading: false,
  products: [],
  cartSummary: {},
  cartId: '',
  couponDiscount: 0,
  response: false,
  cartChecked: false,
};

const setDataInStorage = async (product) => {
  try {
    await AsyncStorage.setItem('cartproducts', JSON.stringify(product));
  } catch (error) {
    console.log('Something went Wrong!!!!');
  }
};

const clearCartStorage = async () => {
  try {
    await AsyncStorage.removeItem('cartproducts');
  } catch (error) {
    console.log('Something went Wrong!!!!');
  }
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CART_LOADING:
      return {
        ...state,
        loading: true,
        cartChecked: false,
      };
    case CART_FAIL:
      return {
        ...state,
        loading: false,
      };
    case CART_EMPTY:
      return {
        ...state,
        loading: false,
        cartChecked: false,
      };

    case 'CHECK_STORAGE':
      return {
        ...state,
        products: action.payload.cartProducts,
        cartId: action.payload.cartID,
        cartSummary: action.payload.cartSummary,
        loading: false,
        cartChecked: true,
      };
    case CHECK_CART:
      return {
        ...state,
        cartId: action.payload.cartID,
        products: action.payload.cartProducts,
        loading: false,
      };
    case CHECK_LOCAL_STORAGE:
      return {
        ...state,
        products: action.payload.cartProducts,
        cartSummary: action.payload.cartSummary,
        loading: false,
      };

    case 'ADD_VALUE':
      return {
        ...state,
        products: [...state.products, action.payload],
      };

    case REMOVE_ITEM_IN_CART:
      setDataInStorage(action.payload);
      return {
        ...state,
        products: action.payload,
      };

    case 'REMOVE_ALL_VALUE':
      return {
        ...state,
        products: action.payload,
      };

    case REMOVE_ALL_CART_PRODUCT:
      clearCartStorage();
      return {
        ...state,
        products: [],
        couponDiscount: 0,
        response: false,
      };
    case UPDATE_CART_PRODUCT:
      return {
        ...state,
        products: action.payload,
        loading: false,
      };
    case COUPON_APPLIED:
      return {
        ...state,
        couponDiscount: action.payload.couponDiscount,
        products: action.payload.cartProducts,
        cartSummary: action.payload.cartSummary,
        loading: false,
      };
    case COUPON_REMOVED:
      return {
        ...state,
        couponDiscount: 0,
        loading: false,
      };
    case RESPONSE_HANDLE:
      return {
        ...state,
        loading: false,
        response: action.payload,
        cartChecked: false,
      };
    case 'USER_LOGOUT':
      return { ...initialState };
    default: {
      return state;
    }
  }
};
