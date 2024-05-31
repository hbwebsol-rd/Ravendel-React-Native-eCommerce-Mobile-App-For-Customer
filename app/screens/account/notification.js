import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BackHeader } from '../../theme-components';

const Notification = ({ navigation }) => {
  return (
    <View>
      <BackHeader
        navigation={navigation}
        title="My Notification"
        headerColor={'#312f2d'}
        back
      />
      <View style={styles.container}>
        <Text style={styles.text}>My Notification</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default Notification;
