import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';

import { NavigationContainer } from '@react-navigation/native';
import Navigation from './navigation/drawerNavigator';

import productReducer from './store/reducer/products';
import basketReducer from './store/reducer/basket';
import orderReducter from './store/reducer/orders';

import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';

// import {composeWithDevTools} from 'redux-devtools-extension'; // dev only remove for production

const rootReducer = combineReducers({
  products: productReducer,
  basket: basketReducer,
  orders: orderReducter
});

// const store = createStore(rootReducer, composeWithDevTools()); // dev only remove for production
const store = createStore(rootReducer); // production
const fetchFonts = () => {
  return Font.loadAsync({
    'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
    'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf')
  });
};


export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setFontLoaded(true)}
        onError={console.warn}
      />
    );
  }

  return (
    <Provider store={store}>
        <NavigationContainer>
            <Navigation />
        </NavigationContainer>
    </Provider>
  );
}