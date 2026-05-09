
const User = require("../Models/users")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const register = async (req,res) => {
  try{const {name, email, password} = req.body;

  //VALIDATE IF ANYTHING MISSING mn
  if(!name || !email || !password){
    return res.status(400).json({message:"All fileds must be filled"})
  }

  //check user already exist or not
  const existingUser = await User.findOne({email});

  if(existingUser){
    return res.status(400).json({message:"There already a user with this email"})
  }

  //hashpassword
  const hashedPassword = await bcrypt.hash(password,5);


  //create user with given data

  const user = await User.create({
    name,
    email,
    password:hashedPassword
  });

  //create jwt token
  const token = jwt.sign(
    {id:user._id},
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  //SEND RESPONSE

  res.status(201).json({
    message:"User created successfully",
    token,
    user:{
      id:user._id,
      name:user.name,
      email:user.email
    }
  });
}
catch(error){
  console.log(error);
  res.status(501).json({message:"Server Error"})
}

};

const login = async (req,res) => {
   try{
    const {email,password} = req.body;
   

   if(!email || !password){
    return res.status(401).json({message:"Both email and password is mendatory"})
   }

   //check user exist
   const user = await User.findOne({email});
   if(!user){
    return res.status(401).json({message:"Invalid Credential"})
   }

   //compare password 
   const isMatch = await bcrypt.compare(password, user.password);

   if(!isMatch){
    return res.status(401).json({message:"Invalid Credential"})
   }

   
    // Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Send response
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

}  catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports ={register, login};
