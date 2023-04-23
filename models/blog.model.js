const mongoose=require('mongoose')
const schema = mongoose.Schema

const blogSchema = new schema({
    title : {
        type : String,
        required : true,
    },
    date : {
        type : String,
        reuired : true,
    },
    writer : {
        type : String,
        required : true,
    },
    content : {
        type : String,
        required : true,
    },
    image : {
        type : String,
        required : true,
    },
    isDeleted : {
        type : String,
        default : false,
    },
},
{
    timestamps : true,
    versionKey : false,
})

module.exports = new mongoose.model('blog_schemas',blogSchema)