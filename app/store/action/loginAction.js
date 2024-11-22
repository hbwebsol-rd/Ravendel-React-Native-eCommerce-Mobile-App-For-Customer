import { Platform } from 'react-native';
import APclient from '../../Client';
import { ADD_CUSTOMER, FORGOT_PASSWORD } from '../../queries/userQuery';
import {
  checkUserLoginStorage,
  getValue,
  isEmpty,
  storeData,
} from '../../utils/helper';
import { mutation, PostFetchWithoutToken } from '../../utils/service';
import { ALERT_ERROR, ALERT_SUCCESS } from '../reducers/alert';
import { CART_EMPTY } from './cartAction';
import { userDetailsfetch } from './customerAction';
import { ONE_SIGNAL_APP_ID } from '../../utils/config';
import OneSignal from 'react-native-onesignal';



const save_playerid = async player_id => {
  var token = await getToken();
  var myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${token}`);
  myHeaders.append('Content-Type', 'application/json');

  var objects = {
    deviceId: player_id,
    deviceType: Platform.OS,
    appVersion: versionCode,
  };

  var raw = JSON.stringify(objects);
  console.log(JSON.stringify(objects));
  var requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };
  fetch(`${BASE_URL}/api/user/updateDeviceId`, requestOptions)
    .then(response => response.json())
    .then(result => {
      console.log(result, 'resss');
      // storeData('playerid', player_id);
    })
    .catch(error => {
      console.log(error, 'error');
    });
};

const setDeviceId = async () => {
  const deviceState = await OneSignal.getDeviceState();
  // const pid = await getValue('playerid');
  console.log(deviceState, 'Plaery Id Get');
  // if (deviceState && deviceState.userId && isEmpty(pid)) {
  save_playerid(deviceState.userId); //
  // }
};


const InitOneSignal = async () => {
  OneSignal.setLogLevel(6, 0);
  OneSignal.setAppId(ONE_SIGNAL_APP_ID);
  OneSignal.setRequiresUserPrivacyConsent(true);
  OneSignal.provideUserConsent(true);
  //END OneSignal Init Code
  //Prompt for push on iOS
  OneSignal.promptForPushNotificationsWithUserResponse(response => {
    console.log('Prompt response:', response);
  });
  //Method for handling notifications received while app in foreground
  OneSignal.setNotificationWillShowInForegroundHandler(
    notificationReceivedEvent => {
      console.log(
        'OneSignal: notification will show in foreground:',
        notificationReceivedEvent,
      );
      let notification = notificationReceivedEvent.getNotification();
      console.log('notification: ', notification);
      const data = notification.additionalData;
      console.log('additionalData: ', data);
      // Complete with null means don't show a notification.
      notificationReceivedEvent.complete(notification);
    },
  );

  //Method for handling notifications opened
  OneSignal.setNotificationOpenedHandler(notification => {
    console.log('OneSignal: notification opened:', notification);
  });
  setTimeout(() => {
    setDeviceId();
  }, 12000);
};

export const LoginAction =
  (email, password, navigation) => async (dispatch) => {
    dispatch({
      type: LOGIN_LOADING,
    });
    dispatch({
      type: CART_EMPTY,
    });
    const response = await PostFetchWithoutToken(`apis/customers/login`, {
      email: email,
      password: password,
    });
    try {
      let data = response.data;
      if (!isEmpty(response.data.success) && response.data.success) {
        InitOneSignal()
        const userDetails = data.customer;
        await APclient.resetStore();
        storeData('token', data.token);
        storeData('userDetails', JSON.stringify(userDetails));
        dispatch({
          type: LOGIN,
          payload: { user_token: data.token },
        });
        dispatch({
          type: USER,
          payload: userDetails,
        });
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });

        dispatch({
          type: ALERT_SUCCESS,
          payload: 'Login  successfully',
        });
      } else {
        dispatch({
          type: LOGIN_STOP,
        });
        dispatch({
          type: ALERT_ERROR,
          payload: 'Invalid Email or Password',
        });
      }
    } catch (error) {
      dispatch({
        type: LOGIN_FAIL,
      });
      dispatch({
        type: ALERT_ERROR,
        payload: 'Something went wrong. Please try again later.',
      });
    }
  };
export const ForgotPasswordAction = (email) => async (dispatch) => {
  dispatch({
    type: LOGIN_LOADING,
  });
  console.log(email,' email')
  try {
    const response = await mutation(FORGOT_PASSWORD, { email: email });
    if (!isEmpty(response.data.sendForgetPasswordEmail.success) && response.data.sendForgetPasswordEmail.success) {
      dispatch({
        type: LOGIN_STOP,
      });
      dispatch({
        type: ALERT_SUCCESS,
        payload: response.data.sendForgetPasswordEmail.message ?? "Email sent successfully",
      });
    } else {
      dispatch({
        type: LOGIN_STOP,
      });
      dispatch({
        type: ALERT_ERROR,
        payload: response.data.sendForgetPasswordEmail.message ?? "User not found",
      });
    }
  } catch (error) {
    dispatch({
      type: LOGIN_FAIL,
    });
    dispatch({
      type: ALERT_ERROR,
      payload: 'Something went wrong. Please try again later.',
    });
  }
};


export const sessionCheck = () => async (dispatch) => {
  const loginDetails = await checkUserLoginStorage();
  if (!isEmpty(loginDetails.token) && !isEmpty(loginDetails.userDetails)) {
    const userDetails = loginDetails.userDetails;
    dispatch({
      type: LOGIN,
      payload: { token: loginDetails.token },
    });
    dispatch(userDetailsfetch(userDetails._id));
  }
};

export const registerAction =
  (payload, navigation, handleActiveTab) => async (dispatch) => {
    dispatch({
      type: LOGIN_LOADING,
    });
    try {
      const response = await mutation(ADD_CUSTOMER, payload);
      const { data } = response;
      const { addCustomer } = data;
      if (!isEmpty(addCustomer) && addCustomer.success) {
        // handleActiveTab('Login');
        dispatch({
          type: LOGIN_STOP,
        });
        dispatch(LoginAction(payload.email, payload.password, navigation));

        dispatch({
          type: ALERT_SUCCESS,
          payload: 'Signup successfully',
        });
      } else {
        dispatch({
          type: LOGIN_STOP,
        });
        dispatch({
          type: ALERT_ERROR,
          payload:
            addCustomer.message ||
            'Something went wrong. Please try again later.',
        });
      }
    } catch (error) {
      dispatch({
        type: LOGIN_FAIL,
      });
      dispatch({
        type: ALERT_ERROR,
        payload: 'Something went wrong. Please try again later.',
      });
    }
  };

export const LOGIN_LOADING = 'LOGIN_LOADING';
export const LOGIN_FAIL = 'LOGIN_FAIL';
export const LOGIN_STOP = 'LOGIN_STOP';
export const USER = 'USER';
export const LOGIN = 'LOGIN';
export const ALREADY_HAS_LOGIN = 'ALREADY_HAS_LOGIN';
