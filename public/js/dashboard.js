//Hamburger Menu Function
$(document).ready(function() {
  $("#nav-icon1,#nav-icon2,#nav-icon3,#nav-icon4").click(function() {
    $(this).toggleClass("open");
    $("div.menu").toggleClass("menu-clicked");
    $("#header-menu").toggleClass("header-menu-clicked");
  });
});

$(".allTransactions").on("click", function(event) {
  event.preventDefault();
  $("#transactionsPanel").toggleClass("transactionsPanel-clicked");
});

// Chart
new Chart(document.getElementById("doughnut-chart"), {
  type: "doughnut",
  data: {
    labels: ["Food", "Drink", "Clothing", "Treats", "Drugs"],
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
        data: dataArray, // the data array goes here
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

  if (transactionArray.length > 0) {
    var amount = transactionArray[transactionArray.length - 1];
    amount = amount.replace(/[$,]/g, "");
  } else {
    return;
  }

  console.log(amount);

  //amount is the value of the trasnaction with $ and commas removed.
});
