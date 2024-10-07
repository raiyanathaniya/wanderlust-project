const express = require("express");
const app = express();
const session = require("express-session");

const sessionOption = {
  secret: "mysupersecrate",
  resave: false,
  saveUninitialized: true,
};
app.use(session(sessionOption));

app.get("/register", (req, resp) => {
  let { name = "anonymous" } = req.query;
  req.session.name = name;
  resp.redirect("/hello");
});

app.get("/hello", (req, resp) => {
  resp.send(`hello, ${req.session.name}`);
});

// app.get("/reqcount", (req, resp) => {
//   if (req.session.count) {
//     req.session.count++;
//   } else {
//     req.session.count = 1;
//   }
//   resp.send(`you sent a request ${req.session.count} time`);
// });

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
