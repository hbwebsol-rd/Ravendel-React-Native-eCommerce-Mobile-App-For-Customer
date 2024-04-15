import * as React from 'react';
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  ScrollView,
} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import Feather from 'react-native-vector-icons/Feather';
import { APP_PRIMARY_COLOR, FontStyle } from '../utils/config';
import {
  AccountScreen,
  CartScreen,
  CategoriesScreen,
  CategoryScreen,
  ChangePasswordScreen,
  CheckoutScreen,
  EditProfileScreen,
  ForgotPasswordScreen,
  OrderDetailScreen,
  OrderScreen,
  PaymentMethodScreen,
  ProfileScreen,
  RecentlyViewScreen,
  SaveCardScreen,
  SavedAddressScreen,
  ShippingScreen,
  SingleProductScreen,
  SubCategoriesScreen,
  UserEntry,
  Shop,
  SubcategoriesOption,
  CheckoutDetails,
  ContactUs,
  WishList,
  Notification,
  PaypalPayment,
} from '../screens';
import { AText } from '../theme-components';
import ShippingMethodScreen from '../screens/checkout/ShippingMethodScreen';
import Colors from '../constants/Colors';
import Navigation from './';
import NavigationConstants from './NavigationConstants';
const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const DrawerHeaderContent = (props) => {
    return (
      <DrawerContentScrollView
        contentContainerStyle={{ flex: 1, backgroundColor: APP_PRIMARY_COLOR }}>
        <ImageBackground
          source={require('../assets/images/drawer.png')}
          style={styles.backgroundImage}>
          <View style={styles.drawerHeader}>
            <Text style={styles.drawerHeaderText}>Ravendel</Text>
          </View>
          <ScrollView style={{ marginTop: 80 }}>
            <DrawerItemList {...props} />
            <AText
              ml="5px"
              mt="25px"
              mb="5px"
              color="#ABA7A7"
              fonts={FontStyle.fontBold}>
              © 2024 copyright:Ravendel
            </AText>
          </ScrollView>
        </ImageBackground>
      </DrawerContentScrollView>
    );
  };

  return (
    <Drawer.Navigator
      screenOptions={{
        unmountOnBlur: true,
        drawerStyle: {
          backgroundColor: '#fff',
        },
        headerShown: false,
        drawerActiveTintColor: APP_PRIMARY_COLOR,
        drawerItemStyle: {
          borderBottomColor: '#ABA7A7',
          borderBottomWidth: 0.5,
          backgroundColor: 'transparent',
          marginLeft: 20,
          fontSize: 12,
        },
        drawerInactiveTintColor: '#ABA7A7',
      }}
      backBehavior="history"
      initialRouteName="Home"
      drawerContent={DrawerHeaderContent}>
      <Drawer.Screen
        name={NavigationConstants.HOME_SCREEN}
        component={Navigation}
        options={{
          drawerStyle: {
            backgroundColor: '#1c6765',
          },
          drawerLabel: 'Home',
          drawerIcon: ({ focused, size, color }) => (
            <Feather
              name="home"
              color={focused ? APP_PRIMARY_COLOR : Colors.grayColor}
              size={size}
            />
          ),
        }}
      />
      {/* Categories */}
      <Drawer.Screen
        name={NavigationConstants.SHOP_SCREEN}
        component={Shop}
        options={{
          unmountOnBlur: true,
          drawerLabel: 'Shop',
          drawerIcon: ({ focused, size, color }) => (
            <Feather name="shopping-bag" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name={NavigationConstants.CATEGORIES_SCREEN}
        component={CategoriesScreen}
        options={{
          unmountOnBlur: true,
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name={NavigationConstants.SUBCATEGORIES_OPTION_SCREEN}
        component={SubcategoriesOption}
        options={{
          unmountOnBlur: true,
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name={NavigationConstants.SUBCATEGORIES_SCREEN}
        component={SubCategoriesScreen}
        options={{
          unmountOnBlur: true,
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name={NavigationConstants.CATEGORY_SCREEN}
        component={CategoryScreen}
        options={{
          unmountOnBlur: true,
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name={NavigationConstants.SINGLE_PRODUCT_SCREEN}
        component={SingleProductScreen}
        options={{
          unmountOnBlur: true,
          drawerItemStyle: { display: 'none' },
        }}
      />
      {/* Categories End */}
      <Drawer.Screen
        name={NavigationConstants.ORDERS_SCREEN}
        component={OrderScreen}
        options={{
          drawerLabel: 'My Orders',
          drawerIcon: ({ focused, size, color }) => (
            <Feather name="trello" color={color} size={size} />
          ),
        }}
      />

      {/* Cart*/}
      <Drawer.Screen
        name={NavigationConstants.CART_SCREEN}
        component={CartScreen}
        options={{
          drawerLabel: 'My Cart',
          drawerIcon: ({ focused, size, color }) => (
            <Feather name="shopping-cart" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name={NavigationConstants.SHIPPING_SCREEN}
        component={ShippingScreen}
        options={{
          unmountOnBlur: true,
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name={NavigationConstants.PAYMENT_METHOD_SCREEN}
        component={PaymentMethodScreen}
        options={{
          unmountOnBlur: true,
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name={NavigationConstants.SHIPPING_METHOD_SCREEN}
        component={ShippingMethodScreen}
        options={{
          unmountOnBlur: true,
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name={NavigationConstants.CHECKOUT_SCREEN}
        component={CheckoutScreen}
        options={{
          unmountOnBlur: true,
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name={NavigationConstants.CHECKOUT_DETAILS_SCREEN}
        component={CheckoutDetails}
        options={{
          unmountOnBlur: true,
          drawerItemStyle: { display: 'none' },
        }}
      />
      {/* Cart End */}

      {/* Account */}
      <Drawer.Screen
        name={NavigationConstants.ACCOUNT_SCREEN}
        component={AccountScreen}
        options={{
          unmountOnBlur: false,
          drawerLabel: 'My Account',
          drawerIcon: ({ focused, size, color }) => (
            <Feather name="user" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name={NavigationConstants.PROFILE_SCREEN}
        component={ProfileScreen}
        options={{
          unmountOnBlur: true,
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name={NavigationConstants.WISHLIST}
        component={WishList}
        options={{
          unmountOnBlur: true,
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name={NavigationConstants.PAYPAL_PAYMENT}
        component={PaypalPayment}
        options={{
          unmountOnBlur: true,
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name={NavigationConstants.SAVED_ADDRESS_SCREEN}
        component={SavedAddressScreen}
        options={{
          unmountOnBlur: true,
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name={NavigationConstants.RECENTLY_VIEWED_SCREEN}
        component={RecentlyViewScreen}
        options={{
          unmountOnBlur: true,
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name={NavigationConstants.SAVE_CARDS_SCREEN}
        component={SaveCardScreen}
        options={{
          unmountOnBlur: true,
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name={NavigationConstants.LOGIN_SIGNUP_SCREEN}
        component={UserEntry}
        options={{
          unmountOnBlur: true,
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name={NavigationConstants.FORGOT_PASSWORD_SCREEN}
        component={ForgotPasswordScreen}
        options={{
          unmountOnBlur: true,
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name={NavigationConstants.ORDER_DETAIL_SCREEN}
        component={OrderDetailScreen}
        options={{
          unmountOnBlur: true,
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name={NavigationConstants.EDIT_PROFILE_SCREEN}
        component={EditProfileScreen}
        options={{
          unmountOnBlur: true,
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name={NavigationConstants.CHANGE_PASSWORD_SCREEN}
        component={ChangePasswordScreen}
        options={{
          unmountOnBlur: true,
          drawerItemStyle: { display: 'none' },
        }}
      />
      {/* Account End */}
      <Drawer.Screen
        name={NavigationConstants.NOTIFICATION}
        component={Notification}
        options={{
          drawerLabel: 'Notification',
          drawerIcon: ({ focused, size, color }) => (
            <Feather name="bell" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name={'Contact us'}
        component={ContactUs}
        options={{
          drawerItemStyle: {
            borderBottomColor: '#ABA7A7',
            borderBottomWidth: 0.5,
            backgroundColor: 'transparent',
            marginLeft: 20,
            marginTop: 40,
          },
        }}
      />
      <Drawer.Screen name={'About us'} component={CartScreen} />
      <Drawer.Screen name={'Privacy Policy'} component={CartScreen} />
      <Drawer.Screen name={'Help'} component={CartScreen} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  headerLeft: {
    marginLeft: 15,
  },

  // drawer content
  drawerLabel: {
    fontSize: 14,
  },

  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  drawerHeader: {
    marginTop: 50,
    marginBottom: 20,
    paddingLeft: 10,
  },
  drawerHeaderText: {
    color: Colors.whiteColor,
    fontSize: 27,
    fontWeight: 'bold',
  },
});

export default DrawerNavigator;
