import React, { useEffect, useState } from 'react';
import {
  AText,
  AContainer,
  AHeader,
  AppLoader,
  AButton,
  ARow,
  ACol,
  BackHeader,
} from '../../theme-components';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import URL from '../../utils/baseurl';
import { useIsFocused } from '@react-navigation/native';
import { DataTable } from 'react-native-paper';
import {
  formatCurrency,
  isEmpty,
  shippedFinalStatuscolor,
  shippedStatuscolor,
} from '../../utils/helper';
import { StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';
import { FontStyle } from '../../utils/config';
import NavigationConstants from '../../navigation/NavigationConstants';
import PropTypes from 'prop-types';

const OrderDetailScreen = ({ navigation, route }) => {
  const fontColor = '#7C7C7C';
  const { orderDetails, productIndex } = route.params;
  const { currencyOptions, currencySymbol } = useSelector(
    (state) => state.settings,
  );
  const { loading } = useSelector((state) => state.orders);
  const loadingproduct = useSelector((state) => state.products.loading);
  const [shippedID, setShippedID] = useState(1);
  const [shippingArr, setShiipingArr] = useState([
    { id: 1, value: 'inprogress', label: 'inprogress' },
    { id: 2, value: 'shipped', label: 'shipped' },
    { id: 3, value: 'outfordelivery', label: 'out for delivery' },
    { id: 4, value: 'delivered', label: 'delivered' },
  ]);
  useEffect(() => {
    shippingArr.map((item) => {
      if (item.value == orderDetails.shipping_status) {
        setShippedID(item.id);
      }
    });
  }, []);

  const OrdersShowView = React.memo(() => {
    return (
      <ShippingDetails>
        {orderDetails.products &&
          orderDetails.products.map((product, index) => {
            return (
              <ItemWrapper
                key={product.product_id}
                onPress={() =>
                  // setOrderDetailModal(true)
                  navigation.navigate(
                    NavigationConstants.SINGLE_PRODUCT_SCREEN,
                    { productID: product.product_id, productUrl: product?.url },
                  )
                }>
                <ItemImage
                  source={{
                    uri: !isEmpty(product.feature_image)
                      ? URL + product.feature_image
                      : 'https://www.hbwebsol.com/wp-content/uploads/2020/07/category_dummy.png',
                  }}
                />
                <ItemDescription>
                  <AText capitalize medium heavy>
                    {product.name.length > 20
                      ? product.name.substring(0, 20) + '...'
                      : product.name}
                  </AText>
                  <PriceQtyWrapper>
                    <AText capitalize color={fontColor}>
                      Qty:{'  '}
                      {product.qty}
                    </AText>
                    <NextItem>
                      <AText
                        color={fontColor}
                        lineThrough={product.qty > 1 ? true : false}>
                        {formatCurrency(
                          product.cost,
                          currencyOptions,
                          currencySymbol,
                        )}
                      </AText>
                      <AText mt={'5px'} capitalize heavy>
                        Total Amount: {product.cost * product.qty}
                        {formatCurrency(
                          product.cost * product.qty,
                          currencyOptions,
                          currencySymbol,
                        )}
                      </AText>
                    </NextItem>
                  </PriceQtyWrapper>
                </ItemDescription>
              </ItemWrapper>
            );
          })}
      </ShippingDetails>
    );
  }, [orderDetails]);
  return (
    <>
      {loadingproduct || loading ? <AppLoader /> : null}
      {/* <AHeader title="Cart" /> */}
      <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
        <BackHeader navigation={navigation} name="Order Detail" />
        <AContainer>
          <OrderDetailHeader>
            <AText small>
              Order ID:{' '}
              <AText small heavy>
                {orderDetails.order_number}
              </AText>
            </AText>
          </OrderDetailHeader>
          <ShippingDetails>
            <ShippingHeader>
              <AText capitalize large heavy>
                Shipping Details
              </AText>
            </ShippingHeader>
            <ShippingWrapper>
              <AText capitalize medium color={fontColor}>
                {orderDetails.shipping.firstname}{' '}
                {orderDetails.shipping.lastname}
              </AText>
              <AText medium capitalize color={fontColor}>
                {orderDetails.shipping.address}, {orderDetails.shipping.city}
              </AText>
              <AText medium color={fontColor}>
                {orderDetails.shipping.state}, {orderDetails.shipping.zip}
              </AText>
              <AText medium color={fontColor}>
                {' '}
                <Icon name="phone" style={styles.callIcon} size={18} />{' '}
                {orderDetails.shipping.phone}{' '}
              </AText>
            </ShippingWrapper>
          </ShippingDetails>

          <ShippingDetails>
            <ShippingHeader>
              <AText capitalize large heavy>
                Shipping Status
              </AText>
            </ShippingHeader>
            {shippingArr.map((item) => (
              <OrderProcessWrapper>
                {item.label !== 'delivered' && (
                  <VerticalLine color={'#dadada'}></VerticalLine>
                )}
                <OrderProcessCircle
                  color={
                    item.id <= shippedID
                      ? shippedFinalStatuscolor(item.value)
                      : shippedStatuscolor(item.value)
                  }></OrderProcessCircle>
                <AText uppercase medium color={fontColor} capitalize>
                  {item.label}
                </AText>
              </OrderProcessWrapper>
            ))}
          </ShippingDetails>

          <ShippingDetails>
            <ShippingHeader>
              <AText capitalize large heavy>
                Billing Details
              </AText>
            </ShippingHeader>
            <ShippingWrapper>
              <AText capitalize color={fontColor} medium>
                {orderDetails.billing.firstname} {orderDetails.billing.lastname}
              </AText>
              <AText medium color={fontColor} capitalize>
                {orderDetails.billing.address}, {orderDetails.billing.city}
              </AText>
              <AText medium color={fontColor}>
                {orderDetails.billing.state}, {orderDetails.billing.zip}
              </AText>
              <AText medium color={fontColor}>
                <Icon name="phone" style={styles.callIcon} size={18} />{' '}
                {orderDetails.billing.phone}
              </AText>
            </ShippingWrapper>
          </ShippingDetails>

          <OrdersShowView />

          <ShippingDetails>
            <ShippingHeader>
              <AText capitalize large heavy>
                Price Details
              </AText>
            </ShippingHeader>
            <PriceWrapper>
              <ARow row alignItems="center" justifyContent={'space-between'}>
                <AText mt={'5px'} medium bold>
                  Payment
                </AText>
                <AText mb={'5px'} medium bold color={fontColor}>
                  {orderDetails.billing.payment_method}
                </AText>
              </ARow>
              <ARow row alignItems="center" justifyContent={'space-between'}>
                <AText mt={'5px'} medium bold>
                  Cart total ({orderDetails.products.length})
                </AText>
                <AText mb={'5px'} medium bold color={fontColor}>
                  {formatCurrency(
                    orderDetails.subtotal,
                    currencyOptions,
                    currencySymbol,
                  )}
                </AText>
              </ARow>
              <ARow row alignItems="center" justifyContent={'space-between'}>
                <AText mt={'5px'} medium bold>
                  Coupon code{' '}
                  {!isEmpty(orderDetails.coupon_code) &&
                    ' (' + orderDetails.coupon_code + ')'}
                </AText>
                {orderDetails.discount_amount > 0 ? (
                  <AText mb={'5px'} medium bold color={'green'}>
                    -{' '}
                    {formatCurrency(
                      orderDetails.discount_amount,
                      currencyOptions,
                      currencySymbol,
                    )}
                  </AText>
                ) : (
                  <AText mb={'5px'} medium bold color={fontColor}>
                    0
                  </AText>
                )}
              </ARow>
              <ARow row alignItems="center" justifyContent={'space-between'}>
                <AText mt={'5px'} medium bold>
                  Delivery Charges
                </AText>
                {orderDetails.shipping_amount <= 0 ? (
                  <AText mb={'5px'} medium bold color={'green'}>
                    Free
                  </AText>
                ) : (
                  <AText mb={'5px'} medium bold color={fontColor}>
                    {formatCurrency(
                      orderDetails.shipping_amount,
                      currencyOptions,
                      currencySymbol,
                    )}
                  </AText>
                )}
              </ARow>
              <ARow row alignItems="center" justifyContent={'space-between'}>
                <AText mt={'5px'} medium bold>
                  Taxes
                </AText>
                <AText mb={'5px'} medium bold color={fontColor}>
                  {orderDetails.tax_amount > 0
                    ? formatCurrency(
                        orderDetails.tax_amount,
                        currencyOptions,
                        currencySymbol,
                      )
                    : '0'}
                </AText>
              </ARow>
              <ARow row alignItems="center" justifyContent={'space-between'}>
                <AText mt={'5px'} medium bold>
                  Total Amount Payable
                </AText>
                <AText mb={'5px'} medium bold color={fontColor}>
                  {formatCurrency(
                    orderDetails.grand_total,
                    currencyOptions,
                    currencySymbol,
                  )}
                </AText>
              </ARow>
            </PriceWrapper>
          </ShippingDetails>
        </AContainer>
      </View>
    </>
  );
};

OrderDetailScreen.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

const styles = StyleSheet.create({
  CouponCellStyle: { color: 'green', fontWeight: 'bold' },
  valueCellStyle: { fontWeight: 'bold', color: '#7C7C7C' },
  callIcon: { justifyContent: 'center', alignSelf: 'center' },
  PriceLabelCell: { fontFamily: FontStyle.fontMedium },
});
const OrderProcessWrapper = styled.View`
  flex-direction: row;
  margin: 10px 10px;
  align-items: center;
`;
const OrderProcessCircle = styled.View`
  background: ${(props) => props.color ?? '#dadada'};
  border-radius: 20;
  height: 15px;
  width: 15px;
  margin: 5px 15px;
`;
const VerticalLine = styled.View`
    background:${(props) => props.color ?? '#dadada'};
    width: 3px;
    height:27px
    position: absolute;    
    margin:5px 21px;
    top:17px;
    align-items: center;
`;
const NextItem = styled.View`
  padding: 4px;
  justify-content: center;
  align-items: flex-end;
  align-self: center;
  margin-right: 3px;
`;
const OrderDetailHeader = styled.View`
    justify-content: center;
    align-items:center;
    padding:15px;
    flex: 1;
    margin:7px 5px;
    background:#fff;
    border-radius: 10px;
    position: relative;
    border: 1px solid #f7f7f7;
    shadow-color: #000,
    shadow-opacity: 0.25px;
    shadow-radius: 3.84px;
    elevation: 5px;
`;
const ItemWrapper = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  height: 105px;
  margin-top: 10px;
  margin-bottom: 10px;
  background: #f7f7f7;
  overflow: hidden;
`;
const ItemImage = styled.ImageBackground`
  width: 90px;
  height: 105px;
  resize-mode: cover;
`;
const ItemDescription = styled.View`
  flex: 1;
  padding: 10px;
  justify-content: center;
`;
const PriceWrapper = styled.View`
  flex: 1;
  padding: 5px 0px;
`;

const ShippingDetails = styled.View`
    flex: 1;
    width:97%;
    align-self:center;
    justify-content:center;
    align-item:center;
    margin:17px 5px;
    background:#fff;
    border-radius:5px;
    flex-direction: column;
    padding: 15px 10px;
    border-radius: 10px;
    position: relative;
    border: 1px solid #f7f7f7;
    shadow-color: #000,
    shadow-opacity: 0.25px;
    shadow-radius: 3.84px;
    elevation: 5px;
`;
const ShippingHeader = styled.View`
  justify-content: center;
  padding: 5px 4px;
`;
const ShippingWrapper = styled.View`
  flex: 1;
  justify-content: center;
  margin: 5px;
`;
const PriceQtyWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 5px;
`;

export default OrderDetailScreen;
