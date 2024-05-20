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
import { AText } from '../../../theme-components';
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
  console.log(dataItems, ' ditem');
  const _renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigatetonext(item);
          // setSelectedId(item._id);
        }}>
        <ImageBackground
          source={{
            uri: !isEmpty(item.feature_image)
              ? URL + item.feature_image
              : 'https://www.hbwebsol.com/wp-content/uploads/2020/07/category_dummy.png',
            priority: FastImage.priority.normal,
          }}
          style={styles.itemImage}
          imageStyle={{ borderRadius: 10 }}
          // blurRadius={10}
        >
          <View style={styles.blurWrap}>
            <ImageBackground
              source={{
                uri: !isEmpty(item.feature_image)
                  ? URL + item.feature_image
                  : 'https://www.hbwebsol.com/wp-content/uploads/2020/07/category_dummy.png',
                priority: FastImage.priority.normal,
              }}
              blurRadius={Platform.OS === 'ios' ? 20 : 20}
              style={styles.blurImageStyle}
              imageStyle={{
                borderRadius: 10,
                resizeMode: 'cover',
              }}></ImageBackground>
          </View>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              navigatetonext(item);
            }}
            style={styles.overlay}></TouchableOpacity>
          <View style={styles.textContainer}>
            <AText mb="5px" small fonts={FontStyle.fontBold}>
              {item.name.length > 14
                ? item.name.substring(0, 14) + '...'
                : item.name}
            </AText>
            <AText small fonts={FontStyle.fontBold}>
              {formatCurrency(
                item.pricing.sellprice,
                currencyOptions,
                currencySymbol,
              )}
              {/* $ {item.pricing.sellprice + '.00'} */}
            </AText>
            {/* <ProductPriceText fontsizesmall={true} Pricing={item.pricing} /> */}
          </View>
          <View style={styles.textContainer2}>
            <TouchableOpacity style={styles.iconcontainer}>
              <Icon name="shopping-cart" color={'black'} size={14} />
            </TouchableOpacity>
            <StarRating
              disabled={true}
              maxStars={5}
              rating={3.5}
              fullStarColor={'#FFDB20'}
              emptyStarColor={'gray'}
              starSize={10}
            />
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ width: '100%' }}>
      <Carousel
        ref={carouselRef}
        data={dataItems}
        renderItem={_renderItem}
        sliderWidth={windowWidth}
        itemWidth={itemWidth}
        firstItem={1}
        lockScrollWhileSnapping={true}
        autoplay={true}
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
    justifyContent: 'center',
    // alignItems: 'center',
  },
  itemImage: {
    width: itemWidth,
    height: 300,
    resizeMode: 'contain',
    borderRadius: 10,
    marginHorizontal: 8,
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
    position: 'absolute',
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
  blurImageStyle: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    bottom: 0,
    justifyContent: 'flex-end',
  },
  blurWrap: {
    height: '25%', //Here we need to specify the height of blurred part
    overflow: 'hidden',
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
});

const itemWidth = 200; // Replace with your actual item width

export default MyCarousel;