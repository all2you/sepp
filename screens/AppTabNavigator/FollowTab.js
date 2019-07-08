import React, { Component } from 'react';
import { View,Text,StyleSheet, ScrollView, Platform, StatusBar, FlatList,TouchableOpacity} from 'react-native';
import { ListItem } from 'react-native-elements';
import { NavigationEvents } from "react-navigation";
import { Container, Header, Item, Input, Left, Right, Body,Thumbnail,Icon, Button } from 'native-base';
import { connect } from 'react-redux';
import { SERVER_URL } from '../../components/Config';

class FollowTab extends Component{
    constructor(props) {
        super(props);
        this.state = {
            users : [],
            searchTxt:null,
            refreshing:false,
        };
    }

    _keyExtractor = (item, index) => index.toString();

    fetchUsers() {
        const userid = this.props.userid;
        return fetch(SERVER_URL+'/Users',{
                method:"POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({uid:userid, txt:this.state.searchTxt}),
            })
            .then(res => res.json())
            .then(res => res);
    } 

    _getUsers = () => {
        this.fetchUsers().then(users => {
            this.setState({
              users
            },function(){
                this.setState({ refreshing: false });
            });
        });
    }

    _onRefresh = () => {
        this._getUsers();
    };

    _addFollow = (item) => { 
        const { users } = this.state;
        const uid = this.props.userid;

        fetch(SERVER_URL+'/Follow', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({fid:item._id, uid:uid}),
        })
        .then(response => response.json())
        .then(response => {
            this._onRefresh();
        })  
        .catch(error => { 
            console.log(error);
        }); 
    };

    _delFollow = (item) => { 
        const { users } = this.state;
        const uid = this.props.userid;

        fetch(SERVER_URL+'/Follow', {
            method: "DELETE",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({fid:item._id, uid:uid}),
        })
        .then(response => response.json())
        .then(response => {
            this._onRefresh();
        })  
        .catch(error => { 
            console.log(error);
        }); 
    };

    _renderItem = ({ item }) => (
        <ListItem key={item._id}
            title={
                <TouchableOpacity onPress={(event) => {
                    event.stopPropagation();
                }}>
                <Text>{item.displayName}</Text>
                </TouchableOpacity>
            }
            subtitle={
                <TouchableOpacity onPress={(event) => {
                    event.stopPropagation();
                }}>
                <Text>{item.username}</Text>
                </TouchableOpacity>
            }
            leftAvatar={{ source: { uri: SERVER_URL+'/'+item.userPic } }}
            rightTitle={
                <View style={{flexDirection:'row'}}>
                {  item.follow === false ?
                <Button info small style={{width:110}} onPress={(event) => {
                    event.stopPropagation();
                    this._addFollow(item);
                }}>
                  <Icon name='ios-add' style={{ color:'#ffffff'}}
                  />
                  <Text style={{ color:'#ffffff', marginRight: 30 }}>친구추가</Text>
                </Button>
                :
                <Button danger small style={{width:110}} onPress={(event) => {
                    event.stopPropagation();
                    this._delFollow(item);
                }}>
                  <Icon name='ios-remove' style={{ color:'#ffffff'}}
                  />
                  <Text style={{ color:'#ffffff', marginRight: 30 }}>친구해제</Text>
                </Button> 
                }
                </View>
            }
        />
    );

    render(){
        return (
            <Container style={styles.container}>
                <NavigationEvents
                    onWillFocus={payload => {
                        this._getUsers();
                    }}
                />
                <Header> 
                    <Left></Left>
                    <Body><Text>친구 추가하기</Text></Body>
                    <Right><Icon name='ios-refresh' style={{ paddingRight:10 }} onPress={this._onRefresh} /></Right>
                </Header>
                <View searchBar>
                    <Item>
                        <Icon name="ios-people"  style={{marginLeft:10}}/>
                        <Input placeholder="Search" 
                            onChangeText={(searchTxt) => this.setState({searchTxt})}
                            onSubmitEditing={()=>{this._onRefresh()}}
                        />
                        <Icon name="ios-search" onPress={()=> {this._onRefresh()}} style={{marginRight:10}}/>
                    </Item>
                </View>
                <FlatList
                    keyExtractor={this._keyExtractor}
                    data={this.state.users}
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh}
                    renderItem={this._renderItem}
                />
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    }
})

const mapStateToProps = (state) => {
    const { userid } = state.info;
    return {
        userid,
    }
};

export default connect(
    mapStateToProps,
  )(FollowTab);