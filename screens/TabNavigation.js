import React, { Component } from 'react';
import { Container,Text,StyleSheet, Platform,StatusBar } from 'react-native';
import { Icon } from 'native-base';
import { createMaterialTopTabNavigator, createAppContainer } from 'react-navigation';

import HomeTab from './AppTabNavigator/HomeTab';
import RankingTab from './AppTabNavigator/RankingTab';
import AddMediaTab from './AppTabNavigator/AddMediaTab';
import FollowTab from './AppTabNavigator/FollowTab';
import ProfileTab from './AppTabNavigator/ProfileTab';

const AppTabNavigator = createMaterialTopTabNavigator({
    Home:{
        screen:HomeTab,
        navigationOptions : {
            tabBarIcon: ({ tintColor }) => (< Icon name='ios-today' style={{color:tintColor}} />)
        }
    },
    Ranking:{
        screen:RankingTab,
        navigationOptions : {
            tabBarIcon: ({ tintColor }) => (< Icon name='ios-podium' style={{color:tintColor}} />)
        }
    },
    AddMedia:{
        screen:AddMediaTab,
        navigationOptions : {
            tabBarIcon: ({ tintColor }) => (< Icon name='ios-add-circle-outline' style={{color:tintColor}} />)
        }
    },
    Follow:{
        screen:FollowTab,
        navigationOptions : {
            tabBarIcon: ({ tintColor }) => (< Icon name='ios-person-add' style={{color:tintColor}} />)
        }
    },
    Profile:{
        screen:ProfileTab,
        navigationOptions : {
            tabBarIcon: ({ tintColor }) => (< Icon name='ios-person' style={{color:tintColor}} />)
        }
    }
}, 
{ 
    animationEnabled: true,
    swipeEnabled: false,
    tabBarPosition: "bottom",
    tabBarOptions: {
        style: {
            ...Platform.select({
                ios:{
                    backgroundColor:'#ffffff'
                }
            })
        },
        iconStyle: { height: 50 },
        activeTintColor: '#000',
        inactiveTintColor: '#d1cece',
        upperCaseLabel: false,
        showLabel: false,
        showIcon: true
    }
})

export default createAppContainer(AppTabNavigator);
