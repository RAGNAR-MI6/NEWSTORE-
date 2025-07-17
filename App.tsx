/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import store from './redux/store';
import HomeScreen from './screens/HomeScreen';
import CartScreen from './screens/CartScreen';
import OrderConfirmationScreen from './screens/OrderConfirmationScreen';

const Stack = createStackNavigator();

function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Cart" component={CartScreen} />
          <Stack.Screen name="OrderConfirmation" component={OrderConfirmationScreen} options={{ title: 'Order Confirmation' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default App;
