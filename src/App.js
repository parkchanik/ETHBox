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
import SendBoxForm from './components/SendBoxFrom'
import NowBoxList from './components/NowBoxList'

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
    //this.BoxMessageInput = this.BoxMessageInput.bind(this);
    //this.BoxETHInput = this.BoxETHInput.bind(this);
    this.instantiateContract = this.instantiateContract.bind(this);
    this.setNetworkInfo = this.setNetworkInfo.bind(this);

    this.onTakeABox = this.onTakeABox.bind(this);
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
    
    
    var sendabox;
    this.state.web3.eth.getAccounts((error, accounts) => {

        if(!error) {

          SendABox.deployed().then((instance) => {
            sendabox = instance;
            return sendabox.balanceOf(accounts[0]);
                  
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

  }
 
  onSendABox ({BoxETHValue , BoxMessageValue}) {
    console.log("onSendABox");
    console.log(BoxETHValue);
    console.log(BoxMessageValue);
    
    var boxeth = parseFloat(BoxETHValue);
    var boxmessage = BoxMessageValue;

    //var boxeth = parseFloat(this.state.BoxETHValue);
    //var boxmessage = this.state.BoxMessageValue;

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

  onTakeABox({boxidx}) {

    console.log('app' + boxidx);
  }

  render() {

    var style1 = {"margin-top":"30px"}


    return (
      <div>
      
      <Header/>
      <CurrentNetworkInfo address={this.state.account}
                          currentnetwork={this.state.currentnetwork} />
      
      <Grid style={{
          fontSize: ".9em",
          padding: "20px",
          paddingBottom: "100px",
          background: "#ffffff",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}>
        <Row >
          <Col lg={6}>
          <SendBoxForm onSubmit={this.onSendABox}/>
          <br/><br/><br/><br/>
          <Ranking />
          </Col>
          <Col lg={6}>
          <NowBoxList  address={this.state.account}
                      currentnetwork={this.state.currentnetwork}/>
          
          </Col>
        </Row>
      </Grid>
      
      <Footer/>

      </div>
    
     
    );
  }
}

export default App
