import React from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { AText, ProductCard, } from '../../../theme-components';
import { APP_PRIMARY_COLOR, windowWidth, } from '../../../utils/config';
import Colors from '../../../constants/Colors';

import NavigationConstants from '../../../navigation/NavigationConstants';
import PropTypes from 'prop-types';
import { isEmpty } from '../../../utils/helper';


const ProductList = ({ categorydata, handleLoadMore, navigation, currentPage, totalPage, loader }) => {


    const ListFooterComponent = React.memo(({ currentPage, totalPage, loader, handleLoadMore }) => (
        currentPage < totalPage && (
            <TouchableOpacity onPress={handleLoadMore} style={styles.footerButton}>
                {loader ? (
                    <ActivityIndicator />
                ) : (
                    <AText color={Colors.blue}>Load More</AText>
                )}
            </TouchableOpacity>
        )
    ));
    function renderItem({ item }) {
        return (
            <ProductCard
                category={item}
                displayImage={item.feature_image}
                fontsizesmall={true}
                showRating={true}
                showItemLeft={true}
                productWidth={windowWidth * 0.48}
                navigateNextScreen={() => {
                    navigation.navigate(NavigationConstants.SINGLE_PRODUCT_SCREEN, {
                        productID: item._id,
                        productUrl: item.url,
                    });
                }}
            />
        );
    }

    const ListEmptyComponent = React.memo(() => (
        <View style={styles.emptyComponent}>
            <AText style={styles.emptyText}>No Products Found</AText>
        </View>
    ));

    return (

        <FlatList
            showsVerticalScrollIndicator={false}
            numColumns={2}
            data={categorydata}
            snapToAlignment="center"
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            contentContainerStyle={styles.flatListContainerStyle}
            ListEmptyComponent={ListEmptyComponent}
            ListFooterComponent={
                !isEmpty(categorydata) ?
                    <ListFooterComponent
                        currentPage={currentPage}
                        totalPage={totalPage}
                        loader={loader}
                        handleLoadMore={() => handleLoadMore()}
                    />
                    : null
            }
        />


    );
};

ProductList.propTypes = {
    navigation: PropTypes.object,
};

const styles = StyleSheet.create({
    // flatListContainerStyle: {
    //     paddingBottom: 20,
    // },
    emptyComponent: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },
    emptyText: {
        fontSize: 16,
        color: 'grey',
    },
    footerButton: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 10,
    },
    searchFilterView: {
        width: '95%',
        marginTop: 10,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        paddingHorizontal: 7
    },
    searchTextInputStyle: {
        height: 40,
        borderColor: '#E0E0E0',
        padding: 0,
        paddingLeft: 35,
        borderRadius: 30,
        backgroundColor: '#EFF0F0'
    },
    searchInputViewStyle: {
        flexDirection: 'row-reverse',
        width: '95%',
        alignSelf: 'center',
        justifyContent: 'center',
    },
    header: {
        flexDirection: 'row',
        width: '90%',
        alignSelf: 'center',
        justifyContent: 'flex-start',
        alignItems: 'center',
        left: 0,
        right: 0,
        marginTop: 10,
    },
    flatListContainerStyle: {
        marginTop: 10,
        flexDirection: 'column',
        margin: 'auto',
        marginHorizontal: 7,
        paddingBottom: 20,
    },
    filterBtnstyle: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: APP_PRIMARY_COLOR,
        borderRadius: 70,
        height: 40,
        width: 40,
        justifyContent: 'center',
    },

});

export default ProductList;
