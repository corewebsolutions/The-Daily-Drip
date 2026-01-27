document.addEventListener('DOMContentLoaded', function () {

  const HOME = window.location.origin + '/';

  // Get the last visited URL from localStorage
  let redirectUrl = localStorage.getItem('lastVisitedUrl');

  // Set default URL if none exists
  if (!redirectUrl) {
    redirectUrl = HOME;
  }

  // Extract pathname for partial checks (safe parse)
  let redirectPath = '/';
  let redirectObj;

  try {
    redirectObj = new URL(redirectUrl);
    redirectPath = redirectObj.pathname;
  } catch (e) {
    redirectUrl = HOME;
    redirectObj = new URL(redirectUrl);
    redirectPath = '/';
  }

  // ✅ Block Stripe Checkout return URLs (session_id=cs_live_... or cs_test_...)
  let isStripeReturn = false;
  try {
    const sid = redirectObj.searchParams.get("session_id");
    isStripeReturn =
      (sid && /^cs_(test|live)_/i.test(sid)) ||
      redirectObj.pathname === "/sign-up-confirmation";
  } catch (e) {
    isStripeReturn = true; // malformed URL? treat as unsafe
  }

  // ✅ Blocked pages by PATH (more reliable than full URLs)
  const blockedPaths = [
    '/test',
    '/subscribe',
    '/membership/community-member',
    '/membership/thought-leader',
    '/reset-password',
    '/update-password',
    '/welcome'
  ];

  // Check all conditions
  if (isStripeReturn || blockedPaths.includes(redirectPath)) {
    redirectUrl = HOME;
    localStorage.setItem('lastVisitedUrl', redirectUrl);
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
    success: function (response) {
      /* Set Local Storage Data */
      localStorage.setItem("memberType", response.member_type);
      localStorage.setItem("status", response.status);
      localStorage.setItem("firstName", response.first_name);
      localStorage.setItem("lastName", response.last_name);
      localStorage.setItem("email", response.email);
    },
    complete: function () {
      if (typeof callback === 'function') {
        callback();
      }
    },
    error: function (xhr, status, error) {
      console.error("Error:", error);
      console.log("Continuing with redirect despite error fetching user data");
    }
  });
}


// Separate function for countdown and redirect
function startRedirectCountdown(redirectUrl) {
  let seconds = 3;

  const countdown = setInterval(function () {
    seconds--;

    if (seconds <= 0) {
      clearInterval(countdown);
      window.location.href = redirectUrl;
    }
  }, 1000);
}