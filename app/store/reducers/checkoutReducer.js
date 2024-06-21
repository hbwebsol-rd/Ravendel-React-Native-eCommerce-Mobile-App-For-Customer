import {
  CHECKOUT_LOADING,
  CHECKOUT_LOADING_STOP,
  CHECKOUT_SUCCESS_STOP,
} from '../action/checkoutAction';

const initialState = {
  chekoutDetails: {},
  loading: false,
  checkoutSuccess: false,
  shippingMethodList: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'CHEKOUT_DETAILS':
      return {
        chekoutDetails: action.payload,
        loading: false,
        checkoutSuccess: true,
      };
    case CHECKOUT_LOADING:
      return {
        loading: true,
      };
    case CHECKOUT_LOADING_STOP:
      return {
        loading: false,
      };
    case 'SHIPPING_LIST':
      return {
        loading: false,
        shippingMethodList: action.payload,
      };
    case CHECKOUT_SUCCESS_STOP:
      return {
        loading: false,
        checkoutSuccess: false,
      };
    case 'USER_LOGOUT':
      return { ...initialState };
    default: {
      return state;
    }
  }
};
