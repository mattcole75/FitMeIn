import React, {useState} from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';

import Card from '../ui/card';
import BasketItem from './basketItem';
import colours from '../../constants/colours';

const orderitem = (props) => {

    const [showDetails, setShowDetails] = useState(false);

    return (
        <Card style={styles.orderItem}>
            <View style={styles.summary}>
                <Text style={styles.currency}>£{props.total.toFixed(2)}</Text>
                <Text style={styles.date}>{props.date}</Text>
            </View>
            <Button 
                color={colours.primary} 
                title={showDetails ? 'Hide details' : 'Show details'}
                onPress={() => {
                    setShowDetails(prevState => !prevState)
                }}
            />
            {showDetails ? (<View style={styles.detail}>
                {JSON.parse(props.items).map(item =>
                    <BasketItem 
                        key={item.id}
                        title={item.title} 
                        price={item.price}
                    />)}
            </View>) : null}
        </Card>
    );
};

const styles = StyleSheet.create({
    orderItem: {
        margin: 20,
        padding: 10,
        alignItems: 'center'
    },
    summary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 15

    },
    currency: {
        fontFamily: 'open-sans-bold',
        fontSize: 18
    },
    date: {
        fontFamily: 'open-sans',
        fontSize: 18,
        color: '#888'
    },
    detail: {
       width: '100%' 
    }
});

export default orderitem;