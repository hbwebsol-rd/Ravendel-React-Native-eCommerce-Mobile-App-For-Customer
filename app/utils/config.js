import { Dimensions, PixelRatio } from 'react-native';
import { getValue } from './helper';

export const windowHeight = Dimensions.get('window').height;
export const windowWidth = Dimensions.get('window').width;
export let APP_PRIMARY_COLOR = '#088178';
export const updatePrimaryColor = async (color) => {
  APP_PRIMARY_COLOR = color ? color : APP_PRIMARY_COLOR;
};
export const APP_SECONDARY_COLOR = '#d8fefe';
export const GREYTEXT = '#ABA7A7';
export const LINE_COLOR = '#DCDCDC';
export const PENDING_CALL = '#8D8D8D';
export const INPROGRESS_CALL = '#F8B027';
export const COMPLETE_CALL = '#398E1F';

export const DEVELOPMENT_URL = 'http://192.168.1.32:8000/api/';
export const PRODUCTION_URL = 'https://revendal-image.s3.amazonaws.com/';
export const VERSION = '1.0.0';
export const callngVriable = '__c';
export const dummyImage =
  'https://www.hbwebsol.com/wp-content/uploads/2020/07/category_dummy.png';
// export const DATABASE_CONFIG = {
//   location: 'default'
// };
export const APP_ID = 3;
export const FORCE_OFFLINE = false;
export const STUDY_END_WINDOW = 60000;
export const EMAIL_REGEXP =
  /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
export const PLEASE_WAIT = 'Please wait...';
export const PLEASE_WAIT_MESSAGE = 'Please wait...';
export const ERROR = 'SOMETHING WENT WRONG.';
export const NO_DATA_FOUND = 'Sorry! No Data  Found.';
export const NO_ACCESS_MSG = "Sorry! you don't have access to this app.";

export const FontStyle = {
  // fontBlack: 'Poppins-Black',
  fontBold: 'SegoeUI-Bold',
  fontBoldItalic: 'SegoeUI-BoldItalic',
  fontItalic: 'SegoeUI-Italic',
  fontLight: 'SegoeUI-Light',
  // fontMedium: 'Poppins-Medium',
  // fontMediumItalic: 'Poppins-MediumItalic',
  fontRegular: 'SegoeUI',
  // fontUltra: 'NeoUltra',
  // fontBlackItalic: 'Poppins-BlackItalic',
  semiBold: 'SegoeUI-SemiBold',
};

export const normalizeSize = (size, multiplier = 2) => {
  const scale = (windowWidth / windowHeight) * multiplier;
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};
