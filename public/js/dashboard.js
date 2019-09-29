//Hamburger Menu Function

$(document).ready(function() {
  $("#nav-icon1,#nav-icon2,#nav-icon3,#nav-icon4").click(function() {
    $(this).toggleClass("open");
    $("div.menu").toggleClass("menu-clicked");
  });
});

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
        data: dataArray, // the data
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
