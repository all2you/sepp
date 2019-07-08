import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Dimensions,
  TouchableWithoutFeedback, Keyboard,
} from 'react-native';
import { Toast } from 'native-base';
import { connect } from 'react-redux';
import { setUsername, setDpname, setUserid, setUserpic} from '../reducers/InfoReducer';
import { Input, Button, Icon } from 'react-native-elements';
//import {Asset,Font, Constants, SecureStore} from "expo";
import Constants from 'expo-constants';
import * as Font from 'expo-font';
import * as SecureStore from 'expo-secure-store';
import { SERVER_URL } from '../components/Config';

const cacheFonts = Font.loadAsync;

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const BG_IMAGE = require('../assets/images/loginBg.png');

class LoginScreen extends Component {  
  constructor(props) {
    super(props);

    this.state = { 
      fontLoaded: false,
      email: '',
      email_valid: true,
      password: '',
      login_failed: false,
      showLoading: false,
    };
  }

  async componentDidMount() {
    await cacheFonts({
      georgia: require('../assets/fonts/Georgia.ttf'),
      regular: require('../assets/fonts/Montserrat-Regular.ttf'),
      light: require('../assets/fonts/Montserrat-Light.ttf'),
      bold: require('../assets/fonts/Montserrat-Bold.ttf'),
    });

    this.setState({ fontLoaded: true });
  }

  validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return re.test(email);
  }

  _goSignup() {
    this.props.navigation.navigate('Signup');
  }

  submitLoginCredentials() {
    const { showLoading } = this.state;

    this.setState({
      showLoading: !showLoading,
    });

    fetch(SERVER_URL+'/Login', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({username:this.state.email, password:this.state.password})
    })
    .then(response => response.json())
    .then(response => {
        if(response){
            //console.log(response);
            if(response.username){
                var userToken = {
                    userid : response._id,
                    username : response.username,
                    dpname : response.displayName,
                    userpic : response.userPic||'/user.jpg',
                };
                userToken['issued_at'] = Math.floor(Date.now() / 1000);
                userToken['expires_in'] = 10000;
                 
                SecureStore.setItemAsync('userToken', JSON.stringify(userToken), { keychainService: Constants.deviceId });

                this.props.setUsername({ username: userToken.username });
                this.props.setUserid({ userid: userToken.userid });
                this.props.setDpname({ dpname : userToken.dpname });
                this.props.setUserpic({ userpic : userToken.userpic });

		            this.props.navigation.navigate('App');
            }else {
                Toast.show({
                    text: "회원정보가 없습니다.",
                    position: "top"
                }); 
                
            }
            this.setState({showLoading: false});
        }
    })  
    .catch(error => { 
        console.log(error);
    });  
  }

  render() {
    const { email, password, email_valid, showLoading } = this.state;

    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ImageBackground source={BG_IMAGE} style={styles.bgImage}>
          {this.state.fontLoaded ? (
            <View style={styles.loginView}>
              <View style={styles.loginTitle}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.travelText}>SEPP</Text>
                  <Text style={styles.plusText}></Text>
                </View>
                <View style={{ marginTop: -10 }}>
                  <Text style={styles.travelText}>안전환경 파파라치</Text>
                </View>
              </View>
              <View style={styles.loginInput}>
                <Input
                  leftIcon={
                    <Icon
                      name="user-o"
                      type="font-awesome"
                      color="rgba(255, 255, 255, 1)"
                      size={25}
                    />
                  }
                  containerStyle={{ marginVertical: 10 }}
                  onChangeText={email => this.setState({ email })}
                  value={email}
                  inputStyle={{ marginLeft: 10, color: 'white' }}
                  keyboardAppearance="light"
                  placeholder="아이디"
                  autoFocus={false}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  returnKeyType="next"
                  ref={input => (this.emailInput = input)}
                  onSubmitEditing={() => {
                    //this.setState({ email_valid: this.validateEmail(email) });
                    this.passwordInput.focus(); 
                  }}
                  blurOnSubmit={false}
                  placeholderTextColor="white"
                  errorStyle={{ textAlign: 'center', fontSize: 12 }}
                  errorMessage={
                    email_valid ? null : '올바른 이메일 형식이 아닙니다.'
                  }
                />
                <Input
                  leftIcon={
                    <Icon
                      name="lock"
                      type="font-awesome"
                      color="rgba(255, 255, 255, 1)"
                      size={25}
                    />
                  }
                  containerStyle={{ marginVertical: 10 }}
                  onChangeText={password => this.setState({ password })}
                  value={password}
                  inputStyle={{ marginLeft: 10, color: 'white' }}
                  secureTextEntry={true}
                  keyboardAppearance="light"
                  placeholder="패스워드"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="default"
                  returnKeyType="done"
                  ref={input => (this.passwordInput = input)}
                  blurOnSubmit={true}
                  placeholderTextColor="white"
                />
              </View>
              <Button
                title="로그인"
                activeOpacity={1}
                underlayColor="transparent"
                onPress={this.submitLoginCredentials.bind(this)}
                loading={showLoading}
                loadingProps={{ size: 'small', color: 'white' }}
                disabled={!email_valid && password.length < 8}
                buttonStyle={{
                  height: 50,
                  width: 250,
                  backgroundColor: 'transparent',
                  borderWidth: 2,
                  borderColor: 'white',
                  borderRadius: 30,
                }}
                containerStyle={{ marginVertical: 10 }}
                titleStyle={{ fontWeight: 'bold', color: 'white' }}
              />
              <View style={styles.footerView}>
               
                <Button
                  title="회원가입"
                  clear
                  activeOpacity={0.5}
                  titleStyle={{ color: 'white', fontSize: 15 }}
                  containerStyle={{ marginTop: -10 }}
                  onPress={() => {this._goSignup()}}
                />
              </View>
            </View>
          ) : (
            <Text>Loading...</Text>
          )}
        </ImageBackground>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgImage: {
    flex: 1,
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginView: {
    marginTop: 0,
    backgroundColor: 'transparent',
    width: 250,
    height: 450,
  },
  loginTitle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  travelText: {
    color: '#000000',
    fontSize: 30,
    fontFamily: 'bold',
  },
  plusText: {
    color: 'white',
    fontSize: 30,
    fontFamily: 'regular',
  },
  loginInput: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerView: {
    marginTop: 20,
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const mapStateToProps = (state) => {
  const { username, userid, dpname, userpic } = state.info;
  return { username, userid, dpname, userpic }
};
const mapDispatchToProps = { 
  setUsername,
  setUserid,
  setDpname,
  setUserpic
};
export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(LoginScreen);