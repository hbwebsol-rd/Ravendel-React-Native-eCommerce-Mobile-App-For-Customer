import { StyleSheet } from 'react-native';
import {
  APP_PRIMARY_COLOR,
  APP_SECONDARY_COLOR,
  FontStyle,
  windowHeight,
} from '../utils/config';
import Colors from '../constants/Colors';

const Styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: Colors.whiteColor },

  bar1: {
    width: 35,
    height: 4,
    backgroundColor: 'black',
    marginBottom: 5,
    borderRadius: 5,
  },
  bar2: {
    width: 25,
    height: 4,
    backgroundColor: 'black',
    marginBottom: 5,
    borderRadius: 5,
  },
  iosBox: {
    borderColor: 'black',
    borderWidth: 1,
    width: 22,
    height: 22,
    backgroundColor: 'transparent',
    position: 'absolute',
    left: 7,
  },
});
export default Styles;
