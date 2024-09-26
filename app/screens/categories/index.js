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
import { View } from 'react-native';
import Colors from '../../constants/Colors';

const CategoriesScreen = ({ navigation }) => {
  const loading = useSelector((state) => state.products.loading);
  const categories = useDispatch();
  // const allCategoriesWithChild = useSelector(
  //   state => state.products.allCategories,
  // );
  const allCategoriesWithChild = useSelector(
    (state) => state.products.categories,
  );
  const [allCategoriesWithChildData, setAllCategoriesWithChildData] = useState(
    [],
  );

  useEffect(() => {
    if (allCategoriesWithChild) {
      setAllCategoriesWithChildData(allCategoriesWithChild);
    }
  }, [allCategoriesWithChild]);

  const navigateNextScreen = (category) => {
    var navigateTo = '';
    var nestedCategory = [];
    // if (category.children.length < 1) {
    //   navigateTo = 'Category';
    // } else {
    // navigateTo = 'SubcategoriesOption';
    // }

    // var nestedCategory = allCategoriesWithChildData.filter(
    //   cat =>
    //   cat.parentId === category.id,
    // );
    var nestedCategory = [];

    if (!isEmpty(category.children)) {
      nestedCategory = category.children;
    }

    navigation.navigate(NavigationConstants.SUBCATEGORIES_OPTION_SCREEN, {
      singleCategory: category,
      withChildern: nestedCategory,
    });
  };

  //List of categories
  const menuListing = (Categories) => {
    return Categories.map((category) => {
      if (!category.parentId) {
        return (
          <ACol mt={'60px'} col={2} key={category.id}>
            <CategoriesListingWrapper
              activeOpacity={0.9}
              onPress={() => navigateNextScreen(category)}>
              <ARow height="100%" padding={0}>
                <ACol col={1}>
                  <CategoryImageWrapper>
                    <CategoryImage
                      source={{
                        uri: !isEmpty(category.image)
                          ? URL + category.image
                          : 'https://www.hbwebsol.com/wp-content/uploads/2020/07/category_dummy.png',
                      }}
                    />
                  </CategoryImageWrapper>
                </ACol>
                <ACol col={1}>
                  <AText small uppercase color="#000" center>
                    {category.name}
                  </AText>
                </ACol>
              </ARow>
            </CategoriesListingWrapper>
          </ACol>
        );
      }
    });
  };

  return (
    <>
      {loading ? <AppLoader /> : null}
      <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
        <Header navigation={navigation} title="Categories" />
        <View style={{ marginTop: 60 }} />
        {!isEmpty(allCategoriesWithChildData) &&
        allCategoriesWithChildData.length > 0 ? (
          <ARow row wrap>
            {menuListing(allCategoriesWithChildData)}
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
