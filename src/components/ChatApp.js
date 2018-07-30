import React, { Component } from 'react'

import io from 'socket.io-client';
import MessageForm from './MessageForm'
import MessageList from './MessageList'
import '../css/ChatApp.css'

class ChatApp extends Component {
    constructor(props) {
      super(props)
  
      this.state = {
            username: '',
            messages: [
                { body: "Connecting..." },
                { author: "You", body: "Hello!", me: true },
                { author: "Them", body: "Hey there!"  },
              ]//,
            //messages: []
      }

   // this.addMessage = this.addMessage.bind(this);
   //this.sendMessage = this.sendMessage.bind(this);         

    }


    componentWillMount() {
        console.log('componentWillMount');

    }

    componentDidMount() {
        this.socket = io('localhost:3030');

        this.socket.on('RECEIVE_MESSAGE', this.addMessage);
    }

    /*
    addMessage(data)
     {
        console.log(data);
        this.setState({messages: [...this.state.messages, data]});
        console.log(this.state.messages);
    };

    sendMessage(ev)  {
        ev.preventDefault();
        this.socket.emit('SEND_MESSAGE', {
            author: this.state.username,
            message: this.state.message
        })
        this.setState({message: ''});

    }
*/
    handleNewMessage = (text) => {
        this.setState({
          messages: [...this.state.messages, { me: true, author: "Me", body: text }],
        })
        this.socket.emit('SEND_MESSAGE', {
            author: this.state.username,
            message: this.state.message
        })
        //this.setState({message: ''});
      }
 
      

    render() {
        return (
          
                <div >
                  <MessageList messages={this.state.messages} />
                 
                </div>
            
        );

        //<MessageForm onMessageSend={this.handleNewMessage} />
    }
}


export default ChatApp