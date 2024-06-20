import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  AText,
  ARow,
  AppLoader,
  TextInput,
  AButton,
  ProductCard,
} from '../../theme-components';
import { useDispatch, useSelector } from 'react-redux';
import URL from '../../utils/baseurl';
import Icon from 'react-native-vector-icons/FontAwesome';
import IonIcon from 'react-native-vector-icons/Ionicons';

import FastImage from 'react-native-fast-image';
import {
  capitalizeFirstLetter,
  formatCurrency,
  isEmpty,
} from '../../utils/helper';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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
import FilterModal from './filter';

const SubCategoriesScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const [amountRange, setAmountRange] = useState([0, 10000]);
  const [loader, setLoader] = useState(false);

  // variables
  const snapPoints = useMemo(() => ['60%'], []); // For Bottomsheet Modal
  const { currencyOptions, currencySymbol } = useSelector(
    (state) => state.settings,
  );
  // callbacks
  const handlePresentModalPress = useCallback(() => {
    setFilterModal(!filterModal);
    // bottomSheetModalRef.current?.present();
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
  const [filterModal, setFilterModal] = useState(false);
  const [filterList, setFilterList] = useState([]);
  const [filterSelect, setFilterSelect] = useState(0);
  const [sortBy, setSortBy] = useState({
    field: 'date',
    type: 'desc',
  });
  //Custom Functions
  const handleinpiut = (e) => {
    setInpvalue(e);
  };
  const sortData = {
    heading: 'Sort',
    type: 'choice',
    field: 'sort',
    category: 'static',
    valueType: 'ObjectId',
    data: [
      {
        label: 'Lowest to highest',
        value: {
          field: 'pricing.sellprice',
          type: 'asc',
        },
        select: false,
      },
      {
        label: 'highest to Lowest',
        value: {
          field: 'pricing.sellprice',
          type: 'desc',
        },
        select: false,
      },
      {
        label: 'Newest',
        value: {
          field: 'date',
          type: 'desc',
        },
        select: false,
      },
    ],
  };

  useEffect(() => {
    setFilterList([sortData, ...filterData]);
  }, [filterData]);
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
        if (!isEmpty(name) && name.toLowerCase().match(reg)) {
          return item;
        }
      });
    } else if (selectedCat !== 'All' && isEmpty(inpvalue)) {
      array = singleCateogry.filter((item) => {
        return item;
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
      filters: filterList.filter(
        (item) => item.field !== 'sort' && !isEmpty(item.select),
      ),
      pageNo: 1,
      limit: 10,
    };
    dispatch(catProductAction(filter, true));
    setFilterModal(false);
    // bottomSheetModalRef.current?.dismiss();
  };

  const handleReset = () => {
    setActiveBrand([]);
    setStarCount(0);
    setAmountRange[(0, 10000)];
    setFilterModal(false);
    // bottomSheetModalRef.current?.dismiss();
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
      <ProductCard
        category={item}
        displayImage={item.feature_image}
        fontsizesmall={true}
        showRating={true}
        showItemLeft={true}
        productWidth={windowWidth * 0.48}
        navigateNextScreen={() => {
          navigation.navigate(NavigationConstants.SINGLE_PRODUCT_SCREEN, {
            productID: item._id,
            productUrl: item.url,
          });
        }}
      />
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
              onPress={() => navigation.goBack()}
              name="arrowleft"
              size={22}
            />
            <AText fonts={FontStyle.fontBold} ml="20px">
              {capitalizeFirstLetter(singleCat.url).replace(/-/g, ' ')}
            </AText>
          </View>
          <ARow
            ml="30px"
            mr="30px"
            mt={'10px'}
            row
            justifyContent="space-between"
            alignItems="center"
            position="relative">
            <View style={{ width: '85%', justifyContent: 'center' }}>
              <Icon
                style={styles.iconstyle}
                name={'search'}
                size={15}
                color={'black'}
              />
              <TextInput
                height={40}
                bc={'#E0E0E0'}
                value={inpvalue}
                onchange={handleinpiut}
                padding={0}
                pl={35}
                inputBgColor={'#EFF0F0'}
                fs={12}
                placeholder={'Search..'}
                br={30}
                placeholdercolor={'#959696'}
              />
            </View>
            <TouchableOpacity
              onPress={() => handlePresentModalPress()}
              style={[
                styles.filterstyle,
                { backgroundColor: APP_PRIMARY_COLOR },
              ]}>
              <Image
                style={{ resizeMode: 'contain', width: 15 }}
                source={require('../../assets/images/filter.png')}
              />
            </TouchableOpacity>
          </ARow>
          {/* <HeaderContent /> */}
          <View style={{ paddingHorizontal: 15 }}>
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
              <TouchableOpacity
                onPress={() => handleselectedCat('All', null)}
                style={{
                  borderRadius: 15,
                  backgroundColor:
                    'All' == selectedCat ? APP_PRIMARY_COLOR : 'transparent',
                  paddingHorizontal: 12,
                  paddingVertical: 5,
                  margin: 5,
                }}>
                <AText
                  color={'All' == selectedCat ? '#fff' : 'black'}
                  font={FontStyle.semiBold}
                  small>
                  All
                </AText>
              </TouchableOpacity>

              {withChild.map((item) => (
                <TouchableOpacity
                  onPress={() => handleselectedCat(item.url, item.id)}
                  style={{
                    borderRadius: 15,
                    backgroundColor:
                      item.url == selectedCat
                        ? APP_PRIMARY_COLOR
                        : 'transparent',
                    paddingHorizontal: 12,
                    paddingVertical: 5,
                    margin: 5,
                  }}>
                  <AText
                    color={item.url == selectedCat ? '#fff' : 'black'}
                    font={FontStyle.semiBold}
                    small>
                    {item.name}
                  </AText>
                </TouchableOpacity>
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
              marginHorizontal: 5,
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
        <FilterModal
          filterModal={filterModal}
          setFilterModal={(val) => setFilterModal(val)}
          filterList={filterList}
          setFilterList={(val) => setFilterList(val)}
          handleReset={() => handleReset()}
          handleFilter={() => handleFilter()}
          setSortBy={(val) => setSortBy(val)}
        />
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
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'flex-start',
    alignItems: 'center',
    left: 0,
    right: 0,
    marginTop: 10,
  },
  cardstyle: {
    width: '48%',
    height: 236,
    marginBottom: 30,
    borderRadius: 10,
    elevation: 5,
    backgroundColor: '#fff',
  },
  iconstyle: {
    marginRight: 5,
    position: 'absolute',
    left: 10,
    zIndex: 2,
  },
  filterBodyStyle: {
    flexDirection: 'row',
    flex: 1,
    // width:'100%',
    // justifyContent: 'space-between',
    // alignSelf: 'center',
  },
  filterListView: {
    width: '10%',
    backgroundColor: '#F1F1F1',
    marginTop: 4,
  },
  filterListingWrapper: {
    // marginVertical: 10,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    paddingVertical: 15,
    alignSelf: 'center',
  },
  filterModalHeader: {
    flexDirection: 'row',
    shadowColor: '#000',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
    paddingHorizontal: 15,
    paddingVertical: 20,
    backgroundColor: '#fff',
  },
  filterstyle: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: APP_PRIMARY_COLOR,
    borderRadius: 70,
    height: 40,
    width: 40,
    justifyContent: 'center',
  },
  filterListDatastyle: {
    flexDirection: 'row',
    marginBottom: 10,
    marginHorizontal: 10,
    alignItems: 'center',
    flexWrap: 'wrap',
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
