import React, { useState, useMemo, useEffect } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Text,
  View,
  Dimensions,
  StyleSheet,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import ImageView from 'react-native-image-viewing';
import { BASEURL } from '../../utils/config';
import { isEmpty } from '../../utils/helper';

const { width } = Dimensions.get('window');

const GalleryImagesSlider = ({ ProductDetails }) => {
  const [preview, setPreview] = useState(false);
  const [active, setActive] = useState(0);
  const [sliderImages, setSliderImages] = useState([]);

  useEffect(() => {
    var allimages = [];
    if (!isEmpty(ProductDetails) && !isEmpty(ProductDetails.feature_image)) {
      allimages.push(ProductDetails.feature_image);
    }
    if (!isEmpty(ProductDetails) && !isEmpty(ProductDetails.gallery_image)) {
      ProductDetails.gallery_image.map((img) => {
        allimages.push(img);
      });
    }
    setSliderImages(allimages);
  }, [ProductDetails]);

  const previewImages = useMemo(() =>
    sliderImages.map(img => ({ uri: BASEURL + img })), [sliderImages]);

  const changeSlide = ({ nativeEvent }) => {
    const slide = Math.ceil(
      nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width,
    );
    if (slide !== active) {
      setActive(slide);
    }
  };


  return (
    <>
      <View style={styles.container}>
        <ScrollView
          pagingEnabled
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.scroll}
          onScroll={changeSlide}>
          {sliderImages.length > 0 ? (
            sliderImages.map((image, index) => (
              <TouchableOpacity key={index} onPress={() => setPreview(true)}>
                <FastImage
                  style={styles.slideImage}
                  source={{
                    uri: BASEURL + image,
                    priority: FastImage.priority.normal,
                  }}
                  resizeMode={FastImage.resizeMode.cover}
                />
              </TouchableOpacity>
            ))
          ) : (
            <Text>Nothing</Text>
          )}
        </ScrollView>
      </View>
      <ImageView
        images={previewImages}
        imageIndex={active}
        visible={preview}
        onRequestClose={() => setPreview(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: { height: '100%' },
  scroll: { width, height: '100%' },
  slideImage: { width, height: '100%' },
  dot: { color: '#888', margin: 3, fontSize: 10 },
  activeDot: { color: '#EB3349', margin: 3, fontSize: 10 },
});

export default GalleryImagesSlider;
