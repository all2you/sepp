import React from 'react';
//import { Constants, SecureStore } from 'expo';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import { AsyncStorage } from 'react-native';
import { Spinner, Container } from 'native-base';
import { connect } from 'react-redux';
import { TINT_COLOR } from './Colors';
import { setUsername, setUserid, setDpname, setUserpic } from '../reducers/InfoReducer';
 
class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props); 
  } 

  goMainScreen() {
    this.props.navigation.navigate('App');
  }

  goLoginScreen() {
    this.props.navigation.navigate('Auth');
  }

  async componentWillMount() {
    //await SecureStore.deleteItemAsync('userToken', { keychainService: Constants.deviceId });

    const userToken = await SecureStore.getItemAsync('userToken', { keychainService: Constants.deviceId });
    
    console.log('userToken:', userToken);
 
    if ( !userToken ) {
      return this.goLoginScreen();
    }

    try {
      const {
        access_token,
        issued_at,
        expires_in,
        username,
        userid,
        dpname,
        userpic,
      }  = JSON.parse(userToken);
      // 1. exp 날짜 체크  
      if ( (issued_at + expires_in) <= (Date.now() / 1000) ) {
        // 만료일이 지났으면 토큰 삭제
        console.log('expired token!!!');
        await SecureStore.deleteItemAsync('userToken', { keychainService: Constants.deviceId });
        this.goLoginScreen();
      } else {
        // 인증(로그인) 상태
        // console.log('authed');
        this.props.setUsername({ username });
        this.props.setUserid({ userid });
        this.props.setDpname({ dpname }); 
        this.props.setUserpic({ userpic }); 
        this.goMainScreen();
        //this.goLoginScreen();
      }
      
    } catch(error) {
      console.error(error);
      await SecureStore.deleteItemAsync('userToken', { keychainService: Constants.deviceId });
      this.goLoginScreen();
    }

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    // this.props.navigation.navigate(userToken ? 'App' : 'Auth');
  };

  // Render any loading content that you like here
  render() {
    return (
      <Container style={{flex:1, justifyContent:'center' }}>
        <Spinner color={ TINT_COLOR } />
      </Container>
    );
  }
}

const mapStateToProps = () => ({});
const mapDispatchToProps = { 
    setUsername,
    setUserid,
    setDpname,
    setUserpic
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthLoadingScreen);