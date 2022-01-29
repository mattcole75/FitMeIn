import React, {useEffect} from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import {useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as authActions from '../store/actions/auth';
import colours from '../constants/colours';

const startupScreen = () => {

    const dispatch = useDispatch();

    useEffect(() => {

        const tryLogin = async () => {

            const auth = await AsyncStorage.getItem('auth');

            if(!auth) {
                dispatch(authActions.setAutoLoginTry());
                return;
            }

            const transformedAuth = JSON.parse(auth);
            const {idToken, localId, displayName, email, avatarUrl, expiryDate} = transformedAuth;
            const expirationDate = new Date(expiryDate);

            if(expirationDate <= new Date() || !idToken || !localId) {
                dispatch(authActions.setAutoLoginTry());
                return;
            }

            const expirationTime = expirationDate.getTime() - new Date().getTime();

            dispatch(authActions.authenticate(
                idToken, localId, displayName, email, avatarUrl, expirationTime
            ));
        }

        tryLogin();

    }, [dispatch]);

    return (
        <View style={styles.screen}>
            <ActivityIndicator size='large' color={colours.primary} />
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default startupScreen;