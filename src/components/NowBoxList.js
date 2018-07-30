import React, { Component } from 'react'
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
//import { Navbar, Jumbotron, Button } from 'react-bootstrap';

//import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
  const styles = theme => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    formControl: {
     
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing.unit * 2,
    },
    button: {
        margin: theme.spacing.unit,
      },
      leftIcon: {
        marginRight: theme.spacing.unit,
      },
      rightIcon: {
        marginLeft: theme.spacing.unit,
      },
      iconSmall: {
        fontSize: 20,
      },
  });

class NowBoxList extends Component {
    constructor(props) {
      super(props)
  
      this.state = {
        messagelistdata : []       
      }

      this.handleSubmit = this.handleSubmit.bind(this);
      this.takeBox = this.takeBox.bind(this);
    }

    
    componentWillMount() {
          
    }
    
    componentDidMount(){
    
        this.getSendBoxList();
    }

    
    getSendBoxList() {
        console.log('getRankingData');
            //let getrank = () => {
                axios.get('/sendaboxlist')
                .then (response => {
                    console.log(response.data);
                    console.log('------end response.data');
                    //const posts = response.data.map(obj => obj.data);
                    //const data = response.data;  
                    const vals = response.data;
                    this.setState( {messagelistdata : JSON.parse(vals)});
                    //console.log(this.state.rankdata); 
                    
                })
                .catch(function (e) {
                    console.log(e);
                });

    }


    takeBox(boxidx) {
        console.log(boxidx);
        /*
        var config = {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
        
            },
       };*/

     
        var body = {
       
                boxidx: boxidx  , 
                takeaddress: this.props.address  
        };

        let axiosConfig = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          "Access-Control-Allow-Origin": "*",
        }
        };
        console.log('takebox');
            //let getrank = () => {
                axios.post('/takebox' , body , axiosConfig)
                .then (response => {
                    console.log(response.data);
                    console.log('------end response.data');
                    //const posts = response.data.map(obj => obj.data);
                    //const data = response.data;  
                    //const vals = response.data;
                   // this.setState( {rankdata : JSON.parse(vals)});
                    //console.log(this.state.rankdata); 
                    
                })
                .catch(function (e) {
                    console.log(e);
                });

            

    }

  
   handleSubmit(boxidx) {
    // e.preventDefault();
    console.log(boxidx);
  
    this.takeBox(boxidx);
            
 };
 
  
    render() {
      
 
        //const { classes } = this.props;
        // () => this.handleSubmit(this.boxmsg) = this.handleClick.bind(this.boxmsg, id)
        var messagelist = this.state.messagelistdata.map(item =>
               
                        <div>
                        SENDER : { item.sender_address } ETH IN BOX { item.send_wei } 
                        <h4> { item.boxmsg } </h4>
                        <Button variant="outlined" color="primary" onClick={() => this.handleSubmit(item.boxidx)} > 
                          Primary
                      </Button>
                            <br/><br/>
                            </div>
                          
                        
                      )
                            
               
        return (
            <div >
                <h4>GET ETHER WITH MESSAGE</h4>
                <hr style={{
                  borderColor:"red",
                  borderWidth:"2px",
                }}/>

                {messagelist}               
                    
            
            </div>
          

        );

    }
/*

    render() {
        return (
            <ul>
                {this.state.rankdata.map(function(item , index) {
                return (
                  
                    <div>
                    { item.boxidx } 
                   { item.boxmsg } 
                     { item.send_wei } 
                   { index } 
                    </div>
                    )
            })
            
        }
          </ul>
            

        );

    }
    */
}
export default withStyles(styles)(NowBoxList)