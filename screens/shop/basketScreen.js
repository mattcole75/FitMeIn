import React, {useState, useCallback, useEffect} from 'react';
import {View, Text, FlatList, Button, StyleSheet, ActivityIndicator} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import BasketItem from '../../components/shop/basketItem';
import colours from '../../constants/colours';
import * as basketActions from '../../store/actions/basket';
import * as orderActions from '../../store/actions/orders';
import Card from '../../components/ui/card';

const basketScreen = (props) => {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const basketTotalAmount = useSelector(state => state.basket.totalAmount);
    const basketItems = useSelector(state => {
        const transformedBasketItems = [];
        for(const key in state.basket.items) {
            transformedBasketItems.push({
                id: key,
                title: state.basket.items[key].title,
                price: state.basket.items[key].price
            });
        }
        return transformedBasketItems.sort((a, b) => a.title > b.title ? 1 : -1);
    });

    const dispatch = useDispatch();

    useEffect(() => {
        if (error) {
            Alert.alert('Oops!', `${error}`, [{ text: 'Ok' }]);
        }
    }, [error]);

    const placeOrderHandler = async () => {
        setError(null);
        setIsLoading(true);
        try {
            await dispatch(orderActions.addOrder(basketItems, basketTotalAmount));
        } catch (error) {
            setError(error.msg);
        }
        setIsLoading(false);
    };

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
        <View style={styles.screen}>
            <Card style={styles.summary}>
                <Text style={styles.summaryText}>
                    Total: <Text style={styles.currency}>£{Math.round(basketTotalAmount.toFixed(2) * 100) / 100}</Text>
                </Text>
                <Button 
                    title='Order Now' 
                    color={colours.accent} 
                    disabled={basketItems.length === 0}
                    onPress={placeOrderHandler}
                />
            </Card>
            <FlatList 
                data={basketItems} 
                keyExtractor={item => item.id} 
                renderItem={itemData => 
                    <BasketItem 
                        title={itemData.item.title} 
                        price={itemData.item.price}
                        deletable
                        onRemove={() => {
                            dispatch(basketActions.removeFromBasket(itemData.item.id));
                        }}
                    />} 
            />
        </View>
    );
};

export const screenOptions = {
    headerTitle: 'Your basket'
};

const styles = StyleSheet.create({
    screen: {
        margin: 0
    },
    summary: {
        margin: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        padding: 10
    },
    summaryText: {
        fontFamily: 'open-sans-bold',
        fontSize: 18,
        alignItems: 'center'
    },
    currency: {
        color: colours.primary
    },
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

export default basketScreen;