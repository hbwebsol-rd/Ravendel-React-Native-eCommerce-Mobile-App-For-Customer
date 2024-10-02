import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  Linking,
} from 'react-native';
import Header from '../components/Header';
import Styles from '../../Theme';
import Colors from '../../constants/Colors';
import {AText, BackHeader} from '../../theme-components';
import FIcon from 'react-native-vector-icons/Feather';
import EIcon from 'react-native-vector-icons/Entypo';
import {APP_PRIMARY_COLOR, FontStyle} from '../../utils/config';
import {ImageBackground} from 'react-native';
import {useSelector} from 'react-redux';
import {isEmpty} from '../../utils/helper';

const ContactUs = ({navigation}) => {
  const {storeAddress} = useSelector(state => state.settings);
  const ContactDetail = ({color, iconName, title, info}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          iconName === 'mail'
            ? Linking.openURL(`mailto:${info}`)
            : iconName === 'phone'
            ? Linking.openURL(`tel:${info}`)
            : '';
        }}
        activeOpacity={0.9}
        style={{
          marginLeft: 20,
          marginBottom: 10,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <FIcon name={iconName} size={16} color={color} />
        <View style={{justifyContent: 'center', marginLeft: 8}}>
          <AText medium color={color}>
            {title}
          </AText>
          <AText>{info}</AText>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={Styles.mainContainer}>
      <View
        style={{
          position: 'absolute',
          top: Platform.OS === 'ios' ? 55 : 0,
          zIndex: 5,
        }}>
        <BackHeader navigation={navigation} name={'Contact Us'} />
      </View>
      <ImageBackground
        style={{flex: 1}}
        source={require('../../assets/images/map.png')}
      />
      <View style={styles.cardStyle}>
        <AText style={styles.textStyle} large>
          Contact us
        </AText>
        <ContactDetail
          title={'Address:'}
          color={Colors.redColor}
          info={`${storeAddress.addressLine1} ${storeAddress.addressLine2} ${
            storeAddress.city
          } ${storeAddress.zip ? storeAddress.zip : ''} ${
            storeAddress.country
          }`}
          iconName={'map-pin'}
        />
        <ContactDetail
          title={'Phone No:'}
          color={Colors.blue}
          info={storeAddress.phone_number}
          iconName={'phone'}
        />
        <ContactDetail
          title={'Email:'}
          color={Colors.green}
          info={storeAddress.email}
          iconName={'mail'}
        />
        {!isEmpty(storeAddress.social_media) ? (
          <AText style={styles.textStyle} large>
            Social Media
          </AText>
        ) : null}
        <View style={styles.socialMediaContaineStyle}>
          {!isEmpty(storeAddress.social_media) &&
            storeAddress.social_media.map(item => (
              <>
                <EIcon
                  name={item?.iconName ?? 'globe'}
                  size={35}
                  color={APP_PRIMARY_COLOR}
                  style={{marginRight: 10}}
                  onPress={() => Linking.openURL(item.handle)}
                />
              </>
            ))}
        </View>
        <View style={[styles.iconStyle, {backgroundColor: APP_PRIMARY_COLOR}]}>
          <FIcon name="send" size={20} color={Colors.whiteColor} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    fontFamily: FontStyle.fontBold,
    marginBottom: 16,
    marginTop: 20,
    marginLeft: 25,
    color: '#000',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  socialTextStyle: {
    marginTop: 10,
    marginBottom: 16,
    marginLeft: 20,
    color: '#000',
  },
  iconStyle: {
    backgroundColor: '#088178',
    height: 46,
    width: 46,
    borderRadius: 50,
    position: 'absolute',
    right: -15,
    bottom: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardStyle: {
    backgroundColor: Colors.whiteColor,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
    borderRadius: 10,
    position: 'absolute',
    top: '40%',
    width: '90%',
    alignSelf: 'center',
  },
  socialMediacardStyle: {
    backgroundColor: Colors.whiteColor,
    paddingVertical: 20,
    elevation: 10,
    borderRadius: 10,
    width: '85%',
    alignSelf: 'center',
  },
  socialMediaContaineStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '35%',
  },
});

export default ContactUs;
