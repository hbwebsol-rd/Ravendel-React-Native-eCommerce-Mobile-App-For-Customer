import React from 'react';
import { StyleSheet } from 'react-native';
import styled from 'styled-components/native';

import { AText } from '../../theme-components';
import FastImage from 'react-native-fast-image';
import { uriImage } from '../../utils/helper';
import ProductPriceText from './productPrice';

const ProductCard = (props) => {
  const product = props.productDetail;
  const NavigateTo = props.navigationChild;

  const navigateSingleProductScreen = (id) => {
    NavigateTo.navigate('SingleProduct', {
      productID: id,
    });
  };
  return (
    <>
      <Card onPress={() => navigateSingleProductScreen(product._id)}>
        <CardImageWrapper>
          <FastImage
            style={styles.productImage}
            source={{
              uri: uriImage(product.feature_image),
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
        </CardImageWrapper>
        <CardBody>
          <ProductPriceText
            fontsizesmall={true}
            DontshowPercentage={true}
            fontColor={'#DB3022'}
            Pricing={product.pricing}
          />

          <AText small bold color="#000">
            {product.name.length > 20
              ? product.name.substring(0, 20) + '...'
              : product.name}
          </AText>
        </CardBody>
      </Card>
    </>
  );
};
const styles = StyleSheet.create({
  productImage: { flex: 1, resizeMode: 'cover' },
});
const Card = styled.TouchableOpacity`
  width: 100%;
  background: #f2f0f0;
  padding: 5px;
  border-radius: 10px;
`;

const CardImageWrapper = styled.View`
  width: 100%;
  height: 200px;
  border-radius: 10px;
  overflow: hidden;
`;

const CardBody = styled.View`
  padding: 10px 5px;
`;

export default ProductCard;
