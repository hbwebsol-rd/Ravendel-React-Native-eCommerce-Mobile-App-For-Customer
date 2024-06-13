import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  productAction,
  productReviewsAction,
  productAddReviewAction,
  addCartAction,
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
  ARow,
  ACol,
  AppLoader,
  AButton,
  ProductCard,
} from '../../theme-components';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AIcon from 'react-native-vector-icons/AntDesign';
import GalleryImagesSlider from './galleryImages';
import HTMLView from 'react-native-htmlview';
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  ScrollView,
} from 'react-native';
import StarRating from 'react-native-star-rating';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isEmpty } from '../../utils/helper';
import { useIsFocused, useScrollToTop } from '@react-navigation/native';
import { ProductPriceText } from '../components';
import { View } from 'react-native-animatable';
import moment from 'moment';
import { reviewValidationSchema } from '../checkout/validationSchema';
import { Formik } from 'formik';
import {
  APP_PRIMARY_COLOR,
  APP_SECONDARY_COLOR,
  FontStyle,
} from '../../utils/config';
import Colors from '../../constants/Colors';
import ImageSliderNew from '../home/Components.js/CustomSliderNew';

import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import NavigationConstants from '../../navigation/NavigationConstants';
import PropTypes from 'prop-types';
import LevelWiseRating from './Components/levelWiseRating';
import { checkPincodeValid } from '../../store/action/checkoutAction';
import AttributeListing from './Components/attributeUI';

var reviewObject = {
  title: '',
  email: '',
  review: '',
  rating: '0',
  status: 'pending',
  customer_id: '',
  product_id: '',
};

const SingleProductScreen = ({ navigation, route }) => {
  // States and Variables
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const SingleProduct = useSelector((state) => state.products.product);
  const { user_token } = useSelector((state) => state.login);
  const { userDetails, isLoggin } = useSelector((state) => state.customer);
  const ReviewProduct = useSelector((state) => state.products.productReviews);
  const RelatedProducts = useSelector(
    (state) => state.products.relatedProducts,
  );
  const { manage_stock } = useSelector((state) => state.settings);
  const Loading = useSelector((state) => state.products.loading);
  const { currencyOptions, currencySymbol } = useSelector(
    (state) => state.settings,
  );
  const ProductId = route.params.productID;
  const ProductUrl = route.params.productUrl;
  const [ProductIds, setProductIds] = useState(ProductId);
  const [ProductUrls, setProductUrls] = useState(ProductUrl);
  const [review, setReview] = useState(reviewObject);
  const [reviewcollapse, setReviewCollapse] = useState(false);
  const [writeReviewPop, setWriteReviewPop] = useState(false);
  const [sliderImages, setSliderImages] = useState([]);
  const cartItems = useSelector((state) => state.cart.products);
  const [itemInCart, setItemInCart] = useState(false);
  const [singleProductLoading, setSingleProductLoading] = useState(true);
  const [cartQuantity, setCartQuantity] = useState(1);
  const [pinCode, setPinCode] = useState('');
  const [deliverable, setDeliverable] = useState('');
  const snapPoints = ['40%', '62%', '100%'];
  const scrollViewRef = useRef(null);

  // ref
  const bottomSheetModalRef = useRef(null);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  useEffect(() => {
    scrollViewRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  }, [ProductUrls]);

  useScrollToTop(scrollViewRef);

  // Custom Function
  const addReview = (val) => {
    const reviews = {
      title: val.title,
      email: val.email,
      review: val.review,
      rating: val.rating,
      status: val.status,
      customerId: val.customer_id,
      productId: val.product_id,
    };
    dispatch(productAddReviewAction(reviews));
    setWriteReviewPop(!writeReviewPop);
  };

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
        console.log('Something went Wrong!!!!');
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
    }
  };

  // Use Effect Call
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTintColor: '#000',
    });
  }, [navigation]);

  useEffect(() => {
    setReview({
      ...review,
      customer_id: userDetails._id,
      product_id: ProductIds,
      email: userDetails.email,
    });
    setSingleProductLoading(true);
    dispatch(productAction(ProductUrls));
    dispatch(productReviewsAction(ProductIds));
    const payload = {
      productId: ProductIds,
    };
    dispatch(catRecentProductAction(payload));
    setSingleProductLoading(false);
  }, [navigation, ProductIds]);

  useEffect(() => {
    setTimeout(() => {
      handlePresentModalPress();
    }, 1000);
  }, []);

  useEffect(() => {
    setSingleProductLoading(true);

    var allimages = [];
    if (!isEmpty(SingleProduct) && !isEmpty(SingleProduct.feature_image)) {
      allimages.push(SingleProduct.feature_image);
    }
    if (!isEmpty(SingleProduct) && !isEmpty(SingleProduct.gallery_image)) {
      SingleProduct.gallery_image.map((img) => {
        allimages.push(img);
      });
    }
    setSliderImages(allimages);
    setSingleProductLoading(false);
  }, [SingleProduct]);

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
          cartItems.map((item) => {
            if (item.productId === ProductIds) {
              setItemInCart(true);
            }
          });
        }
      }, 1000);
    } else {
      dispatch({
        type: PRODUCT_CLEAR,
      });
      setItemInCart(false);
    }
    setSingleProductLoading(false);
  }, [isFocused]);

  function renderItem({ item }) {
    return (
      <ProductCard
        category={item}
        displayImage={item.feature_image}
        fontsizesmall={true}
        navigateNextScreen={() => {
          setProductIds(item._id);
          setProductUrls(item.url);
        }}
      />
    );
  }

  const cleanHTMLContent = (html) => {
    // Remove extra spaces
    let cleanedHtml = html.trim();
    // Remove span tags but keep their content
    // cleanedHtml = cleanedHtml.replace(/<\/?span[^>]*>/g, '');
    return cleanedHtml;
  };

  const groupedSpecifications =
    !isEmpty(SingleProduct.specifications) &&
    SingleProduct.specifications.reduce((groups, spec) => {
      const group = groups[spec.group] || [];
      group.push(spec);
      groups[spec.group] = group;
      return groups;
    }, {});
  const groupedSpecificationData = groupedSpecifications;

  const ratingPercentage = (ratingNo) =>
    !isEmpty(SingleProduct.ratingCount) &&
    Math.round((ratingNo / SingleProduct.ratingCount) * 100);

  const checkZipcode = async () => {
    var res = await dispatch(checkPincodeValid({ zipcode: pinCode }));
    setDeliverable(res);
  };

  return (
    <BottomSheetModalProvider>
      {singleProductLoading || Loading ? <AppLoader /> : null}

      {!isEmpty(SingleProduct) ? (
        <>
          <ScrollView
            ref={scrollViewRef}
            keyboardShouldPersistTaps={'always'}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 70 }}
            style={{ flexGrow: 1, paddingBottom: 50, backgroundColor: '#fff' }}>
            {/* <ProductPriceText Pricing={SingleProduct.pricing} /> */}
            {/* ===============Product Name============= */}
            <View style={{ width: '100%', height: 450 }}>
              <GalleryImagesSlider images={sliderImages} />
            </View>
            <View style={styles.headerContainerStyle}>
              <View style={styles.productNameHeaderView}>
                <AText big1 color={'black'} fonts={FontStyle.semiBold}>
                  {SingleProduct.name}
                </AText>
                <AText
                  small
                  mt={'5px'}
                  color={'#72787e'}
                  fonts={FontStyle.semiBold}>
                  {SingleProduct.short_description}
                </AText>
              </View>
              <View style={styles.ratingPriceAndStockViewStyle}>
                <View style={{ width: '70%' }}>
                  {!isEmpty(SingleProduct.rating) &&
                  SingleProduct.rating > 0 ? (
                    <View style={styles.starstyle}>
                      <AText small color={'#72787e'} fonts={FontStyle.semiBold}>
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
                  <ProductPriceText Pricing={SingleProduct.pricing} />
                </View>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
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
                            !manage_stock) &&
                            setCartQuantity(cartQuantity + 1);
                        }}>
                        <AIcon color={'#000'} size={15} name="plus" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            </View>

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
                <AText large fonts={FontStyle.fontBold} mb="10px">
                  Product Details
                </AText>
                <HTMLView
                  // lineBreak={'\n'}
                  // paragraphBreak={'\n'}
                  stylesheet={htmlStyles}
                  style={{ marginHorizontal: 5 }}
                  value={cleanHTMLContent(SingleProduct.description)}
                />
                <View style={styles.boderLineView} />
              </View>
            )}
            {/* <AText ml="30px" mt={'5px'} mb={'20px'} bold>
                  SKU:{SingleProduct.sku}
                </AText> */}
            {/* ==================Product Quantity============================ */}

            {/* ========================Custom Field================================ */}
            {!isEmpty(SingleProduct.specifications) &&
              SingleProduct.specifications.length > 0 && (
                <View style={styles.containerViewStyle}>
                  <AText large fonts={FontStyle.fontBold} mb="10px">
                    Specifications
                  </AText>

                  {Object.keys(groupedSpecificationData).map((item, index) => (
                    <>
                      <AText
                        ml="10px"
                        capitalize
                        color={APP_PRIMARY_COLOR}
                        fonts={FontStyle.semiBold}
                        mb="5px"
                        medium>
                        {item}
                      </AText>
                      <View style={styles.specificationGroupStyle}>
                        {groupedSpecificationData[item].map((spec) => (
                          <View style={styles.specificationRowStyle}>
                            <AText medium capitalize fonts={FontStyle.semiBold}>
                              {spec.key}
                            </AText>
                            <AText small capitalize>
                              {spec.value}
                            </AText>
                          </View>
                        ))}
                        {index !==
                        Object.keys(groupedSpecificationData).length - 1 ? (
                          <View
                            style={{
                              ...styles.boderLineView,
                              marginVertical: 10,
                            }}
                          />
                        ) : null}
                      </View>
                    </>
                  ))}
                </View>
              )}

            {/* ==================ZipCode Verification=================== */}
            <View style={styles.containerViewStyle}>
              <AText medium fonts={FontStyle.semiBold} mb="10px">
                Check delivery at your location
              </AText>
              <View style={styles.pinCodeViewStyle}>
                <TextInput
                  placeholder="Enter Pincode"
                  value={pinCode}
                  style={{ fontSize: 12 }}
                  maxLength={20}
                  onChangeText={(text) => setPinCode(text)}
                />
                <TouchableOpacity
                  onPress={() => checkZipcode()}
                  style={[
                    styles.pinCodeCheckBtnStyle,
                    { backgroundColor: APP_PRIMARY_COLOR },
                  ]}>
                  <AText
                    color={'#fff'}
                    fonts={FontStyle.semiBold}
                    mb="5px"
                    small>
                    CHECK
                  </AText>
                </TouchableOpacity>
              </View>
              {!isEmpty(deliverable) && (
                <AText
                  color={deliverable ? '#3E8959' : '#DD5B51'}
                  small
                  fonts={FontStyle.semiBold}
                  mb="10px">
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
              <ImageSliderNew
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
              <ImageSliderNew
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
            {!isEmpty(SingleProduct.levelWiseRating) &&
            SingleProduct.ratingCount > 0 ? (
              <View style={styles.containerViewStyle}>
                <AText large fonts={FontStyle.fontBold} mb="10px">
                  Rating and Reviews
                </AText>
                <LevelWiseRating
                  levelWiseRating={SingleProduct.levelWiseRating}
                  rating={SingleProduct.rating}
                  ratingCount={SingleProduct.ratingCount}
                />

                {ReviewProduct &&
                ReviewProduct.filter((review) => review.status === 'approved')
                  .length > 0 ? (
                  <>
                    <AText fonts={FontStyle.semiBold} mt="10px" mb="5px" medium>
                      Customer Reviews
                    </AText>
                    {ReviewProduct.filter(
                      (review) => review.status === 'approved',
                    ).map((singleReview) => (
                      <View style={styles.reviewContainerStyle}>
                        <View style={[styles.starstyle, { borderWidth: 0 }]}>
                          <AText
                            medium
                            color={'#72787e'}
                            fonts={FontStyle.semiBold}>
                            {singleReview.rating}
                          </AText>
                          <StarRating
                            disabled={true}
                            maxStars={1}
                            rating={1}
                            fullStarColor={'#DDAC17'}
                            starSize={14}
                          />
                        </View>
                        <View style={{ width: '85%' }}>
                          <View style={styles.reviewStyle}>
                            <AText capitalize bold small>
                              {singleReview.title}
                            </AText>
                            <AText semiminor color={'#8A8A8A'}>
                              {!isEmpty(singleReview.customerId.firstName)
                                ? singleReview.customerId.firstName + ` | `
                                : ''}
                              {moment(singleReview.date).format('ll')}
                            </AText>
                          </View>
                          <AText xtrasmall>{singleReview.review} </AText>
                        </View>
                      </View>
                    ))}
                  </>
                ) : (
                  <>
                    <AText
                      bbc={Colors.blackColor}
                      bbw={'0.5px'}
                      pb="8px"
                      small
                      center>
                      There are no reviews yet. Be the first one to write one.
                    </AText>
                  </>
                )}
              </View>
            ) : null}
          </ScrollView>
          <View style={styles.addToCartWrapper}>
            {/* {(!isEmpty(SingleProduct.quantity) && SingleProduct.quantity > 0) ||
            !manage_stock ? ( */}
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
            {/* ) : (
              <TouchableOpacity
                style={{
                  ...styles.addCartBtnStyle,
                  backgroundColor: APP_PRIMARY_COLOR,
                }}
                onPress={() => {}}>
                <AText
                  capitalize
                  color={'#fff'}
                  font={FontStyle.fontBold}
                  center>
                  Out of Stock
                </AText>
              </TouchableOpacity>
            )} */}
          </View>
          {/* </BottomSheetModal> */}

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
      {/* Add Review Popup */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={writeReviewPop}
        animationInTiming={1500}>
        <ModalWrapper />
        <ModalConatiner>
          <ModalHeader>
            <AText center medium heavy>
              Write a Review
            </AText>
            <ModalClose
              style={{ zIndex: 20 }}
              onPress={() => setWriteReviewPop(false)}>
              <Icon name="close" size={15} color="#000" />
            </ModalClose>
          </ModalHeader>
          <ModalBody>
            <Formik
              initialValues={review}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                addReview(values);
                setSubmitting(false);
                resetForm({});
              }}
              validationSchema={reviewValidationSchema}>
              {({
                values,
                handleChange,
                errors,
                setFieldValue,
                touched,
                handleSubmit,
              }) => (
                <>
                  <AInputFeild
                    type="text"
                    value={values.title}
                    onChangeText={handleChange('title')}
                    placeholder="Title"
                  />
                  {touched.title && errors.title && (
                    <AText color="red" xtrasmall>
                      {errors.title}
                    </AText>
                  )}
                  <ATextarea
                    value={values.review}
                    numberOfLines={5}
                    multiline={true}
                    onChangeText={handleChange('review')}
                    placeholder="Review"
                    textAlignVertical="top"
                  />
                  {touched.review && errors.review && (
                    <AText color="red" xtrasmall>
                      {errors.review}
                    </AText>
                  )}
                  <ARow>
                    <ACol col={2}>
                      <StarRating
                        disabled={false}
                        maxStars={5}
                        rating={parseInt(values.rating)}
                        selectedStar={(rating) =>
                          setFieldValue('rating', rating.toString())
                        }
                        fullStarColor={'#ffb400'}
                        starSize={25}
                      />
                      {touched.rating && errors.rating && (
                        <AText color="red" xtrasmall>
                          {errors.rating}
                        </AText>
                      )}
                    </ACol>
                  </ARow>
                  <AButton
                    onPress={handleSubmit}
                    round
                    block
                    title="Add Review"
                  />
                </>
              )}
            </Formik>
          </ModalBody>
        </ModalConatiner>
      </Modal>
    </BottomSheetModalProvider>
  );
};

SingleProductScreen.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

//  ===============For Style=============

const htmlStyles = StyleSheet.create({
  // Add styles for any specific HTML tags if needed
  p: {
    margin: 0,
    padding: 0,
  },
  li: {
    margin: 0,
  },
  ul: {
    marginTop: 0,
  },
  // Other styles as needed
});

const ModalWrapper = styled.ScrollView`
  background-color: rgba(0, 0, 0, 0.5);
  position: relative;
  flex: 1;
`;
const ModalConatiner = styled.ScrollView`
  background: #f7f7f7;
  height: 350px;
  flex: 1;
  flex-direction: column;
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  border-top-right-radius: 25px;
  border-top-left-radius: 25px;
  box-shadow: 15px 5px 15px #000;
  elevation: 15;
  z-index: 1;
`;
const ModalClose = styled.TouchableOpacity`
  background: #fff;
  width: 25px;
  height: 25px;
  border-radius: 25px;
  position: absolute;
  top: 15px;
  right: 15px;
  align-items: center;
  justify-content: center;
`;
const ModalHeader = styled.View`
  height: 50px;
  background: #dadada;
  border-top-right-radius: 25px;
  border-top-left-radius: 25px;
  justify-content: center;
`;
const ModalBody = styled.View`
  padding: 20px;
  height: 100%;
  position: relative;
`;
const AInputFeild = styled.TextInput`
  border-color: gray;
  border-bottom-width: 1px;
  width: 100%;
  margin-bottom: 10px;
  border-radius: 5px;
  padding: 10px;
`;
const ATextarea = styled.TextInput`
  border-color: gray;
  border-bottom-width: 1px;
  width: 100%;
  margin-bottom: 10px;
  border-radius: 5px;
  height: 80px;
  padding: 10px;
`;
const GallerySliderWrapper = styled.View``;

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
  productNameHeaderView: {
    width: '100%',
  },
  quantityView: {
    overflown: 'hidden',
    // width: 110px;
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    // border-width: 0.5px;
  },
  quantityBtnStyle: {
    // background: '#fff',
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    margin: 2,
  },
  header: {
    flexDirection: 'row',
    position: 'absolute',
    width: '100%',
    justifyContent: 'space-between',
    left: 0,
    right: 0,
    marginTop: 10,
    paddingHorizontal: 30,
    zIndex: 10,
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
    marginHorizontal: 10,
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
  attributeView: {
    flexDirection: 'row',
    marginVertical: 7,
  },
  attributeBoxStyle: {
    borderWidth: 1,
    borderColor: '#636363',
    marginHorizontal: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  specificationGroupStyle: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '97%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  specificationRowStyle: {
    width: '40%',
    marginStart: 7,
    marginBottom: 20,
  },
  boderLineView: {
    backgroundColor: '#E9E9E9',
    height: 2,
    width: '95%',
    alignSelf: 'center',
  },
  reviewContainerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  reviewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  banner: {
    height: 120,
    backgroundColor: Colors.lightBlue,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 15,
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
  ratingContainerView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-evenly',
  },
  ratingView: {
    width: '30%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelWiseRatingContainerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    marginVertical: 5,
  },
  levelWiseStarstyle: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    width: 45,
    paddingHorizontal: 2,
    justifyContent: 'space-evenly',
  },
  progressbarContainerStyle: {
    backgroundColor: '#D9D9D9',
    marginVertical: 5,
    width: '70%',
    borderRadius: 10,
    height: 4,
  },
  filledProgressbarStyle: {
    backgroundColor: '#D9D9D9',
    borderRadius: 10,
    height: 4,
  },
  addToCartWrapper: {
    backgroundColor: 'rgba(168, 164, 164,0.35)',
    // backgroundColor:'red',
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
});
export default SingleProductScreen;
