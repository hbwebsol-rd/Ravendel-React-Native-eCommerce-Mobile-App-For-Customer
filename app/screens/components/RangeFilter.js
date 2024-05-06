import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AText } from '../../theme-components';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import Colors from '../../constants/Colors';
import { APP_PRIMARY_COLOR, FontStyle } from '../../utils/config';

const RangeFilter = ({ data, setAmountRange }) => {
  const [amount, setAmount] = useState([
    data.data.minPrice,
    data.data.maxPrice,
  ]);
  //Slider Value Setter
  const multiSliderValuesChange = (values) => {
    setAmount(values);
    setAmountRange(values);
  };
  useEffect(() => {
    setAmountRange([data.data.minPrice, data.data.maxPrice]);
  }, []);
  return (
    <View style={styles.container}>
      <AText mt="20px" color={Colors.blackColor} fonts={FontStyle.semiBold}>
        {data.heading}
      </AText>
      <Text>
        Selected Range: {amount[0]} - {amount[1]}
      </Text>

      <MultiSlider
        containerStyle={{ marginLeft: 20 }}
        values={amount}
        sliderLength={300}
        onValuesChange={multiSliderValuesChange}
        min={data.data.minPrice}
        max={data.data.maxPrice}
        step={100}
        allowOverlap={false}
        snapped
        selectedStyle={{
          backgroundColor: APP_PRIMARY_COLOR,
        }}
        unselectedStyle={{
          backgroundColor: APP_PRIMARY_COLOR,
        }}
        markerStyle={{
          backgroundColor: APP_PRIMARY_COLOR,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default RangeFilter;
