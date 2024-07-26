import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  AppLoader,
  TextInput,
  MainLayout,
  BackHeader,
} from '../../theme-components';
import { useDispatch, useSelector } from 'react-redux';
import {
  capitalizeFirstLetter,
  isEmpty,
} from '../../utils/helper';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  APP_PRIMARY_COLOR,
} from '../../utils/config';
import { catProductAction } from '../../store/action';

import PropTypes from 'prop-types';
import FilterModal from './Component/filter';
import HorizontalHeaderFilter from './Component/horizontalHeaaderFilter';
import ProductList from './Component/ProductList';

const SubCategoriesScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);

  const handlePresentModalPress = useCallback(() => {
    setFilterModal(!filterModal);
  }, []);

  const [selectedCat, setSelectedCat] = useState('All');
  const singleCat = route?.params?.singleCategory;
  const [selectedCatId, setSelectedCatId] = useState(singleCat?.url);
  const singleCatChildern = route?.params?.withChildern;
  const loading = useSelector((state) => state.products.loading);
  const {
    filterData,
    singleCategoryDetails: singleCateogry,
    totalCount,
  } = useSelector((state) => state.products);
  const [categorydata, setCategorydata] = useState(null);
  const [withChild, setWithChild] = useState([]);
  const [inpvalue, setInpvalue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState('');
  const [filterModal, setFilterModal] = useState(false);
  const [filterList, setFilterList] = useState([]);
  const [filterApply, setFilterApply] = useState(false);
  const [sortBy, setSortBy] = useState({
    field: 'date',
    type: 'desc',
  });

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
    // console.log(JSON.stringify(filter),' filtererere')
    dispatch(catProductAction(filter, true));
    setFilterApply(true)
    setFilterModal(false);
  };


  const handleReset = () => {
    setFilterModal(false);
    const filter = {
      mainFilter: {
        categoryUrl: selectedCatId,
      },
      filters: [],
      pageNo: 1,
      limit: 10,
    };
    dispatch(catProductAction(filter, true));
    setFilterApply(false)
  };



  if (loading) {
    return <AppLoader />;
  }

  return (
    <MainLayout hideScroll>
      <BackHeader name={capitalizeFirstLetter(singleCat?.url).replace(/-/g, ' ')} navigation={navigation} />
      <View style={styles.searchFilterView}>
        <TextInput
          value={inpvalue}
          StylesTextInput={styles.searchTextInputStyle}
          onchange={handleinpiut}
          icon={'search'}
          inputViewStyle={styles.searchInputViewStyle}
          placeholder={'Search..'}
          placeholdercolor={'#959696'}
        />
        <TouchableOpacity
          onPress={() => handlePresentModalPress()}
          style={[
            styles.filterBtnstyle,
            { backgroundColor: APP_PRIMARY_COLOR },
          ]}>
          <Image
            style={{ resizeMode: 'contain', height: 25, width: 20 }}
            source={require('../../assets/images/filter.png')}
          />
        </TouchableOpacity>
      </View>
      <HorizontalHeaderFilter
        data={[{ name: 'All', url: 'All' }, ...withChild]}
        selectedCat={selectedCat}
        onPress={(item) => { setInpvalue(''), handleselectedCat(item.url, item.id) }} />

      <ProductList
        categorydata={categorydata}
        handleLoadMore={() => { handleLoadMore() }}
        navigation={navigation}
        currentPage={currentPage}
        totalPage={totalPage}
        loader={loader}
      />
      <FilterModal
        filterModal={filterModal}
        setFilterModal={(val) => setFilterModal(val)}
        filterList={filterList}
        setFilterList={(val) => setFilterList(val)}
        handleReset={() => handleReset()}
        handleFilter={() => handleFilter()}
        setSortBy={(val) => setSortBy(val)}
        filterApply={filterApply}
        // setFilterApply={setFilterApply}
      />
    </MainLayout>
  );
};

SubCategoriesScreen.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

const styles = StyleSheet.create({
  flatListContainerStyle: {
    paddingBottom: 20,
  },
  emptyComponent: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 16,
    color: 'grey',
  },
  footerButton: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 10,
  },
  searchFilterView: {
    width: '95%',
    marginTop: 10,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 7
  },
  searchTextInputStyle: {
    height: 40,
    borderColor: '#E0E0E0',
    padding: 0,
    paddingLeft: 35,
    borderRadius: 30,
    backgroundColor: '#EFF0F0'
  },
  searchInputViewStyle: {
    flexDirection: 'row-reverse',
    width: '95%',
    alignSelf: 'center',
    justifyContent: 'center',
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
  flatListContainerStyle: {
    marginTop: 10,
    flexDirection: 'column',
    margin: 'auto',
    marginHorizontal: 7,
    paddingBottom: 20,
  },
  filterBtnstyle: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: APP_PRIMARY_COLOR,
    borderRadius: 70,
    height: 40,
    width: 40,
    justifyContent: 'center',
  },

});

export default SubCategoriesScreen;
