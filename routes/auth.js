module.exports = function(app, passport) {
  // route for creating a new user
  app.post(
    "/signup",
    passport.authenticate("local-signup", {
      successRedirect: "/dashboard",
      failureRedirect: "/"
    })
  );

  // route for signing in
  app.post(
    "/signin",
    passport.authenticate("local-signin", {
      successRedirect: "/dashboard",
      failureRedirect: "/"
    })
  );

  // route for sending logged in user to dashboard, using the isLoggedIn middleware
  app.get("/dashboard", isLoggedIn, function(req, res) {
    // the current user in the session can be found in the following object
    // console.log(req.user);
    res.render("dashboard");
  });

  // route for destroying the current session and logging the user out
  app.get("/logout", function(req, res) {
    req.session.destroy(function(err) {
      if (err) {
        throw err;
      }
      res.redirect("/");
    });
  });

  // middleware handle if a user is logged in or not
  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/");
  }
};