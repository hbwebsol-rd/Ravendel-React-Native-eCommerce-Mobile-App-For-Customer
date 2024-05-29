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
  AHeader,
  ProductCard,
} from '../../theme-components';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AIcon from 'react-native-vector-icons/AntDesign';
import GalleryImagesSlider from './galleryImages';
import HTMLView from 'react-native-htmlview';
import {
  Animated,
  Button,
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  ScrollView,
} from 'react-native';
import StarRating from 'react-native-star-rating';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatCurrency, isEmpty } from '../../utils/helper';
import { useIsFocused } from '@react-navigation/native';
import { ProductPriceText } from '../components';
import { DataTable } from 'react-native-paper';
import { View } from 'react-native-animatable';
import moment from 'moment';
import { reviewValidationSchema } from '../checkout/validationSchema';
import { Formik } from 'formik';
import { APP_PRIMARY_COLOR, FontStyle } from '../../utils/config';
import Colors from '../../constants/Colors';
import { Image } from 'react-native';
import { ImageBackground } from 'react-native';
import FastImage from 'react-native-fast-image';
import URL from '../../utils/baseurl';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import NavigationConstants from '../../navigation/NavigationConstants';
import PropTypes from 'prop-types';

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
  const snapPoints = ['40%', '62%', '100%'];

  // ref
  const bottomSheetModalRef = useRef(null);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

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
    let cleanedHtml = html.replace(/\s+/g, ' ').trim();
    // Remove span tags but keep their content
    cleanedHtml = cleanedHtml.replace(/<\/?span[^>]*>/g, '');
    return cleanedHtml;
  };
  console.log(RelatedProducts, 'RelatedProducts');
  const groupedSpecifications =
    !isEmpty(SingleProduct.specifications) &&
    SingleProduct.specifications.reduce((groups, spec) => {
      const group = groups[spec.group] || [];
      group.push(spec);
      groups[spec.group] = group;
      return groups;
    }, {});
  const groupedSpecificationData = groupedSpecifications;

  return (
    <BottomSheetModalProvider>
      {singleProductLoading || Loading ? <AppLoader /> : null}

      {!isEmpty(SingleProduct) ? (
        <>
          <View
            style={{
              flex: 1,
              overflow: 'visible',
              backgroundColor: Colors.whiteColor,
            }}>
            <View style={styles.header}>
              <AIcon
                onPress={() => navigation.goBack()}
                name="arrowleft"
                size={25}
              />
            </View>
            {/* ===============Featured Images============= */}
            <GallerySliderWrapper>
              <GalleryImagesSlider images={sliderImages} />
            </GallerySliderWrapper>
            <BottomSheetModal
              onDismiss={() => handlePresentModalPress()}
              // enableDismissOnClose={false}
              ref={bottomSheetModalRef}
              index={1}
              snapPoints={[200, '80%']}
              style={{ flex: 1 }}>
              <ScrollView
                keyboardShouldPersistTaps={'always'}
                contentContainerStyle={{ flexGrow: 1 }}
                style={{ flex: 1, flexGrow: 1 }}>
                {/* <ProductPriceText Pricing={SingleProduct.pricing} /> */}
                {/* ===============Product Name============= */}
                <View style={styles.headerContainerStyle}>
                  <View style={styles.productNameHeaderView}>
                    <AText medium color={'black'} fonts={FontStyle.semiBold}>
                      {SingleProduct.name}
                    </AText>
                    <AText small color={'#72787e'} fonts={FontStyle.semiBold}>
                      {SingleProduct.short_description}
                    </AText>
                  </View>
                  <View style={styles.ratingPriceAndStockViewStyle}>
                    <View>
                      {!isEmpty(SingleProduct.rating) &&
                      SingleProduct.rating > 0 ? (
                        <View style={styles.starstyle}>
                          <AText
                            small
                            color={'#72787e'}
                            fonts={FontStyle.semiBold}>
                            {SingleProduct.rating}
                          </AText>
                          <StarRating
                            disabled={true}
                            maxStars={1}
                            rating={1}
                            fullStarColor={APP_PRIMARY_COLOR}
                            starSize={14}
                          />
                        </View>
                      ) : null}
                      <ProductPriceText
                        fontsizesmall={true}
                        Pricing={SingleProduct.pricing}
                      />
                    </View>
                    <View>
                      <AText
                        right
                        xtrasmall
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
                              cartQuantity > 1 &&
                                setCartQuantity(cartQuantity - 1);
                            }}>
                            <AIcon
                              color={'#000'}
                              size={22}
                              name="minussquareo"
                            />
                          </TouchableOpacity>
                          <AText medium bold ml="7px" mr="7px">
                            {cartQuantity}
                          </AText>
                          <TouchableOpacity
                            activeOpacity={0.9}
                            style={styles.quantityBtnStyle}
                            onPress={() => {
                              ((!isEmpty(SingleProduct.quantity) &&
                                cartQuantity < SingleProduct.quantity) ||
                                !manage_stock) &&
                                setCartQuantity(cartQuantity + 1);
                            }}>
                            <AIcon
                              color={'#000'}
                              size={22}
                              name="plussquareo"
                            />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>
                  {!isEmpty(SingleProduct.attributes)
                    ? SingleProduct.attributes.map((item) => (
                        <View>
                          <AText
                            medium
                            color={'black'}
                            fonts={FontStyle.semiBold}>
                            {item.name}
                          </AText>
                          <View style={styles.attributeView}>
                            {!isEmpty(item.values) &&
                              item.values.map((key) => (
                                <TouchableOpacity
                                  style={styles.attributeBoxStyle}>
                                  <AText
                                    small
                                    color={'black'}
                                    fonts={FontStyle.fontRegular}>
                                    {key.name}
                                  </AText>
                                </TouchableOpacity>
                              ))}
                          </View>
                        </View>
                      ))
                    : null}
                </View>

                {/* ================ Product short description================== */}
                {!isEmpty(SingleProduct.description) && (
                  <>
                    <AText
                      ml={'15px'}
                      fonts={FontStyle.semiBold}
                      mb="5px"
                      medium>
                      Product Details
                    </AText>
                    <HTMLView
                      lineBreak={'\n'}
                      paragraphBreak={'\n'}
                      stylesheet={htmlStyles}
                      style={{ marginHorizontal: 17 }}
                      value={cleanHTMLContent(SingleProduct.description)}
                    />
                  </>
                )}
                {/* <AText ml="30px" mt={'5px'} mb={'20px'} bold>
                  SKU:{SingleProduct.sku}
                </AText> */}
                {/* ==================Product Quantity============================ */}

                {/* ========================Custom Field================================ */}
                {!isEmpty(SingleProduct.specifications) &&
                  SingleProduct.specifications.length > 0 && (
                    <View style={styles.containerViewStyle}>
                      <AText fonts={FontStyle.semiBold} mb="5px" medium>
                        Specifications
                      </AText>

                      {Object.keys(groupedSpecificationData).map(
                        (item, index) => (
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
                                  <AText
                                    medium
                                    capitalize
                                    fonts={FontStyle.semiBold}>
                                    {spec.key}
                                  </AText>
                                  <AText small capitalize>
                                    {spec.value}
                                  </AText>
                                </View>
                              ))}
                              {index !==
                              Object.keys(groupedSpecificationData).length -
                                1 ? (
                                <View style={styles.boderLineView} />
                              ) : null}
                            </View>
                          </>
                        ),
                      )}
                    </View>
                  )}

                {/* ==================ZipCode Verification=================== */}
                <View style={styles.containerViewStyle}>
                  <AText fonts={FontStyle.semiBold} mb="5px" medium>
                    Check delivery at your location
                  </AText>
                  <View style={styles.pinCodeViewStyle}>
                    <TextInput
                      placeholder="Enter Pincode"
                      value={pinCode}
                      style={{ fontSize: 12 }}
                      onChangeText={(text) => setPinCode(text)}
                    />
                    <TouchableOpacity
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
                </View>
                {/* ==================simmilar product=================== */}
                {!isEmpty(RelatedProducts) ? (
                  <View style={styles.containerViewStyle}>
                    <AText
                      medium
                      color={Colors.blackColor}
                      large
                      fonts={FontStyle.fontBold}
                      mb="10px">
                      People who bought this also bought
                    </AText>
                    <FlatList
                      numColumns={2}
                      data={RelatedProducts}
                      snapToAlignment="center"
                      keyExtractor={(item) => item._id}
                      renderItem={renderItem}
                      columnWrapperStyle={{ justifyContent: 'space-between' }}
                    />
                  </View>
                ) : null}
                {/* ==================simmilar product=================== */}

                {/* ===============Product Reviews============= */}
                <View style={styles.containerViewStyle}>
                  <AText fonts={FontStyle.semiBold} mt="10px" mb="5px" medium>
                    Customer Reviews
                  </AText>

                  {ReviewProduct &&
                  ReviewProduct.filter((review) => review.status === 'approved')
                    .length > 0 ? (
                    ReviewProduct.filter(
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
                            fullStarColor={APP_PRIMARY_COLOR}
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
                    ))
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
                {/* 
                <View style={styles.banner}>
                  <Checkpoints
                    title="Happy Customers"
                    image={require('../../assets/images/feedback.png')}
                  />
                  <Checkpoints
                    title="Genuine Product"
                    image={require('../../assets/images/award.png')}
                  />
                  <Checkpoints
                    title="Secure Checkout"
                    image={require('../../assets/images/carttick.png')}
                  />
                </View> */}

                {/* <View
                  style={{
                    marginHorizontal: 30,
                    marginTop: 15,
                    marginBottom: 30,
                  }}>
                  <AText medium>Returns</AText>
                  <AText small>
                    This products is not returnable for full details on out
                    return poliies please{' '}
                    <AText color={Colors.blue} underLine small>
                      click here
                    </AText>
                  </AText>
                </View> */}

                <AddToCartWrapper>
                  {(!isEmpty(SingleProduct.quantity) &&
                    SingleProduct.quantity > 0) ||
                  !manage_stock ? (
                    <AButton
                      title={itemInCart ? 'Added' : 'Add to Cart'}
                      round
                      onPress={() => addToCart()}
                    />
                  ) : (
                    <AButton
                      title={'Out of Stock'}
                      block
                      round
                      // onPress={() => addToCart()}
                    />
                  )}
                </AddToCartWrapper>
              </ScrollView>
            </BottomSheetModal>
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
  // Other styles as needed
});

const QtyWrapper = styled.View`
  height: 30px;
  overflown: hidden;
  // width: 110px;
  margin: 10px 0px;
  background: white;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  // border-width: 0.5px;
`;
const QtyButton = styled.TouchableOpacity`
  background: #fff;
  height: 100%;
  width: 28px;
  justify-content: center;
  align-items: center;
  padding: 0px;
`;
const CustomWrapper = styled.View`
  margin: 5px 0 0px 0;
  flex-direction: row;
`;
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
const GallerySliderWrapper = styled.View`
  height: 60%;
  background: white;
`;
const ProductName = styled.View`
  padding: 0px 0;
  width: 55%;
`;
const CollapseWrapper = styled.View`
  flex: 1;
  margin-horizontal: 30px;
`;
const CollapseContainer = styled.View`
  background-color: ${Colors.whiteColor};
  padding: 10px 10px 20px 10px;
  border-radius: 15px;
`;
const CollapseTitle = styled.TouchableOpacity`
  flex: 1;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  padding: 5px 0;
  border-bottom-color: #000;
  border-bottom-width: 0.5px;
  margin: 5px 0px;
`;
const CollapseIcon = styled.Text`
  align-self: flex-end;
`;
const AddToCartWrapper = styled.View`
  background: transparent;
  padding-top: 5px;
  width: 70%;
  align-self: center;
  position: absolute;
  bottom: 10;
`;
const ReviewWrapper = styled.View`
  background: #fff;
  padding-horizontal: 5px;
  padding-vertical: 7px;
  margin: 5px 0px;
`;
const Reviewrating = styled.View`
  padding-horizontal: 5px;
  padding-vertical: 3px;
  border-radius: 7px;
  justify-content: center;
  align-items: center;
  align-self: flex-start;
  margin-end: 7px;
`;
const ReveiwHeading = styled.View`
  justify-content: center;
  align-items: center;
  flex-direction: row;
  align-self: flex-start;
`;
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
    width: '28',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
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
    width: '60%',
    height: 42,
    borderWidth: 1,
    borderColor: '#D4D4D4',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 7,
  },
  pinCodeCheckBtnStyle: {
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    paddingHorizontal: 5,
    paddingVertical: 4,
  },
  ratingPriceAndStockViewStyle: {
    width: '100%',
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  attributeView: {
    flexDirection: 'row',
    marginVertical: 10,
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
    marginBottom: 10,
  },
  boderLineView: {
    backgroundColor: '#6D6D6D',
    height: 1,
    width: '95%',
    marginStart: 5,
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
  attributeBoxStyle: {
    borderWidth: 1,
    borderColor: '#636363',
    marginHorizontal: 7,
    paddingHorizontal: 5,
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
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
    marginHorizontal: 15,
  },
  ratingPriceAndStockView: {
    zIndex: 10,
    bottom: 0,
    position: 'absolute',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: 'white',
    paddingBottom: 30,
    // paddingHorizontal: 30,
    paddingTop: 20,
    width: '100%',
    flex: 1,
    elevation: 6,
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
  cardstyle: {
    width: '48%',
    height: 236,
    marginBottom: 30,
    borderRadius: 10,
    elevation: 5,
  },

  centeredItemImage: {
    width: '100%',
    height: '100%',
    // resizeMode: 'contain',
    borderRadius: 10,
    // marginHorizontal: windowWidth * 0.05,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '25%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  textContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  textContainer2: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    textAlign: 'right',
    marginHorizontal: 10,
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  iconcontainer: {
    marginBottom: 5,
    width: 22,
    height: 22,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  blurImageStyle: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    bottom: 0,
    justifyContent: 'flex-end',
  },
  blurWrap: {
    height: '25%', //Here we need to specify the height of blurred part
    overflow: 'hidden',
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
});
export default SingleProductScreen;
