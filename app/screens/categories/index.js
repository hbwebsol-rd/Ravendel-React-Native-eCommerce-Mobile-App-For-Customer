import React, { useEffect, useState } from 'react';
import { AText, AppLoader, } from '../../theme-components';
import { useSelector, useDispatch } from 'react-redux';
import { isEmpty } from '../../utils/helper';
import NavigationConstants from '../../navigation/NavigationConstants';
import Header from '../components/Header';
import {
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import Colors from '../../constants/Colors';
import { getSubcategories } from '../../store/action/productAction';
import { query } from '../../utils/service';
import { GET_FILTEREDPRODUCTS_WITH_PAGINATION } from '../../queries/productQuery';
import MenuListing from './Components/menuListing';

const CategoriesScreen = ({ navigation }) => {
  const mainLoading = useSelector((state) => state.products.loading);
  const dispatch = useDispatch();
  const allCategoriesWithChild = useSelector(
    (state) => state.products.categories,
  );
  const { subcategories, loading } = useSelector((state) => state.products);
  const [subcategoriesData, setSubcategoriesData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [allCategoriesWithChildData, setAllCategoriesWithChildData] = useState(
    [],
  );

  useEffect(() => {
    if (allCategoriesWithChild) {
      setAllCategoriesWithChildData(allCategoriesWithChild);
      getSubcategory(allCategoriesWithChild[0]);
    }
  }, [allCategoriesWithChild]);

  useEffect(() => {
    if (subcategories?.getCategoryPageData) {
      setSubcategoriesData(
        subcategories.getCategoryPageData.mostParentCategoryData.subCategories,
      );
    }
  }, [subcategories]);

  const handleGetSubcategory = async (url) => {
    const subcatPayload = {
      mainFilter: {
        categoryUrl: url,
      },
      filters: [],
      pageNo: 1,
      limit: 3,
    };
    const res = await query(
      GET_FILTEREDPRODUCTS_WITH_PAGINATION,
      subcatPayload,
    );
    if (!res.data.getCategoryPageData.isMostParentCategory) {
      navigation.navigate(NavigationConstants.SUBCATEGORIES_SCREEN, {
        singleCategory: res.data.getCategoryPageData.categoryTree.subCategories,
        withChildern:
          res.data.getCategoryPageData.categoryTree.subCategories.subCategories,
      });
    }
  };
  const getSubcategory = (singleCat) => {
    // setSelectedCategory(singleCat.id);
    const subcat = {
      mainFilter: {
        categoryUrl: singleCat?.url,
      },
      pageNo: 1,
      limit: 3,
    };
    dispatch(getSubcategories(subcat));
  };


  const noRecordView = () => {
    return (
      <View style={styles.emptyViewStyle}>
        <AText
          style={styles.emptyTextStyle}>
          No Records Found
        </AText>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.safeAreaViewStyle}>
      {mainLoading || loading ? <AppLoader /> : null}
      <Header navigation={navigation} title="Categories" />
      {!isEmpty(allCategoriesWithChildData) &&
        allCategoriesWithChildData.length > 0 ?
        <View style={styles.contentContainerView}>
          <MenuListing
            data={allCategoriesWithChildData}
            type={'mainCategory'}
            onPress={(category) => getSubcategory(category)}
            selectedItem={selectedCategory}
          />
          {!isEmpty(subcategoriesData) && subcategoriesData.length > 0 ? (
            <MenuListing
              data={subcategoriesData}
              type={'subCategory'}
              onPress={(category) => handleGetSubcategory(category.url)}
            />
          ) : (
            noRecordView()
          )}
        </View>
        :
        noRecordView()
      }
    </SafeAreaView>
  );
};

export default CategoriesScreen;
const styles = StyleSheet.create({
  safeAreaViewStyle: {
    flex: 1,
    backgroundColor: '#fff'
  },
  contentContainerView: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  emptyViewStyle: {
    width: '75%',
    marginTop: 30,
    flexWrap: 'wrap',
    padding: 15,

  },
  emptyTextStyle: {
    fontSize: 16,
    alignSelf: 'center',
    color: 'grey',
  }
});
