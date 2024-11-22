import { combineReducers } from 'redux';

import login from './loginReducer';
import settings from './settingReducer';
import cart from './cartReducer';
import products from './productReducers';
import checkoutDetail from './checkoutReducer';
import customer from './customerReducer';
import alert from './alert';
import orders from './orderReducer';

// Combine Reducers
const MasterReducer = combineReducers({
  login,
  settings,
  cart,
  products,
  checkoutDetail,
  customer,
  alert,
  orders
});

export default MasterReducer;
