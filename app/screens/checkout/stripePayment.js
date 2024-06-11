import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';
import { useDispatch } from 'react-redux';
import { paymentStatus } from '../../store/action/checkoutAction';

const StripePayment = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const url = route.params.url;
  const navParams = route.params.navParams;
  console.log(url, ' url stipe');
  const onNavigationStateChange = (path) => {
    const urls = path.nativeEvent.url;
    console.log(urls, '---');
    if (urls.includes('https://demo1-ravendel.hbwebsol.com')) {
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
      dispatch(paymentStatus(payload, navigation, navParams));
    }
  };
  return (
    <View style={styles.container}>
      <WebView
        source={{
          uri: `${url}`,
        }}
        startInLoadingState={true}
        onLoadProgress={(path) => {
          onNavigationStateChange(path);
        }}
      />
    </View>
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

export default StripePayment;
