import React, { Component, createContext } from 'react';

const Context = createContext(); 

const { Provider, Consumer: InfoConsumer } = Context; 

class InfoProvider extends Component {
  state = {
    username: '', // 사용자 이름
    userid: '',
    dpname: '',
    userpic : '',
  }

  actions = {
    setUsername: (username) => {
      this.setState({ username });
    },
    setUserid: (userid) => {
        this.setState({ userid });
    },
    setDpname: (dpname) => {
       this.setState({ dpname });
    },
    setUserpic: (userpic) => {
       this.setState({ userpic });
    }
  }

  render() {
    const { state, actions } = this;
    const value = { state, actions };
    return (
      <Provider value={value}>
        {this.props.children}
      </Provider>
    )
  }
}

export {
  InfoProvider,
  InfoConsumer,
};