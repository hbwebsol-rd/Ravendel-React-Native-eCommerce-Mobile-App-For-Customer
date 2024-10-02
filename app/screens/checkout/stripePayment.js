import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';
import { useDispatch } from 'react-redux';
import { paymentStatus } from '../../store/action/checkoutAction';
import { MainLayout } from '../../theme-components';
import { BASEURL } from '../../utils/config';

const StripePayment = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const [apiRun,setApiRun] = useState(false);
  const url = route.params.url;
  const navParams = route.params.navParams;
  const onNavigationStateChange = (path) => {
    const urls = path.nativeEvent.url;
    if(urls.includes('paymentfailed')){
      navigation.goBack()
    }
    else if (urls.includes(BASEURL)) {
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
      dispatch(paymentStatus(payload, navigation, navParams,params.orderId));
      setApiRun(true)
      }
    }
  };
  return (
    <MainLayout hideScroll style={styles.container}>
      <WebView
        source={{
          uri: `${url}`,
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

export default StripePayment;
