const express = require('express');
const app = express();
const passport = require('passport');
const path = require('path')
const ejs = require('ejs')

var GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: "646237451379-aoff41a5kfkeh5nu93425lus835vv4pt.apps.googleusercontent.com",
    clientSecret: "yYAAEy8SySSdmz1LqFeEmgXK",
    callbackURL: "http://localhost:3001/return"
  },
  function(accessToken, refreshToken, profile, cb) {

    return cb(null,profile);
  }
))

passport.serializeUser(function(user, cb) {
    cb(null, user);
})
passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
})

app
    .set('views', __dirname + '/views')
    .set('view engine', 'ejs')

    .use(require('morgan')('combined'))
    .use(require('cookie-parser')())
    .use(require('body-parser').urlencoded({ extended: true }))
    .use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }))

    .set('port', process.env.PORT || 3001)

    .use(passport.initialize())
    .use(passport.session())

    .get('/', (req,res) => {  
        console.log(req.user)
        res.render('index',{user: req.user});
    })

    .get('/login', (req,res) => {
        res.render('login')  
    })

    .get('/auth/google',passport.authenticate('google', { scope: ['profile'] }))

    .get('/return', 
        passport.authenticate('google', { failureRedirect: '/login' }),
        function(req, res) {
            res.redirect('/');
        })

    .get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    })

    .listen(app.get('port'), () => {
        console.log("Escuchando puerto",app.get('port'))
    })