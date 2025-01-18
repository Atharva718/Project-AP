const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });



// INDEX route 
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};


// NEW route 
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};


//SHOW route 
module.exports.showListing = async (req, res) => {
    // Get the listing ID from the request parameters
    let { id } = req.params;

const listing = await Listing.findById(id)
  .populate({
    path: "reviews",
    populate: {
      path: "author",
    },
  })
  .populate("owner");

if (!listing) {
  req.flash("error", "Listing you requested for does not exist!");
  res.redirect("/listings");
}

console.log(listing);
  
    // Render the show.ejs template with the listing data
    res.render("listings/show.ejs", { listing });
};




// NEW ROUTE --- CREATE ROUTE 
module.exports.createListing = async (req, res, next) => {
  let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1
  })
  .send()


  // console.log(responce.body.features[0].geometry);


  let url = req.file.path;
  let filename = req.file.filename;
  
  // const newListing = new Listing(req.body.listing);
  // newListing.owner = req.user._id;
  // newListing.image= {url , filename};
  // newListing.geometry = response.body.features[0].geometry;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = response.body.features[0].geometry;
  let savedListing = await newListing.save();
  console.log(savedListing);
  req.flash("success", "New listing is created :) !!");
  res.redirect('/listings');
};


// module.exports.createListing = async (req, res, next) => {
//   try {
//     // Geocoding the location
//     const response = await geocodingClient.forwardGeocode({
//       query: req.body.listing.location,
//       limit: 1
//     }).send();

//     // Check if geometry is returned
//     if (!response.body.features.length) {
//       req.flash("error", "Location not found! Please enter a valid location.");
//       return res.redirect('/listings/new');
//     }

//     // Construct the listing
//     const { path: url, filename } = req.file; // Extract image path and filename
//     const newListing = new Listing(req.body.listing);
//     newListing.owner = req.user._id;
//     newListing.image = { url, filename };
//     newListing.geometry = response.body.features[0].geometry;

//     // Save the listing
//     const savedListing = await newListing.save();
//     console.log(savedListing);

//     // Flash success message
//     req.flash("success", "New listing is created :) !!");
//     res.redirect('/listings');
//   } catch (error) {
//     console.error("Error creating listing:", error);
//     req.flash("error", "Something went wrong while creating the listing. Please try again.");
//     res.redirect('/listings/new');
//   }
// };


//EDIT ROUTING 
module.exports.renderEditForm= async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing you are looking for does not exist!");
        return res.redirect("/listings"); 
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");



    res.render("listings/edit.ejs", { listing , originalImageUrl});
};


// UPDATE ROUTE 
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};



//DELETE listing             destroy listing 

module.exports.destroyListing = async(req,res)=>{
    let { id } = req.params;

    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log("deleteListing");
    req.flash("success","listing Deleted :( !!"); // add kela this line 
    res.redirect("/listings");
};