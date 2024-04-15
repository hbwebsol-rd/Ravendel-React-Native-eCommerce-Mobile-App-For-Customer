import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Feather';
import {
  HomeScreen,
  CartScreen,
  CategoriesScreen,
  AccountScreen,
  CategoryScreen,
  SubCategoriesScreen,
  SingleProductScreen,
  ProfileScreen,
  SavedAddressScreen,
  OrderScreen,
  RecentlyViewScreen,
  ForgotPasswordScreen,
  SaveCardScreen,
  ShippingScreen,
  PaymentMethodScreen,
  CheckoutScreen,
  OrderDetailScreen,
  EditProfileScreen,
  ChangePasswordScreen,
  Temp,
  UserEntry,
  SubcategoriesOption,
  Shop,
  CheckoutDetails,
  StripePayment,
  ThankYou,
  WishList,
  PaypalPayment,
} from '../screens';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { getValue, isEmpty } from '../utils/helper';
import AlertError from '../theme-components/alert';
import { sessionCheck } from '../store/action/loginAction';
import { checkStorageAction } from '../store/action';
import { useIsFocused } from '@react-navigation/native';
import { APP_PRIMARY_COLOR } from '../utils/config';
import Colors from '../constants/Colors';
import NVC from '../navigation/NavigationConstants';
import ShippingMethodScreen from '../screens/checkout/ShippingMethodScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const setting = { themes: [{ primaryColor: '#3a3a3a', productsCount: '3' }] };

const Navigation = () => {
  // States and Variables
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const cartItems = useSelector((state) => state.cart.products) || 0;
  const { isLoggin } = useSelector((state) => state.customer);

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

  // Use Effect Call
  useEffect(() => {
    dispatch(sessionCheck());
    getCart();
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

  return (
    <>
      <Tab.Navigator
        detachInactiveScreens={true}
        screenOptions={({ route }) => ({
          tabBarStyle: {
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
        {/* Home End */}

        <Tab.Screen
          name={NVC.TEMP_SCREEN}
          options={{
            tabBarLabel: 'Temp',
            tabBarButton: () => null,
          }}
          component={Temp}
        />

        {/* Categories */}
        <Stack.Screen
          name={NVC.CATEGORIES_SCREEN}
          options={{ headerShown: false }}
          component={CategoriesScreen}
        />
        <Stack.Screen
          name={NVC.SHOP_SCREEN}
          options={{ headerShown: false, tabBarButton: () => null }}
          component={Shop}
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
          name={NVC.CATEGORY_SCREEN}
          options={{ headerShown: false, tabBarButton: () => null }}
          component={CategoryScreen}
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
          name={NVC.SHIPPING_METHOD_SCREEN}
          options={{ headerShown: false, tabBarButton: () => null }}
          component={ShippingMethodScreen}
        />
        <Stack.Screen
          name={NVC.CHECKOUT_SCREEN}
          options={{
            headerShown: false,
            tabBarButton: () => null,
            tabBarStyle: { display: 'none' },
          }}
          component={CheckoutScreen}
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
          options={{ headerShown: false, tabBarButton: () => null }}
          component={CheckoutDetails}
        />
        <Stack.Screen
          name={NVC.THANK_YOU_SCREEN}
          options={{ headerShown: false, tabBarButton: () => null }}
          component={ThankYou}
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
          name={NVC.PROFILE_SCREEN}
          options={{ headerShown: false, tabBarButton: () => null }}
          component={ProfileScreen}
        />
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
          name={NVC.RECENTLY_VIEWED_SCREEN}
          options={{ headerShown: false, tabBarButton: () => null }}
          component={RecentlyViewScreen}
        />
        <Stack.Screen
          name={NVC.SAVE_CARDS_SCREEN}
          options={{ headerShown: false, tabBarButton: () => null }}
          component={SaveCardScreen}
        />
        {/* <Stack.Screen
          name="Login"
          options={{ headerShown: false, tabBarButton: () => null }}
          component={LoginScreen}
        />
        <Stack.Screen
          name="Signup"
          options={{ headerShown: false, tabBarButton: () => null }}
          component={SignupScreen}
        /> */}
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
          name={NVC.WISHLIST}
          options={{
            headerShown: false,
            tabBarButton: () => null,
            tabBarStyle: { display: 'none' },
          }}
          component={WishList}
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
          name={NVC.ORDER_DETAIL_SCREEN}
          options={{ headerShown: false, tabBarButton: () => null }}
          component={OrderDetailScreen}
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
});
