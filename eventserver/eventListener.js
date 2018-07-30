
var Web3 = require('web3');

var BoxDatabase = require('../database/Boxdatabase');

var optionsABI = [
  {
    "constant": true,
    "inputs": [],
    "name": "SZABO_PER_WEI",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "_box_idx",
        "type": "uint256"
      },
      {
        "indexed": true,
        "name": "_sender",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "_value",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "_token",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "_message",
        "type": "string"
      }
    ],
    "name": "ev_SendABoxEvent",
    "type": "event"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "message",
        "type": "string"
      }
    ],
    "name": "Contract_SendABox",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "nowBoxid",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
]
    var contractAddress = "0x9e51806f5d074cff7dcea42997860d1176def99b"
    
    
  
    //var BoxDatabase = require('../database/Boxdatabase');
  
    //var pool = BoxDatabase.getDatabasePool();
  
    
    // 왜 socket.io-client 안될까
    /*
    var io = require('socket.io-client');
    var socket = io("localhost:3030");
    
    socket.emit("login", {
      // name: "ungmo2",
      name: "TEST",
      userid: "ungmo2@gmail.com"
    });
    */
    // watch for changes
    
    if (typeof web3 !== 'undefined') {
      web3 = new Web3(web3.currentProvider);
    } else {
      // set the provider you want from Web3.providers
      web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
    }
    
    console.log("Eth Node Version: ", web3.version.node);
    //console.log("Network: " ,web3.version.network, web3.version.ethereum);
    console.log("Connected: ", web3.isConnected(), web3.currentProvider);
    console.log("syncing: ", web3.eth.syncing, ", Latest Block: ",web3.eth.blockNumber);
    console.log("Accounts[0]: " , web3.eth.accounts[0], ":",web3.eth.getBalance(web3.eth.accounts[0]).toNumber())
    
    OptionsContract = initContract(optionsABI, contractAddress)
    //initContract(optionsABI, contractAddress)
    
    //OptionsContract = GiveABoxFromDonatorContract(optionsABI, contractAddress)
    
    // 아래와 같은 방식으로 event 전체를 가져 올수 있다.
    function GiveABoxFromDonatorContract(contractAbi, contractAddress) {
      var MyContract = web3.eth.contract(contractAbi);
      var contractInstance = MyContract.at(contractAddress);
      var event = contractInstance.ev_SendABoxEvent({}, {fromBlock:0 , toBlock: 'latest'})
      console.log("listening for events on ", contractAddress)
      // watch for changes
      console.log('event get1111');
      event.get((error,eventResult) => {
  
        console.log('event get2222');
        if(error)
        console.log('error' + error);
        else
          console.log('event get3333');
          console.log(eventResult);
      });
      /*
      event.watch(function(error, result){ //This is where events can trigger changes in UI
        if (!error)
        {
          console.log(result);
          //console.log(result.args._box_idx);
          //console.log(result.args._sender);
          //console.log(result.args._message);
          //console.log(result.args._value);
          //console.log(result.args._token);
        }
      });*/
      return contractInstance
    }
    
    
    function initContract(contractAbi, contractAddress) {
      var MyContract = web3.eth.contract(contractAbi);
      var contractInstance = MyContract.at(contractAddress);
      var event = contractInstance.allEvents()
      console.log("listening for events on ", contractAddress)
    
      
      event.watch(function(error, result){ //This is where events can trigger changes in UI
  
        
        console.log('event watch 1111');
        if (!error)
        { 
          console.log('event watch 222');
  
          if(result.event == 'ev_SendABoxEvent')
          {
            console.log("box_idx : "  + result.args._box_idx.toNumber());
            console.log("_sender : "  + result.args._sender);
            console.log("_message : "  + result.args._message);
            console.log("wei : "  + web3.fromWei(result.args._value.toNumber(), "ether"));
            console.log("token : "  + result.args._token.toNumber());
            
            var params = [result.args._box_idx.toNumber() , result.args._sender 
                      ,  result.args._message , result.args._value.toNumber() ,result.args._token.toNumber()];
    
            var stmt = 'CALL SP_SEND_BOX(?,?,?,?,?); ';
            
            BoxDatabase.CallProcedureWithParamResult(stmt, params , function(err , jsondata) {
  
              //console.log(err);
              //console.log(jsondata); 
                      
                var result =  JSON.stringify(jsondata[1]);
             
                console.log(result);
                
              });
            /*
            pool.getConnection(function(err,connection){
              
              //var stmt = 'CALL SP_SEND_BOX(1,"aaaaa","message",0.1,100); ';
              var stmt = 'CALL SP_SEND_BOX(?,?,?,?,?); ';
              var query = connection.query(stmt, params ,  function (err, rows) {
      
                  if(err){
      
                      connection.release();
      
                      throw err;
      
                  }
      
                  console.log(rows);
                  connection.release();
      
              });
    
            });
             */
          }
          else if (result.event == 'ev_GetABox')
          {
            console.log(result);
            console.log(result.event);
            console.log(result.event);
    
          }
    
        }
      });
      return contractInstance
    }
  
  