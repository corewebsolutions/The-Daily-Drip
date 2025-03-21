document.addEventListener('DOMContentLoaded', function() {

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


});