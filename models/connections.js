const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const connectionSchema = new Schema({
    category: {type: String, required: [true, 'category is required']},
    topic: {type: String, required: [true, 'title is required']},
    location: {type: String, required: [true, 'location is required']},
    description: {type: String, required: [true, 'content is required'],
                minLength: [10, 'the content should have at least 10 characters']},
    host: {type: Schema.Types.ObjectId, ref:'User'},
    date: {type: Date},
    start:{type:String},
    end:  {type:String},
    image:{type: String }
},
{timestamps: true}
);

connectionSchema.statics.getTopics = function(connections){
    const connectionTopic = [];
    for(let i = 0; i<connections.length; i++){
        if(!connectionTopic.includes(connections[i].connectionTopic)){
            connectionTopic.push(connection[i].connectionTopic);
        }
    }
    return connectionTopic;
}


//collection name is connections in the database
module.exports = mongoose.model('Connections', connectionSchema);

//const Connection = mongoose.model('Connections', connectionSchema);

/*let connection = new Connection(
    {
        title: 'test',
        author: 'David',
        content: ' test'
    }
);

console.log(connection);
connection.validate()
.then(()=>{
    console.log('validated successfully');
})
.catch(err=>console.log(err.message));
*/


