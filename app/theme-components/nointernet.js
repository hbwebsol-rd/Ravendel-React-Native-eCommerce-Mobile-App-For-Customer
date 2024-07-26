import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const NoConnection = () => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require('../assets/images/nointernet.png')} // Replace with your own image URL if needed
      />
      <Text style={styles.title}>No Connection</Text>
      <Text style={styles.subtitle}>
        Please check your internet connectivity and try again.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F8FF', // Light cyan background color
    padding: 20,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF4500', // Orange red color
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#2F4F4F', // Dark slate gray color
    textAlign: 'center',
    paddingHorizontal: 20,
    // backgroundColor: '#E6E6FA', // Lavender background for subtitle
    borderRadius: 10,
    padding: 10,
  },
});

export default NoConnection;