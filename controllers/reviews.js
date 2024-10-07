const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async (req, resp) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  listing.reviews.push(newReview);
  console.log(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success", "New Review Created!");
  resp.redirect(`/listings/${listing.id}`);
};

module.exports.destroyReview = async (req, resp) => {
  let { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findOneAndDelete(reviewId);
  req.flash("success", " Review Deleted!");
  resp.redirect(`/listings/${id}`);
};
