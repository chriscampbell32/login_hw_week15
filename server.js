var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var exphbs = require('express-handlebars');
var mysql = require('mysql');
var bcrypt = require('bcryptjs');

var app = express();
var PORT = process.env.NODE_ENV || 8090;

var Sequelize = require('sequelize');
var sequelize = new Sequelize('student_teacher_db', 'root');

var Students = sequelize.define('Students', {
    id: {
        type: Sequelize.STRING,
        autoIncrement: true,
        primaryKey: true
    },
    firstname: Sequelize.STRING,
    lastname: Sequelize.STRING,
    email: Sequelize.STRING
});

app.use(bodyParser.urlencoded({
    extended: false
}));

//sequelize

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

app.get('/login', function(req, res){
    res.render('login');
});

app.get('/registration', function(req,res){
    res.render('login', {
     //   msg: req.query.msg
    });
});

app.get('/students', function(req, res){
    res.send('students');
});

app.get('/instructors', function(req, res){
    res.send('instructors');
});




app.listen(PORT, function(){
    console.log("Listening on PORT %s", PORT);
});