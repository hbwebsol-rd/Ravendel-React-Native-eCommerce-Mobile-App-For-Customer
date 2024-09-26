import React, { Fragment, useEffect, useState } from 'react';
import {
  AText,
  AButton,
  AppLoader,
  AHeader,
  BackHeader,
} from '../../theme-components';
import { Formik } from 'formik';
import { validationSchema } from '../checkout/validationSchema';
import styled from 'styled-components/native';
import { RadioButton, TextInput } from 'react-native-paper';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from '../../utils/helper';
import { useIsFocused } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  addAddressAction,
  removeAddressAction,
  updateAddressAction,
  userDetailsfetch,
} from '../../store/action';
import { AdressForm } from '../components';
import { APP_SECONDARY_COLOR, FontStyle, GREYTEXT } from '../../utils/config';
import AIcon from 'react-native-vector-icons/AntDesign';
import Header from '../../theme-components/SimpleHeader';
import Colors from '../../constants/Colors';

const SavedAddressScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const { userDetails, loading } = useSelector((state) => state.customer);
  const [addressBook, setAddressBook] = useState();
  const [addressForm, setAddressForm] = useState(false);
  const [addressDefault, setaddressDefault] = useState(0);
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
  });

  useEffect(() => {
    if (!isEmpty(userDetails.address_book)) {
      let address = userDetails.address_book;
      setAddressBook(address);
      setAddressForm(false);
      var found = address.find((item) => {
        return item.default_address == true;
      });
      if (!isEmpty(found)) {
        setaddressDefault(found._id);
      } else {
        setaddressDefault(address[0]._id);
      }
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
    if (isEmpty(initialFormValues._id)) {
      const payload = {
        id: userDetails._id,
        first_name: values.firstname,
        last_name: values.lastname,
        phone: values.phone,
        address_line1: values.address,
        address_line2: values.landmark,
        city: values.city,
        country: values.country,
        state: values.state,
        pincode: values.pincode,
        default_address: true,
      };
      setAddressForm(false);
      dispatch(addAddressAction(payload));
    } else {
      const payload = {
        id: userDetails._id,
        _id: initialFormValues._id,
        first_name: values.firstname,
        last_name: values.lastname,
        phone: values.phone,
        address_line1: values.address,
        address_line2: values.landmark,
        city: values.city,
        country: values.country,
        state: values.state,
        pincode: values.pincode,
        default_address: true,
      };
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
      });
      setAddressForm(false);
      dispatch(updateAddressAction(payload));
    }
  };
  const editFormValues = (values) => {
    setInitialFormValues({
      firstname: values.first_name,
      lastname: values.last_name,
      phone: values.phone,
      address: values.address_line1,
      landmark: values.address_line2,
      city: values.city,
      state: values.state,
      country: values.country,
      pincode: values.pincode,
      _id: values._id,
    });
    setAddressForm(true);
  };
  const updatedefaultaddress = (values) => {
    const payload = {
      id: userDetails._id,
      _id: values._id,
      first_name: values.first_name,
      last_name: values.last_name,
      phone: values.phone,
      address_line1: values.address_line1,
      address_line2: values.address_line2,
      city: values.city,
      country: values.country,
      state: values.state,
      pincode: values.pincode,
      default_address: true,
    };
    dispatch(updateAddressAction(payload));
  };
  const deleteAddress = (id) => {
    const data = {
      id: userDetails._id,
      _id: id,
    };
    dispatch(removeAddressAction(data));
  };

  return (
    <>
      {loading ? <AppLoader /> : null}
      {(isEmpty(userDetails) && isEmpty(userDetails.address_book)) ||
      addressForm ? (
        <AdressForm
          navigation={navigation}
          addForm={onSubmit}
          onStopScroll={() => {
            setScrollEnable(!scrollenable);
          }}
          cancelAddForm={() => {
            setAddressForm(false);
          }}
          initialFormValues={initialFormValues}
        />
      ) : (
        <>
          {/* <AHeader navigation={navigation} title="Saved Addresses" back /> */}
          <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <BackHeader navigation={navigation} name={'My Account'} />

            <ScrollView
              contentContainerStyle={{
                marginHorizontal: 30,
              }}>
              <AButton
                block
                round
                onPress={() => {
                  setAddressForm(true);
                }}
                title="+ Add new address"
              />
              <AddressWrapper>
                {userDetails.address_book.map((item, index) => (
                  <AddressContentWrapper>
                    <RadioButtonWrapper
                      onPress={() => {
                        updatedefaultaddress(item);
                      }}>
                      <AText heavy large>
                        {item.first_name}
                      </AText>
                      <Icon
                        name={'star'}
                        color={
                          item._id === addressDefault ? '#FFB400' : '#c4f4f4'
                        }
                        size={20}
                      />
                    </RadioButtonWrapper>
                    <AText color={GREYTEXT} medium>
                      {item.address_line1}, {item.address_line2}, {item.city}
                    </AText>
                    <AText color={GREYTEXT} medium>
                      {item.state}, {item.pincode}
                    </AText>
                    <AText color={GREYTEXT} bold medium>
                      {item.phone},{' '}
                    </AText>
                    <ButtonWrapper>
                      <EditRemoveButton
                        style={{ backgroundColor: '#DCF0EF' }}
                        onPress={() => {
                          editFormValues(item);
                        }}>
                        <AText color="black" bold>
                          Edit
                        </AText>
                      </EditRemoveButton>
                      <EditRemoveButton
                        style={{ backgroundColor: '#DCF0EF' }}
                        onPress={() => {
                          deleteAddress(item._id);
                        }}>
                        <AText color="black" bold>
                          Remove
                        </AText>
                      </EditRemoveButton>
                    </ButtonWrapper>
                  </AddressContentWrapper>
                ))}
              </AddressWrapper>
            </ScrollView>
          </View>
        </>
      )}
      {/* </CheckouWrapper> */}
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    position: 'absolute',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    left: 0,
    right: 0,
    marginTop: 10,
    paddingHorizontal: 20,
    zIndex: 10,
  },
  textinputstyle: {
    marginTop: 5,
    marginBottom: 5,
  },
});

const CheckouWrapper = styled.ScrollView`
  padding: 10px;
  background: #fff;
`;
const BottomSpacer = styled.View`
  height: 25px;
`;
const AddressWrapper = styled.View`
  margin-top: 20px;
`;
const AddressContentWrapper = styled.View`
  flex: 1;
  margin-top: 10px;
  margin-bottom: 10px;
  border-radius: 10px;
  background: white;
  overflow: hidden;
  position: relative;
  border: 1px solid #f8f8f8;
  box-shadow: 0 0 5px #eee;
  elevation: 1;
  padding: 10px 12px;
`;
const EditRemoveButton = styled.TouchableOpacity`
  padding: 5px;
  border-radius: 5px;
  justify-content: center;
  align-items: center;
  margin-left: 5px;
  margin-top: 10px;
`;
const ButtonWrapper = styled.TouchableOpacity`
  align-items: center;
  align-self: flex-start;
  marginstart: 10px;
  flex-direction: row;
`;
const RadioButtonWrapper = styled.TouchableOpacity`
  justify-content: space-between;
  align-items: center;
  align-self: flex-end;
  flex-direction: row;
  width: 98%;
  margin: 5px;
`;
export default SavedAddressScreen;
