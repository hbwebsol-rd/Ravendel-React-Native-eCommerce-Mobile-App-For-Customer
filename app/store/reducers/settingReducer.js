import {
  GET_THEME_VALUE,
  SETTING_LOADING,
  SETTING_FAIL,
  RECENT_ADD__PRODUCT,
  SALE_PRODUCTS,
  CATEGORY_PRODUCT,
  GET_FEATURE_PRODUCT,
  GET_BRANDS,
  GET_ALL_DATA,
} from '../action/settingAction';

const initialState = {
  themeSettings: [],
  loading: false,
  success: false,
  homeslider: [],
  homeData: '',
  featureData: [],
  recentAddedProduct: [],
  saleProduct: [],
  appTitle: '',
  ProductByCategory: [],
  currencyOptions: [],
  currencySymbol: '',
  brands: [],
  paymentSetting: {},
  allData: {
    brands: [],
    featureData: [],
    recentAddedProduct: [],
    saleProduct: [],
    ProductByCategory: [],
  },
  manage_stock: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_THEME_VALUE:
      return {
        ...state,
        themeSettings: action.payload.themeSettings,
        homeslider: action.payload.homeslider,
        homeData: action.payload.homeData,
        loading: false,
        success: true,
        appTitle: action.payload.title,
        currencyOptions: action.payload.store.currency_options,
        currencySymbol: action.payload.currencySymbol,
        manage_stock: action.payload.store.inventory.manage_stock,
        paymentSetting: action.payload.payment,
      };
    case GET_FEATURE_PRODUCT:
      return {
        ...state,
        featureData: action.payload,
        loading: false,
      };
    case RECENT_ADD__PRODUCT:
      return {
        ...state,
        recentAddedProduct: action.payload,
        loading: false,
      };
    case SALE_PRODUCTS:
      return {
        ...state,
        saleProduct: action.payload,
        loading: false,
      };
    case CATEGORY_PRODUCT:
      return {
        ...state,
        ProductByCategory: action.payload,
        loading: false,
      };
    case SETTING_LOADING:
      return {
        ...state,
        loading: true,
        success: false,
      };
    case SETTING_FAIL:
      return {
        ...state,
        loading: false,
        success: false,
      };
    case GET_BRANDS:
      return {
        ...state,
        loading: false,
        brands: action.payload,
      };
    case GET_ALL_DATA:
      return {
        ...state,
        loading: false,
        allData: action.payload,
      };
    default: {
      return state;
    }
  }
};
