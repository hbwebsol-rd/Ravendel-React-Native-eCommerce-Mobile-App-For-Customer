import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  ScrollView,
} from 'react-native';
import {
  CLEAR_SEARCH_PRODUCT,
  catProductSearchAction,
} from '../../store/action/productAction';
import { useDispatch, useSelector } from 'react-redux';
import { ARow, AText, AppLoader, TextInput } from '../../theme-components';
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
import CardContainer from './Components.js/RandomCard';
import { useIsFocused } from '@react-navigation/native';

const SearchProduct = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const searchWord = route?.params?.searchTerm;
  const isFocused = useIsFocused();
  const loading = useSelector((state) => state.products.loading);
  const { currencyOptions, currencySymbol } = useSelector(
    (state) => state.settings,
  );
  const { singleCategoryDetails: singleCateogry } = useSelector(
    (state) => state.products,
  );
  const [categorydata, setCategorydata] = useState(null);
  const [searchTerm, setsearchTerm] = useState(searchWord);
  console.log(searchWord, singleCateogry, ' srt');

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
    console.log(filter, ' prod filter');
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
    <>
      <View style={styles.header}>
        <AIcon
          onPress={() => navigation.navigate(NavigationConstants.HOME_SCREEN)}
          name="arrowleft"
          size={22}
        />
        <View style={styles.searchstyle}>
          <Icon
            style={styles.iconstyle}
            name={'search'}
            size={15}
            color={'black'}
          />
          <TextInput
            height={30}
            value={searchTerm}
            onSubmit={() => changeSearch()}
            onchange={(e) => setsearchTerm(e)}
            padding={0}
            pl={35}
            inputBgColor={'#EFF0F0'}
            bc={'#EFF0F0'}
            fs={12}
            placeholder={'Search'}
            placeholdercolor={'black'}
          />
          {/* <AText fonts={FontStyle.fontBold} large ml="20px">
          {searchTerm
            ? capitalizeFirstLetter(searchTerm).replace(/-/g, ' ')
            : ''}
        </AText> */}
        </View>
      </View>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        style={{
          backgroundColor: Colors.whiteColor,
        }}>
        {categorydata ? (
          <CardContainer
            title={''}
            dataItems={categorydata ? categorydata : []}
            navigatetonext={(item) => {
              navigation.navigate(NavigationConstants.SINGLE_PRODUCT_SCREEN, {
                productID: item._id,
                productUrl: item.url,
              });
            }}
          />
        ) : (
          <View style={{ alignSelf: 'center', marginTop: 100 }}>
            <AText
              style={{
                fontSize: 16,
                alignSelf: 'center',
                color: 'grey',
                marginTop: 20,
              }}>
              No Product Found
            </AText>
          </View>
        )}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    left: 0,
    right: 0,
    paddingTop: 10,
    paddingHorizontal: 30,
    zIndex: 10,
    backgroundColor: '#fff',
    paddingBottom: 15,
  },
  searchstyle: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    backgroundColor: '#EFF0F0',
    height: 40,
    width: '90%',
    borderRadius: 30,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginHorizontal: 10,
    justifyContent: 'center',
    borderColor: '#E0E0E0',
    borderWidth: 0.9,
  },
  iconstyle: {
    marginRight: 5,
    position: 'absolute',
    left: 10,
    zIndex: 2,
  },
});

export default SearchProduct;
