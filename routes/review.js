const express = require("express");
const router = express.Router({mergeParams: true});  // ROUTER OBJECT 

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
// const{reviewSchema}= require("../schema.js");
const Review = require("../models/review.js");
const Listing= require("../models/listing.js");
const {validateReview, isLoggedIn , isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");
// const validateReview = (req, res, next) => {
//     const { error } = reviewSchema.validate(req.body);
    
//     if (error) {
//         let errMsg = error.details.map((el) => el.message).join(", ");
//         throw new ExpressError(400, errMsg);  // Throw an error with the details of the validation problem
//     } else {
//         next();  // Proceed to the next middleware if no error
//     }
// };


//2.4                                                     REVIEWS 

router.post("/", isLoggedIn, validateReview , wrapAsync( reviewController.createReview ));

//                                   DELET COMMENT REVIEW ROUTE 
// Delete Review Route
router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.destroyReview)
  );

module.exports = router;