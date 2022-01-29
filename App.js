import React, {useState} from 'react';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import reduxThunk from 'redux-thunk';
import AppNavigator from './navigation/appNavigator';
import spotReducer from './store/reducer/spots';
import basketReducer from './store/reducer/basket';
import orderReducter from './store/reducer/orders';
import authReducer from './store/reducer/auth';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';

const rootReducer = combineReducers({
  spots: spotReducer,
  basket: basketReducer,
  orders: orderReducter,
  auth: authReducer
});

// const store = createStore(rootReducer, composeWithDevTools()); // dev only remove for production
const store = createStore(rootReducer, applyMiddleware(reduxThunk)); // production

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
        <AppNavigator />
    </Provider>
  );
}