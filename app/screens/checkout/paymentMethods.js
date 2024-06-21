import React from 'react';
import { AText, AButton } from '../../theme-components';
import styled from 'styled-components/native';
import { RadioButton } from 'react-native-paper';
import PaypalImage from '../../assets/images/paypal.png';
import CreditCardImage from '../../assets/images/credit-card.png';
import CashondelieveryImage from '../../assets/images/cash-on-delievery.png';
import { formatCurrency } from '../../utils/helper';
import { useSelector } from 'react-redux';
import NavigationConstants from '../../navigation/NavigationConstants';
import PropTypes from 'prop-types';

const PaymentMethodScreen = ({ navigation, route }) => {
  const shippingValue = route.params.shippingValue;
  var cartAmount = route.params.cartAmount;
  var cartProducts = route.params.cartProducts;
  var couponCode = route.params.couponCode;
  const defaultaddress = route.params.shippingValue;
  console.log(defaultaddress, 'dd');
  const [paymentMethod, setPaymentMethod] = React.useState('cash');
  const { currencyOptions, currencySymbol } = useSelector(
    (state) => state.settings,
  );
  const { couponDiscount } = useSelector((state) => state.cart);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Payment Method',
      headerTransparent: false,
      headerTintColor: '#000',
      headerRight: () => (
        <AText bold pr="10px">
          {formatCurrency(
            cartAmount - couponDiscount,
            currencyOptions,
            currencySymbol,
          )}
        </AText>
      ),
    });
  }, [navigation]);

  const changeValue = (val) => {
    setPaymentMethod(val);
  };
  return (
    <>
      <MainWrapper>
        {paymentMethod === 'paypal' ? (
          <PaymentMethodImage source={PaypalImage} />
        ) : null}
        {paymentMethod === 'credit' ? (
          <PaymentMethodImage source={CreditCardImage} />
        ) : null}
        {paymentMethod === 'cash' ? (
          <PaymentMethodImage source={CashondelieveryImage} />
        ) : null}

        <RadioButton.Group
          onValueChange={(val) => changeValue(val)}
          value={paymentMethod}>
          <RadioButton.Item label="Credit" value="credit" />
          <RadioButton.Item label="Cash on Delievery" value="cash" />
          <RadioButton.Item label="Paypal" value="paypal" />
        </RadioButton.Group>
      </MainWrapper>
      <AButton
        disabled={paymentMethod === '' ? true : false}
        title="Next"
        block
        onPress={() =>
          navigation.navigate(NavigationConstants.CHECKOUT_SCREEN, {
            paymentMethod: paymentMethod,
            cartAmount: cartAmount,
            shippingValue: shippingValue,
            cartProducts: cartProducts,
            couponCode: couponCode,
          })
        }
      />
    </>
  );
};

PaymentMethodScreen.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

const MainWrapper = styled.View`
  flex: 1;
  padding: 20px;
`;
const PaymentMethodImage = styled.Image`
  height: 175px;
  width: 100%;
  margin-bottom: 25px;
`;

export default PaymentMethodScreen;
