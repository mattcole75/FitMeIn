import React, {useEffect, useState, useReducer, useCallback} from 'react';
import {Text, ScrollView, View, KeyboardAvoidingView, Button, StyleSheet, ActivityIndicator, Alert} from 'react-native';
import Input from '../../components/ui/input'
import Card from '../../components/ui/card';
import colours from '../../constants/colours';
import { useDispatch } from 'react-redux';
import * as authActions from '../../store/actions/auth';
import {hashPassword} from '../../utility/utility';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {
    if(action.type === FORM_INPUT_UPDATE) {
        const updatedValues = {
            ...state.inputValues,
            [action.input]: action.value
        };
        const updatedValidities = {
            ...state.inputValidities,
            [action.input]: action.isValid
        };
        let updatedFormIsValid = true;
        for(const key in updatedValidities) {
            updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
        }
        return {
            inputValues: updatedValues,
            inputValidities: updatedValidities,
            formIsValid: updatedFormIsValid
        };
    }
    return state;
};

const authScreen = (props) => {

    const [isSignUp, setIsSignUp] = useState(false)
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const dispatch = useDispatch();

    const[formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            displayName: '',
            email: '',
            password: ''
        },
        inputValidities: {
            displayName: false,
            email: false,
            password: false
        },
        formIsValid: false
    });

    useEffect(() => {
        if (error) {
            Alert.alert('Oops!', `${error}`, [{ text: 'Ok' }]);
        }
    }, [error]);

    const authHandler = async () => {

        setError(null);
        setIsLoading(true);

        try {

            if(isSignUp) {
                await dispatch(authActions.signup(
                    formState.inputValues.displayName,
                    formState.inputValues.email,
                    hashPassword(formState.inputValues.password)
                ));

                setIsLoading(false);
                setIsSignUp(false);

                Alert.alert('New Account', 'Your account has been registered... please login', [{ text: 'Ok' }]);

            } else {
                await dispatch(authActions.login(
                    formState.inputValues.email,
                    hashPassword(formState.inputValues.password)
                ));
            }
            
        } catch (error) {
            setError(error);
            setIsLoading(false);
        }
    };

    const changeHandler = useCallback((inputIdentifier, inputValue, inputValidity) => {

        dispatchFormState({
            type: FORM_INPUT_UPDATE,
            value: inputValue,
            isValid: inputValidity,
            input: inputIdentifier
        });
    }, [dispatchFormState]);

    if(error) {
        return (
            <View style={styles.centred}>
                <Text style={styles.errorText}>An Error Ocurred</Text>
                <Text style={styles.errorText}>{error.msg}</Text>
                <Button color={colours.primary} 
                    title="Try again"
                    onPress={() => {setError(null)}}
                    color={colours.primary} 
                />
            </View>
        );
    }

    if(isLoading) {
        return (
            <View style={styles.centred}>
                <ActivityIndicator
                     size='large'
                     color={colours.primary}
                />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS ==='android' ? null : 'padding'}
            keyboardVerticalOffset={100}
            style={styles.screen}>
            <View style={styles.gradient}>
                <Card style={styles.authContainer}>
                    <ScrollView>
                        {isSignUp
                            ? <Input
                                id='displayName'
                                label='Display name'
                                keyboardType='default'
                                required
                                minLength={3}
                                maxLength={32}
                                autoCapitalise='sentences'
                                errorText='Please enter a valid display name'
                                onInputChange={changeHandler}
                                initialValue=''
                             />
                            : null
                        }
                        <Input
                            id='email'
                            label='Email'
                            keyboardType='email-address'
                            autoCapitalize='none'
                            required
                            email
                            minLength={4}
                            maxLength={255}
                            autoCapitalise='none'
                            errorText='Please enter a valid email address'
                            onInputChange={changeHandler}
                            initialValue=''
                        />
                        <Input
                            id='password'
                            label='Password'
                            keyboardType='default'
                            autoCapitalize='none'
                            secureTextEntry
                            required
                            minLength={5}
                            maxLength={32}
                            errorText='Please enter a valid password'
                            onInputChange={changeHandler}
                            initialValue=''
                        />
                        <View style={styles.buttonContainer}>
                            <Button 
                                title={isSignUp ? 'Sign up' : 'Login'}
                                color={colours.primary}
                                onPress={authHandler}
                            />
                        </View>
                        <View>
                            <Button 
                                title={isSignUp ? 'Switch to Login' : 'Switch to sign up'}
                                color={colours.primary}
                                onPress={() => {
                                    setIsSignUp(prevState => !prevState)
                                }}
                            />
                        </View>
                    </ScrollView>
                </Card>
            </View>
        </KeyboardAvoidingView>
    );
};

export const screenOptions = {   
    headerTitle: 'Authenticate'
};

const styles = StyleSheet.create({
    screen: {
        flex: 1
    },
    authContainer: {
        width: '80%',
        maxWidth: 400,
        maxHeight: 400,
        padding: 20
    },
    gradient: {
        flex: 1,
        width: '100%',
        height:'100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonContainer: {
        width: '100%',
        margin: 10,

    },
    errorText: {
        fontFamily: 'open-sans-bold',
        marginVertical: 8,
        textAlign: 'center',
        color: 'red'
    },
    centred: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center'
    }
});

export default authScreen;