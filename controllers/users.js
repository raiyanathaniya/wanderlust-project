const User = require("../models/user.js");

module.exports.renderSignupForm = (req, resp) => {
  resp.render("users/signup.ejs");
};

module.exports.signup = async (req, resp) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registerdUser = await User.register(newUser, password);
    // console.log(registerdUser);
    req.login(registerdUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome To Wanderlust");
      resp.redirect("/listings");
    });
  } catch (error) {
    req.flash("error", error.message);
    resp.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, resp) => {
  resp.render("users/login.ejs");
};

module.exports.login = async (req, resp) => {
  req.flash("success", "Wlcome back to Wanderlust");
  let redirectUrl = resp.locals.redirectUrl || "/listings";
  resp.redirect(redirectUrl);
};

module.exports.logout = (req, resp, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "you are logged out!");
    resp.redirect("/listings");
  });
};
