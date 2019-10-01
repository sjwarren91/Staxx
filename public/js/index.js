$(document).ready(function() {
  // Animation functions for documant.ready

  function logoFade() {
    $("#staxx-logo")
      .fadeIn(1600)
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
    $(".first-last").animate(
      {
        height: "70px"
      },
      500
    );
    $(".avatars").animate(
      {
        height: "100px",
        margin: "15px 0 0"
      },
      500
    );
    $(".signup").animate(
      {
        height: "605px"
      },
      500
    );
    $("#passwordlabel").html("Create Password");
    $("#userpassword").attr("placeholder", "New Password");
    $("h2").html("//  New Account");
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
    $(".first-last").animate(
      {
        height: "0px"
      },
      500
    );
    $(".avatars").animate(
      {
        height: "0px"
      },
      500
    );
    $(".signup").animate(
      {
        height: "350px"
      },
      500
    );
    $("#passwordlabel").html("Password");
    $("#userpassword").attr("placeholder", "Enter Password");
    $("h2").html("//  Sign In");
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

  // Avatar highlight on selection
  $(".av-img").on("click", function() {
    $(".selected").removeClass("selected");
    $(this).addClass("selected");
  });

  // On click function for submit button - data state is "sign-in" while values are for sign in,
  // and data state is "creat-acc" when the values are for creating a new account, this is stored in
  // formState variable.

  $(".submit-btn").on("click", function(event) {
    event.preventDefault();

    var email = $("#email")
      .val()
      .trim();
    var password = $("#userpassword").val();

    var firstName = $("#firstname")
      .val()
      .trim();
    var lastName = $("#lastname")
      .val()
      .trim();
    var confirmPassword = $("#confirmpassword").val();

    var avatarId = $(".selected").attr("id");

    var formState = $(this).attr("data_state");

    console.log(formState);

    if (formState === "sign-in") {
      if (email === "" || password === "") {
        alert("More details needed");
        return;
      }
    } else if (
      confirmPassword === "" ||
      email === "" ||
      password === "" ||
      firstName === "" ||
      lastName === ""
    ) {
      alert("More details needed");
      return;
    } else if (!avatarId) {
      alert("Must Choose an Avatar");
      return;
    } else if (
      formState === "create-acc" &&
      password !== confirmPassword &&
      confirmPassword !== ""
    ) {
      alert("Passwords must match");
      $("#userpassword").val("");
      $("#confirmpassword").val("");
      return;
    } else if (password.length > 16) {
      alert("Password is too long (Max 16 Characters)");
      return;
    }

    if (formState === "sign-in") {
      var data = {
        email: email,
        password: password
      };
      var requestURL = "/signin";
    } else {
      var data = {
        firstname: firstName,
        lastname: lastName,
        email: email,
        password: password,
        avatar: avatarId
      };
      var requestURL = "/signup";
    }

    console.log("data:", data);
    console.log("request:", requestURL);

    // POST request for New or existing users creating accounts
    $.ajax(requestURL, {
      method: "POST",
      data: data
    }).then(function() {
      window.location.href = "/dashboard";
      console.log("Signed in");
    });

    // GET request for existing users signing in
  });
});
