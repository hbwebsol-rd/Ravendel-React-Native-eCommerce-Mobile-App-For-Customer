import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import Colors from '../../constants/Colors';
import { AText } from '../../theme-components';
import { FontStyle } from '../../utils/config';
import AIcon from 'react-native-vector-icons/AntDesign';
import { capitalizeFirstLetter, isEmpty } from '../../utils/helper';
import FastImage from 'react-native-fast-image';
import URL from '../../utils/baseurl';
import NavigationConstants from '../../navigation/NavigationConstants';
import PropTypes from 'prop-types';

const SubcategoryOption = ({ navigation, route }) => {
  const singleCat = route?.params?.singleCategory;
  const singleCatChildern = route?.params?.withChildern;
  return (
    <ScrollView style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <View style={styles.header}>
        <AIcon
          onPress={() => navigation.navigate(NavigationConstants.SHOP_SCREEN)}
          name="arrowleft"
          size={22}
        />
        <AText fonts={FontStyle.semiBold} ml="20px">
          {capitalizeFirstLetter(singleCat?.url)}
        </AText>
      </View>
      <View style={styles.catcontainer}>
        {singleCat.children.map((item) => (
          <>
            {/* {console.log(JSON.stringify(item), 'iteeeem')} */}
            <TouchableOpacity
              style={{
                width: '48%',
                height: 236,
                // backgroundColor: 'green',
                marginTop: 15,
                borderRadius: 12,
              }}
              onPress={() => {
                navigation.navigate(NavigationConstants.SUBCATEGORIES_SCREEN, {
                  singleCategory: item,
                  withChildern: item.children,
                });
                // setSelectedId(item._id);
              }}>
              <ImageBackground
                source={{
                  uri: !isEmpty(item.image)
                    ? URL + item.image
                    : 'https://www.hbwebsol.com/wp-content/uploads/2020/07/category_dummy.png',
                  priority: FastImage.priority.normal,
                }}
                style={styles.itemImage}
                imageStyle={{ borderRadius: 10 }}
                resizeMode="cover"
                // blurRadius={10}
              >
                <View style={styles.blurWrap}>
                  <ImageBackground
                    source={{
                      uri: !isEmpty(item.image)
                        ? URL + item.image
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
                    // navigatetonext(item);
                  }}
                  style={styles.overlay}></TouchableOpacity>
                <View style={styles.textContainer}>
                  <AText center mb="5px" medium fonts={FontStyle.fontBold}>
                    {item.name.length > 14
                      ? item.name.substring(0, 14) + '...'
                      : item.name}
                  </AText>
                  {/* <AText medium fonts={FontStyle.fontBold}>
                    $ {item.pricing.sellprice + '.00'}
                  </AText> */}
                  {/* <ProductPriceText fontsizesmall={true} Pricing={item.pricing} /> */}
                </View>
                {/* <View style={styles.textContainer2}>
                  <TouchableOpacity style={styles.iconcontainer}>
                    <Icon name="shopping-cart" color={'black'} size={14} />
                  </TouchableOpacity>
                  <StarRating
                    disabled={true}
                    maxStars={5}
                    rating={3.5}
                    fullStarColor={'#FFDB20'}
                    emptyStarColor={'gray'}
                    starSize={15}
                  />
                </View> */}
              </ImageBackground>
            </TouchableOpacity>
            {/* <View
              style={{
                width: '48%',
                height: 236,
                backgroundColor: 'green',
                marginTop: 15,
              }}>
              <AText>{item.name}</AText>
            </View> */}
          </>
        ))}
      </View>
    </ScrollView>
  );
};

SubcategoryOption.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  catcontainer: {
    marginHorizontal: 30,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    flex: 1,
    marginTop: 55,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    position: 'absolute',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    left: 0,
    right: 0,
    marginTop: 10,
    paddingHorizontal: 30,
    zIndex: 10,
  },
  itemImage: {
    height: 236,
    resizeMode: 'cover',
    borderRadius: 10,
    // width: '40%',
    // backgroundColor: 'green',
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
    // borderTopLeftRadius: 10,
    // borderTopRightRadius: 10,
  },
  textContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    // left: 35,
    // justifyContent: 'center',
    // alignItems: 'center',
    // marginHorizontal: 10,
    marginBottom: 15,
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

export default SubcategoryOption;
