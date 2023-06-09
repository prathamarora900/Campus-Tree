/*
routes
/myprofile (get) == for rendering user's own profile
/edit-profile(get)  ==rendering page where user can update additional fields
/edit-profile(post)   === recive body and update information in db
/user/:"user_id"(get)     ==specific user
/upload_profile(post)   ==uploading profile image
/other_profile(post )  ==show other profile in db
/team (get)
/team(post)
/add_hackathon(get)

/all_user (get)


*/

const profile=require("express").Router();
const register=require("../models/registers");
const auth=require("../middleware/auth");
const cloudinary=require("cloudinary");
const team=require("../models/team");
cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
  });


  profile.get("/myprofile",auth,async(req,res)=>{     //rending my profile
try{


    const user=await register.findOne({_id:req.cookies.id});
     if(user){
         //console.log(user.about);
         res.status(200).render("myprofile",{interest:user.interest,about:user.about,fullname:user.full_name ,userid:user.user_id,email:user.email,city:user.city,college:user.college,profile_image:user.profile_image});
     }else{
         //displaying error page
         res.send("error");
     }
}catch{
    res.send("Something went wrong...");

    //displaying error page

}
    
   
});







  profile.get("/edit-profile",auth,async(req,res)=>{
    try{ 
  
     // console.log(req.body);
         const user=await register.findOne({_id:req.cookies.id});
      if(user){
          //console.log(user);
          let basic_info={
             fullname:user.full_name, 
             user_id:user.user_id,
             college:user.college,
             city:user.city, 
             email:user.email,
             interest:user.interest,
             about:user.about,
             profile:user.profile_image
  
          }
          //console.log(basic_info);
  
  
  res.render("edit_profile",{data:basic_info});
      }}catch(err){
          console.log(err);
          res.send("Error");

          //error page
      };
  });




  profile.post("/edit_profile",async(req,res)=>{

    try{
       // console.log(req.body);
       // console.log(req.body.fullname);
       const {fullname,userid,email,interest,aboutInput,city,college}=req.body;
//console.log(req.body);


       const update={
          full_name:fullname,
          user_id:userid,
          college:college,
             city:city,
             about:aboutInput,
             interest:interest
            
          
       }
      // console.log(update);
     const u= await register.findOneAndUpdate({_id:req.cookies.id}, update, {});

    //console.log(u);

    res.redirect("/myprofile")
   
    
      

    }catch(err){
        console.log(err);
        res.send("Something went wrong");
        //error page
    }
//console.log(req.body);
})

  








//specific user

profile.get("/user/:user_id",auth,async(req,res)=>{
    try{
        const user=await register.findOne({user_id:req.params['user_id']}); 
        if(user){
            res.render("otherprofile",{interest:user.interest,about:user.about,fullname:user.full_name ,userid:user.user_id,email:user.email,city:user.city,college:user.college,profile_image:user.profile_image});
        }else{
            res.send("error");
        }
    }catch(err){
        console.log(err);
        //displaying error page
        res.send("Something went wrong");
    }
    
})







profile.post("/upload_profile",async(req,res)=>{

    const url=req.body;
    const qe = cloudinary.uploader.upload(url.url_data, {public_id: Date.now()});
qe.then(async(data)=>{
//console.log(data.secure_url);

//update db 

//find the user
const update={profile_image:data.secure_url};
const user=await register.findOneAndUpdate({_id:req.cookies.id}, update, {

});

if(user){
    //console.log(user);
    res.send({"success":true,"image_url":data.secure_url});
    
}
else{
    res.send({"status":false,"message":"Upload failed","title":"Internal"});
}

}).catch((err)=>{console.log(err) ;   
    res.send({"status":false,"message":"Upload failed","title":"Internal"});
});


})






//show other user profile  (in boxes)
profile.post("/other_profile",auth,async(req,res)=>{
    try{
const user=await register.find({_id:{$ne:req.cookies.id}});
//console.log(user);
if(user){
let data=[];

    const details=user.forEach((ele)=>{
             data.push({fullname:ele.full_name,user_id:ele.user_id,college:ele.college,about:ele.about,profile_image:ele.profile_image});

    })
res.send(data);
}}catch(err){
    console.log(err);
}
// console.log(user);

});





//team routes
profile.get("/team",(req,res)=>{
    
    
    res.render("maketeam");


});
profile.post("/team",async(req,res)=>{
    try{
        //console.log("helllo");
       const {heading,project_detail,teamMembers,projectType}=req.body;
       const user=await team.findOne({user_id:req.cookies.user_id});
if(user){

   await  user.teams.push({
        heading:heading,
        project_detail:project_detail,
        total_members:teamMembers,
        project_type:projectType
    
    });
    await user.save();
}else{
    
    const newww= await new team({
      user_id:req.cookies.user_id,
      name:req.cookies.name,
      teams:{
        heading:heading,
        project_detail:project_detail,
        total_members:teamMembers,
        project_type:projectType
      }
      
    });
    await newww.save(); 
}


//console.log(user);
res.redirect("/story");
    }catch(err){
        console.log(err);


    }
});

profile.get("/add_hackathon",auth,(req,res)=>{
    res.render("add_hackathon");
});



//add post of add-hackathon

profile.get("/all_user",auth,(req,res)=>{
    try{
    res.render("all_user");
    
    }catch(err){
    console.log(err);
    res.send("Something went wrong");

    //error page
    }
    })


// profile.post("/add-hack")
module.exports=profile;
