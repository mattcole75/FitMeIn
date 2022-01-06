import {ADD_TO_BASKET, REMOVE_FROM_BASKET} from "../actions/basket";
import {ADD_ORDER} from "../actions/orders";
import BasketItem from "../../models/basketItem";
import { DELETE_PRODUCT } from "../actions/products";


const initialState = {
    items: {},
    totalAmount: 0
};

export default (state = initialState, action) => {

    switch (action.type) {

        case ADD_TO_BASKET:
            const addedProduct = action.product;
            const id = addedProduct.id;
            const title = addedProduct.title;
            const price = addedProduct.price;

            if(state.items[id]) {
                // already requested product
                return state;
            } else {
                const basketItem = new BasketItem(id, title, price);
                return {
                    ...state,
                    items: {...state.items, [id]: basketItem},
                    totalAmount: state.totalAmount + price
                }
            }
        case REMOVE_FROM_BASKET:
            const basketItems = {...state.items};
            const selectedbasketItem = state.items[action.id];
            delete basketItems[action.id];
            return {
                ...state,
                items: basketItems,
                totalAmount: state.totalAmount - selectedbasketItem.price
            };
        case ADD_ORDER:
            return initialState;
        
        case DELETE_PRODUCT:
            if(!state.items[action.id]) {
                return state;
            }
            const updatedItems = {...state.items};
            const itemPrice = state.items[action.id].price;
            
            delete updatedItems[action.id];
            return {
                ...state,
                items: updatedItems,
                totalAmount: state.totalAmount - itemPrice
            };
    }

    return state;
};