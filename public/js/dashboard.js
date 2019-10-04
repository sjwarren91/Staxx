//Hamburger Menu Function
$(document).ready(function() {
  $("#nav-icon1,#nav-icon2,#nav-icon3,#nav-icon4").click(function() {
    $(this).toggleClass("open");
    $("div.menu").toggleClass("menu-clicked");
    $("#header-menu").toggleClass("header-menu-clicked");
  });
  getChart();
  getTransactions();
  getSpendings();
  checkGoal();
});

$(".allTransactions").on("click", function(event) {
  event.preventDefault();
  $("#transactionsPanel").toggleClass("transactionsPanel-clicked");
});

$("#logout").on("click", function() {
  $.ajax("logout", {
    method: "GET"
  }).then(function() {
    console.log("Logged out");
    window.location.href = "/dashboard";
  });
});

// Chart
var expChart = new Chart(document.getElementById("doughnut-chart"), {
  type: "doughnut",
  data: {
    labels: [],
    datasets: [
      {
        label: "Spending",
        backgroundColor: [
          "#0a998b",
          "#2c2e47",
          "#ffff7a",
          "#ff9b6c",
          "#ea4651"
        ],
        data: [], // the data array goes here
        borderColor: "##eee",
        borderWidth: 1
      }
    ]
  },
  options: {
    title: {
      display: true,
      text: "Your Spending",
      fontColor: "#01c46f",
      fontSize: 14
    },
    legend: {
      display: true,
      position: "top",
      fontSize: 13,
      labels: {
        fontColor: "white"
      }
    }
  }
});

// function for updating chart
function updateChart(chart, data) {
  chart.data.labels = [];
  chart.data.datasets[0].data = [];
  data.forEach(function(ctg) {
    chart.data.labels.push(ctg.category);
    chart.data.datasets[0].data.push(ctg.total);
  });
  chart.update();
}

// function for getting the chart
function getChart() {
  $.ajax("expenseChart", {
    method: "GET"
  }).then(function(data) {
    data.forEach(function(cat) {
      cat.total /= 100;
    });
    updateChart(expChart, data);
  });
}

// function for getting all transactions
function getTransactions() {
  $.ajax("expenses", {
    method: "GET"
  }).then(function(data) {
    $("#transactionsPanel").html(data);
  });
}

// function for checking if goal is set
function checkGoal() {
  $.ajax("goal", {
    method: "GET"
  }).then(function(data) {
    var goal = data[0].goal / 100;
    if (goal === 0) {
      $("#myModal").css("display", "block");
    } else {
      $(".remaining-span").text("$" + goal);
      $("#goal-limit").text("$" + goal);
      $("#percent").text("You have spent %0 of your goal.");
    }
  });
}

// function for updating goal field - expenses
function getSpendings() {
  $.ajax("spent", {
    method: "GET"
  }).then(function(data) {
    if (data.length > 0) {
      var newGoal = (data[0].User.goal - parseInt(data[0].total)) / 100;
      var percent = (parseInt(data[0].total) / data[0].User.goal) * 100;
      var sign = "";
      if (newGoal < 0) {
        sign = "-";
        newGoal = newGoal * -1;
      }
      $("#bar").css("width", 100 - percent + "%");
      $(".remaining-span").text(sign + "$" + newGoal.toFixed(2));
      $("#goal-limit").text("$" + data[0].User.goal / 100);
      $("#percent").text(
        "You have spent %" + percent.toFixed(2) + " of your goal."
      );
    }
  });
}

// Getting the transaction values, minus the $ sign and the commas

$("input[data-type='currency']").on({
  keyup: function() {
    formatCurrency($(this));
  },
  blur: function() {
    formatCurrency($(this), "blur");
  }
});

function formatNumber(n) {
  return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

var transactionArray = [];

function formatCurrency(input, blur) {
  var inputVal = input.val();

  transactionArray.push(inputVal); // pushes current val of input to transactionArray

  // don't validate empty input
  if (inputVal === "") {
    return;
  }
  var originalLen = inputVal.length;
  var caretPos = input.prop("selectionStart");

  if (inputVal.indexOf(".") >= 0) {
    var decimalPos = inputVal.indexOf(".");
    var leftSide = inputVal.substring(0, decimalPos);
    var rightSide = inputVal.substring(decimalPos);
    leftSide = formatNumber(leftSide);

    rightSide = formatNumber(rightSide);

    if (blur === "blur") {
      rightSide += "00";
    }

    rightSide = rightSide.substring(0, 2);
    inputVal = "$" + leftSide + "." + rightSide;
  } else {
    inputVal = formatNumber(inputVal);
    inputVal = "$" + inputVal;
    if (blur === "blur") {
      inputVal += ".00";
    }
  }

  input.val(inputVal);

  var updatedLen = inputVal.length;
  caretPos = updatedLen - originalLen + caretPos;
  input[0].setSelectionRange(caretPos, caretPos);
}

$("#paymentSubmit").on("click", function(event) {
  event.preventDefault();

  if ($("#category option:selected").text() === "Category") {
    alert("Please select an expense category.");
    return;
  }

  if (transactionArray.length > 0) {
    var amount = transactionArray[transactionArray.length - 1];
    amount = amount.replace(/[$,]/g, "");
    amount = amount * 100;
  } else {
    alert("Please enter transaction value.");
    $("#currency-field").val("");
    return;
  }
  $("#currency-field").val("");
  //$("#category").text("Category");

  var expense = {
    name: "new expense",
    amount: amount,
    category: $("#category option:selected").text()
  };

  $.ajax("/expenses", {
    method: "POST",
    data: expense
  }).then(function() {
    getSpendings();
    getChart();
    getTransactions();
  });
});

var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];

span.onclick = function() {
  modal.style.display = "none";
};

window.onclick = function(event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

$("#setGoal").on("click", function() {
  modal.style.display = "block";
});

$("#setGoalBtn").on("click", function(event) {
  event.preventDefault();
  // modal.style.display = "none";
  $("#myModal").css("display", "none");
  var goal = $("#set-goal").val();
  $("#set-goal").val("");

  if (goal < 0.01) {
    alert("Please set a goal greater than 1c");
    return;
  }
  var post = { goal: goal * 100 };
  $.ajax("goal", {
    method: "POST",
    data: post
  }).then(function() {
    $(".remaining-span").text("$" + goal);
    $("#goal-limit").text("$" + goal);
    $("#percent").text("You have spent %0 of your goal.");
    getSpendings();
  });
});
