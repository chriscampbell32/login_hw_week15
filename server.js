var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var exphbs = require('express-handlebars');
var mysql = require('mysql');
var bcrypt = require('bcryptjs');

var app = express();
var PORT = process.env.NODE_ENV || 8090;
//sequelize init
var Sequelize = require('sequelize');
//connect to database
var sequelize = new Sequelize('student_teacher_db', 'root');

//models
var Students = sequelize.define('Students', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    firstname: Sequelize.STRING,
    lastname: Sequelize.STRING,
    email: Sequelize.STRING,
    password: Sequelize.STRING
});
//instructor model...
//body parser reads info from html
app.use(bodyParser.urlencoded({
    extended: false
}));


//make main.handlebars default layout
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

app.get('/login', function(req, res){
    res.render('login');
});

app.get('/registration', function(req,res){
    res.render('registration');
});

app.post('/registration', function(req, res){
    Students.create(req.body).then(function(user){
        res.redirect('/secret');
    }).catch(function(err){
        res.send("/registration?msg=erroromgomg");
    });
});

app.get('/students', function(req, res){
    res.send('students');
});



app.get('/instructors', function(req, res){
    res.send('instructors');
});

app.get('/secret', function(req, res){
    Students.findAll().then(function(user){
        res.render('secret', {user});
    });
});




sequelize.sync().then(function(){
    app.listen(PORT, function(){
        console.log("listening on port %s", PORT);
    });
});