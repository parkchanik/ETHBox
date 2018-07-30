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


