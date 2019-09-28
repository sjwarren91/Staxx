module.exports = function(app, passport) {
  app.post(
    "/signup",
    passport.authenticate("local-signup", {
      successRedirect: "/dashboard",
      failureRedirect: "/"
    })
  );

  app.post(
    "/signin",
    passport.authenticate("local-signin", {
      successRedirect: "/dashboard",
      failureRedirect: "/"
    })
  );

  app.get("/dashboard", isLoggedIn, function(req, res) {
    res.render("dashboard");
  });

  app.get("/logout", function(req, res) {
    req.session.destroy(function(err) {
      if (err) throw err;
      res.redirect("/");
    });
  });

  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/");
  }
};
