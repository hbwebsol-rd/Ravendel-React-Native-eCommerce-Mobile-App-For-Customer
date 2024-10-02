import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';
import WebView from 'react-native-webview';
import { useDispatch, useSelector } from 'react-redux';
import { paymentStatus } from '../../store/action/checkoutAction';
import { MainLayout } from '../../theme-components';
import { BASEURL } from '../../utils/config';

const Paypalpayment = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const [apiRun,setApiRun] = useState(false);
  const orderData = route.params.orderData;
  const navParams = route.params.navParams;
  const token = useSelector((state) => state.login.user_token);
  orderData.token = token;

  const onNavigationStateChange = (path) => {
    const urls = path.nativeEvent.url;
    console.log(urls,' url change')
    if (urls.includes('thankyou')) {
      const regex = /[?&]([^=#]+)=([^&#]*)/g;
      let match;
      const params = {};

      // Loop through matches and extract key-value pairs
      while ((match = regex.exec(urls))) {
        params[match[1]] = decodeURIComponent(match[2]);
      }

      const payload = {
        id: params.orderId,
        paymentStatus: 'success',
      };
      if(!apiRun){
        dispatch(paymentStatus(payload, navigation,navParams,params.orderId));
        setApiRun(true)
      }
    }
  };
  return (
    <MainLayout hideScroll style={styles.container}>
      <WebView
        source={{
          uri: `https://zemjet.com/reactNativePaypal?orderData=${JSON.stringify(
            orderData,
          )}`,
        }}
        startInLoadingState={true}
        onLoadProgress={(path) => {
          onNavigationStateChange(path);
        }}
      />
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default Paypalpayment;
