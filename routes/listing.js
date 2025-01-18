const express = require("express");
const router = express.Router();  // ROUTER OBJECT 
const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");
// const{listingSchema}= require("../schema.js");
const Listing= require("../models/listing.js");
const {isLoggedIn}= require("../middleware.js");
const{isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");

//2

const multer = require("multer");
const { storage } = require("../cloudConfig.js");

const upload = multer({ storage });




router.route("/")
.get( wrapAsync(listingController.index))
.post( isLoggedIn,  upload.single('listing[image]'),validateListing,  wrapAsync(listingController.createListing));
// .post(upload.single('listing[image]'), (req, res) => {
//     res.send(req.file);
// });
// validateListing,            ADD THIS LATER 

// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);


router.route("/:id")
.get( wrapAsync(listingController.showListing))
.put(isLoggedIn, isOwner, upload.single('listing[image]'),validateListing, wrapAsync( listingController.updateListing))
.delete(isLoggedIn, isOwner,wrapAsync( listingController.destroyListing));





// INDEX ROUTE                                                                 (1)
// router.get("/", wrapAsync(listingController.index));




//6 
// CREATE ROUTE   // new route 
// New Route
// router.get("/new",( req, res) => {
//     // console.log(req.user);
//     // if (!req.isAuthenticated()) {
//     //   req.flash("error", "you must be logged in to create listing!");
//     //   return res.redirect("/login");
//     // }
  
//     res.render("listings/new.ejs");
//   };




                                                            
// Show Route
// router.get("/:id", wrapAsync(listingController.showListing));






//7
// Create Route    // new listing

//If something goes wrong (e.g., validation fails), wrapAsync ensures that the error is caught and passed to the error-handling middleware instead of crashing the server.
//This ensures robust data validation and prevents invalid data from causing errors in your application.
// router.post('/', isLoggedIn, validateListing, wrapAsync(listingController.createListing));






//8
// EDIT ROUTE
// router.get("/:id/edit",wrapAsync( async (req, res) => {
//     const { id } = req.params;
//     const listing = await Listing.findById(id);
//     res.render("listings/edit.ejs", { listing });
// }));

// EDIT ROUTE
router.get("/:id/edit" ,isLoggedIn, isOwner,wrapAsync(listingController.renderEditForm));

// UPDATE ROUTE
// app.put("/listings/:id",validateListing , wrapAsync( async (req, res) => {
//     if (!req.body.listing){
//         throw new ExpressError(400,"send a valid data for listing!");
//     }
//     const { id } = req.params;
//     await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//     res.redirect(`/listings/${id}`);
// }));




// router.put('/:id',isLoggedIn, isOwner, validateListing, wrapAsync( listingController.updateListing));



//9 DELETE ROUTE 
// router.delete("/:id",isLoggedIn, isOwner,wrapAsync( listingController.destroyListing));


module.exports = router;