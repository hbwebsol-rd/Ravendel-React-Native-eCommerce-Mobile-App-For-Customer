import React from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';
import WebView from 'react-native-webview';
import RazorpayCheckout from 'react-native-razorpay';
import URL from '../../utils/baseurl';
import { useDispatch, useSelector } from 'react-redux';
import { paymentStatus } from '../../store/action/checkoutAction';
import { MainLayout } from '../../theme-components';

const Paypalpayment = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const orderData = route.params.orderData;
  const token = useSelector((state) => state.login.user_token);
  orderData.token = token;
  console.log(JSON.stringify(orderData), 'ood', token);

  const onNavigationStateChange = (path) => {
    const urls = path.nativeEvent.url;
    // console.log(url, '---');
    if (urls.includes('http://localhost')) {
      const regex = /[?&]([^=#]+)=([^&#]*)/g;
      let match;
      const params = {};

      // Loop through matches and extract key-value pairs
      while ((match = regex.exec(urls))) {
        params[match[1]] = decodeURIComponent(match[2]);
      }

      console.log(params);
      const payload = {
        id: params.orderId,
        paymentStatus: 'success',
      };
      dispatch(paymentStatus(payload, navigation));
    }
  };
  return (
    <MainLayout hideScroll style={styles.container}>
      <WebView
        source={{
          uri: `https://a666-116-75-243-3.ngrok-free.app/reactNativePaypal?orderData=${JSON.stringify(
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
