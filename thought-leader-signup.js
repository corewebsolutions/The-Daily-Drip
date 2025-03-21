document.addEventListener('DOMContentLoaded', function() {

    var Webflow = Webflow || [];

    Webflow.push(function() {
        
        $(document).off('submit');

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
              email: $("#Email-2").val(),
              password: $("#Password-2").val(),
              
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
              data: JSON.stringify(formData),
              contentType: "application/json",
              success: function(response) {
                  localStorage.setItem('authToken',response.authToken); // create authToken
                  window.location.href = response.checkoutUrl; // Redirect to Stripe Checkout URL from Xano response
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

  

  });