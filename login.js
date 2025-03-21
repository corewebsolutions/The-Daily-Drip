document.addEventListener('DOMContentLoaded', function() {

    $("#login-form").submit(function (event) {
        // Prevent the default form submission behavior
        event.preventDefault();
    
        // Change the text of the submit button
        $(this).find('button[type="submit"]').text("Logging You In...");
    
        // Disable pointer events for the submit button
        $(this).find('button[type="submit"]').css("pointer-events", "none");
    
        // Get values directly from the specific form fields
        const formData = {
        "email": $("#login-email").val(), // Using the actual ID from your form
        "password": $("#login-password").val()
        };
    
        // Make an login AJAX POST request
        $.ajax({
        url: "https://xxdy-xbul-g3ez.n7d.xano.io/api:QpSbC3Ej/auth/login",
        type: "POST",
        data: formData,
        success: function (response) {
            /* Set Local Storage Data */
            localStorage.setItem('baseUrl', baseUrl);
            localStorage.setItem("authToken", response.authToken);
            localStorage.setItem("memberType", response.user_info.member_type);
            localStorage.setItem("status", response.user_info.status);
            localStorage.setItem("firstName", response.user_info.first_name);
            localStorage.setItem("lastName", response.user_info.last_name);
            localStorage.setItem("email", response.user_info.email);  
            window.location.href = "/welcome-back"; // Redirect to page they were last on 
        },
        error: function (error) {
            // show error block
            alert('Invalid username or password. Please try again.');
            // Reset the button
            $(this).find('button[type="submit"]').text("Sign In");
            $(this).find('button[type="submit"]').css("pointer-events", "auto");
        }
        });
    });

});