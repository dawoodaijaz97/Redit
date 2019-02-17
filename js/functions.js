exports.db = function ()
{
    var mysql = require('mysql');

    var con = mysql.createConnection({
        host: "localhost",
        user: "carnac",
        password: "carnac",
        database: "carnac"        
    });

    return con;
}

