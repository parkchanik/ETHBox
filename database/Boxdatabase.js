var mysql = require('mysql');

var pool = mysql.createPool({
    host    :'localhost',
    port : 3306,
    user : 'dbchanik',
    password : '1q2w3e$r',
    database:'aboxdb',
    connectionLimit:20,
    waitForConnections:false , 
    multipleStatements: true //여러 명령문을 쿼리로 실행 할경우 이 내용이 필요다하 CALL 프로시저 ; SELECT @A
  });

  
  
module.exports.CallProcedureResult = function(stmt, result )
{    
    pool.getConnection(function(err,connection){
          
        try {
              
            var query = connection.query(stmt, function (err, rows) {

                    if(err){

                        connection.release();

                        //throw err;
                        return result(err , result);

                    }

                    connection.release();

                    return result(err , rows);
                    
                });
            }
            catch(e)
            {
                console.log(e);
                return result(e);
            }

    });
    
}


module.exports.CallProcedureWithParamResult = function(stmt, params ,  result )
{    
    pool.getConnection(function(err,connection){
          
        try {
              
            var query = connection.query(stmt, params , function (err, rows) {

                    if(err){

                        connection.release();

                        //throw err;
                        return result(err , result);

                    }

                    connection.release();

                    return result(err , rows);
                    
                });
            }
            catch(e)
            {
                console.log(e);
                return result(e);
            }

    });
    
}


/*
module.exports.spsendboxlist = function(req,res, result )
{
    
    pool.getConnection(function(err,connection){
          
        try {
            console.log('spsendboxlist');
            var stmt = 'CALL SP_SEND_BOX_LIST(1); ';
            var query = connection.query(stmt, function (err, rows) {

                    if(err){

                        connection.release();

                        //throw err;
                        return result(err , result);

                    }

                    connection.release();

                    console.log('spsendboxlist-------1');
            
                    err = 'aaaaa';
                    return result(err , JSON.stringify(rows[0]));
                    
                });
            }
            catch(e)
            {
                console.log(e);
                return result(e);
            }

    });
    
}



module.exports.spsendboxranking = function(req,res, result )
{
    
    pool.getConnection(function(err,connection){
          
        try {
            console.log('spsendboxranking');
            var stmt = 'CALL SP_SEND_BOX_RANKING(1); ';
            var query = connection.query(stmt, function (err, rows) {

                    if(err){

                        connection.release();

                        //throw err;
                        return result(err , result);

                    }

                    connection.release();

                    console.log('spsendboxranking-------1');
           
                    return result(err , JSON.stringify(rows[0]));
                    
                });
            }
            catch(e)
            {
                console.log(e);
                return result(e);
            }

    });
    
}


module.exports.spsendboxtake = function(req,res, result )
{
    var boxidx = req.body.boxidx;
    var takeaddress = req.body.takeaddress;

    pool.getConnection(function(err,connection){
          
        try {
            console.log('spsendboxtake');
            var stmt = 'CALL SP_SEND_BOX_CAN_TAKE_SENDBOX(' + boxidx + " , '" + takeaddress + "' , @o_return); SELECT @o_return as o_return;";
            console.log(stmt);
            var query = connection.query(stmt, function (err, rows) {

                    if(err){

                        connection.release();

                        //throw err;
                        return result(err , result);

                    }

                    connection.release();

                    console.log('spsendboxtake-------1');
   
                    
                    return result(err , JSON.stringify(rows[1]));
                    
                });
            }
            catch(e)
            {
                console.log(e);
                return result(e);
            }

    });
    
}

*/



/*
module.exports.getDatabasePool = function()
{
    var pool = mysql.createPool({
        host    :'localhost',
        port : 3306,
        user : 'dbchanik',
        password : '1q2w3e$r',
        database:'aboxdb',
        connectionLimit:20,
        waitForConnections:false , 
        multipleStatements: true //여러 명령문을 쿼리로 실행 할경우 이 내용이 필요다하 CALL 프로시저 ; SELECT @A
      });
    
      return pool;
}

*/