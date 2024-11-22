import React, { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { AText, ProductCard } from '.';
import { FontStyle } from '../utils/config';
import PropTypes from 'prop-types';
import Carousel from 'react-native-snap-carousel';
import { windowWidth } from '../utils/config';

const itemWidth = windowWidth * 0.45;

const ProductsSlider = ({ dataItems, navigatetonext, title, productWidth }) => {
  const carouselRef = useRef(null);
  const _renderItem = ({ item, index }) => {
    return (
      <View style={{ marginHorizontal: 5 }}>
        <ProductCard
          category={item}
          displayImage={item.feature_image}
          productWidth={productWidth}
          navigateNextScreen={() => navigatetonext(item)}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <AText style={styles.titleStyle} large >
        {title}
      </AText>
      <Carousel
        ref={carouselRef}
        data={dataItems}
        renderItem={_renderItem}
        sliderWidth={windowWidth}
        itemWidth={itemWidth}
        activeSlideAlignment={'start'}
        inactiveSlideOpacity={1}
        inactiveSlideScale={1}
        slideStyle={{ marginHorizontal: 5 }}
        autoplay={false}
      />
    </View>
  );
};

ProductsSlider.propTypes = {
  dataItems: PropTypes.array,
  navigatetonext: PropTypes.func,
};

const styles = StyleSheet.create({
  titleStyle: {
    marginBottom: 10,
    fontFamily: FontStyle.fontBold
  },
  container: {
    flex: 1,
    padding: 10,
    width: '100%',
    alignSelf: 'center',
  },
});

export default ProductsSlider;
