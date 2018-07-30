const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var BoxDatabase = require('../database/Boxdatabase');
//var pool = BoxDatabase.getDatabasePool();

//var eventfunction = require('./EventListen.js');

/*/
var mysql = require('mysql');

var pool = mysql.createPool({
  host    :'localhost',
  port : 3306,
  user : 'dbchanik',
  password : '1q2w3e$r',
  database:'aboxdb',
  connectionLimit:20,
  waitForConnections:false
});
*/

app.get('/', (req, res) => {
  
    res.json({result:'success'});
 });

app.get('/test', (req, res) => {

    var msg = {
        from : {
            name : "SYSTEM"
        },
        msg : "message"
    };
    
    io.emit('chat', msg );
    res.send(msg);
});

io.on('connection' , function(socket) {
    // 접속한 클라이언트의 정보가 수신되면
    socket.on('login', function(data) {
        console.log('Client logged-in:\n name:' + data.name + '\n userid: ' + data.userid);

        // socket에 클라이언트 정보를 저장한다
        socket.name = data.name;
        socket.userid = data.userid;

        // 접속된 모든 클라이언트에게 메시지를 전송한다
        io.emit('login', data.name );
    });

    socket.on('eventcall', function(data) {
        io.emit('event', data);
        console.log(data);
    });

    socket.on('SEND_MESSAGE', function(data){
        io.emit('RECEIVE_MESSAGE', data);
        console.log(data);
    })

  // 클라이언트로부터의 메시지가 수신되면
    socket.on('chat', function(data) {
    console.log('Message from %s: %s', socket.name, data.msg);

    var msg = {
      from: {
        name: socket.name,
        userid: socket.userid
      },
      msg: data.msg
    };

    // 메시지를 전송한 클라이언트를 제외한 모든 클라이언트에게 메시지를 전송한다
    socket.broadcast.emit('chat', msg);

    // 메시지를 전송한 클라이언트에게만 메시지를 전송한다
    // socket.emit('s2c chat', msg);

    // 접속된 모든 클라이언트에게 메시지를 전송한다
    // io.emit('s2c chat', msg);

    // 특정 클라이언트에게만 메시지를 전송한다
    // io.to(id).emit('s2c chat', data);
    });

    // force client disconnect from server
    socket.on('forceDisconnect', function() {
        socket.disconnect();
    });

    socket.on('disconnect', function() {
        console.log('user disconnected: ' + socket.name);
    });
});

/*
function intervalCallSendABoxStatus() {

    pool.getConnection(function(err,connection){
            
        //var stmt = 'CALL SP_SEND_BOX(1,"aaaaa","message",0.1,100); ';
        var stmt = 'CALL SP_SEND_BOX_CAN_TAKE_CHECK; ';
        var query = connection.query(stmt, function (err, rows) {

            if(err){

                connection.release();

                throw err;

            }

            connection.release();

                            });

    });
    console.log('Cant stop me now!');
    
    //io.emit('chat', msg );

  }
  */
//setInterval(intervalCallSendABoxStatus, 6000);

app.get('/sendaboxranking', (req, res) => {
      
    var stmt = 'CALL SP_SEND_BOX_RANKING(1); ';
    BoxDatabase.CallProcedureResult(stmt , function(err , jsondata) {
      
        var result =  JSON.stringify(jsondata[0]);
             
        res.header('Content-type','application/json');
        res.header('Charset','utf8');
        res.header("Access-Control-Allow-Origin" , "*")
        //res.jsonp(req.query.callback + '('+ JSON.stringify(rows) + ');');
        res.json(result);
      

    });

});


app.get('/sendaboxlist', (req, res) => {
    console.log('jsondata');

    var stmt = 'CALL SP_SEND_BOX_LIST(1); ';

    BoxDatabase.CallProcedureResult(stmt , function(err , jsondata) {
      
        var result =  JSON.stringify(jsondata[0]);

        res.header('Content-type','application/json');
        res.header('Charset','utf8');
        res.header("Access-Control-Allow-Origin" , "*")
        //res.jsonp(req.query.callback + '('+ JSON.stringify(rows) + ');');
        res.json(result);
    

    });
  
});



app.post('/takebox', (req, res) => {

    var boxidx = req.body.boxidx;
    var takeaddress = req.body.takeaddress;

    var stmt = 'CALL SP_SEND_BOX_CAN_TAKE_SENDBOX(' + boxidx + " , '" + takeaddress + "' , @o_return); SELECT @o_return as o_return;";
    
    BoxDatabase.CallProcedureResult(stmt, function(err , jsondata) {

        //console.log(err);
        //console.log(jsondata); 
                
        var result =  JSON.stringify(jsondata[1]);
        res.header('Content-type','application/json');
        res.header('Charset','utf8');
        res.header("Access-Control-Allow-Origin" , "*")
        //res.jsonp(req.query.callback + '('+ JSON.stringify(rows) + ');');
        console.log(result);
        res.json(result);
  
    });

  
});



server.listen(3030, () => {
  console.log('Example app listening on port 3030!');
});





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
  var contractAddress = "0x9e51806f5D074Cff7dCea42997860D1176dEF99B"
  
  
  var Web3 = require('web3');

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
  
  //OptionsContract = initContract(optionsABI, contractAddress)
  initContract(optionsABI, contractAddress)
  
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

