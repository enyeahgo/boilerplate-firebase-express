const firebase = require('firebase');
require('firebase/auth');

const config = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
}

firebase.initializeApp(config);

module.exports = firebase;