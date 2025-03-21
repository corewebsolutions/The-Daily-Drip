document.addEventListener('DOMContentLoaded', function() {
    //updated
    $("#community-member-signup").submit(function(e) {
      e.preventDefault(); // Prevent default form submission
      
      // Show loading state
      const submitButton = $(this).find('input[type="submit"]');
      const originalButtonText = submitButton.val();
      submitButton.val("Processing...").prop('disabled', true);
      
      // Collect form data
      const formData = {
        first_name: $("#First-Name-2").val(),
        last_name: $("#Last-Name-2").val(),
        company_name: $("#Company-Name-2").val(),
        industry: $("#Industry-2").val(),
        self_employed: $("#Self-Employed-2").val(),
        years_practicing: $("#Years-Practicing-2").val(),
        city: $("#City-2").val(),
        state: $("#State-2").val(),
        email: $("#Email-2").val(),
        password: $("#Password-2").val()
      };
      
      // Send data to Xano to create temporary user and start Stripe checkout
      $.ajax({
        url: "https://xxdy-xbul-g3ez.n7d.xano.io/api:RjbKSLFK/create_community_member", // Replace with your actual endpoint
        type: "POST",
        data: JSON.stringify(formData),
        contentType: "application/json",
        success: function(response) {
            localStorage.setItem('authToken',response.authToken); // create authToken
            localStorage.setItem("memberType", response.user_info.member_type);
            localStorage.setItem("status", response.user_info.status);
            localStorage.setItem("firstName", response.user_info.first_name);
            localStorage.setItem("lastName", response.user_info.last_name);
            localStorage.setItem("email", response.user_info.email); 
            window.location.href = response.checkoutUrl; // Redirect to Stripe Checkout URL from Xano response              
        },
        error: function(xhr, status, error) {
          // Handle error
          console.error("Error:", error);
          alert("There was an error processing your request. Please try again.");
          submitButton.val(originalButtonText).prop('disabled', false);
        }
      });
    });
  });