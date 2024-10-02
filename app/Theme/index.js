import { StyleSheet } from 'react-native';
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
    width: 15,
    height: 15,
    backgroundColor: 'transparent',
    position: 'absolute',
    left: 7,
  },
});
export default Styles;
