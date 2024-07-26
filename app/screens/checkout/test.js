import React, { useEffect, useState } from 'react';
import {
    TextInput,
    StyleSheet,
    View,
    TouchableOpacity,
    ScrollView,
    Image,
} from 'react-native';
import {
    AText,
    AButton,
    BackHeader,
    AppLoader,
    MainLayout,
} from '../../theme-components';
import { formatCurrency, isEmpty } from '../../utils/helper';
import { useDispatch, useSelector } from 'react-redux';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { APP_PRIMARY_COLOR, APP_SECONDARY_COLOR, FontStyle } from '../../utils/config';
import { applyCouponAction, checkStorageAction } from '../../store/action';
import Colors from '../../constants/Colors';
import PropTypes from 'prop-types';
import { checkoutDetailsAction, getShippingMethods } from '../../store/action/checkoutAction';
import paypal from '../../assets/images/paypal.png';
import razorpay from '../../assets/images/razorpay.png';
import stripe from '../../assets/images/stripe.png';
import cash_on_delivery from '../../assets/images/cash_on_delivery.png';
import bank_transfer from '../../assets/images/bank_transfer.png';
import { COUPON_REMOVED } from '../../store/action/cartAction';
import CartProductDisplayCard from '../../theme-components/cartProductDisplayCard';
import CartPriceTags from '../components/cartPriceTags';

const ShippingMethodScreen = ({ navigation }) => {
    const dispatch = useDispatch();

    const { userDetails } = useSelector((state) => state.customer);
    const cartItems = useSelector((state) => state.cart.products);
    const { shippingMethodList, loading } = useSelector((state) => state.checkoutDetail);
    const { paymentSetting } = useSelector((state) => state.settings);
    const [paymentMethod, setPaymentMethod] = useState('CASH_ON_DELIVERY');
    const [couponCode, setCouponCode] = useState('');
    const [couponApplied, setCouponApplied] = useState(false);
    const [shippingMethod, setShippingMethod] = useState('');

    const { cartSummary, couponDiscount, cartId, shippingAddress, billingAddress } = useSelector((state) => state.cart);
    const { currencySymbol } = useSelector((state) => state.settings);
    const { email: userEmail, _id } = userDetails;

    const mrpArray = [
        { id: 1, name: 'Total MRP', value: 'mrpTotal' },
        { id: 2, name: 'Discount On MRP', value: 'discountTotal' },
        { id: 3, name: 'Discount By Coupon', value: 'couponDiscount' },
        { id: 4, name: 'Shipping Fee', value: 'totalShipping' },
        { id: 5, name: 'Total Amount', value: 'grandTotal' },
    ];

    useEffect(() => {
        dispatch(getShippingMethods());
    }, [dispatch]);

    const removeCoupon = () => {
        dispatch({ type: COUPON_REMOVED });
        setCouponApplied(false);
        setCouponCode('');
        dispatch(checkStorageAction(userDetails._id));
    };

    const ApplyCoupon = () => {
        if (isEmpty(couponCode)) {
            alert('Coupon code is required');
            return;
        }
        const cartPro = cartItems.map((cart) => ({
            productId: cart.productId,
            qty: cart.qty,
        }));
        const payload = {
            couponCode,
            cartItems: cartPro,
            userId: userDetails._id,
        };
        dispatch(applyCouponAction(payload, setCouponApplied));
    };

    const checkoutDetails = () => {
        if (isEmpty(shippingMethod)) {
            alert('Please select a shipping method');
            return;
        }
        const payload = {
            userId: _id,
            billing: {
                lastname: billingAddress.lastName,
                firstname: billingAddress.firstName,
                address: billingAddress.addressLine1,
                city: billingAddress.city,
                zip: billingAddress.pincode,
                country: billingAddress.country,
                state: billingAddress.state,
                email: userEmail,
                phone: billingAddress.phone || '1234',
                paymentMethod: paymentMethod.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '').toLowerCase(),
            },
            shipping: {
                firstname: shippingAddress.firstName,
                lastname: shippingAddress.lastName,
                address: shippingAddress.addressLine1,
                city: shippingAddress.city,
                zip: shippingAddress.pincode,
                country: shippingAddress.country,
                state: shippingAddress.state,
                email: userEmail,
                phone: shippingAddress.phone || '1234',
                notes: '',
            },
        };
        const navParams = {
            cartProducts: cartItems,
            shippingMethod,
            paymentMethod,
        };
        if (paymentMethod.toLowerCase() !== 'paypal') {
            dispatch(checkoutDetailsAction(payload, cartId, navigation, navParams, paymentSetting, cartSummary?.grandTotal));
        } else {
            navigation.navigate('PaypalPayment', { orderData: payload });
        }
    };

    const paymentMethods = {
        paypal,
        razorpay,
        stripe,
        bank_transfer,
        cash_on_delivery,
    };

    if (loading) {
        return <AppLoader />;
    }

    return (
        <MainLayout hideScroll={true} style={styles.container}>
            <BackHeader navigation={navigation} name="Checkout" />

            <ScrollView
                contentContainerStyle={styles.scrollContentContainerStyle}
                style={styles.scrollStyle}
            >
                <CouponSection
                    couponCode={couponCode}
                    setCouponCode={setCouponCode}
                    couponApplied={couponApplied}
                    removeCoupon={removeCoupon}
                    ApplyCoupon={ApplyCoupon}
                />
                <ShippingMethodSection
                    shippingMethodList={shippingMethodList}
                    shippingMethod={shippingMethod}
                    setShippingMethod={setShippingMethod}
                />
                <PaymentMethodSection
                    paymentSetting={paymentSetting}
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                />
                <OrderSummarySection
                    navigation={navigation}
                    cartItems={cartItems}
                    mrpArray={mrpArray}
                    cartSummary={cartSummary}
                    couponDiscount={couponDiscount}
                />
            </ScrollView>

            <AButton
                disabled={paymentMethod === ''}
                title="PLACE ORDER"
                style={styles.placeOrderBtn}
                onPress={checkoutDetails}
            />
        </MainLayout>
    );
};

const CouponSection = ({ couponCode, setCouponCode, couponApplied, removeCoupon, ApplyCoupon }) => (
    <View style={styles.couponContainerStyle}>
        <TextInput
            type="text"
            style={styles.couponTextInputStyle}
            value={couponCode}
            onChangeText={(text) => setCouponCode(text)}
            placeholder="Enter coupon code"
        />
        <View style={styles.couponBtn}>
            <AButton
                style={styles.applyBtnStyle}
                onPress={couponApplied ? removeCoupon : ApplyCoupon}
                title={couponApplied ? 'Applied' : 'Apply'}
                small
            />
        </View>
        {couponApplied && <AText style={styles.appliedTextStyle}>Coupon Applied successfully</AText>}
    </View>
);

const ShippingMethodSection = ({ shippingMethodList, shippingMethod, setShippingMethod }) => (
    <View style={styles.containerStyles}>
        <AText style={styles.headerTextStyle} large>
            Shipping Method
        </AText>
        {!isEmpty(shippingMethodList) &&
            shippingMethodList.map((item) => (
                <TouchableOpacity
                    key={item._id}
                    onPress={() => setShippingMethod(item)}
                    style={[
                        styles.addressCard,
                        shippingMethod._id === item._id && { backgroundColor: APP_SECONDARY_COLOR },
                    ]}
                >
                    <View style={{ flexDirection: 'row' }}>
                        <MIcon
                            name={shippingMethod.name === item.name ? 'radiobox-marked' : 'radiobox-blank'}
                            size={18}
                            color={APP_PRIMARY_COLOR}
                        />
                        <AText style={styles.textStyle} small>
                            {item.name}
                        </AText>
                    </View>
                    <AText style={styles.textStyle} medium>
                        {item.amount}
                    </AText>
                </TouchableOpacity>
            ))}
    </View>
);

const PaymentMethodSection = ({ paymentSetting, paymentMethod, setPaymentMethod }) => (
    <View style={styles.containerStyles}>
        <AText style={styles.headerTextStyle} large>
            Payment Method
        </AText>
        {paymentSetting?.map((item) => (
            <TouchableOpacity
                key={item}
                onPress={() => setPaymentMethod(item)}
                style={[
                    styles.addressCard,
                    paymentMethod === item && { backgroundColor: APP_SECONDARY_COLOR },
                ]}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <MIcon
                        name={paymentMethod === item ? 'radiobox-marked' : 'radiobox-blank'}
                        size={18}
                        color={APP_PRIMARY_COLOR}
                    />
                    <AText style={styles.textStyle} small>
                        {item.replace('_', ' ')}
                    </AText>
                </View>
                <Image source={paymentMethods[item.toLowerCase()]} style={{ width: 25, height: 25 }} />
            </TouchableOpacity>
        ))}
    </View>
);

const OrderSummarySection = ({ navigation, cartItems, mrpArray, cartSummary, couponDiscount }) => (
    <>
        <CartProductDisplayCard data={cartItems} />
        <CartPriceTags
            isSelectedCoupon={!!couponDiscount}
            data={mrpArray}
            dataObj={cartSummary}
            currency={currencySymbol}
        />
    </>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContentContainerStyle: {
        paddingBottom: 70,
    },
    scrollStyle: {
        marginTop: 10,
    },
    couponContainerStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: 4,
        padding: 10,
        marginHorizontal: 15,
    },
    couponTextInputStyle: {
        flex: 1,
        backgroundColor: Colors.lightGray,
        paddingHorizontal: 10,
        borderRadius: 4,
        marginRight: 10,
    },
    couponBtn: {
        flexDirection: 'row',
    },
    applyBtnStyle: {
        backgroundColor: APP_PRIMARY_COLOR,
        padding: 5,
    },
    appliedTextStyle: {
        marginLeft: 10,
        color: Colors.green,
    },
    containerStyles: {
        marginHorizontal: 15,
        marginVertical: 10,
    },
    addressCard: {
        padding: 10,
        borderRadius: 4,
        backgroundColor: Colors.white,
        marginVertical: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textStyle: {
        marginLeft: 8,
        color: '#000',
        fontFamily: FontStyle.semiBold
    },
    headerTextStyle: {
        fontSize: 18,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    placeOrderBtn: {
        position: 'absolute',
        bottom: 10,
        left: 15,
        right: 15,
    },
});

ShippingMethodScreen.propTypes = {
    navigation: PropTypes.object.isRequired,
};

CouponSection.propTypes = {
    couponCode: PropTypes.string.isRequired,
    setCouponCode: PropTypes.func.isRequired,
    couponApplied: PropTypes.bool.isRequired,
    removeCoupon: PropTypes.func.isRequired,
    ApplyCoupon: PropTypes.func.isRequired,
};

ShippingMethodSection.propTypes = {
    shippingMethodList: PropTypes.array.isRequired,
    shippingMethod: PropTypes.object.isRequired,
    setShippingMethod: PropTypes.func.isRequired,
};

PaymentMethodSection.propTypes = {
    paymentSetting: PropTypes.array.isRequired,
    paymentMethod: PropTypes.string.isRequired,
    setPaymentMethod: PropTypes.func.isRequired,
};

OrderSummarySection.propTypes = {
    navigation: PropTypes.object.isRequired,
    cartItems: PropTypes.array.isRequired,
    mrpArray: PropTypes.array.isRequired,
    cartSummary: PropTypes.object.isRequired,
    couponDiscount: PropTypes.number.isRequired,
};

export default ShippingMethodScreen;
