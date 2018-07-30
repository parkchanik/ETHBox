import React, { Component } from 'react'
import SimpleStorageContract from '../build/contracts/SimpleStorage.json'

import angeltoken_artifacts from '../build/contracts/AngelToken.json'
import sendabox_artifacts from '../build/contracts/SendABox.json'
var AngelToken;
var SendABox;
var accounts;
var account;
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class ManageApp extends Component {
  constructor(props) {
    super(props)

    this.state = {
     
      web3: null,
      BoxNum: 0 ,
      EthBalance: 0 ,
      takeaddress : '' ,
      takeboxnum : 0 ,
      takeboxwei : 0
      
    }

    //함수를 바인드 해줘야 this 를 쓸수있다?
    this.onGetBoxInfo = this.onGetBoxInfo.bind(this);
    this.BoxNumInput = this.BoxNumInput.bind(this);
    this.getNowBalance = this.getNowBalance.bind(this);

    this.BoxTakeAddressInput = this.BoxTakeAddressInput.bind(this);
    this.BoxTakeWeiInput = this.BoxTakeWeiInput.bind(this);
    this.BoxTakeNumInput = this.BoxTakeNumInput.bind(this);

    this.onTakeBox = this.onTakeBox.bind(this);
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract()
      //this.getNowBalance();
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const contract = require('truffle-contract')
   
    AngelToken = contract(angeltoken_artifacts);
    SendABox = contract(sendabox_artifacts);
    AngelToken.setProvider(this.state.web3.currentProvider);
    SendABox.setProvider(this.state.web3.currentProvider);
    
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

  getNowBalance() {
    
    console.log('getNowBalance');
    var eth;
    this.state.web3.eth.getAccounts((error, accounts) => {
      console.log(accounts);
      this.state.web3.eth.getBalance(accounts[0] , function (error, result) {
        if(!error) {
          eth = result.valueOf();
          console.log(accounts + ':'  + result);
          }
        });
    });

    console.log('eth : ' + eth);
    return this.setState({ EthBalance: eth} );
      /*
        this.state.web3.eth.getBalance(accounts[0] , function (error, result) {
          console.log('this.state.web3.eth.getBalance');
          if (error) {
            console.log(error);
          }
          else {
            console.log(result);
          }
              
        });

      });
    */
      console.log('end getNowBalance');
     
  }

  onGetBoxInfo () {
  
    var boxnum = parseInt(this.state.BoxNum);
    
    console.log(boxnum);
  

    var sendabox;
    this.state.web3.eth.getAccounts((error, accounts) => {
        SendABox.deployed().then((instance) => {
          sendabox = instance;
          return sendabox.getABoxInfo(boxnum);

        }).then((result) => {
          //alert('success');
          console.log(result);
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

  onTakeBox() {

    var sendabox;
    this.state.web3.eth.getAccounts((error, accounts) => {
        SendABox.deployed().then((instance) => {
            sendabox = instance;

            return sendabox.takeBox(this.state.takeaddress , this.state.takeboxnum , this.state.takeboxwei);
        }).then((result) => {
          console.log('success');
          console.log(result);
          console.log('success2');
          }).catch((e) => {
            console.log('error');
            console.log(e);
        });
      });       
  //takeBox(address _getaddress , uint256 _boxid , uint256 _wei) 

  }


 

  BoxNumInput(event) {
    //console.log(event.target.value);
    this.setState ({
      BoxNum: event.target.value
    });
  }

  BoxTakeAddressInput(event) {
    console.log(event.target.value);
    this.setState ({
      takeaddress: event.target.value
    });
  }
  
  BoxTakeNumInput(event) {
    //console.log(event.target.value);
    this.setState ({
      takeboxnum: event.target.value
    });
  }
  BoxTakeWeiInput(event) {
    //console.log(event.target.value);
    this.setState ({
      takeboxwei: event.target.value
    });
  }
  render() {
    return (
      <div className="App">
        <h4>Manage</h4>
              <strong>now balance : </strong><span id="accountbalacne">{this.state.EthBalance}</span> 
              <button id="GetBalanceButton" onClick={this.getNowBalance}>GetBalance</button>
              <br/>
              <input type="text" value={this.state.BoxNum} onChange={this.BoxNumInput} id="SendABoxETH" placeholder="BoxNum" />
              <button id="SendABoxButton" onClick={this.onGetBoxInfo}>GetInfo</button>
               
              <br/>
              <input type="text" value={this.state.takeaddress} onChange={this.BoxTakeAddressInput} id="takeaddress" placeholder="takeaddress" />
              <input type="text" value={this.state.takeboxnum} onChange={this.BoxTakeNumInput} id="takeboxnum" placeholder="takeboxnum" />
              <input type="text" value={this.state.takeboxwei} onChange={this.BoxTakeWeiInput} id="takeboxwei" placeholder="takeboxwei" />
              <button id="TakeABoxButton" onClick={this.onTakeBox}>TakeBox</button>
              
         
      </div>
     
    );
  }
}

export default ManageApp
