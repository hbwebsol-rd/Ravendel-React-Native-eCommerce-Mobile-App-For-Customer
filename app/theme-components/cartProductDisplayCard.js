import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AIcon from 'react-native-vector-icons/AntDesign';

import { AText } from '.';
import { uriImage } from '../utils/helper';

import { ProductPriceText } from '../screens/components';
import { FontStyle } from '../utils/config';
import Colors from '../constants/Colors';
import NavigationConstants from '../navigation/NavigationConstants';


const CartProductDisplayCard = ({
    navigation,
    cartProducts,
    removeCartItem,
    decreaseItemQty,
    increaseItemQty,
    ShowIncrementDecreement,
    navigateProduct
}) => {
    return (
        <>
            {cartProducts.map((product, index) => (
                <TouchableOpacity
                    style={styles.productitem}
                    key={index}
                    onPress={() => {
                        navigateProduct ?
                            navigation.navigate(
                                NavigationConstants.SINGLE_PRODUCT_SCREEN,
                                {
                                    productID: product.productId,
                                    productUrl: product.url,
                                },
                            ) : null
                    }}>
                    <ItemImage
                        style={styles.imageStyle}
                        source={{
                            uri: uriImage(product.productImage)
                        }}
                    />
                    <ItemDescription>
                        <View style={styles.contentContainerStyle}>
                            <AText
                                numberOfLines={2}
                                fonts={FontStyle.semiBold}
                                medium>
                                {product.productTitle}
                            </AText>
                            <View style={styles.contentCardStyle}>
                                <ProductPriceText
                                    fontsizesmall={true}
                                    fontColor={Colors.blackColor}
                                    Pricing={{
                                        sellprice: product.productPrice,
                                        price: product.mrp,
                                    }}
                                />
                                {ShowIncrementDecreement ?
                                    <QtyWrapper>
                                        <QtyButton
                                            onPress={() => {
                                                product.qty === 1
                                                    ? removeCartItem(product)
                                                    : decreaseItemQty(product);
                                            }}>
                                            <AIcon color={'#72787e'} name="minussquare" size={25} />
                                        </QtyButton>
                                        <AText style={styles.qtyTextStyle} medium>
                                            {product.qty}
                                        </AText>
                                        <QtyButton onPress={() => increaseItemQty(product)}>
                                            <AIcon color={'#72787e'} name="plussquare" size={25} />
                                        </QtyButton>
                                    </QtyWrapper>
                                    :
                                    <View style={styles.qtyContainerStyle}>
                                        <AText style={styles.qtyTextStyle} small>
                                            Qty: {product.qty}
                                        </AText>
                                    </View>
                                }
                            </View>
                        </View>
                    </ItemDescription>
                    {ShowIncrementDecreement &&
                        <RemoveItem
                            style={{ zIndex: 10 }}
                            onPress={() => removeCartItem(product)}>
                            <Icon color={'red'} name="close" size={12} />
                        </RemoveItem>
                    }
                </TouchableOpacity>
            ))}
        </>

    );
};


const RemoveItem = styled.TouchableOpacity`
  padding: 4px;
  background: white;
  width: 25px;
  height: 25px;
  border-radius: 20px;
  justify-content: center;
  align-items: center;
  margin-right: 3px;
  position: absolute;
  right: 0;
`;
const ItemImage = styled.ImageBackground`
  width: 90px;
  height: 105px;
  resize-mode: cover;
`;
const ItemDescription = styled.View`
  flex: 1;
  padding: 10px;
  flex-direction: row;
  justify-content: space-between;
`;
const QtyWrapper = styled.View`
  height: 40px;
  overflown: hidden;
  background: white;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  margin-right: 5px;
`;
const QtyButton = styled.TouchableOpacity`
  background: white;
  height: 100%;
  border-radius: 5px;
  justify-content: center;
  align-items: center;
`;

const styles = StyleSheet.create({
    contentContainerStyle: {
        width: '97%',
        alignSelf: 'flex-start'
    },
    contentCardStyle: {
        width: '85%',
        marginTop: 7,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    imageStyle: { width: 90, height: 90 },
    productitem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 105,
        marginTop: 20,
        borderRadius: 10,
        backgroundColor: '#fff',
        overflow: 'hidden',
        position: 'relative',
        borderWidth: 1,
        borderColor: '#D4D4D4',
        marginHorizontal: 2,
        paddingHorizontal: 7,
        paddingVertical: 5,
    },
    qtyContainerStyle: {
        overflow: 'hidden',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E9E9E9',
        borderRadius: 7,
        padding: 5,
    },
    qtyTextStyle: { textAlign: 'center', marginLeft: 5, marginRight: 5 },
});
export default CartProductDisplayCard;
