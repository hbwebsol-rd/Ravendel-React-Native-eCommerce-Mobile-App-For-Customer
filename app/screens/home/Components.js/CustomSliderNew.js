import React, { useRef, useState } from 'react';
import {
  View,
  FlatList,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Text,
  ImageBackground,
} from 'react-native';
import { AText, ProductCard } from '../../../theme-components';
import { FontStyle } from '../../../utils/config';
import Feather from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/FontAwesome';
import StarRating from 'react-native-star-rating';
import URL from '../../../utils/baseurl';
import FastImage from 'react-native-fast-image';
import { formatCurrency, isEmpty } from '../../../utils/helper';
import { ProductPriceText } from '../../components';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Carousel from 'react-native-snap-carousel';
import { windowWidth } from '../../../utils/config';

// const windowWidth = Dimensions.get('window').width;
// const itemWidth = windowWidth * 0.4; // visible item width
const itemHeight = itemWidth * 1.5; // visible item height

const MyCarousel = ({ dataItems, navigatetonext, title }) => {
  const { currencySymbol, currencyOptions } = useSelector(
    (state) => state.settings,
  );
  const [entries, setEntries] = useState([
    // Initial data for the carousel
    { title: 'Item 1' },
    { title: 'Item 2' },
    { title: 'Item 3' },
    { title: 'Item 4' },
    { title: 'Item 5' },
    { title: 'Item 6' },
  ]);

  const carouselRef = useRef(null);
  const _renderItem = ({ item, index }) => {
    return (
      <ProductCard
        category={item}
        displayImage={item.feature_image}
        navigateNextScreen={() => navigatetonext(item)}
      />
    );
  };

  return (
    <View style={styles.container}>
      <AText mb={'10px'} large fonts={FontStyle.fontBold}>
        {title}
      </AText>
      <Carousel
        ref={carouselRef}
        data={dataItems}
        renderItem={_renderItem}
        sliderWidth={windowWidth}
        itemWidth={itemWidth}
        firstItem={0}
        lockScrollWhileSnapping={true}
        autoplay={false}
      />
    </View>
  );
};

MyCarousel.propTypes = {
  dataItems: PropTypes.array,
  navigatetonext: PropTypes.func,
};

const styles = StyleSheet.create({
  // title: {
  //   fontSize: 24,
  // },
  container: {
    flex: 1,
    padding: 10,
    width: '100%',
    alignSelf: 'center',
  },
  itemImage: {
    width: itemWidth,
    height: 300,
    resizeMode: 'contain',
    borderRadius: 10,
    marginHorizontal: 8,
  },
  itemView: {
    height: 290,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '25%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  textContainer: {
    // position: 'absolute',
    bottom: 0,
    left: 0,
    // justifyContent: 'center',
    // alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 10,
  },
  textContainer2: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    textAlign: 'right',
    marginHorizontal: 5,
    // justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  iconcontainer: {
    marginBottom: 10,
    width: 22,
    height: 22,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageStyle: {
    width: '97%',
    height: '77%',
    borderRadius: 10,
    resizeMode: 'cover',
    // position: 'absolute',
    // bottom: 0,
    // justifyContent: 'flex-end',
  },
  blurWrap: {},
});

const itemWidth = 200; // Replace with your actual item width

export default MyCarousel;
