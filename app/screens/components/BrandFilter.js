import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AText } from '../../theme-components';
import Colors from '../../constants/Colors';
import { APP_PRIMARY_COLOR, FontStyle } from '../../utils/config';

const BrandFilter = ({ data, ActiveBrand, setActiveBrand }) => {
  return (
    <>
      <AText mt={'20px'} mb={'5px'} fonts={FontStyle.semiBold}>
        {data.heading}
      </AText>
      <View
        style={{
          elevation: 10,
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}>
        {data.data.map((item) => (
          <TouchableOpacity
            onPress={() => {
              if (!ActiveBrand.includes(item.value)) {
                setActiveBrand((old) => [...old, item.value]);
              } else {
                setActiveBrand((old) =>
                  old.filter((val) => val !== item.value),
                );
              }
            }}
            style={{
              ...styles.chipstyle,
              backgroundColor: ActiveBrand.includes(item.value)
                ? APP_PRIMARY_COLOR
                : APP_PRIMARY_COLOR + '40',
            }}>
            <AText
              fonts={FontStyle.semiBold}
              color={
                ActiveBrand.includes(item.value)
                  ? Colors.whiteColor
                  : Colors.blackColor
              }>
              {item.label}
            </AText>
          </TouchableOpacity>
        ))}
      </View>
    </>
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
  chipstyle: {
    backgroundColor: Colors.lightGreen,
    height: 30,
    width: 'auto',
    alignItems: 'center',
    marginRight: 10,
    // marginLeft: 10,
    borderRadius: 26,
    paddingHorizontal: 15,
    justifyContent: 'center',
    marginTop: 5,
  },
});

export default BrandFilter;
