import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform} from 'react-native';
import Card from '../ui/card';

const spotItem = (props) => {

    let TouchableCmp = TouchableOpacity;
    if(Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }
    
    return (
        
        <Card style={styles.spot}>
            <View style={styles.touchable}>
                <TouchableCmp onPress={props.onSelect} useForground>
                    <View>
                        <Image style={styles.image} source={{uri: props.image}}/>
                        <View style={styles.details}>
                            <Text style={styles.title}>{props.title}</Text>
                            <Text style={styles.date}>{props.appointmentDateTime}</Text>
                            <Text style={styles.duration}>For {props.duration} minutes</Text>
                            <Text style={styles.price}>£{props.price.toFixed(2)}</Text>
                        </View>
                        <View style={styles.actions}>
                            {props.children}
                        </View>
                    </View>
                </TouchableCmp>
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    spot: {
        height: 430,
        margin: 20
    },
    touchable: {
        borderRadius: 10,
        overflow: 'hidden'
    },
    image: {
        width: '100%',
        height: '60%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    title: {
        fontFamily: 'open-sans-bold',
        fontSize: 18
    },
    date: {
        fontFamily: 'open-sans',
        fontSize: 14,
        color: '#888'
    },
    duration: {
        fontFamily: 'open-sans',
        fontSize: 14,
        color: '#888'
    },
    price: {
        fontFamily: 'open-sans',
        fontSize: 14,
        color: '#888'
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '23%',
        paddingHorizontal: 20
    },
    details: {
        alignItems: 'center',
        height: '17%',
        padding: 10
    }
});

export default spotItem;