const Connection = require('../models/connections')

//check if user is a guest
exports.isGuest = (req, res, next)=>{
    if(!req.session.user)
        return next();
    else{
        req.flash('error', 'You are logged in already');
        return res.redirect('/users/profile');
}
};
//check if user is logged in
exports.isLoggedIn = (req, res, next)=>{
    if(req.session.user)
        return next();
    else{
        req.flash('error', 'You need to log in first');
        return res.redirect('/users/login');
}
};

//check if user is author
exports.isHost = (req, res, next)=>{
    let id = req.params.id;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid connection ID');
        err.status = 400;
        return next(err);
    }
    Connection.findById(id)
    .then(connection=>{
        if(connection){
            if(connection.host == req.session.user){
                return next();
            }else{
                let err = new Error('Unauthorized to access the resource');
                err.status = 401;
                return next(err);
            }
        } else {
            let err = new Error('Cannot find connection with id '+id);
            err.status = 404;
            next(err);
        }
    })

};

//check if user is not a host
exports.isNotHost = (req, res, next) => {
  let id = req.params.id;
  Connection.findById(id)
    .then(connection=>{
        if(connection){
            if(connection.host != req.session.user){
              console.log('isNotAuthor');
                return next();
            }else{
                let err = new Error('Unauthorized to access the resource');
                err.status = 401;
                return next(err);
            }
        } else {
            let err = new Error('Cannot find connection with id '+id);
            err.status = 404;
            next(err);
        }
    })

    .catch(err => next(err));
};


//check for valid story Id
exports.isInValid = (req, res, next)=>{
    let id = req.params.id;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid connection ID');
        err.status = 400;
        return next(err);
    }
    next();
}
