import React, { Fragment, useState, useEffect } from 'react';
import { View } from 'react-native-animatable';
import { Colors, Caption } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { ALERT_HIDE } from '../store/reducers/alert';
import { isEmpty } from '../utils/helper';

const AlertError = () => {
  const dispatch = useDispatch();
  const { message, success, error } = useSelector((state) => state.alert);
  const [isOpen, setisOpen] = useState(false);

  const HideAlert = () => {
    setTimeout(() => {
      dispatch({
        type: ALERT_HIDE,
      });
      setisOpen(false);
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
            borderRadius:5,
            alignSelf: 'center',
            position: 'absolute',
            bottom: 10,
            zIndex: 9999,
            width: '90%',
            padding: 7,
            justifyContent: 'center',
            backgroundColor: isEmpty(message)? 'transparent': error ? Colors.red800 : Colors.green800,
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
