const firebaseAdmin = require('../FirebaseAdmin')

module.exports = function verifyToken(req, res, next) {

    if(req.cookies['__session']){
        firebaseAdmin.auth().verifyIdToken(req.cookies['__session'].token)
                .then(function(decodedToken) {
                    res.verified = true;
                    res.user = decodedToken;
                    next()
                }).catch(function(error) {
                    res.error = error.message;
                    res.verified = false;
                    next()
                });
    } else {
        if(req.url == '/'){
            res.clearCookie('error');
            res.verified = false;
            next()
        } else {
            res.error = 'You need to login to continue.';
            res.verified = false;
            next()
        }
    }
}
