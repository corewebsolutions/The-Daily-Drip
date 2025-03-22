document.addEventListener('DOMContentLoaded', function() {

    // Function to populate form fields
    function populateFormFields(userData) {
        // Text inputs
        $("#First-Name-2").val(userData.first_name);
        $("#Last-Name-2").val(userData.last_name);
        $("#Company-Name-2").val(userData.company_name);
        $("#City-2").val(userData.city);
        $("#Email-2").val(userData.email);
        
        // Dropdown selects - need to set the right option
        $("#Industry-2").val(userData.industry);
        $("#Self-Employed-2").val(userData.self_employed);
        $("#Years-Practicing-2").val(userData.years_practicing);
        $("#State-2").val(userData.state);
        
        // Don't populate password field for security reasons
    }
    
    // Function to fetch user data
    function fetchUserData() {
        // Show loading state
        const submitButton = $("#update_profile-form input[type='submit']");
        submitButton.val("Loading profile...").prop('disabled', true);
        
        $.ajax({
            url: "https://xxdy-xbul-g3ez.n7d.xano.io/api:RjbKSLFK/get_user",
            type: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('authToken')
            },
            success: function(response) {
                // Populate form with user data
                populateFormFields(response);
                
                // Reset button
                submitButton.val("Update Profile").prop('disabled', false);
            },
            error: function(xhr, status, error) {
                console.error("Error fetching user data:", error);
                console.error("Response:", xhr.responseText);
                
                // Show error message
                alert("Could not load your profile. Please try again later.");
                
                // Reset button
                submitButton.val("Update Profile").prop('disabled', false);
            }
        });
    }
    
    // Call the function when page loads
    fetchUserData();
    
    // Add submit handler for the form (for updating profile)
    $("#update_profile-form").submit(function(e) {
        e.preventDefault();
        
        // Show loading state
        const submitButton = $(this).find("input[type='submit']");
        submitButton.val("Updating...").prop('disabled', true);
        
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
            email: $("#Email-2").val()
        };
        
        // Only include password if it's not empty
        if ($("#Password-2").val().trim() !== "") {
            formData.password = $("#Password-2").val();
        }
        
        // Send update request (assuming you have an update endpoint)
        $.ajax({
            url: "https://xxdy-xbul-g3ez.n7d.xano.io/api:RjbKSLFK/update_profile",
            type: "POST",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('authToken')
            },
            data: JSON.stringify(formData),
            contentType: "application/json",
            success: function(response) {
                // Show success message
                alert("Profile updated successfully!");
                
                // Reset button
                submitButton.val("Update Profile").prop('disabled', false);
                
                // Update local storage if needed
                localStorage.setItem("firstName", formData.first_name);
                localStorage.setItem("lastName", formData.last_name);
                localStorage.setItem("email", formData.email);
            },
            error: function(xhr, status, error) {
                console.error("Error updating profile:", error);
                console.error("Response:", xhr.responseText);
                
                // Show error message
                alert("Could not update your profile. Please try again later.");
                
                // Reset button
                submitButton.val("Update Profile").prop('disabled', false);
            }
        });
    });
});