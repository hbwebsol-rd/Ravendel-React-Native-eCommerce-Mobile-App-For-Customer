import React from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { AText } from '.';
import { APP_PRIMARY_COLOR, FontStyle, GREYTEXT } from '../utils/config';
import URL from '../utils/baseurl';
import { isEmpty } from '../utils/helper';
import PropTypes from 'prop-types';
import { ProductPriceText } from '../screens/components';
import FastImage from 'react-native-fast-image';
import StarRating from 'react-native-star-rating';
import { useSelector } from 'react-redux';

const windowWidth = Dimensions.get('window').width;

function ProductCard({
  category,
  displayImage,
  navigateNextScreen,
  productWidth,
}) {
  const itemWidth = productWidth ?? windowWidth * 0.46;
  const itemHeight = itemWidth * 1.5; // visible item height

  const { stock_display_format, stock_left_quantity } = useSelector(
    (state) => state.settings,
  );
  return (
    <TouchableOpacity
      style={[
        styles.itemView,
        {
          width: itemWidth,
          height: itemHeight,
        },
      ]}
      onPress={() => {
        navigateNextScreen(category);
        // setSelectedId(item._id);
      }}>
      {(stock_display_format == 'leftStock' &&
        category.quantity <= stock_left_quantity) ||
      stock_display_format == 'inStock' ? (
        //  && category.quantity < 5
        <View style={[styles.overlay]}>
          <AText color={'#fff'} xtrasmall fonts={FontStyle.fontBold}>
            {category.quantity} left
          </AText>
        </View>
      ) : null}
      <Image
        source={{
          uri: !isEmpty(displayImage)
            ? URL + displayImage
            : 'https://www.hbwebsol.com/wp-content/uploads/2020/07/category_dummy.png',
          priority: FastImage.priority.normal,
        }}
        style={styles.imageStyle}
      />
      {category.rating > 0 ? (
        <View style={[styles.ratingOverlay]}>
          <StarRating
            disabled={true}
            maxStars={1}
            rating={1}
            fullStarColor={'#ffb400'}
            starSize={14}
          />
          <AText xtrasmall ml={'5px'} fonts={FontStyle.fontBold}>
            {category.rating}
          </AText>
        </View>
      ) : null}
      <View style={styles.textContainer}>
        <AText numberOfLines={2} mb="5px" small fonts={FontStyle.fontBold}>
          {category.name}
        </AText>
        <ProductPriceText fontsizesmall={true} Pricing={category.pricing} />
      </View>
    </TouchableOpacity>
  );
}
ProductCard.propTypes = {
  navigateNextScreen: PropTypes.func,
  allCategories: PropTypes.array,
};

export default ProductCard;
const styles = StyleSheet.create({
  itemView: {
    borderRadius: 10,
    marginBottom: 10,
    paddingTop: 4,
    alignItems: 'center',
    // height: 290,
    // justifyContent: 'space-between',
    // alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 8,
    right: 10,
    // width: 20,
    overflow: 'hidden',
    paddingHorizontal: 5,
    paddingVertical: 4,
    borderRadius: 7,
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
  },
  ratingOverlay: {
    position: 'absolute',
    bottom: 72,
    left: 10,
    // width: 20,
    borderRadius:5,
    overflow: 'hidden',
    paddingHorizontal: 5,
    paddingVertical: 4,
    flexDirection: 'row',
    zIndex: 1,
    // backgroundColor: 'rgba(255, 255, 255, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DBD6D4',
  },

  textContainer: {
    overflow: 'hidden',
    width: '100%',
    marginBottom: 10,
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
});
