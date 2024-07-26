import React from 'react';
import { StyleSheet, View, } from 'react-native';

import { AText } from '../../../theme-components';
import { isEmpty } from '../../../utils/helper';
import { APP_PRIMARY_COLOR, FontStyle } from '../../../utils/config';

import PropTypes from 'prop-types';



const SpecificationBlock = ({ specifications }) => {
    const groupedSpecifications =
        !isEmpty(specifications) &&
        specifications.reduce((groups, spec) => {
            const group = groups[spec.group] || [];
            group.push(spec);
            groups[spec.group] = group;
            return groups;
        }, {});
    const groupedSpecificationData = groupedSpecifications;



    return (
        <>
            {/* ========================Custom Field================================ */}
            {!isEmpty(specifications) &&
                specifications.length > 0 && (
                    <View style={styles.containerViewStyle}>
                        <AText style={{ marginBottom: 10, fontFamily: FontStyle.fontBold }} large>
                            Specifications
                        </AText>

                        {Object.keys(groupedSpecificationData).map((item, index) => (
                            <>
                                <AText
                                    style={{ marginLeft: 10, marginBottom: 5 }}
                                    capitalize
                                    color={APP_PRIMARY_COLOR}
                                    fonts={FontStyle.semiBold}
                                    medium>
                                    {item}
                                </AText>
                                <View style={styles.specificationGroupStyle}>
                                    {groupedSpecificationData[item].map((spec) => (
                                        <View style={styles.specificationRowStyle}>
                                            <AText medium capitalize fonts={FontStyle.semiBold}>
                                                {spec.key}
                                            </AText>
                                            <AText small capitalize>
                                                {spec.value}
                                            </AText>
                                        </View>
                                    ))}
                                    {index !==
                                        Object.keys(groupedSpecificationData).length - 1 ? (
                                        <View
                                            style={{
                                                ...styles.boderLineView,
                                                marginVertical: 10,
                                            }}
                                        />
                                    ) : null}
                                </View>
                            </>
                        ))}
                    </View>
                )}
        </>
    );
};

SpecificationBlock.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
};

//  ===============For Style=============

const styles = StyleSheet.create({
    stockContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    specificationGroupStyle: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '97%',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    specificationRowStyle: {
        width: '40%',
        marginStart: 7,
        marginBottom: 20,
    },
    boderLineView: {
        backgroundColor: '#E9E9E9',
        height: 2,
        width: '95%',
        alignSelf: 'center',
    },
    containerViewStyle: {
        flex: 1,
        marginVertical: 10,
        marginHorizontal: 15,
    }
});
export default SpecificationBlock;
