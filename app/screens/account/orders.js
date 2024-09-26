import React, { useEffect, useState } from 'react';
import { AText, AppLoader, AButton } from '../../theme-components';
import { useSelector, useDispatch } from 'react-redux';
import {
  productsAction,
  orderHistoryAction,
  AppSettingAction,
} from '../../store/action';
import { formatCurrency, isEmpty } from '../../utils/helper';
import styled from 'styled-components/native';
import { useIsFocused } from '@react-navigation/native';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import moment from 'moment';
import { FontStyle } from '../../utils/config';
import { ScrollView } from 'react-native-gesture-handler';
import Colors from '../../constants/Colors';
import Header from '../components/Header';
import NavigationConstants from '../../navigation/NavigationConstants';

const OrderScreen = ({ navigation }) => {
  const { userDetails, isLoggin } = useSelector((state) => state.customer);
  const { orderList, loading } = useSelector((state) => state.orders);
  const { Loading, products } = useSelector((state) => state.products);
  const loadingproduct = useSelector((state) => state.products.loading);

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
      <View style={styles.container}>
        <Header navigation={navigation} title="Orders" />
        <ScrollView style={{ marginTop: 50 }}>
          <>
            {cartProducts && cartProducts.length ? (
              <>
                {cartProducts.map((prod, index) => (
                  <OrderWrapper key={index}>
                    <AttributedWrapper>
                      <ProfileDetailWrapper>
                        <AText
                          fonts={FontStyle.semiBold}
                          color={Colors.blackColor}>
                          Order Number:{' '}
                        </AText>
                        <AText color={Colors.gray}>
                          {'000026 '}
                          {prod.order_number}{' '}
                        </AText>
                      </ProfileDetailWrapper>
                      <ProfileDetailWrapper>
                        <AText
                          fonts={FontStyle.semiBold}
                          color={Colors.grayColor}>
                          Date:
                        </AText>
                        <AText color={Colors.gray}>
                          {' '}
                          {moment(prod.date).format('LL')}
                        </AText>
                      </ProfileDetailWrapper>
                      <View style={styles.shipingstyle}>
                        <View style={{ flexDirection: 'row' }}>
                          <AText bold>Shipping Status: </AText>
                          <AText
                            fonts={FontStyle.semiBold}
                            color={Colors.redColor}>
                            {prod.shippingStatus === 'inprogress'
                              ? 'In-Progress'
                              : prod.shippingStatus}
                          </AText>
                        </View>
                        <TouchableOpacity
                          style={{
                            padding: 6,
                            backgroundColor: Colors.transparentColor,
                            borderColor: Colors.primaryTextColor,
                            borderRadius: 5,
                            borderWidth: 1,
                          }}>
                          <AText
                            fonts={FontStyle.semiBold}
                            color={Colors.primaryTextColor}>
                            Track order
                          </AText>
                        </TouchableOpacity>
                      </View>
                    </AttributedWrapper>
                  </OrderWrapper>
                ))}
              </>
            ) : (
              <EmptyWrapper>
                <AText heavy large center mb="10px">
                  Your have no orders for now
                </AText>
                <AButton
                  title="Shop Now"
                  onPress={() =>
                    navigation.navigate(NavigationConstants.SHOP_SCREEN)
                  }
                />
              </EmptyWrapper>
            )}
          </>
        </ScrollView>
      </View>
    </>
  );
};

const OrderWrapper = styled.View`
  // flex: 1;
  flex-direction: column;
  justify-content: center;
  padding: 15px 10px;
  background:white;
  margin-vertical:5px;
  margin-horizontal:30px;
  border-radius: 10px;
  position: relative;
  border: 1px solid #f7f7f7;
  shadow-color: #000,
  shadow-opacity: 0.25px;
  shadow-radius: 3.84px;
  elevation: 5px;
`;

const EmptyWrapper = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  height: 300px;
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
  container: {
    flex: 1,
    // paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: Colors.whiteColor,
    // paddingHorizontal: 30,
  },
  shipingstyle: {
    flexDirection: 'row',
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    padding: 5,
    justifyContent: 'space-between',
  },
});
export default OrderScreen;
