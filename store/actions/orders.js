export const ADD_ORDER = 'ADD_ORDER';

export const addOrder = (basketItems, total) => {
    return { 
        type: ADD_ORDER, 
        orderData: {
            items: basketItems, 
            total: total
        }
    };
};