document.addEventListener('DOMContentLoaded', function() {

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
    $('#resume-payment').off("click");
  
    // Listen for clicks on any element with stripe="account" attribute
    $('#resume-payment').on("click", function() {
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
      
      // Grab the interactive <span> (e.g., with class 'update-account')
      const $span = $visibleAlert.find("span.update-account");
      
      if ($span.length) {
        const buttonText = $span.text().trim();
      
        // Try common link attributes in order of preference
        const hrefValue = $span.attr("href") || $span.attr("data-link") || $span.attr("data-url") || "#";
      
        const $button = $(".sign-up-blog-button-wrapper a");
        $button.text(buttonText);
        $button.attr("href", hrefValue);
      
        // Optional: Copy all span attributes to the button (except ID)
        $.each($span[0].attributes, function (_, attr) {
          if (attr.name !== "id") {
            $button.attr(attr.name, attr.value);
          }
        });
      }
      
      $('[data-content="all-members"]').show();
      $('[data-content="free-members-upgrade"]').show();
      $('[data-content="premium-member"]').remove();
      $('[data-content="public"]').remove();
      $('[data-content="non-members-upgrade"]').remove();

    }

});