import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  TextInput,
} from 'react-native';
import {
  CLEAR_SEARCH_PRODUCT,
  catProductSearchAction,
} from '../../store/action/productAction';
import { useDispatch, useSelector } from 'react-redux';
import { ARow, AText, AppLoader } from '../../theme-components';
import URL from '../../utils/baseurl';
import StarRating from 'react-native-star-rating';
import Colors from '../../constants/Colors';
import {
  capitalizeFirstLetter,
  formatCurrency,
  isEmpty,
} from '../../utils/helper';
import AIcon from 'react-native-vector-icons/AntDesign';
import { FontStyle } from '../../utils/config';
import Icon from 'react-native-vector-icons/FontAwesome';
import FastImage from 'react-native-fast-image';
import NavigationConstants from '../../navigation/NavigationConstants';

const SearchProduct = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const searchWord = route?.params?.searchTerm;
  const loading = useSelector((state) => state.products.loading);
  const { currencyOptions, currencySymbol } = useSelector(
    (state) => state.settings,
  );
  const {
    filterData,
    singleCategoryDetails: singleCateogry,
    totalCount,
  } = useSelector((state) => state.products);
  const [categorydata, setCategorydata] = useState(null);
  const [searchTerm, setsearchTerm] = useState(searchWord);
  console.log(searchWord, singleCateogry, ' srt');

  useEffect(() => {
    setCategorydata(singleCateogry);
  }, [singleCateogry]);

  useEffect(() => {
    setsearchTerm(searchWord);
  }, [searchWord]);

  useEffect(() => {
    const filter = {
      searchTerm: searchTerm,
      page: 1,
      limit: 100,
    };
    console.log(filter, ' prod filter');
    dispatch(catProductSearchAction(filter));
  }, [searchTerm]);

  useEffect(() => {
    return () => {
      dispatch({ type: CLEAR_SEARCH_PRODUCT });
    };
  }, []);

  function renderItem({ item }) {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate(NavigationConstants.SINGLE_PRODUCT_SCREEN, {
            productID: item._id,
            productUrl: item.url,
          });
        }}
        style={styles.cardstyle}>
        <ImageBackground
          source={{
            uri: !isEmpty(item.feature_image)
              ? URL + item.feature_image
              : 'https://www.hbwebsol.com/wp-content/uploads/2020/07/category_dummy.png',
            priority: FastImage.priority.normal,
          }}
          style={styles.centeredItemImage}
          imageStyle={{ borderRadius: 10, resizeMode: 'contain' }}>
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
          <TouchableOpacity activeOpacity={0.9} style={styles.overlay} />
          <View style={styles.textContainer}>
            <AText mb="5px" small fonts={FontStyle.fontBold}>
              {item.name.length > 14
                ? item.name.substring(0, 14) + '...'
                : item.name}
            </AText>
            <AText small fonts={FontStyle.fontBold} style={styles.text}>
              {formatCurrency(
                item.pricing.sellprice,
                currencyOptions,
                currencySymbol,
              )}
            </AText>
          </View>
          <View style={styles.textContainer2}>
            <TouchableOpacity style={styles.iconcontainer}>
              <Icon name="shopping-cart" color={'black'} size={14} />
            </TouchableOpacity>
            <StarRating
              disabled={true}
              maxStars={5}
              rating={item.rating}
              fullStarColor={'#FFDB20'}
              emptyStarColor={'gray'}
              starSize={10}
            />
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  }

  if (loading) {
    return <AppLoader />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <View style={styles.header}>
        <AIcon
          onPress={() => navigation.navigate(NavigationConstants.HOME_SCREEN)}
          name="arrowleft"
          size={22}
        />
        <AText fonts={FontStyle.semiBold} ml="20px">
          {searchTerm
            ? capitalizeFirstLetter(searchTerm).replace(/-/g, ' ')
            : ''}
        </AText>
      </View>
      <FlatList
        numColumns={2}
        data={categorydata}
        snapToAlignment="center"
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{
          marginTop: 10,
          flexDirection: 'column',
          margin: 'auto',
          marginHorizontal: 30,
          paddingBottom: 20,
        }}
        ListEmptyComponent={() => (
          <View>
            <AText style={{ fontSize: 16, alignSelf: 'center', color: 'grey' }}>
              No Records Found
            </AText>
          </View>
        )}
        // ListFooterComponent={() =>
        //   // Render Load More button as a footer
        //   currentPage < totalPage && (
        //     <TouchableOpacity
        //       onPress={() => handleLoadMore()}
        //       style={{
        //         width: '100%',
        //         alignItems: 'center',
        //         paddingVertical: 2,
        //       }}>
        //       {loader ? (
        //         <ActivityIndicator />
        //       ) : (
        //         <AText color={Colors.blue}>Load More</AText>
        //       )}
        //     </TouchableOpacity>
        //   )
        // }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fastImageStyle: { flex: 1, resizeMode: 'cover' },
  chipstyle: {
    backgroundColor: Colors.lightGreen,
    height: 30,
    width: 'auto',
    alignItems: 'center',
    marginRight: 10,
    // marginLeft: 10,
    borderRadius: 26,
    paddingHorizontal: 15,
    justifyContent: 'center',
    marginTop: 5,
  },
  heart: {
    position: 'absolute',
    right: 15,
    top: 15,
    zIndex: 10,
    fontWeight: '900',
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
  cardstyle: {
    width: '48%',
    height: 236,
    marginBottom: 30,
    borderRadius: 10,
    elevation: 5,
  },
  iconstyle: {
    marginRight: 5,
    position: 'absolute',
    left: 10,
    zIndex: 2,
  },
  filterstyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.whiteColor,
    borderRadius: 30,
    height: 30,
    width: '30%',
    borderWidth: 0.5,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
  },
  centeredItemImage: {
    width: '100%',
    height: '100%',
    // resizeMode: 'contain',
    borderRadius: 10,
    // marginHorizontal: windowWidth * 0.05,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '25%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
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
    marginHorizontal: 10,
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  iconcontainer: {
    marginBottom: 5,
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

export default SearchProduct;
