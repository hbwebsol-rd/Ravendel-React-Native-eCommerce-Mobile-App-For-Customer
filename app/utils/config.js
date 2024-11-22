import { Dimensions } from 'react-native';

export const windowHeight = Dimensions.get('window').height;
export const windowWidth = Dimensions.get('window').width;
export let APP_PRIMARY_COLOR = '#088178';
export const updatePrimaryColor = async (color) => {
  APP_PRIMARY_COLOR = color ? color : APP_PRIMARY_COLOR;
};
export const APP_SECONDARY_COLOR = '#d8fefe';
export const GREYTEXT = '#ABA7A7';
export const LINE_COLOR = '#DCDCDC';

export const VERSION = '1.0.0';
export const dummyImage =
  'https://www.hbwebsol.com/wp-content/uploads/2020/07/category_dummy.png';

export const APP_NAME = 'RAVENDEL';
export const APP_NAME_CAP = 'Ravendel';
export const APP_NAME_SMALL = 'ravendel';
export const BASEURL = `https://demo1-ravendel.hbwebsol.com/`; //`https://zemjet.com/`;
export const ONE_SIGNAL_APP_ID = 'd001d0d4-16bc-4cd9-812a-25ee0150fee2';

export const FontStyle = {
  fontBold: 'SegoeUI-Bold',
  fontBoldItalic: 'SegoeUI-BoldItalic',
  fontItalic: 'SegoeUI-Italic',
  fontLight: 'SegoeUI-Light',
  fontRegular: 'SegoeUI',
  semiBold: 'SegoeUI-SemiBold',
};
