import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AText, TextInput } from '../../theme-components';
import Colors from '../../constants/Colors';
import { APP_PRIMARY_COLOR, FontStyle } from '../../utils/config';
import { isEmpty } from '../../utils/helper';

const BrandFilter = ({ data, ActiveBrand, setActiveBrand }) => {
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [AllBrands, setAllBrands] = useState([]);
  const [inpvalue, setInpvalue] = useState('');

  const handleinpiut = (e) => {
    setInpvalue(e);
  };

  useEffect(() => {
    const visibleBrands = showAllBrands ? data.data : data.data.slice(0, 5);
    setAllBrands(visibleBrands);
  }, [showAllBrands]);

  useEffect(() => {
    let array;
    if (isEmpty(inpvalue)) {
      array = showAllBrands ? data.data : data.data.slice(0, 5);
    } else if (!isEmpty(inpvalue)) {
      let reg = new RegExp(inpvalue.toLowerCase());
      array = data.data.filter((item) => {
        let name = item.label;
        if (!isEmpty(name) && name.toLowerCase().match(reg)) {
          return item;
        }
      });
    }
    setAllBrands(array);
  }, [inpvalue]);
  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          marginTop: 10,
          marginBottom: 10,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <AText fonts={FontStyle.semiBold}>{data.heading}</AText>
        <TextInput
          width={150}
          height={30}
          bc={'#E0E0E0'}
          value={inpvalue}
          onchange={handleinpiut}
          padding={0}
          // pl={35}
          inputBgColor={Colors.whiteColor}
          fs={12}
          placeholder={'Search'}
          placeholdercolor={'black'}
          br={30}
          color={Colors.blackColor}
        />
      </View>
      <View
        style={{
          elevation: 10,
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}>
        {AllBrands.map((item) => (
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
        <TouchableOpacity onPress={() => setShowAllBrands(!showAllBrands)}>
          <Text style={{ fontSize: 12, color: APP_PRIMARY_COLOR }}>
            {showAllBrands ? 'Show Less' : 'Show More'}
          </Text>
        </TouchableOpacity>
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
