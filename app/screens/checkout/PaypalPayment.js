import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';

const Paypalpayment = ({ navigation, route }) => {
  const orderData = route.params.orderData;
  console.log(orderData, 'ood');
  return (
    <View style={styles.container}>
      <WebView
        source={{
          uri: `https://30e6-116-75-243-3.ngrok-free.app/checkout?orderData=${JSON.stringify(
            orderData,
          )}`,
        }}
        startInLoadingState={true}
        // onLoadProgress={(path) => {
        //   onNavigationStateChange(path);
        // }}
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

export default Paypalpayment;
