import React, { Component } from 'react';
import { View,Text,StyleSheet, Image, Dimensions, Platform, StatusBar } from 'react-native';
import { Icon,Container, Content, Header, Left, Body, Right, Button, Thumbnail,Tab, Tabs, TabHeading} from 'native-base';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
import { connect } from 'react-redux';
import { SERVER_URL } from '../../components/Config';
import { NavigationEvents } from "react-navigation";
import CardComponent from '../../components/CardComponent'; 

const { width, height } = Dimensions.get('window');

class ProfileTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            myPost:[],
            postCount:0,
            followingCount:0,
            followerCount:0
        };
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

    fetchMyPost(userid){
        const data = {
            userid:userid
        };
        return fetch(SERVER_URL+'/MyPost', {
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

    fetchFollowCount(username) {
        const data = {
          id: 4,
          jsonrpc: "2.0",
          method: "call",
          params: [
            "follow_api",
            "get_follow_count",
            [username]
          ]
        };
        return fetch('https://api.steemit.com', {
          method: 'POST',
          body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(res => res.result)
    }

    _getProfile(){ 
        const userid = this.props.userid;
        this.fetchAccount(userid).then(({username, displayName, userPic, point, group}) => {
            if(!userPic)userPic = 'user.jpg';
            this.setState({ 
                username, 
                displayName,
                userPic, 
                point, 
                group
            })
        });

        this.fetchMyPost(userid).then((myPost) => {
            console.log("1111")
            console.log(myPost)
            console.log("2222")
            this.setState({ 
                myPost
            }) 
        });
        /*
        this.fetchFollowCount(username).then(({following_count, follower_count}) => {
            this.setState({
                followingCount: following_count, // 팔로잉 수
                followerCount: follower_count // 팔로워 수
            })
        });
        */
    }
    
    renderSectionOne = () => {
        return this.state.myPost.map((item, i) => (
            item.media.map((media , j) => (
                <Thumbnail key={i+'_'+j} style={{width: width/3, height: width/3,borderRadius:0}} source={{uri: SERVER_URL+'/'+media}} />
            ))
        ))
    }

    renderSectionTwo = () => {
        return this.state.myPost.map(item => (
            <CardComponent 
             key={item._id} 
                data={item}
                onPress={ 
                    (event) => {
                        event.stopPropagation(); 
                        this.props.navigation.navigate('Details', {item});
                    }
                }
            />
        ));
    }
    render(){
        const { 
            username, 
            displayName, 
            userPic, 
            point, 
            group,
            postCount,
            followingCount,
            followerCount 
        } = this.state;
        return (
            <Container style={styles.container}>
                <NavigationEvents
                    onWillFocus={payload => {
                        this._getProfile();
                    }}
                />
                <Header>
                    <Left><Icon name="md-person-add" style={{ paddingLeft:10 }} /></Left>
                    <Body><Text>프로필</Text></Body>
                    <Right><Icon name="more" style={{ paddingRight:10, fontSize: 32 }} /></Right>
                </Header>
                <Content>
                    <View style={{flexDirection:'row', paddingTop:10}}>
                        <View style={{flex:1, alignItems:'center'}}>
                            <Thumbnail style={{ }} source={{uri: SERVER_URL+'/'+this.state.userPic}} />
                        </View>
                        <View style={{flex:3}}>
                        <View style={{flexDirection:'row', justifyContent:'space-around'}}>
                            <View style={{alignItems:'center'}}>
                            <Text>{postCount}</Text>
                            <Text style={{fontSize:10, color:'#595959'}}>posts</Text>
                            </View>
                            <View style={{alignItems:'center'}}>
                            <Text>{followingCount}</Text>
                            <Text style={{fontSize:10, color:'#595959'}}>follower</Text>
                            </View>
                            <View style={{alignItems:'center'}}>
                            <Text>{followerCount}</Text>
                            <Text style={{fontSize:10, color:'#595959'}}>following</Text>
                            </View>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <Button bordered dark
                                    style={{flex:4, marginLeft:10, justifyContent:'center', height:30, marginTop:10}}
                                    onPress={() => {
                                        this.props.navigation.navigate('ModifyProfile');
                                    }}        
                            >
                            <Text>프로필 수정</Text>
                            </Button>
                            <Button bordered dark
                                    style={{flex:4, marginLeft:10, justifyContent:'center', height:30, marginTop:10}}
                                    onPress={() => {
                                        SecureStore.deleteItemAsync('userToken', { keychainService: Constants.deviceId });
                                        this.props.navigation.navigate('Auth'); 
                                    }}
                            >
                            <Text>로그아웃</Text>
                            </Button>
                            <Button bordered dark small icon 
                                    style={{flex:1, marginRight:10, marginLeft:5, justifyContent:'center', height:30, marginTop:10}}>
                            <Icon name="settings" />
                            </Button>
                        </View>
                        </View>
                    </View>
                    <View style={{paddingHorizontal:10, paddingVertical:10}}>
                        <Text style={{fontWeight:'bold'}}>{displayName} ({username})</Text>
                        <Text>Point : {point}</Text>
                    </View>
                    <Tabs>
                        <Tab heading={<TabHeading><Icon name='ios-apps'/></TabHeading>}>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                { this.renderSectionOne() }
                            </View>
                        </Tab>
                        <Tab heading={ <TabHeading><Icon name='ios-list'/></TabHeading>}>
                            <View>
                                { this.renderSectionTwo() }
                            </View>
                        </Tab>
                    </Tabs>
                </Content>
                
            </Container>
            
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight
    },
})

const mapStateToProps = (state) => {
    const { username, userid, dpname, userpic } = state.info;
    return { username, userid, dpname, userpic }
};
export default connect(
	mapStateToProps,
)(ProfileTab); 