import React from 'react';
import { AText, ARow, ACol } from '../../../theme-components';
import styled from 'styled-components/native';
import URL from '../../../utils/baseurl';
import { isEmpty } from '../../../utils/helper';
import PropTypes from 'prop-types';

const HomeBrandViews = ({ allbrands, navigateNextScreen, navigation }) => {
  const CategoryShowView = React.memo(() => {
    return (
      <ARow wrap row padding={0}>
        {allbrands &&
          allbrands.map((brands, index) => {
            return (
              <ACol col={3} key={brands.id}>
                <CategoriesListingWrapper
                  onPress={() => (true ? null : navigateNextScreen(brands))}>
                  <CategoriesImageWrapper>
                    <CategoriesImage
                      source={{
                        uri: !isEmpty(brands.brand_logo)
                          ? URL + brands.brand_logo
                          : 'https://www.hbwebsol.com/wp-content/uploads/2020/07/category_dummy.png',
                      }}
                    />
                  </CategoriesImageWrapper>
                  <AText small uppercase color="#000" center>
                    {brands.name}
                  </AText>
                </CategoriesListingWrapper>
              </ACol>
            );
          })}
      </ARow>
    );
  }, []);
  return (
    <>
      <CategoryShowView />
    </>
  );
};

HomeBrandViews.propTypes = {
  allbrands: PropTypes.array,
  navigateNextScreen: PropTypes.func,
};

const CategoriesListingWrapper = styled.TouchableOpacity`
  margin: 5px 0 0px 0;
`;

const CategoriesImageWrapper = styled.View`
  width: 100px;
  height: 100px;
  border-radius: 100px;
  overflow: hidden;
  margin: 2px auto;
`;

const CategoriesImage = styled.Image`
  width: 100%;
  height: 100%;
  resize-mode: contain;
  flex: 1;
`;

export default HomeBrandViews;
