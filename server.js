var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var exphbs = require('express-handlebars');
var mysql = require('mysql');
var bcrypt = require('bcryptjs');

var app = express();
var PORT = process.env.NODE_ENV || 8090;