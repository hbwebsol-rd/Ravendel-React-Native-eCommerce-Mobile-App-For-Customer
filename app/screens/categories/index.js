import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import {
  AText,
  AContainer,
  AHeader,
  ARow,
  ACol,
  AppLoader,
} from '../../theme-components';
import { useSelector, useDispatch } from 'react-redux';
import URL from '../../utils/baseurl';
import { isEmpty, unflatten } from '../../utils/helper';
import NavigationConstants from '../../navigation/NavigationConstants';
import Header from '../components/Header';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Colors from '../../constants/Colors';
import { getSubcategories } from '../../store/action/productAction';
import { query } from '../../utils/service';
import { GET_FILTEREDPRODUCTS_WITH_PAGINATION } from '../../queries/productQuery';

const CategoriesScreen = ({ navigation }) => {
  const mainLoading = useSelector((state) => state.products.loading);
  const dispatch = useDispatch();
  // const allCategoriesWithChild = useSelector(
  //   state => state.products.allCategories,
  // );
  const allCategoriesWithChild = useSelector(
    (state) => state.products.categories,
  );
  const { subcategories, loading } = useSelector((state) => state.products);
  const [subcategoriesData, setSubcategoriesData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [allCategoriesWithChildData, setAllCategoriesWithChildData] = useState(
    [],
  );
  const [errorIndicesCategory, setErrorIndicesCategory] = useState({
    categories: false,
    subCategories: new Set(),
  });

  const handleError = (index, type) => {
    if (type == 'subCategory') {
      const newSubCategories = new Set(errorIndicesCategory.subCategories);
      newSubCategories.add(index);
      setErrorIndicesCategory({
        ...errorIndicesCategory,
        subCategories: newSubCategories,
      });
    } else {
      setErrorIndicesCategory({ subCategories: new Set(), categories: true });
    }
  };

  useEffect(() => {
    if (allCategoriesWithChild) {
      setAllCategoriesWithChildData(allCategoriesWithChild);
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
    setSelectedCategory(singleCat.id);
    const subcat = {
      mainFilter: {
        categoryUrl: singleCat.url,
      },
      pageNo: 1,
      limit: 3,
    };
    dispatch(getSubcategories(subcat));
  };
  //List of categories
  const menuListing = (Categories, disp) => {
    return Categories.map((category, index) => {
      if (!category.parentId) {
        return (
          <Pressable
            activeOpacity={0.9}
            style={[
              styles.CategoriesListingWrapper,
              disp === 'mainCategory' && selectedCategory === category.id
                ? { backgroundColor: '#fff', width: '100%' }
                : {},
            ]}
            onPress={() => {
              setErrorIndicesCategory({
                categories: [],
                subcategories: new Set(),
              });
              disp === 'mainCategory'
                ? getSubcategory(category)
                : handleGetSubcategory(category.url);
            }}>
            <Image
              style={[
                disp === 'mainCategory'
                  ? {
                      height: 40,
                      width: 45,
                      borderRadius: 5,
                      resizeMode: 'contain',
                    }
                  : { height: 70, width: 75, resizeMode: 'contain' },
              ]}
              onError={() => handleError(index, disp)}
              source={{
                uri:
                  (disp === 'subCategory' &&
                    !isEmpty(errorIndicesCategory.subCategories) &&
                    !errorIndicesCategory.subCategories.has(index)) ||
                  (disp === 'mainCategory' && !errorIndicesCategory.categories)
                    ? URL + category.image
                    : 'https://www.hbwebsol.com/wp-content/uploads/2020/07/category_dummy.png',
              }}
            />

            {disp === 'mainCategory' ? (
              <AText uppercase xtrasmall color="#000" center>
                {category.name}
              </AText>
            ) : (
              <AText uppercase small color="#000" center>
                {category.name}
              </AText>
            )}
          </Pressable>
        );
      }
    });
  };

  return (
    <>
      {mainLoading || loading ? <AppLoader /> : null}
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.whiteColor,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Header navigation={navigation} title="Categories" />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.categoriesMainViewStyle}>
          {!isEmpty(allCategoriesWithChildData) &&
          allCategoriesWithChildData.length > 0 ? (
            menuListing(allCategoriesWithChildData, 'mainCategory')
          ) : (
            <View style={{ alignSelf: 'center', marginTop: 20 }}>
              <AText
                style={{
                  fontSize: 16,
                  color: 'grey',
                }}>
                No Records Found
              </AText>
            </View>
          )}
        </ScrollView>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.subCategoriesMainViewStyle}>
          {!isEmpty(subcategoriesData) && subcategoriesData.length > 0 ? (
            <ARow row wrap>
              {menuListing(subcategoriesData, 'subCategory')}
            </ARow>
          ) : (
            <View>
              <AText
                style={{
                  fontSize: 16,
                  alignSelf: 'center',
                  color: 'grey',
                  marginTop: 20,
                }}>
                No Records Found
              </AText>
            </View>
          )}
        </ScrollView>
      </View>
    </>
  );
};

const CategoriesListingWrapper = styled.TouchableOpacity`
  margin: 10px 0 20px 0;
  height: 120px;
  border-radius: 15px;
  background-color: #f7f7f7;
  elevation: 1;
`;

const CategoryImageWrapper = styled.View`
  width: 150px;
  height: 100px;
  margin: -20px auto 10px auto;
  border-radius: 15px;
  overflow: hidden;
  shadow-color: #000;
  shadow-offset: 0 2px;
  shadow-opacity: 0.8;
  shadow-radius: 2px;
  elevation: 10;
`;

const CategoryImage = styled.Image`
  width: null;
  height: null;
  flex: 1;
  resize-mode: cover;
`;

export default CategoriesScreen;
const styles = StyleSheet.create({
  CategoriesListingWrapper: {
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    alignSelf: 'center',
  },
  subCategoriesMainViewStyle: {
    width: '60%',
    flexDirection: 'column',
    backgroundColor: Colors.whiteColor,
    marginTop: 70,
  },
  categoriesMainViewStyle: {
    width: '10%',
    flexDirection: 'column',
    backgroundColor: '#E7F5F4',
    elevation: 5,
    shadowColor: '#000',
    marginTop: 50,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
  },
});
