require('dotenv').config();
const express = require('express');
const session = require('express-session');
const db = require('./db');
const app = express();
const bodyParser = require('body-parser');
const port = db.port();
const ur = db.url();
app.use(bodyParser.json());
app.use(session({
    secret: process.env.secret_key,
    resave: false,
    saveUninitialized: true
}));
app.post('/register', function(request, res){
  
            let sql;

            sql = "SELECT * from users where email = '" + request.body.email + "'";
            db.db().query(sql, function (err, result){
                if (err) throw err;
                if (result.length > 0)
                {
                    res.writeHead(403, {'Content-Type' : 'text/html'});
                    return res.send({code: 403, status: "Account already exists!"});
                }
                else
                {
                    sql = "INSERT INTO users VALUES (NULL,'"+ request.body.fname +"','"+ request.body.lname +"','"+ request.body.email +"','"+ request.body.password +"','"+ request.body.dob +"',"+ request.body.gender +", CURRENT_TIMESTAMP)";
                    res.writeHead(200, {'Content-Type' : 'text/html'});
                    db.db().query(sql, function(er){
                        if (er) throw er;
                        return res.send({code: 200, status: "Account created successfully!"});
                    }); 
                }
            });
        });
app.post('/login', function(request, res){

    let sql = "SELECT * FROM users WHERE email = '"+ request.body.email +"' and '" + request.body.password + "'";

    if (request.session.state == false)
    {
        db.db().query(sql, function(err, result){
            if (err) throw err;
            if (result.length > 0)
            {
                writeHead(200, {'Content-Type' : 'text/html'});
                request.session.state == true;
                request.session.email == request.body.email;
                return res.redirect('/dashboard');   
            }
            else
            {
                request.session.email = "";
                res.writeHead(403, {'Content-Type' : 'text/html'});
                return res.send({code: 403, status: "Invalid email or password!"});
            }
        });
    
    }
    else if (request.session.state == true && request.session.email != "" && typeof request.session.state != "undefined" && typeof request.session.email != "undefined")
    {
        return res.redirect('/dashboard');
        
    }
});

app.get('/logout', function(request, res){
    request.session.destroy(function(err){
        if (err) throw err;
        else res.redirect('/login');
    });
});
var server = app.listen(port, function(){
    console.log("%s:%s", ur, port);
})