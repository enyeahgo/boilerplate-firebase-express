const firebase = require('../Firebase');

module.exports = function getUserData(req, res, next) {
    if(res.verified){
        firebase.database().ref('Users').child(res.user.uid).once('value')
                .then(function(dataSnapshot) {
                    res.userdata = dataSnapshot.val();
                    next()
                }).catch(function(error) {
                    console.log(error.message)
                    next()
                })
    } else {
        next()
    }
}