import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerItemList } from '@react-navigation/drawer';

import { Platform, View, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import spotOverviewScreen, { screenOptions as overviewScreenOptions} from '../screens/shop/spotOverviewScreen';
import spotDetailScreen, { screenOptions as detailScreenOptions } from '../screens/shop/spotDetailScreen';
import basketScreen, {screenOptions as basketScreenOptions } from '../screens/shop/basketScreen';
import orderScreen, { screenOptions as orderScreenOptions } from '../screens/shop/ordersScreen';
import userSpotsScreen, { screenOptions as userSpotScreenOptions } from '../screens/user/userSpotScreen';
import editSpotScreen, { screenOptions as editSpotScreenOptions } from '../screens/user/editSpotScreen';
import authScreen, { screenOptions as authScreenOptions } from '../screens/user/authScreen';
import colours from '../constants/colours';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';

import * as authActions from '../store/actions/auth';
import { createAppContainer } from 'react-navigation';

const defaultNavOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === 'android' ? colours.primary : ''
  },
  headerTitleStyle: {
    fontFamily: 'open-sans-bold'
  },
  headerBackTitleStyle: {
    fontFamily: 'open-sans'
  },
  headerTintColor: Platform.OS === 'android' ? 'white' : colours.primary
};

const SpotStackNavigator = createStackNavigator();

const SpotNavigator = () => {
    return (
        <SpotStackNavigator.Navigator screenOptions={defaultNavOptions} >
            <SpotStackNavigator.Screen
                name="SpotsOverview"
                component={spotOverviewScreen}
                options={overviewScreenOptions}
            />
            <SpotStackNavigator.Screen
                name="SpotDetail"
                component={spotDetailScreen}
                options={detailScreenOptions}
            />
            <SpotStackNavigator.Screen
                name="Basket"
                component={basketScreen}
                options={basketScreenOptions}
            />
        </SpotStackNavigator.Navigator>
    );
};

const OrderStackNavigator = createStackNavigator();

const OrderNavigator = () => {
    return (
        <OrderStackNavigator.Navigator screenOptions={defaultNavOptions} >
            <OrderStackNavigator.Screen
                name="UserOrders"
                component={orderScreen}
                options={orderScreenOptions}
            />
        </OrderStackNavigator.Navigator>
    );
};

const AdminStackNavigator = createStackNavigator();

const AdminNavigator = () => {
    return (
        <AdminStackNavigator.Navigator screenOptions={defaultNavOptions} >
            <AdminStackNavigator.Screen
                name="UserSpots"
                component={userSpotsScreen}
                options={userSpotScreenOptions}
            />
            <AdminStackNavigator.Screen
                name="EditSpot"
                component={editSpotScreen}
                options={editSpotScreenOptions}
            />
        </AdminStackNavigator.Navigator>
    );
};

const AuthStackNavigator = createStackNavigator();

export const AuthNavigator = () => {

    return (

        <AuthStackNavigator.Navigator screenOptions={defaultNavOptions}>
            <AuthStackNavigator.Screen
                name="Auth"
                component={authScreen}
                options={authScreenOptions}
            />
        </AuthStackNavigator.Navigator>  
    );
      

};

const ShopDrawerNavigator = createDrawerNavigator();

export const ShopNavigator = () => {

    const dispatch = useDispatch();

    return (
        <ShopDrawerNavigator.Navigator
            drawerContent={(props) => {
                
                return (
                    <View style={{ flex: 1, paddingTop: 20 }}>
                        <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
                            <DrawerItemList {...props} />
                            <Button
                                title={'Logout'}
                                color={colours.primary}
                                onPress={() => {
                                    dispatch(authActions.logout())    
                                }}
                            />
                        </SafeAreaView>
                    </View>
                );
            }}
            screenOptions={{
                headerShown: false,
                activeTintColor: colours.primary
            }}>

            <ShopDrawerNavigator.Screen
                name="Spots"
                component={SpotNavigator}
                options={{
                    drawerIcon: (props) => (
                        <Ionicons
                            name={Platform.OS === 'android' ? 'md-basket' : 'ios-basket'}
                            size={23}
                            color={props.color}
                        />
                    )
                }}
            />
            <ShopDrawerNavigator.Screen
                name="Orders"
                component={OrderNavigator}
                options={{
                    drawerIcon: (props) => (
                        <Ionicons
                            name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
                            size={23}
                            color={props.color}
                        />
                    )
                }}
            />
            <ShopDrawerNavigator.Screen
                name="Admin"
                component={AdminNavigator}
                options={{
                    drawerIcon: (props) => (
                        <Ionicons
                            name={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
                            size={23}
                            color={props.color}
                        />
                    )
                }}
            />                
            
        </ShopDrawerNavigator.Navigator>
    );
};

export default createAppContainer(ShopNavigator);