import React from 'react';
import { TextInput, StyleSheet, View } from 'react-native';
import { AText, AButton } from '../../../theme-components';
import { APP_PRIMARY_COLOR } from '../../../utils/config';

import Colors from '../../../constants/Colors';
import PropTypes from 'prop-types';

const CouponSection = ({ couponCode, setCouponCode, couponApplied, removeCoupon, ApplyCoupon }) => (
    <View style={{...styles.couponContainerStyle,paddingVertical:!couponApplied?0:10, }}>
        {!couponApplied?
        <TextInput
            type="text"
            style={styles.couponTextInputStyle}
            value={couponCode}
            onChangeText={(text) => setCouponCode(text)}
            placeholder="Enter coupon code"
        />
        :null}
        <View style={styles.couponBtn}>
            <AButton
                style={[styles.applyBtnStyle, { backgroundColor: APP_PRIMARY_COLOR }]}
                onPress={couponApplied ? removeCoupon : ApplyCoupon}
                title={couponApplied ? 'Applied' : 'Apply'}
                small
            />
        </View>
        {couponApplied && <AText style={styles.appliedTextStyle}>Coupon Applied successfully</AText>}
    </View>
);



const styles = StyleSheet.create({
    couponContainerStyle: {
        width: '90%',
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        paddingHorizontal: 15,
        borderColor: 'gray',
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
        padding: 5,
    },
    appliedTextStyle: {
        marginLeft: 10,
        color: Colors.green,
    },
});



CouponSection.propTypes = {
    couponCode: PropTypes.string.isRequired,
    setCouponCode: PropTypes.func.isRequired,
    couponApplied: PropTypes.bool.isRequired,
    removeCoupon: PropTypes.func.isRequired,
    ApplyCoupon: PropTypes.func.isRequired,
};


export default CouponSection;
