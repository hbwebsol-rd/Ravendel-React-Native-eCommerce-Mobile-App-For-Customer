import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { AText } from '../../../theme-components';
import { APP_SECONDARY_COLOR, FontStyle } from '../../../utils/config';
import { isEmpty } from '../../../utils/helper';

const AttributeListing = ({
  attributeName,
  attributeID,
  attributeValues,
  variations,
  productUrl,
  onPress,
}) => {

    const selectAttribute = (keyName) => {
    const keyNameTrimmedLower = keyName.trim().toLowerCase();
    return (hasMatchingVariation = variations.some(
      (vari) =>
        vari.productUrl === productUrl &&
        vari.combinations.some(
          (comb) =>
            comb.attributeName.toLowerCase() === attributeName.toLowerCase() &&
            comb.attributeValueName.toLowerCase() === keyNameTrimmedLower,
        ),
    ));
  };
  const changeAttribute = (attributeValueId) => {
    let selectedVariation = variations.find(
      (vari) => vari.productUrl === productUrl,
    );

    if (selectedVariation && !isEmpty(selectedVariation.combinations)) {
      selectedVariation = selectedVariation.combinations.map((item) => {
        if (item.attributeId === attributeID) {
          return { ...item, attributeValueId: attributeValueId };
        }
        return item;
      });
      // Filter products to find one with the specified attributeValueName and matching other combinations
      const result = variations.find((item) => {
        return selectedVariation.every((updatedItem) =>
          item.combinations.some(
            (ic) =>
              ic.attributeId === updatedItem.attributeId &&
              ic.attributeValueId === updatedItem.attributeValueId,
          ),
        );
      });
      if (result && !isEmpty(result.productUrl)) {
        let payLoad = { _id: result.productId, url: result.productUrl };
        onPress(payLoad);
      }
    }
  };
  return (
    <View style={styles.containerViewStyle}>
      <AText large fonts={FontStyle.fontBold} mb="10px">
        {attributeName}
      </AText>
      <View style={styles.attributeView}>
        {!isEmpty(attributeValues) &&
          attributeValues.map((key) => (
            <TouchableOpacity
              onPress={() => changeAttribute(key._id)}
              style={[
                styles.attributeBoxStyle,
                {
                  backgroundColor: selectAttribute(key.name)
                    ? APP_SECONDARY_COLOR
                    : '#fff',
                  borderColor: selectAttribute(key.name)
                    ? APP_SECONDARY_COLOR
                    : '#fff',
                },
              ]}>
              <AText center small color={'black'} fonts={FontStyle.fontRegular}>
                {key.name.trim()}
              </AText>
            </TouchableOpacity>
          ))}
      </View>
    </View>
  );
};

export default AttributeListing;
const styles = StyleSheet.create({
  attributeView: {
    flexDirection: 'row',
    marginVertical: 7,
  },
  attributeBoxStyle: {
    borderWidth: 1,
    borderColor: '#636363',
    marginHorizontal: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerViewStyle: {
    flex: 1,
    marginVertical: 10,
    marginHorizontal: 15,
  },
});
