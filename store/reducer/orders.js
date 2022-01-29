import Order from "../../models/order";
import { ADD_ORDER, GET_ORDERS } from "../actions/orders";

const initialState = {
    items: []
};

export default (state = initialState, action) => {

    switch(action.type) {
        case ADD_ORDER:
            const order = new Order (
                action.orderData.id,
                action.orderData.items,
                action.orderData.total,
                action.orderData.date
            );
            return {
                ...state,
                items: state.items.concat(order)
            };
        case GET_ORDERS:
            return {
                items: action.orders
            }

    }

    return state;
};