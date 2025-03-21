document.addEventListener('DOMContentLoaded', function() {
  // First remove any existing click handlers to prevent duplicates
  $('[stripe="account"]').off("click");
  
  // Listen for clicks on any element with stripe="account" attribute
  $('[stripe="account"]').on("click", function() {
    // Store reference to the clicked element
    const clickedButton = $(this);
    
    // Show loading state on the clicked element
    const originalText = clickedButton.text();
    clickedButton.text("Loading...").prop('disabled', true);
    
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
        // Reset the button that was clicked to its original state
        clickedButton.text(originalText).prop('disabled', false);
      }
    });
  });
});

