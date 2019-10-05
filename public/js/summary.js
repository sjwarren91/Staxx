$(document).ready(function() {
  new Chart(document.getElementById("line-chart"), {
    type: "line",
    data: {
      labels: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ],
      datasets: [
        {
          label: "",
          backgroundColor: "#00b0646c",
          data: [500, 430, 600, 440, 500],
          borderColor: "#00b0646c",
          borderWidth: 3,
          fill: "none",
          pointBackgroundColor: "#00b064",
          pointBorderColor: "#00b064"
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: "Summary",
        fontColor: "#01c46f",
        fontSize: 14
      },
      elements: {
        line: {
          tension: 0,
          borderWidth: "10px"
        }
      },
      legend: {
        display: true,
        position: "left",
        fontSize: 13,
        labels: {
          fontColor: "white"
        },
        scales: {
          yAxes: [
            {
              stacked: true
            }
          ]
        }
      }
    }
  });
});
