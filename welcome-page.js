document.addEventListener('DOMContentLoaded', function() {
    // Get the last visited URL from localStorage
    let redirectUrl = localStorage.getItem('lastVisitedUrl');
    
    // Set default URL if none exists
    if (!redirectUrl) {
        redirectUrl = 'https://www.thedailydrip.com/';
    }
    
    // Check if the URL is one of the subscription pages
    const subscriptionPages = [
        'https://www.thedailydrip.com/test',
        'https://www.thedailydrip.com/membership/community-member',
        'https://www.thedailydrip.com/membership/thought-leader'
  
    ];
    
    if (subscriptionPages.includes(redirectUrl)) {
        // Redirect to home page instead
        redirectUrl = 'https://www.thedailydrip.com/';
    }
    
    // First fetch user data, then handle the redirect
    fetchUserData(function() {
        // Start countdown only after user data is refreshed
        startRedirectCountdown(redirectUrl);
    });
  });
  
  // Modified fetchUserData function with callback
  function fetchUserData(callback) {
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
        // Call the callback function when AJAX is complete (whether success or error)
        if (typeof callback === 'function') {
          callback();
        }
      },
      error: function(xhr, status, error) {
        console.error("Error:", error);
        console.log("Continuing with redirect despite error fetching user data");
        // Don't show alert here, as we still want to redirect
      }
    });
  }
  
  // Separate function for countdown and redirect
  function startRedirectCountdown(redirectUrl) {
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
  }