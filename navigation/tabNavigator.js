import React from 'react';
import {Platform} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Ionicons} from '@expo/vector-icons';
import colours from '../constants/colours';
import {MainStackNavigator, BasketStackNavigator, OrderStackNavigator} from './stackNavigator';

const Tab = createBottomTabNavigator();

const tabNavigator = () => {

    return (
        <Tab.Navigator
            screenOptions={({route}) => ({
                tabBarIcon: ({}) => {
                    let name = '';
                    let size = 23;
                    let colour = '';

                    switch(route.name) {
                        case 'TabBasket':
                            name = Platform.OS === 'android' ? 'md-basket' : 'ios-basket';
                            break;
                        case 'TabOrders':
                            name = Platform.OS === 'android' ? 'md-list' : 'ios-list';
                            break;
                        case 'TabHome':
                            name = Platform.OS === 'android' ? 'md-arrow-back' : 'ios-arrow-back';
                            break;
                        default:
                            name = Platform.OS === 'android' ? 'md-list' : 'ios-list';
                    }
                    
                    return <Ionicons 
                                name={name}
                                size={23}
                                color={colours.primary}
                            />;
                },
                tabBarActiveTintColor: colours.primary,
                tabBarInactiveTintColor: 'gray'
            })}
        >
            <Tab.Screen 
                name="TabHome" 
                component={MainStackNavigator}
                options={{
                    title: 'Back',
                    headerShown: false
                }}
            />
            <Tab.Screen 
                name="TabOrders" 
                component={OrderStackNavigator}
                options={{
                    title: 'Orders',
                    headerShown: false
                }}
            />
            <Tab.Screen 
                name="TabBasket" 
                component={BasketStackNavigator}
                options={{
                    title: 'Basket',
                    headerShown: false
                }}
            />
        </Tab.Navigator>
    );
}

export default tabNavigator;