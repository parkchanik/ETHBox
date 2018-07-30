import React, { Component } from 'react'
import { Jumbotron , Grid , Row , Col } from 'react-bootstrap'


import SimpleStorageContract from '../build/contracts/SimpleStorage.json'

import angeltoken_artifacts from '../build/contracts/AngelToken.json'
import sendabox_artifacts from '../build/contracts/SendABox.json'
var AngelToken;
var SendABox;
import getWeb3 from './utils/getWeb3'

import Header from './components/Header'
import Fotter from './components/Footer'
import CurrentNetworkInfo from './components/CurrentNetworkInfo'
import Ranking from './components/Ranking'
import ChatApp from './components/ChatApp'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'
import Footer from './components/Footer';

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      storageValue: 0,
      web3: null,
      BoxMessageValue: '',
      BoxETHValue: 0 ,
      account : '' ,
      currentnetwork : ''
    }

    
    //함수를 바인드 해줘야 this 를 쓸수있다?
    this.onSendABox = this.onSendABox.bind(this);
    this.BoxMessageInput = this.BoxMessageInput.bind(this);
    this.BoxETHInput = this.BoxETHInput.bind(this);
    this.instantiateContract = this.instantiateContract.bind(this);
    this.setNetworkInfo = this.setNetworkInfo.bind(this);
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.
    console.log('App.js componentWillMount');
    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })


      this.setNetworkInfo();
      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  componentDidMount()  {
     
  }
  
  setNetworkInfo() {
    console.log('setNetworkInfo');

    var network = this.state.web3.version.network;
    console.log(network);
    switch (network) {
      case '1':
        //console.log('This is mainnet');
        this.setState({currentnetwork : "Main Network"});
        break;
      case '2':
        //console.log('This is the deprecated Morden test network.');
        this.setState({currentnetwork : "Test Network"});
        break;
      case '3':
        //console.log('This is the ropsten test network.');
        this.setState({currentnetwork : "Ropsten Test Network"});
        break;
      case '4':
        //console.log('This is the ropsten test network.');
        this.setState({currentnetwork : "Rinkeby Test Network"});
        break;
      default:
        //console.log('This is an unknown network.');
        this.setState({currentnetwork : "Unknown Network"});
      } 
   

    this.state.web3.eth.getAccounts((error, accounts) => {
        
      if(!error) {
        this.setState({account: accounts[0]});
        console.log(accounts[0]);

      }
      else {
          console.log(error);
      }
    });
    

  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */
     
    console.log('App.js instantiateContract');
    const contract = require('truffle-contract')
    const simpleStorage = contract(SimpleStorageContract)
    simpleStorage.setProvider(this.state.web3.currentProvider)
    
    AngelToken = contract(angeltoken_artifacts);
    SendABox = contract(sendabox_artifacts);
    AngelToken.setProvider(this.state.web3.currentProvider);
    SendABox.setProvider(this.state.web3.currentProvider);

    //console.log(this.state.web3.currentProvider);
    //console.log(this.state.web3.eth.net);
    
    /*

    this.state.web3.version.getNetwork.then((error,  netId ) => {
      switch (netId) {
        case 1:
          console.log('This is mainnet')
          break
        case 2:
          console.log('This is the deprecated Morden test network.')
          break
        case 3:
          console.log('This is the ropsten test network.')
          break
        default:
          console.log('This is an unknown network.')
       } 
    });
*/
    //this.state.web3.eth.net.getNetworkType().then(console.log);
    
    var token;
    this.state.web3.eth.getAccounts((error, accounts) => {

        if(!error) {
         
          AngelToken.deployed().then(function(instance) {
            token = instance;
            //return token.getBalance.call(account, {from: account});
            
            console.log("instantiateContract");
            //this.setState({account: accounts[0]});
            return token.balanceOf(accounts[0]);
          }).then((value) => {
            //var balance_element = document.getElementById("balance");
            //balance_element.innerHTML = value.valueOf();
            console.log(value.valueOf());
            
            return  this.setState({ storageValue: value.valueOf() });
          }).catch(function(e) {
            console.log("instantiateContract catch error");
            console.log(e);
            //self.setStatus("Error getting balance; see log.");
          });
        }
        else
        {
          console.log(error);
        }
        
    });

    //return this.setState({ storageValue: 111 })
    // Declaring this for later so we can chain functions on SimpleStorage.
    /*
    var simpleStorageInstance

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      simpleStorage.deployed().then((instance) => {
        simpleStorageInstance = instance

        // Stores a given value, 5 by default.
        return simpleStorageInstance.set(5, {from: accounts[0]})
      }).then((result) => {
        // Get the value from the contract to prove it worked.
        return simpleStorageInstance.get.call(accounts[0])
      }).then((result) => {
        // Update state with the result.
        return this.setState({ storageValue: result.c[0] })
      })
    })
    */
  }
  onSendABox () {
  
    var boxeth = parseFloat(this.state.BoxETHValue);
    var boxmessage = this.state.BoxMessageValue;

    console.log(boxeth);
    console.log(boxmessage);

    var sendabox;
    this.state.web3.eth.getAccounts((error, accounts) => {
        SendABox.deployed().then((instance) => {
          sendabox = instance;
          //return sendabox.giveABoxForMessage.sendTransaction(boxmessage, {from:accounts[0] , value:this.state.web3.toWei(boxeth , "ether") , gas: 2100000});
          return sendabox.Contract_SendABox.sendTransaction(boxmessage , {from:accounts[0] , value:this.state.web3.toWei(boxeth , "ether") , gas: 2100000});

          
        }).then((result) => {
          alert('success');
          //self.setStatus("Transaction complete!");
          //self.refreshBalance();
        }).catch((e) => {
          console.log(e);
          //alert('fail');
          //self.setStatus("Error sending box; see log.");
          //self.setStatus(e);
        });
    });

  }

  BoxMessageInput(event) {
   // console.log(event.target.value);
    this.setState ({
      BoxMessageValue: event.target.value
    });
  }

  BoxETHInput(event) {
    //console.log(event.target.value);
    this.setState ({
      BoxETHValue: event.target.value
    });
  }

  render() {
    return (
      <div id="container">
      <Header/>
      <CurrentNetworkInfo address={this.state.account}
                          currentnetwork={this.state.currentnetwork} />
      <Grid style={{
          fontSize: ".9em",
          padding: "0px",
          paddingBottom: "100px",
          background: "#f7f7f7",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}>
        <Row className="show-grid"> 
            <Col lg={8}>
                  <div style={{
                    float:left,
                    position:fixed,
                    left:0,
                    top:"70px",
                    width:"30%",
                   // box-sizing:border-box,
                    background:"#eee",
                    //border-right:"1px solid #ddd",
                    //border-bottom:"1px solid #ddd",
                    //border-top:"1px solid #ddd"
                  }}> 
            <Grid>
              <Row>
                <Col> <h4>Send</h4>
                  <strong>Balance</strong>: <span id="TTBalance"></span> {this.state.storageValue} TT<br/><br/>
                  <input type="text" value={this.state.BoxMessageValue} onChange={this.BoxMessageInput} placeholder="BoxMessage"/>
                  <input type="text" value={this.state.BoxETHValue} onChange={this.BoxETHInput} id="SendABoxETH" placeholder="BoxETH" />
                  
                  <button id="SendABoxButton" onClick={this.onSendABox}>SendBox</button>
                </Col>
              </Row>
              <Row>
                <Col>
                <ChatApp/>
                </Col>
              </Row>
            </Grid>
            </div>
            </Col>
            <Col lg={4}>
                  <div style={{
                    padding: "1px",
                    background: "#ffffff",
                   // boxShadow: "16px 16px 47px 2px rgba(0,0,0,.07)",
                    fontFamily: "Arial, Helvetica, sans-serif",
                  }}> <Ranking />
                  </div>
                  </Col>

        </Row>
      </Grid>
    
      <Footer/>
      </div>
     
    );
  }
}

export default App
