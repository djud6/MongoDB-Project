const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const rsvpSchema = new Schema({
    rsvp: {type:String, required: [true, 'RSVP is required']},
    user: {type: Schema.Types.ObjectId, ref:'User'},
    connection: {type:Schema.Types.ObjectId, ref:'Connections', required: [true, 'Connection is required']}
}, {timestamps:true});

module.exports = mongoose.model('Rsvp', rsvpSchema);