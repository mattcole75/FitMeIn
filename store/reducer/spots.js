import {GET_SPOTS, DELETE_SPOT, UPDATE_SPOT, CREATE_SPOT} from '../actions/spots';
import Spot from '../../models/spot';

const initialState = {
    availableSpots: [],
    userSpots: []
};

export default (state = initialState, action) => {

    switch(action.type) {
        case GET_SPOTS:
            return{
                availableSpots: action.spots,
                userSpots: action.userSpots
            }
        case CREATE_SPOT:
            const newSpot = new Spot(
                action.id,
                action.localId,
                action.title,
                action.description,
                action.appointmentDateTime,
                action.duration,
                action.price,
                action.imageUrl
            );
            return {
                ...state,
                availableSpots: state.availableSpots.concat(newSpot),
                userSpots: state.userSpots.concat(newSpot)
            }
        case UPDATE_SPOT:
            const spotIndex = state.userSpots.findIndex(
                prod => prod.id === action.id
            );
            const updatedSpot = new Spot(
                action.id,
                action.localId,
                action.title,
                action.description,
                action.appointmentDateTime,
                action.duration,
                action.price,
                action.imageUrl
            );
            const updatedUserSpots = [...state.userSpots];
            updatedUserSpots[spotIndex] = updatedSpot;
            const availableSpotIndex = state.availableSpots.findIndex(
                prod => prod.id === action.id
            );
            const updatedAvailableSpots = [...state.availableSpots];
            updatedAvailableSpots[availableSpotIndex] = updatedSpot;
            return {
                ...state,
                availableSpots: updatedAvailableSpots,
                userSpots: updatedUserSpots
            }
        case DELETE_SPOT:
            return {
                ...state,
                userSpots: state.userSpots.filter(
                    spot => spot.id !== action.id
                ),
                availableSpots: state.availableSpots.filter(
                    spot => spot.id !== action.id
                )
            };
    }

    return state;
};