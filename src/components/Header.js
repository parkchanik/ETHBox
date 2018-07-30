import React, { Component } from 'react'
import { Jumbotron , Container} from 'react-bootstrap'

//import '../css/Header.css'

class Header extends Component {
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
        /*
        var styles={
            "background-color": "#f4511e" ,
            textAlign: "center"
        }
        */
        return (
          <div>

             <Jumbotron /* style={styles}*/>
                <div >
                <p>Resize this responsive page to see the effect!</p> 
                </div>
           
             </Jumbotron>
            
            
          </div>
         
       
            

        );

    }
}


export default Header