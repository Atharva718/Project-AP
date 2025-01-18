const User = require("../models/user");

module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs");
};




module.exports.signup = async (req, res) => {
    try{
        let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }

        req.flash("success", "Welcome to Wanderlust!");
        res.redirect("/listings");

    })
    
    } catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
    
};

module.exports.renderLoginForm= (req,res)=>{
    res.render("users/login.ejs");
};



module.exports.login = async (req, res) => {
    req.flash("success","WELCOME back to wanderlust , You are now logged in ! ");
    // res.redirect("/listings");
    // res.redirect("req.session.redirectUrl")     THIS WILL PAIN US FROM PASSPORT 
    // res.redirect(res.locals.redirectUrl);       IT WILL ALSO GIVE ERRO RWHEN LEADS TO LOGIN ..ONLY IN ONE PAGE
    let redirectUrl = req.session.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};



module.exports.logout = (req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are logged out now ");
        res.redirect("/listings");
    })
};