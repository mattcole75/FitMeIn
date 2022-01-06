import Order from "../../models/order";
import { ADD_ORDER } from "../actions/orders";

const initialState = {
    items: []
};

export default (state = initialState, action) => {

    switch(action.type) {
        case ADD_ORDER:
            const order = new Order(
                new Date().toString(), //replace with DB ID
                action.orderData.items,
                action.orderData.total,
                new Date()
            );
            return {
                ...state,
                items: state.items.concat(order)
            };
    }

    return state;
};