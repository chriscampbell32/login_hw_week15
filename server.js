var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var exphbs = require('express-handlebars');
var mysql = require('mysql');
var bcrypt = require('bcryptjs');
var passport = require('passport');
var passportLocal = require('passport-local')
var app = express();
var PORT = process.env.NODE_ENV || 8090;
//sequelize init
var Sequelize = require('sequelize');
//connect to database
var sequelize = new Sequelize('student_teacher_db', 'root');



//cookie session
app.use(session({
    secret: 'super secret',
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: (1000 * 60 * 4) 
    }
}));

//models
var User = sequelize.define('user', {
  firstname: {
    type: Sequelize.STRING,
    allowNull: false
  },
  lastname: {
    type: Sequelize.STRING,
    allowNull: false
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [5,20],
        msg: "Your password must be between 5-20 characters"
      },
    }
  },
  instructor_type: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {
  hooks: {
    beforeCreate: function(input){
      input.password = bcrypt.hashSync(input.password, 10);
    }
  }
});

var Student = sequelize.define('student', {
  firstname: {
    type: Sequelize.STRING,
    allowNull: false
  },
  lastname: {
    type: Sequelize.STRING,
    allowNull: false
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [5,20],
        msg: "Your password must be between 5-20 characters"
      },
    }
  },
}, {
  hooks: {
    beforeCreate: function(input){
      input.password = bcrypt.hashSync(input.password, 10);
    }
  }
});


//student model...
//body parser reads info from html
app.use(bodyParser.urlencoded({
    extended: false
}));


//make main.handlebars default layout
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

app.use(passport.initialize());
app.use(passport.session());

//passport use methed as callback when being authenticated
passport.use(new passportLocal.Strategy(function(username, password, done) {
    //check password in db
    User.findOne({
        where: {
            username: username
        }
    }).then(function(user) {
        //check password against hash
        if(user){
            bcrypt.compare(password, user.dataValues.password, function(err, user) {
                if (user) {
                  //if password is correct authenticate the user with cookie
                  done(null, { id: username, username: username });
                } else{
                  done(null, null);
                }
            });
        } else {
            done(null, null);
        }
    });

}));
//change the object used to authenticate to a smaller token
passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
    done(null, { id: id, name: id })
});

//get requests & page redirects
app.get('/', function(req, res){
  res.send('HOME PAGE');
});

app.get('/instructor-registration', function(req, res){
  res.render('instructor-registration');
});

app.get('/student-registration', function(req, res){
  res.render('student-registration');
});

app.get('/student-login', function(req, res){
  res.render('student-login');
});

app.post('/student-login', passport.authenticate('local', {
  successRedirect: '/secret',
  failureRedirect: '/login?msg=Login credentials do not work'
}));

app.get('/instructor-login', function(req, res){
  res.render('instructor-login');
})

//post requests from forms
app.post("/instructor-info", function(req, res){
  User.create(req.body).then(function(result){
    res.redirect('/?msg=Account created');
  }).catch(function(err) {
    console.log(err);
    res.redirect('/?msg=' + err.errors[0].message);
  });
})

app.post("/student-info", function(req, res){
  Student.create(req.body).then(function(result){
    res.redirect('/?msg=Account created');
  }).catch(function(err) {
    console.log(err);
    res.redirect('/?msg=' + err.errors[0].message);
  });
})

// app.post('/check', passport.authenticate('local', {
//   successRedirect: '/',
//   failureRedirect: '/?msg=Login Credentials do not work'
// }));

app.get('/secret', function(req, res) {
    res.render('secret', {
      user: req.user,
      isAuthenticated: req.isAuthenticated()
    });
});



sequelize.sync().then(function(){
    app.listen(PORT, function(){
        console.log("listening on port %s", PORT);
    });
});