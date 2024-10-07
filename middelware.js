const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema");

module.exports.isLoggedIn = (req, resp, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "you must be logged in to create listing!");
    return resp.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, resp, next) => {
  if (req.session.redirectUrl) {
    resp.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, resp, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner.equals(resp.locals.currUser._id)) {
    req.flash("error", "You are not the owner of this listing!");
    return resp.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.ValidateListing = (req, resp, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.ValidateReview = (req, resp, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, resp, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(resp.locals.currUser._id)) {
    req.flash("error", "You are not the owner of this listing!");
    return resp.redirect(`/listings/${id}`);
  }
  next();
};
