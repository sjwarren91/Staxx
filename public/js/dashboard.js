//Hamburger Menu Function

$(document).ready(function() {
  $("#nav-icon1,#nav-icon2,#nav-icon3,#nav-icon4").click(function() {
    $(this).toggleClass("open");
    $("div.menu").toggleClass("menu-clicked");
  });
});
