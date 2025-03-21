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
                localStorage.setItem("authToken", response.authToken);
                localStorage.setItem("memberType", response.user_info.member_type);
                localStorage.setItem("status", response.user_info.status);
                localStorage.setItem("firstName", response.user_info.first_name);
                localStorage.setItem("lastName", response.user_info.last_name);
                localStorage.setItem("email", response.user_info.email);  
            },
            error: function(xhr, status, error) {
              console.error("Error:", error);
              alert("There was an error accessing subscription management.");
              // Reset the button that was clicked to its original state
              clickedButton.text(originalText).prop('disabled', false);
            }
         });
}