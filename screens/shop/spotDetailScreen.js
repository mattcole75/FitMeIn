import React, {useState, useEffect} from 'react';
import {ScrollView, View, Text, Image, Button, StyleSheet, ActivityIndicator, Alert} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import colours from '../../constants/colours';
import * as basketActions from '../../store/actions/basket';

const spotDetailScreen = (props) => {

    const spotId = props.route.params.spotId;
    const selectedSpot = useSelector(
        state => state.spots.availableSpots.find(
            spot => spot.id === spotId
            )
        );

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const dispatch = useDispatch();

    useEffect(() => {
        if (error) {
            Alert.alert('Oops!', `${error}`, [{ text: 'Ok' }]);
        }
    }, [error]);

    const basketHandler = async () => {

        setError(null);
        setIsLoading(true);

        try {
            await dispatch(basketActions.addToBasket(selectedSpot));
            props.navigation.navigate('SpotsOverview');

        } catch (error) {
            setError(error);
            setIsLoading(false);
        }
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
        <ScrollView>
            <Image style={styles.image} source={{uri: selectedSpot.imageUrl}} />
            <View style={styles.actions}>
                <Button 
                    color={colours.primary}
                    title='Add to Basket' 
                    onPress={basketHandler}/>
            </View>
            <Text style={styles.date}>When {selectedSpot.textDate}</Text>
            <Text style={styles.duration}>For {selectedSpot.duration} minutes</Text>
            <Text style={styles.price}>£{selectedSpot.price.toFixed(2)}</Text>
            <Text style={styles.description}>{selectedSpot.description}</Text>
        </ScrollView>
    );
};

export const screenOptions = (navData) => {
    
    return {
        headerTitle: navData.route.params.spotTitle
    }
};

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: 300,
    },
    date: {
        fontFamily: 'open-sans-bold',
        fontSize: 20,
        color: '#888',
        textAlign: 'center',
        marginTop: 10
    },
    duration: {
        fontFamily: 'open-sans-bold',
        fontSize: 20,
        color: '#888',
        textAlign: 'center',
        marginVertical: 10
    },
    price: {
        fontFamily: 'open-sans-bold',
        fontSize: 20,
        color: '#888',
        textAlign: 'center',
        marginVertical: 10
    },
    description: {
        fontFamily: 'open-sans',
        fontSize: 18,
        textAlign: 'center',
        marginHorizontal: 20
    },
    actions: {
        alignItems: 'center'
    },
    centred: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center'
    }
});

export default spotDetailScreen;