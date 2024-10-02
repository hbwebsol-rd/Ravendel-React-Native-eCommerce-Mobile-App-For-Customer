import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AText } from '../../theme-components';
import { formatCurrency } from '../../utils/helper';
import { useSelector } from 'react-redux';
import { FontStyle } from '../../utils/config';
import Colors from '../../constants/Colors';
import PropTypes from 'prop-types';

const CartPriceTags = ({ item, cartSummary, couponDiscount }) => {
    const { currencySymbol, currencyOptions } = useSelector((state) => state.settings);
    
    return (
        <>
            {(couponDiscount && item.value == 'couponDiscountTotal') || item.value !== 'couponDiscountTotal' ?
                < View style={item.value == 'grandTotal' ? styles.grandTotalsummaryStyle : styles.summary} >
                  
                    <AText fonts={FontStyle.semiBold}>{item.name}</AText>
                    <AText color={item.value == 'discountTotal'|| item.value == 'couponDiscountTotal' ? Colors.green : Colors.grayColor}>
                        {item.value == 'discountTotal' || item.value == 'couponDiscountTotal' ? '- ' : ''}
                        {cartSummary?.totalShipping === 0 && item.value == 'totalShipping'
                            ? 'FREE SHIPPING'
                            : formatCurrency(
                                cartSummary[item.value],
                                currencyOptions,
                                currencySymbol,
                            )}
                    </AText>
                </View >
                : null}
        </>
    )
};

CartPriceTags.propTypes = {
    cartSummary: PropTypes.object,
    couponDiscount: PropTypes.string,
    item: PropTypes.object,
};

const styles = StyleSheet.create({
    summary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    grandTotalsummaryStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 15,
        borderTopColor: '#DADADA',
        borderTopWidth: 1,
        marginBottom: 10,

    },
});
export default CartPriceTags;
