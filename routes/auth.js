const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
router.post("/register", async (req, res, next) => {

    try {
       
        const hashedpassword = await bcrypt.hash(req.body.password, 10);
        
    const user = await new User({
        name: req.body.name,
        password: hashedpassword,
        email: req.body.email
    })

        try { await user.save(); } 
        catch (error) {
            console.log(error);
        }
        console.log("completed")
        res.status(200).json(user);
    }   
   catch(err){console.log(err)} 

    
});
router.post('/login',async (req, res, next) => {
   try{ const user = await User.findOne({ email: req.body.email });
       if (!user)  return res.status(404).send("Email is not found");
     
       const passauthenticate = await bcrypt.compare(req.body.password, user.password);
       if (!passauthenticate) return res.send("password not matched");
       else {
           return res.send("password && email  matched");
       }
   }
   catch (e) {
       console.log(e);
    }
})

module.exports = router;
