import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Image } from 'react-native';
import Colors from '../../constants/Colors';
import {
  ACol,
  ARow,
  AText,
  AppLoader,
  MainLayout,
} from '../../theme-components';
import { BASEURL, FontStyle } from '../../utils/config';
import AIcon from 'react-native-vector-icons/AntDesign';
import { capitalizeFirstLetter, isEmpty, uriImage } from '../../utils/helper';
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
import NoConnection from '../../theme-components/nointernet';

const SubcategoryOption = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const singleCat = route?.params?.singleCategory;
  const singleCatChildern = route?.params?.withChildern;
  const { subcategories, loading } = useSelector((state) => state.products);
  const { netConnection } = useSelector((state) => state.alert);
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

  //List of categories
  const menuListing = (Categories) => {
    return Categories.map((category) => {
      // if (category.parentId === null) {
      return (
        <ACol style={{ marginTop: 15 }} col={2} key={category.id}>
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
                      uri: uriImage(category.thumbnail_image)
                    }}
                  />
                </CategoryImageWrapper>
              </ACol>
              <ACol col={1}>
                <AText style={styles.catNameStyle} small >
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

  if (netConnection) {
    return <NoConnection />;
  }

  return (
    <MainLayout
      hideScroll
      style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      {loading ? <AppLoader /> : null}
      <View style={styles.header}>
        <AIcon onPress={() => navigation.goBack()} name="arrowleft" size={22} />
        <AText style={styles.categorytextStyle} large >
          {capitalizeFirstLetter(singleCat?.url)}
        </AText>
      </View>
      <ScrollView contentContainerStyle={{ flexGrow: 1,marginTop:40 }}>
        <View style={{ marginTop: 5 }} />
        {!isEmpty(subcategoriesData) && subcategoriesData.length > 0 ? (
          <ARow row wrap>
            {menuListing(subcategoriesData)}
          </ARow>
        ) : (
          <View style={{flex:1,alignSelf:'center',justifyContent:'center'}}>
            <Image source={require('../../assets/images/noresult.png')} style={{height:100,width:100,alignSelf:'center'}} />
            <AText
              style={{
                fontSize: 16,
                alignSelf: 'center',
                color: '#000',
                marginTop: 20,
              }}>
              No Records Found
            </AText>
          </View>
        )}
      </ScrollView>
    </MainLayout>
  );
};

SubcategoryOption.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

const CategoriesListingWrapper = styled.TouchableOpacity`
  margin: 0px 0 20px 0;
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
  categorytextStyle: {
    fontFamily: FontStyle.semiBold,
    marginLeft: 20
  },
  catNameStyle: {
    textTransform: "uppercase",
    color: "#000",
    textAlign: 'center'
  },
  catcontainer: {
    marginHorizontal: 30,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    flex: 1,
    marginTop: 15,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    // position: 'absolute',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    left: 0,
    right: 0,
    marginTop: Platform.OS == 'ios' ? 0 : 10,
    paddingHorizontal: 30,
    zIndex: 10,
  },
});

export default SubcategoryOption;
