import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  productAction,
  productReviewsAction,
  addToCartAction,
  checkStorageAction,
} from '../../store/action';
import {
  PRODUCT_CLEAR,
  catRecentProductAction,
} from '../../store/action/productAction';
import { useSelector, useDispatch } from 'react-redux';
import {
  AText,
  AppLoader,
  MainLayout,
} from '../../theme-components';
import styled from 'styled-components/native';
import AIcon from 'react-native-vector-icons/AntDesign';
import GalleryImagesSlider from './galleryImages';
import HTMLView from 'react-native-htmlview';
import {
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  Modal,
  Image,
  Text,
  Vibration,
} from 'react-native';
import StarRating from 'react-native-star-rating';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isEmpty } from '../../utils/helper';
import { useIsFocused, useScrollToTop } from '@react-navigation/native';
import { ProductPriceText } from '../components';
import { View } from 'react-native-animatable';

import {
  APP_PRIMARY_COLOR,
  FontStyle,
} from '../../utils/config';
import ProductsSlider from '../../theme-components/ProductsSlider';

import PropTypes from 'prop-types';
import { checkPincodeValid } from '../../store/action/checkoutAction';
import AttributeListing from './Components/attributeUI';
import RatingReviewBlock from './Components/ratingReviewBlock';
import SpecificationBlock from './Components/specificationBlock';
import RenderHTML from 'react-native-render-html';

const SingleProductScreen = ({ navigation, route }) => {
  // States and Variables
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const SingleProduct = useSelector((state) => state.products.product);
  const { userDetails, isLoggin } = useSelector((state) => state.customer);
  const ReviewProduct = useSelector((state) => state.products.productReviews);
  const RelatedProducts = useSelector(
    (state) => state.products.relatedProducts,
  );
  const { manage_stock } = useSelector((state) => state.settings);
  const Loading = useSelector((state) => state.products.loading);

  const ProductId = route.params.productID;
  const ProductUrl = route.params.productUrl;
  const [ProductIds, setProductIds] = useState(ProductId);
  const [ProductUrls, setProductUrls] = useState(ProductUrl);
  const cartItems = useSelector((state) => state.cart.products);
  const [itemInCart, setItemInCart] = useState(false);
  const [singleProductLoading, setSingleProductLoading] = useState(true);
  const [cartQuantity, setCartQuantity] = useState(1);
  const [pinCode, setPinCode] = useState('');
  const [deliverable, setDeliverable] = useState('');
  const scrollViewRef = useRef(null);
  const [showCelebrateModal, setShowCelebrateModal] = useState(false);
  useEffect(() => {
    scrollViewRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  }, [ProductUrls]);

  useScrollToTop(scrollViewRef);

  const _storeData = async (product) => {
    if (isLoggin) {
      let variables = {
        total:
          parseFloat(SingleProduct.pricing.sellprice.toFixed(2)) * cartQuantity,
        userId: userDetails._id,
        productId: SingleProduct?._id,
        qty: cartQuantity,
        productTitle: SingleProduct?.url,
        productImage: SingleProduct?.feature_image,
        productPrice: parseFloat(
          SingleProduct.pricing.sellprice.toFixed(2),
        ).toString(),
        variantId: '',
        productQuantity: Number(SingleProduct.quantity),
        attributes: SingleProduct.attribute,
      };
      dispatch(addToCartAction(variables));
    } else {
      try {
        await AsyncStorage.setItem('cartproducts', JSON.stringify(product));
        dispatch(checkStorageAction());
      } catch (error) {
      }
    }
  };

  const addToCart = async () => {
    var hasCartProducts = [];
    var products = [];
    if (isLoggin) {
      hasCartProducts = cartItems;
    } else {
      hasCartProducts = await AsyncStorage.getItem('cartproducts');
      if (!isEmpty(hasCartProducts)) {
        products = JSON.parse(hasCartProducts);
      }
    }

    if (itemInCart) {
      return true;
    }
    if (hasCartProducts !== null) {
      setItemInCart(true);
      products.push({
        productId: SingleProduct._id,
        qty: cartQuantity,
        productTitle: SingleProduct.name,
        productPrice: SingleProduct.pricing.sellprice,
        attributes: SingleProduct.attribute,
      });

      _storeData(products);
      setShowCelebrateModal(true)

    } else {
      setItemInCart(true);
      _storeData([
        {
          productId: SingleProduct._id,
          qty: cartQuantity,
          productTitle: SingleProduct.name,
          productPrice: SingleProduct.pricing.sellprice,
          attributes: SingleProduct.attribute,
        },
      ]);
      setShowCelebrateModal(true)
    }
    Vibration.vibrate(100);
  };

  useEffect(()=>{
    if(showCelebrateModal){
      setTimeout(() => {
        setShowCelebrateModal(false)
      }, 2000);
    }
  },[showCelebrateModal])

  useEffect(() => {
    setSingleProductLoading(true);
    dispatch(productAction(ProductUrls));
    setSingleProductLoading(false);
    dispatch(productReviewsAction(ProductIds));
    const payload = {
      productId: ProductIds,
    };
    dispatch(catRecentProductAction(payload));
  }, [navigation, ProductIds]);


  useEffect(() => {
    setSingleProductLoading(true);
    if (isFocused) {
      if (!isEmpty(userDetails)) {
        dispatch(checkStorageAction(userDetails._id));
      } else {
        dispatch(checkStorageAction());
      }
      setTimeout(() => {
        if (!isEmpty(cartItems) && cartItems.length > 0) {
          console.log(cartItems,' cartitemmmmm')
          // cartItems.map((item) => {
          //   if (item.productId === ProductIds) {
          //     console.log(' im running yoyoy',ProductIds)
          //     setItemInCart(true);
          //   }else{
          //     console.log(' im running',ProductIds)
          //     setItemInCart(false);
          //   }
          // });

          for (let i = 0; i < cartItems.length; i++) {
            const item = cartItems[i];
            if (item.productId === ProductIds) {
              setItemInCart(true);
              break; // Exit the loop early
            } else {
              setItemInCart(false);
            }
          }

        }
      }, 100);
    } else {
      dispatch({
        type: PRODUCT_CLEAR,
      });
      setItemInCart(false);
    }
    setSingleProductLoading(false);
  }, [isFocused,ProductIds]);

  const cleanHTMLContent = (html) => {
    let cleanedHtml = html.trim();
    return cleanedHtml;
  };

  const checkZipcode = async () => {
    var res = await dispatch(checkPincodeValid({ zipcode: pinCode }));
    setDeliverable(res);
  };
  
  const tagsStyles = {
    body: {
      color: 'black', // Change this to your desired text color
    },
    p: { marginVertical: 0 },
    ul:{
      marginVertical: 0
    }
    
  };

  return (
    <MainLayout hideScroll>
      {singleProductLoading || Loading ? <AppLoader /> : null}
      <AIcon name="arrowleft" style={styles.arrowStyle} onPress={() => navigation.goBack()} size={22} />
      {!isEmpty(SingleProduct) && !Loading ? (
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            ref={scrollViewRef}
            keyboardShouldPersistTaps={'always'}
            contentContainerStyle={styles.scrollContentContainerStyle}
            style={styles.scrollStyles}>
            {/* ===============ImageView ============= */}
            <View style={styles.gallerySliderView}>
              <GalleryImagesSlider ProductDetails={SingleProduct} />
            </View>
            {/* ===============ImageView============= */}
            {/* ===============Product HEader============= */}
            <View style={styles.headerContainerStyle}>
              <View style={styles.productNameHeaderView}>
                <AText style={styles.headerText} big1>
                  {SingleProduct.name}
                </AText>
                <AText small style={styles.headerText}>
                  {SingleProduct.short_description}
                </AText>
              </View>
              <View style={styles.ratingPriceAndStockViewStyle}>
                <View style={{ width: '65%' }}>
                  {!isEmpty(SingleProduct.rating) &&
                    SingleProduct.rating > 0 ? (
                    <View style={styles.starstyle}>
                      <AText small style={styles.headerText}>
                        {SingleProduct.rating}
                      </AText>
                      <StarRating
                        disabled={true}
                        maxStars={1}
                        rating={1}
                        fullStarColor={APP_PRIMARY_COLOR}
                        starSize={16}
                      />
                    </View>
                  ) : null}
                  <ProductPriceText showLargeText={true} Pricing={SingleProduct.pricing} />
                </View>
                <View style={styles.stockContainer}>
                  <AText
                    small
                    color={SingleProduct.quantity > 0 ? '#1FAD08' : 'red'}
                    fonts={FontStyle.fontBold}>
                    {SingleProduct.quantity > 0
                      ? 'Available in stock'
                      : 'Out of stock'}
                  </AText>
                  {((!isEmpty(SingleProduct.quantity) &&
                    SingleProduct.quantity > 0) ||
                    !manage_stock) && (
                      <View style={styles.quantityView}>
                        <TouchableOpacity
                          activeOpacity={0.9}
                          style={styles.quantityBtnStyle}
                          onPress={() => {
                            cartQuantity > 1 && setCartQuantity(cartQuantity - 1);
                          }}>
                          <AIcon color={'#000'} size={15} name="minus" />
                        </TouchableOpacity>
                        <View style={[styles.quantityBtnStyle]}>
                          <AText medium bold>
                            {cartQuantity}
                          </AText>
                        </View>
                        <TouchableOpacity
                          activeOpacity={0.9}
                          style={styles.quantityBtnStyle}
                          onPress={() => {
                            ((!isEmpty(SingleProduct.quantity) &&
                              cartQuantity < SingleProduct.quantity) ||
                              !manage_stock) ?
                              setCartQuantity(cartQuantity + 1)
                              : alert('Cannot order more than this')
                          }}>
                          <AIcon color={'#000'} size={15} name="plus" />
                        </TouchableOpacity>
                      </View>
                    )}
                </View>
              </View>
            </View>
            {/* ===============Product Header End============= */}
            {!isEmpty(SingleProduct.attributes)
              ? SingleProduct.attributes.map((item) => (
                <AttributeListing
                  onPress={(value) => {
                    setProductIds(value._id);
                    setProductUrls(value.url);
                  }}
                  attributeName={item.name}
                  attributeID={item._id}
                  attributeValues={item.values}
                  variations={SingleProduct.variations}
                  productUrl={ProductUrls}
                />
              ))
              : null}

            {/* ================ Product short description================== */}
            {!isEmpty(SingleProduct.description) && (
              <View style={styles.containerViewStyle}>
                <AText style={styles.productDetailTextStyle} large >
                  Product Details
                </AText>
                <RenderHTML
                  tagsStyles={tagsStyles}
                  source={{html: cleanHTMLContent(SingleProduct.description)}}
                />
                <View style={styles.boderLineView} />
              </View>
            )}
            {/* ==================Product Quantity============================ */}

            {/* ========================specifications Field================================ */}
            <SpecificationBlock specifications={SingleProduct.specifications} />
            {/* ========================specifications Field================================ */}

            {/* ==================ZipCode Verification=================== */}
            <View style={styles.containerViewStyle}>
              <AText medium style={styles.productDetailTextStyle}>
                Check delivery at your location
              </AText>
              <View style={styles.pinCodeViewStyle}>
                <TextInput
                  keyboardType="numeric"
                  placeholder="Enter Pincode"
                  value={pinCode}
                  style={{ fontSize: 12, width: '70%' }}
                  maxLength={20}
                  onChangeText={(text) => setPinCode(text)}
                />
                <TouchableOpacity
                  onPress={() => checkZipcode()}
                  disabled={isEmpty(pinCode)}
                  style={[
                    styles.pinCodeCheckBtnStyle,
                    { backgroundColor: isEmpty(pinCode) ? '#c8c8c8' : APP_PRIMARY_COLOR },
                  ]}>
                  <AText style={styles.checkTextStyle} small>
                    CHECK
                  </AText>
                </TouchableOpacity>
              </View>
              {!isEmpty(deliverable) && (
                <AText
                  style={styles.coupanApliedText}
                  color={deliverable ? '#3E8959' : '#DD5B51'}
                  small
                >
                  {deliverable
                    ? `Hooray, This product is deliverable at your zipcode`
                    : `Sorry, This product is not deliverable at your zipcode. Try some other zipcode`}
                </AText>
              )}
            </View>
            {/* ==================simmilar product=================== */}
            {!isEmpty(RelatedProducts) &&
              !isEmpty(RelatedProducts[1]) &&
              !isEmpty(RelatedProducts[1].products) ? (
              <ProductsSlider
                title={'People who bought this also bought'}
                dataItems={RelatedProducts[1].products}
                navigatetonext={(item) => {
                  setProductIds(item._id);
                  setProductUrls(item.url);
                }}
              />
            ) : null}
            {!isEmpty(RelatedProducts) &&
              !isEmpty(RelatedProducts[0]) &&
              !isEmpty(RelatedProducts[0].products) ? (
              <ProductsSlider
                title={'Similar Products'}
                dataItems={RelatedProducts[0].products}
                navigatetonext={(item) => {
                  setProductIds(item._id);
                  setProductUrls(item.url);
                  setPinCode('');
                  setDeliverable('');
                }}
              />
            ) : null}
            {/* ==================simmilar product=================== */}

            {/* ===============Product Reviews============= */}
            <RatingReviewBlock ProductDetails={SingleProduct} ReviewProduct={ReviewProduct} />
          </ScrollView>

          <View style={styles.addToCartWrapper}>
            <TouchableOpacity
              style={{
                ...styles.addCartBtnStyle,
                backgroundColor:
                  (!isEmpty(SingleProduct.quantity) &&
                    SingleProduct.quantity > 0) ||
                    !manage_stock
                    ? APP_PRIMARY_COLOR
                    : '#c7c7c7',
              }}
              disabled={
                (!isEmpty(SingleProduct.quantity) &&
                  SingleProduct.quantity > 0) ||
                  !manage_stock
                  ? false
                  : true
              }
              onPress={() => addToCart()}>
              <AText color={'#fff'} font={FontStyle.fontBold} center>
                {itemInCart ? 'Added' : 'Add to Cart'}
              </AText>
            </TouchableOpacity>
          </View>

          {/* ===============Add To Cart============= */}
        </>
      ) : (
        !singleProductLoading ||
        (!Loading && (
          <NotFoundWrapper>
            <NotFoundImage
              source={require('../../assets/images/no-product-fonds.webp')}
            />
          </NotFoundWrapper>
        ))
      )}
      <Modal
          animationType="fade"
          transparent={true}
          visible={showCelebrateModal}
          onRequestClose={() => {
            setShowCelebrateModal(!showCelebrateModal);
          }}>
          <View style={styles.overlay}>
            <View style={styles.modalView}>
              <Image source={require('../../assets/images/cap.png')} style={{width:100,height:100}}/>
              <Text style={{fontWeight:'bold',fontSize:14}}>Horray! {cartQuantity} Item Added to the Cart</Text>
            </View>
          </View>
      </Modal>
    </MainLayout>
  );
};

SingleProductScreen.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

//  ===============For Style=============

const htmlStyles = StyleSheet.create({
  p: {
    margin: 0,
    padding: 0,
  },
  li: {
    margin: 0,
    padding: 0,
    paddingTop: 0,
  },
  ul: {
    margin: 0,
    padding: 0,
  },
});

const NotFoundWrapper = styled.View`
  height: 200px;
  width: 100%;
  align-self: center;
  flex: 1;
`;

const NotFoundImage = styled.Image`
  flex: 1;
  resize-mode: contain;
  width: null;
  height: null;
`;
const styles = StyleSheet.create({
  scrollContentContainerStyle: { flexGrow: 1, paddingBottom: 70 },
  scrollStyles: { flexGrow: 1, paddingBottom: 50, backgroundColor: '#fff' },
  gallerySliderView: { width: '100%', height: 450 },
  headerText: { marginTop: 5, color: '#72787e', fontFamily: FontStyle.semiBold },
  productNameHeaderView: {
    width: '100%',
  },
  stockContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityView: {
    overflown: 'hidden',
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  quantityBtnStyle: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    margin: 2,
  },
  headerContainerStyle: {
    justifyContent: 'space-between',
    marginHorizontal: 15,
  },
  pinCodeViewStyle: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: '#D4D4D4',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 7,
    // marginHorizontal: 10,
    paddingHorizontal: 5,
  },
  pinCodeCheckBtnStyle: {
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    padding: 5,
  },
  ratingPriceAndStockViewStyle: {
    width: '100%',
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  boderLineView: {
    backgroundColor: '#E9E9E9',
    height: 2,
    width: '95%',
    alignSelf: 'center',
  },
  containerViewStyle: {
    flex: 1,
    marginVertical: 10,
    marginHorizontal: 15,
  },
  starstyle: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#6D6D6D',
    flexWrap: 'wrap',
    width: 45,
    paddingVertical: 5,
    paddingHorizontal: 2,
    justifyContent: 'space-evenly',
    marginVertical: 7,
  },
  addToCartWrapper: {
    backgroundColor: 'rgba(168, 164, 164,0.35)',
    paddingTop: 5,
    width: '100%',
    alignSelf: 'center',
    position: 'absolute',
    bottom: 1,
  },
  addCartBtnStyle: {
    width: '60%',
    borderRadius: 25,
    paddingVertical: 10,
    marginBottom: 3,
    alignSelf: 'center',
  },
  coupanApliedText: {
    marginBottom: 10,
    fontFamily: FontStyle.semiBold
  },
  productDetailTextStyle: {
    fontFamily: FontStyle.fontBold,
    marginBottom: 10
  },
  checkTextStyle: {
    fontFamily: FontStyle.fontBold,
    // marginBottom: 5,
    color: '#fff'
  },
  arrowStyle:{
    position:'absolute',
    top:Platform.OS==='android'? 10:60,
    left:10,
    zIndex:5
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: '#fff',
    // paddingTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 80,
    borderRadius: 8,
    paddingBottom:20,
    paddingTop:10
    // flex: 1,
  },
});
export default SingleProductScreen;
