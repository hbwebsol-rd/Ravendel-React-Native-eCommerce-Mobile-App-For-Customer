import React from 'react';
import { AText } from '../../theme-components';
import { formatCurrency, isEmpty } from '../../utils/helper';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { FontStyle } from '../../utils/config';

const ProductPriceText = ({
  Pricing,
  fontsizesmall,
  DontshowPercentage,
  showInMulipleLine,
  fontColor,
  showLargeText,
  dontShowFull
}) => {
  const { currencyOptions, currencySymbol } = useSelector(
    (state) => state.settings,
  );

  const hasSalePrice = Pricing.sellprice && Pricing.sellprice < Pricing.price;
  const discountPercentage = hasSalePrice
    ? Math.round((100 / Pricing.price) * (Pricing.price - Pricing.sellprice))
    : 0;
  const priceTextStyles = {
    color: hasSalePrice ? '#7b7b7b' : '#000000',
    lineThrough: hasSalePrice,
    fonts: hasSalePrice ? FontStyle.semiBold : FontStyle.fontBold,
  };

  return (
    <View
      style={{
        ...styles.productPriceView,
        flexDirection: showInMulipleLine ? showInMulipleLine : 'row',
        width: dontShowFull ? '90%' : '100%',
      }}>
      <AText
        center={
          (isEmpty(DontshowPercentage) || !DontshowPercentage) && hasSalePrice
            ? true
            : false
        }
        right={
          (isEmpty(DontshowPercentage) || !DontshowPercentage) && hasSalePrice
            ? false
            : true
        }
        medium={!isEmpty(fontsizesmall) ? !fontsizesmall : true}
        small={!isEmpty(fontsizesmall) ? fontsizesmall : false}
        big1={showLargeText}
        color={
          !isEmpty(fontColor) ? fontColor : hasSalePrice ? '#4a4a4a' : '#3a3a3a'
        }
        fonts={FontStyle.fontBold}>
        {hasSalePrice &&
          formatCurrency(Pricing.sellprice, currencyOptions, currencySymbol)}{' '}
        <AText
          center
          {...priceTextStyles}
          small={hasSalePrice || (!isEmpty(fontsizesmall) && fontsizesmall)}
          >
          {formatCurrency(Pricing.price??0, currencyOptions, currencySymbol)}
        </AText>
        {(isEmpty(DontshowPercentage) || !DontshowPercentage) &&
          hasSalePrice && (
            <AText center xtrasmall fonts={FontStyle.fontBold} color="#DB3022">
              {' '}
              {discountPercentage}% off
            </AText>
          )}
      </AText>
    </View>
  );
};
const styles = StyleSheet.create({
  productImage: { flex: 1, resizeMode: 'cover' },
  productPriceView: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
});

export default ProductPriceText;
