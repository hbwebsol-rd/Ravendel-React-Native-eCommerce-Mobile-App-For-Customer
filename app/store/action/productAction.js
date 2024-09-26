import {
  GET_PRODUCTS,
  GET_CATEGORIES,
  GET_PRODUCT,
  GET_CAT_PRODUCTS,
  GET_PRODUCT_REVIEWS,
  ADD_REVIEW,
  GET_ALL_CATEGORIES,
  GET_FILTEREDPRODUCTS,
  GET_RELATED_PRODUCTS_QUERY,
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
    console.log('error in PA');
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

export const catProductAction = (filter, isFilter) => async (dispatch) => {
  dispatch({ type: PRODUCT_LOADING });

  try {
    let response;
    if (!isFilter) {
      response = await query(GET_PRODUCTS);
    } else {
      response = await query(GET_FILTEREDPRODUCTS, { filter: filter });
    }

    return dispatch({
      type: CAT_PRODUCTS,
      payload: _.get(
        response,
        'data.filteredProducts',
        _.get(response, 'data.products.data', []),
      ),
    });
  } catch (error) {
    console.log(error, 'error when fetching products');
    dispatch({ type: PRODUCT_FAIL });
    return dispatch({
      type: PRODUCT_FAIL,
      payload: { boolean: true, message: error, error: true },
    });
  }
};

export const catRecentProductAction = (recentPayload) => async (dispatch) => {
  try {
    const response = await query(GET_RELATED_PRODUCTS_QUERY, recentPayload);
    console.log(response, 'Similar Products Data');

    if (!isEmpty(_.get(response, 'data.relatedProducts'))) {
      return dispatch({
        type: RELATED_CAT_PRODUCTS,
        payload: _.get(response, 'data.relatedProducts', []),
      });
    } else {
      dispatch({ type: PRODUCT_FAIL });
      return dispatch({ type: RELATED_CAT_PRODUCTS, payload: [] });
    }
  } catch (error) {
    console.log(error, 'error when fetching products');
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
        payload: _.get(response, 'data.productwisereview.data', []),
      });
    }
  } catch (error) {
    console.log('erro in PRA');
    dispatch({ type: PRODUCT_FAIL });
    return dispatch({
      type: PRODUCT_FAIL,
      payload: { boolean: true, message: error, error: true },
    });
  }
};

export const productAddReviewAction = (object) => async (dispatch) => {
  dispatch({ type: PRODUCT_LOADING });

  const response = await mutation(ADD_REVIEW, object);
  try {
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
