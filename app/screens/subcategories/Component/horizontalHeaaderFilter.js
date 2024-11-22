import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

import { AText } from '../../../theme-components';
import {
    APP_PRIMARY_COLOR,
    FontStyle,
} from '../../../utils/config';

import PropTypes from 'prop-types';

const HorizontalHeaderFilter = ({ data, selectedCat, onPress }) => {
    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollViewContent}
                scrollEnabled={true}
                keyboardShouldPersistTaps="always"
                horizontal={true}
                showsHorizontalScrollIndicator={false}>

                {data.map((item) => (
                    <TouchableOpacity
                        key={item.url}
                        onPress={() => onPress(item)}
                        style={[
                            styles.filterButton,
                            { backgroundColor: selectedCat === item.url ? APP_PRIMARY_COLOR : 'transparent' },
                        ]}>
                        <AText
                            color={item.url == selectedCat ? '#fff' : 'black'}
                            font={FontStyle.semiBold}
                            small>
                            {item.name}
                        </AText>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};


HorizontalHeaderFilter.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            url: PropTypes.string.isRequired,
        })
    ).isRequired,
    selectedCat: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
};

export default HorizontalHeaderFilter;
const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15,
    },
    scrollViewContent: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    filterButton: {
        borderRadius: 15,
        paddingHorizontal: 12,
        paddingVertical: 5,
        margin: 5,
    },
});