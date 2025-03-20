document.addEventListener('DOMContentLoaded', function() {
//updated
    // Listen for clicks on the manage subscription button
    $("#manage-subscription").click(function() {
      // Show loading state
      $(this).text("Loading...").prop('disabled', true);
      
      // Call your Xano endpoint to get a portal session URL
      $.ajax({
        url: "https://xxdy-xbul-g3ez.n7d.xano.io/api:RjbKSLFK/launch_stripe_customer_portal",
        type: "GET",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem('authToken')
        },
        success: function(response) {
          window.location.href = response;
        },
        error: function(xhr, status, error) {
          console.error("Error:", error);
          alert("There was an error accessing subscription management.");
          $("#manage-subscription").text("Manage Subscription").prop('disabled', false);
        }
      });
    });

  });


