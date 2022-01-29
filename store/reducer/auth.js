import {AUTHENTICATE, LOGOUT, DID_TRY_AUTO_LOGIN} from "../actions/auth";

const initialState = {
    localId: null,
    displayName: null,
    email: null,
    idToken: null,
    avatarUrl: null,
    expiresIn: null,
    didTryAutoLogin: false
};

export default (state = initialState, action) => {

    switch (action.type) {
        case AUTHENTICATE:
            return {
                ...state,
                idToken: action.idToken,
                localId: action.localId,
                displayName: action.displayName,
                email: action.email,
                avatarUrl: action.avatarUrl,
                expiresIn: action.expiresIn,
                didTryAutoLogin: true
            };
        case DID_TRY_AUTO_LOGIN:
            return {
                ...state,
                didTryAutoLogin: true
            };
        case LOGOUT:
            return {
                ...initialState,
                didTryAutoLogin: true
            };        
        default:
            return state;
    }
};