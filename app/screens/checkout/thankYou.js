import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { AText } from '../../theme-components';
import Colors from '../../constants/Colors';
import NavigationConstants from '../../navigation/NavigationConstants';

const MyComponent = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/Success.webp')} />
      <TouchableOpacity
        onPress={() => navigation.navigate(NavigationConstants.HOME_SCREEN)}
        style={{ position: 'absolute', zIndex: 5, bottom: 20 }}>
        <AText color={Colors.blue} lineThrough>
          Return to Dashboard
        </AText>
      </TouchableOpacity>
      {/* <Text style={styles.text}>Thank you for Shopping from Raavendal</Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default MyComponent;
