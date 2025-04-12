const User= require("../models/user")
exports.createOrUpdateUser=async(req,res)=>{     

    const {name, picture, email}=req.user;  //so from client we are getting usertoken and that we are applying in middleware and in middleware we are getting the user information from firebase and sending in the req.

    const user= await User.findOneAndUpdate(
        {email}, 
        {name: email.split("@")[0], picture}, 
        {new: true}
    );  //(find using wat, what to update, return the updated one)

    if(user){
        console.log("user updated",user);
        res.json(user);
    }else{  // user not found so create new user
        const newUser= await new User({
            email, 
            name: email.split("@")[0], 
            picture
        }).save();
        console.log("user created new",newUser)
        res.json(newUser);
    }
}


exports.currentUser=async(req, res)=>{
    User.findOne({email: req.user.email}).exec((err, user)=>{
        if(err) throw new Error(err);
        res.json(user);
    })
}