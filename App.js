import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import store from './app/store';
import { Provider } from 'react-redux';
import { ApolloProvider } from '@apollo/react-hooks';
import APclient from './app/Client';
import { NavigationContainer } from '@react-navigation/native';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { LogBox } from 'react-native';
import { Splash } from './app/screens';
import AlertError from './app/theme-components/alert';
import { APP_NAME_SMALL, updatePrimaryColor } from './app/utils/config';
import Navigation from './app/navigation';
import { getValue } from './app/utils/helper';

// XMLHttpRequest = GLOBAL.originalXMLHttpRequest
//   ? GLOBAL.originalXMLHttpRequest
//   : GLOBAL.XMLHttpRequest;

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#000',
    accent: '#000',
  },
};
const App = () => {
  LogBox.ignoreLogs(['Node of type rule not supported as an inline style']);
  LogBox.ignoreLogs([
    'ViewPropTypes will be removed from React Native, along with all other PropTypes ...',
    'NativeBase: The contrast ratio of',
    "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
  ]);
  const [splash, setSplash] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setSplash(false);
    }, 2000);
  });

  const updateColor = async () => {
    const color = await getValue('PrimaryColor');
    const image = await getValue('PlaceholderImage');
    updatePrimaryColor(color,image);
  };

  useEffect(() => {
    updateColor();
  }, []);

  const linking = {
    prefixes: [`${APP_NAME_SMALL}://`, `https://${APP_NAME_SMALL}`],
    config: {
      initialRouteName: 'Home',
      screens: {
        Home: {
          path: 'Home',
        },
        OrdersDetail: {
          path: 'OrdersDetail/:orderId',
        },
      },
    },
  };

  return (
    <>
      <Provider store={store}>
        <ApolloProvider client={APclient}>
          <PaperProvider theme={theme}>
            <NavigationContainer linking={linking}>
              {splash ? <Splash /> : <Navigation />}
            </NavigationContainer>
            <AlertError />
          </PaperProvider>
        </ApolloProvider>
      </Provider>
    </>
  );
};

export default App;
