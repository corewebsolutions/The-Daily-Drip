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
        $('#login-trigger').hide(); //hide login button
        $('[data-user="logged-in"]').hide();
        $('#logout-link').show(); //show logout button
        $('#my-account-link').show(); //show my account link
        $('#alert-passwords').hide(); // remove membership update notification
        $('#subscriber-link').hide(); // remove membership update notification
        $('#update-info').show(); //show update 


        const membership = localStorage.getItem("memberType");
        if (membership === "Subscriber") {
            $('#my-account-link').remove();
        }
      

    } else { //if logged out
        $('$login-trigger').show(); //show login button
        $('#logout-link').hide(); //hide logout button
        $('#my-account-link').hide(); //hide my account link
        $('#update-info').remove(); //show update 
        $('[data-user="logged-in"]').show();
    }

    // check user's subscription status
    const alertStatus = localStorage.getItem("status");
       
    // Show the appropriate alert
    if(alertStatus === "past_due") {

        $('#alert-past-due').show();

    } else if(alertStatus === "unpaid") {

        $('#alert-unpaid').show();

    } else if(alertStatus === "canceled") {

        $('#alert-canceled').show();

    } else if (alertStatus === "pending") {

        $('#alert-account-pending').show();
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

    // Premium Member
    if (
        localStorage.getItem("authToken") &&
        localStorage.getItem("memberType") !== "Subscriber" &&
        localStorage.getItem("status") !== "canceled" &&
        localStorage.getItem("status") !== "pending"

    ) {
        $('[data-content="premium-member"]').show();
        $('[data-content="all-members"]').show();
        $('[data-content="free-members-upgrade"]').remove();
        $('[data-content="non-members-upgrade"]').remove();
        $('[data-content="public"]').remove();
    }

    // Premium Member Pending
    if (localStorage.getItem("authToken") && 
    localStorage.getItem("memberType") !== "Subscriber" && 
    localStorage.getItem("status") === "pending")

    {
        $('[data-content="all-members"]').show();
        $('[data-content="premium-member"]').remove();
        $('[data-content="free-members-upgrade"]').show();
        $('[data-content="public"]').remove();
        $('[data-content="non-members-upgrade"]').remove();
    }

 
    // Free Member (Subscriber)
    if (localStorage.getItem("authToken") && 
    localStorage.getItem("memberType") === "Subscriber" || 
    localStorage.getItem("status") === "canceled")

    {
        $('[data-content="all-members"]').show();
        $('[data-content="premium-member"]').remove();
        $('[data-content="free-members-upgrade"]').show();
        $('[data-content="public"]').remove();
        $('[data-content="non-members-upgrade"]').remove();
    } 

    // Public/non-members
    if (!localStorage.getItem("authToken")) {
        // No authToken exists - user is NOT logged in
        $('[data-content="public"]').show();
        $('[data-content="all-members"]').remove();
        $('[data-content="premium-member"]').remove();
        $('[data-content="free-members-upgrade"]').remove();
        $('[data-content="non-members-upgrade"]').show();
    }


});