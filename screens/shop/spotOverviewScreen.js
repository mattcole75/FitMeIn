import React, {useEffect, useState, useCallback} from 'react';
import {View, Text, FlatList, Button,  Platform, ActivityIndicator, StyleSheet} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import SpotItem from '../../components/shop/spotItem';
import * as basketActions from '../../store/actions/basket';
import * as spotActions from '../../store/actions/spots';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/ui/headerButton';
import colours from '../../constants/colours';

const spotsOverviewScreen = (props) => {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const spots = useSelector(state => state.spots.availableSpots);
    const dispatch = useDispatch();

    const loadSpots = useCallback(async () => {
        setError(null);
        setIsLoading(true);
        try {
            await dispatch(spotActions.getSpots());
        } catch (error) {
            setError(error.msg);
        }
        setIsLoading(false);
    }, [dispatch, setIsLoading, setError]);

    useEffect(() => {
        const unsubscribe = props.navigation.addListener(
            'focus', 
            () => {
                loadSpots();
            }
        );
        return unsubscribe();
    }, [loadSpots]);

    useEffect(() => {
        loadSpots();
    }, [dispatch, loadSpots]);

    const selectItemHandler = (id, title) => {
        props.navigation.navigate('SpotDetail', {
            spotId: id,
            spotTitle: title
        });
    };

    if(error) {
        return (
            <View style={styles.centred}>
                <Text>An Error Ocurred</Text>
                <Button color={colours.primary} 
                    title="Try again"
                    onPress={loadSpots}
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
            onRefresh={loadSpots}
            refreshing={isLoading}
            data={spots} 
            keyExtractor={item => item.id} 
            renderItem={itemData => 
                <SpotItem
                    image={itemData.item.imageUrl}
                    title={itemData.item.title}
                    appointmentDateTime={itemData.item.textDate}
                    duration={itemData.item.duration}
                    price={itemData.item.price}
                    onSelect={() => {
                        selectItemHandler(itemData.item.id, itemData.item.title);
                    }}
                >
                    
                    <Button 
                        color={colours.primary}
                        title='Details' 
                        onPress={() => {
                            selectItemHandler(itemData.item.id, itemData.item.title);
                        }}
                    />
                    <Button 
                        color={colours.primary} 
                        title='Add to basket'
                        onPress={() => {
                            dispatch(basketActions.addToBasket(itemData.item));
                        }} 
                    />
                </SpotItem>
            }
        />
    );
};

export const screenOptions = (navData) => {
    return {
        headerTitle: 'All Spots',
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
                        navData.navigation.toggleDrawer()
                    }}/>
            </HeaderButtons>
        ),
        headerRight: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item 
                    title='Add to basket'
                    iconName={
                        Platform.OS === 'android' 
                        ? 'md-cart'
                        : 'ios-cart'
                    }
                    onPress={() => {
                        navData.navigation.navigate('Basket')
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
    }
});

export default spotsOverviewScreen;