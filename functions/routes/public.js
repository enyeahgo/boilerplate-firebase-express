var express = require('express');
var router = express.Router();
const firebase = require('../Firebase');
const verifyToken = require('./verifyToken');
const getUserData = require('./getUserData');

router.get('/', verifyToken, function(req, res, next) {
  if(res.verified){
    res.render('index', {
      title: 'Vimogy',
      isLoggedIn: true
    });
  } else {
    res.render('index', {
      title: 'Vimogy',
      isLoggedIn: false
    });
  }
});

router.get('/login', function(req, res, next) {
  res.render('login', {
    title: 'Login Page',
    error: req.cookies['__session'] ? req.cookies['__session'].error : ''
  })
});

router.post('/login', function(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  var sessionData = req.cookies['__session'] ? req.cookies['__session'] : {};

  firebase.auth().signInWithEmailAndPassword(email, password)
          .catch(function(error) {
            sessionData.error = error.message;
            res.cookie('__session', sessionData, { httpOnly: true, sameSite: "none" });
            res.redirect('/login');
          });
  firebase.auth().onAuthStateChanged(function(user) {
    if(user){
      sessionData.error = '';
      sessionData.token = user._lat;
      res.cookie('__session', sessionData, { httpOnly: true, sameSite: "none" });
      res.redirect('/profile');
    }
  })
})

router.get('/register', function(req, res, next) {
  res.render('register', {
    title: 'Create Account',
    error: req.cookies['__session'] ? req.cookies['__session'].error : ''
  })
})

router.post('/register', function(req, res, next) {
  var fullname = req.body.fullname;
  var email = req.body.email;
  var mobile = req.body.mobile;
  var password = req.body.password;
  var rpass = req.body.rpass;
  var sessionData = req.cookies['__session'] ? req.cookies['__session'] : {};

  if(password !== rpass){
    sessionData.error = 'Password Mismatch!';
    res.cookie('__session', sessionData, { httpOnly: true, sameSite: "none" });
    res.redirect('/register');
  } else {
    firebase.auth().createUserWithEmailAndPassword(email, password)
            .catch(function(error) {
              sessionData.error = error.message;
              res.cookie('__session', sessionData, { httpOnly: true, sameSite: "none" });
              res.redirect('/register');
            })
  }
  firebase.auth().onAuthStateChanged(function(user) {
    if(user){

      const usersDb = firebase.database().ref('Users');
      usersDb.child(user.uid).set({
        fullname: fullname,
        email: email,
        mobile: mobile,
        uid: user.uid
      })

      sessionData.error = '';
      sessionData.token = user._lat;
      res.cookie('__session', sessionData, { httpOnly: true, sameSite: "none" });
      res.redirect('/profile');
    }
  })
})

router.get('/logout', function(req, res, next) {
  firebase.auth().signOut();
  res.clearCookie('__session');
  res.redirect('/');
})

router.get('/profile', verifyToken, getUserData, function(req, res, next) {
  if(res.verified){
    res.render('profile', {
      title: 'Profile',
      fullname: res.userdata.fullname,
      email: res.userdata.email,
      mobile: res.userdata.mobile,
      uid: res.userdata.uid,
      isLoggedIn: true
    })
  } else {
    res.redirect('/login')
  }
})

module.exports = router;