import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import { AText } from '../../../theme-components';
import {
  APP_PRIMARY_COLOR,
  APP_SECONDARY_COLOR,
  FontStyle,
} from '../../../utils/config';
import { isEmpty } from '../../../utils/helper';

const AttributeListing = ({
  attributeName,
  attributeID,
  attributeValues,
  variations,
  productUrl,
  onPress,
}) => {
  const selectAttribute = (keyID) => {
    let hasMatchingVariation = variations.some(
      (vari) =>
        vari.productUrl === productUrl &&
        vari.combinations.some(
          (comb) =>
            comb.attributeId === attributeID && comb.attributeValueId === keyID,
        ),
    );
    return hasMatchingVariation;
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
      } else {
        alert('Product not found');
      }
    } else {
      alert('Product not found');
    }
  };
  return (
    <View style={styles.containerViewStyle}>
      <AText large style={styles.textStyle}>
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
                  backgroundColor: selectAttribute(key._id)
                    ? APP_SECONDARY_COLOR
                    : '#fff',
                  borderColor: selectAttribute(key._id)
                    ? APP_PRIMARY_COLOR
                    : '#000',
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
  textStyle: {
    fontFamily: FontStyle.fontBold,
    marginBottom: 10
  },
  attributeBoxStyle: {
    borderWidth: 1,
    borderColor: '#636363',
    marginHorizontal: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    paddingVertical: 6,
    alignItems: 'center',
    borderWidth: 1,
    justifyContent: 'center',
  },
  containerViewStyle: {
    flex: 1,
    marginVertical: 10,
    marginHorizontal: 15,
  },
});
