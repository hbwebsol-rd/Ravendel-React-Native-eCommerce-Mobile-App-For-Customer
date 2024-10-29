import React, { useEffect, useRef, useState } from 'react';
import { Alert, BackHandler, Image, Modal, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';

import FIcon from 'react-native-vector-icons/SimpleLineIcons';
import styled from 'styled-components/native';

import {
  AContainer,
  ARow,
  ACol,
  AppLoader,
  TextInput,
  MainLayout,
} from '../../theme-components';
import { getToken, getValue, isEmpty, uriImage, wait } from '../../utils/helper';
import { AppSettingAction, addCartAction } from '../../store/action';
import { homeScreenFields } from '../../store/action/settingAction';
import { APP_NAME, APP_PRIMARY_COLOR, BASEURL, windowWidth } from '../../utils/config';
import Categories from './Components.js/CategoriesList';
import ProductsSlider from '../../theme-components/ProductsSlider';
import { ALREADY_HAS_LOGIN } from '../../store/action/loginAction';
import { USER_ALREADY_HAS_LOGIN } from '../../store/action/customerAction';
import Colors from '../../constants/Colors';
import Header from '../components/Header';
import Styles from '../../Theme';
import NavigationConstants from '../../navigation/NavigationConstants';
import Carousel from 'react-native-snap-carousel';
import GridCardContainer from '../../theme-components/GridCardContainer';
import NoConnection from '../../theme-components/nointernet';
import Voice from '@react-native-voice/voice';

const HomeScreen = ({ navigation }) => {
  // States and Variables
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const allCategoriesWithChild = useSelector(
    state => state.products.categories,
  );
  const { cartId, cartChecked } = useSelector(state => state.cart);
  const cartItems = useSelector(state => state.cart.products);
  const userDetails = useSelector(state => state.customer.userDetails);
  const loginState = useSelector(state => state.login);
  const [refreshing, setRefreshing] = useState(false);
  const { homeData, allSections, homeslider, serverError } = useSelector(
    state => state.settings,
  );
  const { netConnection } = useSelector((state) => state.alert);

  const settingLoading = useSelector(state => state.settings.loading);
  const settingTheme = useSelector(state => state.settings.themeSettings);
  const [allCategories, setAllCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const carouselRef = useRef(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [resultText, setResultText] = useState('');

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechResults = onSpeechResults;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechStart = () => {
    setIsListening(true);
  };

  const onSpeechEnd = () => {
    setIsListening(false);
  };

  const onSpeechResults = (e) => {
    const text = e.value[0];
    console.log(text,' texxx')
    setResultText(text);
    navigation.navigate(NavigationConstants.SEARCH_PRODUCT_SCREEN, {
      searchTerm: text,
    });
    setIsModalVisible(false);
    // handleSearch(text);
  };

  const startRecording = async () => {
    setResultText('');
    setIsModalVisible(true);
    try {
      await Voice.start('en-US');
    } catch (error) {
      console.error('Error in starting voice recognition:', error);
    }
  };

  const stopRecording = async () => {
    setIsModalVisible(false);
    try {
      await Voice.stop();
    } catch (error) {
      console.error('Error in stopping voice recognition:', error);
    }
  };

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

  const handleinpiut = e => {
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
      mergedArr.filter(val => {
        let exist = mergedArr.find(
          n => n.productId === val.productId && n.qty > val.qty,
        );
        if (!filteredProducts.find(n => n.productId === val.productId)) {
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

  const navigateNextScreen = category => {
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

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    dispatch(AppSettingAction());
    dispatch(homeScreenFields());
    wait(2000).then(() => setRefreshing(false));
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // Show a confirmation dialog before exiting the app (optional)
        BackHandler.exitApp()
      };

      // Add event listener for hardware back button press
      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      // Cleanup event listener when the screen is unfocused
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );

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
            resizeMode: 'cover',
            // borderRadius: 10,
            // aspectRatio:1
          }}
          source={{
            uri: uriImage(item.image)
          }}
        />
      </View>
    );
  };

   if (netConnection) {
    return <NoConnection />;
  }
  
  if (serverError) {
    return <NoConnection serverDown={serverError} />;
  }

  return (
    <MainLayout hideScroll style={Styles.mainContainer}>
      {settingLoading ? <AppLoader /> : null}
      <StatusBar backgroundColor={APP_PRIMARY_COLOR} />
      <Header
        titleColor={APP_PRIMARY_COLOR}
        showProfileIcon
        navigation={navigation}
        title={APP_NAME}
      />
      <View style={styles.searchstyle}>
        <TextInput
          StylesTextInput={styles.textInputViewStyle}
          onSubmit={() => !isEmpty(searchTerm) && handleSearchProduct()}
          icon={'search'}
          inputViewStyle={{ flexDirection: 'row-reverse' }}
          value={searchTerm}
          onchange={handleinpiut}
          fs={12}
          placeholder={'Search'}
          placeholdercolor={'black'}
          color={Colors.blackColor}
        />
        <View style={{position:'absolute',right:15}}>
          <FIcon onPress={startRecording}  name={'microphone'} size={20} color={'#000'} />
        </View>
      </View>
      <AContainer
        onRefresh={onRefresh}
        refreshing={refreshing}
        withoutPadding
        nestedScrollEnabled={true}>
        {homeslider && (
          <Carousel
            ref={carouselRef}
            autoplayDelay={3000}
            data={homeslider}
            renderItem={renderItem}
            sliderWidth={windowWidth}
            itemWidth={itemWidth}
            activeSlideAlignment={'start'}
            inactiveSlideOpacity={1}
            inactiveSlideScale={1}
            slideStyle={styles.slideStyle}
          />
        )}
        <Categories
          navigation
          navigateNextScreen={item => {
            navigateNextScreen(item);
          }}
          allCategories={allCategories}
          />
        {allSections && allSections.length > 0 &&
          allSections.map(item =>
            item.display_type === 'SLIDER' ? (
              <>
              {
                item.section_img?
               <Image
                  source={{
                    uri: `${BASEURL}${item.section_img}`
                  }}
                  style={styles.PopularPicksImage}
                />:null}
              <SectionView>
                <ProductsSlider
                  title={item.name}
                  dataItems={item.products}
                  navigatetonext={item => {
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
               {
                item.section_img?
               <Image
                  source={{
                    uri: `${BASEURL}${item.section_img}`
                  }}
                  style={styles.PopularPicksImage}
                />:null}
              <SectionView>
                {/* <PopularPicksImage
                  source={{
                    uri: `${BASEURL}${item.section_img}`
                  }}
                /> */}
                <GridCardContainer
                  title={item.name}
                  dataItems={item.products ? item.products : []}
                  navigatetonext={item => {
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
      </AContainer>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>
            {isListening ? 'Listening...' : 'Tap to start speaking'}
          </Text>
          <TouchableOpacity onPress={stopRecording} style={styles.stopButton}>
            <Text style={styles.stopButtonText}>Stop</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </MainLayout>
  );
};

const SectionView = styled.View`
  padding: 10px 0;
  border-color: #ddd;
`;
const PopularPicksImage = styled.Image`
  height: 170px;
  width: 97%;
  alignSelf:center;
  margin-top: 20px;
  margin-bottom: 20px;
  resize-mode: stretch;
`;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalText: {
    color: '#fff',
    fontSize: 20,
    marginBottom: 20,
  },
  stopButton: {
    backgroundColor: '#ff4757',
    padding: 10,
    borderRadius: 8,
  },
  stopButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  searchInput: {
    marginTop: 20,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    width: '80%',
    borderRadius: 8,
  },
  PopularPicksImage:{
      aspectRatio:2,
      height: 'auto',
      width: '100%',
      alignSelf:'center',
      marginTop: 20,
      marginBottom: 20,
      resizeMode: 'contain',
  },
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
    marginBottom: 20
  },
  textInputViewStyle: {
    height: 45,
    padding: 0,
    paddingLeft: 35,
    backgroundColor: '#EFF0F0',
    borderColor: '#EFF0F0',
  },
  rowStyle: {
    marginBottom: 20,
    flexWrap: 'wrap',
    flexDirection: 'row'
  },
  iconstyle: {
    marginRight: 5,
    position: 'absolute',
    left: 10,
    zIndex: 2,
  },
  slideStyle: {
    // marginHorizontal: 5,
    // borderRadius: 10,
  }
});
const itemWidth = windowWidth * 1;
export default HomeScreen;
