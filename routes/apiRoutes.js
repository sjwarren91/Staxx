var db = require("../models");

module.exports = function(app) {
  // Get all expenses for user
  app.get("/expenses", function(req, res) {
    db.Expense.findAll({
      where: {
        UserId: req.user.id
      },
      include: [db.User] //unsure if this is necessary
    }).then(function(data) {
      console.log(data);
      res.json(data);
    });
  });

  // Get all expenses for user and join on category
  app.get("/expenseChart", function(req, res) {
    db.Expense.findAll({
      attributes: [
        "category",
        [db.sequelize.fn("sum", db.sequelize.col("amount")), "total"]
      ],
      group: "category",
      order: [["category"]],
      where: {
        UserId: req.user.id // "1" for test, need to replace with req.user.id
      }
    }).then(function(data) {
      res.json(data);
    });
  });

  // Get all User transactions
  app.get("/userexps", function(req, res) {
    db.Expense.findAll({
      where: {
        UserId: req.user.id
      }
    }).then(function(data) {
      var render = [];
      data.forEach(function(element) {
        element.dataValues.amount /= 100;
        render.push(element.dataValues);
      });
      console.log(render);
      res.render("expenses", { transactions: render, layout: false });
    });
  });

  // Create a new expense
  app.post("/expenses", function(req, res) {
    db.Expense.create({
      name: req.body.name,
      amount: req.body.amount,
      category: req.body.category,
      UserId: req.user.id // for test, needs to be replaced with req.user.id
    }).then(function(data) {
      res.json(data);
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
};
