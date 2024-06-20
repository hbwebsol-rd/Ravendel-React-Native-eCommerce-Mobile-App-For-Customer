import AIcon from 'react-native-vector-icons/AntDesign';
import { ScrollView, StyleSheet, View } from 'react-native';
import { AText } from '.';
import { FontStyle } from '../utils/config';
const Header = ({ name, navigation }) => (
  <View style={styles.header}>
    <AIcon name="arrowleft" onPress={() => navigation.goBack()} size={22} />
    <AText large fonts={FontStyle.semiBold} ml="20px">
      {name}
    </AText>
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    position: 'static',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    left: 0,
    right: 0,
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 20,
    zIndex: 10,
  },
});
export default Header;
