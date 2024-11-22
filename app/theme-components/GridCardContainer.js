import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { AText, ProductCard } from '.';
import PropTypes from 'prop-types';
import { FontStyle } from '../utils/config';

const windowWidth = Dimensions.get('window').width;
const itemWidth = windowWidth * 0.45; // visible item width
const itemHeight = itemWidth * 1.5; // visible item height

const GridCardContainer = ({ dataItems, navigatetonext, title }) => {
  return (
    <View style={styles.container}>
      {title && (
        <AText style={styles.title} large>
          {title}
        </AText>
      )}
      <View style={styles.grid}>
        {dataItems.map((item, index) => (
          <ProductCard
            key={index}
            category={item}
            displayImage={item.feature_image}
            navigateNextScreen={() => navigatetonext(item)}
          />
        ))}
      </View>
    </View>
  );
};

GridCardContainer.propTypes = {
  dataItems: PropTypes.array.isRequired,
  navigatetonext: PropTypes.func.isRequired,
  title: PropTypes.string,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    marginBottom: 10,
    fontFamily: FontStyle.fontBold,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: itemWidth,
    height: itemHeight,
    borderRadius: 10,
    marginBottom: 10,
    paddingTop: 4,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '80%',
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
  },
  blurWrap: {
    height: '25%', //Here we need to specify the height of blurred part
    overflow: 'hidden',
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
});

export default GridCardContainer;
