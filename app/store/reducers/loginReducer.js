import AsyncStorage from '@react-native-async-storage/async-storage';
import APclient from '../../Client';
import {
  LOGIN,
  LOGIN_FAIL,
  LOGIN_LOADING,
  LOGIN_STOP,
  ALREADY_HAS_LOGIN,
} from '../action/loginAction';

const initialState = {
  login: false,
  user_token: {},
  token_loading: false,
  error: {},
  insert_token_error: false,
  loading: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'USER_LOGIN':
      return {
        ...action.payload,
        loading: false,
      };

    case LOGIN_LOADING:
      return {
        loading: true,
      };
    case LOGIN_FAIL:
      return {
        loading: false,
      };
    case LOGIN_STOP:
      return {
        loading: false,
      };
    case LOGIN:
      return {
        ...state,
        ...action.payload,
        login: true,
        loading: false,
      };
    case ALREADY_HAS_LOGIN:
      return {
        ...state,
        token: action.payload.user_token,
        login: true,
      };
    case 'USER_LOGOUT':
      return { ...initialState };
    default: {
      return state;
    }
  }
};

export const LogOut = (navigation) => async (dispatch) => {
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('userDetails');
  await AsyncStorage.removeItem('cartproducts');
  dispatch({
    type: 'USER_LOGOUT',
  });
  await APclient.resetStore();
  navigation
    ? navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      })
    : null;
};
