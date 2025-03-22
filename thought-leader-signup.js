document.addEventListener('DOMContentLoaded', function() {
  //updated

  if (localStorage.authToken == null) {
    //run code if they are not logged in
    alert("You must be logged in to access this page.");
    window.location.href = "/login";
  } 

  populateForm();


  $("#thought-leader-signup").submit(function(e) {
      e.preventDefault(); // Prevent default form submission
      
      // Show loading state
      const submitButton = $(this).find('input[type="submit"]');
      const originalButtonText = submitButton.val();
      submitButton.val("Processing...").prop('disabled', true);
      
      // Collect form data
      const formData = {
        // User identity fields
        first_name: $("#First-Name-2").val(),
        last_name: $("#Last-Name-2").val(),

        
        // Profile information
        company_name: $("#Company-Name-2").val(),
        industry: $("#Industry-2").val(),
        self_employed: $("#Self-Employed-2").val(),
        years_practicing: $("#Years-Practicing-2").val(),
        city: $("#City-2").val(),
        state: $("#State-2").val(),
        
        // Social profiles
        linkedin: $("#Linkedin-2").val(),
        twitter: $("#Twitter-2").val(),
        instagram: $("#Instagram-2").val(),
        facebook: $("#Facebook-2").val(),
        website: $("#Website-2").val(),
        
        // Personal details
        profile_image: $(".profile-pic-url").val(),
        bio: $("#Bio-2").val(),
        birthday: $("#birthday").val(),
        phone_number: $("#phone-2").val(),
        
        // Address
        street_address: $("#mailing-street-3").val(),
        street_address_2: $("#mailing-street-2").val(),
        mailing_city: $("#mailing-city-2").val(),
        mailing_state: $("#mailing-state-2").val(),
        job_title: $("#job-title-2").val()

      };
      
      // Send data to Xano to create temporary user and start Stripe checkout
      $.ajax({
        url: "https://xxdy-xbul-g3ez.n7d.xano.io/api:RjbKSLFK/create_thought_leader", 
        type: "POST",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem('authToken')
        },
        data: JSON.stringify(formData),
        contentType: "application/json",
        success: function(response) {
            window.location.href = response; // Redirect to Stripe Checkout URL from Xano response
        },
        error: function(xhr, status, error) {
          // Handle error
          console.error("Status:", xhr.status);
          console.error("Error:", error);
          console.error("Response:", xhr.responseText);
          alert("There was an error processing your request. Please try again.");
          submitButton.val(originalButtonText).prop('disabled', false);
        }
      });
    });


});


function populateForm() {


  $.ajax({
    url: "https://xxdy-xbul-g3ez.n7d.xano.io/api:RjbKSLFK/populate_thought_leader_form_signup",
    method: "GET", 
    headers: {
      "Authorization": "Bearer " + localStorage.getItem('authToken')
    },
    success: function (data) {
      // Safely set each field
      $("#First-Name-2").val(data.first_name || '');
      $("#Last-Name-2").val(data.last_name || '');
      $("#Company-Name-2").val(data.company_name || '');
      $("#Industry-2").val(data.industry || '');
      $("#Self-Employed-2").val(data.self_employed || '');
      $("#Years-Practicing-2").val(data.years_practicing || '');
      $("#City-2").val(data.city || '');
      $("#State-2").val(data.state || '');
      $("#job-title-2").val(data.job_title || '');

      $("#Linkedin-2").val(data.linkedin || '');
      $("#Twitter-2").val(data.twitter || '');
      $("#Instagram-2").val(data.instagram || '');
      $("#Facebook-2").val(data.facebook || '');
      $("#Website-2").val(data.website || '');

      $("#Bio-2").val(data.bio || '');
      $("#birthday").val(data.birthday || '');
      $("#phone-2").val(data.phone_number || '');

      $("#mailing-street-3").val(data.street_address || '');
      $("#mailing-street-2").val(data.street_address_2 || '');
      $("#mailing-city-2").val(data.mailing_city || '');
      $("#mailing-state-2").val(data.mailing_state || '');

      $("#field-2").val(data.profile_image || '');
      $(".profile-pic-url").val(data.profile_image || '');
    },
    error: function (xhr, status, error) {
      console.error("Error fetching data:", error);
    }
  });

}