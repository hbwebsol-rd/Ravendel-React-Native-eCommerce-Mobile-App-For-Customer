import React, { useEffect, useRef } from 'react';
import {
  AText,
  AContainer,
  ARow,
  ACol,
  AppLoader,
  TextInput,
  MainLayout,
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
import {
  AllDataInOne,
  homeScreenFields,
  brandAction,
} from '../../store/action/settingAction';
import HomeBrandViews from './Components.js/BrandShow';
import {
  APP_PRIMARY_COLOR,
  APP_SECONDARY_COLOR,
  FontStyle,
  changeWindowHeightWidth,
  windowWidth,
} from '../../utils/config';
import Icon from 'react-native-vector-icons/Feather';
import Categories from './Components.js/CategoriesList';
import ImageSliderNew from './Components.js/CustomSliderNew';
import CardContainer from './Components.js/RandomCard';
import { ALREADY_HAS_LOGIN } from '../../store/action/loginAction';
import { USER_ALREADY_HAS_LOGIN } from '../../store/action/customerAction';
import Colors from '../../constants/Colors';
import Header from '../components/Header';
import Styles from '../../Theme';
import NavigationConstants from '../../navigation/NavigationConstants';
import URL from '../../utils/baseurl';
import Carousel from 'react-native-snap-carousel';
import NoConnection from '../../theme-components/nointernet';
import NetInfo from '@react-native-community/netinfo';
import { NET_OFF, NET_ON } from '../../store/reducers/alert';

const HomeScreen = ({ navigation }) => {
  // States and Variables
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const allCategoriesWithChild = useSelector(
    (state) => state.products.categories,
  );
  const { cartId, cartChecked } = useSelector((state) => state.cart);
  const cartItems = useSelector((state) => state.cart.products);
  const userDetails = useSelector((state) => state.customer.userDetails);
  const loginState = useSelector((state) => state.login);
  const [refreshing, setRefreshing] = useState(false);
  const { homeData, allSections, homeslider } = useSelector(
    (state) => state.settings,
  );

  const settingLoading = useSelector((state) => state.settings.loading);
  const { netConnection } = useSelector((state) => state.alert);
  const [allCategories, setAllCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [size, setSize] = useState(0);
  const carouselRef = useRef(null);

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
    navigation.navigate(NavigationConstants.SEARCH_PRODUCT_SCREEN, {
      searchTerm: searchTerm,
    });
  };

  //Get URL of banners
  const getCategoryImage = (name) => {
    const category = homeData.find((item) => item.label === name);
    const cat = category ? `${URL}${category.section_img}` : null;
    return cat;
  };
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    dispatch(AppSettingAction());
    wait(2000).then(() => setRefreshing(false));
  }, []);

  // useEffect(() => {
  //   const updateWindowHeight = () => {
  //     const newWindowHeight = Dimensions.get('window').height;
  //     const newWindowWidth = Dimensions.get('window').width;
  //     changeWindowHeightWidth(newWindowHeight, newWindowWidth);
  //     setSize(newWindowWidth);
  //   };

  //   Dimensions.addEventListener('change', updateWindowHeight);

  // }, []);

  useEffect(() => {
    if (isFocused) {
      dispatch(AppSettingAction());
      setSearchTerm('');
    }
  }, [isFocused, loginState]);
  useEffect(() => {
    // Filter data as per categories
    if (!isEmpty(homeData)) {
      dispatch(homeScreenFields());
    }
  }, [homeData]);

  useEffect(() => {
    if (allCategoriesWithChild) {
      setAllCategories(allCategoriesWithChild);
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
  const renderItem = ({ item, index }) => {
    return (
      <View>
        <Image
          style={{
            width: itemWidth,
            height: 150,
            resizeMode: 'stretch',
            borderRadius: 10,
          }}
          source={{
            uri: !isEmpty(item.image)
              ? URL + item.image
              : 'https://www.hbwebsol.com/wp-content/uploads/2020/07/category_dummy.png',
          }}
        />
      </View>
    );
  };

  return (
    <MainLayout hideScroll style={Styles.mainContainer}>
      {settingLoading ? <AppLoader /> : null}
      <StatusBar backgroundColor={APP_PRIMARY_COLOR} />
      <Header
        titleColor={APP_PRIMARY_COLOR}
        showProfileIcon
        navigation={navigation}
        title={'Ravendal'}
      />
      <View style={styles.searchstyle}>
        <Icon
          style={styles.iconstyle}
          name={'search'}
          size={15}
          color={'black'}
        />
        <TextInput
          height={50}
          onSubmit={() => handleSearchProduct()}
          value={searchTerm}
          onchange={handleinpiut}
          padding={0}
          pl={35}
          inputBgColor={'#EFF0F0'}
          bc={'#EFF0F0'}
          fs={12}
          placeholder={'Search'}
          placeholdercolor={'black'}
        />
      </View>
      <View style={{ padding: 10, backgroundColor: Colors.whiteColor }}></View>
      <AContainer
        onRefresh={onRefresh}
        refreshing={refreshing}
        withoutPadding
        nestedScrollEnabled={true}>
        {homeslider && (
          <Carousel
            ref={carouselRef}
            autoplayDelay={3000}
            // loop={true}
            data={homeslider}
            renderItem={renderItem}
            sliderWidth={windowWidth}
            itemWidth={itemWidth}
            activeSlideAlignment={'start'}
            inactiveSlideOpacity={1}
            inactiveSlideScale={1}
            slideStyle={{ marginHorizontal: 5, borderRadius: 10 }}
          />
        )}
        <Categories
          navigation
          navigateNextScreen={(item) => {
            navigateNextScreen(item);
          }}
          allCategories={allCategories}
        />
        {allSections && allSections.length > 0 ? (
          <>
            {allSections.map((item) =>
              item.display_type === 'SLIDER' ? (
                <>
                  <ARow mb="20px" wrap row>
                    <ACol col={1}>
                      <PopularPicksWrapper>
                        <PopularPicksImage
                          source={{
                            uri: getCategoryImage(item.name),
                          }}
                        />
                      </PopularPicksWrapper>
                    </ACol>
                  </ARow>
                  <SectionView>
                    <ImageSliderNew
                      title={item.name}
                      dataItems={item.products}
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
              ) : (
                <>
                  <ARow mb="20px" wrap row>
                    <ACol col={1}>
                      <PopularPicksWrapper>
                        <PopularPicksImage
                          source={{
                            uri: getCategoryImage(item.name),
                          }}
                        />
                      </PopularPicksWrapper>
                    </ACol>
                  </ARow>
                  <SectionView>
                    <CardContainer
                      title={item.name}
                      dataItems={item.products ? item.products : []}
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
              ),
            )}
          </>
        ) : null}
      </AContainer>
    </MainLayout>
  );
};

const SectionView = styled.View`
  padding: 10px 0;
  border-bottom-width: 2px;
  border-color: #ddd;
`;
const PopularPicksWrapper = styled.TouchableOpacity`
  height: 170px;
  width: 100%;
  margin-top: 30px;
`;

const PopularPicksImage = styled.Image`
  width: 100%;
  height: 100%;
  resize-mode: stretch;
`;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  searchstyle: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    backgroundColor: '#EFF0F0',
    height: 50,
    borderRadius: 30,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginTop: 10,
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
const itemWidth = windowWidth * 0.65;
export default HomeScreen;
