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
  ActivityIndicator,
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
import StarRating from 'react-native-star-rating';
import Colors from '../../constants/Colors';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import NavigationConstants from '../../navigation/NavigationConstants';
import PropTypes from 'prop-types';
import BrandFilter from '../components/BrandFilter';
import RangeFilter from '../components/RangeFilter';
import RatingFilter from '../components/RatingFilter';

const SubCategoriesScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const [amountRange, setAmountRange] = useState([0, 10000]);
  const [loader, setLoader] = useState(false);

  const bottomSheetModalRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => ['60%'], []); // For Bottomsheet Modal
  const { currencyOptions, currencySymbol } = useSelector(
    (state) => state.settings,
  );
  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback((index) => {
    console.log('handleSheetChanges', index);
  }, []);

  const [starCount, setStarCount] = useState(0);

  const onStarRatingPress = (rating) => {
    setStarCount(rating);
  };
  const [selectedCat, setSelectedCat] = useState('All');
  const singleCat = route?.params?.singleCategory;
  const [selectedCatId, setSelectedCatId] = useState(singleCat.url);
  const singleCatChildern = route?.params?.withChildern;
  const loading = useSelector((state) => state.products.loading);
  const {
    filterData,
    singleCategoryDetails: singleCateogry,
    totalCount,
  } = useSelector((state) => state.products);
  const { brands } = useSelector((state) => state.settings);
  const [categorydata, setCategorydata] = useState(null);
  const [optionSelect, setOptionSelect] = useState(['All']);
  const [withChild, setWithChild] = useState([]);
  const [inpvalue, setInpvalue] = useState('');
  const [ActiveBrand, setActiveBrand] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState('');
  const [sortBy, setSortBy] = useState({
    field: 'date',
    type: 'desc',
  });
  //Custom Functions
  const handleinpiut = (e) => {
    setInpvalue(e);
  };

  const handleLoadMore = () => {
    setLoader(true);
    const filter = {
      mainFilter: {
        categoryUrl: selectedCatId,
      },
      filters: [],
      pageNo: 1,
      limit: 10 * (currentPage + 1),
    };
    dispatch(
      catProductAction(filter, true, setLoader, setCurrentPage, currentPage),
    );
  };
  // Custom Call
  const handleselectedCat = (name, id) => {
    if (name === 'All') {
      setSelectedCat('All');
      setSelectedCatId(singleCat.url);
    } else {
      setSelectedCat(name);
      setSelectedCatId(name);
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
    if (totalCount > 0) {
      setTotalPage(Math.ceil(totalCount / 10));
    }
  }, [singleCateogry, totalCount]);

  useEffect(() => {
    if (selectedCat !== 'All') {
      const filter = {
        mainFilter: {
          categoryUrl: selectedCatId,
        },
        filters: [],
        pageNo: 1,
        limit: 10,
      };
      dispatch(catProductAction(filter));
    } else {
      const filter = {
        mainFilter: {
          categoryUrl: selectedCatId,
        },
        filters: [],
        pageNo: 1,
        limit: 10,
      };

      dispatch(catProductAction(filter));
    }
  }, [selectedCat]);

  const handleFilter = () => {
    const filter = {
      mainFilter: {
        categoryUrl: selectedCatId,
      },
      sort: sortBy,
      filters: [
        {
          field: 'brand',
          type: 'array',
          category: 'static',
          valueType: 'ObjectId',
          select: ActiveBrand,
        },
        {
          field: 'pricing.sellprice',
          type: 'range',
          category: 'static',
          select: {
            minValue: amountRange[0],
            maxValue: amountRange[1],
          },
        },
        {
          field: 'rating',
          type: 'choice',
          category: 'static',
          valueType: 'Integer',
          select: {
            minValue: starCount,
          },
        },
      ],
      pageNo: 1,
      limit: 10,
    };
    dispatch(catProductAction(filter, true));
    bottomSheetModalRef.current?.dismiss();
  };

  const handleReset = () => {
    setActiveBrand([]);
    setStarCount(0);
    setAmountRange[(0, 10000)];
    bottomSheetModalRef.current?.dismiss();
    const filter = {
      mainFilter: {
        categoryUrl: selectedCatId,
      },
      filters: [],
      pageNo: 1,
      limit: 10,
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

  const sortData = [
    {
      name: 'Lowest to highest',
      sortData: {
        field: 'pricing.sellprice',
        type: 'asc',
      },
    },
    {
      name: 'highest to Lowest',
      sortData: {
        field: 'pricing.sellprice',
        type: 'desc',
      },
    },
    {
      name: 'Newest',
      sortData: {
        field: 'date',
        type: 'desc',
      },
    },
  ];

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
              {capitalizeFirstLetter(singleCat.url).replace(/-/g, ' ')}
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
              paddingBottom: 20,
            }}
            ListEmptyComponent={() => (
              <View>
                <AText
                  style={{ fontSize: 16, alignSelf: 'center', color: 'grey' }}>
                  No Records Found
                </AText>
              </View>
            )}
            ListFooterComponent={() =>
              // Render Load More button as a footer
              currentPage < totalPage && (
                <TouchableOpacity
                  onPress={() => handleLoadMore()}
                  style={{
                    width: '100%',
                    alignItems: 'center',
                    paddingVertical: 2,
                  }}>
                  {loader ? (
                    <ActivityIndicator />
                  ) : (
                    <AText color={Colors.blue}>Load More</AText>
                  )}
                </TouchableOpacity>
              )
            }
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
            {filterData &&
              filterData.map((item) =>
                item.field === 'brand' ? (
                  <BrandFilter
                    ActiveBrand={ActiveBrand}
                    setActiveBrand={setActiveBrand}
                    data={item}
                  />
                ) : item.field === 'pricing.sellprice' ? (
                  <RangeFilter setAmountRange={setAmountRange} data={item} />
                ) : item.field === 'rating' ? (
                  <RatingFilter
                    starCount={starCount}
                    onStarRatingPress={onStarRatingPress}
                    data={item}
                  />
                ) : null,
              )}

            <AText
              color={Colors.blackColor}
              mt={'10px'}
              fonts={FontStyle.semiBold}>
              Sort By
            </AText>
            <View style={{ width: '35%' }}>
              {sortData.map((item) => (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TouchableOpacity
                    onPress={() => setSortBy(item.sortData)}
                    style={{
                      marginRight: 5,
                      height: 15,
                      width: 15,
                      borderWidth: 1,
                      borderColor: Colors.blackColor,
                      borderRadius: 8,
                      backgroundColor:
                        sortBy.field == item.sortData.field &&
                        sortBy.type == item.sortData.type
                          ? APP_PRIMARY_COLOR
                          : Colors.transparentColor,
                    }}></TouchableOpacity>
                  <AText>{item.name}</AText>
                </View>
              ))}
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

export default SubCategoriesScreen;
