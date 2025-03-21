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
        

    } else { //if logged out
        $('.login-trigger').show(); //show login button
        $('#logout-link').hide(); //hide logout button
        $('#my-account-link').hide(); //hide my account link
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
    }

    // Gated content check

    // Premium Member
    if (localStorage.getItem("authToken") && 
    localStorage.getItem("memberType") !== "Subscriber" && 
    localStorage.getItem("status") !== "canceled")
    {
        $('[data-content="premium-member"]').show();
        $('[data-content="all-members"]').show();
        $('[data-content="free-members-upgrade"]').remove();
        $('[data-content="non-members-upgrade"]').remove();
        $('[data-content="public"]').remove();
        
    } 
  
    // Free Member (Subscriber)
    if (localStorage.getItem("authToken") && 
    localStorage.getItem("memberType") === "Subscriber" && 
    localStorage.getItem("status") !== "canceled")
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