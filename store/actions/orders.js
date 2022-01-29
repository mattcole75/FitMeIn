import Order from "../../models/order";

export const ADD_ORDER = 'ADD_ORDER';
export const GET_ORDERS = 'GET_ORDERS';

export const getOrders = () => {

    return async (dispatch, getState) => {

        const idToken  = getState().auth.idToken;
        const localId  = getState().auth.localId;

        try {
            const response = await fetch('http://192.168.1.114:1337/api/0.1/fitmein/orders', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                idToken: idToken,
                localId: localId
            }
        });

            if(response.status !== 200) {
                const errorResData = await response.json();
                throw new Error(errorResData.msg);
            }

            const resData = await response.json();
            const loadedOrders = [];

            for(const key in resData.orders) {
                loadedOrders.push(new Order(
                    resData.orders[key].id,
                    resData.orders[key].basketItems,
                    resData.orders[key].total,
                    new Date(resData.orders[key].date)

                ))
            } 

            dispatch({
                type: GET_ORDERS, 
                orders: loadedOrders
            })

        } catch(error) {
            throw error;
        }
    };
};

export const addOrder = (basketItems, total) => {
    
    return async (dispatch, getState) => {
        
        const date = new Date();

        const idToken  = getState().auth.idToken;
        const localId  = getState().auth.localId;

        const response = await fetch('http://192.168.1.114:1337/api/0.1/fitmein/order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "idToken": idToken
            },
            body: JSON.stringify({
                "localId": localId,
                "basketItems": basketItems,
                "total": total
            })
        });

        if(response.status !== 201) {
            const errorResData = await response.json();
            throw new Error(errorResData.msg);
        }
        const resData = await response.json();

        dispatch({ 
            type: ADD_ORDER, 
            orderData: {
                id: resData.msg.insertId,
                items: basketItems, 
                total: total,
                date: date
            }
        });
    };
}