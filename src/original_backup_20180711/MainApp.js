import React, { Component } from 'react'

import { Navbar, Jumbotron, Button } from 'react-bootstrap';
class MainApp extends Component {
    constructor(props) {
      super(props)
  
      this.state = {
        storageValue: 0,
        web3: null,
        BoxMessageValue: '',
        BoxETHValue: 0
      }

    }


    componentWillMount() {
        console.log('componentWillMount MainApp');

    }

    componentDidMount(){
        console.log('componentDidMount MainApp');
      
    }
    
    render() {
        return (
          
          <div class="text-center">
           <h1>Main</h1> 
            <p>Main Main Main Main Main Main </p> 
          </div>
         
       
            

        );

    }
}


export default MainApp