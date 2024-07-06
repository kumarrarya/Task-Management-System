const express = require("express");
const app=express();
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
// eslint-disable-next-line no-undef
require("dotenv").config();
require("./conn/conn"); 
const cors = require("cors");
const UserAPI= require("./routes/user");
const TaskAPI=require("./routes/task");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v2",TaskAPI);
app.use("/api/v1", UserAPI);


app.use("/",(req,res)=>{
    res.send("hello from backend Site")
});
const PORT=4000;

app.listen(process.env.PORT,()=>{
    console.log("server Started");
});
