import { GET_APP_SETTING } from '../../queries/appSetting';
import {
  FEATURE_CATEGORY,
  GET_BRANDS_QUERY,
  PRODUCT_BY_A_CATEGORY,
  RECENT_PRODUCT,
  SALE_PRODUCT,
} from '../../queries/productQuery';
import { isEmpty, storeData } from '../../utils/helper';
import { query } from '../../utils/service';
import _ from 'lodash';

export const AppSettingAction = () => async (dispatch) => {
  const response = await query(GET_APP_SETTING);
  try {
    if (!isEmpty(_.get(response, 'data.getSettings'))) {
      const currencyOptions = _.get(
        response,
        'data.getSettings.store.currency_options',
        {},
      );
      let crSymbol = '';
      if (
        currencyOptions.currency === 'usd' ||
        currencyOptions.currency === 'cad'
      ) {
        crSymbol =
          currencyOptions.currency_position === 'left_space' ? '$ ' : ' $';
      } else if (currencyOptions.currency === 'eur') {
        crSymbol =
          currencyOptions.currency_position === 'left_space' ? '€ ' : ' €';
      } else if (currencyOptions.currency === 'gbp') {
        crSymbol =
          currencyOptions.currency_position === 'left_space' ? '£ ' : ' £';
      } else if (currencyOptions.currency === 'inr') {
        crSymbol =
          currencyOptions.currency_position === 'left_space' ? '₹ ' : ' ₹';
      }
      storeData(
        'PrimaryColor',
        _.get(response, 'data.getSettings.appearance.theme.primary_color', ''),
      );

      return dispatch({
        type: GET_THEME_VALUE,
        payload: {
          homeslider: _.get(
            response,
            'data.getSettings.appearance.mobile.slider',
            [],
          ),
          homeData: _.get(
            response,
            'data.getSettings.appearance.mobile.mobile_section',
            {},
          ),
          themeSettings: _.get(
            response,
            'data.getSettings.appearance.theme',
            {},
          ),
          title: _.get(response, 'data.getSettings.seo.meta_title', ''),
          store: _.get(response, 'data.getSettings.store', {}),
          currencySymbol: crSymbol,
        },
      });
    }
  } catch (error) {
    dispatch({ type: SETTING_FAIL });
  }
};

export const featureDataAction = () => async (dispatch) => {
  dispatch({ type: SETTING_LOADING });

  try {
    const response = await query(FEATURE_CATEGORY);

    if (!isEmpty(_.get(response, 'data.featureproducts'))) {
      return dispatch({
        type: GET_FEATURE_PRODUCT,
        payload: _.get(response, 'data.featureproducts', []),
      });
    }
  } catch (error) {
    dispatch({ type: SETTING_FAIL });
  }
};

export const brandAction = () => async (dispatch) => {
  dispatch({ type: SETTING_LOADING });

  try {
    const response = await query(GET_BRANDS_QUERY);

    if (!isEmpty(_.get(response, 'data.brands'))) {
      return dispatch({
        type: GET_BRANDS,
        payload: _.get(response, 'data.brands.data', []),
      });
    }
  } catch (error) {
    dispatch({ type: SETTING_FAIL });
  }
};

export const recentaddedproductAction = () => async (dispatch) => {
  dispatch({ type: SETTING_LOADING });

  try {
    const response = await query(RECENT_PRODUCT);

    if (!isEmpty(_.get(response, 'data.recentproducts'))) {
      return dispatch({
        type: RECENT_ADD__PRODUCT,
        payload: _.get(response, 'data.recentproducts', []),
      });
    }
  } catch (error) {
    dispatch({ type: SETTING_FAIL });
  }
};

export const productOnSaleAction = () => async (dispatch) => {
  dispatch({ type: SETTING_LOADING });

  try {
    const response = await query(SALE_PRODUCT);

    if (!isEmpty(_.get(response, 'data.onSaleProducts'))) {
      return dispatch({
        type: SALE_PRODUCTS,
        payload: _.get(response, 'data.onSaleProducts', []),
      });
    }
  } catch (error) {
    dispatch({ type: SETTING_FAIL });
  }
};

export const productByPerticulareAction = (payload) => async (dispatch) => {
  dispatch({ type: SETTING_LOADING });

  try {
    const response = await query(PRODUCT_BY_A_CATEGORY, { id: payload });

    if (!isEmpty(_.get(response, 'data.productsbycatid'))) {
      return dispatch({
        type: CATEGORY_PRODUCT,
        payload: _.get(response, 'data.productsbycatid', []),
      });
    }
  } catch (error) {
    dispatch({ type: SETTING_FAIL });
  }
};
export const SETTING_LOADING = 'SETTING_LOADING';
export const GET_THEME_VALUE = 'GET_THEME_VALUE';
export const SETTING_FAIL = 'SETTING_FAIL';
export const GET_FEATURE_PRODUCT = 'GET_FEATURE_PRODUCT';
export const RECENT_ADD__PRODUCT = 'RECENT_ADD__PRODUCT';
export const SALE_PRODUCTS = 'SALE_PRODUCTS ';
export const CATEGORY_PRODUCT = 'CATEGORY_PRODUCT ';
export const GET_BRANDS = 'GET_BRANDS ';
