document.addEventListener('DOMContentLoaded', function() {

    ajaxErrorsWorkflow(); // error handling

    //logout func
    $('#logout-link').click(function(e) {

        e.preventDefault();
        localStorage.removeItem("authToken");
        localStorage.removeItem("memberType");
        localStorage.removeItem("status");
        localStorage.removeItem("firstName");
        localStorage.removeItem("lastName");
        localStorage.removeItem("email");
        window.location.href = "/"
        
    });

    // password-reset alert seen
    $('[password-alert="closed"]').on("click", function() {
      localStorage.setItem("passResetMessage","seen")
    });

    if (localStorage.passResetMessage) {
      $('.email-reset-alert').hide();
    } else {
      setTimeout(function() {
        $('.email-reset-alert').css("display","flex");
      }, 2000); // Delay in milliseconds (2000ms = 2s)
    }


    // login/logout button dynamic bvisibility

    //if logged in...
    if (localStorage.authToken) {
        $('.login-trigger').hide(); //hide login button
        $('#logout-link').show(); //show logout button
        $('#my-account-link').show(); //show my account link
        $('#alert-passwords').hide(); // remove membership update notification
        $('#subscriber-link').hide(); // remove membership update notification
        $('#update-info').show(); //show update 
        $('[data-user="logged-in"]').hide(); // VISIBLE


        const membership = localStorage.getItem("memberType");
        if (membership === "Subscriber") {
            $('#my-account-link').remove();
        }
      

    } else { //if logged out
        $('.login-trigger').show(); //show login button
        $('#logout-link').hide(); //hide logout button
        $('#my-account-link').hide(); //hide my account link
        $('#update-info').remove(); //show update 
    }

    // check user's subscription status
    const alertStatus = localStorage.getItem("status");
       
    // Show the appropriate alert
    if(alertStatus === "past_due") {

        //$('#alert-past-due').show();
        $('[alert="past-due"]').show();

    } else if(alertStatus === "unpaid") {

        //$('#alert-unpaid').show();
        $('[alert="unpaid"]').show()

    } else if(alertStatus === "canceled") {

        //$('#alert-canceled').show();
        $('[alert="canceled"]').show();

    } else if (alertStatus === "pending") {

        //$('#alert-account-pending').show();
        $('[alert="account-pending"]').show();
    }


    // resume payment functionality 
    $('[stripe="resume-payment"]').off("click");
  
    // Listen for clicks on any element with stripe="account" attribute
    $('[stripe="resume-payment"]').on("click", function() {
      // Store reference to the clicked element
      const clickedButton = $(this);
      
      // Show loading state on the clicked element
      const originalText = clickedButton.text();
      clickedButton.text("Loading...").prop('disabled', true);
      
      // Call your Xano endpoint to get a portal session URL
      $.ajax({
        url: "https://xxdy-xbul-g3ez.n7d.xano.io/api:RjbKSLFK/resume_checkout",
        type: "POST",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem('authToken')
        },
        success: function(response) {
          window.location.href = response;
        },
        error: function(xhr, status, error) {
          console.error("Error:", error);
          alert("There was an error accessing subscription management.");
          // Reset the button that was clicked to its original state
          clickedButton.text(originalText).prop('disabled', false);
        }
     });
 
    });
    



    // Gated content check

    const authToken = localStorage.getItem("authToken");
    const memberType = localStorage.getItem("memberType")?.trim();
    const status = localStorage.getItem("status")?.trim();
  
    if (!authToken) {
      // Public/non-members
      $('[data-content="public"]').show();
      $('[data-content="non-members-upgrade"]').show();
      $('[data-content="all-members"]').remove();
      $('[data-content="premium-member"]').remove();
      $('[data-content="free-members-upgrade"]').remove();
  
    } else if (memberType === "Subscriber") {
      // Free Member (Subscriber only)
      $('[data-content="all-members"]').show();
      $('[data-content="free-members-upgrade"]').show();
      $('[data-content="premium-member"]').remove();
      $('[data-content="public"]').remove();
      $('[data-content="non-members-upgrade"]').remove();
  
    } else if (status === "active") {
      // Premium Member (NOT a Subscriber + active status)
      $('[data-content="premium-member"]').show();
      $('[data-content="all-members"]').show();
      $('[data-content="free-members-upgrade"]').remove();
      $('[data-content="non-members-upgrade"]').remove();
      $('[data-content="public"]').remove();
  
    } else {
    // Premium Member Pending (NOT a Subscriber + NOT active)
    const $visibleAlert = $(".alert:visible").clone(true);
    $(".alert-gated-box-text").html($visibleAlert.html()).show();

    // Grab the original span (from visible alert)
    const $span = $(".alert:visible").find("span.update-account");

    if ($span.length) {
    const buttonText = $span.text().trim();
    const hrefValue = $span.attr("href") || $span.attr("data-link") || $span.attr("data-url") || "#";

    const $button = $(".sign-up-blog-button-wrapper a");
    $button.text(buttonText);
    $button.attr("href", "javascript:void(0);");

    const $clonedSpan = $(".alert-gated-box-text span.update-account");

    $.each($span[0].attributes, function (_, attr) {
        const attrName = attr.name;
        if (!["id", "class", "style"].includes(attrName)) {
        $clonedSpan.attr(attrName, attr.value);
        $button.attr(attrName, attr.value);
        }
    });

    // ✅ Add click handling + feedback
    const handleClick = () => {
        $clonedSpan.text("Please Wait...");
        $button.text("Please Wait...");
        $span.trigger("click");
    };

    $clonedSpan.on("click", handleClick);
    $button.on("click", handleClick);
    }
      
      $('[data-content="all-members"]').show();
      $('[data-content="free-members-upgrade"]').show();
      $('[data-content="premium-member"]').remove();
      $('[data-content="public"]').remove();
      $('[data-content="non-members-upgrade"]').remove();

    }

});

function ajaxErrorsWorkflow() {

  /* Global Ajax Errors Handling */
  $(document).ajaxError(function(event, jqXHR, settings, thrownError) {
    // Retrieve the error code and response text
    var errorCode = jqXHR.status;
    var errorMessage = jqXHR.responseText;

    console.log("AJAX Error Detected:");
    console.log("Error Code: " + errorCode);
    console.log("Error Message: " + errorMessage);

    // Try to parse the responseText to JSON if the API response is JSON
    try {
        var responseJson = JSON.parse(jqXHR.responseText);
        errorMessage = responseJson.message || responseJson.error || errorMessage;
    } catch (e) {
        // responseText wasn't JSON, use the raw responseText
    }

    console.log("Parsed Error Message: " + errorMessage);


    // Check if the error is a 401 Unauthorized or 500 with the specific message
    if ((errorCode === 401 && (errorMessage.includes("This token is expired.") || errorMessage.includes("Invalid token"))) || 
        (errorCode === 500 && errorMessage.includes("Unable to locate auth: extras.user_id"))) {
        alert('Session Expired');
        //logout func ----------
        localStorage.removeItem("authToken");
        localStorage.removeItem("memberType");
        localStorage.removeItem("status");
        localStorage.removeItem("firstName");
        localStorage.removeItem("lastName");
        localStorage.removeItem("email");
        window.location.href = "/"
        //-------------------------
      
    } else if (errorMessage.includes("Unable to locate auth: extras.user_id")) {
        alert('Unable to locate auth: extras.user_id');
        //logout func ----------
        localStorage.removeItem("authToken");
        localStorage.removeItem("memberType");
        localStorage.removeItem("status");
        localStorage.removeItem("firstName");
        localStorage.removeItem("lastName");
        localStorage.removeItem("email");
        window.location.href = "/"
        //-------------------------
    } else {
        alert("Error " + errorCode + ": " + errorMessage);
        // Prepare the error data as a single JSON object
        var errorData = JSON.stringify({
          endpoint: settings.url,
          error_code: errorCode,
          error_message: errorMessage,
          user: localStorage.lastName
      });

      // Send the error data to your server
      $.ajax({
          type: "POST",
          url: "https://xxdy-xbul-g3ez.n7d.xano.io/api:7LoWKczE/record_errors",
          contentType: "application/json",
          data: errorData, // Send the stringified JSON object
          success: function(response) {
              console.log("Error logged successfully");
          },
          error: function(response) {
              console.log("Failed to log error");
          }
      });
    }
  });
}