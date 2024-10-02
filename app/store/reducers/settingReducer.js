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
  storeAddress:'',
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
  allSections: [],
  manage_stock: false,
  stock_display_format:'',
  stock_left_quantity:0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_THEME_VALUE:
      return {
        ...state,
        themeSettings: action.payload.themeSettings,
        homeslider: action.payload.homeslider,
        homeData: action.payload.homeData,
        success: true,
        appTitle: action.payload.title,
        currencyOptions: action.payload.store.currency_options,
        currencySymbol: action.payload.currencySymbol,
        manage_stock: action.payload.store.inventory.manage_stock,
        stock_display_format:
          action.payload.store.inventory.stock_display_format,
        storeAddress:
        action.payload.store.store_address,
        stock_left_quantity: action.payload.store.inventory.left_quantity,
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
        // allData: action.payload,
        allSections: action.payload.allSection,
      };
    default: {
      return state;
    }
  }
};
