import React from 'react';
import { 
  createSwitchNavigator, // here
  createStackNavigator, 
  createAppContainer 
} from 'react-navigation';

// import MainScreen from '../components/MainScreen';
import TabNavigation from './TabNavigation';
import LoginScreen from './LoginScreen';
import AuthLoadingScreen from '../components/AuthLoadingScreen';

import DetailScreen from './DetailScreen';
import SignupScreen from './SignupScreen';
import ModifyProfile from './ModifyProfile';

const AppStack = createStackNavigator({ 
    Main: { 
        screen: TabNavigation 
    },
    Details: {
        screen: DetailScreen
    }
}, 
{
    initialRouteName: "Main",
    headerMode: 'screen',
    defaultNavigationOptions: {
        header: null
    }
});

const AuthStack = createStackNavigator({ 
    Login: { 
        screen: LoginScreen,
        navigationOptions: {
            // title: 'Login',
            header: null
        }
    }
});

const SignupStack = createStackNavigator({ 
    Signup : { 
        screen: SignupScreen,
        navigationOptions: {
            // title: 'Login',
            header: null
        }
    }
});

const ProfileStack = createStackNavigator({ 
    Signup : { 
        screen: ModifyProfile,
        navigationOptions: {
            // title: 'Login',
            header: null
        }
    }
});

export default createAppContainer(createSwitchNavigator(
    {
        AuthLoading: AuthLoadingScreen,
        App: AppStack,
        Auth: AuthStack,
        Signup:SignupStack,
        ModifyProfile:ProfileStack
    },
    {
        initialRouteName: 'AuthLoading'
    }
));