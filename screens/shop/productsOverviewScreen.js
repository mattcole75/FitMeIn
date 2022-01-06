import React from 'react';
import {FlatList, Button,  Platform} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import ProductItem from '../../components/shop/productItem';
import * as basketActions from '../../store/actions/basket';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/ui/headerButton';
import colours from '../../constants/colours';

const productsOverviewScreen = (props) => {

    const products = useSelector(state => state.products.availableProducts);
    const dispatch = useDispatch();

    const selectItemHandler = (id, title) => {
        props.navigation.navigate('ProductDetail', {
            productId: id,
            productTitle: title
        });
    };

    return (
        <FlatList
            data={products} 
            keyExtractor={item => item.id} 
            renderItem={itemData => 
                <ProductItem
                    image={itemData.item.imageUrl}
                    title={itemData.item.title}
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
                </ProductItem>
            }
        />
    );
};

productsOverviewScreen.navigationOptions = (props) => {
    return {
        headerTitle: 'All Products',
        headerLeft: (
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
        headerRight: (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item 
                    title='Add to basket' 
                    iconName={
                        Platform.OS === 'android' 
                        ? 'md-cart'
                        : 'ios-cart'
                    }
                    onPress={() => {
                        props.navigation.navigate('Basket');
                    }}/>
            </HeaderButtons>
        )
    }
};

export default productsOverviewScreen;