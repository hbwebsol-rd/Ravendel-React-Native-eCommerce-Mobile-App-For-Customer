import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Colors from '../../constants/Colors';
import { ACol, ARow, AText, AppLoader } from '../../theme-components';
import { FontStyle } from '../../utils/config';
import AIcon from 'react-native-vector-icons/AntDesign';
import { capitalizeFirstLetter, isEmpty } from '../../utils/helper';
import URL from '../../utils/baseurl';
import NavigationConstants from '../../navigation/NavigationConstants';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import {
  CLEAR_SUBCATEGORY,
  getSubcategories,
} from '../../store/action/productAction';
import { GET_FILTEREDPRODUCTS_WITH_PAGINATION } from '../../queries/productQuery';
import { query } from '../../utils/service';

const SubcategoryOption = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const singleCat = route?.params?.singleCategory;
  const singleCatChildern = route?.params?.withChildern;
  const { subcategories, loading } = useSelector((state) => state.products);
  const [subcategoriesData, setSubcategoriesData] = useState([]);

  useEffect(() => {
    if (subcategories?.getCategoryPageData) {
      setSubcategoriesData(
        subcategories.getCategoryPageData.mostParentCategoryData.subCategories,
      );
    }
  }, [subcategories]);

  useEffect(() => {
    return () => {
      console.log(' clear run');
      dispatch({ type: CLEAR_SUBCATEGORY });
    };
  }, []);

  useEffect(() => {
    const subcat = {
      mainFilter: {
        categoryUrl: singleCat.url,
      },
      filters: [
        {
          field: 'brand',
          type: 'array',
          category: 'static',
          valueType: 'ObjectId',
          select: [],
        },
        {
          field: 'pricing.sellprice',
          type: 'range',
          category: 'static',
          select: {
            minValue: 500,
            maxValue: 50000,
          },
        },
        {
          field: 'rating',
          type: 'choice',
          category: 'static',
          valueType: 'Integer',
          select: {
            minValue: 0,
          },
        },
      ],
      pageNo: 1,
      limit: 3,
    };
    dispatch(getSubcategories(subcat));
  }, []);

  const handleGetSubcategory = async (url) => {
    console.log(url);
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
    console.log(res, ' new sub data');
    if (!res.data.getCategoryPageData.isMostParentCategory) {
      navigation.navigate(NavigationConstants.SUBCATEGORIES_SCREEN, {
        singleCategory: res.data.getCategoryPageData.categoryTree.subCategories,
        withChildern:
          res.data.getCategoryPageData.categoryTree.subCategories.subCategories,
      });
    }
  };

  //List of categories
  const menuListing = (Categories) => {
    return Categories.map((category) => {
      // if (category.parentId === null) {
      return (
        <ACol mt={'60px'} col={2} key={category.id}>
          <CategoriesListingWrapper
            activeOpacity={0.9}
            onPress={() => {
              handleGetSubcategory(category.url);
            }}>
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
      // }
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      {loading ? <AppLoader /> : null}
      <View style={styles.header}>
        <AIcon onPress={() => navigation.goBack()} name="arrowleft" size={22} />
        <AText fonts={FontStyle.semiBold} ml="20px">
          {capitalizeFirstLetter(singleCat?.url)}
        </AText>
      </View>
      <ScrollView style={{ backgroundColor: Colors.whiteColor, marginTop: 50 }}>
        <View style={{ marginTop: 15 }} />
        {!isEmpty(subcategoriesData) && subcategoriesData.length > 0 ? (
          <ARow row wrap>
            {menuListing(subcategoriesData)}
          </ARow>
        ) : null}
      </ScrollView>
    </View>
  );
};

SubcategoryOption.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  catcontainer: {
    marginHorizontal: 30,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    flex: 1,
    marginTop: 55,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
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
});

export default SubcategoryOption;
