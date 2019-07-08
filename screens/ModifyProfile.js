import React, {Component} from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet, StatusBar,Platform,Image,ScrollView } from 'react-native';
import { Card, CardItem, Thumbnail, Body, Left, Right, Button, Icon, Container, Content, Header, Input, Title, Text ,Form, Item, Label, Toast} from 'native-base';
import { SERVER_URL } from '../components/Config';
import Spinner from 'react-native-loading-spinner-overlay';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

class ModifyProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profile:{},
            displayName : null,
            userPic : null,
            uplaodPic : null,
            trans:false,
        }
    }

    fetchAccount(userid) {
        const data = {
            userid:userid
        };
        return fetch(SERVER_URL+'/User', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        }) 
        .then(res => res.json())
        .then(res => res)
    }

    componentWillMount() { 
        const userid = this.props.userid;
        this.fetchAccount(userid).then((profile) => {
            var userPic = 'user.jpg';
            if(profile.userPic) {
                userPic = profile.userPic;
            }
            console.log(userPic) 
            this.setState({userPic:SERVER_URL+'/'+userPic});
            this.setState({displayName:profile.displayName});
            this.setState({ 
                profile
            })
        });
    }

    _pickProfileImage = async () => {
        const {
          status: cameraRollPerm
        } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    
        // only if user allows permission to camera roll
        if (cameraRollPerm === 'granted') {
          let pickerResult = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality:0.01,
          });
    
          try {   
            if (!pickerResult.cancelled) {
                console.log(pickerResult.uri)
                this.setState({
                    uplaodPic: pickerResult, 
                    userPic : pickerResult.uri
                }); 
            }
          } catch (e) {
          } finally {
          }
        }
    };

    _sendProfile(){
        if(this.state.displayName === null || this.state.displayName.trim() === ''){
            Toast.show({
                text: "사용자명을 입력해주세요",
                //buttonText: "Ok",
                position: "top"
            });
            return;
        }
        const data = new FormData();
        data.append("userid",this.props.userid);
        data.append("displayName",this.state.displayName);

        if(this.state.uplaodPic !== null){
            const pic = this.state.uplaodPic;
            var _fileLen = pic.uri.length;
            var _lastDot = pic.uri.lastIndexOf('.');
            var _fileExt = pic.uri.substring(_lastDot+1, _fileLen).toLowerCase();
            data.append('userPic', {
                uri: Platform.OS === "android" ? pic.uri : pic.uri.replace("file://", ""),
                type: pic.type+"/"+_fileExt,
                name: "userPic",
            });  
        }
        console.log(data)
        this.setState({trans:true});
        fetch(SERVER_URL+'/Profile', {
            method: "POST",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data'
            },
            body: data
        })
        .then(response => response.json())
        .then(response => {
            if(response){
                this.setState({trans:false});
                this.props.navigation.navigate('Profile');
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
                    textContent={'적용 중...'}
                    textStyle={styles.spinnerTextStyle}
                /> 
                <Header>
                    <Left>
                        <Button transparent
                            onPress={() => this.props.navigation.navigate('Profile')}>
                            <Text>취소</Text>
                        </Button>
                    </Left> 
                    <Body><Text>프로필 수정</Text></Body>
                    <Right>
                        <Button transparent
                            onPress={() => this._sendProfile()}>
                            <Text>완료</Text>
                        </Button>
                    </Right>
                </Header>
                <Content padder>
                    <View style={{flex:1,justifyContent: 'center',alignItems: 'center',}}>
                        <Thumbnail style={{width:200,height:200,borderRadius:100 }} source={{uri: this.state.userPic}} />
                        <Text></Text>
                        <Button transparent block
                                onPress={() => this._pickProfileImage()}
                            >
                                <Text>프로필 사진 바꾸기</Text>
                        </Button>
                    </View>
                    <View style={{flex:1}}>
                        <Form>
                            <Item floatingLabel last>
                                <Label>사용자명</Label>
                                <Input value={this.state.displayName}
                                        onChangeText={(displayName) => this.setState({displayName})}/>
                            </Item>
                        </Form>
                    </View>
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

const mapStateToProps = (state) => {
    const { username, userid, dpname, userpic } = state.info;
    return { username, userid, dpname, userpic }
};
export default connect(
	mapStateToProps,
)(ModifyProfile); 