import React from 'react';
import {FlatList} from 'react-native';
import {useSelector} from 'react-redux'
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/ui/headerButton';

import Orderitem from '../../components/shop/orderItem';

const orderScreen = (props) => {
    const items = useSelector(state => state.orders.items);

    return (
        <FlatList 
            data={items}
            keyExtractor={item => item.id}
            renderItem={itemData =>
                <Orderitem 
                    total={itemData.item.total}
                    date={itemData.item.textDate}
                    items={itemData.item.items}
                />
            }
        />
    );
};

orderScreen.navigationOptions = (navData) => {
    return {
        headerTitle: 'Your Orders',
        headerLeft: (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item 
                    title='Menu' 
                    iconName={
                        Platform.OS === 'android' 
                        ? 'md-menu'
                        : 'ios-menu'
                    }
                    onPress={() => {
                        navData.navigation.toggleDrawer();
                    }}/>
            </HeaderButtons>
        )
    }
    
};

export default orderScreen;