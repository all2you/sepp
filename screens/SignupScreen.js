import React, {Component} from 'react';
import { View, StyleSheet, StatusBar,Platform,Image,ScrollView } from 'react-native';
import { Card, CardItem, Thumbnail, Body, Left, Right, Button, Icon, Container, Content, Header, Input, Title, Text ,Form, Item, Label, Toast} from 'native-base';
import { SERVER_URL } from '../components/Config';
import Spinner from 'react-native-loading-spinner-overlay';

export default class SignupScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username:null,
            password:null,
            displayName:null,
            trans:false,
        }
    }

    _sendUser(){
        if(this.state.username === null){
            Toast.show({
                text: "아이디를 입력해주세요",
                //buttonText: "Ok",
                position: "top"
            });
            return;
        }
        if(this.state.password === null){
            Toast.show({
                text: "비밀번호를 입력해주세요",
                //buttonText: "Ok",
                position: "top"
            });
            return;
        }
        if(this.state.displayName === null){
            Toast.show({
                text: "사용자명을 입력해주세요",
                //buttonText: "Ok",
                position: "top"
            });
            return;
        }
        this.setState({trans:true});
        fetch(SERVER_URL+'/Signup', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username:this.state.username, password:this.state.password, displayName:this.state.displayName})
        })
        .then(response => response.json())
        .then(response => {
            if(response){
                if(response.result === true){
                    Toast.show({
                        text: "가입이 완료되었습니다.",
                        //buttonText: "Ok",
                        position: "top"
                    });
                    var goPage = this.props.navigation;
                    setTimeout(function(){
                        goPage.navigate('Auth');
                    },2000);
                }else if(response.result === "dup"){
                    Toast.show({
                        text: "동일한 아이디가 존재합니다.",
                        position: "top"
                    });
                }
            }
        })  
        .catch(error => { 
            console.log(error);
            this.setState({trans:false});
        }); 
    }
    render(){
        return (
            <Container style={styles.container}>   
                <Spinner
                    visible={this.state.trans}
                    textContent={'가입 중...'}
                    textStyle={styles.spinnerTextStyle}
                /> 
                <Header
                    style={{backgroundColor:'#ffffff'}}
                    iosBarStyle="light-content"
                    androidStatusBarColor="#ffffff">
                <StatusBar 
                    backgroundColor="#ffffff" 
                    barStyle="dark-content"/>
                    <Left>
                        <Button transparent
                            onPress={() => this.props.navigation.navigate('Auth')}>
                            <Icon name="ios-arrow-back" style={{ color: "black" }}/>
                        </Button>
                    </Left>
                    <Body>
                        <Title style={{ color: "black" }}>회원 가입</Title>
                    </Body>
                    <Right>
                    </Right>
                </Header>
                <Content padder>
                    <Form>
                        <Item floatingLabel>
                            <Label>아이디</Label>
                            <Input 
                                onChangeText={(username) => this.setState({username})}/>
                        </Item>
                        <Item floatingLabel last>
                            <Label>패스워드</Label>
                            <Input
                                onChangeText={(password) => this.setState({password})}/>
                        </Item>
                        <Item floatingLabel last>
                            <Label>사용자명</Label>
                            <Input 
                                onChangeText={(displayName) => this.setState({displayName})}/>
                        </Item>
                        <Button block info style={{marginTop:20}}
                            onPress={() => this._sendUser()}
                        >
                            <Text>가입하기</Text>
                        </Button>
                    </Form>
                </Content>
            </Container>
        )
    }
}; 

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight
    },
    spinnerTextStyle: {
        color: '#FFF'
    },
});
