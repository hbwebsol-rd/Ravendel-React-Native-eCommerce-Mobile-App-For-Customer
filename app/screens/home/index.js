import React, { useEffect } from 'react';
import {
  AText,
  AContainer,
  ARow,
  ACol,
  AppLoader,
  TextInput,
} from '../../theme-components';
import styled from 'styled-components/native';
import { useSelector, useDispatch } from 'react-redux';
import {
  downloadImageFromS3,
  getToken,
  getValue,
  isEmpty,
  unflatten,
  wait,
} from '../../utils/helper';
import { useIsFocused } from '@react-navigation/native';
import { useState } from 'react';
import {
  AppSettingAction,
  featureDataAction,
  productByPerticulareAction,
  productOnSaleAction,
  recentaddedproductAction,
  categoriesAction,
  addCartAction,
  updateCartAction,
  catProductAction,
} from '../../store/action';
import HomeCategoryShowViews from './Components.js/CategoryShow';
import HomeComponentShowViews from './Components.js/HomeComponentShowViews';
import SwiperFlatList from 'react-native-swiper-flatlist';
import {
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AllDataInOne, brandAction } from '../../store/action/settingAction';
import HomeBrandViews from './Components.js/BrandShow';
import {
  APP_PRIMARY_COLOR,
  APP_SECONDARY_COLOR,
  FontStyle,
} from '../../utils/config';
import Icon from 'react-native-vector-icons/Feather';
import Categories from './Components.js/CategoriesList';
import ImageSlider from './Components.js/CustomSlider';
import CardContainer from './Components.js/RandomCard';
import { ALREADY_HAS_LOGIN } from '../../store/action/loginAction';
import { USER_ALREADY_HAS_LOGIN } from '../../store/action/customerAction';
import Colors from '../../constants/Colors';
import Header from '../components/Header';
import Styles from '../../Theme';
import NavigationConstants from '../../navigation/NavigationConstants';
import URL from '../../utils/baseurl';

const HomeScreen = ({ navigation }) => {
  // States and Variables
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const allCategoriesWithChild = useSelector(
    (state) => state.products.categories.data,
  );
  const { cartId, cartChecked } = useSelector((state) => state.cart);
  const cartItems = useSelector((state) => state.cart.products);
  const userDetails = useSelector((state) => state.customer.userDetails);
  const catLoading = useSelector((state) => state.products.loading);
  const loginState = useSelector((state) => state.login);
  const [refreshing, setRefreshing] = useState(false);
  const {
    homeData,
    // featureData,
    // recentAddedProduct,
    // saleProduct,
    // ProductByCategory,
    // brands,
    appTitle,
    allData,
  } = useSelector((state) => state.settings);
  const {
    brands,
    featureData,
    recentAddedProduct,
    saleProduct,
    ProductByCategory,
  } = allData;
  // console.log(allData, 'all d');
  const primaryColor = '#000';
  const settingLoading = useSelector((state) => state.settings.loading);
  const [allCategories, setAllCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  //Custom Functions
  const checkUserLoggedIn = async () => {
    try {
      const token = await getToken();
      const userdata = await getValue('userDetails');

      if (token !== null) {
        var loginDetails = {
          user_token: token,
        };
        var userloginDetails = {
          userDetails: JSON.parse(userdata),
        };
        dispatch({ type: ALREADY_HAS_LOGIN, payload: loginDetails });
        dispatch({ type: USER_ALREADY_HAS_LOGIN, payload: userloginDetails });
      }
    } catch (e) {
      // Error
    }
  };

  const handleinpiut = (e) => {
    setSearchTerm(e);
  };

  // Create a cart if user added products in cart before login
  const UpdateCart = async () => {
    var cartProduct = await getValue('cartproducts');
    if (!isEmpty(cartProduct)) {
      var filteredProducts = [];
      cartProduct = JSON.parse(cartProduct);
      var mergedArr = [...cartProduct, ...cartItems];
      var filteredProducts = [];
      mergedArr.filter((val) => {
        let exist = mergedArr.find(
          (n) => n.productId === val.productId && n.qty > val.qty,
        );
        if (!filteredProducts.find((n) => n.productId === val.productId)) {
          if (isEmpty(exist)) {
            filteredProducts.push({
              productId: val.productId,
              productTitle: val.productTitle,
              qty: val.qty,
              productPrice: val.productPrice.toString(),
              attributes: val.attributes,
            });
          } else {
            filteredProducts.push({
              productId: val.productId,
              productTitle: val.productTitle,
              qty: exist.qty,
              productPrice: val.productPrice.toString(),
              attributes: val.attributes,
            });
          }
        }
      });
      if (!isEmpty(filteredProducts)) {
        const cartData = {
          userId: userDetails._id,
          products: filteredProducts,
        };
        dispatch(addCartAction(cartData));
      }
    }
  };

  const navigateNextScreen = (category) => {
    var nestedCategory = [];
    if (!isEmpty(category.children)) {
      nestedCategory = category.children;
    }
    navigation.navigate(NavigationConstants.SUBCATEGORIES_OPTION_SCREEN, {
      singleCategory: category,
      withChildern: nestedCategory,
    });
  };

  const handleSearchProduct = () => {
    navigation.navigate('Shop', { searchTerm: searchTerm });
  };

  //Get URL of banners
  const getCategoryImage = (name) => {
    const cat =
      URL +
      homeData
        .filter((item) => {
          if (item.label === name) {
            return true;
          }
        })
        .map((item) => {
          return item.section_img;
        })[0];
    return cat;
  };
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    dispatch(AppSettingAction());
    dispatch(categoriesAction());
    wait(2000).then(() => setRefreshing(false));
  }, []);
  // Use Effect Call

  useEffect(() => {
    dispatch(AppSettingAction());
    dispatch(categoriesAction());
  }, [isFocused]);

  useEffect(() => {
    // Filter data as per categories
    // dispatch(brandAction());
    if (!isEmpty(homeData)) {
      const featuredProduct = homeData.filter(
        (section) => section.label === 'Featured Product',
      )[0];
      const recentProduct = homeData.filter(
        (section) => section.label === 'Recently Added Products',
      )[0];
      const productOnsale = homeData.filter(
        (section) => section.label === 'Products On Sales',
      )[0];
      const productRec = homeData.filter(
        (section) => section.label === 'Product Recommendation',
      )[0];
      const productFromSpecific = homeData.filter(
        (section) => section.label === 'Product from Specific Categories',
      )[0];
      // if (featuredProduct.visible) {
      //   dispatch(featureDataAction());
      // }
      // if (recentProduct.visible) {
      //   dispatch(recentaddedproductAction());
      // }
      // if (productOnsale.visible) {
      //   dispatch(productOnSaleAction());
      // }
      // if (productFromSpecific.visible) {
      //   let catID = '62fe094eb2831ffd1e6fdfe8';
      //   dispatch(productByPerticulareAction(catID));
      // }
      let catID = '62fe094eb2831ffd1e6fdfe8';
      dispatch(
        AllDataInOne(
          featuredProduct.visible,
          recentProduct.visible,
          productOnsale.visible,
          true,
          catID,
        ),
      );
    }
  }, [homeData]);

  useEffect(() => {
    if (allCategoriesWithChild) {
      const data = unflatten(allCategoriesWithChild);
      setAllCategories(data);
    }
  }, [allCategoriesWithChild]);

  useEffect(() => {
    if (!loginState.login) {
      checkUserLoggedIn();
    }
  }, [loginState]);

  useEffect(() => {
    if (cartChecked) {
      if (!isEmpty(userDetails)) {
        UpdateCart();
      }
    }
  }, [cartId, cartChecked]);

  return (
    <View style={Styles.mainContainer}>
      {settingLoading && catLoading ? <AppLoader /> : null}
      <StatusBar backgroundColor={APP_PRIMARY_COLOR} />
      <Header showProfileIcon navigation={navigation} title={''} />
      <View style={styles.searchstyle}>
        <ARow mt={'10px'} row alignItems="center" position="relative">
          <Icon
            style={styles.iconstyle}
            name={'search'}
            size={15}
            color={'black'}
          />
          <TextInput
            height={30}
            bc={'#E0E0E0'}
            onSubmit={() => handleSearchProduct()}
            value={searchTerm}
            onchange={handleinpiut}
            padding={0}
            pl={35}
            inputBgColor={Colors.whiteColor}
            fs={12}
            placeholder={'Search'}
            placeholdercolor={'black'}
            br={30}
          />
        </ARow>
      </View>
      <View style={{ padding: 10, backgroundColor: Colors.whiteColor }}></View>
      <AContainer
        onRefresh={onRefresh}
        refreshing={refreshing}
        withoutPadding
        nestedScrollEnabled={true}>
        <Categories
          navigation
          navigateNextScreen={(item) => {
            navigateNextScreen(item);
          }}
          allCategories={allCategories}
        />

        {!isEmpty(recentAddedProduct) && (
          <>
            <ARow mb="20px" wrap row>
              <ACol col={1}>
                <PopularPicksWrapper>
                  <PopularPicksImage
                    source={{
                      uri: getCategoryImage('Recently Added Products'),
                    }}
                  />
                </PopularPicksWrapper>
              </ACol>
            </ARow>
            <ImageSlider
              title={'New Arrival'}
              dataItems={recentAddedProduct}
              navigatetonext={(item) => {
                navigation.navigate(NavigationConstants.SINGLE_PRODUCT_SCREEN, {
                  productID: item._id,
                  productUrl: item.url,
                });
              }}
            />
          </>
        )}
        <ARow wrap row></ARow>

        {!isEmpty(brands) && (
          <SectionView>
            <AText
              ml="30px"
              mb={'10px'}
              mt={'15px'}
              large
              fonts={FontStyle.fontBold}>
              Featured Brands
            </AText>
            <HomeBrandViews
              allbrands={brands}
              navigation
              navigateNextScreen={(item) => {
                navigateNextScreen(item);
              }}
            />
          </SectionView>
        )}
        {!isEmpty(featureData) && (
          <>
            <ARow mb="20px" wrap row>
              <ACol col={1}>
                <PopularPicksWrapper>
                  <PopularPicksImage
                    source={{
                      uri: getCategoryImage('Featured Product'),
                    }}
                  />
                </PopularPicksWrapper>
              </ACol>
            </ARow>
            <SectionView>
              <ImageSlider
                title={'Featured Collection'}
                dataItems={featureData}
                navigatetonext={(item) => {
                  navigation.navigate(
                    NavigationConstants.SINGLE_PRODUCT_SCREEN,
                    {
                      productID: item._id,
                      productUrl: item.url,
                    },
                  );
                }}
              />
            </SectionView>
          </>
        )}

        {!isEmpty(recentAddedProduct) && (
          <>
            <ARow mb="20px" wrap row>
              <ACol col={1}>
                <PopularPicksWrapper>
                  <PopularPicksImage
                    source={{
                      uri: getCategoryImage('Products On Sales'),
                    }}
                  />
                </PopularPicksWrapper>
              </ACol>
            </ARow>
            <SectionView>
              <ImageSlider
                title={'Latest Collection'}
                dataItems={recentAddedProduct}
                navigatetonext={(item) => {
                  navigation.navigate(
                    NavigationConstants.SINGLE_PRODUCT_SCREEN,
                    {
                      productID: item._id,
                      productUrl: item.url,
                    },
                  );
                }}
              />
            </SectionView>
          </>
        )}

        {!isEmpty(saleProduct) && (
          <>
            <ARow mb="20px" wrap row>
              <ACol col={1}>
                <PopularPicksWrapper>
                  <PopularPicksImage
                    source={{
                      uri: getCategoryImage('Product from Specific Categories'),
                    }}
                  />
                </PopularPicksWrapper>
              </ACol>
            </ARow>
            <SectionView>
              <CardContainer
                dataItems={saleProduct}
                navigatetonext={(item) => {
                  navigation.navigate(
                    NavigationConstants.SINGLE_PRODUCT_SCREEN,
                    {
                      productID: item._id,
                      productUrl: item.url,
                    },
                  );
                }}
              />

              {/* <HomeComponentShowViews
                dataItems={saleProduct}
                navigatetonext={(item) => {
                   navigation.navigate(NavigationConstants.SINGLE_PRODUCT_SCREEN, {
                    productID: item._id,
                    productUrl: item.url,
                  });
                }}
              /> */}
            </SectionView>
          </>
        )}

        {!isEmpty(ProductByCategory) && (
          <>
            <SectionView>
              {/* <AText uppercase heavy mb={'10px'} center color={primaryColor}></AText> */}
              <HomeComponentShowViews
                dataItems={ProductByCategory}
                navigatetonext={(item) => {
                  navigation.navigate(
                    NavigationConstants.SINGLE_PRODUCT_SCREEN,
                    {
                      productID: item._id,
                      productUrl: item.url,
                    },
                  );
                }}
              />
            </SectionView>
          </>
        )}
      </AContainer>
    </View>
  );
};

const SectionView = styled.View`
  padding: 10px 0;
  border-bottom-width: 2px;
  border-color: #ddd;
`;
const PopularPicksWrapper = styled.TouchableOpacity`
  height: 168px;
  width: 100%;
  margin-top: 30px;
`;

const PopularPicksImage = styled.Image`
  width: 100%;
  height: 100%;
  resize-mode: cover;
`;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  searchstyle: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    backgroundColor: Colors.whiteColor,
    height: 60,
    marginTop: 30,
    paddingHorizontal: 30,
    paddingTop: 20,
    alignItems: 'flex-start',
  },

  iconstyle: {
    marginRight: 5,
    position: 'absolute',
    left: 10,
    zIndex: 2,
  },
});
export default HomeScreen;
