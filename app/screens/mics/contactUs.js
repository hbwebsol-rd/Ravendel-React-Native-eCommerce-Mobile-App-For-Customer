import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Header from '../components/Header';
import Styles from '../../Theme';
import Colors from '../../constants/Colors';
import { AText } from '../../theme-components';
import FIcon from 'react-native-vector-icons/Feather';
import EIcon from 'react-native-vector-icons/Entypo';
import { APP_PRIMARY_COLOR } from '../../utils/config';

const ContactUs = ({ navigation }) => {
  const ContactDetail = ({ color, iconName, title, info }) => {
    return (
      <View
        style={{
          marginLeft: 20,
          marginBottom: 10,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <FIcon name={iconName} size={16} color={color} />
        <View style={{ justifyContent: 'center', marginLeft: 8 }}>
          <AText medium color={color}>
            {title}
          </AText>
          <AText>{info}</AText>
        </View>
      </View>
    );
  };

  return (
    <View style={Styles.mainContainer}>
      <Header navigation={navigation} title={'Contact Us'} />
      <Image
        style={{ width: '100%' }}
        source={require('../../assets/images/map.png')}
      />
      <View style={styles.cardStyle}>
        <AText mb={'16px'} ml={'20px'} large color={Colors.blackColor}>
          Contact us
        </AText>
        <ContactDetail
          title={'Address:'}
          color={Colors.redColor}
          info={'Central park, Huston'}
          iconName={'map-pin'}
        />
        <ContactDetail
          title={'Phone No:'}
          color={Colors.blue}
          info={'+91 63625-55254'}
          iconName={'phone'}
        />
        <ContactDetail
          title={'Email:'}
          color={Colors.green}
          info={'hbwebsol@gmail.com'}
          iconName={'mail'}
        />
        <AText
          mt={'10px'}
          mb={'16px'}
          ml={'20px'}
          large
          color={Colors.blackColor}>
          Social Media
        </AText>
        <View style={styles.socialMediaContaineStyle}>
          <EIcon
            name="facebook-with-circle"
            size={35}
            color={APP_PRIMARY_COLOR}
          />
          <EIcon
            name="instagram-with-circle"
            size={35}
            color={APP_PRIMARY_COLOR}
          />
          <EIcon
            name="twitter-with-circle"
            size={35}
            color={APP_PRIMARY_COLOR}
          />
        </View>
        <View
          style={[styles.iconStyle, { backgroundColor: APP_PRIMARY_COLOR }]}>
          <FIcon name="send" size={20} color={Colors.whiteColor} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
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
    elevation: 10,
    borderRadius: 10,
    position: 'absolute',
    top: '40%',
    width: '85%',
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
    justifyContent: 'space-between',
    alignSelf: 'center',
    width: '35%',
  },
});

export default ContactUs;
