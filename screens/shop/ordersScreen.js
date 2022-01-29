import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, FlatList, StyleSheet, ActivityIndicator} from 'react-native';
import {useSelector, useDispatch} from 'react-redux'
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/ui/headerButton';
import * as orderActions from '../../store/actions/orders'; 
import Orderitem from '../../components/shop/orderItem';

import colours from '../../constants/colours';

const orderScreen = (props) => {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const items = useSelector(state => state.orders.items);
    const dispatch = useDispatch();

    const loadOrders = useCallback( async () => {
        setError(null);
        setIsLoading(true);
        try {
            await dispatch(orderActions.getOrders());
        } catch (error) {
            setError(error.msg);
        }
        setIsLoading(false);
    }, [dispatch, setIsLoading, setError]);

    useEffect(() => {
        if (error) {
            Alert.alert('Oops!', `${error}`, [{ text: 'Ok' }]);
        }
    }, [error]);

    useEffect(() => {
        const willFocusSubscription = props.navigation.addListener(
            'willFocus', 
            () => {
                loadOrders();
            }
        );
        return willFocusSubscription;
    }, [loadOrders]);

    useEffect(() => {
        loadOrders();

    }, [dispatch, loadOrders]);

    if(error) {
        return (
            <View style={styles.centred}>
                <Text style={styles.errorText}>An Error Ocurred</Text>
                <Text style={styles.errorText}>{error.msg}</Text>
                <Button color={colours.primary} 
                    title="Try again"
                    onPress={() => {setError(null)}}
                    color={colours.primary} 
                />

            </View>
        );
    }

    if(isLoading) {
        return (
            <View style={styles.centred}>
                <ActivityIndicator 
                    size='large'
                    color={colours.primary}                
                />
            </View>
        );
    }

    return (
        <FlatList
            onRefresh={loadOrders}
            refreshing={isLoading}
            data={items}
            keyExtractor={item => item.id}
            renderItem={itemData =>
                <Orderitem 
                    total={itemData.item.total}
                    date={itemData.item.textDate}
                    items={itemData.item.items}
                />
            }
        />
    );
};

export const screenOptions = (navData) => {
    return {
        headerTitle: 'Your Orders',
        headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item 
                    title='Menu' 
                    iconName={
                        Platform.OS === 'android' 
                        ? 'md-menu'
                        : 'ios-menu'
                    }
                    onPress={() => {
                        navData.navigation.toggleDrawer();
                    }}/>
            </HeaderButtons>
        )
    }
    
};

const styles = StyleSheet.create({
    centred: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    errorText: {
        fontFamily: 'open-sans-bold',
        marginVertical: 8,
        textAlign: 'center',
        color: 'red'
    }
});

export default orderScreen;