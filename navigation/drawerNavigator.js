import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {BasketStackNavigator, OrderStackNavigator, UserStackNavigator} from './stackNavigator';
import TabNavigator from './tabNavigator';
import {Ionicons} from '@expo/vector-icons';
import colours from '../constants/colours';

const Drawer = createDrawerNavigator();

const drawerNavigator = () => {
    return (
        <Drawer.Navigator>
            <Drawer.Screen 
                name='DrawerProductsOverview' 
                component={TabNavigator}
                options={{
                    title: 'FitMeIn',
                    drawerIcon: ({focused}) => (
                        <Ionicons
                           name="md-home"
                           size={23}
                           color={focused ? colours.primary : 'grey'}
                        />
                     )
                }}
            />
            <Drawer.Screen 
                name="DrawerOrders" 
                component={OrderStackNavigator} 
                options={{
                    title: 'Orders',
                    drawerIcon: ({focused}) => (
                        <Ionicons
                           name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
                           size={23}
                           color={focused ? colours.primary : 'grey'}
                        />
                     )
                }}
            />
            <Drawer.Screen 
                name="DrawerBasket" 
                component={BasketStackNavigator}
                options={{
                    title: 'Basket',
                    drawerIcon: ({focused}) => (
                        <Ionicons
                           name={Platform.OS === 'android' ? 'md-basket' : 'ios-basket'}
                           size={23}
                           color={focused ? colours.primary : 'grey'}
                        />
                     )
                }}
            />
            <Drawer.Screen 
                name="DrawerUserProducts" 
                component={UserStackNavigator}
                options={{
                    title: 'Your Products',
                    drawerIcon: ({focused}) => (
                        <Ionicons
                           name={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
                           size={23}
                           color={focused ? colours.primary : 'grey'}
                        />
                     )
                }}
            />
        </Drawer.Navigator>
    );
}

export default drawerNavigator;