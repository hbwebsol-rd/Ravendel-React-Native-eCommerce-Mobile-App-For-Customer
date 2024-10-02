import React, {useEffect, useState} from 'react';
import {
  AText,
  AppLoader,
  AButton,
  MainLayout,
  BackHeader,
} from '../../theme-components';
import {useSelector, useDispatch} from 'react-redux';
import {
  productsAction,
  orderHistoryAction,
  AppSettingAction,
} from '../../store/action';
import {formatCurrency, isEmpty} from '../../utils/helper';
import styled from 'styled-components/native';
import {useIsFocused} from '@react-navigation/native';
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import moment from 'moment';
import {APP_PRIMARY_COLOR, FontStyle} from '../../utils/config';
import Colors from '../../constants/Colors';
import Header from '../components/Header';
import NavigationConstants from '../../navigation/NavigationConstants';

const OrderScreen = ({navigation}) => {
  const {userDetails, isLoggin} = useSelector(state => state.customer);
  const {orderList, loading} = useSelector(state => state.orders);
  const {Loading, products} = useSelector(state => state.products);
  const loadingproduct = useSelector(state => state.products.loading);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [cartProducts, setCartProduct] = useState([]);

  useEffect(() => {
    if (!isEmpty(userDetails)) {
      const payload = {
        id: userDetails._id,
      };
      dispatch(orderHistoryAction(payload));
    }
  }, [isFocused]);

  useEffect(() => {
    ListProducts();
  }, [products, orderList]);

  const ListProducts = () => {
    setCartProduct([...orderList]);
  };
  return (
    <>
      {loadingproduct || loading ? <AppLoader /> : null}
      <MainLayout hideScroll style={styles.container}>
        <BackHeader navigation={navigation} name="Orders" />
        <ScrollView showsVerticalScrollIndicator={false} style={{marginTop: 10}}>
          <>
            {cartProducts && cartProducts.length ? (
              <>
                {cartProducts.map((prod, index) => (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('OrdersDetail', {
                        cartProducts: prod.products,
                        orderId: prod.id,
                      })
                    }
                    style={styles.OrderWrapper}
                    key={index}>
                    <AttributedWrapper>
                      <ProfileDetailWrapper>
                        <AText
                          fonts={FontStyle.semiBold}
                          color={Colors.blackColor}>
                          Order Number:{' '}
                          <AText color={Colors.gray}>{prod.orderNumber}</AText>
                        </AText>
                      </ProfileDetailWrapper>
                      <ProfileDetailWrapper>
                        <AText
                          fonts={FontStyle.semiBold}
                          color={Colors.blackColor}>
                          Date: <AText color={Colors.gray}>{moment(prod.date).format('LL')}</AText>
                        </AText>
                      </ProfileDetailWrapper>
                      <View style={styles.shipingstyle}>
                        <View style={{flexDirection: 'row'}}>
                          <AText fonts={FontStyle.semiBold}>
                            Shipping Status:{' '}
                            <AText
                              style={{textTransform: 'uppercase'}}
                              color={
                                prod.shippingStatus === 'inprogress'
                                  ? Colors.orange
                                  : prod.shippingStatus === 'outfordelivery'
                                  ? Colors.yellow
                                  : prod.shippingStatus === 'delivered' ||
                                    prod.shippingStatus === 'shipped'
                                  ? Colors.green
                                  : ''
                              }>
                              {prod.shippingStatus === 'inprogress'
                                ? 'In-Progress'
                                : prod.shippingStatus}
                            </AText>
                          </AText>
                        </View>
                        {/* <TouchableOpacity
                          style={[styles.trackBtnStyle, { borderColor: APP_PRIMARY_COLOR }]}>
                          <AText
                            textStyle={[styles.textStyle, { color: APP_PRIMARY_COLOR }]}>
                            Track order
                          </AText>
                        </TouchableOpacity> */}
                      </View>
                    </AttributedWrapper>
                  </TouchableOpacity>
                ))}
              </>
            ) : (
              <EmptyWrapper>
                <AText large>Your have no orders for now</AText>
                <AButton
                  buttonStyle={{margin: 10,borderRadius:25}}
                  title="Shop Now"
                  onPress={() =>
                    navigation.navigate(
                      NavigationConstants.CATEGORIES_SCREEN,
                    )
                  }
                />
              </EmptyWrapper>
            )}
          </>
        </ScrollView>
      </MainLayout>
    </>
  );
};

const EmptyWrapper = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  height: 600px;
`;

const ProfileDetailWrapper = styled.View`
  flex-direction: row;
  width: 100%;
  align-self: center;
  align-items: center;
  padding: 5px;
`;
const AttributedWrapper = styled.View`
  margin-bottom: 5px;
  margin-top: 5px;
  flex-direction: column;
`;
const styles = StyleSheet.create({
  OrderWrapper: {
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 5,
    paddingVertical: 10,
    background: 'white',
    marginVertical: 5,
    marginHorizontal: 20,
    borderRadius: 10,
    position: 'relative',
    borderColor: '#f7f7f7',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  container: {
    flex: 1,
    paddingBottom: 20,
    backgroundColor: Colors.whiteColor,
  },
  shipingstyle: {
    flexDirection: 'row',
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    padding: 5,
    justifyContent: 'space-between',
  },
  trackBtnStyle: {
    padding: 6,
    backgroundColor: Colors.transparentColor,
    borderColor: Colors.primaryTextColor,
    borderRadius: 5,
    borderWidth: 1,
  },
  textStyle: {
    fontFamily: FontStyle.semiBold,
  },
});
export default OrderScreen;
