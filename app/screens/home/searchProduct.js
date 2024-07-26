import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  CLEAR_SEARCH_PRODUCT,
  catProductSearchAction,
} from '../../store/action/productAction';
import { useDispatch, useSelector } from 'react-redux';
import {
  AText,
  AppLoader,
  TextInput,
  MainLayout,
} from '../../theme-components';
import Colors from '../../constants/Colors';

import AIcon from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/FontAwesome';
import NavigationConstants from '../../navigation/NavigationConstants';
import { useIsFocused } from '@react-navigation/native';
import GridCardContainer from '../../theme-components/GridCardContainer';

const SearchProduct = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const searchWord = route?.params?.searchTerm;
  const isFocused = useIsFocused();
  const loading = useSelector((state) => state.products.loading);
  const { singleCategoryDetails: singleCateogry } = useSelector(
    (state) => state.products,
  );
  const [categorydata, setCategorydata] = useState(null);
  const [searchTerm, setsearchTerm] = useState(searchWord);

  useEffect(() => {
    setCategorydata(singleCateogry);
  }, [singleCateogry]);

  useEffect(() => {
    setsearchTerm(searchWord);
    changeSearch();
  }, [isFocused]);

  const changeSearch = () => {
    const filter = {
      searchTerm: searchTerm,
      page: 1,
      limit: 100,
    };
    dispatch(catProductSearchAction(filter));
  };

  useEffect(() => {
    return () => {
      dispatch({ type: CLEAR_SEARCH_PRODUCT });
    };
  }, []);

  if (loading) {
    return <AppLoader />;
  }

  return (
    <MainLayout hideScroll>
      <View style={styles.header}>
        <AIcon
          onPress={() => navigation.navigate(NavigationConstants.HOME_SCREEN)}
          name="arrowleft"
          size={22}
        />
        <View style={styles.searchstyle}>
          <TextInput
            value={searchTerm}
            icon={'search'}
            inputViewStyle={{ flexDirection: 'row-reverse' }}
            StylesTextInput={styles.textInputViewStyle}
            onSubmit={() => changeSearch()}
            onchange={(e) => setsearchTerm(e)}
            placeholder={'Search'}
            placeholdercolor={'black'}
          />
        </View>
      </View>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {categorydata ? (
          <GridCardContainer
            dataItems={categorydata ? categorydata : []}
            navigatetonext={(item) => {
              navigation.navigate(NavigationConstants.SINGLE_PRODUCT_SCREEN, {
                productID: item._id,
                productUrl: item.url,
              });
            }}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <AText
              textStyle={styles.textStyle}>
              No Product Found
            </AText>
          </View>
        )}
      </ScrollView>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  textInputViewStyle: {
    height: 40,
    padding: 0,
    paddingLeft: 35,
    backgroundColor: "#EFF0F0",
    borderColor: "#EFF0F0",
    borderRadius: 30,

  },
  header: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    paddingTop: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    paddingBottom: 15,
  },
  searchstyle: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    backgroundColor: '#EFF0F0',
    height: 40,
    width: '90%',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#E0E0E0',
    borderWidth: 0.9,
  },
  emptyContainer: { alignSelf: 'center', marginTop: 100 },
  textStyle: {
    fontSize: 16,
    alignSelf: 'center',
    color: 'grey',
    marginTop: 20,
  },
});

export default SearchProduct;
