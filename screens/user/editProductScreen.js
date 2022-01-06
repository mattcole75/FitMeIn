import React, {useState, useEffect, useCallback} from 'react';
import {View, ScrollView, Text, TextInput, Button, StyleSheet, Alert} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import * as productActions from '../../store/actions/products';

import colours from '../../constants/colours';

const editProductScreen = (props) => {

    const dispatch = useDispatch();

    const productId = props.route.params ? props.route.params.productId : null;
    const editedProduct = useSelector(state => 
        state.products.userProducts.find(product =>
                product.id === productId
            )
        );

    const [title, setTitle] = useState(editedProduct ? editedProduct.title : '');
    const [imageUrl, setImageUrl] = useState(editedProduct ? editedProduct.imageUrl : '');
    const [price, setPrice] = useState(editedProduct ? editedProduct.price.toString() : '');
    const [description, setDescription] = useState(editedProduct ? editedProduct.description : ''); 

    const submitHandler = useCallback(() => {
        
        if(editedProduct) {
            dispatch(productActions.updateProduct(
                productId,
                title,
                imageUrl,
                +price,
                description
            ));
        } else {
            dispatch(productActions.createProduct(
                title,
                imageUrl,
                +price,
                description
            ));
        }

        props.navigation.goBack();

    }, [dispatch, productId, title, imageUrl, price, description]);

    // useEffect(() => {
    //     props.navigation.setParams({submit: submitHandler})
    // }, [submitHandler]);

    return (
        <ScrollView>
            <View style={styles.form}>
                <View style={styles.formControl}>
                    <Text style={styles.label}>Title</Text>
                    <TextInput 
                        style={styles.input}
                        value={title}
                        onChangeText={text => setTitle(text)}
                    />
                </View>
                <View style={styles.formControl}>
                    <Text style={styles.label}>Image Url</Text>
                    <TextInput 
                        style={styles.input}
                        value={imageUrl}
                        onChangeText={text => setImageUrl(text)}
                    />
                </View>
                <View style={styles.formControl}>
                    <Text style={styles.label}>Price</Text>
                    <TextInput
                        style={styles.input}
                        value={price}
                        onChangeText={text => setPrice(text)}
                    />
                </View>
                <View style={styles.formControl}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        style={styles.input}
                        value={description}
                        onChangeText={text => setDescription(text)}
                    />
                </View>
                <Button
                    color={colours.primary} 
                    title='Save'
                    onPress={() => {
                        submitHandler()
                    }}
                />
            </View>
        </ScrollView>
    );
};

editProductScreen.navigationOptions = (props) => {
    
    return {
        headerTitle: props.route.params.productId
            ? 'Edit Product'
            : 'Add Product'
    }
};

const styles = StyleSheet.create({
    form: {
        margin: 20
    },
    formControl: {
        width: '100%'
    },
    label: {
        fontFamily: 'open-sans-bold',
        marginVertical: 8
    },
    input: {
        paddingHorizontal: 2,
        paddingVertical: 5,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1
    }
});

export default editProductScreen;