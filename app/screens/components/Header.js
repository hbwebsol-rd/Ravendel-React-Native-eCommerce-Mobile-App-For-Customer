import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AText } from '../../theme-components';
import { FontStyle } from '../../utils/config';
import { Image } from 'react-native';
import NavigationConstants from '../../navigation/NavigationConstants';
import PropTypes from 'prop-types';

const Header = ({ navigation, title, showProfileIcon, titleColor }) => {
  function handlePress() {
    // navigation.openDrawer();
  }
  return (
    <View
      style={{
        ...styles.header,
        justifyContent: showProfileIcon ? 'space-between' : 'flex-start',
      }}>
      <AText large color={titleColor ?? '#000'} fonts={FontStyle.fontBold}>
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
    // position: 'absolute',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 5,
    paddingHorizontal: 17,
    zIndex: 10,
    // backgroundColor: Colors.whiteColor,
  },
  profileimgstyle: { height: 30, width: 35, borderRadius: 35 },
});

export default Header;
