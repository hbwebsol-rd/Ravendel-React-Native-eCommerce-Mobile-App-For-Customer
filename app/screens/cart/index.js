import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { removeFromCartAction, checkStorageAction } from '../../store/action';
import { AText, AppLoader, AButton, MainLayout } from '../../theme-components';
import { formatCurrency, isEmpty } from '../../utils/helper';

import { REMOVE_ALL_CART_PRODUCT, UPDATE_CART_PRODUCT } from '../../store/action/checkoutAction';
import { CartQtyAction, REMOVE_ITEM_IN_CART, removeCartAction } from '../../store/action/cartAction';
import { APP_PRIMARY_COLOR, FontStyle } from '../../utils/config';
import Colors from '../../constants/Colors';
import Header from '../components/Header';
import NavigationConstants from '../../navigation/NavigationConstants';
import { catAdditionalProductAction, catRecentProductAction } from '../../store/action/productAction';
import ProductsSlider from '../../theme-components/ProductsSlider';
import ProductDisplayCard from '../../theme-components/cartProductDisplayCard';
import CartProductDisplayCard from '../../theme-components/cartProductDisplayCard';
import CartPriceTags from '../components/cartPriceTags';
import FIcon from 'react-native-vector-icons/Feather'
import NoConnection from '../../theme-components/nointernet';

const CartScreen = ({ navigation }) => {

  const dispatch = useDispatch();

  const { userDetails, isLoggin } = useSelector((state) => state.customer);
  const { loading, products: cartItems, cartSummary: cartSummaryPrice } = useSelector((state) => state.cart);
  const { additionalProduct: relatedProducts, products } = useSelector((state) => state.products);
  const { currencySymbol, currencyOptions } = useSelector((state) => state.settings);
  const { netConnection } = useSelector((state) => state.alert);

  const [cartSummary, setCartSummary] = useState({});
  const [cartProducts, setCartProduct] = useState([]);
  console.log(relatedProducts, 'relatedProducts[0].products')
  const mrpArray = [
    { id: 1, name: 'Total MRP', value: 'mrpTotal' },
    { id: 2, name: 'Discount On MRP', value: 'discountTotal' },
    { id: 3, name: 'Discount By Coupon', value: 'couponDiscountTotal' },
    { id: 4, name: 'Shipping Fee', value: 'totalShipping' },
    { id: 5, name: 'Total Amount', value: 'grandTotal' },
  ]
  useEffect(() => {
    if (!isEmpty(cartProducts)) {
      updateRelatedProducts();
    }
  }, [cartProducts]);

  useEffect(() => {
    if (!isEmpty(cartSummaryPrice)) {
      setCartSummary(cartSummaryPrice);
    }
  }, [cartSummaryPrice]);

  const updateRelatedProducts = () => {
    const payload = {
      productIds: cartItems.map(item => item.productId)
    }
    dispatch(catAdditionalProductAction(payload));
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
    }
  };

  const increaseItemQty = async (item) => {
    var cartitem = [];
    var outOfStock = false;
    cartItems.map((cart) => {
      if (cart.productId === item.productId) {
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

  useEffect(() => {
    if (isEmpty(userDetails)) {
      dispatch(checkStorageAction());
    } else {
      dispatch(checkStorageAction(userDetails._id));
    }
  }, []);

  useEffect(() => {
    ListProducts();
  }, [products, cartItems]);


  const ListProducts = () => {
    setCartProduct(cartItems);
  };

  if (netConnection) {
    return <NoConnection />;
  }

  return (
    <>
      {loading ? <AppLoader /> : null}
      <MainLayout hideScroll style={styles.container}>
        <Header navigation={navigation} title={'My Cart'} />
        <View style={styles.container}>
          <>
            {cartProducts && cartProducts.length ? (
              <>
                <ScrollView
                  keyboardShouldPersistTaps={'always'}
                  contentContainerStyle={{ flexGrow: 1 }}
                  style={{ width: '100%', flex: 1 }}
                  showsVerticalScrollIndicator={false}>
                    {console.log(cartProducts,' displa')}
                  <CartProductDisplayCard
                    navigation={navigation}
                    cartProducts={cartProducts}
                    navigateProduct={true}
                    ShowIncrementDecreement={true}
                    removeCartItem={removeCartItem}
                    decreaseItemQty={decreaseItemQty}
                    increaseItemQty={increaseItemQty} />
                  {cartProducts && cartProducts.length > 0 ? (
                    <View style={styles.itemsInStyle}>
                      <AText color="gray" small fonts={FontStyle.semiBold}>
                        {cartProducts.length}{' '}
                        {cartProducts.length > 1 ? 'Items' : 'Item'} in your
                        cart
                      </AText>
                      <TouchableOpacity
                        onPress={() => clearCart()}
                        style={{
                          paddingHorizontal: 5,
                        }}>
                        <AText color="red" small fonts={FontStyle.semiBold}>
                          Clear
                        </AText>
                      </TouchableOpacity>
                    </View>
                  ) : null}

                  {!isEmpty(relatedProducts) &&
                    !isEmpty(relatedProducts[0]) &&
                    !isEmpty(relatedProducts[0].products) ? (
                    <ProductsSlider
                      title={'Bought Together Products'}
                      dataItems={relatedProducts[0].products}
                      productWidth={170}
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
                  ) : null}

                  <View style={{ width: '100%', marginBottom: 25, marginTop: 25 }}>
                    {mrpArray.map((item) => <CartPriceTags item={item} cartSummary={cartSummary} couponDiscount={false} />)}
                  </View>
                </ScrollView>
              </>
            ) : (
              <EmptyWrapper>
                <Image source={require('../../assets/images/shopping-cart.png')} style={{height:100,width:100,marginRight:15}} />
                <AText style={styles.emptyTextStyle} large>
                  Your Cart is Currently empty.
                </AText>
                <AButton
                  style={{borderRadius: 25}}
                  round
                  title="Shop Now"
                  onPress={() =>
                    navigation.navigate(NavigationConstants.CATEGORIES_SCREEN)
                  }
                />
              </EmptyWrapper>
            )}
          </>
        </View>
      </MainLayout>

      {cartProducts && cartProducts.length ? (
        <View style={[styles.checkoutViewStyle]}>
          <View style={{}}>
            <AText fonts={FontStyle.semiBold}>Total Amount</AText>
            <AText color="gray">
              {formatCurrency(
                cartSummary?.grandTotal,
                currencyOptions,
                currencySymbol,
              )}
            </AText>
          </View>
          <AButton
            title="CHECKOUT"
            style={{ borderRadius: 55, width: 115 }}
            onPress={() => {
              isLoggin
                ? navigation.navigate(NavigationConstants.SHIPPING_SCREEN, {
                  screen: 'Shipping',
                  cartAmount: cartSummary?.grandTotal,
                  cartProducts: cartProducts,
                })
                : navigation.navigate(NavigationConstants.LOGIN_SIGNUP_SCREEN);
            }}
          />
        </View>
      ) : null}

    </>
  );
};

const EmptyWrapper = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  height: 300px;
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 5,
    paddingBottom: 20,
    paddingHorizontal: 5,
    backgroundColor: Colors.whiteColor,
  },
  itemsInStyle: {
    marginTop: 10,
    marginBottom: 26,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 8,
  },
  checkoutViewStyle: {
    position: 'absolute',
    flexDirection: 'row',
    bottom: 0,
    elevation: 5,
    backgroundColor: 'rgba(255,255,255, 1)',
    paddingVertical: 10,
    width: ' 100%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  emptyTextStyle: {
    textAlign: 'center',
    marginBottom: 10,
    fontWeight:'bold',
    marginTop:20
  }
});
export default CartScreen;
