import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  Text,
  TouchableOpacity,
} from 'react-native';
import { AText, ProductCard } from '../../../theme-components';
import { FontStyle } from '../../../utils/config';
import { formatCurrency, isEmpty } from '../../../utils/helper';
import URL from '../../../utils/baseurl';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';
import { ImageBackground } from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import StarRating from 'react-native-star-rating';
import { ProductPriceText } from '../../components';

const windowWidth = Dimensions.get('window').width;
const itemWidth = windowWidth * 0.45; // visible item width
const itemHeight = itemWidth * 1.5; // visible item height

const CardContainer = ({ dataItems, navigatetonext, title }) => {
  const { currencySymbol, currencyOptions } = useSelector(
    (state) => state.settings,
  );
  return (
    <View style={styles.container}>
      {title && (
        <AText mb={'10px'} large fonts={FontStyle.fontBold}>
          {title}
        </AText>
      )}
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}>
        {dataItems.map((item, index) => {
          return (
            <ProductCard
              category={item}
              displayImage={item.feature_image}
              navigateNextScreen={() => navigatetonext(item)}
            />
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
  itemView: {
    width: itemWidth,
    height: itemHeight,
    borderRadius: 10,
    marginBottom: 10,
    paddingTop: 4,
    justifyContent: 'space-between',
    alignItems: 'center',
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
    width: '97%',
    height: '77%',
    borderRadius: 10,
    resizeMode: 'cover',
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
  blurWrap: {
    height: '25%', //Here we need to specify the height of blurred part
    overflow: 'hidden',
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
});
export default CardContainer;
