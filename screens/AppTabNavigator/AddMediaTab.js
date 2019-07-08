import React, { Component } from 'react';
import { View,Text,StyleSheet, Image, Platform, StatusBar, ScrollView, Dimensions, KeyboardAvoidingView, Modal, TouchableOpacity, TouchableWithoutFeedback, Keyboard} from 'react-native';
import { Container, Content, Icon, Button,Thumbnail, Header, Footer, Left, Right, Body,Item, Input, Form, Fab, Toast, Segment} from 'native-base';
import { ButtonGroup } from 'react-native-elements';
//import ImagePicker from 'react-native-image-picker'; 
//import { MapView} from 'expo';
import { connect } from 'react-redux';
import MapView from 'react-native-maps'
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import Textarea from 'react-native-textarea';
import Spinner from 'react-native-loading-spinner-overlay';
import { NavigationEvents } from "react-navigation";
import { SERVER_URL } from '../../components/Config';

const SCREEN_HEIGHT = Dimensions.get('window').height;

class AddMediaTab extends Component{
    constructor(props) {
        super(props);
        this.state = {
            subject : '',
            content : '',
            fabActive : false,
            media : [],
            location : null,
            oldLocation : null,
            currLocation : {latitude:0,longitude:0},
            initLocation : null,
            currAddress : null,
            marker:{title:'신고 위치',description:''},
            mapModal:false,
            errorMessage:null,
            tags:{},
            openFlag:0,
            transFlag:false,
        };
      }
      _setCurrLocation = (loc) => {
            this.setState({ currLocation : loc});
            this._locToAddr(loc);
        }

        _locToAddr = (loc) => {
            var url = "https://dapi.kakao.com/v2/local/geo/coord2address.json";
            url = url+"?x="+loc.longitude+"&y="+loc.latitude+"&input_coord=WGS84";
            var addr = "";
            fetch(url, {
                method: "GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization' : 'KakaoAK 8ab589a24baa9b55a76dec92f052c413'
                }
            })
            .then(response => response.json())
            .then(response => {
                if(response){
                    //console.log(response)
                    if(response.documents && response.documents.length > 0){
                        var addr = response.documents[0].address.address_name||"";
                        this.setState({currAddress:addr});
                        this.setState({marker:{title:'신고 위치',description:addr}});
                    }
                }
            })  
            .catch(error => { 
                console.log(error);
            }); 
        }

        _getTag = (imgFile) => {
            var url = "https://kapi.kakao.com/v1/vision/multitag/generate";

            const data = new FormData();

            data.append('file', {
                uri: Platform.OS === "android" ? imgFile.uri : imgFile.uri.replace("file://", ""),
                type: imgFile.type+"/jpg",
                name: "file",
            });  

            fetch(url, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                    'Authorization' : 'KakaoAK 8ab589a24baa9b55a76dec92f052c413'
                },
                body : data
            })
            .then(response => response.json())
            .then(response => { 
                if(response){
                    if(response.result){
                        var tagsArray = response.result.label_kr;

                        let tags = this.state.tags;
                        tags[imgFile.uri] = tagsArray;

                        this.setState({
                            tags: tags
                        });
                    }
                }
            })  
            .catch(error => { 
                console.log(error);
            }); 
        }

        _mapModal = (flag) => {
            this.setState({mapModal: flag});
        }

        _setLocation = () => {
            this.setState({oldLocation:this.state.currLocation});
            this._mapModal(true);
        }

        _getLocation  = async () => {
            let { status } = await Permissions.askAsync(Permissions.LOCATION);
            if (status !== 'granted') {
            this.setState({
                errorMessage: 'Permission to access location was denied',
            });
            }
        
            let location = await Location.getCurrentPositionAsync({});
            this.setState({location});
            var loc = {latitude :location.coords.latitude,longitude:location.coords.longitude};
            this._setCurrLocation(loc);
        };

        _renderImages() { 
            let medias = [];  
            this.state.media.map((item, index) => {
                medias.push( 
                    <View key={index} style={{flex:1}}>
                        <Image
                            source={{ uri: item.uri }}
                            style={{ height:'60%',width: 100, marginHorizontal: 5, borderColor: '#dddddd', borderWidth: 2 }}
                        />
                        <Button iconLeft transparent>
                            <Text style={{marginLeft:10}}>
                                { this.state.tags[item.uri] ? "#"+this.state.tags[item.uri].join(",") : "" }
                            </Text>
                        </Button> 
                    </View>
            );
            }); 
            return medias;
        }

        _takePhoto = async () => {
            const {
            status: cameraPerm
            } = await Permissions.askAsync(Permissions.CAMERA);
        
            const {
            status: cameraRollPerm
            } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

            if (cameraPerm === 'granted' && cameraRollPerm === 'granted') {
            let pickerResult = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
                //mediaTypes:ImagePicker.MediaTypeOptions.All,
                quality:0.3,
            });
        
            this._handleImagePicked(pickerResult);
            }
        };

        _pickImage = async () => {
            const {
            status: cameraRollPerm
            } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        
            // only if user allows permission to camera roll
            if (cameraRollPerm === 'granted') {
            let pickerResult = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3],
                //mediaTypes:ImagePicker.MediaTypeOptions.All,
                quality:0.3,
            });
        
            this._handleImagePicked(pickerResult);
            }
        };

        _handleImagePicked = async pickerResult => {
            //let uploadResponse, uploadResult;
            try {   
            if (!pickerResult.cancelled) {
                this._getTag(pickerResult);
                this.setState({
                    media: this.state.media.concat([pickerResult]),
                });
            }
            } catch (e) {
            } finally {
            }
        };

        createFormData = () => {
            const data = new FormData(); 
            var state = this.state;
            Object.keys(state).forEach(key => {
                if(key === "subject" || key === "content" || key === "currLocation" || key === "currAddress"){
                    var val = state[key];            
                    data.append(key, val);
                }else if(key === "tags"){
                    let tagArr = [];
                    Object.keys(state[key]).map((k) => {
                        tagArr = tagArr.concat(state[key][k]);
                    })
                    const distTagArr = [...new Set(tagArr)];
                    data.append(key, distTagArr.join(","));
                }else if(key === "openFlag"){
                    let openYn = state[key] === 0?'Y':'N';
                    data.append("openYn", openYn);
                }
            });
            
            this.state.media.forEach((media, index) => {
                var _fileLen = media.uri.length;
                var _lastDot = media.uri.lastIndexOf('.');
                var _fileExt = media.uri.substring(_lastDot+1, _fileLen).toLowerCase();
                data.append('media', {
                    uri: Platform.OS === "android" ? media.uri : media.uri.replace("file://", ""),
                    type: media.type+"/"+_fileExt,
                    name: "media"+index,
                });  
            }); 
            data.append("author_id",this.props.userid);
            data.append("author_name", this.props.dpname);
            data.append("author_img", this.props.userpic);
            return data;
        }

    _sendData(){
        this.setState({transFlag:true});
        var data = this.createFormData();
        console.log(data)
        fetch(SERVER_URL+"/Send", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type':'multipart/form-data'
            },
            body: data
        })
        .then(response => response.json())
        .then(response => {
            if(response){
                //console.log("upload succes", response);
                this.setState({transFlag:false});
                this.props.navigation.navigate('Home',{refresh:true});
            }
        })
        .catch(error => { 
            //console.log("upload error", error);
            this.setState({transFlag:false});
            this.props.navigation.navigate('Home',{refresh:true});
            //alert("Upload failed!");
            //this.setState({ media : null });
        }); 
    }

    render(){
        return (
            <Container style={styles.container}>  
            <Spinner
                visible={this.state.transFlag}
                textContent={'저장 중...'}
                textStyle={styles.spinnerTextStyle}
            />
            <NavigationEvents
                onWillFocus={payload => {
                    this._getLocation();
                }}
            />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <KeyboardAvoidingView style={{flex:1}} behavior="padding" enabled>
                <Header>
                    <Left><Icon name="ios-camera" style={{ paddingLeft:10 }} onPress={() => this._takePhoto()} /></Left>
                    <Body><Text>신고하기</Text></Body>
                    <Right>
                        <Button transparent
                            onPress={() => this._sendData()}>
                            <Text>올리기</Text>
                        </Button>
                    </Right> 
                </Header>
                <View style={{ flex: 1}}>
                    <View style={{ flex: 1, height:50, alignItems: 'center', justifyContent: 'center' }}>
                        <Input placeholder='신고 제목' onChangeText={(subject) => this.setState({subject})} style={styles.input}/>
                    </View>  
                    <View style={{ flex: 5}}>  
                        <Textarea 
                            containerStyle={styles.textareaContainer}
                            style={styles.textarea}
                            defaultValue={this.state.content}
                            maxLength={500} 
                            placeholder={'신고 할 내용을 넣어주세요.'}
                            placeholderTextColor={'#c7c7c7'}
                            underlineColorAndroid={'transparent'}
                            onChangeText={(content) => this.setState({content})}
                            autoFocus = {true}
                        />
                        <Fab 
                            active={this.state.fabActive}
                            direction="down" 
                            containerStyle={{ }} 
                            style={{ backgroundColor: '#5067FF' }}
                            position="topRight"
                            onPress={() => this.setState({ fabActive: !this.state.fabActive })}>
                            <Icon name="ios-add"/>
                            <Button style={{ backgroundColor: '#34A34F' }} onPress={this._pickImage}>
                            <Icon name="ios-image" />
                            </Button>
                            <Button style={{ backgroundColor: '#3B5998' }} onPress={this._takePhoto}>
                            <Icon name="ios-camera" />
                            </Button>
                            <Button style={{ backgroundColor: '#9B9998' }} onPress={this._setLocation}>
                            <Icon name="ios-map" />
                            </Button>
                        </Fab>
                        <Modal
                            animationType="slide"
                            transparent={false}
                            visible={this.state.mapModal}
                            onRequestClose={() => {
                                //Alert.alert('Modal has been closed.');
                            }}>
                            <View style={{flex:1,marginTop: 22}}>
                                <MapView
                                    style={{ flex: 9 }}
                                    initialRegion={{
                                        latitude: this.state.location === null ? 0 : this.state.location.coords.latitude,
                                        longitude: this.state.location === null ? 0 : this.state.location.coords.longitude,
                                        latitudeDelta: 0.0922,
                                        longitudeDelta: 0.0421,
                                    }}
                                    region={{
                                        latitude: this.state.currLocation === null ? this.state.location.coords.latitude : this.state.currLocation.latitude,
                                        longitude: this.state.currLocation === null ? this.state.location.coords.longitude : this.state.currLocation.longitude,
                                        latitudeDelta: 0.0922,
                                        longitudeDelta: 0.0421,
                                    }}
                                    onPress={(loc) => {
                                        this._setCurrLocation(loc.nativeEvent.coordinate);
                                    }}
                                >
                                    <MapView.Marker draggable
                                        coordinate={this.state.currLocation}
                                        onDragEnd={(e) => {
                                            this._setCurrLocation(e.nativeEvent.coordinate);
                                        }}
                                        title={this.state.marker.title}
                                        description = {this.state.marker.description}
                                    >
                                    </MapView.Marker>
                                </MapView>
                                <View style={{
                                    position: 'absolute',//use absolute position to show button on top of the map
                                    top: '5%', //for center align
                                    //alignSelf: 'flex-end', //for align to right
                                    flexDirection: 'row',
                                    justifyContent: 'space-around',
                                    width:'100%'

                                    }}>
                                    <Button iconLeft info style={{width:80, opacity:0.8}} onPress={() => {
                                                this._mapModal(false);
                                            }}
                                        >
                                        <Icon name='ios-checkmark' />
                                        <Text style={{color:'#ffffff',marginRight:15}}>선택</Text>
                                    </Button>

                                    <Button iconLeft danger style={{width:80, opacity:0.8}} onPress={() => {
                                                this._setCurrLocation(this.state.oldLocation);
                                                this._mapModal(false);
                                            }}
                                        >
                                        <Icon name='ios-close' />
                                        <Text style={{color:'#ffffff',marginRight:15}}>취소</Text>
                                    </Button>
                                </View>
                                <View style={{
                                    position: 'absolute',//use absolute position to show button on top of the map
                                    top: '90%', //for center align
                                    flexDirection: 'row',
                                    justifyContent: 'space-around',
                                    width:'100%'
                                    }}>
                                    <Button iconLeft info  style={{width:100, opacity:0.8}} onPress={() => {
                                                this._getLocation();
                                            }}
                                        >
                                        <Icon name='ios-pin' />
                                        <Text style={{color:'#ffffff',marginRight:15}}>현재위치</Text>
                                    </Button>
                                </View>
                            </View>
                        </Modal>
                    </View>
                    <View style={{flex:1, backgroundColor:'#ffffff'}}>
                    <ButtonGroup
                        onPress={(index) => {
                            this.setState({openFlag:index});
                        }}
                        selectedIndex={this.state.openFlag}
                        buttons={[<Text>전체공개</Text>,<Text>친구공개</Text>]}
                        containerStyle={{height: 30}} 
                    />
                        { this.state.currAddress ?
                        <Button iconLeft transparent>
                            <Icon name='ios-pin' />
                            <Text style={{marginLeft:10}}>신고 위치 : {this.state.currAddress}</Text>
                        </Button> : null
                        } 
                    </View>
                    <View style={{flex:2, backgroundColor:'#ffffff'}}>
                        <ScrollView 
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{
                            alignItems: 'center',
                            paddingStart: 5,
                            paddingEnd: 5
                        }}>
                            {this._renderImages()}
                        </ScrollView> 
                    </View> 
                </View>
            </KeyboardAvoidingView>     
            </TouchableWithoutFeedback>
            </Container> 
            
        );
    }
}

const styles = StyleSheet.create({
    input :{ 
        borderWidth:0, borderBottomWidth:2, borderColor:'#cccccc', width:'100%', paddingLeft:6
    },
    container: {
        flex: 1,
        backgroundColor: '#ffffff', 
        paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight
    },
    textareaContainer: {
        //height: SCREEN_HEIGHT-400,
        padding: 5,
        flex:1,
        backgroundColor: '#F5FCFF',
    },
    textarea: {
        textAlignVertical: 'top',  // hack android
        //height: SCREEN_HEIGHT-410,
        fontSize: 14,
        color: '#333',
    },
    spinnerTextStyle: {
        color: '#FFF'
    },
})

const mapStateToProps = (state) => {
    const { username, userid, dpname, userpic } = state.info;
    return { username, userid, dpname, userpic }
};
export default connect(
	mapStateToProps,
)(AddMediaTab);