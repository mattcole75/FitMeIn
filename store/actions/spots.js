import Spot from "../../models/spot";

export const DELETE_SPOT = 'DELETE_SPOT';
export const CREATE_SPOT = 'CREATE_SPOT';
export const UPDATE_SPOT = 'UPDATE_SPOT';
export const GET_SPOTS = 'GET_SPOTS';

export const getSpots = () => {
    return async (dispatch, getState) => {

        const localId  = getState().auth.localId;

        try {
            const response = await fetch('http://192.168.1.114:1337/api/0.1/fitmein/spots');

            if(response.status !== 200) {
                const errorResData = await response.json();
                throw new Error(errorResData.msg);
            }

            const resData = await response.json();
            const loadedSpots = [];

            for(const key in resData.spots) {
                loadedSpots.push(new Spot(
                    resData.spots[key].id,
                    resData.spots[key].ownerUserId,
                    resData.spots[key].title,
                    resData.spots[key].description,
                    new Date(resData.spots[key].appointmentDateTime),
                    resData.spots[key].duration,
                    resData.spots[key].price,
                    resData.spots[key].imageUrl
                ))
            } 

            dispatch({
                type: GET_SPOTS, 
                spots: loadedSpots, 
                userSpots: loadedSpots.filter(spot => spot.ownerUserId === localId)
            });
            
        } catch(error) {
            throw error;
        }
    };
};

export const deleteSpot = (spotId) => {

    return async (dispatch, getState) => {

        const idToken  = getState().auth.idToken;

        const response = await fetch('http://192.168.1.114:1337/api/0.1/fitmein/spot', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                idToken: idToken,
                id: spotId
            }
        });

        if(response.status !== 200) {
            const errorResData = await response.json();
            throw new Error(errorResData.msg);
        }

        dispatch({
            type: DELETE_SPOT,
            id: spotId
        });
    }
    
};

export const createSpot = (title, description, appointmentDateTime, duration, price, imageUrl) => {
    return async (dispatch, getState) => {

        const idToken  = getState().auth.idToken;
        const localId  = getState().auth.localId;

        const response = await fetch('http://192.168.1.114:1337/api/0.1/fitmein/spot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                idToken: idToken
            },
            body: JSON.stringify({
                ownerUserId: localId,
                title: title, 
                description: description,
                appointmentDateTime: appointmentDateTime.toJSON().slice(0, 19).replace('T', ' '),
                duration: duration,
                price: price, 
                imageUrl: imageUrl
            })
        });

        if(response.status !== 201) {
            const errorResData = await response.json();
            throw new Error(errorResData.msg);
        }

        const resData = await response.json();

        dispatch({
            type: CREATE_SPOT, 
            id: resData.msg.insertId,
            localId: localId,
            title: title, 
            description: description,
            appointmentDateTime: appointmentDateTime,
            duration: duration,
            price: price, 
            imageUrl: imageUrl
        });
    };
}

export const updateSpot = (id, title, description, appointmentDateTime, duration, price, imageUrl) => {
    
    return async (dispatch, getState) => {

        const idToken  = getState().auth.idToken;
        const localId  = getState().auth.localId;

        const response = await fetch('http://192.168.1.114:1337/api/0.1/fitmein/spot', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                idtoken: idToken
            },
            body: JSON.stringify({
                id: id,
                title: title,
                description: description,
                appointmentDateTime: appointmentDateTime.toJSON().slice(0, 19).replace('T', ' '),
                duration: duration,
                price: price,
                imageUrl: imageUrl
            })
        });

        if(response.status !== 200) {
            const errorResData = await response.json();
            throw new Error(errorResData.msg);
        }

        dispatch({
            type: UPDATE_SPOT, 
            id: id,
            localId: localId,
            title: title,
            description: description,
            appointmentDateTime: appointmentDateTime,
            duration: duration,
            price: price,
            imageUrl: imageUrl
        });
    };
}