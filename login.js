document.addEventListener('DOMContentLoaded', function() {

    $("#login-form").submit(function (event) {
        // Prevent the default form submission behavior
        event.preventDefault();
    
        // Store reference to the form
        const form = this;
        
        // Get button reference
        const submitButton = $(form).find('button[type="submit"]');
        
        // Change the text of the submit button
        submitButton.text("Logging You In...");
    
        // Disable pointer events for the submit button
        submitButton.css("pointer-events", "none").prop('disabled', true);
    
        // Get values directly from the specific form fields
        const formData = {
            "email": $("#login-email").val(),
            "password": $("#login-password").val()
        };
    
        // Make an login AJAX POST request
        $.ajax({
            url: "https://xxdy-xbul-g3ez.n7d.xano.io/api:QpSbC3Ej/auth/login",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(formData), 
            data: formData,
            success: function (response) {
                /* Set Local Storage Data */
                localStorage.setItem("authToken", response.authToken);
                localStorage.setItem("memberType", response.user_info.member_type);
                localStorage.setItem("status", response.user_info.status);
                localStorage.setItem("firstName", response.user_info.first_name);
                localStorage.setItem("lastName", response.user_info.last_name);
                localStorage.setItem("email", response.user_info.email);  
                // ONLY redirect on success
                window.location.href = "/welcome-back";
            },
            error: function (xhr, status, error) {
                // Show error message
                alert('Invalid username or password. Please try again.');
                
                // Reset the form
                form.reset();
                
                // Reset the button state
                submitButton.text("Sign In");
                submitButton.css("pointer-events", "auto").prop('disabled', false);
                
                // Focus on the email field for easier retry
                $("#login-email").focus();
            }
        });
    });

    // login page 
$("#account-login-form").submit(function (event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Store reference to the form
    const form = this;

    // Get button reference
    const submitButton = $(form).find('button[type="submit"]');

    // Change the text of the submit button
    submitButton.text("Logging You In...");

    // Disable pointer events for the submit button
    submitButton.css("pointer-events", "none").prop('disabled', true);

    // Get values directly from the specific form fields
    const formData = {
        email: $("#login-email").val(),
        password: $("#login-password").val()
    };

    // Make a login AJAX POST request
    $.ajax({
        url: "https://xxdy-xbul-g3ez.n7d.xano.io/api:QpSbC3Ej/auth/login",
        type: "POST",
        contentType: "application/json",           // <-- THIS LINE IS ESSENTIAL
        data: JSON.stringify(formData),            // <-- AND THIS ONE TOO
        success: function (response) {
            /* Set Local Storage Data */
            localStorage.setItem("authToken", response.authToken);
            localStorage.setItem("memberType", response.user_info.member_type);
            localStorage.setItem("status", response.user_info.status);
            localStorage.setItem("firstName", response.user_info.first_name);
            localStorage.setItem("lastName", response.user_info.last_name);
            localStorage.setItem("email", response.user_info.email);

            // Redirect on success
            window.location.href = "/welcome-back";
        },
        error: function (xhr, status, error) {
            // Show error message
            alert('Invalid username or password. Please try again.');

            // Reset the form
            form.reset();

            // Reset the button state
            submitButton.text("Sign In");
            submitButton.css("pointer-events", "auto").prop('disabled', false);

            // Focus on the email field
            $("#login-email").focus();
        }
    });
});

});