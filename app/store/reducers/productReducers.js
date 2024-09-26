import {
  PRODUCT_LOADING,
  PRODUCT_FAIL,
  PRODUCT_SUCCESS,
  PRODUCTS_SUCCESS,
  CATS_SUCCESS,
  CAT_LOADING,
  CAT_FAIL,
  CAT_SUCCESS,
  CAT_PRODUCTS,
  PRODUCT_REVIEWS,
  ADD_PRODUCT_REVIEWS,
  ALL_CATEGORIES,
  SINGLE_CATEGORY,
  CAT_PRODUCTS_CLEAR,
  PRODUCT_CLEAR,
  RELATED_CAT_PRODUCTS,
  SUB_CATS_SUCCESS,
  CLEAR_SUBCATEGORY,
  CLEAR_SEARCH_PRODUCT,
} from '../action/productAction';

const initialState = {
  products: [],
  product: {
    name: '',
    categoryId: [],
    brand: {},
    sku: '',
    quantity: '',
    status: 'Draft',
    pricing: {
      price: 0,
      sellprice: null,
    },
    meta: {
      title: '',
      description: '',
      keywords: '',
    },
    shipping: {
      height: '',
      width: '',
      depth: '',
      weight: '',
      shipping_class: '',
    },
    tax_class: '',
    removed_image: [],
    featured_product: false,
    product_type: {
      virtual: false,
      downloadable: false,
    },
    custom_field: [],
    short_description: '',
  },
  relatedProducts: [],
  categories: [],
  subcategories: [],
  category: {},
  loading: false,
  success: false,
  singleCategoryDetails: [],
  productReviews: [],
  allCategories: [],
  singleCategory: [],
  totalCount: 0,
  filterData: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CAT_LOADING:
      return {
        ...state,
        loading: true,
        success: false,
      };
    case CATS_SUCCESS:
      return {
        ...state,
        categories: action.payload,
        loading: false,
        success: true,
      };
    case SUB_CATS_SUCCESS:
      return {
        ...state,
        subcategories: action.payload,
        loading: false,
        success: true,
      };
    case CLEAR_SUBCATEGORY:
      return {
        ...state,
        subcategories: [],
        loading: false,
        success: true,
      };
    case CAT_SUCCESS:
      return {
        ...state,
        category: action.payload,
        loading: false,
        success: true,
      };
    case CAT_FAIL:
      return {
        ...state,
        loading: false,
        success: false,
      };
    case PRODUCTS_SUCCESS:
      return {
        ...state,
        products: action.payload,
        loading: false,
        success: true,
      };
    case PRODUCT_LOADING:
      return {
        ...state,
        loading: true,
        success: false,
      };
    case PRODUCT_SUCCESS:
      return {
        ...state,
        product: action.payload,
        loading: false,
        success: true,
      };
    case PRODUCT_CLEAR:
      return {
        ...state,
        product: [],
        loading: false,
        success: true,
      };
    case ALL_CATEGORIES:
      return {
        ...state,
        allCategories: action.payload,
        loading: false,
        success: true,
      };
    case SINGLE_CATEGORY:
      return {
        ...state,
        singleCategory: action.payload,
        loading: false,
        success: true,
      };
    case CAT_PRODUCTS:
      return {
        ...state,
        singleCategoryDetails: action.payload.products,
        totalCount: action.payload.counts,
        filterData: action.payload.filterData,
        loading: false,
        success: true,
      };
    case RELATED_CAT_PRODUCTS:
      return {
        ...state,
        relatedProducts: action.payload,
        loading: false,
        success: true,
      };
    case CAT_PRODUCTS_CLEAR:
      console.log('clear products');
      return {
        ...state,
        singleCategoryDetails: [],
        loading: false,
        success: true,
      };
    case PRODUCT_REVIEWS:
      return {
        ...state,
        productReviews: action.payload,
        loading: false,
        success: true,
      };
    case CLEAR_SEARCH_PRODUCT:
      console.log(' clear productssss');
      return {
        ...state,
        singleCategoryDetails: [],
      };
    case ADD_PRODUCT_REVIEWS:
      return {
        ...state,
        loading: false,
        success: true,
      };
    case PRODUCT_FAIL:
      return {
        ...state,
        loading: false,
        success: false,
      };
    default:
      return state;
  }
};
