
const register=require("../models/registers");
const auth =async(req,res,next)=>{
    try{
const token=req.cookies.id;
//console.log(token);
if(token==""){
    return res.redirect("/register");
}
const data=await register.findOne({_id:token});
//console.log(data);
if(data){
   
  //  console.log(data);
//ways to pass return value to the route(middleware ----> route)
//1.Attach the value to the req object:
req.data=data;
   
    //console.log("jja");
    next();
    
    
}else{
return res.redirect("/register");
}
    }
    catch(err){
        console.log(err);
        res.status(401).send("error");
        
    }
}
module.exports=auth;