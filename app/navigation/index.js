import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Feather';
import {
  HomeScreen,
  CartScreen,
  CategoriesScreen,
  AccountScreen,
  SubCategoriesScreen,
  SingleProductScreen,
  SavedAddressScreen,
  OrderScreen,
  ForgotPasswordScreen,
  ShippingScreen,
  PaymentMethodScreen,
  EditProfileScreen,
  ChangePasswordScreen,
  UserEntry,
  SubcategoriesOption,
  CheckoutDetails,
  StripePayment,
  ThankYou,
  PaypalPayment,
  SearchProduct,
  ContactUs,
  OrderDetailScreen
} from '../screens';
import { View, Text, Image, StyleSheet, Platform, Linking } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { getValue, isEmpty } from '../utils/helper';
import AlertError from '../theme-components/alert';
import { sessionCheck } from '../store/action/loginAction';
import { checkStorageAction } from '../store/action';
import { useIsFocused } from '@react-navigation/native';
import { APP_PRIMARY_COLOR, ONE_SIGNAL_APP_ID } from '../utils/config';
import Colors from '../constants/Colors';
import NVC from '../navigation/NavigationConstants';
import NoConnection from '../theme-components/nointernet';
import NetInfo from '@react-native-community/netinfo';
import { NET_OFF, NET_ON } from '../store/reducers/alert';
import { initial } from 'lodash';
import { OneSignal } from 'react-native-onesignal';
import DeviceInfo from 'react-native-device-info';
import { SAVE_DEVICE_ID } from '../queries/userQuery';
import { mutation } from '../utils/service';
import { TouchableOpacity } from 'react-native';
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const setting = { themes: [{ primaryColor: '#3a3a3a', productsCount: '3' }] };

const Navigation = () => {
  // States and Variables
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const cartItems = useSelector((state) => state.cart.products) || 0;
  const { isLoggin } = useSelector((state) => state.customer);
  const { netConnection } = useSelector((state) => state.alert);
  const [showAlert, setShowAlert] = useState(false);

  // Custom Function
  const getCart = async () => {
    var userDetails = await getValue('userDetails');
    if (!isEmpty(userDetails)) {
      userDetails = JSON.parse(userDetails);
      dispatch(checkStorageAction(userDetails._id));
    } else {
      dispatch(checkStorageAction());
    }
  };

  const save_playerid = async player_id => {
    const versionName = DeviceInfo.getVersion(); // e.g. "1.0"
  
    const payload = {
      "deviceInfo": {
      "device_id": player_id,
      "device_type": Platform.OS.toUpperCase(),
      "app_version": versionName
    }
    }
    const response = await mutation(SAVE_DEVICE_ID, payload);
    const { data } = response;
  };
  
  const setDeviceId = async () => {
    const deviceState = await OneSignal.User.pushSubscription.getIdAsync();
    // const pid = await getValue('playerid');
    console.log(deviceState, 'Plaery Id Get');
    // if (deviceState && deviceState.userId && isEmpty(pid)) {
    save_playerid(deviceState); //
    // }
  };
  
  
  const InitOneSignal = async () => {
    OneSignal.initialize(ONE_SIGNAL_APP_ID)
    OneSignal.setConsentRequired(true);
    OneSignal.setConsentGiven(true);
    
    setTimeout(() => {
      OneSignal.Notifications.requestPermission(false).then(s=>{(Array.isArray(s)&& !s[0]) || !s?setShowAlert(true):null})        
    }, 3000);
    
    setTimeout(() => {
      setDeviceId();
    }, 12000);
  };

  useEffect(() => {
    NetInfo.addEventListener((networkState) => {
      dispatch({ type: networkState.isConnected ? NET_ON : NET_OFF });
    });
  }, [NetInfo]);
  // Use Effect Call
  useEffect(() => {
    dispatch(sessionCheck());
    getCart();
    if(isLoggin){
      InitOneSignal()
    }
  }, [isFocused, isLoggin]);

  // Custom Components
  const IconWithBadge = ({ name, badgeCount, color, size }) => {
    return (
      <View style={{ width: 24, height: 24, margin: 0 }}>
        <Icon name={name} size={size} color={color} />
        {badgeCount > 0 && (
          <View
            style={{
              position: 'absolute',
              right: -6,
              top: -3,
              backgroundColor: APP_PRIMARY_COLOR,
              borderRadius: 10,
              width: 15,
              height: 15,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
              {badgeCount}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const HomeIconWithBadge = (props) => {
    return <IconWithBadge {...props} badgeCount={cartItems.length} />;
  };
  // if (netConnection) {
  //   return <NoConnection />;
  // }
  return (
    <>
      <Tab.Navigator
        detachInactiveScreens={true}
        screenOptions={({ route }) => ({
          tabBarStyle: {
            marginBottom: Platform.OS == 'ios' ? 10 : 0,
            backgroundColor: Colors.lightestPrimaryColor,
            paddingBottom: 10,
            paddingTop: 10,
            height: 60,
          },
          tabBarLabelStyle: {
            fontSize: 14,
          },
          headerShown: false,
          unmountOnBlur: true,
          lazy: false,
          tabBarActiveTintColor: APP_PRIMARY_COLOR,
          tabBarInactiveTintColor: Colors.grayColor,
          tabBarHideOnKeyboard: true,
          tabBarIcon: ({ focused, color, size }) => {
            let name;
            if (route.name === 'Home') {
              name = 'home';
            } else if (route.name === 'Categories') {
              name = 'grid';
            } else if (route.name === 'Cart') {
              return (
                <HomeIconWithBadge
                  name="shopping-cart"
                  size={20}
                  color={color}
                />
              );
            } else if (route.name === 'Account') {
              name = 'user';
            }
            return <Icon name={name} size={20} color={color} />;
          },
        })}
        backBehavior={'history'}>
        {/* Home */}
        <Tab.Screen
          name={NVC.HOME_SCREEN}
          options={{
            tabBarLabel: 'Home',
            unmountOnBlur: false,
          }}
          component={HomeScreen}
        />
        <Tab.Screen
          name={NVC.SEARCH_PRODUCT_SCREEN}
          options={{
            tabBarLabel: 'SearchProduct',
            tabBarButton: () => null,
          }}
          component={SearchProduct}
        />
        {/* Home End */}

        {/* Categories */}
        <Stack.Screen
          name={NVC.CATEGORIES_SCREEN}
          options={{ headerShown: false }}
          component={CategoriesScreen}
        />
        <Stack.Screen
          name={NVC.SUBCATEGORIES_OPTION_SCREEN}
          options={{ headerShown: false, tabBarButton: () => null }}
          component={SubcategoriesOption}
        />
        <Stack.Screen
          name={NVC.SUBCATEGORIES_SCREEN}
          options={{ headerShown: false, tabBarButton: () => null }}
          component={SubCategoriesScreen}
        />
        <Stack.Screen
          name={NVC.SINGLE_PRODUCT_SCREEN}
          options={{ headerShown: false, tabBarButton: () => null }}
          component={SingleProductScreen}
        />
        {/* Categories End */}

        {/* Cart*/}
        <Stack.Screen name={NVC.CART_SCREEN} component={CartScreen} />
        <Stack.Screen
          name={NVC.SHIPPING_SCREEN}
          options={{ headerShown: false, tabBarButton: () => null }}
          component={ShippingScreen}
        />
        <Stack.Screen
          name={NVC.PAYMENT_METHOD_SCREEN}
          options={{ headerShown: false, tabBarButton: () => null }}
          component={PaymentMethodScreen}
        />
        <Stack.Screen
          name={NVC.STRIPE_PAYMENT}
          options={{
            headerShown: false,
            tabBarButton: () => null,
            tabBarStyle: { display: 'none' },
          }}
          component={StripePayment}
        />
        <Stack.Screen
          name={NVC.PAYPAL_PAYMENT}
          options={{
            headerShown: false,
            tabBarButton: () => null,
            tabBarStyle: { display: 'none' },
          }}
          component={PaypalPayment}
        />
        <Stack.Screen
          name={NVC.CHECKOUT_DETAILS_SCREEN}
          options={{ headerShown: false, tabBarButton: () => null,tabBarStyle: { display: 'none' } }}
          component={CheckoutDetails}
        />
        <Stack.Screen
          name={NVC.THANK_YOU_SCREEN}
          options={{
            headerShown: false,
            tabBarStyle: {
              display: 'none',
            },
            tabBarButton: () => null,
          }}
          component={ThankYou}
        />
        <Stack.Screen
          name={NVC.ContactUs}
          options={{ headerShown: false, tabBarButton: () => null }}
          component={ContactUs}
        />
        {/* Cart End */}

        {/* Account */}
        {/* <Tab.Screen
          name="AccountWrapper"
          component={AccountStack}
          options={({ route }) => ({
            unmountOnBlur: true,
            lazy: false,
            tabBarLabel: 'Account',
          })}
        /> */}
        <Stack.Screen name={NVC.ACCOUNT_SCREEN} component={AccountScreen} />
        <Stack.Screen
          name={NVC.SAVED_ADDRESS_SCREEN}
          options={{ headerShown: false, tabBarButton: () => null }}
          component={SavedAddressScreen}
        />
        <Stack.Screen
          name={NVC.ORDERS_SCREEN}
          options={{ headerShown: false, tabBarButton: () => null }}
          component={OrderScreen}
        />
          <Stack.Screen
          name={'OrdersDetail'}
          options={{ headerShown: false, tabBarButton: () => null }}
          component={OrderDetailScreen}
        />
        <Stack.Screen
          name={NVC.LOGIN_SIGNUP_SCREEN}
          options={{
            headerShown: false,
            tabBarButton: () => null,
            tabBarStyle: { display: 'none' },
          }}
          component={UserEntry}
        />
        <Stack.Screen
          name={NVC.FORGOT_PASSWORD_SCREEN}
          options={{
            headerShown: false,
            tabBarButton: () => null,
            tabBarStyle: { display: 'none' },
          }}
          component={ForgotPasswordScreen}
        />
        <Stack.Screen
          name={NVC.EDIT_PROFILE_SCREEN}
          options={{ headerShown: false, tabBarButton: () => null }}
          component={EditProfileScreen}
        />
        <Stack.Screen
          name={NVC.CHANGE_PASSWORD_SCREEN}
          options={{ headerShown: false, tabBarButton: () => null }}
          component={ChangePasswordScreen}
        />
        {/* Account End*/}
      </Tab.Navigator>
      {
        showAlert?
        <TouchableOpacity activeOpacity={0.8} onPress={()=>{
          if (Platform.OS === 'ios') {
            // For iOS, opens the app's settings where users can enable notifications
            Linking.openURL('app-settings:');
          } else {
            // For Android, opens the app-specific settings page for notifications
            Linking.openSettings();
          }
        }} style={style.alert}><Text style={{color:'black',margin:0,padding:0}}>Turn on notifications in your settings to stay updated on the latest deals, offers, and updates! <TouchableOpacity onPress={()=>setShowAlert(false)}><Text style={{textDecorationLine:'underline',color:'black'}}>Dismiss</Text></TouchableOpacity></Text></TouchableOpacity>:null
      }
      <AlertError />
    </>
  );
};

export default Navigation;
const style = StyleSheet.create({
  imgstyle: {
    resizeMode: 'contain',
    width: 15,
    height: 15,
  },
  alert:{position:'absolute',marginBottom:70,backgroundColor:'#ff999c',padding:10,alignSelf:'center',bottom:0,borderRadius:10,textAlign:'center'}
});
