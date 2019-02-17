const express = require('express');
const db = require('./db');
const app = express();
const bodyParser = require('body-parser');
const port = db.port();
const ur = db.url();
app.use(bodyParser.json());

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
                    db.db().query(sql, function(er){
                        if (er) throw er;
                        return res.send({code: 200, status: "Account created successfully!"});
                    }); 
                }
            });
        });

var server = app.listen(port, function(){
    console.log("%s:%s", ur, port);
})