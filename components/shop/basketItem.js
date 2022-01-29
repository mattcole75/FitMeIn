import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Platform} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

const basketItem = (props) => {

    return (
        <View style={styles.basketItem}>
            <Text style={styles.title}>{props.title}</Text>
            <View style={styles.basketItem}>
                <Text style={styles.currency}>£{props.price.toFixed(2)}</Text>
                {props.deletable ? <TouchableOpacity onPress={props.onRemove} style={styles.deleteButton}>
                    <Ionicons 
                        name={Platform.OS === 'android' ? 'md-trash' : 'ios-trash'}
                        size={23}
                        color='red'
                    />
                </TouchableOpacity> : null}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    basketItem: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 20
    },
    title: {
        fontFamily: 'open-sans-bold',
        fontSize: 16
    },
    currency: {
        fontFamily: 'open-sans-bold',
        fontSize: 16
    },
    deleteButton: {
        marginLeft: 20
    }
});

export default basketItem;