import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  AText,
  AppLoader,
  BackHeader,
  MainLayout,
} from '../../theme-components';
import styled from 'styled-components/native';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from '../../utils/helper';
import { useIsFocused } from '@react-navigation/native';
import {
  addAddressAction,
  updateAddressAction,
  userDetailsfetch,
} from '../../store/action';
import { AdressForm } from '../components';
import {
  APP_PRIMARY_COLOR,
  APP_SECONDARY_COLOR,
} from '../../utils/config';
import Colors from '../../constants/Colors';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AddressCard from '../../theme-components/addressCard';

const SavedAddressScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const { userDetails, loading } = useSelector((state) => state.customer);
  const [addressForm, setAddressForm] = useState(false);
  const [scrollenable, setScrollEnable] = useState(true);
  const [initialFormValues, setInitialFormValues] = useState({
    firstname: '',
    lastname: '',
    phone: '',
    address: '',
    landmark: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
    _id: '',
    defaultAddress: true,
    addressType: 'Home',
  });

  useEffect(() => {
    if (!isEmpty(userDetails.addressBook)) {
      let address = userDetails.addressBook;
      setAddressForm(false);
      var found = address.find((item) => {
        return item.default_address == true;
      });
    } else {
      setAddressForm(true);
    }
  }, [isFocused, userDetails]);

  useEffect(() => {
    if (!isEmpty(userDetails)) {
      dispatch(userDetailsfetch(userDetails._id));
    }
  }, [isFocused]);

  const onSubmit = (values) => {
    const payload = {
      id: userDetails._id,
      _id: initialFormValues._id || '',
      firstName: values.firstname,
      lastName: values.lastname,
      phone: values.phone,
      addressLine1: values.address,
      addressLine2: values.landmark,
      city: values.city,
      country: values.country,
      state: values.state,
      pincode: values.pincode,
      defaultAddress: values.defaultAddress,
      addressType: values.addressType,
    };

    setAddressForm(false);
    if (isEmpty(initialFormValues._id)) {
      dispatch(addAddressAction(payload));
    } else {
      dispatch(updateAddressAction(payload));
      setInitialFormValues({
        firstname: '',
        lastname: '',
        phone: '',
        address: '',
        landmark: '',
        city: '',
        state: '',
        country: '',
        pincode: '',
        _id: '',
        defaultAddress: true,
        addressType: '',
      });
    }
  };

  const editFormValues = (values) => {
    setInitialFormValues({
      firstname: values.firstName,
      lastname: values.lastName,
      phone: values.phone,
      address: values.addressLine1,
      landmark: values.addressLine2,
      city: values.city,
      state: values.state,
      country: values.country,
      pincode: values.pincode,
      _id: values._id,
      defaultAddress: values.defaultAddress ?? false,
      addressType: values.addressType ?? '',
    });
    setAddressForm(true);
  };
  const addressBookContent = useMemo(() => (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <AddressWrapper>
        {userDetails.addressBook.map((item, index) => (
          <AddressCard
            addressDefault={false}
            item={item}
            editDefaultAdress={false}
            setAddressDefault={() => { }}
            editForm={() => { editFormValues(item) }} />
          // <View style={styles.addressContentWrapper} key={index}>
          //   <RadioButtonWrapper onPress={() => editFormValues(item)}>
          //     <View style={styles.addressTypeWrapper}>
          //       <MIcon
          //         name={item.addressType === 'Home' ? 'home-outline' : 'briefcase-outline'}
          //         size={22}
          //         color={APP_PRIMARY_COLOR}
          //       />
          //       <AText large>
          //         {item.addressType}
          //       </AText>
          //     </View>
          //     <MIcon name={'pencil-outline'} size={15} color={APP_PRIMARY_COLOR} />
          //   </RadioButtonWrapper>
          //   <View>
          //     <View style={styles.namePhoneWrapper}>
          //       <AText medium>{item.firstName}</AText>
          //       <AText medium>{item.phone}</AText>
          //     </View>
          //     <AText textStyle={styles.addressText}>{`${item.addressLine1}, ${item.addressLine2}, ${item.city}`}</AText>
          //     <AText textStyle={styles.addressText}>{`${item.state}, ${item.pincode}`}</AText>
          //   </View>
          // </View>
        ))}
      </AddressWrapper>
      <View style={styles.addButtonWrapper}>
        <TouchableOpacity style={styles.addAddressBtnStyle} onPress={() => setAddressForm(true)}>
          <View style={styles.plusStyle}>
            <MIcon name={'plus-thick'} size={18} color={'#000'} />
          </View>
          <AText medium>Add new address</AText>
        </TouchableOpacity>
      </View>
    </ScrollView>
  ), [userDetails.addressBook]);
  return (
    <MainLayout hideScroll>
      {loading ? <AppLoader /> : null}
      {(isEmpty(userDetails) && isEmpty(userDetails.addressBook)) ||
        addressForm ? (
        <AdressForm
          navigation={navigation}
          addForm={onSubmit}
          onStopScroll={() => setScrollEnable(!scrollenable)}
          cancelAddForm={() => {
            setInitialFormValues({
              firstname: userDetails.firstName,
              lastname: userDetails.lastName,
              phone: userDetails.phone,
              address: '',
              landmark: '',
              city: '',
              state: '',
              country: '',
              pincode: '',
              defaultAddress: true,
              addressType: '',
            });
            setAddressForm(false)}}
          showBottomPanel={true}
          showHeader={true}
          initialFormValues={initialFormValues}
        />
      ) : (
        <View style={styles.container}>
          <BackHeader navigation={navigation} name="My Account" />
          {addressBookContent}
        </View>
      )}
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },
  scrollView: {
    marginHorizontal: 12,
  },
  addressContentWrapper: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#D4D4D4',
    padding: 10,
    paddingHorizontal: 16,
    marginVertical: 7,
    justifyContent: 'space-evenly',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: '#fff',
  },
  addressTypeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  namePhoneWrapper: {
    flexDirection: 'row',
    width: '80%',
    justifyContent: 'space-between',
  },
  addAddressBtnStyle: {
    borderWidth: 1,
    borderColor: '#D4D4D4',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    alignSelf: 'center',
  },
  plusStyle: {
    backgroundColor: APP_SECONDARY_COLOR,
    borderRadius: 60,
    padding: 5,
    marginEnd: 8,
  },
});


const AddressWrapper = styled.View`
  margin-top: 20px;
`;
const RadioButtonWrapper = styled.TouchableOpacity`
  justify-content: space-between;
  align-items: center;
  align-self: flex-end;
  flex-direction: row;
  width: 100%;
  margin: 5px;
`;
export default SavedAddressScreen;
