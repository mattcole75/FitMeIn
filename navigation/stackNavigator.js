import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {Platform} from 'react-native';

import productsOverviewScreen from '../screens/shop/productsOverviewScreen';
import productDetailScreen from '../screens/shop/productDetailScreen';
import basketScreen from '../screens/shop/basketScreen';
import ordersScreen from '../screens/shop/ordersScreen';
import userProductScreen from '../screens/user/userProductScreen';
import userEditProductScreen from '../screens/user/editProductScreen';

import colours from '../constants/colours';

const Stack = createStackNavigator();

const defaultNavOptions = {
    headerStyle: {
        backgroundColor: Platform.OS === 'android' ? colours.primary : ''
    },
    headerTitleStyle: {
        fontFamily: 'open-sans-bold'
    },
    headerBackTitleStyle: {
        fontFamily: 'open-sans',
    },
    headerTintColor: Platform.OS === 'android' ? 'white' : colours.primary
};

const MainStackNavigator = () => {

    return (
        <Stack.Navigator 
            screenOptions={defaultNavOptions}>
            <Stack.Screen 
                name='ProductsOverview' 
                component={productsOverviewScreen} 
                options={{ title: 'Availble now'}} />
            <Stack.Screen 
                name='ProductDetail' 
                component={productDetailScreen} 
                options={({route}) => ({title: route.params.productTitle})} />
        </Stack.Navigator>
    );
}

const BasketStackNavigator = () => {

    return (
        <Stack.Navigator 
            screenOptions={defaultNavOptions}>
            <Stack.Screen 
                name='Basket' 
                component={basketScreen} 
                options={{title: 'Your basket'}} />
        </Stack.Navigator>
    );
}

const OrderStackNavigator = () => {

    return (
        <Stack.Navigator 
            screenOptions={defaultNavOptions}>
            <Stack.Screen 
                name='Orders' 
                component={ordersScreen}
                options={{title: 'Your orders'}} />
        </Stack.Navigator>
    );
}

const UserStackNavigator = () => {

    return (
        <Stack.Navigator 
            screenOptions={defaultNavOptions}>
            <Stack.Screen 
                name='UserProducts' 
                component={userProductScreen}
                options={{title: 'Your products'}} />
            <Stack.Screen 
                name='UserEditProduct' 
                component={userEditProductScreen}
                options={{title: 'Edit product'}} />
        </Stack.Navigator>
    );
}

export {MainStackNavigator, BasketStackNavigator, OrderStackNavigator, UserStackNavigator};