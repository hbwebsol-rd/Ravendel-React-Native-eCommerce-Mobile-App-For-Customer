import {
  GET_PRODUCTS,
  GET_CATEGORIES,
  GET_PRODUCT,
  GET_PRODUCT_REVIEWS,
  ADD_REVIEW,
  GET_RELATED_PRODUCTS_QUERY,
  GET_FILTEREDPRODUCTS_WITH_PAGINATION,
  GET_SEARCH_PRODUCTS,
  GET_ADDITIONAL_PRODUCTS_QUERY,
  GET_CARTADDITIONAL_PRODUCTS_QUERY,
} from '../../queries/productQuery';
import { isEmpty } from '../../utils/helper';
import { mutation, query } from '../../utils/service';
import { ALERT_ERROR } from '../reducers/alert';
import _ from 'lodash';

export const productsAction = () => async (dispatch) => {
  dispatch({ type: PRODUCT_LOADING });

  try {
    const response = await query(GET_PRODUCTS);

    if (!isEmpty(response) && !isEmpty(_.get(response, 'data.products'))) {
      return dispatch({
        type: PRODUCTS_SUCCESS,
        payload: _.get(response, 'data.products.data', []),
      });
    }
  } catch (error) {
    dispatch({ type: PRODUCT_FAIL });
    return dispatch({
      type: PRODUCT_FAIL,
      payload: { boolean: true, message: error, error: true },
    });
  }
};

export const productAction = (id) => async (dispatch) => {
  dispatch({ type: PRODUCT_LOADING });
  try {
    const response = await query(GET_PRODUCT, { url: id });

    if (!isEmpty(response) && !isEmpty(_.get(response, 'data.productbyurl'))) {
      return dispatch({
        type: PRODUCT_SUCCESS,
        payload: _.get(response, 'data.productbyurl.data', {}),
      });
    }
  } catch (error) {
    dispatch({ type: PRODUCT_FAIL });
    return dispatch({
      type: PRODUCT_FAIL,
      payload: { boolean: true, message: error, error: true },
    });
  }
};

export const categoriesAction = () => async (dispatch) => {
  dispatch({ type: CAT_LOADING });

  try {
    const response = await query(GET_CATEGORIES);

    if (
      !isEmpty(response) &&
      !isEmpty(_.get(response, 'data.productCategories'))
    ) {
      return dispatch({
        type: CATS_SUCCESS,
        payload: _.get(response, 'data.productCategories', []),
      });
    }
  } catch (error) {
    dispatch({ type: CAT_FAIL });
    return dispatch({
      type: CAT_FAIL,
      payload: { boolean: true, message: error, error: true },
    });
  }
};

export const getSubcategories = (payload) => async (dispatch) => {
  dispatch({ type: CAT_LOADING });
  try {
    const response = await query(GET_FILTEREDPRODUCTS_WITH_PAGINATION, payload);
    if (!isEmpty(response) && !isEmpty(_.get(response, 'data'))) {
      return dispatch({
        type: SUB_CATS_SUCCESS,
        payload: _.get(response, 'data', []),
      });
    }
  } catch (error) {
    dispatch({ type: CAT_FAIL });
    return dispatch({
      type: CAT_FAIL,
      payload: { boolean: true, message: error, error: true },
    });
  }
};

export const catProductAction =
  (filters, loading, setLoader, setCurrentPage, currentPage) =>
    async (dispatch) => {
      if (!loading) {
        dispatch({ type: PRODUCT_LOADING });
      }

      try {
        let response;

        response = await query(GET_FILTEREDPRODUCTS_WITH_PAGINATION, filters);
        console.log(JSON.stringify(response.data.getCategoryPageData.filterData),'new filter apply')
        dispatch({
          type: CAT_PRODUCTS,
          payload: {
            products: _.get(
              response,
              'data.getCategoryPageData.productData.products',
              [],
            ),
            counts: _.get(
              response,
              'data.getCategoryPageData.productData.count',
              1,
            ),
            filterData: _.get(
              response,
              'data.getCategoryPageData.filterData',
              [],
            ),
          },
        });
        setLoader ? setLoader(false) : null;
        setCurrentPage ? setCurrentPage(currentPage + 1) : null;
      } catch (error) {
        dispatch({ type: PRODUCT_FAIL });
        return dispatch({
          type: PRODUCT_FAIL,
          payload: { boolean: true, message: error, error: true },
        });
      }
    };

export const catProductSearchAction =
  (filters, loading, setLoader, setCurrentPage, currentPage) =>
    async (dispatch) => {
      if (!loading) {
        dispatch({ type: PRODUCT_LOADING });
      }

      try {
        const response = await query(GET_SEARCH_PRODUCTS, filters);
        dispatch({
          type: CAT_PRODUCTS,
          payload: {
            products: _.get(response, 'data.searchProducts.products', []),
            counts: _.get(
              response,
              'data.getCategoryPageData.productData.count',
              1,
            ),
            filterData: _.get(
              response,
              'data.getCategoryPageData.filterData',
              [],
            ),
          },
        });
        setLoader ? setLoader(false) : null;
        setCurrentPage ? setCurrentPage(currentPage + 1) : null;
      } catch (error) {
        dispatch({ type: PRODUCT_FAIL });
        return dispatch({
          type: PRODUCT_FAIL,
          payload: { boolean: true, message: error, error: true },
        });
      }
    };

export const catRecentProductAction = (recentPayload) => async (dispatch) => {
  try {
    const response = await query(GET_ADDITIONAL_PRODUCTS_QUERY, recentPayload);

    if (!isEmpty(_.get(response, 'data.additionalDetails'))) {
      return dispatch({
        type: RELATED_CAT_PRODUCTS,
        payload: _.get(response, 'data.additionalDetails', []),
      });
    } else {
      dispatch({ type: PRODUCT_FAIL });
      return dispatch({ type: RELATED_CAT_PRODUCTS, payload: [] });
    }
  } catch (error) {
    dispatch({ type: PRODUCT_FAIL });
    return dispatch({
      type: PRODUCT_FAIL,
      payload: { boolean: true, message: error, error: true },
    });
  }
};
export const catAdditionalProductAction = (recentPayload) => async (dispatch) => {
  try {
    const response = await query(GET_CARTADDITIONAL_PRODUCTS_QUERY, recentPayload);
    if (!isEmpty(_.get(response, 'data.cartAdditionalDetails'))) {
      return dispatch({
        type: 'RELATED_CART_PRODUCTS',
        payload: _.get(response, 'data.cartAdditionalDetails', []),
      });
    } else {
      dispatch({ type: PRODUCT_FAIL });
      return dispatch({ type: 'RELATED_CART_PRODUCTS', payload: [] });
    }
  } catch (error) {
    dispatch({ type: PRODUCT_FAIL });
    return dispatch({
      type: PRODUCT_FAIL,
      payload: { boolean: true, message: error, error: true },
    });
  }
};

export const productReviewsAction = (id) => async (dispatch) => {
  dispatch({ type: PRODUCT_LOADING });

  try {
    const response = await query(GET_PRODUCT_REVIEWS, { id: id });

    if (isEmpty(_.get(response, 'data.productwise_Review'))) {
      return dispatch({
        type: PRODUCT_REVIEWS,
        payload: _.get(response, 'data.productwisereview.reviews', []),
      });
    }
  } catch (error) {
    dispatch({ type: PRODUCT_FAIL });
    return dispatch({
      type: PRODUCT_FAIL,
      payload: { boolean: true, message: error, error: true },
    });
  }
};

export const productAddReviewAction = (object) => async (dispatch) => {
  dispatch({ type: PRODUCT_LOADING });

  try {
    const response = await mutation(ADD_REVIEW, object);
    if (
      !isEmpty(_.get(response, 'data.addReview')) &&
      _.get(response, 'data.addReview.success')
    ) {
      dispatch({
        type: ADD_PRODUCT_REVIEWS,
        payload: _.get(response, 'data.addReview', {}),
      });
    } else {
      dispatch({ type: PRODUCT_FAIL });
      dispatch({
        type: ALERT_ERROR,
        payload: _.get(
          response,
          'data.addReview.message',
          'Something went wrong',
        ),
      });
    }
  } catch (error) {
    dispatch({ type: PRODUCT_FAIL });
  }
};

export const CAT_LOADING = 'CAT_LOADING';
export const CATS_SUCCESS = 'CATS_SUCCESS';
export const SUB_CATS_SUCCESS = 'SUB_CATS_SUCCESS';
export const CLEAR_SUBCATEGORY = 'CLEAR_SUBCATEGORY';
export const CAT_FAIL = 'CAT_FAIL';
export const CAT_SUCCESS = 'CAT_SUCCESS';
export const PRODUCT_LOADING = 'PRODUCT_LOADING';
export const PRODUCT_SUCCESS = 'PRODUCT_SUCCESS';
export const PRODUCTS_SUCCESS = 'PRODUCTS_SUCCESS';
export const PRODUCT_FAIL = 'PRODUCT_FAIL';
export const CAT_PRODUCTS = 'CAT_PRODUCTS';
export const RELATED_CAT_PRODUCTS = 'RELATED_CAT_PRODUCTS';
export const CAT_PRODUCTS_CLEAR = 'CAT_PRODUCTS_CLEAR';
export const PRODUCT_REVIEWS = 'PRODUCT_REVIEWS';
export const PRODUCT_CLEAR = 'PRODUCT_CLEAR';
export const ADD_PRODUCT_REVIEWS = 'ADD_PRODUCT_REVIEWS';
export const ALL_CATEGORIES = 'ALL_CATEGORIES';
export const SINGLE_CATEGORY = 'SINGLE_CATEGORY';
export const CLEAR_SEARCH_PRODUCT = 'CLEAR_SEARCH_PRODUCT';
