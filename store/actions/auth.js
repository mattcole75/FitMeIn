import AsyncStorage from '@react-native-async-storage/async-storage';

export const SIGNUP = 'SIGNUP';
export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';
export const DID_TRY_AUTO_LOGIN = 'DID_TRY_AUTO_LOGIN';

export const setAutoLoginTry = () => {
    return{ type: DID_TRY_AUTO_LOGIN }
}

let timer;

export const authenticate = (idToken, localId, displayName, email, avatarUrl, expiryTime) => {
    return dispatch => {
        dispatch(setLogoutTimer(expiryTime));
        dispatch({
            type: AUTHENTICATE,
            idToken: idToken,
            localId: localId,
            displayName: displayName,
            email: email,
            avatarUrl: avatarUrl,
            expiresIn: expiryTime
        });
    }
}

export const signup = (displayName, email, password) => {

    return async dispatch => {

        const response = await fetch('http://192.168.1.114:1337/api/0.1/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                displayName: displayName,
                email: email,
                password: password
            })
        });

        if(response.status !== 201) {
            const errorResData = await response.json();
            throw new Error(errorResData.msg);
        }

        dispatch({
            type: SIGNUP
        });
    };
};

export const login = (email, password) => {
    
    return async dispatch => {

        const response = await fetch('http://192.168.1.114:1337/api/0.1/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        if(response.status !== 200) {
            const errorResData = await response.json();
            throw new Error(errorResData.msg);
        }

        const resData = await response.json(); 

        dispatch(authenticate(
            resData.user.idToken,
            resData.user.localId,
            resData.user.displayName,
            resData.user.email,
            resData.user.avatarUrl,
            parseInt(resData.user.expiresIn) * 1000
        ));

        const expiryDate = new Date(new Date().getTime() + parseInt(resData.user.expiresIn) * 1000);

        saveAuthtoStorage(
            resData.user.idToken,
            resData.user.localId,
            resData.user.displayName,
            resData.user.email,
            resData.user.avatarUrl,
            expiryDate
        );
    };
};

export const logout = () => {
    clearLogoutTimer();
    AsyncStorage.removeItem('auth');
    return { type: LOGOUT };
}

const clearLogoutTimer = () => {

    if (timer)
        clearTimeout(timer);
};
  
const setLogoutTimer = (expirationTime) => {

    return dispatch => {
        timer = setTimeout(() => {
            dispatch(logout());
        }, expirationTime);
    };
};

const saveAuthtoStorage = (idToken, localId, displayName, email, avatarUrl, expiryDate) => {

    AsyncStorage.setItem('auth', JSON.stringify({
        idToken: idToken,
        localId: localId,
        displayName: displayName,
        email: email,
        avatarUrl: avatarUrl,
        expiryDate: expiryDate.toISOString()
    }));
}