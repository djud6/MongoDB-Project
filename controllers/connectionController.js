const model = require('../models/connections');
const rsvpModel = require('../models/rsvp')
const User = require('../models/user')

exports.connections = (req, res, next) =>{
    model.find()
    .then(connections=>res.render('./connection/index', {connections}))
    .catch(err=>next(err));
    
};

exports.new = (req, res) =>{
    res.render('./connection/new');
};

exports.create = (req, res, next) => {
    const image = req.file.filename;
    req.body.image = image;
    console.log(image);
    let connection = new model(req.body);
    connection.host = req.session.user; 
    connection.save()
    .then((connection)=>{
        console.log(connection);
        res.redirect('/connections');
    })
    .catch(err=>{
        if(err.name === 'ValidationError'){
            err.status = 400;
        }
        next(err);
    });
    
};

exports.show = (req, res, next) => {
    let id = req.params.id;
    let user = req.session.user;

    Promise.all([model.findById(id).populate('host', 'firstName lastName'), rsvpModel.findOne({connection:id, user:user}).populate('connection', 'user')])
    
    .then(result=>{
        const[connection, rsvp] = result;
        if(connection){
            console.log(rsvp);
            return res.render('./connection/show', {connection});
        } else {
            let err = new Error('Cannot find connection with id '+id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};

exports.edit = (req, res, next) => {
    let id = req.params.id;
    
    model.findById(id)
    .then(connection=>{
        return res.render('./connection/edit', {connection});
    })
    .catch(err=>next(err));
};

exports.update = (req, res, next) => {
    let connection = new model(req.body);
    let id = req.params.id;

     // Defining the fields I want to update (excluding _id)
     const updatedFields = {
        category: connection.category,
        topic: connection.topic,
        location: connection.location,
        description: connection.description,
        host: connection.host,
        date: connection.date,
        start: connection.start,
        end: connection.end,
    };



    model.findByIdAndUpdate(id, updatedFields, {useFindAndModify: false, runValidator: true})
    .then((connection) => {
       
        res.redirect('/connections/' + id);
        
    })
    .catch((err) => {
        next(err);
    });

};

exports.delete = (req, res, next) => {
    let id = req.params.id;


    model.findByIdAndDelete(id, {userFindAndModify: false})
    .then(connection=>{

        res.redirect('/connections')
    })
    .catch((err) => {
        next(err);
    });
};

exports.editRsvp = (req, res, next)=>{
    console.log(req.body.rsvp);
    let id = req.params.id;
    rsvpModel.findOne({connection:id})
    .then(rsvp=>{
        if(rsvp){
            //update
            rsvpModel.findByIdAndUpdate(rsvp._id, {rsvp:req.body.rsvp}, {userFindAndModify: false, runValidators: true})
            .then(rsvp=>{
                req.flash('success', 'Successfully updated RSVP');
                res.redirect('/users/profile');
            })
            .catch(err=>{
                console.log(err);
                if(err.name === 'ValidationError'){
                    req.flash('error', err.message);
                    return res.redirect('/back')
                }
                next(err);
            })
        }else{
            //create
            let rsvp = new rsvpModel({
                connection: id,
                rsvp: req.body.rsvp,
                user: req.session.user
            });
            rsvp.save()
            .then(rsvp=>{
                req.flash('success', 'Successfully created RSVP');
                res.redirect('/users/profile');
            })
            .catch(err=>{
                req.flash('error', err.message);
                next(err)
            });
        }
    });
}

exports.about = (req, res) =>{
    res.render('about');
};

exports.contact = (req, res) =>{
    res.render('contact');
};

exports.deleteRsvp = (req, res, next)=>{
    let id = req.params.id;
    rsvpModel.findOneAndDelete({connection: id, user:req.session.user})
    .then(rsvp=>{
        req.flash('success', 'Succesfully deleted RSVP');
        res.redirect('/users/profile');
    })
    .catch(err=>{
        req.flash('error', err.message);
        next(err)});
}

/*
exports.submitContact = (req, res) => {
    // Render the 'submit-contact' view with a message
    res.render('submit-contact', { message: 'Thank you for contacting us! We will get back to you shortly.' });
};
*/


