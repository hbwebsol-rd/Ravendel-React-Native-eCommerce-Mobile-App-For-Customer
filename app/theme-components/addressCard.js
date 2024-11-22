import React from 'react';
import { AText } from './';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import { APP_PRIMARY_COLOR, APP_SECONDARY_COLOR, FontStyle, GREYTEXT } from '../utils/config';
import Colors from '../constants/Colors';
import PropTypes from 'prop-types';

const AddressCard = ({ addressDefault, item, setAddressDefault, editForm, editDefaultAdress }) => {
    const isDefault = addressDefault === item._id;
    const addressTypeIcon = item.addressType === 'Home' ? 'home-outline' : 'briefcase-outline';

    return (
        <View
            style={[
                styles.addressCard,
                isDefault && { backgroundColor: APP_SECONDARY_COLOR, borderColor: APP_PRIMARY_COLOR }
            ]}
        >
            {editDefaultAdress &&
                <TouchableOpacity onPress={() => setAddressDefault(item._id)}>
                    <MIcon
                        name={isDefault ? 'radiobox-marked' : 'radiobox-blank'}
                        size={18}
                        color={APP_PRIMARY_COLOR}
                    />
                </TouchableOpacity>
            }
            <View style={styles.addressInfo}>
                <View style={styles.row}>
                    <MIcon name={addressTypeIcon} size={22} color={APP_PRIMARY_COLOR} />
                    <AText style={styles.addTypeTextStyle} medium>
                        {item.addressType}
                    </AText>
                </View>
                <View style={styles.nameHeader}>
                    <AText color={GREYTEXT} fonts={FontStyle.semiBold}>
                        {item.firstName} {item.lastName}
                    </AText>
                    <AText color={GREYTEXT} fonts={FontStyle.semiBold}>
                        {item.phone}
                    </AText>
                </View>
                <AText color={GREYTEXT}>
                    {item.addressLine1}, {item.addressLine2}, {item.city} {item.state}, {item.pincode}
                </AText>
            </View>
            <TouchableOpacity style={styles.editButton} onPress={editForm}>
                <MIcon name="pencil-outline" size={15} color={APP_PRIMARY_COLOR} />
            </TouchableOpacity>
        </View>
    );
};

AddressCard.propTypes = {
    addressDefault: PropTypes.string,
    item: PropTypes.object.isRequired,
    setAddressDefault: PropTypes.func.isRequired,
    editForm: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
    addressCard: {
        paddingHorizontal: 20,
        paddingVertical: 9,
        marginVertical: 10,
        backgroundColor: Colors.whiteColor,
        borderRadius: 8,
        elevation: 3,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        borderWidth: 1,
        borderColor: '#c8c8c8',
    },
    addTypeTextStyle: {
        marginLeft: 5,
        color: Colors.blackColor,
        fontFamily: FontStyle.semiBold
    },
    addressInfo: {
        marginStart: 15,
        width: '85%',
    },
    row: {
        flexDirection: 'row',
    },
    nameHeader: {
        flexDirection: 'row',
        width: '80%',
        justifyContent: 'space-between',
        marginVertical: 5,
    },
    editButton: {
        width: 25,
        height: 25,
    },
});

export default AddressCard;
