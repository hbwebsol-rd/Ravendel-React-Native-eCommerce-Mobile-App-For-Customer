/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import store from './app/store';
import { Provider } from 'react-redux';
import { ApolloProvider } from '@apollo/react-hooks';
import APclient from './app/Client';
import { NavigationContainer } from '@react-navigation/native';
// import Navigation from './app/navigation';
import DrawerNavigator from './app/navigation/DrawerNavigator';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { LogBox } from 'react-native';
import { Splash } from './app/screens';
import AlertError from './app/theme-components/alert';
import { updatePrimaryColor } from './app/utils/config';
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
  const [splash, setSplash] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setSplash(false);
    }, 2000);
  });

  const updateColor = async () => {
    const col = await getValue('PrimaryColor');
    updatePrimaryColor(col);
  };

  useEffect(() => {
    updateColor();
  }, []);

  return (
    <>
      <Provider store={store}>
        <ApolloProvider client={APclient}>
          <PaperProvider theme={theme}>
            <NavigationContainer>
              {splash ? <Splash /> : <DrawerNavigator />}
            </NavigationContainer>
            <AlertError />
          </PaperProvider>
        </ApolloProvider>
      </Provider>
    </>
  );
};

export default App;
