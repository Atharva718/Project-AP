if(process.env.NODE_ENV !="production"){
    require('dotenv').config();
}

// console.log(process.env);



const express= require("express");
const app = express();
const mongoose = require("mongoose");
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

//8.0
const methodOverride = require("method-override");
//9 
const ejsMate= require("ejs-mate");

//3.0
const Listing= require("./models/listing.js");

//4.0
const path = require("path"); 
//2.1
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");


const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");



const { error } = require("console");
//2.2
const{listingSchema, reviewSchema}= require("./schema.js");
//2.4
const Review = require("./models/review.js");


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");

const userRouter = require("./routes/user.js");

const review = require("./models/review.js");

//5.0
app.use(express.urlencoded({ extended: true }));  // gap should be there 
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);//9

//10
app.use(express.static(path.join(__dirname, "/public")));


// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;



// call the main function to connect to the database

main()
.then(()=>{
    console.log("connect to the database");
    }).catch(err => {
        console.log(err.message);
});
// copy from the website 
async function main() {
    await mongoose.connect(dbUrl);  
}






//4.02   views ka jo section hai us ko link karage , render katr rahe hai iss ke madat se !
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));


const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600, // 24 hours
});


store.on("error",()=>{
    console.log("Error in session store", err);
});

// SECSSION -- KEY 
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true, // Fix typo
    cookie: { // "Cookie" should be "cookie"
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000, // Fix key to "maxAge"
        httpOnly: true,
    },
};




//4 . INDEX ROUTE OR WE CAN DSAY THE HOME ROUTE

// app.get("/",(req,res)=>{
//     res.send("Hi i am root !");
// });




app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
// app.use(session());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
    res.locals.success= req.flash("success");
    res.locals.error= req.flash("error");
    res.locals.currUser= req.user;
    
    next();
})



// app.get("/demouser" ,async(req,res)=>{
//     let fakeUser= new User({
//         email:"ak@gmail.com",
//         username: "ak_123"
//     });
//     let registeredUser = await User.register(fakeUser, "kyabolta")
//     res.send(registeredUser);

// })


//2.3
// const validateListing = (req, res, next) => {
//     let { error } = listingSchema.validate(req.body);
//     let errMsg =error.details.map((el)=>el.message).join(",");

//     if (error) {
//         throw new ExpressError(400, errMsg);
//     } else {
//         next();
//     }
// };


// MMMMMMMMMMMMMMMMMMMMMMMMMM MIDDLEWAREE

// const validateReview = (req, res, next) => {
//     let { error } = reviewSchema.validate(req.body);
//     let errMsg =error.details.map((el)=>el.message).join(",");

//     if (error) {
//         throw new ExpressError(400, errMsg);
//     } else {
//         next();
//     }
// };





app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);




//3. LISTING ROUTE 

// app.get("/testListining", async (req,res)=>{
//     let sampleListing= new Listing({
//         title:" My new villa ",
//         description:"Sample Description",
//         price: 12000,
//         location:"London ",
//         country: "England",
//         // image:"Sample Image",
//     });
// // aab data base me save karte hai iss koo : 
//     await sampleListing.save();
//     console.log("Sample was saved !");
//     res.send("Suceeful testing !");

// });




app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});
//2.1
//It ensures that any error in your app is properly sent to the client with a meaningful status code and message.  
  app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs",{message});    // res.status(statusCode).send(message);
  });

 
 

//2
app.get("/",(req,res)=>{
    res.send("Its working ");
});

//1
app.listen("8080",()=>{
    console.log("server is running on port 8080");

});