const mongoose=require('mongoose');
  const path=require("path");
//console.log(path.resolve(__dirname, '../.env'));
require("dotenv").config();
const url=process.env.url;
//console.log(process.env.url);
mongoose.connect(process.env.url).then(()=>{
console.log("db is get connected");
}).catch((err)=>{
console.log(err);
})
