import React from 'react';
import {
    Image,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import { AText } from '../../../theme-components';
import { uriImage } from '../../../utils/helper';
import Colors from '../../../constants/Colors';


const MenuListing = ({ data, type, onPress, selectedItem }) => {
    const isMainCategory = type === 'mainCategory';
    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            style={isMainCategory ? styles.categoriesMainViewStyle : styles.subCategoriesMainViewStyle}>
            <View style={[styles.subCategoryView, { flexDirection: isMainCategory ? 'column' : 'row' }]}>
                {data.map((category) => {
                    if (!category.parentId) {
                        const isSelected = isMainCategory && selectedItem === category.id;
                        return (
                            <Pressable
                                activeOpacity={0.9}
                                style={[
                                    styles.CategoriesListingWrapper,
                                    !isMainCategory && { width: '40%' },
                                    isSelected && styles.selectedCategory
                                ]}
                                onPress={() => onPress(category)}>
                                <Image
                                    style={[isMainCategory ? styles.mainCategoryImageStyle : styles.subCategoryImageStyle]}
                                    source={{ uri: uriImage(!isMainCategory? category.thumbnail_image: category.image) }}
                                />
                                <AText xtrasmall={isMainCategory} small={!isMainCategory} style={styles.catNameStyle} >
                                    {category.name}
                                </AText>
                            </Pressable>
                        );
                    }
                })}
            </View>
        </ScrollView>
    );

};

export default MenuListing;
const styles = StyleSheet.create({
    CategoriesListingWrapper: {
        marginVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        alignSelf: 'center',
    },
    subCategoriesMainViewStyle: {
        width: '60%',
        flexDirection: 'column',
        backgroundColor: Colors.whiteColor,
        marginTop: 10,
    },
    subCategoryView: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    selectedCategory: { backgroundColor: '#fff', width: '100%' },
    categoriesMainViewStyle: {
        width: '10%',
        flexDirection: 'column',
        elevation: 5,
        shadowColor: '#000',
        marginTop: Platform.OS ? 7 : 10,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        backgroundColor: '#f1f1f1',
    },
    catNameStyle: {
        textTransform: 'uppercase',
        paddingTop: 5,
        color: '#000',
        textAlign: 'center'
    },
    mainCategoryImageStyle: {
        height: 40,
        width: 45,
        borderRadius: 5,
        resizeMode: 'contain',
    },
    subCategoryImageStyle: {
        height: 70,
        width: 75,
        resizeMode: 'contain'
    },
});
