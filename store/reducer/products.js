import PRODUCTS from '../../data/testData';
import {DELETE_PRODUCT, UPDATE_PRODUCT, CREATE_PRODUCT} from '../actions/products';
import Product from '../../models/product';

const initialState = {
    availableProducts: PRODUCTS,
    userProducts: PRODUCTS.filter(product => product.ownerId === 'u1')
};

export default (state = initialState, action) => {

    switch(action.type) {
        case CREATE_PRODUCT:
            const newProduct = new Product(
                new Date().toDateString(),
                'u1',
                action.title,
                action.imageUrl,
                action.description,
                action.price
            );
            return {
                ...state,
                availableProducts: state.availableProducts.concat(newProduct),
                userProducts: state.userProducts.concat(newProduct)
            }
        case UPDATE_PRODUCT:
            const productIndex = state.userProducts.findIndex(
                prod => prod.id === action.id
            );
            const updatedProduct = new Product(
                action.id,
                state.userProducts[productIndex].ownerId,
                action.title,
                action.imageUrl,
                action.description,
                action.price
            );
            const updatedUserProducts = [...state.userProducts];
            updatedUserProducts[productIndex] = updatedProduct;
            const availableProductsIndex = state.availableProducts.findIndex(
                prod => prod.id === action.id
            );
            const updatedAvailableProducts = [...state.availableProducts];
            updatedAvailableProducts[availableProductsIndex] = updatedProduct;
            return {
                ...state,
                availableProducts: updatedAvailableProducts,
                userProducts: updatedUserProducts
            }
        case DELETE_PRODUCT:
            return {
                ...state,
                userProducts: state.userProducts.filter(
                    product => product.id !== action.id
                ),
                availableProducts: state.availableProducts.filter(
                    product => product.id !== action.id
                )
            };
    }

    return state;
};