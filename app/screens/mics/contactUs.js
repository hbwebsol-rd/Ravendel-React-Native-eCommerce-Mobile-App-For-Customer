import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Header from '../components/Header';
import Styles from '../../Theme';
import Colors from '../../constants/Colors';
import { AText } from '../../theme-components';
import FIcon from 'react-native-vector-icons/Feather';

const ContactUs = ({ navigation }) => {
  const ContactDetail = ({ color, iconName, title, info }) => {
    return (
      <View style={{ marginLeft: 20, marginBottom: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <FIcon name={iconName} size={16} color={color} />
          <AText ml="3px" medium color={color}>
            {title}
          </AText>
        </View>
        <AText ml="18px">{info}</AText>
      </View>
    );
  };

  return (
    <View style={Styles.mainContainer}>
      <Header navigation={navigation} title={'Contact Us'} />
      <Image source={require('../../assets/images/map.png')} />
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
        <View style={styles.iconStyle}>
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
    top: '50%',
    width: '85%',
    alignSelf: 'center',
  },
});

export default ContactUs;
