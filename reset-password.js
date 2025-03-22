document.addEventListener('DOMContentLoaded', function() {
    // Add submit event handler to the form
    $("#password-reset-form").submit(function(e) {
        // Prevent default form submission
        e.preventDefault();
        
        // Get the email value
        const email = $("#email").val();
        
        // Reference to the submit button
        const submitButton = $("#submit-button");
        
        // Store original button text
        const originalButtonText = submitButton.text();
        
        // Update button to show loading state
        submitButton.text("Sending...").prop("disabled", true);
        
        // Make AJAX request to the endpoint
        $.ajax({
            url: "https://xxdy-xbul-g3ez.n7d.xano.io/api:QpSbC3Ej/reset_password",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({ email: email }),
            success: function(response) {
                // Show success message
                alert("Password reset link have been sent to your email. Please check your spam folder if you do not see it.");
                
                // Clear the form
                $("#password-reset-form")[0].reset();
            },
            error: function(xhr, status, error) {
                // Show error message
                if (xhr.responseJSON && xhr.responseJSON.message) {
                    alert("Error: " + xhr.responseJSON.message);
                } else {
                    alert("An error occurred. Please try again later.");
                }
                console.error("Error details:", xhr.responseText);
            },
            complete: function() {
                // Reset button state regardless of success or failure
                submitButton.text(originalButtonText).prop("disabled", false);
            }
        });
    });
});