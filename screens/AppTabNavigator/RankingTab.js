import React, { Component } from 'react';
import { 
    View,
    Text,
    StyleSheet
    } from 'react-native';
import { Icon } from 'native-base';
 
export default class RankingTab extends Component{
    render(){
        return (
            <View style={style.container}>
                <Text>Ranking</Text>
            </View>
        );
    }
}
 
const style = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
})