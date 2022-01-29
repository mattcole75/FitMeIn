import React, {useEffect, useState} from 'react';
import {View, FlatList, Button, Alert, StyleSheet, ActivityIndicator} from 'react-native';

import {useSelector, useDispatch} from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/ui/headerButton';
import * as spotActions from '../../store/actions/spots';
import SpotItem from '../../components/shop/spotItem';
import colours from '../../constants/colours';

const userSpotScreen = (props) => {

    const userSpots = useSelector(state => state.spots.userSpots);
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const dispatch = useDispatch();

    useEffect(() => {
        if (error) {
            Alert.alert('Oops!', `${error}`, [{ text: 'Ok', onPress: () => {setError(false)} }]);
        }
    }, [error]);

    const deleteSpot = async (id) => {

        setError(null);
        setIsLoading(true);

        try {
            await dispatch(spotActions.deleteSpot(id));
        } catch(error) {
            setError(error);
        }
        setIsLoading(false);
    }

    const deleteHandler = (id) => {

        Alert.alert('Are you sure?', 'Do you really want to delete this spot?', [
            {text: 'No', style: 'default'},
            {text: 'Yes', style: 'destructive', onPress: () => {
                deleteSpot(id);
            }}
        ])
    };

    const editHandler = (id) => {
        props.navigation.navigate('EditSpot', {spotId: id});
    };

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
        <View>
            <FlatList
                data={userSpots}
                keyExtractor={item => item.id}
                renderItem={itemData =>
                    <SpotItem
                        image={itemData.item.imageUrl}
                        title={itemData.item.title}
                        appointmentDateTime={itemData.item.textDate}
                        duration={itemData.item.duration}
                        price={itemData.item.price}
                        onSelect={() => {
                            editHandler(itemData.item.id);
                        }}
                    >
                        <Button
                            color={colours.primary}
                            title='Edit' 
                            onPress={() => {
                                editHandler(itemData.item.id);
                            }}
                        />
                        <Button
                            color={colours.primary} 
                            title='Delete'
                            onPress={() => {
                                deleteHandler(itemData.item.id)
                            }}
                        />
                    </SpotItem>
                }
            />
        </View>
        
    );
};

export const screenOptions = (navData) => {
    return {
        headerTitle: 'Your Spots',
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
        ),
        headerRight: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item 
                    title='Add' 
                    iconName={
                        Platform.OS === 'android' 
                        ? 'md-create'
                        : 'ios-create'
                    }
                    onPress={() => {
                        navData.navigation.navigate('EditSpot');
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

export default userSpotScreen;