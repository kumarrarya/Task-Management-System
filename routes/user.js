const router = require("express").Router();
const user = require("../models/user");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt=require("jsonwebtoken");
// sign-in
router.post("/sign-in", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log("Incoming request body:", req.body); // Log the request body

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
      return res.status(400).json({ message: "Username Already Exists" });
    }

    const existEmail = await User.findOne({ email: email });
    if (existEmail) {
      return res.status(400).json({ message: "Email Already Exists" });
    }
    const hashPass = await bcrypt.hash(password, 10);
    const newUser = new User({
      username: username,
      email: email,
      password:  hashPass,
    });

    await newUser.save();
    // 
    console.log("New user created:", newUser);
    return res.status(200).json({ message: "Sign In successful" });
  } catch (error) {
    console.error("Error:", error); // Log the actual error for debugging
    return res.status(500).json({ message: "Internal Server Error" });
  }
});


// log-in

router.post("/log-in", async (req,res)=>{
    const {username,password} = req.body;
    const existingUser= await User.findOne({username:username});
    console.log("login:",username,password);
    if(!existingUser){
        return res.status(400).json({message:"Username or Password is Incorrect"});
    }
    
    bcrypt.compare(password,existingUser.password,(err,data)=>{
        if(data){
            const authClaims= [{name:username},{jti:jwt.sign({},"tcmTM")}];
            const token=jwt.sign({authClaims},"tcmTM",{expiresIn:"2d"});
            return res.status(200).json({id:existingUser._id,token:token});
        }
        else{
            return res.status(400).json({message: "Username or Password is Incorrect"});
        }
    })
})
module.exports = router;
