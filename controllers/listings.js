const Listing = require("../models/listing");

module.exports.index = async (req, resp) => {
  const allListings = await Listing.find({});
  resp.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, resp) => {
  resp.render("listings/new.ejs");
};

module.exports.showListing = async (req, resp) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  console.log(listing.owner.username);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    resp.redirect("/listings");
  }
  return resp.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, resp, next) => {
  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "New Listing Created!");
  resp.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }

  // Get the original image URL
  let OriginalImageUrl = listing.image.url;

  // Log the original URL for debugging
  // console.log("Original Image URL:", OriginalImageUrl);

  // Modify the URL to include Cloudinary transformation for resizing
  OriginalImageUrl = OriginalImageUrl.replace("/upload", "/upload/w_300,h_250");

  // Log the modified URL to ensure it was transformed correctly
  // console.log("Modified Image URL:", OriginalImageUrl);

  // Render the form with the modified image URL
  res.render("listings/edit.ejs", { listing, OriginalImageUrl });
};

module.exports.updateListing = async (req, resp) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing Updated!");
  resp.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, resp) => {
  let { id } = req.params;
  let deletedListings = await Listing.findByIdAndDelete(id);
  console.log(deletedListings);
  req.flash("success", "Listing Deleted!");
  resp.redirect("/listings");
};
