require('dotenv').config();
const express = require('express');
const session = require('express-session');
const db = require('./db');
const app = express();
const bodyParser = require('body-parser');
const port = db.port();
const ur = db.url();
const fs = require('fs');
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static(__dirname + '/public'));
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
    res.setHeader('Content-Type', 'text/html');

    if (request.session.state == false || typeof request.session.state == "undefined" || request.session.email == "" || typeof request.session.email == "undefined")
    {
        db.db().query(sql, function(err, result){
            if (err) throw err;
            if (result.length > 0)
            {               
                request.session.state == true;
                request.session.email == request.body.email;
                return res.redirect('/dashboard', 200);   
            }
            else
            {
                request.session.email = "";
                res.statusCode = 401;
                return res.send({code: 401, status: "Invalid email or password!"});
            }
        });
    
    }
    else if (request.session.state == true && request.session.email != "" && typeof request.session.state != "undefined" && typeof request.session.email != "undefined")
    {
        return res.redirect('/dashboard', 200);        
    }
});

app.get('/dashboard', function(request, res){
    fs.readFile('public/html/index.html', null, function(err, html){
        if (err) throw err;
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        res.write(html);
        res.end();        return;
    });
        
});
app.get('/', function(request, res){

        if (request.session.state == "false" || request.session.email == "" || typeof request.session.state == "undefined" || typeof request.session.email == "undefined"){
            fs.readFile('public/html/login.html', null, function(err, html){
                if (err) throw err;
                res.writeHead(200, {
                    'Content-Type': 'text/html'
                });
                res.write(html);
                res.end();        return;
            });
        
        }
        else{
            fs.readFile('public/html/index.html', null, function(err, html){
                if (err) throw err;
                res.writeHead(200, {
                    'Content-Type': 'text/html'
                });
                res.write(html);
                res.end();        return;
            });

        }

        
});
app.get('/sign-up', function(request, res){
    fs.readFile('public/html/register.html', null, function(err, html){
        if (err) throw err;
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        res.write(html);
        res.end();        return;
    });
        
});
app.get('/add-subreddit', function(request, res){
    fs.readFile('public/html/addsub.html', null, function(err, html){
        if (err) throw err;
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        res.write(html);
        res.end();        return;
    });
        
});
app.post('/add', function(request, res){
  
    let sql;

    sql = "SELECT * from subreddits where name = '"+ request.body.reddit +"'";
    db.db().query(sql, function (err, result){
        if (err) throw err;
        if (result.length > 0)
        {
            res.writeHead(403, {'Content-Type' : 'text/html'});
            return res.send({code: 403, status: "Subreddit already exists!"});
        }
        else
        {
            sql = "INSERT INTO subreddits VALUES (NULL,'"+ request.body.reddit +"', CURRENT_TIMESTAMP)";
            res.writeHead(200, {'Content-Type' : 'text/html'});
            db.db().query(sql, function(er){
                if (er) throw er;
                return res.send({code: 200, status: "Subreddit added successfully!"});
            }); 
        }
    });
});

app.get('/stored-posts', function(request, res){
    fs.readFile('public/html/stored.html', null, function(err, html){
        if (err) throw err;
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        res.write(html);
        res.end();        return;
    });
        
});
app.get('/logout', function(request, res){
    request.session.destroy(function(err){
        if (err) throw err;
        else res.redirect('/');
    });
});
var server = app.listen(port, function(){
    console.log("%s:%s", ur, port);
})