//Hamburger Menu Function
$(document).ready(function() {
  $("#nav-icon1,#nav-icon2,#nav-icon3,#nav-icon4").click(function() {
    $(this).toggleClass("open");
    $("div.menu").toggleClass("menu-clicked");
    $("#header-menu").toggleClass("header-menu-clicked");
  });
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
  $.ajax("expenseChart/" + setTime, {
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
  $.ajax("expenses/" + setTime, {
    method: "GET"
  }).then(function(data) {
    $("#transactionsPanel").html(data);
    getChart();
  });
}

// function for checking if goal is set
function checkGoal() {
  $.ajax("goal", {
    method: "GET"
  }).then(function(data) {
    var goal = data[0].goal / 100;
    setTime = data[0].state;
    if (goal === 0) {
      $("#myModal").css("display", "block");
    } else {
      $(".remaining-span").text("$" + goal);
      $("#goal-limit").text("$" + goal);
      $("#percent").text("You have spent %0 of your goal.");
      getSpendings();
    }
  });
}

// function for updating goal field - expenses
function getSpendings() {
  $.ajax("spent/" + setTime, {
    method: "GET"
  }).then(function(data) {
    console.log(data);
    if (data.length > 0) {
      var newGoal = (data[0].User.goal - parseInt(data[0].total)) / 100;
      var percent = (parseInt(data[0].total) / data[0].User.goal) * 100;
      var sign = "";
      if (newGoal < 0) {
        sign = "-";
        newGoal = newGoal * -1;
      }

      var barLength = 100 - percent;

      if (barLength < 75 && barLength >= 50) {
        $("#bar")
          .css("background", "linear-gradient(#fcff15, #d2d40d)")
          .css("color", "#b0961a");
      } else if (barLength < 50 && barLength >= 25) {
        $("#bar")
          .css("background", "linear-gradient(#ff9a18, #ff8f00)")
          .css("color", "#9e5900");
      } else if (barLength < 25) {
        $("#bar")
          .css("background", "linear-gradient(#ff5b5b, #ff2626)")
          .css("color", "#931616");
      }

      $("#bar")
        .css("width", barLength + "%")
        .html(barLength.toFixed(0) + "%");
      $(".remaining-span").text(sign + "$" + newGoal.toFixed(2));
      $("#goal-limit").text("$" + data[0].User.goal / 100);
      $("#percent").text(
        "You have spent " + percent.toFixed(0) + "% of your goal."
      );
      getTransactions();
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
    checkGoal();
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

// click function for choosing a time block of either
// a week or month. stores the choise as global var 'setTime'
// default value is 'week'
var setTime = "week";

$(".setTime").on("click", function() {
  $(this).toggleClass("setTime-active");

  if ($(this).attr("id") === "week") {
    $("#month").toggleClass("setTime-active");
    setTime = "week";
  } else if ($(this).attr("id") === "month") {
    $("#week").toggleClass("setTime-active");
    setTime = "month";
  }
});

$("#setGoal").on("click", function() {
  console.log(setTime);
  modal.style.display = "block";
  $("#nav-icon1,#nav-icon2,#nav-icon3,#nav-icon4").toggleClass("open");
  $("div.menu").toggleClass("menu-clicked");
  $("#header-menu").toggleClass("header-menu-clicked");
});

$("#setGoalBtn").on("click", function(event) {
  event.preventDefault();
  $("#myModal").css("display", "none");
  var goal = $("#set-goal").val();
  $("#set-goal").val("");

  if (goal < 0.01) {
    alert("Please set a goal greater than 1c");
    return;
  }
  var post = { goal: goal * 100, state: setTime };
  $.ajax("goal", {
    method: "POST",
    data: post
  }).then(function() {
    $(".remaining-span").text("$" + goal);
    $("#goal-limit").text("$" + goal);
    $("#percent").text("You have spent %0 of your goal.");
    checkGoal();
  });
});
