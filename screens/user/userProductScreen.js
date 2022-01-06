import React from 'react';
import {View, FlatList, Button, Alert} from 'react-native';

import {useSelector, useDispatch} from 'react-redux';
import * as productActions from '../../store/actions/products';
import ProductItem from '../../components/shop/productItem';
import colours from '../../constants/colours';

const userProductScreen = (props) => {

    const userProducts = useSelector(state => state.products.userProducts);
    const dispatch = useDispatch(); 

    const deleteHandler = (id) => {
        Alert.alert('Are you sure?', 'Do you really want to delete this item?', [
            {text: 'No', style: 'default'},
            {text: 'Yes', style: 'destructive', onPress: () => {
                dispatch(productActions.deleteProduct(id));
            }}
        ])
    };

    const editProductHandler =(id) => {
        props.navigation.navigate('UserEditProduct', {productId: id});
    };

    return (
        <View>
            <Button
                color={colours.primary}
                title='Add' 
                onPress={() => {
                    props.navigation.navigate('UserEditProduct');
                }}
            />
            <FlatList 
                data={userProducts}
                keyExtractor={item => item.id}
                renderItem={itemData =>
                    <ProductItem
                        image={itemData.item.imageUrl}
                        title={itemData.item.title}
                        price={itemData.item.price}
                        onSelect={() => {
                            editProductHandler(itemData.item.id);
                        }}
                    >
                        <Button
                            color={colours.primary}
                            title='Edit' 
                            onPress={() => {
                                editProductHandler(itemData.item.id);
                            }}
                        />
                        <Button
                            color={colours.primary} 
                            title='Delete'
                            onPress={() => {() => deleteHandler(itemData.item.id)}}
                        />
                    </ProductItem>
                }
            />
        </View>
        
    );
};

export default userProductScreen;