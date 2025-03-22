document.addEventListener('DOMContentLoaded', function() {

    // Extract the 'q' parameter from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const resetToken = urlParams.get('q');
    
    // Check if token exists
    if (!resetToken) {
        // Show error if no token is present
        alert("Invalid password reset link. Please request a new one.");
        // Optionally redirect to the reset request page
        // window.location.href = "/reset-password";
        return;
    }
    
    // Set up form submission handler
    $("#update-password").submit(function(e) {
        e.preventDefault();
        
        // Get passwords
        const password = $("#password").val();

        // Reference to submit button
        const submitButton = $("#submit-button");
        const originalButtonText = submitButton.text();
        
        // Update button state
        submitButton.text("Updating...").prop("disabled", true);
        
        // Prepare data
        const data = {
            cid: resetToken,  // Send the token as 'cid'
            password: password // Send the new password
        };
        
        // Make AJAX request
        $.ajax({
            url: "https://xxdy-xbul-g3ez.n7d.xano.io/api:QpSbC3Ej/update_password",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function(response) {
                // Show success message
                alert("Your password has been successfully updated.");
                
                // Redirect to login page
                window.location.href = "/welcome-back";
            },
            error: function(xhr, status, error) {
                // Handle error
                let errorMessage = "An error occurred. Please try again.";
                
                if (xhr.responseJSON && xhr.responseJSON.message) {
                    errorMessage = xhr.responseJSON.message;
                }
                
                // Show error
                $("#password-error").text(errorMessage).show();
                console.error("Error details:", xhr.responseText);
            },
            complete: function() {
                // Reset button state
                submitButton.text(originalButtonText).prop("disabled", false);
            }
        });
    });
    

});