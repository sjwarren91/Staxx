$(document).ready(function() {
  // Animation functions for documant.ready

  function logoFade() {
    $("#staxx-logo")
      .fadeIn(1500)
      .animate(
        {
          width: "100px",
          top: "35px",
          left: "80px"
        },
        400
      );
  }

  function panelFade() {
    setTimeout(function() {
      $(".signup").animate(
        {
          height: "350px",
          padding: "30px"
        },
        800
      );
    }, 1700);
  }

  logoFade();
  panelFade();

  //On click functions to animate between sign in and create account

  var accountAssumed = true;

  $("#create-popup").on("click", function() {
    if (accountAssumed) {
      newAccount();
    } else {
      signInPage();
    }
  });

  function newAccount() {
    accountAssumed = false;
    $(".form-group3").animate(
      {
        height: "75px",
        margin: "15px 0 0"
      },
      500
    );
    $(".signup").animate(
      {
        height: "433px"
      },
      500
    );
    $("h2").html("// New Account");
    $(".submit-btn")
      .html("Create Account")
      .attr("data_state", "create-acc");
    $("#create-popup").html("Back to Sign In");
  }

  function signInPage() {
    accountAssumed = true;
    $(".form-group3").animate(
      {
        height: "0px",
        margin: "0 0 0"
      },
      500
    );
    $(".signup").animate(
      {
        height: "345px"
      },
      500
    );
    $("h2").html("// Sign In");
    $(".submit-btn")
      .html("Sign In")
      .attr("data_state", "sign-in");
    $("#create-popup").html("Create an account");
  }

  // function to prevent spaces being used in username and password inputs
  $("input").on("keypress", function(e) {
    if (e.which === 32) {
      return false;
    }
  });

  // On click function for submit button - data state is "sign-in" while values are for sign in,
  // and data state is "creat-acc" when the values are for creating a new account, this is stored in
  // formState variable.

  $(".submit-btn").on("click", function(event) {
    event.preventDefault();

    var userName = $("#username")
      .val()
      .trim();
    var password = $("#userpassword").val();

    var confirmPassword = $("#confirmpassword").val();

    // var formState = $(this).attr("data_state");

    if (userName === "" || confirmPassword === "" || password === "") {
      alert("More details needed");
      return;
    } else if (password !== confirmPassword && confirmPassword !== "") {
      alert("Passwords must match");
      $("#userpassword").val("");
      $("#confirmpassword").val("");
      return;
    }
    // GET request for existing users signing in

    // POST request for New users creating account
  });
});
