// Wait for document ready
$(document).ready(function() {
  console.log("Document ready, setting up click handlers");
  
  // Log how many matching elements we find
  console.log("Found " + $('[stripe="account"]').length + " elements with stripe='account'");
  
  // Use event delegation to work with dynamically added elements
  $(document).on("click", '[stripe="account"]', function(e) {
    console.log("Element clicked:", this);
    e.preventDefault(); // Prevent default if it's a link
    
    // Store reference to the clicked element
    const clickedButton = $(this);
    
    // Show loading state on the clicked element
    const originalText = clickedButton.text();
    clickedButton.text("Loading...").prop('disabled', true);
    
    console.log("Making AJAX call to customer portal");
    
    // Call your Xano endpoint to get a portal session URL
    $.ajax({
      url: "https://xxdy-xbul-g3ez.n7d.xano.io/api:RjbKSLFK/launch_stripe_customer_portal",
      type: "GET",
      headers: {
        "Authorization": "Bearer " + localStorage.getItem('authToken')
      },
      success: function(response) {
        console.log("AJAX success, redirecting to:", response);
        window.location.href = response;
      },
      error: function(xhr, status, error) {
        console.error("AJAX Error:", error);
        console.error("Status:", status);
        console.error("Response:", xhr.responseText);
        
        alert("There was an error accessing subscription management.");
        // Reset the button that was clicked to its original state
        clickedButton.text(originalText).prop('disabled', false);
      }
    });
  });
  
  // Also add direct click handler as a fallback
  $('[stripe="account"]').on("click", function() {
    console.log("Direct click handler triggered");
  });
});