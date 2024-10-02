import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
} from 'react-native';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AText } from '../../../theme-components';
import { isEmpty } from '../../../utils/helper';
import { APP_PRIMARY_COLOR, APP_SECONDARY_COLOR, FontStyle } from '../../../utils/config';
import PropTypes from 'prop-types';
import paypal from '../../../assets/images/paypal.png';
import razorpay from '../../../assets/images/razorpay.png';
import stripe from '../../../assets/images/stripe.png';
import cash_on_delivery from '../../../assets/images/cash_on_delivery.png';
import bank_transfer from '../../../assets/images/bank_transfer.png';
import { Image } from 'react-native';

const paymentMethods = {
    paypal,
    razorpay,
    stripe,
    bank_transfer,
    cash_on_delivery // Default method if not matched
};
const ShippingOrPaymentSection = ({ title, data, selected, setSelected }) => (

    <View style={styles.containerStyles} >
        <AText style={styles.headerTextStyle} large>
            {title}
        </AText>
        {
            !isEmpty(data) &&
            data.map((item) => (
                <TouchableOpacity
                    key={item._id}
                    onPress={() => setSelected(item)}
                    style={[
                        styles.addressCard,
                        (item._id && selected._id === item._id) || selected == item.__typename ? { backgroundColor: APP_SECONDARY_COLOR } : {},
                    ]}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <MIcon
                            name={(item._id && selected._id === item._id) || selected == item.__typename ? 'radiobox-marked' : 'radiobox-blank'}
                            size={18}
                            color={APP_PRIMARY_COLOR}
                        />
                        <View style={{ width: '80%', justifyContent: 'center' }}>
                            <AText style={styles.textStyle} medium>
                                {item.title ?? item.name}
                            </AText>
                            {item.description && (
                                <AText style={styles.despTextStyle} small>
                                    {item.description}
                                </AText>
                            )}
                        </View>
                    </View>
                    {
                        item.amount ?
                            <AText style={styles.textStyle} medium>
                                {item.amount}
                            </AText>
                            :
                            item.__typename ?
                                <Image
                                    style={[
                                        styles.imagePaymentStyle,
                                        item.__typename.toLowerCase() == 'bank_transfer'
                                            ? { width: 65, height: 55 }
                                            : {},
                                    ]}
                                    source={paymentMethods[item.__typename.toLowerCase()] || paymentMethods.cash_on_delivery}
                                /> : null
                    }
                </TouchableOpacity>
            ))
        }
    </View >
);



const styles = StyleSheet.create({
    imagePaymentStyle: {
        resizeMode: 'contain',
        width: 75,
        height: 45,
        position: 'absolute',
        right: 5,
    },
    despTextStyle: {
        marginLeft: 8,
        fontFamily: FontStyle.semiBold
    },
    containerStyles: {
        // marginHorizontal: 15,
        marginVertical: 10,
        marginTop:15
    },
    addressCard: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        // marginVertical: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#D4D4D4',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical:4
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
});



ShippingOrPaymentSection.propTypes = {
    data: PropTypes.array.isRequired,
    selected: PropTypes.object.isRequired,
    setSelected: PropTypes.func.isRequired,
};

export default ShippingOrPaymentSection;
