import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Styles from '../../Theme';
import { AText } from '../../theme-components';
import { FontStyle } from '../../utils/config';
import { Image } from 'react-native';
import NavigationConstants from '../../navigation/NavigationConstants';
import PropTypes from 'prop-types';

const Header = ({ navigation, title, showProfileIcon }) => {
  function handlePress() {
    navigation.openDrawer();
  }
  return (
    <View
      style={{
        ...styles.header,
        justifyContent: showProfileIcon ? 'space-between' : 'flex-start',
      }}>
      <TouchableOpacity style={{ marginTop: 10 }} onPress={handlePress}>
        <View style={Styles.bar1}></View>
        <View style={Styles.bar2}></View>
      </TouchableOpacity>
      <AText fonts={FontStyle.semiBold} ml="20px">
        {title}
      </AText>
      {showProfileIcon ? (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() =>
            navigation.navigate(NavigationConstants.ACCOUNT_SCREEN)
          }
          style={{ ...styles.profileimgstyle, elevation: 5 }}>
          <Image
            style={styles.profileimgstyle}
            source={require('../../assets/images/man.png')}
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

Header.propTypes = {
  navigation: PropTypes.object,
  title: PropTypes.string,
  showProfileIcon: PropTypes.bool,
};

const styles = StyleSheet.create({
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    position: 'absolute',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    left: 0,
    right: 0,
    marginTop: 10,
    paddingHorizontal: 30,
    zIndex: 10,
    // backgroundColor: Colors.whiteColor,
  },
  profileimgstyle: { height: 30, width: 35, borderRadius: 35 },
});

export default Header;
