Copydocument.addEventListener('DOMContentLoaded', function() {

    // Listen for clicks on the manage subscription button
    $("#manage-subscription").click(function() {
      // Show loading state
      $(this).text("Loading...").prop('disabled', true);
      
      // Call your Xano endpoint to get a portal session URL
      $.ajax({
        url: "https://x8ki-letl-twmt.n7.xano.io/api:RjbKSLFK/launch_stripe_customer_portal",
        type: "GET",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem('authToken')
        },
        success: function(response) {
          if (response.success) {
            // Redirect to Stripe's portal
            window.location.href = response;
          } else {
            alert(response.message || "Unable to access subscription management.");
            $("#manage-subscription").text("Manage Subscription").prop('disabled', false);
          }
        },
        error: function(xhr, status, error) {
          console.error("Error:", error);
          alert("There was an error accessing subscription management.");
          $("#manage-subscription").text("Manage Subscription").prop('disabled', false);
        }
      });
    });

  });