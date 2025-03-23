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

                /* Set Local Storage Data */
                localStorage.setItem("authToken", response.authToken);
                localStorage.setItem("memberType", response.user_info.member_type);
                localStorage.setItem("status", response.user_info.status);
                localStorage.setItem("firstName", response.user_info.first_name);
                localStorage.setItem("lastName", response.user_info.last_name);
                localStorage.setItem("email", response.user_info.email);
                
                // Redirect to login page
                window.location.href = "/updating-account";

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