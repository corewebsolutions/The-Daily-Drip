document.addEventListener('DOMContentLoaded', function() {
    // Handle form submission
    $("#sign-up-form").submit(function(e) {
      e.preventDefault(); // Prevent default form submission
      
      // Show loading state
      $(".submit-button").val("Processing...").prop('disabled', true);
      
      // Check if non-US option is selected
      const isNonUS = $("#check-for-usa").is(":checked");
      
      // Collect form data
      const formData = {
        first_name: $("#first-name-2").val(),
        last_name: $("#last-name-2").val(),
        company_name: $("#company-name").val(),
        industry: $("#industry").val(),
        self_employed: $("#self-employed").val(),
        years_practicing: $("#years-practicing").val(),
        email: $("#email-3").val(),
        password: $("#password-signup").val(),
        
        // Handle city/state based on US or non-US
        city: isNonUS ? $("#city-global").val() : $("#city").val(),
        state: isNonUS ? $("#country-global").val() : $("#state").val()
      };
      
      // Send data to create subscriber API endpoint
      $.ajax({
        url: "https://xxdy-xbul-g3ez.n7d.xano.io/api:RjbKSLFK/create_subscriber",
        type: "POST",
        data: JSON.stringify(formData),
        contentType: "application/json",
        success: function(response) {
          // Store auth token and user info if provided in response
          if (response.authToken) {
            localStorage.setItem("authToken", response.authToken);
          }
          
          if (response.user_info) {
            localStorage.setItem("memberType", "Subscriber");
            localStorage.setItem("status", "active");
            localStorage.setItem("firstName", response.user_info.first_name || formData.first_name);
            localStorage.setItem("lastName", response.user_info.last_name || formData.last_name);
            localStorage.setItem("email", response.user_info.email || formData.email);
          }
          
          // Redirect to success page or dashboard
          window.location.href = "/sign-up-confirmation";
        },
        error: function(xhr, status, error) {
          // Show error message
          console.error("Error:", error);
          console.error("Response:", xhr.responseText);
          
          // Display error to user
          $("#alert").text("There was an error creating your account. Please try again.").css({
            "opacity": "1",
            "pointer-events": "auto"
          });
          
          // Reset button
          $(".submit-button").val("Join Our Community").prop('disabled', false);
        }
      });
    });
    
    // Optional: Also handle the final "Create Account" button click
    $("input.next-button.fall-back").click(function() {
      $("#sign-up-form").submit();
    });
  });