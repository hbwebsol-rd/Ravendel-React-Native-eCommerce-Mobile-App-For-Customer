import React, {useEffect, useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  Modal,
  TouchableOpacity,
  View,
  Linking,
} from 'react-native';
import {Button, Title} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
// import Styles from '../screens/ThemeCss';
import {checkVersion} from 'react-native-check-version';
import { APP_PRIMARY_COLOR, APP_SECONDARY_COLOR } from './config';
// import isEmpty from './isEmpty';
// import {getValue, storeData} from './storage';
// import moment from 'moment';

const UpdateVesionModal = () => {
  const [viewUpdateModal, setViewUpdateModal] = useState(false);
  const [playStoreLink, setplayStoreLink] = useState('');

  useEffect(() => {
    checkVersions();
  }, []);
  const checkVersions = async () => {
    const version = await checkVersion();
    console.log(version, 'vvv');
    if (version.needsUpdate) {
      setplayStoreLink(version.url);
      //   var nextPopup = await getValue('UpdateModalShown');
      //   var expires = moment(new Date()).toString();
      // if (isEmpty(nextPopup) || nextPopup < expires) {
      setTimeout(() => {
        // Store the expiration date of the current popup in localStorage.
        // expires = moment().hour(48)
        // storeData('UpdateModalShown', (expires).toString())
        setViewUpdateModal(true);
      }, 7500);
      // }
    }
  };

  return (
    <Modal
      transparent={true}
      visible={viewUpdateModal}
      animationIn="slideInLeft"
      animationOut="slideOutRight">
      <View
        style={{
          backgroundColor: 'rgba(0,0,0,0.1)',
          alignItems: 'center',
          justifyContent: 'center',
          flexGrow: 1,
        }}>
        <View
          style={{
            width: '75%',
            backgroundColor: 'white',
            paddingTop: 20,
            paddingBottom:30,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 15,
            borderColor: 'rgba(0, 0, 0, 0.1)',
          }}>
          <TouchableOpacity
            onPress={() => setViewUpdateModal(false)}
            style={[styles.viewImageClose, {top: 10}]}>
            <Icon name="close" color={'#e72c30'} size={25} />
          </TouchableOpacity>

          {/* <Image
            style={{
              width: 90,
              height: 80,
              resizeMode: 'contain',
              marginBottom: 5,
            }}
            source={localimag.logo}
          /> */}
          <View
            style={{
              margin: 15,
              paddingHorizontal: 30,
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Title>New Version Available</Title>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 15,
                color: '#9B9B9B',
                marginTop: 5,
                lineHeight: 22,
                padding: 15,
              }}>
              Looks like you have an older version of the app.{'\n'}Please
              update to get latest features and best experience.
            </Text>
          </View>
          <Button
            mode="contained"
            color={APP_PRIMARY_COLOR}
            style={{marginTop: 5, width: '70%', padding: 7,borderRadius:30}}
            onPress={() => Linking.openURL(playStoreLink)}>
            Update Now
          </Button>
        </View>
      </View>
    </Modal>
  );
};

export default UpdateVesionModal;

const styles = StyleSheet.create({
    viewImageClose: {
        position: 'absolute',
        top: 15,
        right: 0,
        zIndex: 25,
        padding: 4,
        borderRadius: 50,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
      },
});
