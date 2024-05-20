import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  Text,
  TouchableOpacity,
} from 'react-native';
import { AText } from '../../../theme-components';
import { FontStyle } from '../../../utils/config';
import { formatCurrency, isEmpty } from '../../../utils/helper';
import URL from '../../../utils/baseurl';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';
import { ImageBackground } from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import StarRating from 'react-native-star-rating';

const windowWidth = Dimensions.get('window').width;
const itemWidth = windowWidth * 0.45; // visible item width
const itemHeight = itemWidth * 1.5; // visible item height

const CardContainer = ({ dataItems, navigatetonext, title }) => {
  const { currencySymbol, currencyOptions } = useSelector(
    (state) => state.settings,
  );
  return (
    <View style={styles.container}>
      <AText mb={'10px'} large fonts={FontStyle.fontBold}>
        {title}
      </AText>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}>
        {dataItems.map((item, index) => {
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
        })}
      </View>
    </View>
  );
};

CardContainer.propTypes = {
  dataItems: PropTypes.array,
  navigatetonext: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  card: {
    borderRadius: 10,
    padding: 10,
    // overflow: 'hidden',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '80%',
  },
  itemImage: {
    width: itemWidth,
    height: itemHeight,
    resizeMode: 'contain',
    borderRadius: 10,
    marginBottom: 10,
    // marginHorizontal: (windowWidth * 0.1) / 2,
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
    marginHorizontal: 10,
    marginBottom: 10,
  },
  textContainer2: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    textAlign: 'right',
    marginHorizontal: 5,
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
export default CardContainer;
