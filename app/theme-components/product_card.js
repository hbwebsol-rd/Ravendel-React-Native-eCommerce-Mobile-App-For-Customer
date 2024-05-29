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

const windowWidth = Dimensions.get('window').width;
const itemWidth = windowWidth * 0.45; // visible item width
const itemHeight = itemWidth * 1.5; // visible item height

function ProductCard({
  category,
  displayImage,
  navigateNextScreen,
  showRating,
  showItemLeft,
}) {
  console.log(category, 'category');
  return (
    <TouchableOpacity
      style={styles.itemView}
      onPress={() => {
        navigateNextScreen(category);
        // setSelectedId(item._id);
      }}>
      {showItemLeft && (
        //  && category.quantity < 5
        <View style={[styles.overlay]}>
          <AText color={'#fff'} xtrasmall fonts={FontStyle.fontBold}>
            {category.quantity} left
          </AText>
        </View>
      )}
      <Image
        source={{
          uri: !isEmpty(displayImage)
            ? URL + displayImage
            : 'https://www.hbwebsol.com/wp-content/uploads/2020/07/category_dummy.png',
          priority: FastImage.priority.normal,
        }}
        style={styles.imageStyle}
      />
      {showRating && (
        //  && category.quantity < 5
        <View style={[styles.ratingOverlay]}>
          <StarRating
            disabled={true}
            maxStars={1}
            rating={1}
            fullStarColor={APP_PRIMARY_COLOR}
            starSize={14}
          />
          <AText xtrasmall ml={'5px'} fonts={FontStyle.fontBold}>
            {category.rating}
          </AText>
        </View>
      )}
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
    width: itemWidth,
    height: itemHeight,
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
    padding: 2,
    borderRadius: 7,
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
  },
  ratingOverlay: {
    position: 'absolute',
    bottom: 78,
    left: 10,
    // width: 20,
    overflow: 'hidden',
    paddingHorizontal: 5,
    flexDirection: 'row',
    zIndex: 1,
    // backgroundColor: 'rgba(255, 255, 255, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DBD6D4',
  },

  textContainer: {
    // position: 'absolute',
    overflow: 'hidden',
    width: '100%',
    // justifyContent: 'center',
    // alignItems: 'center',
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
});
