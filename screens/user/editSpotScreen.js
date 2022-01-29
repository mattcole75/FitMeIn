import React, {useState, useEffect, useCallback, useReducer} from 'react';
import {Text, View, ScrollView, Button ,StyleSheet, Alert, KeyboardAvoidingView, ActivityIndicator, Platform, Pressable} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/ui/headerButton';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as spotActions from '../../store/actions/spots';
import Card from '../../components/ui/card';
import Input from '../../components/ui/input';
import colours from '../../constants/colours';
import {shortDatetext, timeText} from '../../utility/utility';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';
const DATE_INPUT_UPDATE = 'DATE_INPUT_UPDATE';

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

    if(action.type === DATE_INPUT_UPDATE) {

        const inputValidities = {...state.inputValidities}
        const formIsValid = {...state.formIsValid}

        return {
            ...state,
            inputValues: {...state.inputValues, appointmentDateTime: action.value},
            inputValidities: inputValidities,
            formIsValid: formIsValid
        };
        
    }

    return state;
};

const editSpotScreen = (props) => {

    const dispatch = useDispatch();

    const spotId = props.route.params ? props.route.params.spotId : null;
    const editedSpot = useSelector(state => state.spots.userSpots.find(spot => spot.id === spotId));

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [showAppointmentDateTime, setShowAppointmentDateTime] = useState(false);
    const [dateTimeMode, setDateTimeMode] = useState();
    
    const[formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            title: editedSpot ? editedSpot.title : '',
            description: editedSpot ? editedSpot.description : '',
            appointmentDateTime: editedSpot ? editedSpot.appointmentDateTime : new Date(Date.now()+1*24*60*60*1000),
            duration: editedSpot ? editedSpot.duration : '',
            price: editedSpot ? String(editedSpot.price) : '',
            imageUrl: editedSpot ? editedSpot.imageUrl : ''
        },
        inputValidities: {
            title: editedSpot ? true : false,
            description: editedSpot ? true : false,
            duration: editedSpot ? true : false,
            price: editedSpot ? true : false,
            imageUrl: editedSpot ? true : false
        },
        formIsValid: editedSpot ? true : false
    });

    useEffect(() => {
        if (error) {
            Alert.alert('Oops!', `${error}`, [{ text: 'Ok' }]);
        }
    }, [error]);

    const submitHandler = useCallback( async () => {

        if(!formState.formIsValid) {
            Alert.alert('Validation Error', 'Check your form', [{text: 'Ok'}]);
            return;
        }

        setError(null);
        setIsLoading(true);

        try {
            if(editedSpot) {
                await dispatch(spotActions.updateSpot(
                    spotId,
                    formState.inputValues.title,
                    formState.inputValues.description,
                    formState.inputValues.appointmentDateTime,
                    +formState.inputValues.duration,
                    +formState.inputValues.price,
                    formState.inputValues.imageUrl
                ));
            } else {
                await dispatch(spotActions.createSpot(
                    formState.inputValues.title,
                    formState.inputValues.description,
                    formState.inputValues.appointmentDateTime,
                    +formState.inputValues.duration,
                    +formState.inputValues.price,
                    formState.inputValues.imageUrl
                ));
            }

            props.navigation.goBack();

        } catch (error) {
            setError(error);
        }
        
        setIsLoading(false);

    }, [dispatch, spotId, formState]);

    const datePressHandler = () => {
        setShowAppointmentDateTime(prevState => !prevState);
        setDateTimeMode('date');
    }

    const timePressHandler = () => {
        setShowAppointmentDateTime(prevState => !prevState);
        setDateTimeMode('time');
    }

    useEffect(() => {
        props.navigation.setOptions({
            headerRight: () => (
                <HeaderButtons HeaderButtonComponent={HeaderButton}>
                    <Item 
                        title='Save' 
                        iconName={
                            Platform.OS === 'android' 
                            ? 'md-checkmark'
                            : 'ios-checkmark'
                        }
                        onPress={submitHandler}/>
                </HeaderButtons>
            )
        });
    }, [submitHandler]);

    const changeHandler = useCallback((inputIdentifier, inputValue, inputValidity) => {
        dispatchFormState({
            type: FORM_INPUT_UPDATE,
            value: inputValue,
            isValid: inputValidity,
            input: inputIdentifier
        });
    }, [dispatchFormState]);

    const appointmentDateChangeHandler = useCallback((event, selectedDate) => {

        dispatchFormState({
            type: DATE_INPUT_UPDATE,
            value: selectedDate
        });
        setShowAppointmentDateTime(false);

    }, [dispatchFormState, setShowAppointmentDateTime]);

    if(error) {
        return (
            <View style={styles.centred}>
                <Text style={styles.errorText}>An Error Ocurred</Text>
                <Text style={styles.errorText}>{error.msg}</Text>
                <Button color={colours.primary} 
                    title="Try again"
                    // onPress={loadSpots}
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
            style={styles.avoidingView}
            behavior={Platform.OS ==='android' ? null : 'padding'}
            keyboardVerticalOffset={100}>
            <ScrollView>
                <View style={styles.form}>
                    <Card>
                        <View style={styles.textView}>
                            <Input
                                id='title'
                                label='Title'
                                errorText='Please enter a valid title'
                                keyboardType='default'
                                autoCapitalize='sentences'
                                autoCorrect
                                returnKeyType='next'
                                onInputChange={changeHandler}
                                initialValue={editedSpot ? editedSpot.title : ''}
                                initiallyValid={!!editedSpot}
                                required
                                minLength={4}
                                maxLength={32}
                            />
                            <Input 
                                id='description'
                                label='Description'
                                errorText='Please enter a valid description'
                                keyboardType='default'
                                autoCapitalize='sentences'
                                autoCorrect
                                muliline
                                numberOfLines={3}
                                onInputChange={changeHandler}
                                initialValue={editedSpot ? editedSpot.description : ''}
                                initiallyValid={!!editedSpot}
                                required
                                minLength={5}
                                maxLength={100}
                            />
                        </View>
                    </Card>
                    <Card>
                        {Platform.OS === 'android'
                            ? (<View style={styles.androidDateView}>

                                <View>
                                    <Text style={styles.label}>Date</Text>
                                    <Text style={styles.dateText}>{shortDatetext(formState.inputValues.appointmentDateTime)}</Text>
                                </View>
                                <Pressable style={styles.button} onPress={datePressHandler}>
                                    <Text style={styles.buttonText}>Date</Text>
                                </Pressable>
                                <View>
                                    <Text style={styles.label}>Time</Text>
                                    <Text style={styles.dateText}>{timeText(formState.inputValues.appointmentDateTime)}</Text>
                                </View>
                                <Pressable style={styles.button} onPress={timePressHandler}>
                                    <Text style={styles.buttonText}>Time</Text>
                                </Pressable>
                                {showAppointmentDateTime && (
                                    <DateTimePicker
                                        id='androidDateTimePicker'
                                        style={styles.date}
                                        value={editedSpot ? editedSpot.appointmentDateTime : new Date(Date.now()+1*24*60*60*1000)}
                                        mode={dateTimeMode}
                                        is24Hour={true}
                                        display="default"
                                        onChange={appointmentDateChangeHandler}
                                    />
                                )}
                            </View>)
                            : (<View style={styles.iosDateView}>
                                <Text style={styles.label}>When</Text>
                                    <DateTimePicker
                                        id='iosDateTimePicker'
                                        style={styles.date}
                                        value={formState.inputValues.appointmentDateTime}
                                        mode={'datetime'}
                                        is24Hour={true}
                                        display="default"
                                        onChange={appointmentDateChangeHandler}
                                    />
                            </View>
                        )}
                        
                        <View style={styles.durationView}>
                            <Input
                                id='duration'
                                label='Duration in minutes'
                                errorText='Please enter a valid duration in minutes'
                                keyboardType='decimal-pad'
                                returnKeyType='next'
                                onInputChange={changeHandler}
                                initialValue={editedSpot ? String(editedSpot.duration) : ''}
                                initiallyValid={!!editedSpot}
                                required
                                min={10}
                                max={300}
                            />
                        </View>
                        <View style={styles.priceView}>
                            <Input
                                id='price'
                                label='Price'
                                errorText='Please enter a valid price'
                                keyboardType='decimal-pad'
                                returnKeyType='next'
                                onInputChange={changeHandler}
                                initialValue={editedSpot ? String(editedSpot.price) : ''}
                                initiallyValid={!!editedSpot}
                                required
                                min={1}
                            />
                        </View>
                    </Card>
                    <Card>
                        <View style={styles.urlView}>
                            <Input
                                id='imageUrl'
                                label='Image URL'
                                errorText='Please enter a valid URL'
                                keyboardType='default'
                                autoCapitalize='none'
                                returnKeyType='next'
                                onInputChange={changeHandler}
                                initialValue={editedSpot ? editedSpot.imageUrl : ''}
                                initiallyValid={!!editedSpot}
                                required
                            />
                        </View>
                    </Card>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export const screenOptions = (navData) => {

    const routeParams = navData.route.params ? navData.route.params : {};
    
    return {
        headerTitle: routeParams.spotId
            ? 'Edit Spot'
            : 'Add Spot'
    }
};

const styles = StyleSheet.create({
    avoidingView: {
        flex: 1
    },
    form: {
        margin: 20
    },
    centred: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    formControl: {
        width: '100%'
    },
    label: {
        fontFamily: 'open-sans-bold',
        marginVertical: 8
    },
    textView: {
        padding: 10
    },
    iosDateView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        padding: 10
    },
    androidDateView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        padding: 10,
    },
    dateText: {
        paddingHorizontal: 2,
        paddingVertical: 5,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1
    },
    date: {
        width:'60%'
    },
    time: {
        width: '20%'
    },
    durationView: {
        padding: 10
    },
    priceView: {
        padding: 10
    },
    urlView: {
        padding: 10
    },
    button: {
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 35,
        paddingVertical: 3,
        paddingHorizontal: 3,
        borderRadius: 4,
        backgroundColor: colours.primary,
    },
    buttonText: {
        letterSpacing: 0.25,
        color: 'white',
    },
    centred: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center'
    }
});

export default editSpotScreen;