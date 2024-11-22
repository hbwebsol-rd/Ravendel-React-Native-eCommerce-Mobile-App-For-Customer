import React from 'react';
import { AText, ARow } from '../../../theme-components';
import { FlatList, StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import URL from '../../../utils/baseurl';
import FastImage from 'react-native-fast-image';
import { isEmpty } from '../../../utils/helper';
import { ProductPriceText } from '../../components';
import { APP_PRIMARY_COLOR, APP_SECONDARY_COLOR } from '../../../utils/config';
import LinearGradient from 'react-native-linear-gradient';
import PropTypes from 'prop-types';

const HomeComponentShowViews = ({ dataItems, navigatetonext }) => {
  const CategoryShowView = React.memo(() => {
    return (
      <ARow wrap row>
        {!isEmpty(dataItems) && (
          <FlatList
            data={dataItems}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={ProductCard}
          />
        )}
      </ARow>
    );
  }, []);

  const ProductCard = ({ item }) => {
    return (
      <Card
        onPress={() => {
          navigatetonext(item);
        }}>
        <LinearGradient
          // colors={['#4c669f', '#3b5998', '#192f6a']}
          colors={['#088178', '#0cc9bb']}
          style={{
            flex: 1,
            width: '100%',
            height: 146,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}>
          <FastImage
            style={styles.productImage}
            source={{
              uri: !isEmpty(item.feature_image)
                ? URL + item.feature_image
                : 'https://www.hbwebsol.com/wp-content/uploads/2020/07/category_dummy.png',
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
        </LinearGradient>
        {/* <CardBody>
          <ProductPriceText fontsizesmall={true} Pricing={item.pricing} />

          <AText small bold color="#000">
            {item.name.length > 20
              ? item.name.substring(0, 20) + '...'
              : item.name}
          </AText>
        </CardBody> */}
      </Card>
    );
  };
  return (
    <>
      <CategoryShowView />
    </>
  );
};

HomeComponentShowViews.propTypes = {
  dataItems: PropTypes.array,
  navigatetonext: PropTypes.func,
};

const styles = StyleSheet.create({
  productImage: { width: 100, height: 100, resizeMode: 'contain' },
});
const Card = styled.TouchableOpacity`
    width:120px;
    margin:10px;
    background: #fff;
    padding: 0px;
    border-radius: 10px;
    shadow-color: #000;
    shadow-offset: {
        width: 0;
        height: 2;
    },
    shadow-opacity: 0.25px;
    shadow-radius: 3.84px;
    elevation: 5;
`;

export default HomeComponentShowViews;
