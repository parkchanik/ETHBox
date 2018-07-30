import React, { Component } from 'react'
import { Jumbotron } from 'react-bootstrap'

class Footer extends Component {
    constructor(props) {
      super(props)
  
      this.state = {
      
      }

    }

    componentWillMount() {
        console.log('componentWillMount MainApp');

    }

    componentDidMount(){
        console.log('componentDidMount MainApp');
      
    }
    
    render() {

        
        var styles={
            "background-color": "#f4511e" ,
            textAlign: "center"
        }

        return (
          
                    
             <Jumbotron style={styles}>
         
            <div class="jumbotron text-center">
            <p>Footer</p>
            </div>
            </Jumbotron>
                

        );

    }
}


export default Footer
