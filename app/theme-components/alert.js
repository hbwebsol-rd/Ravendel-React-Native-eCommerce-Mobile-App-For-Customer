import React, { Fragment, useState, useEffect } from 'react';
import { View } from 'react-native-animatable';
import { Snackbar, Colors, Caption } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import * as Animatable from 'react-native-animatable';
import { ALERT_HIDE } from '../store/reducers/alert';

const AlertError = () => {
  const dispatch = useDispatch();
  const { message, success, error } = useSelector((state) => state.alert);
  const [isOpen, setisOpen] = useState(false);

  const HideAlert = () => {
    setTimeout(() => {
      setisOpen(false);
      dispatch({
        type: ALERT_HIDE,
      });
    }, 4000);
  };

  useEffect(() => {
    if (success) {
      setisOpen(true);
      HideAlert();
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      setisOpen(true);
      HideAlert();
    }
  }, [error]);
  return (
    <>
      {isOpen ? (
        <View
          style={{
            alignSelf: 'center',
            position: 'absolute',
            bottom: 10,
            zIndex: 9999,
            width: '90%',
            padding: 7,
            justifyContent: 'center',
            backgroundColor: error ? Colors.red800 : Colors.green800,
          }}>
          <Caption style={{ color: '#fff', fontSize: 14 }}>
            {typeof message === 'string' ? message : ''}
          </Caption>
        </View>
      ) : null}
    </>
  );
};

export default AlertError;
