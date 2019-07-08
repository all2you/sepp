import React, {Component} from 'react';
import { View, StyleSheet, StatusBar,Platform,Image,ScrollView } from 'react-native';
import { Card, CardItem, Thumbnail, Body, Left, Right, Button, Icon, Container, Content, Header, Title, Text } from 'native-base';
import styled from 'styled-components';

export default class DetailScreen extends Component {
    constructor(props) {
        super(props);
    } 
    
    render(){
        const { item }= this.props.navigation.state.params;
        return (
            <Container style={styles.container}>    
                <Header
                    style={{backgroundColor:'#ffffff'}}
                    iosBarStyle="light-content"
                    androidStatusBarColor="ffffff">
                <StatusBar 
                    backgroundColor="#ffffff" 
                    barStyle="dark-content"/>
                    <Left>
                        <Button transparent
                            onPress={() => this.props.navigation.goBack()}>
                            <Icon name="arrow-back" style={{ color: "black" }}/>
                        </Button>
                    </Left>
                    <Body>
                        <Title style={{ color: "#000000" }}>상세보기</Title>
                    </Body>
                    <Right />
                </Header>
                <Content>
                <Card>
                    <CardItem>
                        <Text style={{ fontWeight:'900'}}>{ item.subject }</Text>
                    </CardItem>
                    <CardItem>
                        <Left> 
                            <Thumbnail source={{ uri: 'http://182.219.172.224:3333/'+item.media[0] }} />
                            <Body>
                                <Text>{item.author_name}</Text>
                                <Text note>{item.createdAt}</Text>
                            </Body>
                        </Left>
                        <Right>
                        </Right>
                    </CardItem>
                    <CardItem style={{ height:45 }}>  
                        <Left>
                            <Button transparent>
                                <Icon name='thumbs-up' style={{ color:'blue', marginRight: 5 }}/> 
                                <Text>{ item.up }</Text>
                            </Button>
                            <Button transparent>
                                <Icon name='thumbs-down' style={{ color:'red', marginRight: 5 }}/>
                                <Text>{ item.down }</Text>
                            </Button>
                        </Left>
                        <Right>
                            <Button transparent>
                                <Icon name='ios-eye' style={{ color:'#595959', marginRight: 5 }}/>
                                <Text>{ parseInt(item.hits)+1 }</Text>
                            </Button>
                        </Right>
                    </CardItem>
                    <CardItem>
                    { 
                    item.content ?
                    <Text>{ item.content}</Text>
                    : null
                    }
                    </CardItem> 
                    { item.address && item.address != "" ?
                    <CardItem>
                        <Button iconLeft transparent style={{}}>
                            <Icon name='ios-pin' />
                            <Text style={{marginLeft:10}}>{item.address}</Text>
                        </Button>
                    </CardItem> : null
                    } 
                    {
                    item.media && item.media.length ? 
                    <CardItem cardBody>
                        <ScrollView 
                                horizontal={false}
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{
                                alignItems: 'center',
                                    paddingStart: 0,
                                    paddingEnd: 0
                                }}
                        >
                                { 
                                item.media.map((item, index) => {
                                    return <Image 
                                        key={index}
                                        source={{ uri: 'http://182.219.172.224:3333/'+item }} 
                                        style={{ height:300, width:'100%', flex: 1, marginVertical:10}} />   
                                })
                                }
                        </ScrollView> 
                    </CardItem>
                    : null
                    } 
                </Card>
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
});
