require('dotenv').config();

//port
exports.port = function()
{
    return process.env.PORT;
}
//base url
exports.url = function ()
{
    ur = process.env.HOST + ":";
    return ur;
}
//database credentials
exports.db = function ()
{
    var mysql = require('mysql');

    var con = mysql.createConnection({
        host: process.env.mysql_dbhost,
        user: process.env.mysql_username,
        password: process.env.mysql_password,
        database: process.env.mysql_dbname        
    });

    return con;
}
