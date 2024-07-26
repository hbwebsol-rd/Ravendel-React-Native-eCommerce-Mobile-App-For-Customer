import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';

import moment from 'moment';
import PropTypes from 'prop-types';
import StarRating from 'react-native-star-rating';

import { AText } from '../../../theme-components';
import { isEmpty } from '../../../utils/helper';
import { FontStyle } from '../../../utils/config';
import LevelWiseRating from './levelWiseRating';

const RatingReviewBlock = ({ ProductDetails, ReviewProduct }) => {
    const { levelWiseRating, ratingCount, rating } = ProductDetails;

    const renderReview = ({ item: singleReview }) => (
        <View style={styles.reviewContainerStyle}>
            <View style={[styles.starStyle, { borderWidth: 0 }]}>
                <AText
                    medium
                    color={'#72787e'}
                    fonts={FontStyle.semiBold}>
                    {singleReview.rating}
                </AText>
                <StarRating
                    disabled={true}
                    maxStars={1}
                    rating={1}
                    fullStarColor={'#DDAC17'}
                    starSize={14}
                />
            </View>
            <View style={{ width: '85%' }}>
                <View style={styles.reviewStyle}>
                    <AText capitalize bold small>
                        {singleReview.title}
                    </AText>
                    <AText semiminor color={'#8A8A8A'}>
                        {!isEmpty(singleReview.customerId.firstName)
                            ? singleReview.customerId.firstName + ` | `
                            : ''}
                        {moment(singleReview.date).format('ll')}
                    </AText>
                </View>
                <AText xtrasmall>{singleReview.review}</AText>
            </View>
        </View>
    );

    const approvedReviews = ReviewProduct?.filter(review => review.status === 'approved') || [];

    return (
        <>
            {!isEmpty(levelWiseRating) && ratingCount > 0 ? (
                <View style={styles.containerViewStyle}>
                    <AText style={styles.textStyle} large>
                        Rating and Reviews
                    </AText>
                    <LevelWiseRating
                        levelWiseRating={levelWiseRating}
                        rating={rating}
                        ratingCount={ratingCount}
                    />

                    {approvedReviews.length > 0 ? (
                        <>
                            <AText style={styles.headerTextStyle} medium>
                                Customer Reviews
                            </AText>
                            <FlatList
                                data={approvedReviews}
                                renderItem={renderReview}
                                contentContainerStyle={{ paddingBottom: 10 }}
                            />
                        </>
                    ) : (
                        <View style={styles.noReviewsContainer}>
                            <AText small>
                                There are no reviews yet. Be the first one to write one.
                            </AText>
                        </View>
                    )}
                </View>
            ) : null}
        </>
    );
};

RatingReviewBlock.propTypes = {
    ProductDetails: PropTypes.shape({
        levelWiseRating: PropTypes.array,
        ratingCount: PropTypes.number,
        rating: PropTypes.number,
    }).isRequired,
    ReviewProduct: PropTypes.arrayOf(PropTypes.shape({
        status: PropTypes.string,
        rating: PropTypes.number,
        title: PropTypes.string,
        review: PropTypes.string,
        date: PropTypes.string,
        customerId: PropTypes.shape({
            firstName: PropTypes.string,
        }),
    })),
};

const styles = StyleSheet.create({
    reviewContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginTop: 10,
    },
    headerTextStyle: { marginTop: 10, marginBottom: 5, fontFamily: FontStyle.semiBold },
    textStyle: {
        fontFamily: FontStyle.fontBold,
        marginBottom: 10
    },
    reviewStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    containerViewStyle: {
        flex: 1,
        marginVertical: 10,
        marginHorizontal: 15,
    },
    starStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#6D6D6D',
        flexWrap: 'wrap',
        width: 45,
        paddingVertical: 5,
        paddingHorizontal: 2,
        justifyContent: 'space-evenly',
        marginVertical: 7,
    },
    noReviewsContainer: {
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        paddingVertical: 8,
        alignItems: 'center',
    },
});

export default RatingReviewBlock;
