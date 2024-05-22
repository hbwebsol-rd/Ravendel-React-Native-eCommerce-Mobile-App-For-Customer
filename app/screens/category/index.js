/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef, useState } from 'react';
import { AText, ARow, ACol, AppLoader, AHeader } from '../../theme-components';
import { useSelector, useDispatch } from 'react-redux';
import { catProductAction } from '../../store/action';
import { CAT_PRODUCTS_CLEAR } from '../../store/action/productAction';
import { ProductCard } from '../components';
import styled from 'styled-components/native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { isEmpty } from '../../utils/helper';
import { useIsFocused } from '@react-navigation/native';
import { Text } from 'react-native';
import PropTypes from 'prop-types';

const CategoryScreen = ({ route, navigation }) => {
  const singleCatId = route.params.singleCategory.url;
  const CategoryTitle = route.params.singleCategory.name;
  const dispatch = useDispatch();
  const singleCateogry = useSelector(
    (state) => state.products.singleCategoryDetails,
  );
  const loading = useSelector((state) => state.products.loading);
  const refRBSheet = useRef();
  const [sortBy, setSortBy] = useState('low-high');
  const isFocused = useIsFocused();
  useEffect(() => {
    navigation.setOptions({
      title: singleCateogry.name,
      headerTransparent: false,
      headerTintColor: '#000',
    });
  }, [singleCateogry]);

  useEffect(() => {
    if (isFocused) {
      dispatch(catProductAction(singleCatId));
    } else {
      dispatch({
        type: CAT_PRODUCTS_CLEAR,
      });
    }
  }, [isFocused, singleCatId]);

  const changeSortBy = (sortName) => {
    setSortBy(sortName);
    refRBSheet.current.close();
  };
  return (
    <>
      {loading ? <AppLoader /> : null}
      {/* <AHeader
        title={CategoryTitle ?? 'Category'}
        navigation={navigation}
        back
      /> */}
      <Wrapper>
        <ARow row wrap>
          {!isEmpty(singleCateogry) && (
            <>
              {singleCateogry.data.products &&
              singleCateogry.data.products.length ? (
                singleCateogry.data.products.map((product) => {
                  return (
                    <ACol col={2} key={product.id}>
                      <ProductCard
                        productDetail={product}
                        navigationChild={navigation}
                      />
                    </ACol>
                  );
                })
              ) : (
                <NotFoundWrapper>
                  <NotFoundImage
                    source={require('../../assets/images/no-product-fonds.webp')}
                  />
                </NotFoundWrapper>
              )}
            </>
          )}
        </ARow>
      </Wrapper>
      <FittlerRow>
        <FittlerAction onPress={() => refRBSheet.current.open()}>
          <AText>Sort By</AText>
        </FittlerAction>
        <FittlerAction>
          <AText>Fillter</AText>
        </FittlerAction>
      </FittlerRow>

      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        height={275}
        openDuration={250}
        closeDuration={250}
        animationType="slide"
        customStyles={{
          container: {
            paddingTop: 10,
            paddingBottom: 10,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
        }}>
        <AText large heavy center color="#000" mb="20px">
          Sort by
        </AText>
        <SortByOption
          onPress={() => changeSortBy('popular')}
          style={{
            backgroundColor: sortBy === 'popular' ? '#EB3349' : 'transparent',
          }}>
          <AText medium color={sortBy === 'popular' ? '#fff' : '#000'}>
            Popular
          </AText>
        </SortByOption>
        <SortByOption
          onPress={() => changeSortBy('newest')}
          style={{
            backgroundColor: sortBy === 'newest' ? '#EB3349' : 'transparent',
          }}>
          <AText medium color={sortBy === 'newest' ? '#fff' : '#000'}>
            Newest
          </AText>
        </SortByOption>
        <SortByOption
          onPress={() => changeSortBy('low-high')}
          style={{
            backgroundColor: sortBy === 'low-high' ? '#EB3349' : 'transparent',
          }}>
          <AText medium color={sortBy === 'low-high' ? '#fff' : '#000'}>
            Price: lowest to high
          </AText>
        </SortByOption>
        <SortByOption
          onPress={() => changeSortBy('high-low')}
          style={{
            backgroundColor: sortBy === 'high-low' ? '#EB3349' : 'transparent',
          }}>
          <AText medium color={sortBy === 'high-low' ? '#fff' : '#000'}>
            Price: highest to low
          </AText>
        </SortByOption>
      </RBSheet>
    </>
  );
};

CategoryScreen.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

const SortByOption = styled.TouchableOpacity`
  padding: 12px 15px;
`;
const FittlerRow = styled.View`
  position: absolute;
  bottom: 0px;
  left: 0;
  right: 0;
  height: 40px;
  border-top-width: 1px;
  border-top-color: rgba(200, 200, 200, 0.5);
  flex-direction: row;
  justify-content: space-between;
  background: #f7f7f7;
  padding: 10px 20px;
  align-items: center;
`;
const FittlerAction = styled.TouchableOpacity`
  padding: 0px;
`;
const Wrapper = styled.ScrollView`
  flex: 1;
  padding: 10px 5px;
  background: #fff;
`;
const NotFoundWrapper = styled.View`
  height: 200px;
  width: 100%;
`;

const NotFoundImage = styled.Image`
  flex: 1;
  resize-mode: contain;
  width: null;
  height: null;
`;

export default CategoryScreen;
