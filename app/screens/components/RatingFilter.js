import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AText } from '../../theme-components';
import { APP_PRIMARY_COLOR, FontStyle } from '../../utils/config';
import Colors from '../../constants/Colors';

const RangeFilter = ({ data, onStarRatingPress, starCount }) => {
  return (
    <View style={styles.container}>
      <AText color={Colors.blackColor} fonts={FontStyle.semiBold}>
        {data.heading}
      </AText>
      <View style={{ width: '35%' }}>
        {data.data.map((item) => (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => onStarRatingPress(item.value)}
              style={{
                marginRight: 5,
                height: 15,
                width: 15,
                borderWidth: 1,
                borderColor: Colors.blackColor,
                borderRadius: 8,
                backgroundColor:
                  starCount == item.value
                    ? APP_PRIMARY_COLOR
                    : Colors.transparentColor,
              }}></TouchableOpacity>
            <AText>{item.label}</AText>
          </View>
        ))}
      </View>
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

export default RangeFilter;
