document.addEventListener('DOMContentLoaded', function() {

    // Get the last visited URL from localStorage
  let redirectUrl = localStorage.getItem('lastVisitedUrl');

  // Set default URL if none exists
  if (!redirectUrl) {
    redirectUrl = 'https://www.thedailydrip.com/';
  }

  // Extract pathname for partial checks
  const redirectPath = new URL(redirectUrl).pathname;

  // Exact match pages to block
  const exactBlockedUrls = [
    'https://www.thedailydrip.com/test',
    'https://www.thedailydrip.com/membership/community-member',
    'https://www.thedailydrip.com/membership/thought-leader',
    'https://www.thedailydrip.com/subscribe'
  ];

  // Path-based blocked pages (query params allowed)
  const blockedPaths = [
    '/reset-password',
    '/update-password'
  ];

  // Check both conditions
  if (
    exactBlockedUrls.includes(redirectUrl) ||
    blockedPaths.includes(redirectPath)
  ) {
    redirectUrl = 'https://www.thedailydrip.com/';
  }

  // Now proceed with fetch + redirect
  fetchUserData(function () {
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