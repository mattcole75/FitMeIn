
export const ADD_TO_BASKET = 'ADD_TO_BASKET';
export const REMOVE_FROM_BASKET = 'REMOVE_FROM_BASKET';

export const addToBasket = (spot) => {

    return async (dispatch, getState) => {

        const idToken  = getState().auth.idToken;
        const localId  = getState().auth.localId;

        const response = await fetch('http://192.168.1.114:1337/api/0.1/fitmein/spotbasket', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                idToken: idToken
            },
            body: JSON.stringify({
                id: spot.id,
                inBasketUserID: localId
            })
        });

        if(response.status !== 200) {
            const errorResData = await response.json();
            throw new Error(errorResData.msg);
        }

        dispatch({ 
            type: ADD_TO_BASKET, 
            spot: spot
        });
    };
}

export const removeFromBasket = (id) => {

    return async (dispatch, getState) => {

        const idToken  = getState().auth.idToken;

        const response = await fetch('http://192.168.1.114:1337/api/0.1/fitmein/spotbasketremove', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                idToken: idToken
            },
            body: JSON.stringify({
                id: parseInt(id)
            })
        });

        if(response.status !== 200) {
            const errorResData = await response.json();
            throw new Error(errorResData.msg);
        }

        dispatch({
            type: REMOVE_FROM_BASKET,
            id: id
        });
    };
}