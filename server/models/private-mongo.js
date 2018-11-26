const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const private = new Schema({
    content: String,
    from: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    to: String,    
    timestamp: Number,
    type: String
}, 
{ 
    usePushEach: true 
});
module.exports = mongoose.model('private',private);
