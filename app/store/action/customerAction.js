import NavigationConstants from '../../navigation/NavigationConstants';
import {
  ADD_ADDRESSBOOK,
  DELETE_ADDRESSBOOK,
  GET_CUSTOMER,
  UPDATE_ADDRESSBOOK,
} from '../../queries/customerQuery';
import { CHANGE_PASSWORD, EDIT_CUSTOMER } from '../../queries/userQuery';
import { getValue, isEmpty, storeData } from '../../utils/helper';
import { mutation, query } from '../../utils/service';
import { ALERT_ERROR, ALERT_SUCCESS } from '../reducers/alert';
import { USER } from './loginAction';
import _ from 'lodash';

export const editCustomerAction = (payload, navigation) => async (dispatch) => {
  dispatch({ type: CUSTOMER_LOADING });

  try {
    const response = await mutation(EDIT_CUSTOMER, payload);

    if (
      !isEmpty(response.data.updateCustomer) &&
      response.data.updateCustomer.success
    ) {
      dispatch(userDetailsfetch(payload.id));
      navigation.navigate(NavigationConstants.ACCOUNT_SCREEN, {
        initial: false,
      });
      dispatch({ type: CUSTOMER_LOADING_FAIL });
    } else {
      dispatch({ type: CUSTOMER_LOADING_FAIL });
      dispatch({
        type: ALERT_ERROR,
        payload: _.get(
          response,
          'data.updateCustomer.message',
          'Something went wrong. Please try again later.',
        ),
      });
    }
  } catch (error) {
    dispatch({ type: CUSTOMER_LOADING_FAIL });
    dispatch({
      type: ALERT_ERROR,
      payload: 'Something went wrong. Please try again later.',
    });
  }
};

export const changePasswordAction =
  (payload, navigation) => async (dispatch) => {
    dispatch({ type: CUSTOMER_LOADING });

    try {
      const response = await mutation(CHANGE_PASSWORD, payload);

      if (
        !isEmpty(response.data.updateCustomerPassword) &&
        response.data.updateCustomerPassword.success
      ) {
        dispatch({
          type: ALERT_SUCCESS,
          payload: 'Password updated successfully',
        });
        dispatch(userDetailsfetch(payload.id));
        navigation.goBack(null);
        dispatch({ type: CUSTOMER_LOADING_FAIL });
      } else {
        dispatch({ type: CUSTOMER_LOADING_FAIL });
        dispatch({
          type: ALERT_ERROR,
          payload: _.get(
            response,
            'data.updateCustomerPassword.message',
            'Something went wrong. Please try again later.',
          ),
        });
      }
    } catch (error) {
      dispatch({ type: CUSTOMER_LOADING_FAIL });
      dispatch({
        type: ALERT_ERROR,
        payload: 'Something went wrong. Please try again later.',
      });
    }
  };

export const userDetailsfetch = (id) => async (dispatch) => {
  dispatch({ type: CUSTOMER_LOADING });

  try {
    const response = await query(GET_CUSTOMER, { id: id });

    if (!isEmpty(_.get(response, 'data.customer.data'))) {
      const customerOldData = await getValue('userDetails');
      const cold = JSON.parse(customerOldData);
      cold.addressBook = _.get(response, 'data.customer.data.addressBook', []);

      storeData('userDetails', JSON.stringify(cold));
      dispatch({ type: USER, payload: cold });
      dispatch({ type: CUSTOMER_LOADING_FAIL });
    } else {
      dispatch({ type: CUSTOMER_LOADING_FAIL });
      dispatch({
        type: ALERT_ERROR,
        payload: _.get(
          response,
          'data.customer',
          'Something went wrong. Please try again later.',
        ),
      });
    }
  } catch (error) {
    dispatch({ type: CUSTOMER_LOADING_FAIL });
    dispatch({
      type: ALERT_ERROR,
      payload: 'Something went wrong. Please try again later.',
    });
  }
};

export const addAddressAction = (payload, navigation) => async (dispatch) => {
  dispatch({ type: CUSTOMER_LOADING });

  try {
    const response = await mutation(ADD_ADDRESSBOOK, payload);

    if (
      !isEmpty(_.get(response, 'data.addAddressBook')) &&
      _.get(response, 'data.addAddressBook.success')
    ) {
      setTimeout(() => {
        dispatch(userDetailsfetch(payload.id));
      }, 1500);
      dispatch({ type: CUSTOMER_LOADING_FAIL });
    } else {
      dispatch({ type: CUSTOMER_LOADING_FAIL });
      dispatch({
        type: ALERT_ERROR,
        payload: _.get(
          response,
          'data.message',
          'Something went wrong. Please try again later.',
        ),
      });
    }
  } catch (error) {
    dispatch({ type: CUSTOMER_LOADING_FAIL });
    dispatch({
      type: ALERT_ERROR,
      payload: 'Something went wrong. Please try again later.',
    });
  }
};

export const removeAddressAction =
  (payload, navigation) => async (dispatch) => {
    dispatch({ type: CUSTOMER_LOADING });

    try {
      const response = await mutation(DELETE_ADDRESSBOOK, payload);

      if (
        !isEmpty(_.get(response, 'data.deleteAddressBook')) &&
        _.get(response, 'data.deleteAddressBook.success')
      ) {
        dispatch(userDetailsfetch(payload.id));
        dispatch({ type: CUSTOMER_LOADING_FAIL });
      } else {
        dispatch({ type: CUSTOMER_LOADING_FAIL });
        dispatch({
          type: ALERT_ERROR,
          payload: _.get(
            response,
            'data.message',
            'Something went wrong. Please try again later.',
          ),
        });
      }
    } catch (error) {
      dispatch({ type: CUSTOMER_LOADING_FAIL });
      dispatch({
        type: ALERT_ERROR,
        payload: 'Something went wrong. Please try again later.',
      });
    }
  };

export const updateAddressAction =
  (payload, navigation) => async (dispatch) => {
    dispatch({ type: CUSTOMER_LOADING });

    try {
      const response = await mutation(UPDATE_ADDRESSBOOK, payload);

      if (
        !isEmpty(_.get(response, 'data.updateAddressBook')) &&
        _.get(response, 'data.updateAddressBook.success')
      ) {
        setTimeout(() => {
          dispatch(userDetailsfetch(payload.id));
        }, 2500);
        dispatch({ type: CUSTOMER_LOADING_FAIL });
      } else {
        dispatch({ type: CUSTOMER_LOADING_FAIL });
        dispatch({
          type: ALERT_ERROR,
          payload: _.get(
            response,
            'data.message',
            'Something went wrong. Please try again later.',
          ),
        });
      }
    } catch (error) {
      dispatch({ type: CUSTOMER_LOADING_FAIL });
      dispatch({
        type: ALERT_ERROR,
        payload: 'Something went wrong. Please try again later.',
      });
    }
  };

export const CUSTOMER_LOADING = 'CUSTOMER_LOADING';
export const CUSTOMER_LOADING_FAIL = 'CUSTOMER_LOADING_FAIL';
export const CUSTOMER_STOP = 'CUSTOMER_STOP';
export const USER_ALREADY_HAS_LOGIN = 'USER_ALREADY_HAS_LOGIN';
