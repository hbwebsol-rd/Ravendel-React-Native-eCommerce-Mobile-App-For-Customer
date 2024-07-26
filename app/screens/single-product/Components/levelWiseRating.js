import React from 'react';
import { View, StyleSheet } from 'react-native';
import StarRating from 'react-native-star-rating';
import { AText } from '../../../theme-components';
import { isEmpty } from '../../../utils/helper';
import { FontStyle } from '../../../utils/config';

const LevelWiseRating = ({ levelWiseRating, rating, ratingCount }) => {
  const ratingPercentage = (ratingNo) =>
    !isEmpty(ratingCount) && Math.round((ratingNo / ratingCount) * 100);

  const RatingContainer = ({ star, color, percentage }) => (
    <View style={styles.levelWiseRatingContainerStyle}>
      <View style={[styles.levelWiseStarstyle, { borderWidth: 0 }]}>
        <AText medium color={'#72787e'} fonts={FontStyle.semiBold}>
          {star}
        </AText>
        <StarRating
          disabled={true}
          maxStars={1}
          rating={1}
          fullStarColor={'#636363'}
          starSize={14}
        />
      </View>
      <View style={styles.progressbarContainerStyle}>
        <View
          style={{
            ...styles.filledProgressbarStyle,
            backgroundColor: color,
            width: !isEmpty(percentage) ? percentage : '0%',
          }}
        />
      </View>
    </View>
  );
  return (
    <View style={styles.ratingContainerView}>
      <View style={styles.ratingView}>
        <AText style={styles.textStyle} title>
          {rating}
        </AText>
        <StarRating
          disabled={true}
          maxStars={1}
          rating={1}
          fullStarColor={'#000'} // Replace with your primary color
          starSize={22}
        />
      </View>
      <View style={styles.divider} />
      <View style={{ width: '60%' }}>
        <RatingContainer
          star={5}
          color={'#1FAD08'}
          percentage={ratingPercentage(levelWiseRating.fiveStar)}
        />
        <RatingContainer
          star={4}
          color={'#AEBD53'}
          percentage={ratingPercentage(levelWiseRating.fourStar)}
        />
        <RatingContainer
          star={3}
          color={'#ECC915'}
          percentage={ratingPercentage(levelWiseRating.threeStar)}
        />
        <RatingContainer
          star={2}
          color={'#E8641A'}
          percentage={ratingPercentage(levelWiseRating.twoStar)}
        />
        <RatingContainer
          star={1}
          color={'#FF2A2A'}
          percentage={ratingPercentage(levelWiseRating.oneStar)}
        />
      </View>
    </View>
  );
};
export default LevelWiseRating;

const styles = StyleSheet.create({
  ratingContainerView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-evenly',
  },
  textStyle: {
    marginRight: 7,
    color: '#72787e',
    fontFamily: FontStyle.semiBold
  },
  ratingView: {
    width: '30%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: '90%',
    width: 2,
    backgroundColor: '#E9E9E9',
    marginRight: 10,
  },
  levelWiseRatingContainerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    marginVertical: 5,
  },
  levelWiseStarstyle: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    width: 45,
    paddingHorizontal: 2,
    justifyContent: 'space-evenly',
  },
  progressbarContainerStyle: {
    backgroundColor: '#D9D9D9',
    marginVertical: 5,
    width: '70%',
    borderRadius: 10,
    height: 4,
  },
  filledProgressbarStyle: {
    backgroundColor: '#D9D9D9',
    borderRadius: 10,
    height: 4,
  },
});
