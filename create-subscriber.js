document.addEventListener('DOMContentLoaded', function() {
    // Track current slide for back button visibility
    let currentSlide = 1;
    
    // Handle slide navigation
    function updateBackButtonVisibility() {
        const backButton = document.getElementById('go-back');
        if (currentSlide > 1) {
            // Show back button when not on first slide
            backButton.style.opacity = "1";
            backButton.style.pointerEvents = "auto";
        } else {
            // Hide back button on first slide
            backButton.style.opacity = "0";
            backButton.style.pointerEvents = "none";
        }
    }
    
    // Watch for slide changes
    const sliderDots = document.querySelectorAll('.w-slider-dot');
    sliderDots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            currentSlide = index + 1;
            document.getElementById('current-slide').textContent = currentSlide;
            updateBackButtonVisibility();
        });
    });
    
    // Handle next button click (advances slide)
    document.getElementById('next-button').addEventListener('click', function(e) {
        e.preventDefault();
        if (currentSlide < sliderDots.length) {
            currentSlide++;
            document.getElementById('current-slide').textContent = currentSlide;
            sliderDots[currentSlide - 1].click(); // Click the appropriate dot
            updateBackButtonVisibility();
        }
    });
    
    // Handle back button click
    document.getElementById('go-back').addEventListener('click', function() {
        if (currentSlide > 1) {
            currentSlide--;
            document.getElementById('current-slide').textContent = currentSlide;
            sliderDots[currentSlide - 1].click(); // Click the appropriate dot
            updateBackButtonVisibility();
        }
    });
    
    // Handle form submission
    $("#sign-up-form").submit(function(e) {
        e.preventDefault(); // Prevent default form submission
        
        // Show loading state without making button disappear
        const submitButton = $(".submit-button");
        const originalButtonText = submitButton.val() || submitButton.text() || "Join Our Community";
        
        // Keep button visible but show processing state
        submitButton.val("Processing...").text("Processing...");
        submitButton.prop('disabled', true);
        submitButton.css({
            'opacity': '0.8',  // Keep it visible but slightly faded
            'cursor': 'wait'
        });
        
        // Check if non-US option is selected
        const isNonUS = $("#check-for-usa").is(":checked");
        
        // Collect form data
        const formData = {
            first_name: $("#first-name-2").val(),
            last_name: $("#last-name-2").val(),
            company_name: $("#company-name").val(),
            industry: $("#industry").val(),
            self_employed: $("#self-employed").val(),
            years_practicing: $("#years-practicing").val(),
            email: $("#email-3").val(),
            password: $("#password-signup").val(),
            
            // Handle city/state based on US or non-US
            city: isNonUS ? $("#city-global").val() : $("#city").val(),
            state: isNonUS ? $("#country-global").val() : $("#state").val()
        };
        
        
        // Send data to create subscriber API endpoint
        $.ajax({
            url: "https://xxdy-xbul-g3ez.n7d.xano.io/api:RjbKSLFK/create_subscriber",
            type: "POST",
            data: JSON.stringify(formData),
            contentType: "application/json",
            success: function(response) {
                // Store auth token and user info if provided in response
                if (response.authToken) {
                    localStorage.setItem("authToken", response.authToken);
                }
                
                if (response.user_info) {
                    localStorage.setItem("memberType", "Subscriber");
                    localStorage.setItem("status", "active");
                    localStorage.setItem("firstName", response.user_info.first_name || formData.first_name);
                    localStorage.setItem("lastName", response.user_info.last_name || formData.last_name);
                    localStorage.setItem("email", response.user_info.email || formData.email);
                }
                
                // Keep the button visible but change text to "Success!"
                submitButton.val("Success!").text("Success!");
                submitButton.css({
                    'opacity': '1',
                    'background-color': '#4CAF50' // Green for success
                });

                window.location.href = "/sign-up-confirmation";

            },
            error: function(xhr, status, error) {
                // Cancel the redirect timeout
                clearTimeout(redirectTimeout);
                
                // Show error message
                console.error("Error:", error);
                console.error("Response:", xhr.responseText);
                
                // Display error to user
                $("#alert").text("There was an error creating your account. Please try again.").css({
                    "opacity": "1",
                    "pointer-events": "auto"
                });
                
                // Reset button without disappearing
                submitButton.val(originalButtonText).text(originalButtonText);
                submitButton.prop('disabled', false);
                submitButton.css({
                    'opacity': '1',
                    'cursor': 'pointer',
                    'background-color': '' // Reset to default
                });
            }
        });
    });
    
    // Also handle the final "Create Account" button click
    $("input.next-button.fall-back").click(function() {
        $("#sign-up-form").submit();
    });
    
    // Initialize back button visibility
    updateBackButtonVisibility();
});