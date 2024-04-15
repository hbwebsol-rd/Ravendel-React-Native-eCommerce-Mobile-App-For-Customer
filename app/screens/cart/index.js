import React, { useEffect, useState } from 'react';
import { AText, AppLoader, AButton } from '../../theme-components';
import { useSelector, useDispatch } from 'react-redux';
import {
  productsAction,
  removeFromCartAction,
  applyCouponAction,
  checkStorageAction,
} from '../../store/action';
import { formatCurrency, getToken, isEmpty } from '../../utils/helper';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import URL from '../../utils/baseurl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions, useIsFocused } from '@react-navigation/native';
import {
  REMOVE_ALL_CART_PRODUCT,
  UPDATE_CART_PRODUCT,
} from '../../store/action/checkoutAction';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  COUPON_REMOVED,
  CartQtyAction,
  REMOVE_ITEM_IN_CART,
  removeCartAction,
} from '../../store/action/cartAction';
import { ProductPriceText } from '../components';
import { FontStyle } from '../../utils/config';
import AIcon from 'react-native-vector-icons/AntDesign';
import Colors from '../../constants/Colors';
import Header from '../components/Header';
import NavigationConstants from '../../navigation/NavigationConstants';

const CartScreen = ({ navigation }) => {
  // States and Variables
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const { userDetails, isLoggin } = useSelector((state) => state.customer);
  const cartItems = useSelector((state) => state.cart.products);
  const cartSummary = useSelector((state) => state.cart.cartSummary);
  const { cartId, couponDiscount, loading } = useSelector(
    (state) => state.cart,
  );
  const { Loading, products } = useSelector((state) => state.products);
  const { currencySymbol, currencyOptions } = useSelector(
    (state) => state.settings,
  );
  const [cartProducts, setCartProduct] = useState([]);
  const [coupontotal, setCouponTotal] = useState(0);
  const [couponModal, setCouponModal] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponCode, setCouponCode] = useState('');

  // Custom Function
  const fetchCart = () => {
    if (isEmpty(userDetails)) {
      dispatch(checkStorageAction());
    } else {
      console.log(userDetails._id);
      dispatch(checkStorageAction(userDetails._id));
    }
  };

  const ListProducts = () => {
    setCartProduct(cartItems);
  };

  const removeCartItem = async (removedItem) => {
    removedItem.cart = false;
    let filteredProduct = cartProducts.filter(
      (item) => item.productId !== removedItem.productId,
    );
    let filterCartItem = cartItems.filter(
      (item) => item.productId !== removedItem.productId,
    );

    try {
      if (cartProducts.length > 1) {
        if (isLoggin) {
          const cartData = {
            userId: userDetails._id,
            productId: removedItem.productId,
          };
          dispatch(removeFromCartAction(cartData, userDetails._id));
        } else {
          await AsyncStorage.setItem(
            'cartproducts',
            JSON.stringify(filterCartItem),
          );
          dispatch(checkStorageAction());
        }
      } else {
        clearCart();
      }
      setCartProduct(filteredProduct);
      dispatch({
        type: REMOVE_ITEM_IN_CART,
        payload: filterCartItem,
      });
      ListProducts();
    } catch (error) {
      console.log('Something went Wrong!!!!');
    }
  };

  const increaseItemQty = async (item) => {
    var cartitem = [];
    var outOfStock = false;
    cartItems.map((cart) => {
      if (cart.productId === item.productId) {
        console.log(
          cart.qty,
          cart.productQuantity,
          cart.qty == cart.productQuantity,
        );
        if (cart.qty == cart.productQuantity) {
          outOfStock = true;
        } else {
          cartitem.push({
            ...cart,
            qty: cart.qty + 1,
          });
        }
      } else {
        cartitem.push(cart);
      }
    });
    if (outOfStock) {
      alert('Cannot order more than this');
      return;
    }
    if (isLoggin) {
      var cartData = {
        userId: userDetails._id,
        productId: item.productId,
        qty: item.qty + 1,
      };
      dispatch(CartQtyAction(cartData));
    } else {
      try {
        await AsyncStorage.setItem('cartproducts', JSON.stringify(cartitem));
        dispatch(checkStorageAction());
      } catch (error) {
        console.log('Something went Wrong!!!!');
      }
    }
    dispatch({
      type: UPDATE_CART_PRODUCT,
      payload: cartitem,
    });
  };

  const decreaseItemQty = async (item) => {
    if (item.cartQty <= 1) {
      return;
    }
    var cartitem = [];
    cartItems.map((cart) => {
      if (cart.productId === item.productId) {
        cartitem.push({
          ...cart,
          qty: cart.qty - 1,
        });
      } else {
        cartitem.push(cart);
      }
    });
    if (isLoggin) {
      var cartData = {
        userId: userDetails._id,
        productId: item.productId,
        qty: item.qty - 1,
      };
      dispatch(CartQtyAction(cartData));
    } else {
      try {
        await AsyncStorage.setItem('cartproducts', JSON.stringify(cartitem));
        dispatch(checkStorageAction());
      } catch (error) {
        console.log('Something went Wrong!!!!');
      }
    }
    dispatch({
      type: UPDATE_CART_PRODUCT,
      payload: cartitem,
    });
  };

  const clearCart = async () => {
    dispatch({
      type: REMOVE_ALL_CART_PRODUCT,
    });
    if (isLoggin) {
      dispatch(removeCartAction(userDetails._id));
    }

    ListProducts();
  };

  const ApplyCoupon = () => {
    if (isEmpty(couponCode)) {
      alert('Coupon code is required');
      return;
    }
    let cartpro = [];
    cartItems.map((cart) => {
      cartpro.push({
        productId: cart.productId,
        // total: cart.total,
        qty: cart.qty,
      });
    });
    const payload = {
      couponCode: couponCode,
      cartItems: cartpro,
      userId: userDetails._id,
    };
    dispatch(applyCouponAction(payload, setCouponApplied));
  };

  const removeCoupon = () => {
    dispatch({
      type: COUPON_REMOVED,
    });
    setCouponApplied(false);
    setCouponCode('');
    setCouponTotal(0);
    dispatch(checkStorageAction(userDetails._id));
  };

  // Use Effect Call
  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    ListProducts();
  }, [products, cartItems]);
  return (
    <>
      {loading ? <AppLoader /> : null}
      <Header navigation={navigation} title={'My Cart'} />
      <View style={styles.container}>
        <>
          {cartProducts && cartProducts.length ? (
            <>
              <ScrollView
                keyboardShouldPersistTaps={'always'}
                style={{ width: '100%' }}
                showsVerticalScrollIndicator={false}>
                {cartProducts.map((product, index) => (
                  <TouchableOpacity
                    style={styles.productitem}
                    key={index}
                    onPress={() => {
                      console.log(product);
                      navigation.navigate(
                        NavigationConstants.SINGLE_PRODUCT_SCREEN,
                        {
                          productID: product.productId,
                          productUrl: product.url,
                        },
                      );
                    }}>
                    <ItemImage
                      source={{
                        uri: !isEmpty(product.productImage)
                          ? URL + product.productImage
                          : 'https://www.hbwebsol.com/wp-content/uploads/2020/07/category_dummy.png',
                      }}
                    />
                    <ItemDescription>
                      <View style={{ width: '100%' }}>
                        <AText nol={1} fonts={FontStyle.semiBold} large heavy>
                          {product.productTitle.length > 20
                            ? product.productTitle.substring(0, 20) + '...'
                            : product.productTitle}
                        </AText>
                        <AText
                          fonts={FontStyle.semiBold}
                          medium
                          color={Colors.blackColor}>
                          {formatCurrency(
                            product.productPrice,
                            currencyOptions,
                            currencySymbol,
                          )}
                          <Text
                            style={{
                              marginLeft: 15,
                              fontSize: 12,
                              color: 'gray',
                              textDecorationLine: 'line-through',
                            }}>
                            {' '}
                            {formatCurrency(
                              product.mrpAmount,
                              currencyOptions,
                              currencySymbol,
                            )}
                          </Text>
                          <Text
                            style={{
                              marginLeft: 15,
                              fontSize: 12,
                              color: 'red',
                            }}>
                            {' ' + product.discountPercentage}
                            {'%off'}
                          </Text>
                        </AText>
                        <PriceQtyWrapper
                          style={
                            {
                              // width: '35%',
                              // flexWrap: 'wrap',
                            }
                          }>
                          <QtyWrapper>
                            <QtyButton
                              onPress={() => {
                                product.qty === 1
                                  ? removeCartItem(product)
                                  : decreaseItemQty(product);
                              }}>
                              <AText color="#fff">
                                <AIcon
                                  color={'#72787e'}
                                  name="minussquare"
                                  size={16}
                                />
                              </AText>
                            </QtyButton>
                            <AText center medium bold ml="10px" mr="10px">
                              {product.qty}
                            </AText>
                            <QtyButton onPress={() => increaseItemQty(product)}>
                              <AText color="#fff">
                                <AIcon
                                  color={'#72787e'}
                                  name="plussquare"
                                  size={16}
                                />
                              </AText>
                            </QtyButton>
                          </QtyWrapper>
                          {product.productQuantity <= 5 ? (
                            <Text
                              style={{
                                color: '#ff0000',
                                fontSize: 12,
                                fontFamily: FontStyle.semiBold,
                              }}>
                              {'Only ' + product.productQuantity + ' Left'}
                            </Text>
                          ) : null}

                          {/* <ProductPriceText
                            fontsizesmall={true}
                            Pricing={{
                              sellprice: product.productPrice,
                              price: product.mrp,
                            }}
                            DontshowPercentage={true}
                            showInMulipleLine={'column-reverse'}
                            fontColor={'#DB3022'}
                          /> */}
                        </PriceQtyWrapper>
                      </View>
                    </ItemDescription>
                    <RemoveItem
                      style={{ zIndex: 10 }}
                      onPress={() => removeCartItem(product)}>
                      <AText color="#fff">
                        <Icon color={'#72787e'} name="close" size={12} />
                      </AText>
                    </RemoveItem>
                  </TouchableOpacity>
                ))}
                {cartProducts && cartProducts.length > 0 ? (
                  <View
                    style={{
                      marginTop: 10,
                      marginBottom: 26,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginHorizontal: 8,
                    }}>
                    <AText color="gray" small fonts={FontStyle.semiBold}>
                      {cartProducts.length}{' '}
                      {cartProducts.length > 1 ? 'Items' : 'Item'} in your cart
                    </AText>
                    <TouchableOpacity
                      onPress={() => clearCart()}
                      style={{
                        paddingHorizontal: 5,
                      }}>
                      <AText color="gray" small fonts={FontStyle.semiBold}>
                        Clear
                      </AText>
                    </TouchableOpacity>
                  </View>
                ) : null}
                <View style={{ position: 'relative' }}>
                  <AInputFeild
                    type="text"
                    value={couponCode}
                    onChangeText={(text) => setCouponCode(text)}
                    placeholder="Enter coupon code"
                  />
                  <View style={styles.couponBtn}>
                    <AButton
                      onPress={() =>
                        couponApplied ? removeCoupon() : ApplyCoupon()
                      }
                      round
                      block
                      title={couponApplied ? 'Applied' : 'Apply'}
                      small
                      semi
                    />
                  </View>
                </View>
                {couponApplied && <AText>Coupon Applied successfully</AText>}

                <View
                  style={{ width: '100%', marginBottom: 25, marginTop: 15 }}>
                  <View style={styles.summary}>
                    <AText fonts={FontStyle.semiBold}>Total MRP</AText>
                    <AText color={Colors.grayColor}>
                      {formatCurrency(
                        cartSummary?.mrpTotal,
                        currencyOptions,
                        currencySymbol,
                      )}
                    </AText>
                  </View>
                  {/* <View style={styles.summary}>
                    <AText fonts={FontStyle.semiBold}>Items</AText>
                    <AText color={Colors.grayColor}>${cartSummary?.cartTotal}</AText>
                  </View> */}
                  <View style={styles.summary}>
                    <AText fonts={FontStyle.semiBold}>Discount On MRP</AText>
                    <AText color={Colors.green}>
                      {formatCurrency(
                        cartSummary?.discountTotal,
                        currencyOptions,
                        currencySymbol,
                      )}
                    </AText>
                  </View>
                  {couponApplied && (
                    <View style={styles.summary}>
                      <AText fonts={FontStyle.semiBold}>
                        Discount By Coupon
                      </AText>
                      <AText color={Colors.green}>
                        {formatCurrency(
                          couponDiscount,
                          currencyOptions,
                          currencySymbol,
                        )}
                      </AText>
                    </View>
                  )}
                  <View
                    style={{
                      ...styles.summary,
                      borderBottomWidth: 0.5,
                      paddingBottom: 15,
                    }}>
                    <AText fonts={FontStyle.semiBold}>Shipping Fee</AText>
                    <AText
                      fonts={
                        cartSummary?.totalShipping === 0
                          ? FontStyle.semiBold
                          : FontStyle.fontRegular
                      }
                      color={Colors.grayColor}>
                      {cartSummary?.totalShipping === 0
                        ? 'FREE SHIPPING'
                        : formatCurrency(
                            cartSummary?.totalShipping,
                            currencyOptions,
                            currencySymbol,
                          )}
                    </AText>
                  </View>
                  {/* <View
                    style={{
                      ...styles.summary,
                      borderBottomWidth: 0.5,
                      paddingBottom: 15,
                    }}>
                    <AText fonts={FontStyle.semiBold}>Tax</AText>
                    <AText color="gray">{cartSummary?.totalTax}</AText>
                  </View> */}
                  <View
                    style={{
                      ...styles.summary,
                      marginTop: 5,
                      marginBottom: 25,
                    }}>
                    <AText fonts={FontStyle.semiBold}>Grand Total</AText>
                    <AText color="gray">
                      {formatCurrency(
                        cartSummary?.grandTotal,
                        currencyOptions,
                        currencySymbol,
                      )}
                    </AText>
                  </View>
                </View>
              </ScrollView>
            </>
          ) : (
            <EmptyWrapper>
              <AText heavy large center mb="10px">
                Your cart is currently empty.
              </AText>
              <AButton
                title="Shop Now"
                onPress={() =>
                  navigation.navigate(NavigationConstants.SHOP_SCREEN)
                }
              />
            </EmptyWrapper>
          )}
          {cartProducts && cartProducts.length ? (
            <>
              <CheckoutWrapper>
                <AButton
                  title="Proceed to Checkout"
                  round
                  mb="30px"
                  onPress={() => {
                    isLoggin
                      ? navigation.navigate(
                          NavigationConstants.SHIPPING_SCREEN,
                          {
                            screen: 'Shipping',
                            cartAmount: cartSummary?.grandTotal,
                            cartProducts: cartProducts,
                            couponCode: couponCode,
                          },
                        )
                      : navigation.navigate(
                          NavigationConstants.LOGIN_SIGNUP_SCREEN,
                        );
                  }}
                />
              </CheckoutWrapper>
            </>
          ) : null}
        </>
      </View>

      {/*---------- Add coupon Modal---------- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={couponModal}
        animationInTiming={1500}>
        {/* <ModalWrapper /> */}
        <ModalConatiner>
          <ModalHeader>
            <View style={{ width: '80%' }}>
              <AText center medium heavy>
                Apply Coupon
              </AText>
            </View>
            {/* <ModalClose> */}
            <View style={{ width: '5%' }}>
              <Icon
                onPress={() => {
                  setCouponModal(false);
                }}
                name="close"
                size={22}
                color="#000"
                style={{ textAlign: 'right' }}
              />
            </View>
            {/* </ModalClose> */}
          </ModalHeader>
          <ModalBody>
            <AInputFeild
              type="text"
              value={couponCode}
              onChangeText={(text) => setCouponCode(text)}
              placeholder="Please enter a valid coupon code"
            />
            {couponApplied && <AText>Coupan Applied successfully</AText>}

            <AButton onPress={() => ApplyCoupon()} round block title="Submit" />
          </ModalBody>
        </ModalConatiner>
      </Modal>
    </>
  );
};

const ModalConatiner = styled.ScrollView`
  background: #f7f7f7;
  height: 350px;
  flex: 1;
  flex-direction: column;
  border-top-right-radius: 25px;
  border-top-left-radius: 25px;
  box-shadow: 15px 5px 15px #000;
  elevation: 15;
`;

const ModalHeader = styled.View`
  height: 50px;
  background: #dadada;
  border-top-right-radius: 25px;
  border-top-left-radius: 25px;
  justify-content: center;
  align-items: center;
  flex-direction: row;
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

const CheckoutWrapper = styled.View`
  position: absolute;
  bottom: 0;
  left: 30;
  right: 0;
  background-color: transparent;
  padding-top: 5px;
  width: 100%;
  justify-content: center;
  align-items: center;
`;
const EmptyWrapper = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  height: 300px;
`;

const RemoveItem = styled.TouchableOpacity`
  padding: 4px;
  background: white;
  width: 25px;
  height: 25px;
  border-radius: 20px;
  justify-content: center;
  align-items: center;
  margin-right: 3px;
  position: absolute;
  right: 0;
`;
const ItemImage = styled.ImageBackground`
  width: 90px;
  height: 105px;
  resize-mode: cover;
`;
const ItemDescription = styled.View`
  flex: 1;
  padding: 10px;
  flex-direction: row;
  justify-content: space-between;
`;

const PriceQtyWrapper = styled.View`
  flex-direction: row;
  // justify-content: flex-end;
  margin-top: 5px;
  align-items: center;
`;
const QtyWrapper = styled.View`
  height: 30px;
  overflown: hidden;
  // width: 110px;
  // margin: 10px 0px;
  background: white;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  // border-width: 0.5px;
  margin-right: 5px;
`;
const QtyButton = styled.TouchableOpacity`
  background: white;
  height: 100%;
  // width: 25px;
  border-radius: 5px;
  justify-content: center;
  align-items: center;
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 30,
    backgroundColor: Colors.whiteColor,
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
  productitem: {
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 105,
    marginTop: 20,
    // marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#f7f7f7',
    marginHorizontal: 2,
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  couponBtn: {
    width: '30%',
    alignSelf: 'flex-end',
    position: 'absolute',
    bottom: 18,
  },
});
export default CartScreen;
