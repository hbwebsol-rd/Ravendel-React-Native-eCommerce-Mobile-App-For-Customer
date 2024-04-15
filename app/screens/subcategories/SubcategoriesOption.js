import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import Colors from '../../constants/Colors';
import { ACol, ARow, AText } from '../../theme-components';
import { FontStyle } from '../../utils/config';
import AIcon from 'react-native-vector-icons/AntDesign';
import { capitalizeFirstLetter, isEmpty } from '../../utils/helper';
import FastImage from 'react-native-fast-image';
import URL from '../../utils/baseurl';
import NavigationConstants from '../../navigation/NavigationConstants';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const SubcategoryOption = ({ navigation, route }) => {
  const singleCat = route?.params?.singleCategory;
  const singleCatChildern = route?.params?.withChildern;

  //List of categories
  const menuListing = (Categories) => {
    return Categories.map((category) => {
      // if (category.parentId === null) {
      return (
        <ACol mt={'60px'} col={2} key={category.id}>
          {console.log(JSON.stringify(category.children, ' chillldr'))}
          <CategoriesListingWrapper
            activeOpacity={0.9}
            onPress={() => {
              navigation.navigate(NavigationConstants.SUBCATEGORIES_SCREEN, {
                singleCategory: category,
                withChildern: category.children,
              });
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
    <>
      <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
        <View style={styles.header}>
          <AIcon
            onPress={() => navigation.goBack()}
            name="arrowleft"
            size={22}
          />
          <AText fonts={FontStyle.semiBold} ml="20px">
            {capitalizeFirstLetter(singleCat?.url)}
          </AText>
        </View>
        <View style={{ marginTop: 60 }} />
        {!isEmpty(singleCat.children) && singleCat.children.length > 0 ? (
          <ARow row wrap>
            {menuListing(singleCat.children)}
          </ARow>
        ) : null}
      </View>
    </>
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
