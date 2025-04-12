const express= require("express");
const router= express.Router();
//controllers
const {upload, remove}=require("../controllers/cloudinary")


//middlewares
const {authCheck, adminCheck}= require("../middlewares/auth")

//routes
router.post("/uploadimages",authCheck,adminCheck,upload)
router.post("/removeimages",authCheck,adminCheck,remove)

module.exports=router;