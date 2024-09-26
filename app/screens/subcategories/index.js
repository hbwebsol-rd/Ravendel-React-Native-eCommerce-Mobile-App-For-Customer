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
import {
  capitalizeFirstLetter,
  formatCurrency,
  isEmpty,
} from '../../utils/helper';
import {
  // FlatList,
  ImageBackground,
  // ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import AIcon from 'react-native-vector-icons/AntDesign';
import {
  APP_PRIMARY_COLOR,
  APP_SECONDARY_COLOR,
  FontStyle,
  windowWidth,
} from '../../utils/config';
import { catProductAction } from '../../store/action';
import { ProductPriceText } from '../components';
import Feather from 'react-native-vector-icons/Feather';
import StarRating from 'react-native-star-rating';
import LinearGradient from 'react-native-linear-gradient';
import { CAT_PRODUCTS_CLEAR } from '../../store/action/productAction';
import Colors from '../../constants/Colors';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import NavigationConstants from '../../navigation/NavigationConstants';
import PropTypes from 'prop-types';

const SubCategoriesScreen = ({ navigation, route }) => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const [amountRange, setAmountRange] = useState([0, 10000]);
  const [values, setValues] = useState([0, 10000]);

  const multiSliderValuesChange = (values) => {
    setValues(values);
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
  const [starCount, setStarCount] = useState(3.5);

  const onStarRatingPress = (rating) => {
    setStarCount(rating);
  };
  const [selectedCat, setSelectedCat] = useState('All');
  const [selectedCatId, setSelectedCatId] = useState('');
  const singleCat = route?.params?.singleCategory;
  const singleCatChildern = route?.params?.withChildern;
  const loading = useSelector((state) => state.products.loading);
  const singleCateogry = useSelector(
    (state) => state.products.singleCategoryDetails,
  );
  const { brands } = useSelector((state) => state.settings);
  const [categorydata, setCategorydata] = useState(null);
  const [optionSelect, setOptionSelect] = useState(['All']);
  const [withChild, setWithChild] = useState([]);
  const [inpvalue, setInpvalue] = useState('');
  const [ActiveBrand, setActiveBrand] = useState('');

  //Custom Functions
  const handleinpiut = (e) => {
    setInpvalue(e);
  };

  // Custom Call
  const handleselectedCat = (name, id) => {
    if (name == selectedCat) {
      setSelectedCat(null);
      setSelectedCatId(null);
    } else {
      setSelectedCat(name);
      setSelectedCatId(id);
    }
  };
  useEffect(() => {
    let array;
    if (
      isEmpty(inpvalue) &&
      selectedCat === 'All' &&
      !isEmpty(singleCateogry)
    ) {
      setCategorydata(singleCateogry);
      return array;
    } else if (selectedCat !== 'All' && !isEmpty(inpvalue)) {
      let reg = new RegExp(inpvalue.toLowerCase());
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
    } else if (selectedCat !== 'All' && isEmpty(inpvalue)) {
      array = singleCateogry.filter((item) => {
        if (selectedCat === item.url) {
          return item;
        }
      });
    } else if (!isEmpty(inpvalue) && selectedCat === 'All') {
      let reg = new RegExp(inpvalue.toLowerCase());
      array = singleCateogry.filter((item) => {
        let name = item.name;
        if (!isEmpty(name) && name.toLowerCase().match(reg)) {
          return item;
        }
      });
    }
    setCategorydata(array);
  }, [inpvalue, selectedCat]);

  useEffect(() => {
    if (singleCatChildern && singleCatChildern.length > 0) {
      setWithChild(singleCatChildern);
    }
  }, [singleCatChildern]);

  useEffect(() => {
    setCategorydata(singleCateogry);
  }, [singleCateogry]);

  useEffect(() => {
    if (singleCat) {
      let filter = {
        category: singleCat.id,
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
    } else {
      dispatch({
        type: CAT_PRODUCTS_CLEAR,
      });
    }
  }, [isFocused]);

  useEffect(() => {
    if (selectedCat !== 'All') {
      let filter = {
        category: selectedCatId,
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
    } else {
      let filter = {
        category: singleCat.id,
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
    }
  }, [selectedCat]);

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
        min: values[0],
        max: values[1],
      },
      search: '',
    };
    dispatch(catProductAction(filter, true));
  };

  const handleReset = () => {
    setActiveBrand('');
    setStarCount(5);
    setAmountRange[(0, 10000)];
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
    <>
      <BottomSheetModalProvider>
        <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
          <View style={styles.header}>
            <AIcon
              onPress={() =>
                navigation.navigate(NavigationConstants.HOME_SCREEN)
              }
              name="arrowleft"
              size={22}
            />
            <AText fonts={FontStyle.semiBold} ml="20px">
              {capitalizeFirstLetter(singleCat.url)}
            </AText>
          </View>
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
                value={inpvalue}
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
          {/* <HeaderContent /> */}
          <View style={{ paddingHorizontal: 30 }}>
            <ScrollView
              contentContainerStyle={{
                marginTop: 20,
                flexDirection: 'row',
                alignItems: 'space-between',
                justifyContent: 'space-between',
              }}
              scrollEnabled={true}
              keyboardShouldPersistTaps="always"
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              <AButton
                semi
                mr="8px"
                title={'All'}
                onPress={() => handleselectedCat('All', null)}
                bgColor={
                  'All' == selectedCat ? APP_PRIMARY_COLOR : 'transparent'
                }
                color={'All' == selectedCat ? 'white' : 'black'}
                round
                minor={windowWidth < 330 ? true : false}
                small={windowWidth < 400 && windowWidth > 330 ? true : false}
                extramedium={windowWidth > 400 ? true : false}
                xtrasmall
                borderColor={'transparent'}
              />
              {withChild.map((item) => (
                <>
                  <AButton
                    semi
                    mr="8px"
                    key={item.id}
                    title={item.name}
                    onPress={() => handleselectedCat(item.url, item.id)}
                    bgColor={
                      item.url == selectedCat
                        ? APP_PRIMARY_COLOR
                        : 'transparent'
                    }
                    color={item.url == selectedCat ? 'white' : 'black'}
                    round
                    minor={windowWidth < 330 ? true : false}
                    small={
                      windowWidth < 400 && windowWidth > 330 ? true : false
                    }
                    extramedium={windowWidth > 400 ? true : false}
                    xtrasmall
                    borderColor={'transparent'}
                  />
                </>
              ))}
            </ScrollView>
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
        </View>
        <BottomSheetModal
          // enableDismissOnClose={false}
          ref={bottomSheetModalRef}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          containerStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          style={{ flex: 1, elevation: 10, paddingHorizontal: 15 }}>
          <ScrollView showsVerticalScrollIndicator={false}>
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
              Selected Range: {values[0]} - {values[1]}
            </Text>

            <MultiSlider
              containerStyle={{ marginLeft: 20 }}
              values={values}
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
            <AButton
              mt={'20px'}
              title={'Apply Filter'}
              round
              onPress={() => handleFilter()}
            />
          </ScrollView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </>
  );
};

SubCategoriesScreen.propTypes = {
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

const CollapseContainer = styled.View`
  background: #f7f7f7;
  border-radius: 10px;
`;

const CategoriesList = styled.TouchableOpacity``;

const ListItem = styled.View`
  flex: 1;
  flex-wrap: wrap;
  margin: 5px 2px 5px 5px;
  flex-direction: row;
  align-items: center;
`;

const SubCategoryContainer = styled.View``;

const CategoryContainer = styled.View`
  flex: 1;
`;

const CategoryImageWrapper = styled.View`
  width: 30px;
  height: 30px;
  border-radius: 50px;
  overflow: hidden;
`;

const CategoryImage = styled.Image`
  width: null;
  height: null;
  flex: 1;
  resize-mode: cover;
`;
const CollapseIcon = styled.Text`
  align-self: flex-end;
`;

const CategoryName = styled.View`
  flex: 1;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
`;
export default SubCategoriesScreen;
