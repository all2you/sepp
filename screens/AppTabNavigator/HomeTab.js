import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View,Text,StyleSheet, ScrollView, Platform, StatusBar, FlatList} from 'react-native';
import { Container, Icon, Thumbnail, Header, Left, Right, Body } from 'native-base';
import { NavigationEvents } from "react-navigation";
import CardComponent from '../../components/CardComponent'; 
import { SERVER_URL } from '../../components/Config';
 
class HomeTab extends Component{
    constructor(props) {
        super(props);
        this.state = {
            feeds: [],
            selected:new Map(),
            refreshing:false,
            followings: [],
        };
    }
 
    fetchFeeds() {
        const userid = this.props.userid;
        return fetch(SERVER_URL+'/List/'+userid)
            .then(res => res.json())
            .then(res => { 
                //console.log(res)
                this.setState({ refreshing: false });
                return res;
            });
    }

    // 팔로잉 친구 가져오기
    fetchFollowing() {
        const userid = this.props.userid;

        return fetch(SERVER_URL+'/Follow/'+userid)
            .then(res => res.json())
            .then(res => res);
    }

    componentWillMount() {
        this._getList();
        this._getFollow();
    }

    _getList = () => {
        this.fetchFeeds().then(feeds => {
            this.setState({
              feeds
            });
        });
    } 

    _getFollow = () => {
        this.fetchFollowing().then(followings => {
            console.log(followings)
            this.setState({
                followings
            }) 
        });
    }

    _keyExtractor = (item, index) => item._id;

    _addHit = (item) => {
        const { feeds } = this.state;

        fetch(SERVER_URL+'/Hits', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({id:item._id}),
        })
        .then(response => response.json())
        .then(response => {
            if(response){
                var newItem = response;
                var itemId = newItem._id;
                this.setState({feeds : feeds.map(info => itemId === info._id ?newItem:info)});
            }; 
        }) 
        .catch(error => { 
            console.log(error);
        }); 
    };   

    _onPressUp = (item) => { 
        const { feeds } = this.state;
        const uid = this.props.username||"test";
        item.upLoading = true;
        this.setState({feeds : feeds.map(info => item._id === info._id ?{ ...info, ...item }:info)});
        fetch(SERVER_URL+'/Up', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({id:item._id, uid:uid}),
        })
        .then(response => response.json())
        .then(response => {
            if(response){
                var newItem = response;
                var itemId = newItem._id;
                newItem.upLoading = false; 
                this.setState({feeds : feeds.map(info => itemId === info._id ?{ ...info, ...newItem }:info)});
            }; 
        })  
        .catch(error => { 
            console.log(error);
        }); 
    };   

    _onPressDown = (item) => { 
        const { feeds } = this.state;
        const uid = this.props.username||"test";
        item.downLoading = true;
        this.setState({feeds : feeds.map(info => item._id === info._id ?{ ...info, ...item }:info)});
        fetch(SERVER_URL+'/Down', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({id:item._id, uid:uid}),
        })
        .then(response => response.json())
        .then(response => {
            if(response){
                var newItem = response;
                var itemId = newItem._id;
                newItem.downLoading = false; 
                this.setState({feeds : feeds.map(info => itemId === info._id ?{ ...info, ...newItem }:info)});
            }; 
        })  
        .catch(error => { 
            console.log(error);
        }); 
    };   

    _renderItem = ({item}) => (
        <CardComponent 
            key={item._id} 
            data={item}
            onPress={ 
                (event) => {
                  event.stopPropagation();
                  this._addHit(item);
                  this.props.navigation.navigate('Details', {item});
                }
            }
            onPressUp = {
                (event) => {
                    item.upLoading = true;
                    event.stopPropagation();
                    this._onPressUp(item);
                }
            }
            onPressDown = {
                (event) => {
                    event.stopPropagation();
                    this._onPressDown(item);
                }
            }
        />
    ); 
    
    _onRefresh = () => { 
        this.setState({ refreshing: true });
        this._getList();
        console.log("refresh")
    }
    _onEndReached = () => {
        console.log("end")
    }
    render(){
        return (
            <Container style={style.container}>
                <NavigationEvents
                    onWillFocus={payload => {
                        //console.log("will focus", payload);
                        //this._onRefresh();
                        if(this.props.navigation.getParam("refresh") === true){
                            this._onRefresh();
                        }
                        this._getFollow();
                    }}
                />
                <Header> 
                    <Left><Icon name='ios-camera' style={{ paddingLeft:10 }}/></Left>
                    <Body><Text>안전환경 파파리치</Text></Body>
                    <Right><Icon name='ios-refresh' style={{ paddingRight:10 }} onPress={this._onRefresh} /></Right>
                </Header>
                    <View style={{ height: 100 }}>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 7 }}>
                            <Text style={{ fontWeight: 'bold' }}>친구</Text>
                            <View style={{flexDirection:'row','alignItems':'center'}}>
                                <Icon name="md-play" style={{fontSize:14}}></Icon>
                                <Text style={{fontWeight:'bold'}}> 모두 보기</Text>
                            </View>  
                        </View>
                        <View style={{ flex: 3 }}>
                            <ScrollView 
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{
                                alignItems: 'center',
                                paddingStart: 5,
                                paddingEnd: 5
                            }}>
                            {
                                this.state.followings.map((following, index) => 
                                    <View key={index} style={{flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                                        <Thumbnail 
                                            style={{ marginHorizontal: 5, borderColor: 'pink', borderWidth: 2 }}
                                            source={{uri: SERVER_URL+'/'+(following.userPic ? following.userPic : 'user.jpg') }} />
                                        <Text style={{fontSize:12}}>{following.displayName}</Text>
                                    </View>)
                            }
                            </ScrollView> 
                        </View> 
                    </View>
                    <FlatList
                        data={this.state.feeds}
                        //extraData={this.state}
                        keyExtractor={this._keyExtractor}
                        initialNumToRender={10} 
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                        renderItem={this._renderItem}
                        onEndReachedThreshold={1}
                        onEndReached={this._onEndReached}
                    />
            </Container>
        );
    }
}

const mapStateToProps = (state) => {
    const { userid } = state.info;
    return {
      userid,
    }
};

export default connect(
    mapStateToProps,
    // mapDispatchToProps
  )(HomeTab);

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight
    }
});


 