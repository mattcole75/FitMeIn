import React from 'react';
import {ScrollView, View, Text, Image, Button, StyleSheet} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import colours from '../../constants/colours';
import * as basketActions from '../../store/actions/basket';

const productDetailScreen = (props) => {

    const productId = props.route.params.productId;
    const selectedProduct = useSelector(
        state => state.products.availableProducts.find(
            product => product.id === productId
            )
        );
    const dispatch = useDispatch();

    return (
        <ScrollView>
            <Image style={styles.image} source={{uri: selectedProduct.imageUrl}} />
            <View style={styles.actions}>
                <Button color={colours.primary} title='Add to Basket' onPress={() => {
                     dispatch(basketActions.addToBasket(selectedProduct));
                }}/>
            </View>
            <Text style={styles.price}>£{selectedProduct.price.toFixed(2)}</Text>
            <Text style={styles.description}>{selectedProduct.description}</Text>
        </ScrollView>
    );
};

productDetailScreen.navigationOptions = (props) => {
    
    return {
        headerTitle: props.route.params.productTitle
    }
};

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: 300,
    },
    price: {
        fontFamily: 'open-sans-bold',
        fontSize: 20,
        color: '#888',
        textAlign: 'center',
        marginVertical: 20
    },
    description: {
        fontFamily: 'open-sans',
        fontSize: 14,
        textAlign: 'center',
        marginHorizontal: 20
    },
    actions: {
        alignItems: 'center'
    }
});

export default productDetailScreen;