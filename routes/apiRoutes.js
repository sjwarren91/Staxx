var db = require("../models");
var moment = require("moment");
var Op = db.Sequelize.Op;
module.exports = function(app) {
  // Get all User transactions
  app.get("/expenses", function(req, res) {
    //Select Environment (test or production)
    var uid;
    if (process.env.NODE_ENV === "test") {
      uid = req.query.user_id;
    } else {
      uid = req.user.id;
    }
    db.Expense.findAll({
      where: {
        UserId: uid,
        createdAt: {
          [Op.between]: [moment().startOf("week"), moment().endOf("week")]
        }
      }
    }).then(function(data) {
      var render = [];
      data.forEach(function(element) {
        element.dataValues.amount /= 100;
        element.dataValues.createdAt = moment(
          element.dataValues.createdAt
        ).format("HH:mm, ddd Do MMM");
        render.push(element.dataValues);
      });
      res.render("expenses", { transactions: render, layout: false });
    });
  });

  // Get all expenses for user and join on category
  app.get("/expenseChart", function(req, res) {
    //Select Environment (test or production)
    var uid;
    if (process.env.NODE_ENV === "test") {
      uid = req.query.user_id;
    } else {
      uid = req.user.id;
    }
    db.Expense.findAll({
      attributes: [
        "category",
        [db.sequelize.fn("sum", db.sequelize.col("amount")), "total"]
      ],
      group: "category",
      order: [["category"]],
      where: {
        UserId: uid,
        createdAt: {
          [Op.between]: [moment().startOf("week"), moment().endOf("week")]
        }
      }
    }).then(function(data) {
      res.json(data);
    });
  });

  // Create a new expense
  app.post("/expenses", function(req, res) {
    //Select Environment (test or production)
    var uid;
    if (process.env.NODE_ENV === "test") {
      uid = req.query.user_id;
    } else {
      uid = req.user.id;
    }
    db.Expense.create({
      name: req.body.name,
      amount: req.body.amount,
      category: req.body.category,
      UserId: uid
    }).then(function(data) {
      res.json(data);
    });
  });

  // Set goal
  app.post("/goal", function(req, res) {
    console.log(req.body);
    db.User.update(
      {
        goal: req.body.goal
      },
      {
        where: {
          id: req.user.id
        }
      }
    ).then(function(data) {
      // Not sure if this is the best way to do this
      res.json(data);
    });
  });

  // Get goal
  app.get("/goal", function(req, res) {
    db.Expense.findAll({
      attributes: [
        [db.sequelize.fn("sum", db.sequelize.col("amount")), "total"]
      ],
      group: "category",
      where: {
        UserId: req.user.id
      },
      include: [{ model: db.User, attributes: ["goal"] }]
    }).then(function(data) {
      res.json(data);
    });
  });
};
