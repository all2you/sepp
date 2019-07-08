import React, { Component } from 'react';
import { View, Image, Text, StyleSheet,ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Card, CardItem, Thumbnail, Body, Left, Right, Button, Icon, Spinner} from 'native-base';
import { Video } from 'expo-av';
import { SERVER_URL } from './Config';
const { width, height } = Dimensions.get('window');

export default class CardCompnent extends Component{
    constructor(props) {
      super(props);
    }

    render() {
        const { data, onPress, onPressUp, onPressDown} = this.props; // 피드 항목 데이터
    return (
        <Card> 
            <CardItem>
              <Left>  
                {
                  data.author_img && data.author_img != '' ?
                  <Thumbnail source={{ uri: SERVER_URL+'/'+data.author_img}} />
                  : 
                  <Thumbnail source={{ uri: SERVER_URL+'/user.jpg' }} />
                }
                <Body>
                  <Text>{data.author_name}</Text>
                  <Text note>{data.createdAt}</Text>
                </Body>
              </Left>
            </CardItem>
            {
              data.media && data.media.length ? 
              <CardItem cardBody>
              <ScrollView 
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                      alignItems: 'center',
                      paddingStart: 0,
                      paddingEnd: 0
                    }}
              >
                    { 
                      data.media.map((item, index) => {
                        return <Image 
                            key={index}
                            source={{ uri: SERVER_URL+'/'+item }} 
                            style={{ height:200, width:width, flex: 1 }} />   
                      })
                    }
              </ScrollView> 
              </CardItem>
               : null
            } 
            { data.address && data.address != "" ?
            <CardItem>
              <Button iconLeft transparent style={{}}>
                  <Icon name='ios-pin' />
                  <Text style={{marginLeft:10}}>{data.address}</Text>
              </Button>
              </CardItem> : null
            } 
            <TouchableOpacity onPress={ onPress }>
            <CardItem>
              <Text style={{ fontWeight:'900'}}>{ data.subject }</Text>
            </CardItem>
            <CardItem>
              { 
               data.content ?
               
              <Text>{ data.content.replace(/\n/g,' ').slice(0, 200) }</Text>
               : null
              }
            </CardItem> 
            <CardItem>
              { 
               data.tags && data.tags.length > 0 ?
                  data.tags.map((tag, index) => { 
                    return <Button key={index} transparent small style={{marginRight:10}}>
                              <Text>#{ tag }</Text>
                           </Button> 
                  })
                : null
              }
            </CardItem> 
            </TouchableOpacity>
            <CardItem style={{ height:45 }}>  
              <Left>
                <Button iconLeft info small style={{width:65, marginRight:10}} onPress={ onPressUp }>
                  <Icon name='thumbs-up' style={{color:'#ffffff'}}/> 
                  {data.upLoading ?
                    <Spinner size='small' color='#ffffff' style={{paddingRight:5}}/>
                  : <Text style={{color:'#ffffff', paddingRight:10}}>{ data.up }</Text>
                  }
                </Button> 
                <Button iconLeft danger small style={{width:65}} onPress={ onPressDown }>
                  <Icon name='thumbs-down' style={{color:'#ffffff'}}/>
                  {data.downLoading ?
                    <Spinner size='small' color='#ffffff' style={{paddingRight:5}}/>
                  : <Text style={{color:'#ffffff', paddingRight:10}}>{ data.down }</Text>
                  }
                </Button>
              </Left>
              <Right>
                <Button transparent>
                  <Icon name='ios-eye' style={{ color:'#595959', marginRight: 5 }}/>
                  <Text>{ data.hits||0 }</Text>
                </Button>
              </Right> 
            </CardItem>
        </Card>
        );
    }
}
 
const style = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
});