// const Joi = require('joi');
const Joi = require('joi');

// const Listing = require('./models/listing');



// // const listingSchema=Joi.object({
// module.exports.listingSchema=Joi.object({
//     listing : Joi.object({
//         title: Joi.string().required(),
//         description: Joi.string().required(),
//         price: Joi.number().required().min(0),
//         location: Joi.string().required(),
//         country : Joi.string().required(),
//         image: Joi.string().uri().allow("", null),
//         // image : Joi.string().uri().allow("",null)``````````

//     }).required()
// });

// module.exports.listingSchema = Joi.object({
//     listing: Joi.object({
//       title: Joi.string().required(),
//       description: Joi.string().required(),
//       price: Joi.number().required().min(0),
//       location: Joi.string().required(),
//       country: Joi.string().required(),
//       image: Joi.object({
//         filename: Joi.string().uri().allow("", null),
//         url: Joi.string().uri().allow("", null)
//       }).required() 
//     }).required()
//   });


//IT IS CORRECT 
module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required().min(0),
    location: Joi.string().required(),
    country: Joi.string().required(),
    image: Joi.string().uri().allow("", null).default("https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG90ZWxzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"), // Default URL if not provided
  }).required(),
});

//Trial 





module.exports.reviewSchema = Joi.object({

    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required(),
});