const express=require("express");
const mongoose= require("mongoose");
const morgan= require("morgan");
const bodyParser= require("body-parser");
const cors= require("cors");
const fs=require("fs");
require('dotenv').config()

//import routes
//const authRoutes=require('./routes/auth');

//app
const app=express();

//db
console.log(process.env.DATABASE_ONLINE);
mongoose.connect(process.env.DATABASE_ONLINE, {
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true,
    useFindAndModify:false
})
.then(()=> console.log("DB connected"))
.catch(err => console.log(`DB connection ERR: ${err}`));


//middlewares
app.use(morgan("dev"));
app.use(bodyParser.json({limit: "2mb"}))
app.use(cors());


//routes middleware
//app.use('/api',authRoutes)
fs.readdirSync("./routes").map((r)=>
    app.use("/api",require("./routes/" + r))
);  //so instead of using the above commented app.use we can use this code to dynamically  fetch all the routes using filesystem from routes folder and put it in app.use dynamically
//and we no need to import each routes as well. this code is doing this also

//port
const port=process.env.PORT || 8000;
app.listen(port,()=> console.log(`Server is running on PORT ${port}`));