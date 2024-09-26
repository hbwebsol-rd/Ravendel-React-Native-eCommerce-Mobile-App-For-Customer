import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components/native';
import {
  AText,
  AContainer,
  AHeader,
  ARow,
  ACol,
  AppLoader,
  TextInput,
  AButton,
} from '../../theme-components';
import { useDispatch, useSelector } from 'react-redux';
import URL from '../../utils/baseurl';
import Icon from 'react-native-vector-icons/FontAwesome';
import { CommonActions, useIsFocused } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import { formatCurrency, isEmpty } from '../../utils/helper';
import {
  FlatList,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ScrollView as GestureScrollView } from 'react-native-gesture-handler';
import AIcon from 'react-native-vector-icons/AntDesign';
import {
  APP_PRIMARY_COLOR,
  APP_SECONDARY_COLOR,
  FontStyle,
  dummyImage,
  windowWidth,
} from '../../utils/config';
import { catProductAction } from '../../store/action';
import { ProductPriceText } from '../components';
import Feather from 'react-native-vector-icons/Feather';
import StarRating from 'react-native-star-rating';
import LinearGradient from 'react-native-linear-gradient';
import { CAT_PRODUCTS_CLEAR } from '../../store/action/productAction';
import Colors from '../../constants/Colors';
import Styles from '../../Theme';
import Header from '../components/Header';
import NavigationConstants from '../../navigation/NavigationConstants';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import PropTypes from 'prop-types';

const Shop = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const [amountRange, setAmountRange] = useState([0, 10000]);

  const multiSliderValuesChange = (values) => {
    setAmountRange(values);
  };
  const bottomSheetModalRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => ['60%'], []);
  const { currencyOptions, currencySymbol } = useSelector(
    (state) => state.settings,
  );
  // callbacks
  const handlePresentModalPress = useCallback(() => {
    console.log('pressing', bottomSheetModalRef.current);
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index) => {
    console.log('handleSheetChanges', index);
  }, []);
  const [starCount, setStarCount] = useState(5);
  const [ActiveBrand, setActiveBrand] = useState('');
  const onStarRatingPress = (rating) => {
    setStarCount(rating);
  };
  const { brands } = useSelector((state) => state.settings);
  const [selectedCat, setSelectedCat] = useState('All');
  const [selectedCatId, setSelectedCatId] = useState('');
  const searchWord = route?.params?.searchTerm;

  const loading = useSelector((state) => state.products.loading);
  const singleCateogry = useSelector(
    (state) => state.products.singleCategoryDetails,
  );

  const [categorydata, setCategorydata] = useState(null);
  const [searchTerm, setsearchTerm] = useState(searchWord);

  //Custom Functions
  const handleinpiut = (e) => {
    setsearchTerm(e);
  };

  // Custom Call

  useEffect(() => {
    let array;
    if (
      isEmpty(searchTerm) &&
      selectedCat === 'All' &&
      !isEmpty(singleCateogry)
    ) {
      // console.log(JSON.stringify(singleCateogry));
      setCategorydata(singleCateogry);
      return array;
    } else if (selectedCat !== 'All' && !isEmpty(searchTerm)) {
      let reg = new RegExp(searchTerm.toLowerCase());
      array = singleCateogry.filter((item) => {
        let name = item.name;
        if (
          !isEmpty(name) &&
          name.toLowerCase().match(reg) &&
          selectedCat === item.url
        ) {
          return item;
        }
      });
    } else if (selectedCat !== 'All' && isEmpty(searchTerm)) {
      array = singleCateogry.filter((item) => {
        if (selectedCat === item.url) {
          return item;
        }
      });
    } else if (!isEmpty(searchTerm) && selectedCat === 'All') {
      let reg = new RegExp(searchTerm.toLowerCase());
      array = singleCateogry.filter((item) => {
        let name = item.name;
        if (!isEmpty(name) && name.toLowerCase().match(reg)) {
          return item;
        }
      });
    }
    setCategorydata(array);
  }, [searchTerm, selectedCat, singleCateogry]);

  const handleFilter = () => {
    const brandobj = !isEmpty(ActiveBrand)
      ? brands
          .filter((item) => item.name === ActiveBrand)
          .map((item) => {
            return { id: item.id, name: item.name };
          })
      : '';
    let filter = {
      category: selectedCatId,
      brand: !isEmpty(brandobj) ? brandobj[0] : '',
      most_reviewed: false,
      product_type: '',
      rating: {
        min: 0,
        max: starCount,
      },
      price: {
        min: amountRange[0],
        max: amountRange[1],
      },
      search: searchTerm,
    };
    dispatch(catProductAction(filter, true));
  };

  useEffect(() => {
    let filter = {
      category: '',
      brand: '',
      most_reviewed: false,
      product_type: '',
      rating: {
        min: 0,
        max: 5,
      },
      price: {
        min: 1,
        max: 100000,
      },
      search: searchTerm,
    };
    dispatch(catProductAction(filter));
  }, []);

  useEffect(() => {
    return () => {
      dispatch({
        type: CAT_PRODUCTS_CLEAR,
      });
    };
  }, []);

  const handleReset = () => {
    setActiveBrand('');
    setStarCount(5);
    setAmountRange[(0, 10000)];
    setsearchTerm('');
    bottomSheetModalRef.current?.dismiss();
    let filter = {
      category: '',
      brand: '',
      most_reviewed: false,
      product_type: '',
      rating: {
        min: 0,
        max: 5,
      },
      price: {
        min: 1,
        max: 100000,
      },
      search: '',
    };
    dispatch(catProductAction(filter, true));
  };
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
              : dummyImage,
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
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              // navigatetonext(item);
            }}
            style={styles.overlay}></TouchableOpacity>
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
    <BottomSheetModalProvider>
      <View style={Styles.mainContainer}>
        <Header navigation={navigation} title={'Shop'} />

        <ARow
          ml="30px"
          mr="30px"
          mt={'50px'}
          row
          justifyContent="space-between"
          alignItems="center"
          position="relative">
          <View style={{ width: '65%', justifyContent: 'center' }}>
            <Icon
              style={styles.iconstyle}
              name={'search'}
              size={15}
              color={'black'}
            />
            <TextInput
              height={30}
              bc={'#E0E0E0'}
              value={searchTerm}
              onchange={handleinpiut}
              padding={0}
              pl={35}
              inputBgColor={Colors.whiteColor}
              fs={12}
              placeholder={'Search'}
              placeholdercolor={'black'}
              br={30}
              color={Colors.blackColor}
            />
          </View>
          <TouchableOpacity
            onPress={() => handlePresentModalPress()}
            style={styles.filterstyle}>
            <AIcon name={'filter'} size={20} color={'black'} />
            <AText color="black" ml="10px">
              Filter
            </AText>
          </TouchableOpacity>
        </ARow>

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
          }}
          ListEmptyComponent={() => (
            <View>
              <AText
                style={{ fontSize: 16, alignSelf: 'center', color: 'grey' }}>
                No Records Found
              </AText>
            </View>
          )}
        />
        <BottomSheetModal
          // enableDismissOnClose={false}
          ref={bottomSheetModalRef}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          // handleStyle={{ backgroundColor: 'pink' }}
          containerStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          style={{ flex: 1, elevation: 10, paddingHorizontal: 15 }}>
          <GestureScrollView showsVerticalScrollIndicator={false}>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <AText fonts={FontStyle.semiBold}>Filter</AText>
              <TouchableOpacity onPress={() => handleReset()}>
                <AText fonts={FontStyle.semiBold}>Reset</AText>
              </TouchableOpacity>
            </View>
            <AText mt={'20px'} mb={'5px'} fonts={FontStyle.semiBold}>
              Brands
            </AText>
            <View
              style={{
                elevation: 10,
                flexDirection: 'row',
                flexWrap: 'wrap',

                // backgroundColor: 'orange',
              }}>
              {brands.map((item) => (
                <TouchableOpacity
                  onPress={() => setActiveBrand(item.name)}
                  style={{
                    ...styles.chipstyle,
                    backgroundColor:
                      ActiveBrand === item.name
                        ? Colors.green
                        : Colors.lightGreen,
                  }}>
                  <AText
                    fonts={FontStyle.semiBold}
                    color={
                      ActiveBrand === item.name
                        ? Colors.whiteColor
                        : Colors.blackColor
                    }>
                    {item.name}
                  </AText>
                </TouchableOpacity>
              ))}
            </View>
            <AText
              mt="20px"
              color={Colors.blackColor}
              fonts={FontStyle.semiBold}>
              Price Range
            </AText>
            <Text>
              Selected Range: {amountRange[0]} - {amountRange[1]}
            </Text>

            <MultiSlider
              containerStyle={{ marginLeft: 20 }}
              values={amountRange}
              sliderLength={300}
              onValuesChange={multiSliderValuesChange}
              min={0}
              max={10000}
              step={1}
              allowOverlap={false}
              snapped
              selectedStyle={{
                backgroundColor: APP_PRIMARY_COLOR,
              }}
              unselectedStyle={{
                backgroundColor: APP_PRIMARY_COLOR,
              }}
              markerStyle={{
                backgroundColor: APP_PRIMARY_COLOR,
              }}
            />
            <AText color={Colors.blackColor} fonts={FontStyle.semiBold}>
              Rating
            </AText>
            <View style={{ width: '35%' }}>
              <StarRating
                disabled={false}
                maxStars={5}
                rating={starCount}
                selectedStar={(rating) => onStarRatingPress(rating)}
                emptyStarColor={'gray'}
                starSize={19}
                containerStyle={{ marginTop: 5 }}
                fullStarColor={'#FFDB20'}
              />
            </View>
          </GestureScrollView>
          <View style={{ width: '100%', paddingBottom: 5 }}>
            <AButton
              mt={'20px'}
              title={'Apply Filter'}
              round
              onPress={() => handleFilter()}
            />
          </View>
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  );
};

Shop.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

const styles = StyleSheet.create({
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

export default Shop;
