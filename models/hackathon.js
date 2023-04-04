const mongoose = require("mongoose");

const hackathonSchema= mongoose.Schema({

hackathon_name:{
type:String
},location:{
type:String
},description:{
type:String
},prize:{
    ist:{
type:Number
    },second:{
        type:Number
    },third:{
        type:Number
    }
    
},cp:{
    type:Number
}



});



module.exports=new mongoose.model("hackathon",hackathonSchema);