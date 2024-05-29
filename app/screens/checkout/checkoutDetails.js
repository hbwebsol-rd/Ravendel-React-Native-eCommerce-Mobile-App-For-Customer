import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { AButton, AText, BackHeader } from '../../theme-components';
import { FontStyle, GREYTEXT } from '../../utils/config';
import Colors from '../../constants/Colors';
import moment from 'moment';
import NavigationConstants from '../../navigation/NavigationConstants';
import { Divider } from 'react-native-paper';
import PropTypes from 'prop-types';

export default function CheckoutDetails({ navigation, route }) {
  const checoutDetailsData = route.params.checoutDetailsData;

  const OrderData = ({ title, value, color }) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 5,
        }}>
        <AText color={color ?? Colors.blackColor} fonts={FontStyle.semiBold}>
          {title}
        </AText>
        <AText>{value}</AText>
      </View>
    );
  };
  console.log(checoutDetailsData, ' checoutDetailsData');
  return (
    <View style={styles.container}>
      <BackHeader navigation={navigation} name="Order Status" />
      <View style={{ marginHorizontal: 35, marginTop: 30 }}>
        <AText big1 fonts={FontStyle.semiBold}>
          Your order has been received
        </AText>
        <AText large mt={'20px'} mb={'10px'} fonts={FontStyle.semiBold}>
          Order Information
        </AText>
        <OrderData title={'Order Number'} value={'055455'} />
        <OrderData title={'Date'} value={moment().format('D-M-Y')} />
        <OrderData title={'Subtotal'} value={checoutDetailsData.cartTotal} />
        <OrderData
          title={'Grand Total'}
          value={checoutDetailsData.grandTotal}
        />
        <OrderData
          title={'Payment Method'}
          value={checoutDetailsData.billing.paymentMethod}
        />
        <AText large mt={'40px'} mb={'10px'} fonts={FontStyle.semiBold}>
          Billing Address
        </AText>
        <View style={styles.addresscard}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <AText mr="8px" color="black" fonts={FontStyle.semiBold} large>
              {checoutDetailsData.billing.firstname}
            </AText>
            <AText fonts={FontStyle.semiBold} color={Colors.blackColor}>
              {checoutDetailsData.billing.phone}
            </AText>
          </View>
          <AText color={GREYTEXT}>
            {checoutDetailsData.billing.address},{' '}
            {checoutDetailsData.billing.city}
          </AText>
          <AText mb="10px" color={GREYTEXT}>
            {checoutDetailsData.billing.state},{' '}
            {checoutDetailsData.billing.pincode}
          </AText>
        </View>
        <AText large mt={'20px'} mb={'10px'} fonts={FontStyle.semiBold}>
          Shipping Address
        </AText>
        <View style={styles.addresscard}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <AText mr="8px" color="black" fonts={FontStyle.semiBold} large>
              {checoutDetailsData.shipping.firstname}
            </AText>
            <AText fonts={FontStyle.semiBold} color={Colors.blackColor}>
              {checoutDetailsData.shipping.phone}
            </AText>
          </View>
          <AText color={GREYTEXT}>
            {checoutDetailsData.shipping.address},{' '}
            {checoutDetailsData.shipping.city}
          </AText>
          <AText mb="10px" color={GREYTEXT}>
            {checoutDetailsData.shipping.state},{' '}
            {checoutDetailsData.shipping.pincode}
          </AText>
        </View>
        <AText large mt={'20px'} mb={'10px'} fonts={FontStyle.semiBold}>
          Order Details
        </AText>
        <OrderData title={'Order Total'} value={checoutDetailsData.cartTotal} />
        <OrderData title={'Tax'} value={'$0.00'} />
        <OrderData title={'Shipping'} value={'Free Shipping'} />
        <OrderData color={Colors.green} title={'Coupon'} value={'-$400'} />
        <Divider style={styles.divider} />
        <OrderData title={'Total'} value={checoutDetailsData.grandTotal} />
      </View>
      <View
        style={{
          alignSelf: 'center',
          width: '60%',
          position: 'absolute',
          bottom: 20,
          zIndex: 5,
        }}>
        <AButton
          title="Countinue Shopping"
          round
          onPress={() => {
            navigation.reset({
              index: 0,
              routes: [{ name: NavigationConstants.HOME_SCREEN }],
            });
          }}
        />
      </View>
    </View>
  );
}

CheckoutDetails.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
    backgroundColor: Colors.whiteColor,
  },
  divider: {
    height: 1,
    marginTop: 8,
    backgroundColor: Colors.blackColor,
  },
});
