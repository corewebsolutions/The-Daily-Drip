document.addEventListener('DOMContentLoaded', function() {

    fetchUserData();

});

function fetchUserData() {
          // Call your Xano endpoint to get a portal session URL
          $.ajax({
            url: "https://xxdy-xbul-g3ez.n7d.xano.io/api:RjbKSLFK/get_user",
            type: "GET",
            headers: {
              "Authorization": "Bearer " + localStorage.getItem('authToken')
            },
            success: function(response) {

                /* Set Local Storage Data */
                localStorage.setItem("memberType", response.member_type);
                localStorage.setItem("status", response.status);
                localStorage.setItem("firstName", response.first_name);
                localStorage.setItem("lastName", response.last_name);
                localStorage.setItem("email", response.email);  
            },
            complete: function(response) {

                // Get the last visited URL from localStorage
                let redirectUrl = localStorage.getItem('lastVisitedUrl');

                // Set default URL if none exists
                if (!redirectUrl) {
                    redirectUrl = 'https://www.thedailydrip.com/';
                }

                // Check if the URL is the subscription page
                if (redirectUrl === 'https://www.thedailydrip.com/subscribe') {
                    // Redirect to home page instead
                    redirectUrl = 'https://www.thedailydrip.com/';
                }

                // Check if the URL is the subscription page
                if (redirectUrl === 'https://www.thedailydrip.com/membership/community-member') {
                    // Redirect to home page instead
                    redirectUrl = 'https://www.thedailydrip.com/';
                }

                // Check if the URL is the subscription page
                if (redirectUrl === 'https://www.thedailydrip.com/membership/thought-leader-legacy') {
                    // Redirect to home page instead
                    redirectUrl = 'https://www.thedailydrip.com/';
                }

                // Check if the URL is the subscription page
                if (redirectUrl === 'https://www.thedailydrip.com/membership/thought-leader') {
                    // Redirect to home page instead
                    redirectUrl = 'https://www.thedailydrip.com/';
                }

                // Display where we're redirecting to (if you have an element to show this)
                // $('#redirect-url').text('Redirecting to: ' + redirectUrl);

                // Set up the countdown
                let seconds = 3;
                const countdown = setInterval(function() {
                    seconds--;
                    
                    // Update countdown display if you have an element for it
                    // $('#timer').text(seconds);
                    
                    if (seconds <= 0) {
                        clearInterval(countdown);
                        // Redirect to the appropriate URL
                        window.location.href = redirectUrl;
                    }
                }, 1000);

            },
            error: function(xhr, status, error) {
              console.error("Error:", error);
              alert("There was an error accessing subscription management.");
              // Reset the button that was clicked to its original state
              clickedButton.text(originalText).prop('disabled', false);
            }
         });
}