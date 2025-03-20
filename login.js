const baseUrl = "https://xxdy-xbul-g3ez.n7d.xano.io";


// Handle form submission
$("#email-form").submit(function (event) {

  // Prevent the default form submission behavior
  event.preventDefault();

  // Change the text of the submit button
  $(this).find('input[type="submit"]').val("Logging You In...");

  // Disable pointer events for the submit button
  $(this).find('input[type="submit"]').css("pointer-events", "none");

  // Create an object to store form data
  const formData = {};

  // Iterate through form inputs and collect key-value pairs
  $(this)
    .find("input, select, textarea")
    .each(function () {
      const input = $(this);
      formData[input.attr("id")] = input.val();
    });

  // Make an login AJAX POST request
  $.ajax({
    url: baseUrl + "api:2yadJ61L/auth/login",
    type: "POST",
    data: formData,
    success: function (response) {

      /* Set Local Storage Data */
      localStorage.setItem('baseUrl',baseUrl);
      localStorage.setItem("authToken", response.authToken);
      localStorage.setItem("memberType", response.user_info.member_type);
      localStorage.setItem("status", response.user_info.status);
      localStorage.setItem("firstName", response.user_info.first_name);
      localStorage.setItem("lastName", response.user_info.last_name);
      localStorage.setItem("email", response.user_info.email);     
        
    },
    error: function (error) {
      // show error block
      $(".form__error-block").css("display", "block");
      // Change the text of the submit button
      $("#login-form").find('input[type="submit"]').val("Log In");
      $("#login-form").find('input[type="submit"]').css("pointer-events", "auto");
    }
  });
});
