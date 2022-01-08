import React, {useCallback, useReducer} from 'react';
import {View, ScrollView, Button, StyleSheet, Alert, KeyboardAvoidingView} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import * as productActions from '../../store/actions/products';
import Input from '../../components/ui/input';
import colours from '../../constants/colours';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {
    if(action.type === FORM_INPUT_UPDATE) {
        const updatedValues = {
            ...state.inputValues,
            [action.input]: action.value
        };
        const updatedValidities = {
            ...state.inputValidities,
            [action.input]: action.isValid
        };
        let updatedFormIsValid = true;
        for(const key in updatedValidities) {
            updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
        }
        return {
            inputValues: updatedValues,
            inputValidities: updatedValidities,
            formIsValid: updatedFormIsValid
        };
    }
    return state;
};

const editProductScreen = (props) => {

    const dispatch = useDispatch();

    const productId = props.route.params ? props.route.params.productId : null;
    const editedProduct = useSelector(state => 
        state.products.userProducts.find(product =>
                product.id === productId
            )
        );

    const[formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            title: editedProduct ? editedProduct.title : '',
            imageUrl: editedProduct ? editedProduct.imageUrl : '',
            price: editedProduct ? String(editedProduct.price) : '',
            description: editedProduct ? editedProduct.description : ''
        },
        inputValidities: {
            title: editedProduct ? true : false,
            imageUrl: editedProduct ? true : false,
            price: editedProduct ? true : false,
            description: editedProduct ? true : false
        },
        formIsValid: editedProduct ? true : false
    });

    const submitHandler = useCallback(() => {

        if(!formState.formIsValid) {
            Alert.alert('Validation Error', 'Check your form', [{text: 'Ok'}]);
            return;
        }

        if(editedProduct) {
            dispatch(productActions.updateProduct(
                productId,
                formState.inputValues.title,
                formState.inputValues.imageUrl,
                +formState.inputValues.price,
                formState.inputValues.description
            ));
        } else {
            dispatch(productActions.createProduct(
                formState.inputValues.title,
                formState.inputValues.imageUrl,
                +formState.inputValues.price,
                formState.inputValues.description
            ));
        }

        props.navigation.goBack();

    }, [dispatch, productId, formState]);

    const changeHandler = useCallback((inputIdentifier, inputValue, inputValidity) => {

        dispatchFormState({
            type: FORM_INPUT_UPDATE,
            value: inputValue,
            isValid: inputValidity,
            input: inputIdentifier
        });
    }, [dispatchFormState]);

    return (
        <KeyboardAvoidingView style={{flex: 1}} behavior='padding' keyboardVerticalOffset={100}>
            <ScrollView>
                <View style={styles.form}>
                    <Input
                        id='title'
                        label='Title'
                        errorText='Please enter a valid title'
                        keyboardType='default'
                        autoCapitalize='sentences'
                        autoCorrect
                        returnKeyType='next'
                        onInputChange={changeHandler}
                        initialValue={editedProduct ? editedProduct.title : ''}
                        initiallyValid={!!editedProduct}
                        required
                        minLength={5}
                        maxLength={30}
                    />
                    <Input
                        id='imageUrl'
                        label='Image URL'
                        errorText='Please enter a valid URL'
                        keyboardType='default'
                        returnKeyType='next'
                        onInputChange={changeHandler}
                        initialValue={editedProduct ? editedProduct.imageUrl : ''}
                        initiallyValid={!!editedProduct}
                        required
                    />
                    <Input
                        id='price'
                        label='Price'
                        errorText='Please enter a valid price'
                        keyboardType='decimal-pad'
                        returnKeyType='next'
                        onInputChange={changeHandler}
                        initialValue={editedProduct ? String(editedProduct.price) : ''}
                        initiallyValid={!!editedProduct}
                        required
                        min={0}
                    />
                    <Input 
                        id='description'
                        label='Description'
                        errorText='Please enter a valid description'
                        keyboardType='default'
                        autoCapitalize='sentences'
                        autoCorrect
                        muliline
                        numberOfLines={3}
                        onInputChange={changeHandler}
                        initialValue={editedProduct ? editedProduct.description : ''}
                        initiallyValid={!!editedProduct}
                        required
                        minLength={5}
                        maxLength={100}
                    />
                    <Button
                        color={colours.primary} 
                        title='Save'
                        onPress={() => {
                            submitHandler()
                        }}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
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
    }
});

export default editProductScreen;