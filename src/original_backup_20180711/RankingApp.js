import React, { Component } from 'react'
import axios from 'axios';

//import { Navbar, Jumbotron, Button } from 'react-bootstrap';

//import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

class RankingApp extends Component {
    constructor(props) {
      super(props)
  
      this.state = {
        rankdata : []       
      }

    }

    /*
    componentWillMount() {
        console.log('componentWillMount RankingApp');
       
    }
    */
    componentDidMount(){
        console.log('componentDidMount RankingApp');
            
        this.getRankingData();
        console.log('ababababa');
        
        //setTimeout(this.getRankingData , 1000 * 5);
        //console.log(this.state.rankdata);

    }

    getRankingData() {
        console.log('getRankingData');
            //let getrank = () => {
                axios.get('http://localhost:3030/sendaboxranking')
                .then (response => {
                    console.log(response.data);
                    console.log('------end response.data');
                    //const posts = response.data.map(obj => obj.data);
                    //const data = response.data;  
                    const vals = response.data;
                    this.setState( {rankdata : JSON.parse(vals)});
                    console.log(this.state.rankdata); 
                    
                })
                .catch(function (e) {
                    console.log(e);
                });

                
               // setTimeout(getRankingData() , 10000 * 5);
            //}
                  //fetch('http://localhost:3030/sendaboxranking')
                /*
                .then(response => response.json())
                .then(data => {
                    console.log('aaaaa');
                    console.log(data);
                    console.log('bbbbb');
                    this.setState({rankdata : JSON.parse(data)});
                    console.log(this.state.rankdata);
                    
                    
                    this.state.rankdata.map((contact, i) => {

                        console.log(contact.rank);
                        console.log(contact.sender_address);
                    });
                    
                })
                */
           


    }


    /*
    componentDidMount(){
        console.log('componentDidMount');
        fetch('http://localhost:3030/sendaboxranking',{
            method: 'get',
            dataType: 'json',
            mode: 'no-cors',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin' : '*'
            }
        })
        .then((response) => { console.log(response.json()) })
        .then((responseData) => {
            console.log(responseData);
            //this.setState({mans: responseData});
        })
        .catch((error)=>{
            console.log(error);
            console.log('Error fetching man',error);
        });
    }
    */

    /*
   columns () {
    return [
    	{key: 'rank', label: 'Rank'},
        {key: 'sender_address', label: 'sender_address'},
        {key: 'last_boxmsg', label: 'last_boxmsg', cell: (obj, key) => {
            return <span>{ obj[key] }</span>;
        }}
    ];
  }
*/

    render() {
        return (
            <ul>
                {this.state.rankdata.map(function(item , index) {
                return (
                   
                    <div>
                    <h1> { item.rank } </h1>
                    <h1> { item.sender_address } </h1>
                    <h1> { item.last_boxmsg } </h1>
                    <h3> { index } </h3>
                    </div>
                    )
            })
            
        }
          </ul>
            

        );

    }
}
export default RankingApp