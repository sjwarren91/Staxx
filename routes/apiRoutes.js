var db = require("../models");

module.exports = function(app) {
  // Get all examples
  app.get("/api/examples", function(req, res) {
    db.Example.findAll({}).then(function(dbExamples) {
      res.json(dbExamples);
    });
  });

  // Create a new example
  app.post("/api/examples", function(req, res) {
    db.Example.create(req.body).then(function(dbExample) {
      res.json(dbExample);
    });
  });

  // Set goal
  app.post("/setgoal", function(req, res) {
    console.log(req.body);
    db.User.update(req.body, {
      where: {
        id: req.user.id
      }
    }).then(function(data) {
      // Not sure if this is the best way to do this
      if (data) {
        res.redirect("dashboard");
      }
    });
  });

  // Delete an example by id
  app.delete("/api/examples/:id", function(req, res) {
    db.Example.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(dbExample) {
      res.json(dbExample);
    });
  });
};
