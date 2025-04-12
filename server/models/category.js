const mongoose = require("mongoose");
// const {ObjectId}= mongoose.Schema;

const categorySchema = new mongoose.Schema({

    name: {
        type: String,
        trim: true,   //user entering name with spaces in beg or end so trim the spaces
        required: "Name is Required",
        minlength: [1, 'Too short'],
        maxlength: [32, 'Too Long']
    },
    slug:{
        type: String,
        unique: true,
        lowercase:true,
        index: true
    }

},{
    timestamps:true
});

module.exports= mongoose.model('Category', categorySchema);